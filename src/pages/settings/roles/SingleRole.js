import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Input,
    CardHeader,
    Nav,
    NavItem,
    NavLink,
    CustomInput,
    Table,
} from 'reactstrap';
import { Link, useHistory, useParams } from 'react-router-dom';
import Switch from 'react-switch';
import Form from 'react-bootstrap/Form';
import 'react-datepicker/dist/react-datepicker.css';
import { ComponentStore } from '../../../store/ComponentStore';
import 'react-time-picker/dist/TimePicker.css';
import '../style.css';
import classnames from 'classnames';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { BaseUrl, createPermissionRole, getPermissionSingleDetail } from '../../../services/Network';

const UserTable = ({ userData }) => {
    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Users',
                        path: '/settings/users',
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

    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr className="mouse-pointer">
                            <th>Name</th>
                            <th>Building Access</th>
                            <th>Email</th>
                            <th>Last Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {userData.map((record, index) => {
                            return (
                                <tr className="mouse-pointer">
                                    <td className="font-weight-bold panel-name">
                                        <Link
                                            to={{
                                                pathname: `/settings/users/user-profile`,
                                            }}>
                                            <a>{record.name}</a>
                                        </Link>
                                    </td>
                                    <td className="">{record.buildingAccess}</td>
                                    <td className="">{record.emailId}</td>
                                    <td className="font-weight-bold">{record.lastActive}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const SingleRole = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [formValidation, setFormValidation] = useState(false);

    const { roleId } = useParams();
    let history = useHistory();

    const [checked, setChecked] = useState(false);
    const [checkedBuildingConf, setCheckedBuildingConf] = useState(false);
    const [checkedAdvancedConf, setCheckedAdvancedConf] = useState(false);

    const [buildingViewChecked, setBuildingViewChecked] = useState(false);
    const [portfolioChecked, setPortfolioChecked] = useState(false);
    const [workspacePlanningChecked, setWorkspacePlanningChecked] = useState(false);
    const [portfolioViewChecked, setPortfolioViewChecked] = useState(false);
    const [exploreChecked, setExploreChecked] = useState(false);
    const [controlControlChecked, setControlControlChecked] = useState(false);

    const [activeTab, setActiveTab] = useState('1');

    const tabContents = [
        // {
        //     id: '1',
        //     title: 'Permissions',
        //     icon: 'uil-home-alt',
        // },
        // {
        //     id: '2',
        //     title: 'Users (3)',
        //     icon: 'uil-user',
        // },
    ];

    const [userData, setUserData] = useState([
        {
            name: 'Michael Scott',
            buildingAccess: 'All Buildings',
            emailId: 'manager@dundermifflin.com',
            lastActive: 'Today',
        },
        {
            name: 'Jim Halpert',
            buildingAccess: '2 Buildings',
            emailId: 'jhalpert@dundermifflin.com',
            lastActive: '4 days ago',
        },
        {
            name: 'Dwight Schrute',
            buildingAccess: '3 Buildings',
            emailId: 'dschrute@dundermifflin.com',
            lastActive: '10 mins ago',
        },
    ]);

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    const [roleName, setRoleName] = useState('Account Administrator');

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: `${roleName}`,
                        path: '/settings/role-config',
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
    }, [roleName]);

    const [userPermissionRoleBody, setUserPermissionRoleBody] = useState({
        name: '',
        account_general_permission: {
            view: false,
            edit: false,
        },
        account_buildings_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        account_user_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        account_roles_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        energy_building_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        energy_portfolio_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        workspace_planning_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        workspace_portfolio_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        explore_general_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        control_control_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        control_plug_rule_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        building_details_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        building_users_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        building_layout_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        building_equipment_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        building_utility_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        building_panels_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        advanced_active_device_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        advanced_passive_device_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
        advanced_gateways_permission: {
            view: false,
            create: false,
            edit: false,
            delete: false,
        },
    });

    useEffect(() => {
        if (userPermissionRoleBody.name) {
            setFormValidation(true);
        } else {
            setFormValidation(false);
        }
    }, [userPermissionRoleBody]);

    const [singlePermissionDetail, setSinglePermissionDetail] = useState([]);

    useEffect(() => {
        if (checked) {
            setUserPermissionRoleBody({
                ...userPermissionRoleBody,
                account_general_permission: {
                    view: true,
                    edit: true,
                },
                account_buildings_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
                account_user_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
                account_roles_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
            });
        }
    }, [checked]);

    useEffect(() => {
        if (checkedBuildingConf) {
            setUserPermissionRoleBody({
                ...userPermissionRoleBody,
                building_details_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
                building_users_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
                building_layout_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
                building_equipment_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
                building_utility_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
                building_panels_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
            });
        }
    }, [checkedBuildingConf]);

    useEffect(() => {
        if (checkedAdvancedConf) {
            setUserPermissionRoleBody({
                ...userPermissionRoleBody,
                advanced_active_device_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
                advanced_passive_device_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
                advanced_gateways_permission: {
                    view: true,
                    create: true,
                    edit: true,
                    delete: true,
                },
            });
        }
    }, [checkedAdvancedConf]);

    useEffect(() => {
        setUserPermissionRoleBody({
            name: singlePermissionDetail?.name,
            account_general_permission: {
                view: singlePermissionDetail?.account_general_permission?.view,
                edit: singlePermissionDetail?.account_general_permission?.edit,
            },
            account_buildings_permission: {
                view: singlePermissionDetail?.account_buildings_permission?.view,
                create: singlePermissionDetail?.account_buildings_permission?.create,
                edit: singlePermissionDetail?.account_buildings_permission?.edit,
                delete: singlePermissionDetail?.account_buildings_permission?.delete,
            },
            account_user_permission: {
                view: singlePermissionDetail?.account_user_permission?.view,
                create: singlePermissionDetail?.account_user_permission?.create,
                edit: singlePermissionDetail?.account_user_permission?.edit,
                delete: singlePermissionDetail?.account_user_permission?.delete,
            },
            account_roles_permission: {
                view: singlePermissionDetail?.account_roles_permission?.view,
                create: singlePermissionDetail?.account_roles_permission?.create,
                edit: singlePermissionDetail?.account_roles_permission?.edit,
                delete: singlePermissionDetail?.account_roles_permission?.delete,
            },
            energy_building_permission: {
                view: singlePermissionDetail?.energy_building_permission?.view,
                create: singlePermissionDetail?.energy_building_permission?.create,
                edit: singlePermissionDetail?.energy_building_permission?.edit,
                delete: singlePermissionDetail?.energy_building_permission?.delete,
            },
            energy_portfolio_permission: {
                view: singlePermissionDetail?.energy_portfolio_permission?.view,
                create: singlePermissionDetail?.energy_portfolio_permission?.create,
                edit: singlePermissionDetail?.energy_portfolio_permission?.edit,
                delete: singlePermissionDetail?.energy_portfolio_permission?.delete,
            },
            workspace_planning_permission: {
                view: singlePermissionDetail?.workspace_planning_permission?.view,
                create: singlePermissionDetail?.workspace_planning_permission?.create,
                edit: singlePermissionDetail?.workspace_planning_permission?.edit,
                delete: singlePermissionDetail?.workspace_planning_permission?.delete,
            },
            workspace_portfolio_permission: {
                view: singlePermissionDetail?.workspace_portfolio_permission?.view,
                create: singlePermissionDetail?.workspace_portfolio_permission?.create,
                edit: singlePermissionDetail?.workspace_portfolio_permission?.edit,
                delete: singlePermissionDetail?.workspace_portfolio_permission?.delete,
            },
            explore_general_permission: {
                view: singlePermissionDetail?.explore_general_permission?.view,
                create: singlePermissionDetail?.explore_general_permission?.create,
                edit: singlePermissionDetail?.explore_general_permission?.edit,
                delete: singlePermissionDetail?.explore_general_permission?.delete,
            },
            control_control_permission: {
                view: singlePermissionDetail?.control_control_permission?.view,
                create: singlePermissionDetail?.control_control_permission?.create,
                edit: singlePermissionDetail?.control_control_permission?.edit,
                delete: singlePermissionDetail?.control_control_permission?.delete,
            },
            control_plug_rule_permission: {
                view: singlePermissionDetail?.control_plug_rule_permission?.view,
                create: singlePermissionDetail?.control_plug_rule_permission?.create,
                edit: singlePermissionDetail?.control_plug_rule_permission?.edit,
                delete: singlePermissionDetail?.control_plug_rule_permission?.delete,
            },
            building_details_permission: {
                view: singlePermissionDetail?.building_details_permission?.view,
                create: singlePermissionDetail?.building_details_permission?.create,
                edit: singlePermissionDetail?.building_details_permission?.edit,
                delete: singlePermissionDetail?.building_details_permission?.delete,
            },
            building_users_permission: {
                view: singlePermissionDetail?.building_users_permission?.view,
                create: singlePermissionDetail?.building_users_permission?.create,
                edit: singlePermissionDetail?.building_users_permission?.edit,
                delete: singlePermissionDetail?.building_users_permission?.delete,
            },
            building_layout_permission: {
                view: singlePermissionDetail?.building_layout_permission?.view,
                create: singlePermissionDetail?.building_layout_permission?.create,
                edit: singlePermissionDetail?.building_layout_permission?.edit,
                delete: singlePermissionDetail?.building_layout_permission?.delete,
            },
            building_equipment_permission: {
                view: singlePermissionDetail?.building_equipment_permission?.view,
                create: singlePermissionDetail?.building_equipment_permission?.create,
                edit: singlePermissionDetail?.building_equipment_permission?.edit,
                delete: singlePermissionDetail?.building_equipment_permission?.delete,
            },
            building_utility_permission: {
                view: singlePermissionDetail?.building_utility_permission?.view,
                create: singlePermissionDetail?.building_utility_permission?.create,
                edit: singlePermissionDetail?.building_utility_permission?.edit,
                delete: singlePermissionDetail?.building_utility_permission?.delete,
            },
            building_panels_permission: {
                view: singlePermissionDetail?.building_panels_permission?.view,
                create: singlePermissionDetail?.building_panels_permission?.create,
                edit: singlePermissionDetail?.building_panels_permission?.edit,
                delete: singlePermissionDetail?.building_panels_permission?.delete,
            },
            advanced_active_device_permission: {
                view: singlePermissionDetail?.advanced_active_device_permission?.view,
                create: singlePermissionDetail?.advanced_active_device_permission?.create,
                edit: singlePermissionDetail?.advanced_active_device_permission?.edit,
                delete: singlePermissionDetail?.advanced_active_device_permission?.delete,
            },
            advanced_passive_device_permission: {
                view: singlePermissionDetail?.advanced_passive_device_permission?.view,
                create: singlePermissionDetail?.advanced_passive_device_permission?.create,
                edit: singlePermissionDetail?.advanced_passive_device_permission?.edit,
                delete: singlePermissionDetail?.advanced_passive_device_permission?.delete,
            },
            advanced_gateways_permission: {
                view: singlePermissionDetail?.advanced_gateways_permission?.view,
                create: singlePermissionDetail?.advanced_gateways_permission?.create,
                edit: singlePermissionDetail?.advanced_gateways_permission?.edit,
                delete: singlePermissionDetail?.advanced_gateways_permission?.delete,
            },
        });
        setBuildingViewChecked(singlePermissionDetail?.energy_building_permission?.create);
        setPortfolioChecked(singlePermissionDetail?.energy_portfolio_permission?.create);
        setWorkspacePlanningChecked(singlePermissionDetail?.workspace_planning_permission?.create);
        setPortfolioViewChecked(singlePermissionDetail?.workspace_portfolio_permission?.create);
        setExploreChecked(singlePermissionDetail?.explore_general_permission?.create);
        setControlControlChecked(singlePermissionDetail?.control_control_permission?.create);
    }, [singlePermissionDetail]);

    const [loadingButton, setLoadingButton] = useState(true);

    // TODO: Create Permission Detail
    const createPermissionRoleFunc = async () => {
        let header = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        await axios
            .post(`${BaseUrl}${createPermissionRole}`, userPermissionRoleBody, { headers: header })
            .then((res) => {
                history.push('/settings/roles');
            });
    };

    // ! Get Single Permission Detail
    const getSinglePermissionRoleFunc = async () => {
        let header = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        await axios
            .get(`${BaseUrl}${getPermissionSingleDetail}?permission_id=${roleId}`, { headers: header })
            .then((res) => {
                setSinglePermissionDetail(res?.data?.data?.permission_details);
                setRoleName(res?.data?.data?.permission_details?.name);
            });
    };

    useEffect(() => {
        if (roleId) {
            getSinglePermissionRoleFunc();
        }
    }, [roleId]);

    return (
        <React.Fragment>
            {/* ---------------- Page Heading ----------------  */}
            <Row className="page-title">
                <Col lg={10} className="d-flex justify-content-between">
                    <div>
                        <span className="heading-style">{roleName}</span>
                    </div>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-light font-weight-bold cancel-btn-style"
                                onClick={() => {
                                    setFormValidation(false);
                                }}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold ml-2"
                                onClick={createPermissionRoleFunc}
                                disabled={!formValidation}>
                                Save
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* ---------------- Role Name ----------------  */}

            <Row className="mt-2">
                <Form>
                    <FormGroup className="mb-3" controlId="exampleForm.ControlInput1">
                        <div className="user-role-style">
                            <h6 className="card-title">Role Name</h6>
                        </div>

                        <div className="">
                            <Input
                                type="text"
                                name="text"
                                id="exampleSelect"
                                className="font-weight-bold user-role-textbox"
                                onChange={(e) => {
                                    setRoleName(e.target.value);
                                    setUserPermissionRoleBody({ ...userPermissionRoleBody, name: e.target.value });
                                }}
                                value={userPermissionRoleBody?.name}></Input>
                        </div>
                    </FormGroup>
                </Form>
            </Row>

            {/* ---------------- Permission & User Tab ----------------  */}

            {/* <Row>
                <Col lg={5} className="mt-2">
                    <Nav className="nav nav-pills navtab-bg nav-justified ml-2">
                        {tabContents.map((tab, index) => {
                            return (
                                <NavItem key={index}>
                                    <NavLink
                                        href="#"
                                        className={classnames({ active: activeTab === tab.id })}
                                        onClick={() => {
                                            toggleTab(tab.id);
                                        }}>
                                        <i className={classnames(tab.icon, 'd-sm-none', 'd-block', 'mr-1')}></i>
                                        <span className="d-none d-sm-block">{tab.title}</span>
                                    </NavLink>
                                </NavItem>
                            );
                        })}
                    </Nav>
                </Col>
            </Row> */}

            {/* {activeTab === '1' && ( */}
            <>
                {/* ---------------- Account Permission Heading ----------------  */}

                <Row style={{ marginLeft: '15px' }}>
                    <Col lg={10} className="mt-4">
                        <FormGroup>
                            <div className="single-line-style">
                                <h6 className="card-title">Account Permissions</h6>
                                <h6 className="card-subtitle text-muted" htmlFor="customSwitches">
                                    These permissions apply to the entire Dunder Mifflin account. Make sure this role
                                    really needs these permissions!
                                </h6>
                            </div>
                        </FormGroup>
                    </Col>
                </Row>

                {/* ---------------- Account Permission Container ----------------  */}

                <Row className="mt-2">
                    <Col lg={10}>
                        <Card className="custom-card card-alignment">
                            <CardHeader>
                                <Row>
                                    <Col lg={6}>
                                        <div>
                                            <h5 className="header-title" style={{ margin: '2px' }}>
                                                Account Permissions
                                            </h5>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="full-access-header1 float-right">
                                            <Switch
                                                onChange={() => setChecked(!checked)}
                                                checked={checked}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                                height={20}
                                                width={36}
                                            />
                                            <span className="ml-2 full-access-font">Full Access</span>
                                        </div>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <div className="grid-style-3">
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">General Information</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to view and edit total account general information.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="view"
                                                        checked={
                                                            userPermissionRoleBody?.account_general_permission?.view
                                                        }
                                                        label="View"
                                                        inline
                                                        onChange={(e) => {
                                                            // setAccount_general_permission({
                                                            //     ...account_general_permission,
                                                            //     view: e.target.checked,
                                                            // });
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_general_permission: {
                                                                    ...userPermissionRoleBody.account_general_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div></div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="edit"
                                                        label="Edit"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.account_general_permission?.edit
                                                        }
                                                        disabled={false}
                                                        onChange={(e) => {
                                                            // setAccount_general_permission({
                                                            //     ...account_general_permission,
                                                            //     edit: e.target.checked,
                                                            // });
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_general_permission: {
                                                                    ...userPermissionRoleBody.account_general_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div></div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Buildings</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to manage all buildings in an account.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="BuildingsView"
                                                        label="View"
                                                        inline
                                                        disabled={false}
                                                        checked={
                                                            userPermissionRoleBody?.account_buildings_permission?.view
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_buildings_permission: {
                                                                    ...userPermissionRoleBody.account_buildings_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="BuildingsCreate"
                                                        label="Create"
                                                        inline
                                                        disabled={false}
                                                        checked={
                                                            userPermissionRoleBody?.account_buildings_permission?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_buildings_permission: {
                                                                    ...userPermissionRoleBody.account_buildings_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="BuildingsEdit"
                                                        label="Edit"
                                                        inline
                                                        disabled={false}
                                                        checked={
                                                            userPermissionRoleBody?.account_buildings_permission?.edit
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_buildings_permission: {
                                                                    ...userPermissionRoleBody.account_buildings_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="BuildingsDelete"
                                                        label="Delete"
                                                        inline
                                                        disabled={false}
                                                        checked={
                                                            userPermissionRoleBody?.account_buildings_permission?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_buildings_permission: {
                                                                    ...userPermissionRoleBody.account_buildings_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Users</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to manage users in an account.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="usersView"
                                                        label="View"
                                                        inline
                                                        checked={userPermissionRoleBody?.account_user_permission?.view}
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_user_permission: {
                                                                    ...userPermissionRoleBody.account_user_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="usersCreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.account_user_permission?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_user_permission: {
                                                                    ...userPermissionRoleBody.account_user_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="usersEdit"
                                                        label="Edit"
                                                        inline
                                                        checked={userPermissionRoleBody?.account_user_permission?.edit}
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_user_permission: {
                                                                    ...userPermissionRoleBody.account_user_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="usersDelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.account_user_permission?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_user_permission: {
                                                                    ...userPermissionRoleBody.account_user_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Roles</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to manage roles in an account.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="rolesview"
                                                        label="View"
                                                        inline
                                                        checked={userPermissionRoleBody?.account_roles_permission?.view}
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_roles_permission: {
                                                                    ...userPermissionRoleBody.account_roles_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="rolescreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.account_roles_permission?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_roles_permission: {
                                                                    ...userPermissionRoleBody.account_roles_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="rolesedit"
                                                        label="Edit"
                                                        inline
                                                        checked={userPermissionRoleBody?.account_roles_permission?.edit}
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_roles_permission: {
                                                                    ...userPermissionRoleBody.account_roles_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="rolesdelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.account_roles_permission?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                account_roles_permission: {
                                                                    ...userPermissionRoleBody.account_roles_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* ---------------- Building Specific Container ----------------  */}

                <Row style={{ marginLeft: '15px' }}>
                    <Col lg={10} className="mt-4">
                        <FormGroup>
                            <div className="single-line-style">
                                <h6 className="card-title">Building-Specific Permissions</h6>
                                <h6 className="card-subtitle text-muted" htmlFor="customSwitches">
                                    Permissions below apply only to buildings this role is attached to when assigned to
                                    a user.
                                </h6>
                            </div>
                        </FormGroup>
                    </Col>
                </Row>

                {/* ---------------- Energy Container ----------------  */}

                <Row className="mt-2">
                    <Col lg={10}>
                        <Card className="custom-card card-alignment">
                            <CardHeader>
                                <h5 className="header-title" style={{ margin: '2px' }}>
                                    Energy
                                </h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <div className="grid-style-3">
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Building View</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Allow access to the building-specific views in the Energy app.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <Switch
                                                checked={buildingViewChecked}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                                height={24}
                                                width={44}
                                                onChange={(e) => {
                                                    setBuildingViewChecked(!buildingViewChecked);
                                                    setUserPermissionRoleBody({
                                                        ...userPermissionRoleBody,
                                                        energy_building_permission: {
                                                            // ...userPermissionRoleBody.energy_building_permission,
                                                            view: e,
                                                            create: e,
                                                            edit: e,
                                                            delete: e,
                                                        },
                                                    });
                                                }}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Portfolio View</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Allow access to the full portfolio view in the Energy app.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <Switch
                                                checked={portfolioChecked}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                                height={24}
                                                width={44}
                                                onChange={(e) => {
                                                    setPortfolioChecked(!portfolioChecked);
                                                    setUserPermissionRoleBody({
                                                        ...userPermissionRoleBody,
                                                        energy_portfolio_permission: {
                                                            // ...userPermissionRoleBody.energy_building_permission,
                                                            view: e,
                                                            create: e,
                                                            edit: e,
                                                            delete: e,
                                                        },
                                                    });
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* ---------------- Workspace Planning Container ----------------  */}

                <Row className="mt-2">
                    <Col lg={10}>
                        <Card className="custom-card card-alignment">
                            <CardHeader>
                                <h5 className="header-title" style={{ margin: '2px' }}>
                                    Workspace Planning
                                </h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <div className="grid-style-3">
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Workspace Planning</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Allow access to the building-specific views in the Workspace app.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <Switch
                                                checked={workspacePlanningChecked}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                                height={24}
                                                width={44}
                                                onChange={(e) => {
                                                    setWorkspacePlanningChecked(!workspacePlanningChecked);
                                                    setUserPermissionRoleBody({
                                                        ...userPermissionRoleBody,
                                                        workspace_planning_permission: {
                                                            // ...userPermissionRoleBody.energy_building_permission,
                                                            view: e,
                                                            create: e,
                                                            edit: e,
                                                            delete: e,
                                                        },
                                                    });
                                                }}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Portfolio View</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Allow access to the full portfolio view in the Workspace App.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <Switch
                                                checked={portfolioViewChecked}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                                height={24}
                                                width={44}
                                                onChange={(e) => {
                                                    setPortfolioViewChecked(!portfolioViewChecked);
                                                    setUserPermissionRoleBody({
                                                        ...userPermissionRoleBody,
                                                        workspace_portfolio_permission: {
                                                            // ...userPermissionRoleBody.energy_building_permission,
                                                            view: e,
                                                            create: e,
                                                            edit: e,
                                                            delete: e,
                                                        },
                                                    });
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* ---------------- Explore Container ----------------  */}

                <Row className="mt-2">
                    <Col lg={10}>
                        <Card className="custom-card card-alignment">
                            <CardHeader>
                                <h5 className="header-title" style={{ margin: '2px' }}>
                                    Explore
                                </h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <div className="grid-style-3">
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Explore</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Allow access to the explore app.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <Switch
                                                checked={exploreChecked}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                                height={24}
                                                width={44}
                                                onChange={(e) => {
                                                    setExploreChecked(!exploreChecked);
                                                    setUserPermissionRoleBody({
                                                        ...userPermissionRoleBody,
                                                        explore_general_permission: {
                                                            // ...userPermissionRoleBody.energy_building_permission,
                                                            view: e,
                                                            create: e,
                                                            edit: e,
                                                            delete: e,
                                                        },
                                                    });
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* ---------------- Control Container ----------------  */}

                <Row className="mt-2">
                    <Col lg={10}>
                        <Card className="custom-card card-alignment">
                            <CardHeader>
                                <h5 className="header-title" style={{ margin: '2px' }}>
                                    Control
                                </h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <div className="grid-style-3">
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Control</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Allow access to the control app.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <Switch
                                                checked={controlControlChecked}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                                height={24}
                                                width={44}
                                                onChange={(e) => {
                                                    setControlControlChecked(!controlControlChecked);
                                                    setUserPermissionRoleBody({
                                                        ...userPermissionRoleBody,
                                                        control_control_permission: {
                                                            // ...userPermissionRoleBody.energy_building_permission,
                                                            view: e,
                                                            create: e,
                                                            edit: e,
                                                            delete: e,
                                                        },
                                                    });
                                                }}
                                            />
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Plug Rules</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Control access to plug rules.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="plugRulesview"
                                                        label="View"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.control_plug_rule_permission?.view
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                control_plug_rule_permission: {
                                                                    ...userPermissionRoleBody.control_plug_rule_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="plugRulescreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.control_plug_rule_permission?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                control_plug_rule_permission: {
                                                                    ...userPermissionRoleBody.control_plug_rule_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="plugRulesedit"
                                                        label="Edit"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.control_plug_rule_permission?.edit
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                control_plug_rule_permission: {
                                                                    ...userPermissionRoleBody.control_plug_rule_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="plugRulesdelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.control_plug_rule_permission?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                control_plug_rule_permission: {
                                                                    ...userPermissionRoleBody.control_plug_rule_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* ---------------- Building Configuration Container ----------------  */}

                <Row className="mt-2">
                    <Col lg={10}>
                        <Card className="custom-card card-alignment">
                            <CardHeader>
                                <Row>
                                    <Col lg={6}>
                                        <div>
                                            <h5 className="header-title" style={{ margin: '2px' }}>
                                                Building Configuration
                                            </h5>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="full-access-header1 float-right">
                                            <Switch
                                                onChange={() => setCheckedBuildingConf(!checkedBuildingConf)}
                                                checked={checkedBuildingConf}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                                height={20}
                                                width={36}
                                            />
                                            <span className="ml-2 full-access-font">Full Access</span>
                                        </div>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <div className="grid-style-3">
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Building Details</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to view and edit total account details.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingDetailsview"
                                                        label="View"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_details_permission?.view
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_details_permission: {
                                                                    ...userPermissionRoleBody.building_details_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingDetailscreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_details_permission?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_details_permission: {
                                                                    ...userPermissionRoleBody.building_details_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingDetailsedit"
                                                        label="Edit"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_details_permission?.edit
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_details_permission: {
                                                                    ...userPermissionRoleBody.building_details_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingDetailsdelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_details_permission?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_details_permission: {
                                                                    ...userPermissionRoleBody.building_details_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Users</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to manage users in an building.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingUserview"
                                                        label="View"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_users_permission?.view
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_users_permission: {
                                                                    ...userPermissionRoleBody.building_users_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingUsercreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_users_permission?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_users_permission: {
                                                                    ...userPermissionRoleBody.building_users_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingUseredit"
                                                        label="Edit"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_users_permission?.edit
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_users_permission: {
                                                                    ...userPermissionRoleBody.building_users_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingUserdelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_users_permission?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_users_permission: {
                                                                    ...userPermissionRoleBody.building_users_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Layout</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to manage the layout of a building.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingLayoutview"
                                                        label="View"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_layout_permission?.view
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_layout_permission: {
                                                                    ...userPermissionRoleBody.building_layout_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingLayoutcreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_layout_permission?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_layout_permission: {
                                                                    ...userPermissionRoleBody.building_layout_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingLayoutedit"
                                                        label="Edit"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_layout_permission?.edit
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_layout_permission: {
                                                                    ...userPermissionRoleBody.building_layout_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingLayoutdelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_layout_permission?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_layout_permission: {
                                                                    ...userPermissionRoleBody.building_layout_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Equipment</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to manage equipment in a building.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingEquipmentview"
                                                        label="View"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_equipment_permission?.view
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_equipment_permission: {
                                                                    ...userPermissionRoleBody.building_equipment_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingEquipmentcreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_equipment_permission
                                                                ?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_equipment_permission: {
                                                                    ...userPermissionRoleBody.building_equipment_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingEquipmentedit"
                                                        label="Edit"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_equipment_permission?.edit
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_equipment_permission: {
                                                                    ...userPermissionRoleBody.building_equipment_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingEquipmentdelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_equipment_permission
                                                                ?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_equipment_permission: {
                                                                    ...userPermissionRoleBody.building_equipment_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Utility Bills</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to manage utility bills for a building.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingUtilityview"
                                                        label="View"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_utility_permission?.view
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_utility_permission: {
                                                                    ...userPermissionRoleBody.building_utility_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingUtilityviewcreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_utility_permission?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_utility_permission: {
                                                                    ...userPermissionRoleBody.building_utility_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingUtilityviewedit"
                                                        label="Edit"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_utility_permission?.edit
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_utility_permission: {
                                                                    ...userPermissionRoleBody.building_utility_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingUtilityviewdelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_utility_permission?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_utility_permission: {
                                                                    ...userPermissionRoleBody.building_utility_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Panels</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to manage electrical panels in a building.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingPanelview"
                                                        label="View"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_panels_permission?.view
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_panels_permission: {
                                                                    ...userPermissionRoleBody.building_panels_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingPanelcreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_panels_permission?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_panels_permission: {
                                                                    ...userPermissionRoleBody.building_panels_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingPaneledit"
                                                        label="Edit"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_panels_permission?.edit
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_panels_permission: {
                                                                    ...userPermissionRoleBody.building_panels_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="buildingPaneldelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.building_panels_permission?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                building_panels_permission: {
                                                                    ...userPermissionRoleBody.building_panels_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* ---------------- Advanced Configuration Container ----------------  */}

                <Row className="mt-2">
                    <Col lg={10}>
                        <Card className="custom-card card-alignment">
                            <CardHeader>
                                <Row>
                                    <Col lg={6}>
                                        <div>
                                            <h5 className="header-title" style={{ margin: '2px' }}>
                                                Advanced Configuration
                                            </h5>
                                        </div>
                                    </Col>
                                    <Col lg={6}>
                                        <div className="full-access-header1 float-right">
                                            <Switch
                                                onChange={() => setCheckedAdvancedConf(!checkedAdvancedConf)}
                                                checked={checkedAdvancedConf}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                                height={20}
                                                width={36}
                                            />
                                            <span className="ml-2 full-access-font">Full Access</span>
                                        </div>
                                    </Col>
                                </Row>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <div className="grid-style-3">
                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Active Devices</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to manage active devices in an account.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedSmartPlugsview"
                                                        label="View"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_active_device_permission
                                                                ?.view
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_active_device_permission: {
                                                                    ...userPermissionRoleBody.advanced_active_device_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedSmartPlugscreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_active_device_permission
                                                                ?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_active_device_permission: {
                                                                    ...userPermissionRoleBody.advanced_active_device_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedSmartPlugsedit"
                                                        label="Edit"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_active_device_permission
                                                                ?.edit
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_active_device_permission: {
                                                                    ...userPermissionRoleBody.advanced_active_device_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedSmartPlugsdelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_active_device_permission
                                                                ?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_active_device_permission: {
                                                                    ...userPermissionRoleBody.advanced_active_device_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Passive Devices</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to manage passive devices in a building.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedSmartMonitorview"
                                                        label="View"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_passive_device_permission
                                                                ?.view
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_passive_device_permission: {
                                                                    ...userPermissionRoleBody.advanced_passive_device_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedSmartMonitorcreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_passive_device_permission
                                                                ?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_passive_device_permission: {
                                                                    ...userPermissionRoleBody.advanced_passive_device_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedSmartMonitoredit"
                                                        label="Edit"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_passive_device_permission
                                                                ?.edit
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_passive_device_permission: {
                                                                    ...userPermissionRoleBody.advanced_passive_device_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedSmartMonitordelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_passive_device_permission
                                                                ?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_passive_device_permission: {
                                                                    ...userPermissionRoleBody.advanced_passive_device_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="single-line-style">
                                                <h6 className="card-title">Gateways</h6>
                                                <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                    Ability to manage connection gateways in a building.
                                                </h6>
                                            </div>
                                        </FormGroup>

                                        <FormGroup>
                                            <div className="grid-style-five">
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedGatewayview"
                                                        label="View"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_gateways_permission?.view
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_gateways_permission: {
                                                                    ...userPermissionRoleBody.advanced_gateways_permission,
                                                                    view: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedGatewaycreate"
                                                        label="Create"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_gateways_permission?.create
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_gateways_permission: {
                                                                    ...userPermissionRoleBody.advanced_gateways_permission,
                                                                    create: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedGatewayedit"
                                                        label="Edit"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_gateways_permission?.edit
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_gateways_permission: {
                                                                    ...userPermissionRoleBody.advanced_gateways_permission,
                                                                    edit: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <CustomInput
                                                        type="checkbox"
                                                        id="advancedGatewaydelete"
                                                        label="Delete"
                                                        inline
                                                        checked={
                                                            userPermissionRoleBody?.advanced_gateways_permission?.delete
                                                        }
                                                        onChange={(e) => {
                                                            setUserPermissionRoleBody({
                                                                ...userPermissionRoleBody,
                                                                advanced_gateways_permission: {
                                                                    ...userPermissionRoleBody.advanced_gateways_permission,
                                                                    delete: e.target.checked,
                                                                },
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </FormGroup>
                                    </div>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>

                {/* ---------------- Danger Zone ----------------  */}

                <Row>
                    <Col lg={10}>
                        <Card className="custom-card card-alignment">
                            <CardHeader>
                                <h5 className="header-title" style={{ margin: '2px' }}>
                                    Danger Zone
                                </h5>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                    <FormGroup>
                                        <button
                                            type="button"
                                            className="btn btn-md btn-danger font-weight-bold trash-button-style">
                                            <i className="uil uil-trash mr-2"></i>Delete Building
                                        </button>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </>
            {/* )} */}

            {/* {activeTab === '2' && (
                <>
                    <Row>
                        <Col lg={10}>
                            <UserTable userData={userData} />
                        </Col>
                    </Row>
                </>
            )} */}
        </React.Fragment>
    );
};

export default SingleRole;
