import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Label,
    Input,
    FormGroup,
    Select,
    Card,
    CardBody,
    Table,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
} from 'reactstrap';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { BaseUrl, getLocation, generalPanels, generalPassiveDevices } from '../../../services/Network';
import '../style.css';

const CreatePanel = () => {
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [breakersStruct, setBreakersStruct] = useState([]);

    const sampleStructure = [
        { serialNo: 1, name: '' },
        { serialNo: 2, name: '' },
        { serialNo: 3, name: '' },
        { serialNo: 4, name: '' },
        { serialNo: 5, name: '' },
        { serialNo: 6, name: '' },
        { serialNo: 7, name: '' },
        { serialNo: 8, name: '' },
        { serialNo: 9, name: '' },
        { serialNo: 10, name: '' },
        { serialNo: 11, name: '' },
        { serialNo: 12, name: '' },
        { serialNo: 13, name: '' },
        { serialNo: 14, name: '' },
        { serialNo: 15, name: '' },
        { serialNo: 16, name: '' },
        { serialNo: 17, name: '' },
        { serialNo: 18, name: '' },
        { serialNo: 19, name: '' },
        { serialNo: 20, name: '' },
        { serialNo: 21, name: '' },
        { serialNo: 22, name: '' },
        { serialNo: 23, name: '' },
        { serialNo: 24, name: '' },
        { serialNo: 25, name: '' },
        { serialNo: 26, name: '' },
        { serialNo: 27, name: '' },
        { serialNo: 28, name: '' },
        { serialNo: 29, name: '' },
        { serialNo: 30, name: '' },
        { serialNo: 31, name: '' },
        { serialNo: 32, name: '' },
        { serialNo: 33, name: '' },
        { serialNo: 34, name: '' },
        { serialNo: 35, name: '' },
        { serialNo: 36, name: '' },
        { serialNo: 37, name: '' },
        { serialNo: 38, name: '' },
        { serialNo: 39, name: '' },
        { serialNo: 40, name: '' },
        { serialNo: 41, name: '' },
        { serialNo: 42, name: '' },
        { serialNo: 43, name: '' },
        { serialNo: 44, name: '' },
        { serialNo: 45, name: '' },
        { serialNo: 46, name: '' },
        { serialNo: 47, name: '' },
        { serialNo: 48, name: '' },
    ];

    const [breakersCount, setBreakersCount] = useState(48);
    const [locationData, setLocationData] = useState([]);
    const [generalPanelData, setGeneralPanelData] = useState([]);
    const [passiveDeviceData, setPassiveDeviceData] = useState([]);
    const [vendor, setVendor] = useState([
        { value: 'Breaker', label: 'Breaker' },
        { value: 'Hydra', label: 'Hydra' },
    ]);
    const [selectedVendor, setSelectedVendor] = useState(vendor[0].label);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Create Panel',
                        path: '/settings/createPanel',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        const fetchLocationData = async () => {
            try {
                if (bldgId) {
                    let headers = {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                    };
                    // await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                    await axios.get(`${BaseUrl}${getLocation}/62581924c65bf3a1d702e427`, { headers }).then((res) => {
                        setLocationData(res.data);
                    });
                }
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Location Data');
            }
        };

        const fetchPanelsData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                await axios.get(`${BaseUrl}${generalPanels}`, { headers }).then((res) => {
                    setGeneralPanelData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Panels Data List');
            }
        };

        const fetchPassiveDeviceData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                await axios.get(`${BaseUrl}${generalPassiveDevices}`, { headers }).then((res) => {
                    setPassiveDeviceData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch all Passive devices');
            }
        };

        fetchLocationData();
        fetchPanelsData();
        fetchPassiveDeviceData();
    }, [bldgId]);

    return (
        <React.Fragment>
            <Row className="page-title" style={{ marginLeft: '20px' }}>
                <Col className="header-container" xl={10}>
                    <span className="heading-style">New Panel</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="ml-2">
                            <Link to="/settings/panels">
                                <button type="button" className="btn btn-md btn-light font-weight-bold mr-2">
                                    Cancel
                                </button>
                            </Link>
                            <Link to="/settings/createPanel">
                                <button type="button" className="btn btn-md btn-primary font-weight-bold">
                                    Save
                                </button>
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row style={{ marginLeft: '20px' }}>
                <Col xl={10}>
                    <div className="grid-style-5 mt-4">
                        <FormGroup>
                            <Label for="panelName" className="card-title">
                                Name
                            </Label>
                            <Input type="text" name="panelName" id="panelName" placeholder="Panel Name" />
                        </FormGroup>

                        <FormGroup>
                            <Label for="userState" className="card-title">
                                Parent Panel
                            </Label>
                            <Input type="select" name="state" id="userState" className="font-weight-bold">
                                <option>None</option>
                                {generalPanelData.map((record) => {
                                    return <option value={record.panel_id}>{record.panel_name}</option>;
                                })}
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Label for="location" className="card-title">
                                Location
                            </Label>
                            <Input type="select" name="state" id="userState" className="font-weight-bold">
                                <option>Select Location</option>
                                {locationData.map((record) => {
                                    return <option value={record.id}>{record.location_name}</option>;
                                })}
                            </Input>
                        </FormGroup>
                    </div>
                </Col>
            </Row>

            <Row style={{ marginLeft: '20px' }}>
                <Col xl={10}>
                    <div className="grid-style-5 mt-4">
                        <FormGroup>
                            <Label for="userState" className="card-title">
                                Vendor Type
                            </Label>
                            <div>
                                <Input
                                    type="select"
                                    name="typee"
                                    id="exampleSelect"
                                    onChange={(e) => setSelectedVendor(e.target.value)}
                                    value={selectedVendor}
                                    className="font-weight-bold">
                                    {vendor.map((record) => {
                                        return <option value={record.value}>{record.label}</option>;
                                    })}
                                </Input>
                            </div>
                        </FormGroup>

                        {selectedVendor === 'Hydra' && (
                            <FormGroup>
                                <Label for="userState" className="card-title">
                                    Select Device
                                </Label>
                                <Input type="select" name="state" id="userState" className="font-weight-bold">
                                    <option>Select Device</option>
                                    {passiveDeviceData.map((record) => {
                                        return <option value={record.equipments_id}>{record.model}</option>;
                                    })}
                                </Input>
                            </FormGroup>
                        )}
                    </div>
                </Col>
            </Row>

            {selectedVendor === 'Breaker' && (
                <Row style={{ marginLeft: '20px' }}>
                    <Col xl={10}>
                        <div className="panel-container-style mt-4">
                            <Row>
                                <Col lg={3}>
                                    <div>
                                        <FormGroup className="form-group row m-4">
                                            <Label for="panelName" className="card-title">
                                                Number of Breakers
                                            </Label>
                                            <Input
                                                type="number"
                                                name="breakers"
                                                id="breakers"
                                                defaultValue={breakersCount}
                                            />
                                        </FormGroup>
                                    </div>
                                </Col>
                                <Col lg={9}>
                                    <div className="float-right m-4">
                                        <button type="button" className="btn btn-md btn-secondary font-weight-bold ">
                                            Done
                                        </button>
                                    </div>
                                </Col>
                            </Row>

                            <Row>
                                <Col lg={4}></Col>
                                <Col lg={4}>
                                    <FormGroup className="form-group row m-4">
                                        <div className="breaker-container">
                                            <div className="breaker-style">
                                                <div className="breaker-content-middle">
                                                    <div className="breaker-index">1</div>
                                                </div>
                                                <div className="breaker-content-middle">
                                                    <div className="dot-status"></div>
                                                </div>
                                                <div className="breaker-content-middle">
                                                    <div className="breaker-content">
                                                        <span>200A</span>
                                                        <span>240V</span>
                                                    </div>
                                                </div>
                                                <div className="breaker-content-middle">
                                                    <div className="edit-icon-bg-styling">
                                                        <i className="uil uil-pen"></i>
                                                    </div>
                                                </div>
                                                <div className="breaker-content-middle">
                                                    <span className="font-weight-bold edit-btn-styling">Edit</span>
                                                </div>
                                            </div>
                                        </div>
                                    </FormGroup>
                                </Col>
                                <Col lg={4}></Col>
                            </Row>

                            <Row>
                                <Col lg={12}>
                                    <div>
                                        <div className="grid-style-6">
                                            {sampleStructure.map((breaker, index) => {
                                                return (
                                                    <FormGroup className="form-group row m-2 ml-4">
                                                        <div className="breaker-container">
                                                            <div className="sub-breaker-style">
                                                                <div className="breaker-content-middle">
                                                                    <div className="breaker-index">
                                                                        {breaker.serialNo}
                                                                    </div>
                                                                </div>
                                                                <div className="breaker-content-middle">
                                                                    <div className="dot-status"></div>
                                                                </div>
                                                                <div className="breaker-content-middle">
                                                                    <div className="breaker-content">
                                                                        <span>20A</span>
                                                                        <span>120V</span>
                                                                    </div>
                                                                </div>
                                                                <div className="breaker-content-middle">
                                                                    <div className="edit-icon-bg-styling">
                                                                        <i className="uil uil-pen"></i>
                                                                    </div>
                                                                </div>
                                                                <div className="breaker-content-middle">
                                                                    <span className="font-weight-bold edit-btn-styling">
                                                                        Edit
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </FormGroup>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Col>
                </Row>
            )}
        </React.Fragment>
    );
};

export default CreatePanel;
