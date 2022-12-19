import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Col, FormGroup, Button, Alert, InputGroup } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { isUserAuthenticated } from '../../helpers/authUtils';
import axios from 'axios';
import { BaseUrl, forgotUserPassword } from '../../services/Network';
import Loader from '../../components/Loader';
import Holder from './Holder';
import Typography from '../../sharedComponents/typography';
import './auth.scss';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { faCircleCheck } from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
class ForgetPassword extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.handleValidSubmit = this.handleValidSubmit.bind(this);
        this.onDismiss = this.onDismiss.bind(this);
        this.state = {
            passwordResetSuccessful: false,
            isLoading: false,
            titleText: 'Reset Password',
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

    /**
     * On error dismiss
     */
    onDismiss() {
        this.setState({ passwordResetSuccessful: false });
    }

    /**
     * Handles the submit
     */
    // handleValidSubmit = (event, values) => {
    //     this.setState({ isLoading: true });

    handleValidSubmit = async (event, values) => {
        try {
            this.setState({ isLoading: true });
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
            };
            await axios
                .post(
                    `${BaseUrl}${forgotUserPassword}`,
                    {
                        email: values?.email,
                    },
                    { headers }
                )
                .then((res) => {
                    let response = res.data;
                    this.setState({
                        isLoading: false,
                        titleText: 'Success',
                        showReset: true,
                    });
                });
        } catch (error) {
            this.setState({ isLoading: false });
        }
    };

    // You can make actual api call to register here

    //     window.setTimeout(() => {
    //         this.setState({ isLoading: false, passwordResetSuccessful: true, titleText: 'Success', showReset: true });
    //     }, 1000);
    // };

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
                                                    <Typography.Subheader
                                                        size={Typography.Sizes.md}
                                                        className="alertText">
                                                        <FontAwesomeIcon
                                                            icon={faCircleCheck}
                                                            size="lg"
                                                            className="ml-2 mr-2"
                                                            style={{ marginRight: '4px', color: 'green' }}
                                                        />
                                                        Request Sent
                                                    </Typography.Subheader>
                                                </div>
                                            </Alert>
                                            <Typography.Subheader size={Typography.Sizes.md} className="text-mute mt-4">
                                                If a login is associated with your email, an email will be sent with
                                                instructions on how to reset your password.
                                            </Typography.Subheader>
                                            <Typography.Subheader
                                                size={Typography.Sizes.md}
                                                className="text-mute mt-4 mb-5">
                                                It may take a few minutes for the email to be delivered.
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
                                            <Typography.Subheader size={Typography.Sizes.md} className="text-mute">
                                                Please enter the email associated with your account.
                                            </Typography.Subheader>
                                            <Typography.Subheader
                                                size={Typography.Sizes.md}
                                                className="text-mute mt-4 mb-5">
                                                Instructions on resetting your password will be sent to the email
                                            </Typography.Subheader>

                                            {this.props.error && (
                                                <Alert color="danger" isOpen={this.props.error ? true : false}>
                                                    <div>{this.props.error}</div>
                                                </Alert>
                                            )}

                                            <AvForm
                                                onValidSubmit={this.handleValidSubmit}
                                                className="authentication-form"
                                                autoComplete="off">
                                                <AvGroup className="">
                                                    <Typography.Subheader
                                                        size={Typography.Sizes.md}
                                                        className="text-mute mb-1">
                                                        Email
                                                    </Typography.Subheader>
                                                    <InputGroup>
                                                        <AvInput
                                                            type="text"
                                                            name="email"
                                                            id="email"
                                                            placeholder="hello@Sapient.industries"
                                                            value={this.state.email}
                                                            required
                                                        />
                                                    </InputGroup>

                                                    <AvFeedback>This field is invalid</AvFeedback>
                                                </AvGroup>

                                                <FormGroup className="form-group mt-5 pt-4 mb-0 text-center">
                                                    <Button color="primary" className="btn-block">
                                                        Reset Password
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

export default connect()(ForgetPassword);
