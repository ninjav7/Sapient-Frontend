import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Col } from 'reactstrap';
import { isUserAuthenticated } from '../../helpers/authUtils';
import { FormGroup, Button, Alert, InputGroup } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import Loader from '../../components/Loader';
import Holder from './Holder';
import Typography from '../../sharedComponents/typography';
import './auth.scss';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { faCircleCheck } from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { BaseUrl, UpdateUserPassword } from '../../services/Network';

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
            matchError: false,
            password: '',
            cpassword: '',
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

    handleValidSubmit = async (event, values) => {
        if (values?.password !== values?.cpassword) {
            this.setState({ matchError: true });
            return;
        }
        try {
            this.setState({ isLoading: true });
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${this.props.match.params.token}`,
            };
            await axios
                .post(
                    `${BaseUrl}${UpdateUserPassword}`,
                    {
                        password: values?.password,
                        confirm_password: values?.cpassword,
                    },
                    { headers }
                )
                .then((res) => {
                    let response = res.data;
                    this.setState({
                        isLoading: false,
                        passwordResetSuccessful: true,
                        titleText: 'Success',
                        showReset: true,
                    });
                });
        } catch (error) {
            this.setState({ isLoading: false });
        }
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
                                            {this.state.matchError && (
                                                <Alert color="danger" isOpen={this.state.matchError ? true : false}>
                                                    <div>Password and Confirm Password Not Matched</div>
                                                </Alert>
                                            )}

                                            <AvForm
                                                onValidSubmit={this.handleValidSubmit}
                                                className="authentication-form"
                                                autoComplete="off">
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
                                                            name="cpassword"
                                                            id="cpassword"
                                                            placeholder="Enter your password"
                                                            value={this.state.cpassword}
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
