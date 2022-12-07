import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Container, Row, Col, Card, CardBody } from 'reactstrap';
import { isUserAuthenticated } from '../../helpers/authUtils';
import { FormGroup, Button, Alert, InputGroup } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import Loader from '../../components/Loader';
import Holder from './Holder';
import Typography from '../../sharedComponents/typography';
import './auth.css';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { faCircleCheck } from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

class Confirm extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);
        this.state = {
            passwordResetSuccessful: false,
            isLoading: false,
            titleText: 'Set Password',
            showReset: false,
            redirectToLogin: false,
        };
    }

    componentDidMount() {
        this._isMounted = true;
        document.body.classList.add('authentication-bg');
    }

    componentWillUnmount() {
        this._isMounted = false;
        document.body.classList.remove('authentication-bg');
    }

    handleValidSubmit = (event, values) => {
        this.setState({ isLoading: true });

        // You can make actual api call to register here

        window.setTimeout(() => {
            this.setState({ isLoading: false, passwordResetSuccessful: true, titleText: 'Success', showReset: true });
        }, 1000);
    };

    /**
     * Redirect to root
     */
    renderRedirectToRoot = () => {
        const isAuthTokenValid = isUserAuthenticated();
        if (isAuthTokenValid) {
            return <Redirect to="/" />;
        } else if (this.state.redirectToLogin) {
            return <Redirect to="/account/login" />;
        }
    };

    render() {
        const isAuthTokenValid = isUserAuthenticated();
        return (
            <React.Fragment>
                {this.renderRedirectToRoot()}

                {(this._isMounted || !isAuthTokenValid) && (
                    <Holder
                        rightContent={
                            <>
                                {this.state.isLoading && <Loader />}
                                <Col lg={8}>
                                    <div className="logoContainer">
                                        <a href="/">
                                            <LogoSVG className="logoDesign" />
                                        </a>
                                        <Typography.Header size={Typography.Sizes.sm} className="text-muted">
                                            {this.state.titleText}
                                        </Typography.Header>
                                    </div>
                                    {this.state.showReset ? (
                                        <>
                                            <Alert color="success" className="alertPop" isOpen={true}>
                                                <div>
                                                    <Typography.Subheader className="alertText">
                                                        <FontAwesomeIcon
                                                            icon={faCircleCheck}
                                                            size="lg"
                                                            className="ml-2 mr-2"
                                                            style={{ marginRight: '4px', color: 'green' }}
                                                        />
                                                        Password Set
                                                    </Typography.Subheader>
                                                </div>
                                            </Alert>
                                            <Typography.Subheader size={Typography.Sizes.md} className="text-mute mt-4">
                                                You have successfully set your password. You may now log in to the
                                                Sapient Energy Portal.
                                            </Typography.Subheader>

                                            <FormGroup className="form-group mt-5 pt-4 mb-0 text-center">
                                                <Button
                                                    color="primary"
                                                    className="btn-block"
                                                    onClick={async () => {
                                                        this.setState({ redirectToLogin: true });
                                                        await this.renderRedirectToRoot();
                                                    }}>
                                                    Go to Login
                                                </Button>
                                            </FormGroup>
                                        </>
                                    ) : (
                                        <>
                                            {this.props.error && (
                                                <Alert color="danger" isOpen={this.props.error ? true : false}>
                                                    <div>{this.props.error}</div>
                                                </Alert>
                                            )}

                                            <AvForm
                                                onValidSubmit={this.handleValidSubmit}
                                                className="authentication-form">
                                                <AvGroup className="">
                                                    <Typography.Header className="text-mute mb-2">
                                                        New Password
                                                    </Typography.Header>

                                                    <InputGroup>
                                                        <AvInput
                                                            type="password"
                                                            name="password"
                                                            id="password"
                                                            placeholder="Enter your password"
                                                            value={this.state.password}
                                                            required
                                                        />
                                                    </InputGroup>
                                                    <Typography.Subheader className="mt-2 mb-4">
                                                        Use 8 or more characters with a mix of letters, numbers &
                                                        symbols
                                                    </Typography.Subheader>
                                                    <AvFeedback>This field is invalid</AvFeedback>
                                                </AvGroup>
                                                <AvGroup className="">
                                                    <Typography.Header className=" text-mute mb-2">
                                                        Confirm New Password
                                                    </Typography.Header>
                                                    <InputGroup>
                                                        <AvInput
                                                            type="password"
                                                            name="password"
                                                            id="password"
                                                            placeholder="Enter your password"
                                                            value={this.state.password}
                                                            required
                                                        />
                                                    </InputGroup>
                                                    <AvFeedback>This field is invalid</AvFeedback>
                                                </AvGroup>

                                                <FormGroup className="form-group mt-5 pt-4 mb-0 text-center">
                                                    <Button color="primary" className="btn-block">
                                                        Set Password
                                                    </Button>
                                                </FormGroup>
                                            </AvForm>
                                        </>
                                    )}
                                </Col>
                            </>
                        }
                    />
                )}
            </React.Fragment>
        );
    }
}

export default connect()(Confirm);
