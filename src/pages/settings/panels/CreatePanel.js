import React, { useState, useEffect } from 'react';
import { Row, Col, Label, Input, FormGroup, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { BaseUrl, getLocation, generalPanels, generalPassiveDevices, createPanel } from '../../../services/Network';
import { v4 as uuidv4 } from 'uuid';
import '../style.css';
import './panel-style.css';

// const EditBreakerModal = ({
//     showEditBreaker,
//     handleEditBreakerClose,
//     handleNormalChange,
//     updateNormalSingleData,
//     updateData,
//     setUpdateData,
// }) => {
//     return (

//     );
// };

const CreatePanel = () => {
    // Create Modal
    const [showBreaker, setShowBreaker] = useState(false);
    const handleBreakerClose = () => setShowBreaker(false);
    const handleBreakerShow = () => setShowBreaker(true);

    // Edit Modal
    const [showEditBreaker, setShowEditBreaker] = useState(false);
    const handleEditBreakerClose = () => setShowEditBreaker(false);
    const handleEditBreakerShow = () => setShowEditBreaker(true);

    const [updateData, setUpdateData] = useState({});

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [isProcessing, setIsProcessing] = useState(false);
    const [panel, setPanel] = useState({
        breaker_count: 48,
    });

    const [normalStruct, setNormalStruct] = useState([]);

    const [normalCount, setNormalCount] = useState(48);
    const [disconnectBreakerCount, setDisconnectBreakerCount] = useState(3);
    const [locationData, setLocationData] = useState([]);
    const [panelType, setPanelType] = useState([
        {
            name: 'Distribution',
            value: 'distribution',
        },
        {
            name: 'Disconnect',
            value: 'disconnect',
        },
    ]);
    const [disconnectBreaker, setDisconnectBreaker] = useState([
        {
            name: '1',
            value: 1,
        },
        {
            name: '2',
            value: 2,
        },
        {
            name: '3',
            value: 3,
        },
    ]);
    const [activePanelType, setActivePanelType] = useState('distribution');
    const [generalPanelData, setGeneralPanelData] = useState([]);
    const [passiveDeviceData, setPassiveDeviceData] = useState([]);

    const [isEditing, setIsEditing] = useState(true);

    const [normalData, setNormalData] = useState({});
    const [normalDataIndex, setNormalDataIndex] = useState(0);

    // const getBreakerId = () => `breaker_${+new Date()}`;
    const { v4: uuidv4 } = require('uuid');
    const getBreakerId = () => uuidv4();

    const [main, setMain] = useState({
        phase: 1,
        voltage: '',
        amps: '',
        equipment_name: '',
        uniqueId: getBreakerId(),
        parentId: '',
        breakerNo: 0,
        type: 'main-breaker',
    });

    const handleChange = (key, value) => {
        let obj = Object.assign({}, panel);
        if (key === 'breaker_count') {
            value = parseInt(value);
        }
        obj[key] = value;
        setPanel(obj);
    };

    const addNormalSingleData = () => {
        if (normalDataIndex !== -1) {
            let newArray = normalStruct;
            newArray[normalDataIndex] = normalData;
            setNormalStruct(newArray);
        } else {
            let obj = normalData;
            obj.parentId = obj.uniqueId;
            setMain(obj);
        }
    };

    // Need to add logic to update record
    const updateNormalSingleData = () => {
        if (normalDataIndex !== -1) {
            let newArray = normalStruct;
            newArray[normalDataIndex] = normalData;
            setNormalStruct(newArray);
        } else {
            let obj = normalData;
            obj.parentId = obj.uniqueId;
            setMain(obj);
        }
    };

    const saveNormalDataToPanel = () => {
        let obj = Object.assign({}, panel);
        let newArray = normalStruct;
        newArray.push(main);
        obj['breakers'] = newArray;
        obj['breaker_count'] = normalCount;
        setPanel(obj);
    };

    const handleNormalChange = (key, value) => {
        let obj = Object.assign({}, normalData);
        obj[key] = value;
        setNormalData(obj);
    };

    const savePanelData = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                'user-auth': '628f3144b712934f578be895',
            };

            setIsProcessing(true);

            await axios
                .post(`${BaseUrl}${createPanel}`, panel, {
                    headers: header,
                })
                .then((res) => {
                    console.log(res.data);
                });

            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            alert('Failed to save Panel');
        }
    };

    useEffect(() => {
        let newBreakers = [];
        for (let index = 1; index <= normalCount; index++) {
            let newId = getBreakerId();
            let obj = {
                phase: 1,
                voltage: '',
                amps: '',
                equipment_name: '',
                uniqueId: newId,
                parentId: newId,
                breakerNo: index,
                type: 'normal-breaker',
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
                        'user-auth': '628f3144b712934f578be895',
                    };
                    await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
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
                    'user-auth': '628f3144b712934f578be895',
                };
                await axios.get(`${BaseUrl}${generalPanels}`, { headers }).then((res) => {
                    setGeneralPanelData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Panels Data List');
            }
        };

        // const fetchPassiveDeviceData = async () => {
        //     try {
        //         let headers = {
        //             'Content-Type': 'application/json',
        //             accept: 'application/json',
        //             // 'user-auth': '628f3144b712934f578be895',
        //         };
        //         await axios.get(`${BaseUrl}${generalPassiveDevices}`, { headers }).then((res) => {
        //             setPassiveDeviceData(res.data);
        //         });
        //     } catch (error) {
        //         console.log(error);
        //         console.log('Failed to fetch all Passive devices');
        //     }
        // };

        const fetchPassiveDeviceData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    'user-auth': '628f3144b712934f578be895',
                };
                // let params = `?page_size=${pageSize}&page_no=${pageNo}`;
                let params = `?page_size=10&page_no=1`;
                await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
                    let data = res.data;
                    setPassiveDeviceData(data.data);
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
        // console.log('SSR panel => ', panel);
        console.log('SSR main => ', main);
        console.log('SSR normalStruct => ', normalStruct);
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
                    <div className="panel-first-row-style mt-4">
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
                            <Label for="userState" className="card-title">
                                Passive Device(s)
                            </Label>
                            <Input
                                type="select"
                                name="state"
                                id="userState"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('device_id', e.target.value);
                                }}>
                                <option>None</option>
                                {passiveDeviceData.map((record) => {
                                    return (
                                        <option value={record.equipments_id}>
                                            {record.identifier} ({record.model})
                                        </option>
                                    );
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
                    <div className="panel-container-style mt-4">
                        <Row className="panel-header-styling ml-1 mr-1">
                            <div className="panel-header-filter">
                                <div>
                                    <FormGroup className="form-group row m-4">
                                        <Label for="panelName" className="card-title">
                                            Type
                                        </Label>
                                        <Input
                                            type="select"
                                            name="state"
                                            id="userState"
                                            className="font-weight-bold"
                                            onChange={(e) => {
                                                setActivePanelType(e.target.value);
                                            }}>
                                            {panelType.map((record) => {
                                                return <option value={record.value}>{record.name}</option>;
                                            })}
                                        </Input>
                                    </FormGroup>
                                </div>
                                <div>
                                    <FormGroup className="form-group row m-4 width-custom-style">
                                        <Label for="panelName" className="card-title">
                                            Number of Breakers
                                        </Label>
                                        {activePanelType === 'distribution' ? (
                                            <Input
                                                type="number"
                                                name="breakers"
                                                id="breakers"
                                                value={normalCount}
                                                onChange={(e) => {
                                                    setNormalCount(parseInt(e.target.value));
                                                }}
                                                className="breaker-no-width"
                                            />
                                        ) : (
                                            <Input
                                                type="select"
                                                name="state"
                                                id="userState"
                                                className="font-weight-bold breaker-no-width"
                                                defaultValue={disconnectBreakerCount}
                                                onChange={(e) => {
                                                    setDisconnectBreakerCount(e.target.value);
                                                }}>
                                                {disconnectBreaker.map((record) => {
                                                    return <option value={record.value}>{record.name}</option>;
                                                })}
                                            </Input>
                                        )}
                                    </FormGroup>
                                </div>
                            </div>
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
                        </Row>

                        <Row className="main-breaker-styling">
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
                                            <>
                                                <div>
                                                    <h6 className="ml-4 mb-3 breaker-equip-name">
                                                        {main.equipment_name}
                                                    </h6>
                                                </div>
                                                <div
                                                    className="breaker-content-middle"
                                                    onClick={() => {
                                                        handleEditBreakerShow();
                                                        setUpdateData(main);
                                                    }}>
                                                    <div className="edit-icon-bg-styling mr-2">
                                                        <i className="uil uil-pen"></i>
                                                    </div>
                                                    <span className="font-weight-bold edit-btn-styling">Edit</span>
                                                </div>
                                            </>
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
                                                    <span className="font-weight-bold edit-btn-styling">Edit</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </FormGroup>
                        </Row>

                        <Row>
                            <Col lg={12}>
                                <div>
                                    <div className="grid-style-6">
                                        {normalStruct.map((element, index) => {
                                            if (element.type === 'main-breaker') {
                                                return;
                                            }
                                            return (
                                                <FormGroup className="form-group row m-2 ml-4">
                                                    <div className="breaker-container">
                                                        <div className="sub-breaker-style">
                                                            <div className="breaker-content-middle">
                                                                <div className="breaker-index">{element.breakerNo}</div>
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
                                                                <>
                                                                    <div>
                                                                        <h6 className="ml-4 mb-3 breaker-equip-name">
                                                                            {element.equipment_name}
                                                                        </h6>
                                                                    </div>
                                                                    <div
                                                                        className="breaker-content-middle"
                                                                        onClick={() => {
                                                                            handleEditBreakerShow();
                                                                            setUpdateData(element);
                                                                        }}>
                                                                        <div className="edit-icon-bg-styling mr-2">
                                                                            <i className="uil uil-pen"></i>
                                                                        </div>
                                                                        <span className="font-weight-bold edit-btn-styling">
                                                                            Edit
                                                                        </span>
                                                                    </div>
                                                                </>
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

            <Modal show={showBreaker} onHide={handleBreakerClose} centered>
                <Modal.Header>
                    <Modal.Title>Create Breaker</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="panel-model-row-style ml-2 mr-2">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Apms</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Amps"
                                    className="font-weight-bold"
                                    onChange={(e) => {
                                        handleNormalChange('related_amps', e.target.value);
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Volts</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Volts"
                                    className="font-weight-bold"
                                    onChange={(e) => {
                                        handleNormalChange('voltage', e.target.value);
                                    }}
                                />
                            </Form.Group>
                        </div>

                        <div className="panel-model-row-style ml-2 mr-2">
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
                            addNormalSingleData();
                            handleBreakerClose();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEditBreaker} onHide={handleEditBreakerClose} centered>
                <Modal.Header>
                    <Modal.Title>Edit Breaker</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <div className="panel-model-row-style ml-2 mr-2">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Apms</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Amps"
                                    className="font-weight-bold"
                                    defaultValue={updateData.related_amps}
                                    onChange={(e) => {
                                        handleNormalChange('related_amps', e.target.value);
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Volts</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Volts"
                                    className="font-weight-bold"
                                    defaultValue={updateData.voltage}
                                    onChange={(e) => {
                                        handleNormalChange('voltage', e.target.value);
                                    }}
                                />
                            </Form.Group>
                        </div>

                        <div className="panel-model-row-style ml-2 mr-2">
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Device ID</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Device ID"
                                    className="font-weight-bold"
                                    defaultValue={updateData.device_id}
                                    onChange={(e) => {
                                        handleNormalChange('device_id', e.target.value);
                                    }}
                                />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Sensors #</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Sensors"
                                    className="font-weight-bold"
                                    defaultValue={updateData.sensor}
                                    onChange={(e) => {
                                        handleNormalChange('sensor', e.target.value);
                                    }}
                                />
                            </Form.Group>
                        </div>

                        <Form.Group className="m-2 mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Equipment"
                                className="font-weight-bold"
                                defaultValue={updateData.equipment_name}
                                onChange={(e) => {
                                    handleNormalChange('equipment_name', e.target.value);
                                }}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleEditBreakerClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            updateNormalSingleData();
                            handleEditBreakerClose();
                        }}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default CreatePanel;
