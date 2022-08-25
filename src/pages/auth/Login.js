import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';

import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Label,
    FormGroup,
    Button,
    Alert,
    InputGroup,
    InputGroupAddon,
} from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { Mail, Lock } from 'react-feather';

import { loginUser } from '../../redux/actions';
import { isUserAuthenticated } from '../../helpers/authUtils';
import Loader from '../../components/Loader';
// import logo from '../../assets/images/logo.png';
import { BaseUrl, login } from '../../services/Network';
import './auth.css';
import { ReactComponent as LogoSVG } from '../../assets/icon/logo.svg';

class Login extends Component {
    _isMounted = false;

    constructor(props) {
        super(props);

        this.handleValidSubmit = this.handleValidSubmit.bind(this);
        this.state = {
            username: '',
            password: '',
            error: false,
            message: '',
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
     * Handles the submit
     */
    handleValidSubmit = (event, values) => {
        // console.log(this.props.history);
        this.props.loginUser(values.username.trim(), values.password.trim(), this.props.history);
        if (values.username === '' || values.password === '') {
        }
    };

    /**
     * Redirect to root
     */
    renderRedirectToRoot = () => {
        const isAuthTokenValid = isUserAuthenticated();
        if (isAuthTokenValid) {
            return <Redirect to="/" />;
        }
    };

    render() {
        let error = false;
        let message = '';
        const isAuthTokenValid = isUserAuthenticated();
        if (localStorage.getItem('login_success') === 'false') {
            error = true;
            message = localStorage.getItem('failed_message');
            localStorage.removeItem('login_success');
            localStorage.removeItem('failed_message');
        }
        return (
            <React.Fragment>
                {this.renderRedirectToRoot()}

                {(this._isMounted || !isAuthTokenValid) && (
                    <div
                        style={{
                            height: '100%',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            paddingTop: '100px',
                        }}>
                        <div style={{ height: '100%', width: '100%' }}>
                            <div style={{ width: '100%', height: '630px', display: 'flex', justifyContent: 'center' }}>
                                <div
                                    style={{
                                        width: '32%',
                                        height: '100%',
                                        backgroundColor: 'white',
                                        boxShadow: '0px 3px 14px -1px rgba(0,0,0,0.75)',
                                        borderRadius: '10px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                    <div style={{ width: '70%' }}>
                                        {/* preloader */}
                                        {this.props.loading && <Loader />}

                                        <div
                                            style={{
                                                width: '100%',
                                                height: '90%',
                                                display: 'flex',
                                                justifyContent: 'center',
                                                marginBottom: '50px',
                                                // alignItems: 'center',
                                            }}>
                                            <a href="/">
                                                {/* <img src={logo} alt="" height="24" /> */}
                                                <LogoSVG />
                                                {/* <h3 className="d-inline align-middle ml-1 text-logo">Sapient</h3> */}
                                            </a>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'center' }}>
                                            <h6>Please sign in below</h6>
                                        </div>

                                        {this.props.error && (
                                            <Alert color="danger" isOpen={this.props.error ? true : false}>
                                                <div>{this.props.error}</div>
                                            </Alert>
                                        )}
                                        {error && (
                                            <Alert color="danger" isOpen={error ? true : false}>
                                                <div>{message}</div>
                                            </Alert>
                                        )}
                                        <AvForm
                                            onValidSubmit={this.handleValidSubmit}
                                            className="authentication-form"
                                            autoComplete="off">
                                            <AvGroup className="">
                                                <Label for="username">Email</Label>
                                                <InputGroup>
                                                    <AvInput
                                                        type="text"
                                                        name="username"
                                                        id="username"
                                                        placeholder="hello@Sapient.com"
                                                        value={this.state.username}
                                                        required
                                                    />
                                                </InputGroup>

                                                <AvFeedback>This field is invalid</AvFeedback>
                                            </AvGroup>

                                            <AvGroup className="mb-3">
                                                <Label for="password">Password</Label>

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
                                                <Link
                                                    to="/account/forget-password"
                                                    className="float-right  ml-1 text-primary font-weight-bold"
                                                    style={{ marginTop: '30px' }}>
                                                    Forgot Password?
                                                </Link>
                                            </AvGroup>

                                            <div
                                                style={{
                                                    width: '100%',
                                                    marginTop: '80px',
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                }}>
                                                <FormGroup>
                                                    <Button style={{ width: '100px' }} color="primary">
                                                        Sign In
                                                    </Button>
                                                </FormGroup>
                                            </div>

                                            <Row className="">
                                                <Col className="col-12 text-center">
                                                    <p className="text-muted">
                                                        Don't have an account?{' '}
                                                        <Link
                                                            to="/account/register"
                                                            className="text-primary font-weight-bold ml-1">
                                                            Request Account
                                                        </Link>
                                                    </p>
                                                </Col>
                                            </Row>
                                        </AvForm>
                                    </div>
                                </div>
                            </div>
                            {/* <p>
                                <strong>Username:</strong> sapient@sapient.industries &nbsp;&nbsp; <br />{' '}
                                <strong>Password:</strong> Test@123
                            </p> */}
                        </div>
                    </div>
                )}
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    const { user, loading, error } = state.Auth;
    return { user, loading, error };
};

export default connect(mapStateToProps, { loginUser })(Login);
