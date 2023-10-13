import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { Col, FormGroup } from 'reactstrap';
import { connect } from 'react-redux';
import { Link, useHistory, useParams, useLocation } from 'react-router-dom';

import { UserStore } from '../../store/UserStore';
import { saveUserPreference } from '../../helpers/saveUserPreference';

import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { ReactComponent as EyeSVG } from '../../assets/icon/eye.svg';
import { ReactComponent as Google } from '../../assets/icon/google.svg';
import { ReactComponent as EyeSlashSVG } from '../../assets/icon/eye-slash.svg';

import Brick from '../../sharedComponents/brick';
import Input from '../../sharedComponents/form/input/Input';
import Typography from '../../sharedComponents/typography';
import InputTooltip from '../../sharedComponents/form/input/InputTooltip';
import Button from '../../sharedComponents/button/Button';
import { Notification } from '../../sharedComponents/notification';

import { validateEmail } from './utils';
import { googleAuth } from './service';
import { loginUser, googleLoginUser } from '../../redux/actions';
import { isUserAuthenticated } from '../../helpers/authUtils';
import { BaseUrl, signinV2 } from '../../services/Network';

import Holder from './Holder';
import Loader from '../../components/Loader';
import './auth.scss';

const Login = (props) => {
    const history = useHistory();
    const location = useLocation();

    const [_isMounted, set_isMounted] = useState(false);
    const [isAuthTokenValid, setisAuthTokenValid] = useState();

    const loginSuccess = UserStore.useState((s) => s.loginSuccess);

    const { user_found, link_type, account_linked, is_active, is_verified, session_id } = useParams();

    const defaultErrorObj = {
        email: null,
        password: null,
    };

    const defaultUserObj = {
        email: '',
        password: '',
    };

    const [userObj, setUserObj] = useState(defaultUserObj);
    const [errorObj, setErrorObj] = useState(defaultErrorObj);

    const [hasError, setErrorMsg] = useState(null);
    const [isProcessing, setProcessing] = useState(false);
    const [passwordType, setPasswordType] = useState('password');

    const togglePasswordVisibility = () => {
        setPasswordType((prevType) => (prevType === 'password' ? 'text' : 'password'));
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, userObj);
        obj[key] = value;
        setErrorObj({ ...errorObj, [key]: null });
        setUserObj(obj);
    };

    const renderRedirectToRoot = () => {
        const isAuthTknValid = isUserAuthenticated();
        setisAuthTokenValid(isAuthTknValid);
        if (isAuthTknValid) {
            history.push('/');
        }
    };

    const handleAdminPortal = async () => {
        UserStore.update((s) => {
            s.error = false;
            s.errorMessage = '';
        });
        await googleAuth()
            .then((res) => {
                const response = res?.data;
                window.open(response?.url, '_self');
            })
            .catch((error) => {});
    };

    const setSession = (userData, pathToPush) => {
        let cookies = new Cookies();

        if (userData) {
            localStorage.setItem('vendorName', userData?.vendor_name);
            saveUserPreference(userData?.date_format, userData?.time_format, userData?.unit);
            cookies.set('user', JSON.stringify(userData), { path: '/' });
            history.push({
                pathname: `${pathToPush}`,
            });
            window.location.reload();
        } else {
            cookies.remove('user', { path: '/' });
        }
    };

    const handleLogin = async () => {
        setProcessing(true);
        setErrorMsg(null);

        const pathToPush = location?.state?.from?.pathname ?? '/';

        let alertObj = Object.assign({}, errorObj);
        if (!validateEmail(userObj?.email)) {
            alertObj.email = `Please enter valid Email address.`;
        }

        if (userObj?.password === '' || userObj?.password.length === 0) {
            alertObj.password = `Password is required. It cannot be empty.`;
        }

        setErrorObj(alertObj);

        if (!alertObj?.email && !alertObj?.password) {
            await axios
                .post(`${BaseUrl}${signinV2}`, userObj)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        if (response?.data) setSession(response?.data, pathToPush);
                    } else {
                        const errorMsg = response?.message ?? `Unable to Login.`;
                        setErrorMsg(errorMsg);
                    }
                })
                .catch((error) => {
                    const response = error?.response?.data;
                    const errorMsg = response?.message ?? `Unable to Login.`;
                    setErrorMsg(errorMsg);
                })
                .finally(() => {
                    setProcessing(false);
                });
        } else {
            setProcessing(false);
        }
    };

    useEffect(() => {
        if (loginSuccess === 'error') {
            UserStore.update((s) => {
                s.error = true;
                s.errorMessage = 'Unable to Login';
            });
        }
    }, [loginSuccess]);

    useEffect(() => {
        set_isMounted(true);
        document.body.classList.add('authentication-bg');
        renderRedirectToRoot();
        if (
            user_found !== undefined &&
            link_type !== undefined &&
            account_linked !== undefined &&
            is_active !== undefined &&
            is_verified !== undefined &&
            loginSuccess !== 'success'
        ) {
            setProcessing(true);
            let usrFound = user_found.split('=');
            if (usrFound[1] === 'true') {
                let verified = is_verified.split('=');
                if (verified[1] === 'true') {
                    let active = is_active.split('=');
                    if (active[1] === 'true') {
                        let accountLinked = account_linked.split('=');
                        if (accountLinked[1] === 'true') {
                            let sessionId = session_id.split('=');
                            props.googleLoginUser(sessionId[1]);
                        } else if (accountLinked[1] === 'false') {
                            let sessionId = session_id.split('=');
                            localStorage.setItem('session-id', sessionId[1]);
                            history.push('/account/update-auth');
                        }
                    } else {
                        setProcessing(false);
                        UserStore.update((s) => {
                            s.error = true;
                            s.errorMessage = 'Unable to Login';
                        });
                        history.push('/account/login');
                    }
                } else {
                    setProcessing(false);
                    UserStore.update((s) => {
                        s.error = true;
                        s.errorMessage = 'Unable to Login';
                    });
                    history.push('/account/login');
                }
            } else if (usrFound[1] === 'false') {
                setProcessing(false);
                UserStore.update((s) => {
                    s.error = true;
                    s.errorMessage = 'Unable to Login';
                });
                history.push('/account/login');
            }
        } else if (user_found !== undefined) {
            let usrFound = user_found.split('=');
            if (usrFound[1] === 'false') {
                setProcessing(false);
                UserStore.update((s) => {
                    s.error = true;
                    s.errorMessage = 'Unable to Login';
                });
                history.push('/account/login');
            }
        }
        return () => {
            set_isMounted(false);
            document.body.classList.remove('authentication-bg');
        };
    }, []);

    return (
        <React.Fragment>
            {(_isMounted || !isAuthTokenValid) && (
                <Holder
                    rightContent={
                        <>
                            {props.loading || isProcessing ? <Loader /> : null}

                            <Col lg={8}>
                                <div className="logoContainer">
                                    <Link to="/">
                                        <LogoSVG className="logoDesign" />
                                    </Link>
                                    <Typography.Header size={Typography.Sizes.sm} className="text-muted">
                                        {`Sign In`}
                                    </Typography.Header>
                                </div>

                                {hasError && (
                                    <>
                                        <Notification
                                            type={Notification.Types.error}
                                            component={Notification.ComponentTypes.alert}
                                            title={hasError}
                                            isShownCloseBtn={false}
                                        />

                                        <Brick sizeInRem={2} />
                                    </>
                                )}

                                <form className="authentication-form">
                                    <FormGroup>
                                        <Typography.Subheader size={Typography.Sizes.md} className="text-mute">
                                            {`Email`}
                                        </Typography.Subheader>

                                        <Brick sizeInRem={0.25} />

                                        <InputTooltip
                                            placeholder="hello@Sapient.industries"
                                            labelSize={Typography.Sizes.md}
                                            value={userObj?.email}
                                            onChange={(e) => {
                                                handleChange('email', e.target.value);
                                            }}
                                            error={errorObj?.email}
                                        />
                                    </FormGroup>

                                    <Brick sizeInRem={2} />

                                    <FormGroup>
                                        <Typography.Subheader size={Typography.Sizes.md} className="text-mute">
                                            {`Password`}
                                        </Typography.Subheader>

                                        <Brick sizeInRem={0.25} />

                                        <Input
                                            placeholder="Enter your password"
                                            labelSize={Typography.Sizes.md}
                                            type={passwordType}
                                            value={userObj?.password}
                                            onChange={(e) => {
                                                handleChange('password', e.target.value);
                                            }}
                                            error={errorObj?.password}
                                            elementEnd={
                                                passwordType === 'password' ? (
                                                    <EyeSVG onClick={togglePasswordVisibility} />
                                                ) : (
                                                    <EyeSlashSVG onClick={togglePasswordVisibility} />
                                                )
                                            }
                                        />
                                    </FormGroup>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <FormGroup>
                                            <Link
                                                to="/account/forget-password"
                                                className="float-right text-primary font-weight-bold">
                                                Forgot Password?
                                            </Link>
                                        </FormGroup>

                                        <FormGroup>
                                            <Button
                                                className="sub-button"
                                                type={Button.Type.primary}
                                                size={Button.Sizes.md}
                                                onClick={handleLogin}
                                                label={`Sign In`}></Button>
                                        </FormGroup>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <FormGroup>
                                            <Typography.Header size={Typography.Sizes.md} className="text-mute or-text">
                                                {`Or`}
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
                                                onClick={handleAdminPortal}
                                                label={`Sign In with Google`}
                                            />
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

export default connect(mapStateToProps, { loginUser, googleLoginUser })(Login);
