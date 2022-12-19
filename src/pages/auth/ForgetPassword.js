import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, FormGroup, Button, Alert } from 'reactstrap';
import Loader from '../../components/Loader';
import Holder from './Holder';
import Typography from '../../sharedComponents/typography';
import './auth.scss';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { faCircleCheck } from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import InputTooltip from '../../sharedComponents/form/input/InputTooltip';
import { forgotPassword } from './service';

const ForgetPassword = () => {
    const history = useHistory();
    const [_isMounted, set_isMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [titleText, setTitleText] = useState('Reset Password');
    const [showReset, setShowReset] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [username, setUsername] = useState('');
    const [error, setError] = useState(false);

    useEffect(() => {
        set_isMounted(true);
        document.body.classList.add('authentication-bg');

        return () => {
            set_isMounted(false);
            document.body.classList.remove('authentication-bg');
        };
    }, []);

    const handleValidSubmit = async () => {
        setIsLoading(true);
        await forgotPassword({
            email: username,
        })
            .then((res) => {
                console.log(res);
                let response = res.data;
                setIsLoading(false);
                setTitleText('Success');
                setShowReset(true);
            })
            .catch((error) => {
                console.log('error', error);
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (redirectToLogin) {
            history.push('/account/login');
        }
    }, [redirectToLogin]);

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
                                                <Typography.Subheader size={Typography.Sizes.md} className="alertText">
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
                                                    setRedirectToLogin(true);
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

                                        {error && (
                                            <Alert color="danger" isOpen={error ? true : false}>
                                                <div>{this.props.error}</div>
                                            </Alert>
                                        )}

                                        <form className="authentication-form">
                                            <FormGroup>
                                                <Typography.Subheader
                                                    size={Typography.Sizes.md}
                                                    className="text-mute mb-1">
                                                    Email
                                                </Typography.Subheader>

                                                <InputTooltip
                                                    placeholder="hello@Sapient.industries"
                                                    onChange={(e) => {
                                                        setUsername(e.target.value.trim());
                                                    }}
                                                    labelSize={Typography.Sizes.md}
                                                    value={username}
                                                />
                                            </FormGroup>

                                            <FormGroup>
                                                <Button
                                                    className="sub-button"
                                                    color="primary"
                                                    onClick={handleValidSubmit}>
                                                    Reset Password
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

export default connect()(ForgetPassword);
