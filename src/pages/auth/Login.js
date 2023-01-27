import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Link, useHistory, useParams } from 'react-router-dom';
import { Col, FormGroup, Alert } from 'reactstrap';
import { loginUser } from '../../redux/actions';
import { Cookies } from 'react-cookie';
import { isUserAuthenticated } from '../../helpers/authUtils';
import Loader from '../../components/Loader';
import './auth.scss';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { ReactComponent as EyeSVG } from '../../assets/icon/eye.svg';
import { ReactComponent as EyeSlashSVG } from '../../assets/icon/eye-slash.svg';
import { ReactComponent as Google } from '../../assets/icon/google.svg';
import Typography from '../../sharedComponents/typography';
import Holder from './Holder';
import Input from '../../sharedComponents/form/input/Input';
import InputTooltip from '../../sharedComponents/form/input/InputTooltip';
import { UserStore } from '../../store/UserStore';
import Button from '../../sharedComponents/button/Button';
import { googleAuth, fetchSessionDetails } from './service';

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
    const [refresh, setRefresh] = useState(false);
    let { user_found, link_type, account_linked, session_id } = useParams();

    const setSession = (user) => {
        let cookies = new Cookies();
        if (user) {
            localStorage.setItem('vendorName', user?.vendor_name);
            localStorage.setItem('vendorId', user?.vendor_id);
            cookies.set('user', JSON.stringify(user), { path: '/' });
        } else cookies.remove('user', { path: '/' });
    };

    useEffect(() => {
        if (
            user_found !== undefined &&
            link_type !== undefined &&
            account_linked !== undefined &&
            session_id !== undefined
        ) {
            setRefresh(true);
            let usrFound = user_found.split('=');
            if (usrFound[1] === 'true') {
                let accountLinked = account_linked.split('=');
                if (accountLinked[1] === 'true') {
                    let sessionId = session_id.split('=');
                    fetchSession(sessionId[1]);
                } else if (accountLinked[1] === 'false') {
                    let sessionId = session_id.split('=');
                    localStorage.setItem('session-id', sessionId[1]);
                    history.push('/account/update-auth');
                }
            } else if (usrFound[1] === 'false') {
                setRefresh(false);
                setError(true);
                setMessage('Unable to Login');
            }
        } else if (user_found !== undefined) {
            let usrFound = user_found.split('=');
            if (usrFound[1] === 'false') {
                setRefresh(false);
                setError(true);
                setMessage('Unable to Login');
            }
        }
    }, []);

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

    const fetchSession = async (sessionId) => {
        let params = `?session_id=${sessionId}`;
        await fetchSessionDetails(params)
            .then((res) => {
                let response = res.data;
                setRefresh(false);
                setSession(response.data);
                history.push('/');
                window.location.reload();
            })
            .catch((error) => {
                setRefresh(false);
            });
    };
    const renderRedirectToRoot = () => {
        const isAuthTknValid = isUserAuthenticated();
        setisAuthTokenValid(isAuthTknValid);
        if (isAuthTknValid) {
            history.push('/');
        }
    };

    const handleAdminPortal = async () => {
        await googleAuth()
            .then((res) => {
                let response = res.data;
                window.open(response?.url, '_self');
            })
            .catch((error) => {});
    };
    return (
        <React.Fragment>
            {(_isMounted || !isAuthTokenValid) && (
                <Holder
                    rightContent={
                        <>
                            {props.loading || refresh ? <Loader /> : null}

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

                                    <FormGroup className="mb-4 pt-5">
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
                                    </FormGroup>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <FormGroup>
                                            <Link
                                                to="/account/forget-password"
                                                className="float-right  ml-1 text-primary font-weight-bold"
                                                style={{}}>
                                                Forgot Password?
                                            </Link>
                                        </FormGroup>

                                        <FormGroup>
                                            <Button
                                                className="sub-button"
                                                type={Button.Type.primary}
                                                size={Button.Sizes.md}
                                                onClick={handleValidSubmit}
                                                label="Sign In"></Button>
                                        </FormGroup>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <FormGroup>
                                            <Typography.Header size={Typography.Sizes.md} className="text-mute or-text">
                                                Or
                                            </Typography.Header>
                                        </FormGroup>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <FormGroup>
                                            <Button
                                                className="sub-button"
                                                type={Button.Type.secondaryGrey}
                                                icon={<Google />}
                                                size={Button.Sizes.md}
                                                onClick={() => {
                                                    handleAdminPortal();
                                                }}
                                                label="Sign In with Google"></Button>
                                        </FormGroup>
                                    </div>
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
