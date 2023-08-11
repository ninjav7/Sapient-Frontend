import React, { useState, useEffect } from 'react';

import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col, FormGroup, Button } from 'reactstrap';

import Holder from './Holder';
import Loader from '../../components/Loader';
import Brick from '../../sharedComponents/brick';
import Typography from '../../sharedComponents/typography';
import { Notification } from '../../sharedComponents/notification';
import InputTooltip from '../../sharedComponents/form/input/InputTooltip';

import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';

import { forgotPassword } from './service';

import colorPalette from '../../assets/scss/_colors.scss';
import './auth.scss';

const PageLogo = (props) => {
    const { showInvite, titleText } = props;

    return (
        <div className="logoContainer">
            <a href="/">
                <LogoSVG className="logoDesign" />
            </a>
            <Typography.Header size={Typography.Sizes.sm} className="text-muted">
                {showInvite ? titleText : `Reset Password`}
            </Typography.Header>
        </div>
    );
};

const OnPasswordReset = (props) => {
    const { inviteStatus, setRedirectToLogin } = props;

    return (
        <>
            <Notification
                type={inviteStatus?.isInvited ? Notification.Types.success : Notification.Types.error}
                component={Notification.ComponentTypes.alert}
                title={inviteStatus?.message}
                isShownCloseBtn={false}
            />

            <Brick sizeInRem={2} />

            <Typography.Subheader size={Typography.Sizes.md} className="text-mute">
                {`If a login is associated with your email, an email will be sent with instructions on how to reset your
                password.`}
            </Typography.Subheader>

            <Brick sizeInRem={1} />

            <Typography.Subheader size={Typography.Sizes.md} className="text-mute">
                {`It may take a few minutes for the email to be delivered.`}
            </Typography.Subheader>

            <Brick sizeInRem={2} />

            <FormGroup className="form-group text-center">
                <Button
                    color="primary"
                    className="btn-block"
                    onClick={async () => {
                        setRedirectToLogin(true);
                    }}>
                    {`Go to Login`}
                </Button>
            </FormGroup>
        </>
    );
};

const ForgetPassword = () => {
    const history = useHistory();
    const [_isMounted, set_isMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [inviteStatus, setInviteStatus] = useState({});
    const [showInvite, setShowInvite] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);
    const [emailId, setEmailId] = useState('');
    const [emailError, setEmailError] = useState(null);

    const handleValidSubmit = async () => {
        let isEmailValid = true;

        if (emailId.length === 0 || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,11})+$/.test(emailId)) {
            isEmailValid = false;
            setEmailError(`Please enter valid Email address.`);
        }

        if (!isEmailValid) return;

        setIsLoading(true);
        await forgotPassword({
            email: emailId,
        })
            .then((res) => {
                const response = res?.data;

                if (response?.success) {
                    setInviteStatus({
                        isInvited: response?.success,
                        message: response?.message,
                    });
                } else {
                    setInviteStatus({
                        isInvited: response?.success,
                        message: response?.message,
                    });
                }

                if (res?.status === 422) {
                    setInviteStatus({
                        isInvited: false,
                        message: `Unable to reset password. Please try again or contact Administrator for assistance.`,
                    });
                }

                setShowInvite(true);
                setIsLoading(false);
            })
            .catch((error) => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (redirectToLogin) history.push('/account/login');
    }, [redirectToLogin]);

    useEffect(() => {
        set_isMounted(true);
        document.body.classList.add('authentication-bg');

        return () => {
            set_isMounted(false);
            document.body.classList.remove('authentication-bg');
        };
    }, []);

    return (
        <React.Fragment>
            {_isMounted && (
                <Holder
                    rightContent={
                        <>
                            {isLoading && <Loader />}
                            <Col lg={8}>
                                <PageLogo
                                    showInvite={showInvite}
                                    titleText={inviteStatus?.isInvited ? `Success` : `Failed`}
                                />

                                {showInvite ? (
                                    <OnPasswordReset
                                        inviteStatus={inviteStatus}
                                        setRedirectToLogin={setRedirectToLogin}
                                    />
                                ) : (
                                    <>
                                        <Typography.Subheader size={Typography.Sizes.md} className="text-mute">
                                            {`Please enter the email associated with your account.`}
                                        </Typography.Subheader>

                                        <Brick sizeInRem={0.5} />

                                        <Typography.Subheader size={Typography.Sizes.md} className="text-mute">
                                            {`Instructions on resetting your password will be sent to the email.`}
                                        </Typography.Subheader>

                                        <Brick sizeInRem={2} />

                                        <form className="authentication-form">
                                            <Typography.Subheader size={Typography.Sizes.md} className="text-mute">
                                                {`Email`}
                                                <span
                                                    style={{ color: colorPalette.error600 }}
                                                    className="font-weight-bold ml-1">
                                                    *
                                                </span>
                                            </Typography.Subheader>

                                            <Brick sizeInRem={0.25} />

                                            <InputTooltip
                                                placeholder="hello@Sapient.industries"
                                                labelSize={Typography.Sizes.md}
                                                value={emailId}
                                                onChange={(e) => {
                                                    setEmailError(null);
                                                    setEmailId(e.target.value.trim());
                                                }}
                                                error={emailError}
                                            />

                                            <Brick sizeInRem={emailError ? 1.25 : 1.75} />

                                            <Button className="sub-button" color="primary" onClick={handleValidSubmit}>
                                                {isLoading ? `Resetting Password ...` : `Reset Password`}
                                            </Button>
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
