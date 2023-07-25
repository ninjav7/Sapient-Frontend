import React, { useState, useEffect } from 'react';

import { Cookies } from 'react-cookie';
import Modal from 'react-bootstrap/Modal';

import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Select from '../../../sharedComponents/form/select';
import Typography from '../../../sharedComponents/typography';

import { UserStore } from '../../../store/UserStore';
import { updateUserPreferences } from './services';
import { compareObjData } from '../../../helpers/helpers';

import { saveUserPreference } from '../../../helpers/saveUserPreference';
import { dateFormatsList, timeFormatsList, untitsList } from './utils.js';

const UserPreferences = (props) => {
    const { isModalOpen, closeModal } = props;

    const cookies = new Cookies();
    const user = cookies.get('user');

    const { dateFormat, timeFormat, unit } = UserStore.useState((s) => ({
        dateFormat: s.dateFormat,
        timeFormat: s.timeFormat,
        unit: s.unit,
    }));

    const [userPrefObj, setUserPrefObj] = useState(null);
    const [previousUserPref, setPreviousUserPref] = useState(null);
    const [isProcessing, setProcessing] = useState(false);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, userPrefObj);
        obj[key] = value;
        setUserPrefObj(obj);
    };

    const restoreDefaultPreferences = () => {
        let obj = Object.assign({}, previousUserPref);
        setUserPrefObj(obj);
        closeModal();
    };

    const handleUserPreferenceSave = async () => {
        if (!user?.user_id || !userPrefObj) return;

        setProcessing(true);
        const params = `?user_id=${user?.user_id}`;

        await updateUserPreferences(params, userPrefObj)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'User Preferences updated successfully.';
                        s.notificationType = 'success';
                    });
                    setUserPrefObj(null);
                    setPreviousUserPref(null);
                    saveUserPreference(userPrefObj?.date_format, userPrefObj?.time_format, userPrefObj?.unit);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message
                            ? response?.message
                            : res
                            ? 'Unable to update User Preferences.'
                            : 'Unable to update User Preferences due to Internal Server Error!.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch(() => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to update User Preferences.';
                    s.notificationType = 'error';
                });
            })
            .finally(() => {
                setProcessing(false);
                closeModal();
            });
    };

    useEffect(() => {
        const obj = {
            date_format: dateFormat ? dateFormat : null,
            time_format: timeFormat ? timeFormat : null,
            unit: unit ? unit : null,
        };
        setUserPrefObj(obj);
        setPreviousUserPref(obj);
    }, [dateFormat, timeFormat, unit]);

    return (
        <Modal show={isModalOpen} onHide={closeModal} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{`User Preferences`}</Typography.Header>

                <Brick sizeInRem={2} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>{`Date Format`}</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        options={dateFormatsList}
                        placeholder="Select Date Format"
                        currentValue={dateFormatsList.filter((option) => option.value === userPrefObj?.date_format)}
                        onChange={(e) => {
                            handleChange('date_format', e.value);
                        }}
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>{`Time Format`}</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        options={timeFormatsList}
                        placeholder="Select Time Format"
                        currentValue={timeFormatsList.filter((option) => option.value === userPrefObj?.time_format)}
                        onChange={(e) => {
                            handleChange('time_format', e.value);
                        }}
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>{`Units`}</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        options={untitsList}
                        placeholder="Select Units"
                        currentValue={untitsList.filter((option) => option.value === userPrefObj?.unit)}
                        onChange={(e) => {
                            handleChange('unit', e.value);
                        }}
                    />
                </div>

                <Brick sizeInRem={2.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={restoreDefaultPreferences}
                    />
                    <Button
                        label={isProcessing ? 'Saving...' : 'Save'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        onClick={handleUserPreferenceSave}
                        disabled={isProcessing || compareObjData(previousUserPref, userPrefObj)}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default UserPreferences;
