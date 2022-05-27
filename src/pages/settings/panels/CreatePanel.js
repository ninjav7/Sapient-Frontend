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
    Button,
} from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { BaseUrl, getLocation, generalPanels, generalPassiveDevices } from '../../../services/Network';
import '../style.css';

const CreatePanel = () => {
    // Breakers Modal
    const [showBreaker, setShowBreaker] = useState(false);
    const handleBreakerClose = () => setShowBreaker(false);
    const handleBreakerShow = () => setShowBreaker(true);

    // Hydra Modals
    const [showHydra, setShowHydra] = useState(false);
    const handleHydraClose = () => setShowHydra(false);
    const handleHydraShow = () => setShowHydra(true);

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [isProcessing, setIsProcessing] = useState(false);
    const [panel, setPanel] = useState({
        breaker_count: 48,
    });

    const [normalStruct, setNormalStruct] = useState([]);
    const [breakersStruct, setBreakersStruct] = useState([]);

    const [normalCount, setNormalCount] = useState(48);
    const [breakersCount, setBreakersCount] = useState(48);
    const [locationData, setLocationData] = useState([]);
    const [generalPanelData, setGeneralPanelData] = useState([]);
    const [passiveDeviceData, setPassiveDeviceData] = useState([]);
    const [vendor, setVendor] = useState([
        { value: 'Breaker', label: 'Breaker' },
        { value: 'Hydra', label: 'Hydra' },
    ]);
    const [selectedVendor, setSelectedVendor] = useState(vendor[0].label);
    const [isEditing, setIsEditing] = useState(true);

    const [hydraData, setHydraData] = useState({});
    const [normalData, setNormalData] = useState({});
    const [hydraDataIndex, setHydraDataIndex] = useState(0);
    const [normalDataIndex, setNormalDataIndex] = useState(0);

    const [mainBreaker, setMainBreaker] = useState({
        breakerNo: 0,
        name: '',
        type: 'main',
    });

    const [main, setMain] = useState({
        breakerNo: 0,
        equipment_name: '',
        type: 'main',
    });

    const handleChange = (key, value) => {
        let obj = Object.assign({}, panel);
        if (key === 'breaker_count') {
            value = parseInt(value);
        }
        obj[key] = value;
        setPanel(obj);
    };

    const updateHydraSingleData = () => {
        if (hydraDataIndex !== -1) {
            let newArray = breakersStruct;
            newArray[hydraDataIndex] = hydraData;
            setBreakersStruct(newArray);
        } else {
            let obj = hydraData;
            setMainBreaker(obj);
        }
    };

    const updateNormalSingleData = () => {
        if (normalDataIndex !== -1) {
            let newArray = normalStruct;
            newArray[normalDataIndex] = normalData;
            setNormalStruct(newArray);
        } else {
            let obj = normalData;
            setMain(obj);
        }
    };

    const saveBreakerDataToPanel = () => {
        let obj = Object.assign({}, panel);
        let newArray = breakersStruct;
        newArray.push(mainBreaker);
        obj['breakers'] = newArray;
        obj['breaker_count'] = breakersCount;
        setPanel(obj);
    };

    const saveNormalDataToPanel = () => {
        let obj = Object.assign({}, panel);
        let newArray = normalStruct;
        newArray.push(main);
        obj['breakers'] = newArray;
        obj['breaker_count'] = normalCount;
        setPanel(obj);
    };

    const handleHydraChange = (key, value) => {
        let obj = Object.assign({}, hydraData);
        obj[key] = value;
        setHydraData(obj);
    };

    const handleNormalChange = (key, value) => {
        let obj = Object.assign({}, normalData);
        obj[key] = value;
        setNormalData(obj);
    };

    const savePanelData = async () => {
        try {
            if (selectedVendor === 'Hydra') {
                saveBreakerDataToPanel();
                console.log('Data to be send to network => ', panel);
            }
            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            alert('Failed to save Panel');
        }
    };

    useEffect(() => {
        let newBreakers = [];
        for (let index = 1; index <= breakersCount; index++) {
            let obj = {
                breakerNo: index,
                name: '',
                type: 'breaker',
            };
            newBreakers.push(obj);
        }
        setBreakersStruct(newBreakers);
    }, [breakersCount]);

    useEffect(() => {
        let newBreakers = [];
        for (let index = 1; index <= normalCount; index++) {
            let obj = {
                breakerNo: index,
                equipment_name: '',
                type: 'breaker',
            };
            newBreakers.push(obj);
        }
        setNormalStruct(newBreakers);
    }, [normalCount]);

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
                        // 'user-auth': '628f3144b712934f578be895',
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
                    // 'user-auth': '628f3144b712934f578be895',
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
                    // 'user-auth': '628f3144b712934f578be895',
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

    useEffect(() => {
        console.log('SSR panel => ', panel);
        console.log('SSR hydraDataIndex => ', hydraDataIndex);
        console.log('SSR breakersStruct => ', breakersStruct);
    });

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
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary font-weight-bold"
                                    disabled={isProcessing}
                                    onClick={() => savePanelData()}>
                                    {isProcessing ? 'Saving...' : 'Save'}
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
                            <Input
                                type="text"
                                name="panelName"
                                id="panelName"
                                placeholder="Panel Name"
                                onChange={(e) => {
                                    handleChange('name', e.target.value);
                                }}
                            />
                        </FormGroup>

                        <FormGroup>
                            <Label for="userState" className="card-title">
                                Parent Panel
                            </Label>
                            <Input
                                type="select"
                                name="state"
                                id="userState"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('parent_panel', e.target.value);
                                }}>
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
                            <Input
                                type="select"
                                name="state"
                                id="userState"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('space_id', e.target.value);
                                }}>
                                <option>Select Location</option>
                                {locationData.map((record) => {
                                    return <option value={record.location_id}>{record.location_name}</option>;
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
                                    onChange={(e) => {
                                        setSelectedVendor(e.target.value);
                                        handleChange('vendor', e.target.value);
                                    }}
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
                                <Input
                                    type="select"
                                    name="state"
                                    id="userState"
                                    className="font-weight-bold"
                                    onChange={(e) => {
                                        handleChange('device_id', e.target.value);
                                    }}>
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
                                                value={normalCount}
                                                onChange={(e) => {
                                                    setNormalCount(parseInt(e.target.value));
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                </Col>
                                <Col lg={9}>
                                    <div className="float-right m-4">
                                        <button
                                            type="button"
                                            className="btn btn-md btn-secondary font-weight-bold"
                                            onClick={() => {
                                                setIsEditing(!isEditing);
                                                saveNormalDataToPanel();
                                            }}>
                                            {isEditing ? 'Done' : 'Edit'}
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
                                                    <div className="breaker-index">M</div>
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
                                                {!(main.equipment_name === '') ? (
                                                    <div>
                                                        <h6 className="ml-4 mb-3 breaker-equip-name">
                                                            {main.equipment_name}
                                                        </h6>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div
                                                            className="breaker-content-middle"
                                                            onClick={() => {
                                                                handleBreakerShow();
                                                                setNormalData(main);
                                                                setNormalDataIndex(-1);
                                                            }}>
                                                            <div className="edit-icon-bg-styling mr-2">
                                                                <i className="uil uil-pen"></i>
                                                            </div>
                                                            <span className="font-weight-bold edit-btn-styling">
                                                                Edit
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
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
                                            {normalStruct.map((element, index) => {
                                                if (element.type === 'main') {
                                                    return;
                                                }
                                                return (
                                                    <FormGroup className="form-group row m-2 ml-4">
                                                        <div className="breaker-container">
                                                            <div className="sub-breaker-style">
                                                                <div className="breaker-content-middle">
                                                                    <div className="breaker-index">
                                                                        {element.breakerNo}
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
                                                                {!(element.equipment_name === '') ? (
                                                                    <div>
                                                                        <h6 className="ml-4 mb-3 breaker-equip-name">
                                                                            {element.equipment_name}
                                                                        </h6>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div
                                                                            className="breaker-content-middle"
                                                                            onClick={() => {
                                                                                handleBreakerShow();
                                                                                setNormalData(element);
                                                                                setNormalDataIndex(index);
                                                                            }}>
                                                                            <div className="edit-icon-bg-styling mr-2">
                                                                                <i className="uil uil-pen"></i>
                                                                            </div>
                                                                            <span className="font-weight-bold edit-btn-styling">
                                                                                Edit
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                )}
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

            {selectedVendor === 'Hydra' && (
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
                                                value={breakersCount}
                                                onChange={(e) => {
                                                    setBreakersCount(parseInt(e.target.value));
                                                }}
                                            />
                                        </FormGroup>
                                    </div>
                                </Col>
                                <Col lg={9}>
                                    <div className="float-right m-4">
                                        <button
                                            type="button"
                                            className="btn btn-md btn-secondary font-weight-bold"
                                            onClick={() => {
                                                setIsEditing(!isEditing);
                                                saveBreakerDataToPanel();
                                            }}>
                                            {isEditing ? 'Done' : 'Edit'}
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
                                                    <div className="breaker-index">M</div>
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

                                                {!(mainBreaker.name === '') ? (
                                                    <div>
                                                        <h6 className="ml-4 mb-3 breaker-equip-name">
                                                            {mainBreaker.name}
                                                        </h6>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div
                                                            className="breaker-content-middle"
                                                            onClick={() => {
                                                                handleHydraShow();
                                                                setHydraData(mainBreaker);
                                                                setHydraDataIndex(-1);
                                                            }}>
                                                            <div className="edit-icon-bg-styling mr-2">
                                                                <i className="uil uil-pen"></i>
                                                            </div>
                                                            <span className="font-weight-bold edit-btn-styling">
                                                                Edit
                                                            </span>
                                                        </div>
                                                    </>
                                                )}
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
                                            {breakersStruct.map((element, index) => {
                                                if (element.type === 'main') {
                                                    return;
                                                }
                                                return (
                                                    <FormGroup className="form-group row m-2 ml-4">
                                                        <div className="breaker-container">
                                                            <div className="sub-breaker-style">
                                                                <div className="breaker-content-middle">
                                                                    <div className="breaker-index">
                                                                        {element.breakerNo}
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
                                                                {!(element.name === '') ? (
                                                                    <div>
                                                                        <h6 className="ml-4 mb-3 breaker-equip-name">
                                                                            {element.name}
                                                                        </h6>
                                                                    </div>
                                                                ) : (
                                                                    <>
                                                                        <div
                                                                            className="breaker-content-middle"
                                                                            onClick={() => {
                                                                                handleHydraShow();
                                                                                setHydraData(element);
                                                                                setHydraDataIndex(index);
                                                                            }}>
                                                                            <div className="edit-icon-bg-styling mr-2">
                                                                                <i className="uil uil-pen"></i>
                                                                            </div>
                                                                            <span className="font-weight-bold edit-btn-styling">
                                                                                Edit
                                                                            </span>
                                                                        </div>
                                                                    </>
                                                                )}
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

            {/* Breaker modal  */}
            <Modal show={showBreaker} onHide={handleBreakerClose} centered>
                <Modal.Header>
                    <Modal.Title>Edit Breaker</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div class="container">
                            <div class="row">
                                <div class="col-6">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Apms</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Amps"
                                            className="font-weight-bold"
                                            onChange={(e) => {
                                                handleNormalChange('amps', e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </div>
                                <div class="col-6">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Volts</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Volts"
                                            className="font-weight-bold"
                                            onChange={(e) => {
                                                handleNormalChange('volts', e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>

                        <div class="container">
                            <div class="row">
                                <div class="col-6">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Device ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Device ID"
                                            className="font-weight-bold"
                                            onChange={(e) => {
                                                handleNormalChange('device_id', e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </div>
                                <div class="col-6">
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Sensors #</Form.Label>
                                        <Form.Control
                                            type="number"
                                            placeholder="Enter Sensors"
                                            className="font-weight-bold"
                                            onChange={(e) => {
                                                handleNormalChange('sensor', e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </div>
                            </div>
                        </div>

                        <Form.Group className="m-2 mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Equipment"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleNormalChange('equipment_name', e.target.value);
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleBreakerClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            updateNormalSingleData();
                            handleBreakerClose();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Hydra modal  */}
            <Modal show={showHydra} onHide={handleHydraClose} centered>
                <Modal.Header>
                    <Modal.Title>Edit Hydra</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Equipment Name"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleHydraChange('name', e.target.value);
                                }}
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleHydraClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            updateHydraSingleData();
                            handleHydraClose();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default CreatePanel;
