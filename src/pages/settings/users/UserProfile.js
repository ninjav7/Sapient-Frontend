import React, { useState, useEffect } from 'react';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import '../style.css';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { UserStore } from '../../../store/UserStore';
import { useParams, useHistory } from 'react-router-dom';
import Brick from '../../../sharedComponents/brick';
import {
    fetchSingleUserDetail,
    updateSingleUserDetails,
    updateVendorPermissions,
    inviteMemberUsers,
    updateUserRolePermission,
} from './service';
import { timeZone } from '../../../utils/helper';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import Select from '../../../sharedComponents/form/select';
import colorPalette from '../../../assets/scss/_colors.scss';
import Modal from 'react-bootstrap/Modal';
import './styles.scss';
import CompareRoles from './CompareRoles';
import { ReactComponent as DeactiveSVG } from '../../../assets/icon/redban.svg';
import { ReactComponent as InactiveSVG } from '../../../assets/icon/ban.svg';
import { ReactComponent as ActiveSVG } from '../../../assets/icon/circle-check.svg';
import { ReactComponent as ActivateSVG } from '../../../assets/icon/activateCircleCheck.svg';
import { ReactComponent as PendingSVG } from '../../../assets/icon/clock.svg';
import { ReactComponent as InviteSVG } from '../../../assets/icon/share.svg';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { compareObjData } from '../../../helpers/helpers';
import { ReactComponent as Exclamation } from '../../../assets/icon/circleExclamation.svg';

const UserProfile = () => {
    const { userId } = useParams();
    const history = useHistory();
    const defaultErrorObj = {
        first_name: null,
        last_name: null,
        email: null,
    };

    const [errorObj, setErrorObj] = useState(defaultErrorObj);

    const [error, setError] = useState(false);
    const [message, setMessage] = useState(false);

    const [isDataChanged, setDataChanged] = useState(false);
    const [isRoleChanged, setRoleChanged] = useState(false);

    const [userDetail, setUserDetail] = useState();
    const [orginalUserData, setOrginalUserData] = useState({});

    const [userRole, setUserRole] = useState();
    const [orignalUserRole, setOrginalUserRole] = useState({});

    const [isInviting, setInviting] = useState(false);

    const [showCompareRoles, setShowCompareRoles] = useState(false);

    // Add User Modal
    const [alertModal, setAlertModal] = useState(false);
    const handleModalClose = () => setAlertModal(false);
    const handleModalOpen = () => setAlertModal(true);

    const [dangerZoneText, setDangerZoneText] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isRoleUpdating, setRoleUpdating] = useState(false);
    const [errorDeactivate, setErrorDeactivate] = useState(false);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'User Profile',
                        path: '/energy/portfolio/overview',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'account';
            });
        };
        updateBreadcrumbStore();
    }, []);

    const getUserDetails = async () => {
        const params = `?member_user_id=${userId}&timezone=${timeZone}`;
        await fetchSingleUserDetail(params)
            .then((res) => {
                const response = res?.data?.data;

                setOrginalUserData(response?.user_details);
                setUserDetail(response?.user_details);

                if (response?.permissions.length !== 0) {
                    setOrginalUserRole(response?.permissions[0]);
                    setUserRole(response?.permissions[0]);
                }
            })
            .catch((error) => {
                setUserDetail({});
                setUserRole({});
            });
    };

    const getUserRoles = async () => {
        await updateVendorPermissions()
            .then((res) => {
                let response = res.data;
                let arr = [];
                response.data.map((el) => {
                    arr.push({
                        label: el.name,
                        value: el.id,
                    });
                });
                setRolesData(arr);
            })
            .catch((error) => {});
    };

    const updateUserDetails = async () => {
        if (!userDetail) return;

        let alertObj = Object.assign({}, errorObj);

        if ((userDetail?.first_name).length === 0) alertObj.first_name = 'First Name cannot be blank.';
        if ((userDetail?.last_name).length === 0) alertObj.last_name = 'Last Name cannot be blank.';
        if (
            (userDetail?.email).length === 0 ||
            !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,11})+$/.test(userDetail.email)
        )
            alertObj.email = 'Please enter valid Email address.';

        setErrorObj(alertObj);

        if (!alertObj.first_name && !alertObj.last_name && !alertObj.email) {
            setIsProcessing(true);

            let obj = {};

            if (userDetail?.first_name !== orginalUserData?.first_name) obj.first_name = userDetail.first_name.trim();
            if (userDetail?.last_name !== orginalUserData?.last_name) obj.last_name = userDetail.last_name.trim();
            if (userDetail?.email !== orginalUserData?.email) obj.email = userDetail.email.trim();

            const params = `?member_user_id=${userId}`;
            await updateSingleUserDetails(obj, params)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = 'User details updated.';
                            s.notificationType = 'success';
                        });
                    } else {
                        if (response?.message.includes('email already exist')) {
                            setErrorObj({ ...errorObj, email: 'Email already exists in system' });
                            setIsProcessing(false);
                            return;
                        }
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = 'Unable to update user details.';
                            s.notificationType = 'error';
                        });
                    }

                    getUserDetails();
                    setIsProcessing(false);
                })
                .catch((error) => {
                    setIsProcessing(false);
                });
        }
    };

    const handleActivateDeactivate = async (requestType) => {
        setIsUpdating(true);

        const obj = {
            is_active: requestType === 'Deactivate' ? false : true,
        };

        const params = `?member_user_id=${userId}`;
        await updateSingleUserDetails(obj, params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage =
                            requestType === 'Deactivate'
                                ? 'User account has been Deactivated.'
                                : 'User account has been Activated.';
                        s.notificationType = 'success';
                    });
                    getUserDetails();
                } else {
                    if (response.message === 'User cannot be deactivated.') {
                        setErrorDeactivate(true);
                    } else {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage =
                                requestType === 'Deactivate'
                                    ? 'Unable to Deactivate user Account.'
                                    : 'Unable to Activate user Account.';
                            s.notificationType = 'error';
                        });
                    }
                }
                setIsUpdating(false);
                handleModalClose();
            })
            .catch((error) => {
                setIsUpdating(false);
            });
    };

    const updateUserRoles = async () => {
        setRoleUpdating(true);
        const userRoleObj = {
            user: userId,
            permission_role: userRole?.permission_id,
        };
        await updateUserRolePermission(userRoleObj)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'User details updated successfully.';
                        s.notificationType = 'success';
                    });
                } else {
                    setError(true);
                    setMessage(response.message);
                }
                setRoleUpdating(false);
                getUserDetails();
            })
            .catch((error) => {
                setRoleUpdating(false);
            });
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, userDetail);
        obj[key] = value;
        setUserDetail(obj);
    };

    const handleRoleChange = (key, value) => {
        let obj = Object.assign({}, userRole);
        obj[key] = value;
        setUserRole(obj);
    };

    useEffect(() => {
        if (userId) {
            getUserDetails();
            getUserRoles();
        }
    }, [userId]);

    const [rolesData, setRolesData] = useState([]);

    const renderStatus = () => {
        const status = userDetail?.is_verified ? (userDetail?.is_active ? 'Active' : 'Inactive') : 'Pending';

        return (
            <Button
                label={status}
                size={Button.Sizes.lg}
                type={Button.Type.secondary}
                icon={
                    (status === 'Active' && <ActiveSVG />) ||
                    (status === 'Inactive' && <InactiveSVG />) ||
                    (status === 'Pending' && <PendingSVG />)
                }
                iconAlignment={Button.IconAlignment.left}
                className={`status-container ${status.toLowerCase()}-btn`}
                disabled
            />
        );
    };

    const resendInvite = async () => {
        const userData = {
            first_name: orginalUserData?.first_name,
            last_name: orginalUserData?.last_name,
            email: orginalUserData?.email,
            role: orignalUserRole?.permission_id,
        };
        const params = '?request_type=reinvite';

        setInviting(true);

        await inviteMemberUsers(params, userData)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Invite has been sent';
                        s.notificationType = 'success';
                    });
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Unable to sent invite';
                        s.notificationType = 'error';
                    });
                }
                setInviting(false);
            })
            .catch((error) => {
                setInviting(false);
            });
    };

    const deactivateUser = () => {
        return (
            <>
                <Button
                    label={userDetail?.is_active ? 'Deactivate User' : 'Activate User'}
                    size={Button.Sizes.lg}
                    type={userDetail?.is_active ? Button.Type.secondaryDistructive : Button.Type.secondary}
                    icon={(userDetail?.is_active && <DeactiveSVG />) || (!userDetail?.is_active && <ActivateSVG />)}
                    iconAlignment={Button.IconAlignment.left}
                    className={`w-100 mr-2`}
                    onClick={() => {
                        userDetail?.is_active ? setDangerZoneText('Deactivate') : setDangerZoneText('Activate');
                        handleModalOpen();
                    }}
                />

                {!userDetail?.is_verified && (
                    <Button
                        label={isInviting ? 'Resending Invite' : 'Resend Invitation'}
                        size={Button.Sizes.lg}
                        type={Button.Type.secondary}
                        icon={<InviteSVG />}
                        iconAlignment={Button.IconAlignment.left}
                        className={`w-100`}
                        onClick={resendInvite}
                        disabled={isInviting || !(isDataChanged && isRoleChanged)}
                    />
                )}
            </>
        );
    };

    useEffect(() => {
        if (userDetail) setDataChanged(compareObjData(userDetail, orginalUserData));
    }, [userDetail]);

    useEffect(() => {
        if (userRole) setRoleChanged(compareObjData(userRole, orignalUserRole));
    }, [userRole]);

    const handleSaveClick = () => {
        if (!isDataChanged) updateUserDetails();
        if (!isRoleChanged) updateUserRoles();
    };

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>
                                {orginalUserData?.first_name} {orginalUserData?.last_name}
                            </Typography.Header>
                            <Typography.Subheader size={Typography.Sizes.lg}>
                                {orginalUserData?.email}
                            </Typography.Subheader>
                        </div>
                        <div>
                            <div className="d-flex">
                                <Button
                                    label="Cancel"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    onClick={() => {
                                        history.push({ pathname: `/settings/users` });
                                    }}
                                />
                                <Button
                                    label={isProcessing || isRoleUpdating ? 'Saving' : 'Save'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={handleSaveClick}
                                    disabled={isDataChanged && isRoleChanged}
                                    className="ml-2"
                                />
                            </div>
                        </div>
                    </div>
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
                                User Details
                            </Typography.Subheader>
                        </CardHeader>

                        <div className="p-4">
                            <div className="w-100">
                                {userDetail && renderStatus()}

                                <Brick sizeInRem={0.5} />
                                <Typography.Body size={Typography.Sizes.sm}>
                                    Only active users can sign in
                                </Typography.Body>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <div className="w-50">
                                    <Typography.Subheader size={Typography.Sizes.md}>First Name</Typography.Subheader>
                                </div>
                                <div className="w-50">
                                    <InputTooltip
                                        placeholder="Enter First Name"
                                        labelSize={Typography.Sizes.md}
                                        onChange={(e) => {
                                            handleChange('first_name', e.target.value);
                                            setErrorObj({ ...errorObj, first_name: null });
                                        }}
                                        value={userDetail?.first_name}
                                        error={errorObj.first_name}
                                    />
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <div className="w-50">
                                    <Typography.Subheader size={Typography.Sizes.md}>Last Name</Typography.Subheader>
                                </div>
                                <div className="w-50">
                                    <InputTooltip
                                        placeholder="Enter Last Name"
                                        labelSize={Typography.Sizes.md}
                                        onChange={(e) => {
                                            handleChange('last_name', e.target.value);
                                            setErrorObj({ ...errorObj, last_name: null });
                                        }}
                                        value={userDetail?.last_name}
                                        error={errorObj.last_name}
                                    />
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <div className="w-50">
                                    <Typography.Subheader size={Typography.Sizes.md}>
                                        Email Address
                                    </Typography.Subheader>
                                </div>
                                <div className="w-50">
                                    <InputTooltip
                                        placeholder="Enter Email Address"
                                        labelSize={Typography.Sizes.md}
                                        onChange={(e) => {
                                            handleChange('email', e.target.value);
                                            setErrorObj({ ...errorObj, email: null });
                                        }}
                                        value={userDetail?.email}
                                        disabled={userDetail?.is_active === false ? true : false}
                                        error={errorObj.email}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
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
                                User Roles
                            </Typography.Subheader>
                        </CardHeader>

                        <div className="p-4">
                            <div className="w-100">
                                <div className="d-flex justify-content-start align-items-center">
                                    <Typography.Subheader size={Typography.Sizes.md}>
                                        {orignalUserRole?.permission_name}
                                    </Typography.Subheader>

                                    <Button
                                        label="Compare Roles"
                                        size={Button.Sizes.md}
                                        type={Button.Type.link}
                                        onClick={() => setShowCompareRoles(true)}
                                    />
                                </div>

                                <Brick sizeInRem={1} />

                                <div className="align-items-center" style={{ width: '40%' }}>
                                    <Select
                                        className={error ? 'viewError' : 'viewNormal'}
                                        id="roles"
                                        placeholder="Select Role to assign"
                                        options={rolesData}
                                        isSearchable={false}
                                        currentValue={rolesData.filter(
                                            (option) => option.value === userRole?.permission_id
                                        )}
                                        error={error}
                                        onChange={(e) => {
                                            handleRoleChange('permission_id', e.value);
                                        }}
                                    />
                                    {error ? (
                                        <div className="mt-2">
                                            <Typography.Subheader size={Typography.Sizes.sm} className="errorText">
                                                <Exclamation /> &nbsp;&nbsp;{message}
                                            </Typography.Subheader>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                    </div>
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
                                Danger Zone
                            </Typography.Subheader>
                        </CardHeader>

                        <CardBody>{userDetail && <div className="d-flex">{deactivateUser()}</div>}</CardBody>
                    </div>
                </Col>
            </Row>

            <CompareRoles show={showCompareRoles} setShow={setShowCompareRoles} />

            <Modal show={alertModal} onHide={handleModalClose} centered backdrop="static" keyboard={false}>
                <Modal.Body className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>{dangerZoneText} User</Typography.Header>
                    <Brick sizeInRem={1.5} />
                    <Typography.Body size={Typography.Sizes.lg}>
                        Are you sure you want to {dangerZoneText} the User?
                    </Typography.Body>
                </Modal.Body>
                <Modal.Footer className="pb-4 pr-4">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={handleModalClose}
                    />
                    {dangerZoneText === 'Deactivate' ? (
                        <Button
                            label={isUpdating ? 'Deactivating...' : 'Deactivate'}
                            size={Button.Sizes.lg}
                            type={Button.Type.primaryDistructive}
                            onClick={() => {
                                handleActivateDeactivate(dangerZoneText);
                            }}
                            disabled={isUpdating}
                        />
                    ) : (
                        <Button
                            label={isUpdating ? 'Activating...' : 'Activate'}
                            size={Button.Sizes.lg}
                            type={Button.Type.primary}
                            onClick={() => {
                                handleActivateDeactivate(dangerZoneText);
                            }}
                            disabled={isUpdating}
                        />
                    )}
                </Modal.Footer>
            </Modal>
            <Modal
                show={errorDeactivate}
                onHide={() => {
                    setErrorDeactivate(false);
                }}
                centered
                backdrop="static"
                dialogClassName="user-update-style"
                keyboard={false}>
                <Modal.Body className="p-4">
                    <div className="userErrorBlock">
                        <Typography.Subheader size={Typography.Sizes.md} className="errorText">
                            <Exclamation /> &nbsp;&nbsp;{'User cannot be deactivated'}
                        </Typography.Subheader>
                    </div>
                    <Brick sizeInRem={1} />
                    <div>
                        <Row>
                            <Col lg={12}>
                                <Typography.Body size={Typography.Sizes.md}>
                                    {orginalUserData?.email} is the only administrator on the account, please assign
                                    another administrator before deactivating.
                                </Typography.Body>
                            </Col>
                        </Row>
                    </div>
                    <Brick sizeInRem={1.5} />
                    <Row>
                        <Col lg={12}>
                            <Button
                                label={'OK'}
                                size={Button.Sizes.lg}
                                type={Button.Type.primary}
                                onClick={() => {
                                    setErrorDeactivate(false);
                                }}
                                className="ok-btn"
                            />
                        </Col>
                    </Row>
                </Modal.Body>
            </Modal>
        </React.Fragment>
    );
};

export default UserProfile;
