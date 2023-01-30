import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col } from 'reactstrap';
import Holder from './Holder';
import Loader from '../../components/Loader';
import Typography from '../../sharedComponents/typography';
import axios from 'axios';
import { BaseUrl, updateUsers } from '../../services/Network';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { ReactComponent as CircleCheckSVG } from '../../assets/icon/circle-check.svg';
import { FormGroup, Button, Alert } from 'reactstrap';

const VerifyAccount = (props) => {
    const history = useHistory();
    const [_isMounted, set_isMounted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [titleText, setTitleText] = useState('Success');
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    useEffect(() => {
        set_isMounted(true);
        document.body.classList.add('authentication-bg');
        verifyUser();
        return () => {
            set_isMounted(false);
            document.body.classList.remove('authentication-bg');
        };
    }, []);

    const verifyUser = async () => {
        setIsLoading(true);
        let headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${props.match.params.token}`,
        };
        await axios
            .patch(
                `${BaseUrl}${updateUsers}`,
                {
                    is_verified: true,
                },
                { headers }
            )
            .then((res) => {
                let response = res.data;
                setIsLoading(false);
                setTitleText('Success');
            })
            .catch((error) => {
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
                                <>
                                    <Alert color="success" className="alertPop" isOpen={true}>
                                        <div>
                                            <Typography.Subheader className="alertText">
                                                <CircleCheckSVG
                                                    className="ml-2 mr-2"
                                                    style={{ marginRight: '4px', color: 'green' }}
                                                />
                                                Success - your email has been updated.
                                            </Typography.Subheader>
                                        </div>
                                    </Alert>
                                    <Typography.Subheader size={Typography.Sizes.md} className="text-mute mt-4">
                                        You have successfully updated your email. You may now log in to the Sapient
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
                            </Col>
                        </>
                    }
                />
            )}
        </React.Fragment>
    );
};

export default connect()(VerifyAccount);
