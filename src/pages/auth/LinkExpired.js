import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col } from 'reactstrap';
import Holder from './Holder';
import Typography from '../../sharedComponents/typography';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { FormGroup, Button } from 'reactstrap';
import { ReactComponent as Exclamation } from '../../assets/icon/circleExclamation.svg';

const LinkExpired = (props) => {
    const history = useHistory();
    const [_isMounted, set_isMounted] = useState(false);
    const [redirectToLogin, setRedirectToLogin] = useState(false);

    useEffect(() => {
        set_isMounted(true);
        document.body.classList.add('authentication-bg');

        return () => {
            set_isMounted(false);
            document.body.classList.remove('authentication-bg');
        };
    }, []);

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
                            <Col lg={8}>
                                <div className="logoContainer">
                                    <a href="/">
                                        <LogoSVG className="logoDesign" />
                                    </a>
                                    <Typography.Header size={Typography.Sizes.sm} className="text-muted">
                                        Expired Link
                                    </Typography.Header>
                                </div>
                                <>
                                    <div className="errorBlock">
                                        <Typography.Subheader size={Typography.Sizes.md} className="errorText">
                                            <Exclamation /> &nbsp;&nbsp; Link Expired
                                        </Typography.Subheader>
                                    </div>

                                    <Typography.Subheader size={Typography.Sizes.md} className="text-mute mt-4">
                                        The link that led you here is expired. Please contact your Portfolio
                                        Administrator to have a new one sent.
                                    </Typography.Subheader>

                                    <FormGroup className="form-group mt-5 pt-4 mb-0 text-center">
                                        <Button
                                            color="primary"
                                            className="btn-block"
                                            onClick={async () => {
                                                setRedirectToLogin(true);
                                            }}>
                                            Return to Login
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

export default connect()(LinkExpired);
