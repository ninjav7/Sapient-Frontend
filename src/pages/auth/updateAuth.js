import React, { useState, useEffect } from 'react';
import { Col, FormGroup, Alert, Row } from 'reactstrap';
import Loader from '../../components/Loader';
import Holder from './Holder';
import { connect } from 'react-redux';
import { Cookies } from 'react-cookie';
import Typography from '../../sharedComponents/typography';
import './auth.scss';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { ReactComponent as CircleCheckSVG } from '../../assets/icon/circle-check.svg';
import Button from '../../sharedComponents/button/Button';
import { useHistory } from 'react-router-dom';
import { fetchSessionDetails, updateUser } from './service';
import { googleLoginUser } from '../../redux/actions';
import { UserStore } from '../../store/UserStore';
import { isUserAuthenticated } from '../../helpers/authUtils';

const AuthUpdate = (props) => {
    let history = useHistory();
    const [_isMounted, set_isMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [titleText, setTitleText] = useState('Success');
    const [isAuthTokenValid, setisAuthTokenValid] = useState();
    const loginSuccess = UserStore.useState((s) => s.loginSuccess);

    useEffect(() => {
        set_isMounted(true);
        document.body.classList.add('authentication-bg');

        if (loginSuccess === true) {
            updateUserDetails();
            renderRedirectToRoot();
            setIsLoading(false);
        }

        return () => {
            set_isMounted(false);
            document.body.classList.remove('authentication-bg');
        };
    }, []);

    const fetchSession = async () => {
        setIsLoading(true);
        let sessionId = localStorage.getItem('session-id');

        props.googleLoginUser(sessionId);
    };
    const renderRedirectToRoot = () => {
        const isAuthTknValid = isUserAuthenticated();
        setisAuthTokenValid(isAuthTknValid);
        if (isAuthTknValid) {
            history.push('/');
        }
    };
    const updateUserDetails = async () => {
        let payload = {
            linked_oauth: ['google'],
        };
        await updateUser(payload)
            .then((res) => {
                let response = res.data;
            })
            .catch((error) => {});
    };

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

                                <>
                                    <Alert color="success" className="alertPop" isOpen={true}>
                                        <div>
                                            <Typography.Subheader size={Typography.Sizes.md} className="alertText">
                                                <CircleCheckSVG
                                                    className="ml-2 mr-2"
                                                    style={{ marginRight: '4px', color: 'green' }}
                                                />
                                                Acount Found
                                            </Typography.Subheader>
                                        </div>
                                    </Alert>
                                    <Typography.Subheader size={Typography.Sizes.md} className="text-mute mt-4">
                                        We found an account associated with this email. Would you like to manage the
                                        existing account with Google Authentication?
                                    </Typography.Subheader>
                                    <FormGroup className="form-group mt-5 pt-4 mb-0 text-center">
                                        <Row>
                                            <Col>
                                                <Button
                                                    className="sub-button"
                                                    type={Button.Type.secondaryGrey}
                                                    size={Button.Sizes.md}
                                                    onClick={() => {
                                                        history.push('/account/login');
                                                    }}
                                                    label="No"></Button>
                                            </Col>
                                            <Col>
                                                <Button
                                                    className="sub-button"
                                                    type={Button.Type.primary}
                                                    size={Button.Sizes.md}
                                                    onClick={() => {
                                                        fetchSession();
                                                    }}
                                                    label="Yes"></Button>
                                            </Col>
                                        </Row>
                                    </FormGroup>
                                </>
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

export default connect(mapStateToProps, { googleLoginUser })(AuthUpdate);
