import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { Col, FormGroup, Alert, Button, InputGroup } from 'reactstrap';
import { AvForm, AvGroup, AvInput, AvFeedback } from 'availity-reactstrap-validation';
import { loginUser } from '../../redux/actions';
import { isUserAuthenticated } from '../../helpers/authUtils';
import Loader from '../../components/Loader';
import './auth.scss';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import {} from '../../assets/images/login/building-1.jpg';
import Typography from '../../sharedComponents/typography';
import Holder from './Holder';
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
                    <Holder
                        rightContent={
                            <>
                                {this.props.loading && <Loader />}

                                <Col lg={8}>
                                    <div className="logoContainer">
                                        <a href="/">
                                            <LogoSVG className="logoDesign" />
                                        </a>
                                        <Typography.Header size={Typography.Sizes.sm} className="text-muted">
                                            Sign in
                                        </Typography.Header>
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
                                            <Typography.Subheader size={Typography.Sizes.md} className="text-mute mb-1">
                                                Email
                                            </Typography.Subheader>
                                            <InputGroup>
                                                <AvInput
                                                    type="text"
                                                    name="username"
                                                    id="username"
                                                    placeholder="hello@Sapient.industries"
                                                    value={this.state.username}
                                                    required
                                                />
                                            </InputGroup>

                                            <AvFeedback>This field is invalid</AvFeedback>
                                        </AvGroup>

                                        <AvGroup className="mb-3 pt-5">
                                            <Typography.Subheader size={Typography.Sizes.md} className="text-mute mb-1">
                                                Password
                                            </Typography.Subheader>

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
                                                style={{ marginTop: '1.875rem' }}>
                                                Forgot Password?
                                            </Link>
                                        </AvGroup>

                                        <FormGroup>
                                            <Button className="subButton" color="primary">
                                                Sign In
                                            </Button>
                                        </FormGroup>
                                    </AvForm>
                                </Col>
                            </>
                        }
                    />
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
