import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';

import Brick from '../../../sharedComponents/brick';
import Select from '../../../sharedComponents/form/select';
import Typography from '../../../sharedComponents/typography';

import { ReactComponent as BanSVG } from '../../../assets/icon/ban.svg';
import { ReactComponent as UserProfileSVG } from '../../../assets/icon/user-profile.svg';
import { ReactComponent as EmailAddressSVG } from '../../../sharedComponents/assets/icons/email-address-icon.svg';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';
import { fetchMemberUserList } from '../../settings/users/service';

const NotificationMethod = (props) => {
    const { alertObj = {}, handleNotificationChange } = props;

    const notificationMethodTitle = alertObj?.notification?.method.includes('none')
        ? `Notification Method (optional)`
        : `User`;

    const [usersList, setUsersList] = useState([]);

    const fetchUsersList = async () => {
        setUsersList([]);

        await fetchMemberUserList()
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (response?.data?.data.length > 0) {
                        const data = response?.data?.data;
                        const newMappedData = data.map((el) => ({
                            label: el?.name,
                            value: el?._id,
                            email: el?.email,
                        }));
                        setUsersList(newMappedData);
                    }
                }
            })
            .catch((e) => {})
            .finally(() => {});
    };

    useEffect(() => {
        if (alertObj?.notification?.method.includes('user')) {
            fetchUsersList();
        }
    }, [alertObj?.notification?.method]);

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
                                {notificationMethodTitle}
                            </Typography.Subheader>
                        </CardHeader>
                        <CardBody>
                            <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                                <div
                                    className={`d-flex align-items-center mouse-pointer ${
                                        alertObj?.notification?.method.includes('none')
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

                            {!alertObj?.notification?.method.includes('none') && <hr className="mt-4 mb-3" />}

                            {alertObj?.notification?.method.includes('user') && (
                                <>
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}>{`Choose User`}</Typography.Subheader>

                                    <Brick sizeInRem={1.25} />

                                    <div style={{ width: '30%' }}>
                                        <Select
                                            id="user_select"
                                            name="select"
                                            options={usersList}
                                            placeholder="Choose User"
                                            currentValue={usersList.filter(
                                                (option) => option.value === alertObj?.notification?.selectedUserId
                                            )}
                                            onChange={(e) => {
                                                handleNotificationChange('selectedUserId', e.value);
                                            }}
                                            menuPlacement="auto"
                                        />
                                    </div>

                                    <Brick sizeInRem={1.5} />

                                    <Typography.Subheader size={Typography.Sizes.md}>
                                        {`Recurrence`}
                                    </Typography.Subheader>
                                </>
                            )}
                        </CardBody>
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default NotificationMethod;
