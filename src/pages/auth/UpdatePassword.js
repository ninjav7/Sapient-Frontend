import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { FormGroup, Button, Alert } from 'reactstrap';
import Loader from '../../components/Loader';
import Holder from './Holder';
import Typography from '../../sharedComponents/typography';
import { ReactComponent as EyeSVG } from '../../assets/icon/eye.svg';
import { ReactComponent as EyeSlashSVG } from '../../assets/icon/eye-slash.svg';
import { ReactComponent as Check } from '../../assets/icon/circle-check.svg';
import { ReactComponent as CheckXmark } from '../../assets/icon/circle-xmark.svg';
import { ReactComponent as CheckMinusMark } from '../../assets/icon/circle-minusmark.svg';
import './auth.scss';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { faCircleCheck } from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import { BaseUrl, UpdateUserPassword } from '../../services/Network';
import Input from '../../sharedComponents/form/input/Input';

const Confirm = (props) => {
    const history = useHistory();
    const [_isMounted, set_isMounted] = useState(false);
    const [passwordResetSuccessful, setPasswordResetSuccessful] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [titleText, setTitleText] = useState('Set Password');
    const [showReset, setShowReset] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [matchError, setMatchError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [cpasswordError, setCPasswordError] = useState(false);
    const [password, setPassword] = useState('');
    const [cpassword, setCPassword] = useState('');
    const [passwordType, setPasswordType] = useState('password');
    const [cPasswordType, setCPasswordType] = useState('password');
    const [charErr, setCharErr] = useState('');
    const [lowerCaseErr, setLowerCaseErr] = useState('');
    const [upperCaseErr, setUpperCaseErr] = useState('');
    const [specialCharErr, setSpecialCharErr] = useState('');
    const [numberErr, setNumberErr] = useState('');
    const [matchErr, setMatchErr] = useState('');

    useEffect(() => {
        set_isMounted(true);
        document.body.classList.add('authentication-bg');

        return () => {
            set_isMounted(false);
            document.body.classList.remove('authentication-bg');
        };
    }, []);

    const handleValidSubmit = async () => {
        let ct = 0;
        if (password === '') {
            setPasswordError(true);
            ct++;
        }
        if (cpassword === '') {
            setCPasswordError(true);
            ct++;
        }
        if (ct === 0) {
            if (password !== cpassword) {
                setMatchError(true);
                return;
            }
            try {
                setIsLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${props.match.params.token}`,
                };
                await axios
                    .post(
                        `${BaseUrl}${UpdateUserPassword}`,
                        {
                            password: password,
                            confirm_password: cpassword,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res.data;
                        setIsLoading(false);
                        setPasswordResetSuccessful(true);
                        setTitleText('Success');
                        setShowReset(true);
                    });
            } catch (error) {
                setIsLoading(false);
            }
        } else {
            return;
        }
    };

    useEffect(() => {
        if (redirectToLogin) {
            history.push('/account/login');
        }
    }, [redirectToLogin]);

    useEffect(() => {
        if (password.length >= 2) {
            if (password.length >= 8) {
                setCharErr('success');
            } else {
                setCharErr('error');
            }
            if (password.match(/[A-Z]/)) {
                setUpperCaseErr('success');
            } else {
                setUpperCaseErr('error');
            }
            if (password.match(/[a-z]/)) {
                setLowerCaseErr('success');
            } else {
                setLowerCaseErr('error');
            }
            if (password.match(/[\d`~!@#$%\^&*()+=|;:'",.<>\/?\\\-]/)) {
                setSpecialCharErr('success');
            } else {
                setSpecialCharErr('error');
            }
            if (password.match(/[0-9]/)) {
                setNumberErr('success');
            } else {
                setNumberErr('error');
            }
        } else if (password.length === 0) {
            setSpecialCharErr('');
            setNumberErr('');
            setCharErr('');
            setUpperCaseErr('');
            setLowerCaseErr('');
        }
    }, [password]);

    useEffect(() => {
        if (cpassword.length >= 8) {
            if (cpassword === password) {
                setMatchErr('success');
            } else {
                setMatchErr('error');
            }
        }
    }, [cpassword]);

    return (
        <React.Fragment>
            {_isMounted && (
                <Holder
                    rightContent={
                        <>
                            {isLoading && <Loader />}
                            <Col lg={8}>
                                <div className="logoContainer">
                                    <a href="/">
                                        <LogoSVG className="logoDesign" />
                                    </a>
                                    <Typography.Header size={Typography.Sizes.sm} className="text-muted">
                                        {titleText}
                                    </Typography.Header>
                                </div>
                                {showReset ? (
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
                                            You have successfully set your password. You may now log in to the Sapient
                                            Energy Portal.
                                        </Typography.Subheader>

                                        <FormGroup className="form-group mt-5 pt-4 mb-0 text-center">
                                            <Button
                                                color="primary"
                                                className="btn-block"
                                                onClick={async () => {
                                                    setRedirectToLogin(true);
                                                }}>
                                                Go to Login
                                            </Button>
                                        </FormGroup>
                                    </>
                                ) : (
                                    <>
                                        {matchError && (
                                            <Alert color="danger" isOpen={matchError ? true : false}>
                                                <div>Password Not Matched</div>
                                                <div>Password should be at least 8 letters long.</div>
                                                <div>At least 1 Upper Case, 1 Lower Case Letter & 1 digit.</div>
                                                <div>
                                                    At least 1 Punctuation from [~\\!@#\\$%\\^&\\*\\(\\)_\\+{}
                                                    \":;'\\[\\]].
                                                </div>
                                            </Alert>
                                        )}

                                        <form className="authentication-form">
                                            <FormGroup className="mb-3 pt-2">
                                                <Typography.Subheader
                                                    size={Typography.Sizes.md}
                                                    className="text-mute mb-1">
                                                    Password
                                                </Typography.Subheader>

                                                <Input
                                                    placeholder="Enter your password"
                                                    type={passwordType}
                                                    error={passwordError ? 'Password is Required' : null}
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
                                            <div className="columnField ml-3">
                                                <div className="rowField">
                                                    <div className="mr-2">
                                                        {charErr == '' ? (
                                                            <CheckMinusMark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : charErr === 'success' ? (
                                                            <Check
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : (
                                                            <CheckXmark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        {charErr === 'error' ? (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute-error mt-2">
                                                                Error: 8 or more characters
                                                            </Typography.Subheader>
                                                        ) : (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute mt-2">
                                                                8 or more characters
                                                            </Typography.Subheader>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="rowField">
                                                    <div className="mr-2">
                                                        {upperCaseErr == '' ? (
                                                            <CheckMinusMark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : upperCaseErr === 'success' ? (
                                                            <Check
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : (
                                                            <CheckXmark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        {upperCaseErr === 'error' ? (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute-error mt-2">
                                                                Error: Upper case letter (1 or more)
                                                            </Typography.Subheader>
                                                        ) : (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute mt-2">
                                                                Upper case letter (1 or more)
                                                            </Typography.Subheader>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="rowField">
                                                    <div className="mr-2">
                                                        {lowerCaseErr == '' ? (
                                                            <CheckMinusMark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : lowerCaseErr === 'success' ? (
                                                            <Check
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : (
                                                            <CheckXmark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        {lowerCaseErr === 'error' ? (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute-error mt-2">
                                                                Error: Lower case letter (1 or more)
                                                            </Typography.Subheader>
                                                        ) : (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute mt-2">
                                                                Lower case letter (1 or more)
                                                            </Typography.Subheader>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="rowField">
                                                    <div className="mr-2">
                                                        {specialCharErr == '' ? (
                                                            <CheckMinusMark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : specialCharErr === 'success' ? (
                                                            <Check
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : (
                                                            <CheckXmark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        {specialCharErr === 'error' ? (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute-error mt-2">
                                                                Error: Special Character (1 or more)
                                                            </Typography.Subheader>
                                                        ) : (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute mt-2">
                                                                Special Character (1 or more)
                                                            </Typography.Subheader>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="rowField">
                                                    <div className="mr-2">
                                                        {numberErr == '' ? (
                                                            <CheckMinusMark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : numberErr === 'success' ? (
                                                            <Check
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : (
                                                            <CheckXmark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        {numberErr === 'error' ? (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute-error mt-2">
                                                                Error: Number (1 or more)
                                                            </Typography.Subheader>
                                                        ) : (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute mt-2">
                                                                Number (1 or more)
                                                            </Typography.Subheader>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <FormGroup className="mb-3 pt-5">
                                                <Typography.Subheader
                                                    size={Typography.Sizes.md}
                                                    className="text-mute mb-1">
                                                    Confirm Password
                                                </Typography.Subheader>

                                                <Input
                                                    placeholder="Enter your password"
                                                    type={cPasswordType}
                                                    error={cpasswordError ? 'Confirm Password is Required' : null}
                                                    elementEnd={
                                                        cPasswordType === 'password' ? (
                                                            <EyeSVG
                                                                onClick={() => {
                                                                    setCPasswordType('text');
                                                                }}
                                                            />
                                                        ) : (
                                                            <EyeSlashSVG
                                                                onClick={() => {
                                                                    setCPasswordType('password');
                                                                }}
                                                            />
                                                        )
                                                    }
                                                    onChange={(e) => {
                                                        setCPassword(e.target.value.trim());
                                                    }}
                                                    labelSize={Typography.Sizes.md}
                                                    value={cpassword}
                                                />
                                            </FormGroup>
                                            <div className="columnField ml-3">
                                                <div className="rowField">
                                                    <div className="mr-2">
                                                        {matchErr == '' ? (
                                                            <CheckMinusMark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : matchErr === 'success' ? (
                                                            <Check
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        ) : (
                                                            <CheckXmark
                                                                className="mt-2"
                                                                style={{ height: '1.2rem', width: '1.2rem' }}
                                                            />
                                                        )}
                                                    </div>
                                                    <div>
                                                        {matchErr === 'error' ? (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute-error mt-2">
                                                                Error: Password must match
                                                            </Typography.Subheader>
                                                        ) : (
                                                            <Typography.Subheader
                                                                size={Typography.Sizes.md}
                                                                className="text-mute mt-2">
                                                                Password must match
                                                            </Typography.Subheader>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <FormGroup className="mb-3 pt-5">
                                                <Button
                                                    className="sub-button"
                                                    color="primary"
                                                    onClick={handleValidSubmit}>
                                                    Set Password
                                                </Button>
                                            </FormGroup>
                                        </form>
                                    </>
                                )}
                            </Col>
                        </>
                    }
                />
            )}
        </React.Fragment>
    );
};

export default connect()(Confirm);
