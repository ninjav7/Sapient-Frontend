import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Col } from 'reactstrap';
import Holder from './Holder';
import Typography from '../../sharedComponents/typography';
import { ReactComponent as LogoSVG } from '../../assets/icon/Logo1.svg';
import { FormGroup, Button } from 'reactstrap';
import { ReactComponent as Exclamation } from '../../assets/icon/circleExclamation.svg';
import { Notification } from '../../sharedComponents/notification';
import Brick from '../../sharedComponents/brick';

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
        if (redirectToLogin) history.push('/account/login');
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
                                        {`Expired Link`}
                                    </Typography.Header>
                                </div>
                                <>
                                    <Notification
                                        type={Notification.Types.error}
                                        component={Notification.ComponentTypes.alert}
                                        title={`Link Expired`}
                                        isShownCloseBtn={false}
                                    />

                                    <Brick sizeInRem={2} />

                                    <Typography.Subheader size={Typography.Sizes.md} className="text-mute">
                                        {`The link that re-directed you this page has expired. Please contact your Portfolio
                                        Administrator to request a fresh link.`}
                                    </Typography.Subheader>

                                    <Brick sizeInRem={2} />

                                    <Button
                                        color="primary"
                                        className="btn-block"
                                        onClick={async () => {
                                            setRedirectToLogin(true);
                                        }}>
                                        {`Return to Login`}
                                    </Button>
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
