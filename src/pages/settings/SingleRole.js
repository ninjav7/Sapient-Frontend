import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    FormGroup,
    Label,
    Input,
    CardHeader,
    TabContent,
    TabPane,
    Nav,
    NavItem,
    NavLink,
    CustomInput,
} from 'reactstrap';
import Switch from 'react-switch';
import Form from 'react-bootstrap/Form';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import TimePicker from 'react-time-picker';
import 'react-time-picker/dist/TimePicker.css';
import './style.css';
import {
    BaseUrl,
    generalBuildingDetail,
    generalBuildingAddress,
    generalDateTime,
    generalOperatingHours,
} from '../../services/Network';
import axios from 'axios';
import classnames from 'classnames';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';

const SingleRole = () => {
    const [checked, setChecked] = useState(true);
    const [activeTab, setActiveTab] = useState('1');

    const tabContents = [
        {
            id: '1',
            title: 'Permissions',
            icon: 'uil-home-alt',
        },
        {
            id: '2',
            title: 'Users (5)',
            icon: 'uil-user',
        },
    ];

    const toggleTab = (tab) => {
        if (activeTab !== tab) {
            setActiveTab(tab);
        }
    };

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Account Administrator',
                        path: '/settings/role-config',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            {/* ---------------- Page Heading ----------------  */}
            <Row className="page-title">
                <Col lg={10} className="header-container">
                    <div>
                        <span className="heading-style" style={{ marginLeft: '20px' }}>
                            Account Administrator
                        </span>
                    </div>

                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div className="float-right ml-2">
                            <button
                                type="button"
                                className="btn btn-md btn-light font-weight-bold cancel-btn-style"
                                onClick={() => {}}>
                                Cancel
                            </button>
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold ml-2"
                                onClick={() => {}}>
                                Save
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            {/* ---------------- Role Name ----------------  */}

            <Row className="mt-2" style={{ marginLeft: '20px' }}>
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
                                value="Account Administrator"></Input>
                        </div>
                    </FormGroup>
                </Form>
            </Row>

            {/* ---------------- Permission & User Tab ----------------  */}

            <Row>
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
            </Row>

            {/* ---------------- Account Permission Heading ----------------  */}

            <Row style={{ marginLeft: '15px' }}>
                <Col lg={10} className="mt-4">
                    <FormGroup>
                        <div className="single-line-style">
                            <h6 className="card-title">Account Permissions</h6>
                            <h6 className="card-subtitle text-muted" htmlFor="customSwitches">
                                These permissions apply to the entire Dunder Mifflin account. Make sure this role really
                                needs these permissions!
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
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                {/* <CustomInput type="checkbox" id="create" label="Create" inline /> */}
                                            </div>
                                            <div>
                                                <CustomInput
                                                    type="checkbox"
                                                    id="edit"
                                                    label="Edit"
                                                    inline
                                                    disabled={false}
                                                />
                                            </div>
                                            <div>
                                                {/* <div key={`default-checkbox`} className="mb-3">
                                                    <Form.Check
                                                        type="checkbox"
                                                        id={`default-checkbox`}
                                                        label={`disabled checkbox`}
                                                        disabled={true}
                                                    />
                                                </div> */}
                                            </div>
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
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
                                Permissions below apply only to buildings this role is attached to when assigned to a
                                user.
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
                                            onChange={() => setChecked(!checked)}
                                            checked={checked}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                            height={24}
                                            width={44}
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
                                            onChange={() => setChecked(!checked)}
                                            checked={checked}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                            height={24}
                                            width={44}
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
                                            onChange={() => setChecked(!checked)}
                                            checked={checked}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                            height={24}
                                            width={44}
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
                                            onChange={() => setChecked(!checked)}
                                            checked={checked}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                            height={24}
                                            width={44}
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
                                            onChange={() => setChecked(!checked)}
                                            checked={checked}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                            height={24}
                                            width={44}
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
                                            onChange={() => setChecked(!checked)}
                                            checked={checked}
                                            onColor={'#2955E7'}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                            height={24}
                                            width={44}
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
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
                                            <h6 className="card-title">Building Details</h6>
                                            <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                Ability to view and edit total account details.
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="grid-style-five">
                                            <div>
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
                                            <h6 className="card-title">Smart Plugs</h6>
                                            <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                Ability to manage smart plugs in an account.
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="grid-style-five">
                                            <div>
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
                                            </div>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-title">Smart Monitors</h6>
                                            <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                Ability to manage smart monitors in a building.
                                            </h6>
                                        </div>
                                    </FormGroup>

                                    <FormGroup>
                                        <div className="grid-style-five">
                                            <div>
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
                                                <CustomInput type="checkbox" id="view" label="View" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="create" label="Create" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="edit" label="Edit" inline />
                                            </div>
                                            <div>
                                                <CustomInput type="checkbox" id="delete" label="Delete" inline />
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
        </React.Fragment>
    );
};

export default SingleRole;
