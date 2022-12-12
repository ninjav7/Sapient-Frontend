import React, { useState, useEffect } from 'react';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';
import Switch from 'react-switch';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import '../style.css';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { Link, useParams } from 'react-router-dom';
import { Cookies } from 'react-cookie';
import Brick from '../../../sharedComponents/brick';
import {
    BaseUrl,
    assignUser,
    getPermissionRole,
    getSingleUserDetail,
    updateSingleUserDetail,
} from '../../../services/Network';
import axios from 'axios';
import { useAtom } from 'jotai';
import { buildingData } from '../../../store/globalState';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import Inputs from '../../../sharedComponents/form/input/Input';
import Select from '../../../sharedComponents/form/select';
import colorPalette from '../../../assets/scss/_colors.scss';
import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';

const UserProfileNew = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [checked, setChecked] = useState(true);
    const [userDetail, setUserDetail] = useState();
    const [isEditing, setIsEditing] = useState(false);
    const [loadButton, setLoadButton] = useState(false);
    const { userId, is_active } = useParams();
    const [updateUserDetail, setUpdateUserDetail] = useState({
        first_name: '',
        last_name: '',
        email: '',
        is_active: is_active,
    });

    const [selectedBuilding, setSelctedBuilding] = useState('1');
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

    const [roleDataList, setRoleDataList] = useState();

    const [locationDataNow, setLocationDataNow] = useState([]);

    const addLocationType = () => {
        roleDataList.map((item) => {
            setLocationDataNow((el) => [...el, { value: `${item?._id}`, label: `${item?.name}` }]);
        });
    };

    useEffect(() => {
        if (roleDataList) {
            addLocationType();
        }
    }, [roleDataList]);

    const [buildingListData] = useAtom(buildingData);
    const [allBuildings, setAllBuildings] = useState([]);

    // Commented for Future Use
    // const getPermissionRoleFunc = async () => {
    //     try {
    //         let header = {
    //             'Content-Type': 'application/json',
    //             accept: 'application/json',
    //             Authorization: `Bearer ${userdata.token}`,
    //         };

    //         await axios.get(`${BaseUrl}${getPermissionRole}`, { headers: header }).then((res) => {
    //             setRoleDataList(res.data.data);
    //             return buildingListData?.map((item) => {
    //                 setAllBuildings((el) => [...el, item?.building_id]);
    //             });
    //         });
    //     } catch (err) {}
    // };

    // useEffect(() => {
    //     getPermissionRoleFunc();
    // }, [buildingListData]);

    const [permissionValue, setPermissionValue] = useState('');
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // const assignUserRoleFunc = async () => {
    //     try {
    //         let header = {
    //             'Content-Type': 'application/json',
    //             accept: 'application/json',
    //             Authorization: `Bearer ${userdata.token}`,
    //         };

    //         // const params = userId;
    //         await axios
    //             .post(
    //                 `${BaseUrl}${assignUser}?member_user_id=${userId}`,
    //                 {
    //                     permission_role: permissionValue,
    //                     buildings: allBuildings,
    //                 },
    //                 { headers: header }
    //             )
    //             .then((res) => {
    //                 getSingleUserDetailFunc();
    //                 setShow(false);
    //             });
    //     } catch (err) {}
    // };

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
                                    <Typography.Subheader size={Typography.Sizes.md}>Active</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        Only active users can sign in
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Switch
                                        onChange={() => {
                                            setIsEditing(true);
                                            setUpdateUserDetail({
                                                ...updateUserDetail,
                                                is_active: !updateUserDetail?.is_active,
                                            });
                                        }}
                                        checked={!updateUserDetail?.is_active}
                                        onColor={colorPalette.datavizBlue600}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        className="react-switch"
                                    />
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
                                                            id="endUseSelect"
                                                            placeholder="Select Buildings"
                                                            name="select"
                                                            options={[{ value: '1', label: 'All Building' }]}
                                                            isSearchable={true}
                                                            defaultValue={selectedBuilding}
                                                            onChange={(e) => {
                                                                setIsEditing(true);
                                                                setSelctedBuilding(e.value);
                                                            }}
                                                            className="w-100"
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
                            <div>
                                <Button
                                    label="Remove User"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryDistructive}
                                    // onClick={deleteBuildingHandler} -- Will be enabled once API is ready
                                    icon={<DeleteSVG />}
                                />
                            </div>
                        </CardBody>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default UserProfileNew;
