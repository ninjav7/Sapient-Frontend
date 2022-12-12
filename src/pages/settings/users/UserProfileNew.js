import React, { useState, useEffect } from 'react';
import { Row, Col, CardBody, Input, CardHeader } from 'reactstrap';
import Switch from 'react-switch';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import '../style.css';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import Brick from '../../../sharedComponents/brick';
import { BaseUrl, vendorPermissions, getSingleUserDetail, updateSingleUserDetail } from '../../../services/Network';
import axios from 'axios';
import { useAtom } from 'jotai';
import { buildingData } from '../../../store/globalState';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import Inputs from '../../../sharedComponents/form/input/Input';
import Select from '../../../sharedComponents/form/select';
import colorPalette from '../../../assets/scss/_colors.scss';
import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import { faCircleCheck, faClockFour, faBan, faShare } from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './styles.scss';

const UserProfileNew = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [checked, setChecked] = useState(true);
    const [userDetail, setUserDetail] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [loadButton, setLoadButton] = useState(false);
    const { userId, is_active, is_verified } = useParams();
    const [updateUserDetail, setUpdateUserDetail] = useState({
        first_name: '',
        last_name: '',
        email: '',
        is_active: is_active,
    });

    const [userObj, setUserObj] = useState({
        role: '',
    });

    const [userPermissionList, setUserPermissionList] = useState();

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
        let header = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        await axios
            .get(`${BaseUrl}${getSingleUserDetail}?member_user_id=${userId}`, { headers: header })
            .then((res) => {
                setUserDetail(res?.data?.data?.user_details);
                setUserPermissionList(res?.data?.data?.user_permissions);
            });
    };

    const updateSingleUserDetailFunc = async () => {
        let header = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        await axios
            .patch(`${BaseUrl}${updateSingleUserDetail}?member_user_id=${userId}`, updateUserDetail, {
                headers: header,
            })
            .then((res) => {
                setUserDetail(res?.data?.data);
                setLoadButton(false);
                getSingleUserDetailFunc();
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
            });
        }
    }, [userDetail]);

    const [rolesData, setRolesData] = useState([]);
    const [buildingListData] = useAtom(buildingData);

    const getPermissionRoleFunc = async () => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            await axios.post(`${BaseUrl}${vendorPermissions}`, {}, { headers }).then((res) => {
                let response = res.data;
                let arr = [];
                response.data.map((el) => {
                    arr.push({
                        label: el.name,
                        value: el.id,
                    });
                });
                setRolesData(arr);
            });
        } catch (error) {}
    };

    useEffect(() => {
        getPermissionRoleFunc();
    }, [buildingListData]);

    const renderStatus = () => {
        if (is_verified === false) {
            console.log('verified false', is_verified);
            return (
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    className="d-flex pending-container justify-content-center"
                    style={{ color: colorPalette.warning700 }}>
                    <FontAwesomeIcon icon={faClockFour} size="lg" style={{ color: colorPalette.warning700 }} />
                    Pending
                </Typography.Subheader>
            );
        } else {
            if (!updateUserDetail?.is_active === true) {
                console.log('verified active true', is_active);
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="d-flex active-container justify-content-center"
                        style={{ color: colorPalette.success700 }}>
                        <FontAwesomeIcon icon={faCircleCheck} size="lg" style={{ color: colorPalette.success700 }} />
                        Active
                    </Typography.Subheader>
                );
            } else if (!updateUserDetail?.is_active === false) {
                console.log('verified active false', is_active);
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

    const deactivateUser = () => {
        if (is_verified === false) {
            return (
                <>
                    <Typography.Subheader
                        size={Typography.Sizes.md}
                        className="d-flex deactivate-container justify-content-center"
                        style={{ color: colorPalette.error700 }}>
                        <FontAwesomeIcon icon={faBan} size="lg" style={{ color: colorPalette.error700 }} />
                        Deactivate User
                    </Typography.Subheader>
                    <Typography.Subheader
                        size={Typography.Sizes.md}
                        className="d-flex activate-container justify-content-center"
                        style={{ color: colorPalette.primaryIndigo600 }}>
                        <FontAwesomeIcon icon={faShare} size="lg" style={{ color: colorPalette.primaryIndigo600 }} />
                        Resend Invitation
                    </Typography.Subheader>
                </>
            );
        } else {
            if (!updateUserDetail?.is_active === true) {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.md}
                        className="d-flex deactivate-container justify-content-center"
                        style={{ color: colorPalette.error700 }}>
                        <FontAwesomeIcon icon={faBan} size="lg" style={{ color: colorPalette.error700 }} />
                        Deactivate User
                    </Typography.Subheader>
                );
            } else if (!updateUserDetail?.is_active === false) {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.md}
                        className="d-flex activate-container justify-content-center"
                        style={{ color: colorPalette.primaryIndigo600 }}>
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

    const userStatusHandler = () => {
        var answer = window.confirm("'Are you sure wants o delete!!!'");

        if (answer) {
            //some code
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
                                    // label={'Save'}
                                    label={loadButton ? 'Saving' : 'Save'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => {
                                        updateSingleUserDetailFunc();
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
                                                <div>
                                                    <Typography.Subheader size={Typography.Sizes.md}>
                                                        {item?.permissions?.[0]?.permission_name}
                                                    </Typography.Subheader>

                                                    <Brick sizeInRem={1} />
                                                </div>
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
                                                                userObj.role == ''
                                                                    ? item?.permissions?.[0]?.permission_id
                                                                    : userObj.role
                                                            }
                                                            onChange={(e) => {
                                                                setIsEditing(true);
                                                                handleChange('role', e.value);
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
                            <div>{deactivateUser()}</div>
                        </CardBody>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default UserProfileNew;
