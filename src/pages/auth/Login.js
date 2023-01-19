import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory } from 'react-router-dom';
import { Col, FormGroup, Alert, Button } from 'reactstrap';
import { loginUser } from '../../redux/actions';
import { isUserAuthenticated } from '../../helpers/authUtils';
import Loader from '../../components/Loader';
import './auth.scss';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { ReactComponent as EyeSVG } from '../../assets/icon/eye.svg';
import { ReactComponent as EyeSlashSVG } from '../../assets/icon/eye-slash.svg';
import Typography from '../../sharedComponents/typography';
import Holder from './Holder';
import Input from '../../sharedComponents/form/input/Input';
import InputTooltip from '../../sharedComponents/form/input/InputTooltip';
import { UserStore } from '../../store/UserStore';

const Login = (props) => {
    const history = useHistory();
    const [_isMounted, set_isMounted] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(false);
    const [message, setMessage] = useState('');
    const [isAuthTokenValid, setisAuthTokenValid] = useState();
    const loginSuccess = UserStore.useState((s) => s.loginSuccess);
    const failedMessage = UserStore.useState((s) => s.message);
    const [passwordType, setPasswordType] = useState('password');
    const [passwordError, setPasswordError] = useState(false);
    const [emailError, setEmailError] = useState(false);

    useEffect(() => {
        set_isMounted(true);
        document.body.classList.add('authentication-bg');

        renderRedirectToRoot();
        return () => {
            set_isMounted(false);
            document.body.classList.remove('authentication-bg');
        };
    }, []);
    useEffect(() => {
        if (loginSuccess === false) {
            setError(true);
            setMessage(failedMessage);
        }
    }, [loginSuccess, message]);

    const handleValidSubmit = async () => {
        let ct = 0;
        if (username === '') {
            setEmailError(true);
            ct++;
        }
        if (password === '') {
            setPasswordError(true);
            ct++;
        }
        if (ct === 0) {
            props.loginUser(username.trim(), password.trim(), props.history);
        } else {
            return;
        }
    };

    const renderRedirectToRoot = () => {
        const isAuthTknValid = isUserAuthenticated();
        setisAuthTokenValid(isAuthTknValid);
        if (isAuthTknValid) {
            history.push('/');
        }
    };

    const handleAdminPortal=async()=>{
        await localStorage.setItem("isSuperUser",true); 
        await history.push('/admin/accounts')
        window.location.reload();
    }
    return (
        <React.Fragment>
            {(_isMounted || !isAuthTokenValid) && (
                <Holder
                    rightContent={
                        <>
                            {props.loading && <Loader />}

                            <Col lg={8}>
                                <div className="logoContainer">
                                    <a href="/">
                                        <LogoSVG className="logoDesign" />
                                    </a>
                                    <Typography.Header size={Typography.Sizes.sm} className="text-muted">
                                        Sign in
                                    </Typography.Header>
                                </div>

                                {props.error && (
                                    <Alert color="danger" isOpen={props.error ? true : false}>
                                        <div>{props.error}</div>
                                    </Alert>
                                )}
                                {error && (
                                    <Alert color="danger" isOpen={error ? true : false}>
                                        <div>{message}</div>
                                    </Alert>
                                )}

                                <form className="authentication-form">
                                    <FormGroup>
                                        <Typography.Subheader size={Typography.Sizes.md} className="text-mute mb-1">
                                            Email
                                        </Typography.Subheader>

                                        <InputTooltip
                                            placeholder="hello@Sapient.industries"
                                            error={emailError ? 'Please Enter a Valid Email' : null}
                                            onChange={(e) => {
                                                setUsername(e.target.value.trim());
                                            }}
                                            labelSize={Typography.Sizes.md}
                                            value={username}
                                        />
                                    </FormGroup>

                                    <FormGroup className="mb-3 pt-5">
                                        <Typography.Subheader size={Typography.Sizes.md} className="text-mute mb-1">
                                            Password
                                        </Typography.Subheader>

                                        <Input
                                            placeholder="Enter your password"
                                            error={passwordError ? 'Password is required' : null}
                                            type={passwordType}
                                            elementEnd={
                                                passwordType === 'password' ? (
                                                    <EyeSVG
                                                        onClick={() => {
                                                            setPasswordType('text');
                                                        }}
                                                    />
                                                ) : (
                                                    <EyeSlashSVG
                                                        onClick={() => {
                                                            setPasswordType('password');
                                                        }}
                                                    />
                                                )
                                            }
                                            onChange={(e) => {
                                                setPassword(e.target.value.trim());
                                            }}
                                            labelSize={Typography.Sizes.md}
                                            value={password}
                                        />
                                        <Link
                                            to="/account/forget-password"
                                            className="float-right  ml-1 text-primary font-weight-bold"
                                            style={{ marginTop: '1.875rem' }}>
                                            Forgot Password?
                                        </Link>
                                    </FormGroup>

                                    <FormGroup>
                                        <Button className="sub-button" color="primary" onClick={handleValidSubmit}>
                                            Sign In
                                        </Button>
                                    </FormGroup>
                                    <FormGroup>
                                        <Button className="sub-button" color="primary" onClick={()=>{handleAdminPortal()}}>
                                            Admin Portal
                                        </Button>
                                    </FormGroup>
                                </form>
                            </Col>
                        </>
                    }
                />
            )}
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    const { user, loading, error } = state.Auth;
    return { user, loading, error };
};

export default connect(mapStateToProps, { loginUser })(Login);
