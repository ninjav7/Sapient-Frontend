import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Select from '../../../sharedComponents/form/select';
import { UserStore } from '../../../store/UserStore';
import colorPalette from '../../../assets/scss/_colors.scss';
import { inviteMemberUsers, updateVendorPermissions } from './service';

const AddUser = ({ addUserModal, handleAddModalClose, getUsersList }) => {
    const defaultUserObj = {
        first_name: '',
        last_name: '',
        email: '',
        role: '',
    };

    const defaultErrorObj = {
        first_name: null,
        last_name: null,
        email: null,
        role: null,
    };

    const [userObj, setUserObj] = useState(defaultUserObj);
    const [errorObj, setErrorObj] = useState(defaultErrorObj);

    const [isProcessing, setIsProcessing] = useState(false);
    const [rolesList, setRolesList] = useState([]);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, userObj);
        obj[key] = value;
        setUserObj(obj);
    };

    const saveUserData = async () => {
        let userData = Object.assign({}, userObj);
        userData.first_name = userObj?.first_name.trim();
        userData.last_name = userObj?.last_name.trim();
        userData.email = userObj?.email.trim();

        let alertObj = Object.assign({}, errorObj);

        if ((userData?.first_name).length === 0) alertObj.first_name = 'First Name cannot be blank.';
        if ((userData?.last_name).length === 0) alertObj.last_name = 'Last Name cannot be blank.';
        if ((userData?.email).length === 0 || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,11})+$/.test(userData?.email))
            alertObj.email = 'Please enter valid Email address.';
        if ((userData?.role).length === 0) alertObj.role = { text: 'Please select Role.' };

        setErrorObj(alertObj);

        if (!alertObj.first_name && !alertObj.last_name && !alertObj.email && !alertObj.role) {
            setIsProcessing(true);

            const params = '?request_type=invite';

            await inviteMemberUsers(params, userData)
                .then((res) => {
                    if (!res) {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = 'Unable to create User due to Internal Server Error!.';
                            s.notificationType = 'error';
                        });
                        return;
                    }
                    const response = res?.data;

                    if (response?.success) {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = 'Invite has been sent';
                            s.notificationType = 'success';
                        });
                        getUsersList();
                        handleAddModalClose();
                        setUserObj(defaultUserObj);
                        setErrorObj(defaultErrorObj);
                    } else {
                        if (response?.message.includes('email already exist')) {
                            setErrorObj({ ...errorObj, email: 'Email already exists in system' });
                            setIsProcessing(false);
                            return;
                        }
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = 'User Already Exist';
                            s.notificationType = 'error';
                        });
                    }
                    setIsProcessing(false);
                })
                .catch((error) => {
                    setIsProcessing(false);
                    setErrorObj(defaultErrorObj);
                });
        }
    };

    const fetchRoles = async () => {
        await updateVendorPermissions({}, '')
            .then((res) => {
                const response = res?.data?.data;
                const userRoles = [];
                response.forEach((el) => {
                    userRoles.push({
                        label: el?.name,
                        value: el?.id,
                    });
                });
                setRolesList(userRoles);
            })
            .catch((error) => {
                setRolesList([]);
            });
    };

    useEffect(() => {
        if (addUserModal) fetchRoles();
    }, [addUserModal]);

    return (
        <Modal show={addUserModal} onHide={handleAddModalClose} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Add User</Typography.Header>

                <Brick sizeInRem={2} />

                <div className="d-flex space-between">
                    <div className="w-100 mr-2">
                        <Typography.Body size={Typography.Sizes.md}>
                            First Name
                            <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                                *
                            </span>
                        </Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <InputTooltip
                            placeholder="Enter First Name"
                            onChange={(e) => {
                                handleChange('first_name', e.target.value.trim());
                                setErrorObj({ ...errorObj, first_name: null });
                            }}
                            labelSize={Typography.Sizes.md}
                            error={errorObj.first_name}
                        />
                    </div>
                    <div className="w-100 ml-2">
                        <Typography.Body size={Typography.Sizes.md}>
                            Last Name
                            <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                                *
                            </span>
                        </Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <InputTooltip
                            placeholder="Enter Last Name"
                            onChange={(e) => {
                                handleChange('last_name', e.target.value.trim());
                                setErrorObj({ ...errorObj, last_name: null });
                            }}
                            error={errorObj.last_name}
                            labelSize={Typography.Sizes.md}
                        />
                    </div>
                </div>

                <Brick sizeInRem={1.5} />

                <Typography.Body size={Typography.Sizes.md}>
                    Email Address
                    <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                        *
                    </span>
                </Typography.Body>
                <Brick sizeInRem={0.25} />
                <InputTooltip
                    placeholder="Enter Sapient Email"
                    onChange={(e) => {
                        handleChange('email', e.target.value);
                        setErrorObj({ ...errorObj, email: null });
                    }}
                    error={errorObj.email}
                    labelSize={Typography.Sizes.md}
                />

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>
                        User Role
                        <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                            *
                        </span>
                    </Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Role"
                        options={rolesList}
                        currentValue={rolesList.filter((option) => option.value === userObj?.role)}
                        onChange={(e) => {
                            handleChange('role', e.value);
                            setErrorObj({ ...errorObj, role: null });
                        }}
                        isSearchable={true}
                        error={errorObj.role}
                    />
                </div>

                <Brick sizeInRem={2.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={() => {
                            handleAddModalClose();
                            setUserObj(defaultUserObj);
                            setErrorObj(defaultErrorObj);
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Adding User...' : 'Add & Invite User'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={isProcessing}
                        onClick={saveUserData}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default AddUser;
