import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';

import Brick from '../../../sharedComponents/brick';
import Select from '../../../sharedComponents/form/select';
import Typography from '../../../sharedComponents/typography';
import Inputs from '../../../sharedComponents/form/input/Input';
import Radio from '../../../sharedComponents/form/radio/Radio';
import { Checkbox } from '../../../sharedComponents/form/checkbox';
import { Button } from '../../../sharedComponents/button';

import { ReactComponent as BanSVG } from '../../../assets/icon/ban.svg';
import { ReactComponent as MinutesSVG } from '../../../assets/icon/minutes.svg';
import { ReactComponent as UserProfileSVG } from '../../../assets/icon/user-profile.svg';
import { ReactComponent as EmailAddressSVG } from '../../../sharedComponents/assets/icons/email-address-icon.svg';

import { fetchMemberUserList } from '../../settings/users/service';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const NotificationMethod = (props) => {
    const { alertObj = {}, handleNotificationChange } = props;

    const [usersList, setUsersList] = useState([]);

    const notificationMethodTitle = alertObj?.notification?.method.includes('none')
        ? `Notification Method (optional)`
        : `User`;

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

    const handleAddNotification = (alert_obj) => {};

    useEffect(() => {
        if (alertObj?.notification?.method.includes('user')) fetchUsersList();
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
                            {alertObj?.target?.submitted ? (
                                <></>
                            ) : (
                                // <div className="d-flex justify-content-between align-items-center">
                                //     <div>
                                //         <Typography.Subheader
                                //             size={Typography.Sizes.md}>{`Building`}</Typography.Subheader>
                                //         <Brick sizeInRem={0.25} />
                                //         <Typography.Body size={Typography.Sizes.md} className="text-muted">
                                //             {renderTargetedBuildingsList(alertObj, originalBuildingsList)}
                                //         </Typography.Body>
                                //     </div>
                                //     <div>
                                //         <PenSVG
                                //             className="mouse-pointer"
                                //             width={17}
                                //             height={17}
                                //             onClick={() => {
                                //                 handleTargetChange('submitted', !alertObj?.target?.submitted);
                                //             }}
                                //         />
                                //     </div>
                                // </div>
                                <>
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

                                    {!alertObj?.notification?.method.includes('none') && (
                                        <>
                                            <hr className="mt-4 mb-3" />

                                            <Typography.Subheader size={Typography.Sizes.md}>
                                                {alertObj?.notification?.method.includes('user') && `Choose User`}
                                                {alertObj?.notification?.method.includes('email') &&
                                                    `Enter Email Address`}
                                            </Typography.Subheader>

                                            <Brick sizeInRem={1.25} />

                                            {alertObj?.notification?.method.includes('user') && (
                                                <div style={{ width: '30%' }}>
                                                    <Select.Multi
                                                        id="user_select"
                                                        name="select"
                                                        options={usersList}
                                                        placeholder="Choose User"
                                                        onChange={(selectedUsersList) => {
                                                            handleNotificationChange(
                                                                'selectedUserId',
                                                                selectedUsersList
                                                            );
                                                        }}
                                                        value={alertObj?.notification?.selectedUserId ?? []}
                                                        menuPlacement="auto"
                                                    />
                                                </div>
                                            )}

                                            {alertObj?.notification?.method.includes('email') && (
                                                <div style={{ width: '50%' }}>
                                                    <Inputs
                                                        type="text"
                                                        className="w-75"
                                                        placeholder="Enter email address"
                                                        onChange={(e) => {
                                                            handleNotificationChange(
                                                                'selectedUserEmailId',
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={alertObj?.notification?.selectedUserEmailId}
                                                    />
                                                    <Brick sizeInRem={0.25} />
                                                    <Typography.Body size={Typography.Sizes.sm}>
                                                        {`Add one or more email addresses, separated by a comma.`}
                                                    </Typography.Body>
                                                </div>
                                            )}

                                            <Brick sizeInRem={1.5} />

                                            <Typography.Subheader
                                                size={Typography.Sizes.md}>{`Recurrence`}</Typography.Subheader>

                                            <Brick sizeInRem={1} />

                                            <div className="d-flex align-items-center" style={{ gap: '1.25rem' }}>
                                                <Radio
                                                    name="send-immediately"
                                                    label="Send immediately"
                                                    checked={alertObj?.notification?.sendImmediate}
                                                    onClick={() => {
                                                        handleNotificationChange('sendImmediate', true);
                                                    }}
                                                />

                                                <Radio
                                                    name="send-with-conditions"
                                                    label="Send if conditions lasts at least"
                                                    checked={!alertObj?.notification?.sendImmediate}
                                                    onClick={() => {
                                                        handleNotificationChange('sendImmediate', false);
                                                    }}
                                                />

                                                <div style={{ width: '40%' }}>
                                                    <Inputs
                                                        type="number"
                                                        className="w-25"
                                                        inputClassName="custom-input-field"
                                                        value={alertObj?.condition?.sendAt}
                                                        onChange={(e) => {
                                                            handleNotificationChange('sendAt', e.target.value);
                                                        }}
                                                        elementEnd={<MinutesSVG />}
                                                        disabled={alertObj?.notification?.sendImmediate}
                                                    />
                                                </div>
                                            </div>

                                            <Brick sizeInRem={1} />

                                            <div className="d-flex justify-content-between align-items-center">
                                                <div
                                                    className="d-flex align-items-center w-100"
                                                    style={{ gap: '1.25rem' }}>
                                                    <Checkbox
                                                        label="Resend alert after"
                                                        type="checkbox"
                                                        id="resend-alert"
                                                        name="resend-alert"
                                                        size="md"
                                                        checked={alertObj?.notification?.resendAlert}
                                                        value={alertObj?.notification?.resendAlert}
                                                        onClick={(e) => {
                                                            handleNotificationChange(
                                                                'resendAlert',
                                                                e.target.value === 'false' ? true : false
                                                            );
                                                        }}
                                                    />
                                                    <div style={{ width: '40%' }}>
                                                        <Inputs
                                                            type="number"
                                                            className="w-50"
                                                            inputClassName="custom-input-field"
                                                            value={alertObj?.notification?.resentAt}
                                                            onChange={(e) => {
                                                                handleNotificationChange('resentAt', e.target.value);
                                                            }}
                                                            elementEnd={<MinutesSVG />}
                                                            disabled={!alertObj?.notification?.resendAlert}
                                                        />
                                                    </div>
                                                </div>
                                                <div
                                                    className="d-flex justify-content-end align-items-center w-100"
                                                    style={{
                                                        gap: '0.5rem',
                                                    }}>
                                                    <Button
                                                        label={'Cancel'}
                                                        size={Button.Sizes.md}
                                                        type={Button.Type.secondaryGrey}
                                                        onClick={() => handleNotificationChange('method', ['none'])}
                                                    />
                                                    <Button
                                                        label={'Add Notification'}
                                                        size={Button.Sizes.md}
                                                        type={Button.Type.primary}
                                                        onClick={() => {
                                                            handleAddNotification(alertObj);
                                                            // handleNotificationChange(
                                                            //     'submitted',
                                                            //     !alertObj?.notification?.submitted
                                                            // );
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
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
