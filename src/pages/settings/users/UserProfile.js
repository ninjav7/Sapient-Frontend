import React, { useState, useEffect } from 'react';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import '../style.css';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { UserStore } from '../../../store/UserStore';
import { useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import Brick from '../../../sharedComponents/brick';
import {
    fetchSingleUserDetail,
    updateSingleUserDetails,
    updateVendorPermissions,
    inviteMemberUsers,
    updateUserRolePermission,
} from './service';
import 'moment-timezone';
import moment from 'moment';
import { timeZone } from '../../../utils/helper';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import Inputs from '../../../sharedComponents/form/input/Input';
import Select from '../../../sharedComponents/form/select';
import colorPalette from '../../../assets/scss/_colors.scss';
import { faCircleCheck, faClockFour, faBan } from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShare } from '@fortawesome/pro-solid-svg-icons';
import Modal from 'react-bootstrap/Modal';
import './styles.scss';
import CompareRoles from './CompareRoles';
import Countdown from 'react-countdown';

const UserProfile = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [userDetail, setUserDetail] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [loadButton, setLoadButton] = useState(false);
    const [showCompareRoles, setShowCompareRoles] = useState(false);
    const { userId } = useParams();
    const [updateUserDetail, setUpdateUserDetail] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });

    const [userObj, setUserObj] = useState({
        user: userId,
        permission_role: '',
    });

    const [userPermissionList, setUserPermissionList] = useState();
    const [show, setShow] = useState(false);
    const [dangerZoneText, setDangerZoneText] = useState('');
    const [showResendIn, setShowResendIn] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

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

    // TODO:
    const getSingleUserDetailFunc = async () => {
        let params = `?member_user_id=${userId}&timezone=${timeZone}`;
        await fetchSingleUserDetail(params)
            .then((res) => {
                setUserDetail(res?.data?.data?.user_details);
                let time = res?.data?.data?.user_details?.last_invite_at;
                var d = new Date(time);
                if (!(d.getTime() + 3600000 < Date.now() && d.getTime() < Date.now())) {
                    setShowResendIn(true);
                } else {
                    setShowResendIn(false);
                }
                setUserPermissionList(res?.data?.data?.permissions);
            })
            .catch((error) => {});
    };

    const updateSingleUserDetailFunc = async (obj) => {
        if (obj.is_active !== undefined) {
            setIsProcessing(true);
        }
        let params = `?member_user_id=${userId}`;
        await updateSingleUserDetails(obj, params)
            .then((res) => {
                setUserDetail(res?.data?.data);

                if (obj.is_active !== undefined) {
                    setShow(false);
                } else {
                    setLoadButton(false);
                }
                getSingleUserDetailFunc();
                setIsProcessing(false);
            })
            .catch((error) => {});
        setIsProcessing(false);
    };
    const updateRolesPermission = async () => {
        await updateUserRolePermission(userObj)
            .then((res) => {
                setIsProcessing(false);
                setShow(false);

                getSingleUserDetailFunc();
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, userObj);
        obj[key] = value;
        setUserObj(obj);
    };

    useEffect(() => {
        if (userId) {
            getSingleUserDetailFunc();
        }
    }, [userId]);

    useEffect(() => {
        if (userDetail) {
            setUpdateUserDetail({
                first_name: userDetail?.first_name,
                last_name: userDetail?.last_name,
                email: userDetail?.email,
                is_active: userDetail?.is_active,
                is_verified: userDetail?.is_verified,
            });
        }
    }, [userDetail]);

    const [rolesData, setRolesData] = useState([]);

    const getPermissionRoleFunc = async () => {
        await updateVendorPermissions({}, '')
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

    useEffect(() => {
        getPermissionRoleFunc();
    }, []);

    const renderStatus = () => {
        if (userDetail?.is_verified === false) {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.sm}
                    className="d-flex pending-container justify-content-center"
                    style={{ color: colorPalette.warning700 }}>
                    <FontAwesomeIcon icon={faClockFour} size="lg" style={{ color: colorPalette.warning700 }} />
                    Pending
                </Typography.Subheader>
            );
        } else {
            if (userDetail?.is_active === true) {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="d-flex active-container justify-content-center"
                        style={{ color: colorPalette.success700 }}>
                        <FontAwesomeIcon icon={faCircleCheck} size="lg" style={{ color: colorPalette.success700 }} />
                        Active
                    </Typography.Subheader>
                );
            } else if (userDetail?.is_active === false) {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="d-flex inactive-container justify-content-center"
                        style={{ color: colorPalette.primaryGray800 }}>
                        <FontAwesomeIcon icon={faBan} size="lg" style={{ color: colorPalette.primaryGray800 }} />
                        Inactive
                    </Typography.Subheader>
                );
            }
        }
    };

    const renderer = ({ hours, minutes, seconds, completed }) => {
        return (
            <span>
                {minutes}:{seconds}
            </span>
        );
    };

    const resendInvite = async () => {
        let userData = {
            first_name: updateUserDetail?.first_name,
            last_name: updateUserDetail?.last_name,
            email: updateUserDetail?.email,
            role: userPermissionList[0]?.permission_id,
        };
        let params = '?request_type=reinvite';
        await inviteMemberUsers(userData, params)
            .then((res) => {
                let response = res.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Invite has been sent';
                        s.notificationType = 'success';
                    });
                }
            })
            .catch((error) => {});
    };

    const deactivateUser = () => {
        if (userDetail?.is_verified === false) {
            return (
                <>
                    <Typography.Subheader
                        size={Typography.Sizes.md}
                        className="d-flex deactivate-container justify-content-center"
                        style={{ color: colorPalette.error700, cursor: 'pointer' }}
                        onClick={() => {
                            setDangerZoneText('Deactivate');
                            setShow(true);
                        }}>
                        <FontAwesomeIcon icon={faBan} size="lg" style={{ color: colorPalette.error700 }} />
                        Deactivate User
                    </Typography.Subheader>
                    <Typography.Subheader
                        size={Typography.Sizes.md}
                        className={`d-flex ${
                            showResendIn ? 'blur-activate-container' : 'activate-container'
                        } justify-content-center`}
                        style={{ color: colorPalette.primaryIndigo600, cursor: 'pointer' }}
                        onClick={resendInvite}
                        disabled={showResendIn}>
                        <FontAwesomeIcon icon={faShare} size="lg" style={{ color: colorPalette.primaryIndigo600 }} />
                        Resend Invitation
                    </Typography.Subheader>
                    {showResendIn ? (
                        <Typography.Subheader
                            size={Typography.Sizes.md}
                            type={Typography.Types.Regular}
                            className="d-flex send-container justify-content-center"
                            style={{ color: colorPalette.primaryGray550 }}>
                            Send new invitation in&nbsp;
                            <Countdown
                                date={new Date(userDetail?.last_invite_at).getTime() + 3600000}
                                renderer={renderer}
                            />
                        </Typography.Subheader>
                    ) : null}
                </>
            );
        } else {
            if (userDetail?.is_active === true) {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.md}
                        className="d-flex deactivate-container justify-content-center"
                        style={{ color: colorPalette.error700, cursor: 'pointer' }}
                        onClick={() => {
                            setDangerZoneText('Deactivate');
                            setShow(true);
                        }}>
                        <FontAwesomeIcon icon={faBan} size="lg" style={{ color: colorPalette.error700 }} />
                        Deactivate User
                    </Typography.Subheader>
                );
            } else if (userDetail?.is_active === false) {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.md}
                        className="d-flex activate-container justify-content-center"
                        style={{ color: colorPalette.primaryIndigo600, cursor: 'pointer' }}
                        onClick={() => {
                            setDangerZoneText('Activate');
                            setShow(true);
                        }}>
                        <FontAwesomeIcon
                            icon={faCircleCheck}
                            size="lg"
                            style={{ color: colorPalette.primaryIndigo600 }}
                        />
                        Activate User
                    </Typography.Subheader>
                );
            }
        }
    };

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>
                                {userDetail?.first_name} {userDetail?.last_name}
                            </Typography.Header>
                            <Typography.Subheader size={Typography.Sizes.lg}>{userDetail?.email}</Typography.Subheader>
                        </div>
                        <div>
                            <div className="d-flex">
                                <Button
                                    label="Cancel"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    onClick={() => {
                                        setIsEditing(false);
                                    }}
                                />
                                <Button
                                    label={loadButton ? 'Saving' : 'Save'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={async () => {
                                        updateSingleUserDetailFunc(updateUserDetail);
                                        await updateRolesPermission();
                                    }}
                                    className="ml-2"
                                    disabled={!isEditing}
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
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    User Details
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <div className="row">
                                <div className="col">
                                    {renderStatus()}
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        Only active users can sign in
                                    </Typography.Body>
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>First Name</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        placeholder="Enter First Name"
                                        onChange={(e) => {
                                            setIsEditing(true);
                                            setUpdateUserDetail({
                                                ...updateUserDetail,
                                                first_name: e.target.value,
                                            });
                                        }}
                                        className="w-100"
                                        value={updateUserDetail?.first_name}
                                    />
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>Last Name</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        placeholder="Enter Last Name"
                                        onChange={(e) => {
                                            setIsEditing(true);
                                            setUpdateUserDetail({
                                                ...updateUserDetail,
                                                last_name: e.target.value,
                                            });
                                        }}
                                        className="w-100"
                                        value={updateUserDetail?.last_name}
                                    />
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>
                                        Email Address
                                    </Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        placeholder="Enter Email Address"
                                        onChange={(e) => {
                                            setIsEditing(true);
                                            setUpdateUserDetail({
                                                ...updateUserDetail,
                                                email: e.target.value,
                                            });
                                        }}
                                        className="w-100"
                                        value={updateUserDetail?.email}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={9}>
                    <div className="custom-card">
                        <CardHeader>
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    User Roles
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <Row>
                                <Col lg={6}>
                                    {userPermissionList?.map((item) => {
                                        return (
                                            <>
                                                <div className="row ml-2">
                                                    <Typography.Subheader
                                                        size={Typography.Sizes.md}
                                                        style={{ paddingTop: '0.5rem' }}>
                                                        {item?.permission_name}
                                                    </Typography.Subheader>
                                                    <Button
                                                        label="Compare Roles"
                                                        size={Button.Sizes.md}
                                                        type={Button.Type.link}
                                                        onClick={() => {
                                                            setShowCompareRoles(true);
                                                        }}
                                                    />

                                                    {/* <Typography.Link
                                                        size={Typography.Sizes.md}
                                                        href={() => {
                                                            setShowCompareRoles(true);
                                                        }}
                                                        as="a"
                                                        target="_blank"
                                                        style={{
                                                            marginLeft: '1rem',
                                                        }}>
                                                        {' '}
                                                        Compare Roles
                                                    </Typography.Link> */}
                                                </div>
                                                <Brick sizeInRem={1} />
                                                <div className="row d-flex align-items-center">
                                                    <div className="col">
                                                        <Select
                                                            id="roles"
                                                            placeholder="Select Role"
                                                            name="select Roles"
                                                            className="font-weight-bold"
                                                            style={{ color: 'black' }}
                                                            options={rolesData}
                                                            isSearchable={false}
                                                            defaultValue={
                                                                userObj.permission_role == ''
                                                                    ? item?.permission_id
                                                                    : userObj.permission_role
                                                            }
                                                            onChange={(e) => {
                                                                setIsEditing(true);
                                                                handleChange('permission_role', e.value);
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            </>
                                        );
                                    })}

                                    <Brick sizeInRem={1} />
                                </Col>
                            </Row>
                        </CardBody>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={9}>
                    <div className="custom-card">
                        <CardHeader>
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    Danger Zone
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <div style={{ display: 'flex', width: '100%', gap: '1.25rem' }}>{deactivateUser()}</div>
                        </CardBody>
                    </div>
                </Col>
            </Row>
            <CompareRoles show={showCompareRoles} setShow={setShowCompareRoles} />
            <Modal
                show={show}
                onHide={() => {
                    setShow(false);
                }}
                centered
                dialogClassName="modal-active-deactive">
                <Modal.Header style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                    <Modal.Title>
                        <Typography.Header size={Typography.Sizes.md} style={{ color: colorPalette.primary }}>
                            {dangerZoneText} User
                        </Typography.Header>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                    <Typography.Subheader size={Typography.Sizes.md}>
                        Are you sure you want to {dangerZoneText} the User?
                    </Typography.Subheader>
                </Modal.Body>
                <Modal.Footer style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                    <div className="add-equipment-footer">
                        <Button
                            label="Cancel"
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryGrey}
                            onClick={() => setShow(false)}
                            className="buttonStyle"
                        />
                        {dangerZoneText === 'Deactivate' ? (
                            <Button
                                label={isProcessing ? 'Deactivating...' : 'Deactivate'}
                                size={Button.Sizes.lg}
                                type={Button.Type.primaryDistructive}
                                className="buttonStyle"
                                onClick={() => {
                                    updateSingleUserDetailFunc({
                                        is_active: false,
                                    });
                                }}
                            />
                        ) : (
                            <Button
                                label={isProcessing ? 'Activating...' : 'Activate'}
                                size={Button.Sizes.lg}
                                type={Button.Type.primary}
                                className="buttonStyle"
                                onClick={() => {
                                    updateSingleUserDetailFunc({
                                        is_active: true,
                                    });
                                }}
                            />
                        )}
                    </div>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default UserProfile;
