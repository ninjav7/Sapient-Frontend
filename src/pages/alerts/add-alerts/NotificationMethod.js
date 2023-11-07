import React from 'react';
import _ from 'lodash';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';

import Brick from '../../../sharedComponents/brick';
import Typography from '../../../sharedComponents/typography';

import { ReactComponent as BanSVG } from '../../../assets/icon/ban.svg';
import { ReactComponent as UserProfileSVG } from '../../../assets/icon/user-profile.svg';
import { ReactComponent as EmailAddressSVG } from '../../../sharedComponents/assets/icons/email-address-icon.svg';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const NotificationMethod = (props) => {
    const { alertObj = {}, handleNotificationChange } = props;

    return (
        <>
            <Row>
                <Col lg={9}>
                    <Typography.Header
                        size={Typography.Sizes.xs}>{`Add Notification Method (optional)`}</Typography.Header>
                    <Brick sizeInRem={0.25} />
                    <Typography.Body size={Typography.Sizes.md}>
                        {`These are all notification methods available given your selected target and condition.`}
                    </Typography.Body>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={9}>
                    <div className="custom-card">
                        <CardHeader>
                            <Typography.Subheader
                                size={Typography.Sizes.md}
                                style={{ color: colorPalette.primaryGray550 }}>
                                {`Notification Method (optional)`}
                            </Typography.Subheader>
                        </CardHeader>
                        <CardBody>
                            <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                                <div
                                    className={`d-flex align-items-center mouse-pointer ${
                                        alertObj?.notification?.method.includes('none') ||
                                        alertObj?.notification?.method.length === 0
                                            ? `notify-container-active`
                                            : `notify-container`
                                    }`}
                                    onClick={() => handleNotificationChange('method', ['none'])}>
                                    <BanSVG className="p-0 square" width={20} height={20} />
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        style={{ color: colorPalette.primaryGray700 }}>
                                        {`None`}
                                    </Typography.Subheader>
                                </div>

                                <div
                                    className={`d-flex align-items-center mouse-pointer ${
                                        alertObj?.notification?.method.includes('user')
                                            ? `notify-container-active`
                                            : `notify-container`
                                    }`}
                                    onClick={() => handleNotificationChange('method', ['user'])}>
                                    <UserProfileSVG className="p-0 square" width={18} height={18} />
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        style={{ color: colorPalette.primaryGray700 }}>
                                        {`User`}
                                    </Typography.Subheader>
                                </div>

                                <div
                                    className={`d-flex align-items-center mouse-pointer ${
                                        alertObj?.notification?.method.includes('email')
                                            ? `notify-container-active`
                                            : `notify-container`
                                    }`}
                                    onClick={() => handleNotificationChange('method', ['email'])}>
                                    <EmailAddressSVG className="p-0 square" width={20} height={20} />
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        style={{ color: colorPalette.primaryGray700 }}>
                                        {`Email Address`}
                                    </Typography.Subheader>
                                </div>
                            </div>
                        </CardBody>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default NotificationMethod;
