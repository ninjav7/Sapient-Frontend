import React, { useState, useEffect } from 'react';
import { Label, Input, FormGroup, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, createPanel, createBreaker } from '../../../services/Network';
import { BuildingStore } from '../../../store/BuildingStore';
import { Cookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import '../style.css';
import './panel-style.css';

const AddPanelModel = ({ showPanelModel, panelData, locationData, closeAddPanelModel }) => {
    const cookies = new Cookies();
    const userdata = cookies.get('user');
    const history = useHistory();
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [isProcessing, setIsProcessing] = useState(false);

    const [panelObj, setPanelObj] = useState({
        name: '',
        parent_panel: '',
        space_id: '',
        device_id: '',
        voltage: '',
        phase_config: 1,
        rated_amps: 0,
        breaker_count: 0,
        panel_type: 'distribution',
    });

    const [breakersData, setBreakersData] = useState([]);

    const [generatedPanelId, setGeneratedPanelId] = useState('');

    const panelType = [
        {
            name: 'Distribution',
            value: 'distribution',
        },
        {
            name: 'Disconnect',
            value: 'disconnect',
        },
    ];

    const disconnectBreaker = [
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
    ];

    const handleVoltageChange = (voltageValue) => {
        if (panelObj.panel_type === 'disconnect') {
            return;
        }

        if (breakersData?.length === 0) {
            return;
        }

        let newArray = breakersData;
        newArray.forEach((obj) => {
            if (voltageValue === '120/240') {
                obj.voltage = '120';
            }
            if (voltageValue === '208/120') {
                obj.voltage = '120';
            }
            if (voltageValue === '480') {
                obj.voltage = '277';
            }
            if (voltageValue === '600') {
                obj.voltage = '347';
            }
        });
        setBreakersData(newArray);
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, panelObj);
        if (value === 'None') {
            value = '';
        }
        if (value === 'disconnect') {
            obj.breaker_count = 3;
            if (obj.voltage === '120/240') {
                obj.voltage = '208/120';
            }
            handleBreakerChange('disconnect', 3);
        }
        if (value === 'distribution') {
            obj.breaker_count = 0;
            handleBreakerChange('distribution', 0);
        }
        if (key === 'voltage') {
            handleVoltageChange(value);
        }
        obj[key] = value;
        setPanelObj(obj);
    };

    const getVoltageConfigValue = (value, breakerType) => {
        if (breakerType === 'single') {
            if (value === '208/120') {
                return 120;
            }
            if (value === '480') {
                return 277;
            }
            if (value === '600') {
                return 347;
            }
        }
    };

    const getPhaseConfigValue = (value, breakerType) => {
        if (breakerType === 'single') {
            if (value === '208/120') {
                return 1;
            }
            if (value === '480') {
                return 1;
            }
            if (value === '600') {
                return 1;
            }
        }
    };

    const handleBreakerChange = (panelType, breakerCount) => {
        let newArray = [];
        if (panelType === 'distribution') {
            for (let index = 1; index <= breakerCount; index++) {
                let obj = {
                    name: `Breaker ${index}`,
                    breaker_number: index,
                    phase_configuration: 1,
                    rated_amps: 0,
                    voltage: '',
                    equipment_link: [],
                    sensor_id: '',
                    device_id: '',
                    breaker_type: 1,
                    parent_breaker: '',
                    is_linked: false,
                };
                if (panelObj.voltage === '120/240') {
                    obj.voltage = '120';
                }
                if (panelObj.voltage === '208/120') {
                    obj.voltage = '120';
                }
                if (panelObj.voltage === '480') {
                    obj.voltage = '277';
                }
                if (panelObj.voltage === '600') {
                    obj.voltage = '347';
                }
                newArray.push(obj);
            }
        }

        if (panelType === 'disconnect') {
            for (let index = 1; index <= breakerCount; index++) {
                let obj = {
                    name: `Breaker ${index}`,
                    breaker_number: index,
                    phase_configuration: getPhaseConfigValue(panelObj.voltage, 'single'),
                    rated_amps: 0,
                    voltage: getVoltageConfigValue(panelObj.voltage, 'single'),
                    equipment_link: [],
                    sensor_id: '',
                    device_id: '',
                    breaker_type: 1,
                    parent_breaker: '',
                    is_linked: false,
                };
                newArray.push(obj);
            }
        }
        setBreakersData(newArray);
    };

    const savePanelData = async () => {
        try {
            setIsProcessing(true);

            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let newPanel = Object.assign({}, panelObj);
            let params = `?building_id=${bldgId}`;

            await axios
                .post(`${BaseUrl}${createPanel}${params}`, newPanel, {
                    headers: header,
                })
                .then((res) => {
                    let response = res.data;
                    setGeneratedPanelId(response.id);
                });
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to Create Panel');
        }
    };

    useEffect(() => {
        if (generatedPanelId === '') {
            return;
        }

        const saveBreakersData = async (panelID) => {
            try {
                let header = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };

                let params = `?panel_id=${panelID}`;

                await axios
                    .post(`${BaseUrl}${createBreaker}${params}`, breakersData, {
                        headers: header,
                    })
                    .then((res) => {
                        let response = res.data;
                    });

                setIsProcessing(false);

                history.push({
                    pathname: `/settings/panels/edit-panel/${panelID}`,
                });
            } catch (error) {
                setIsProcessing(false);
                console.log('Failed to Save Breakers');
            }
        };
        saveBreakersData(generatedPanelId);
    }, [generatedPanelId]);

    return (
        <>
            <Modal show={showPanelModel} onHide={closeAddPanelModel} centered>
                <div className="mt-3 ml-4">
                    <Modal.Title>Create New Panel</Modal.Title>
                </div>
                <Form className="m-4 mt-0">
                    <FormGroup>
                        <Label for="panelName" className="card-title">
                            Panel Name
                        </Label>
                        <Input
                            type="text"
                            name="panelName"
                            id="panelName"
                            placeholder="Enter Panel Name"
                            onChange={(e) => {
                                handleChange('name', e.target.value);
                            }}
                            className="font-weight-bold"
                            value={panelObj.name}
                        />
                    </FormGroup>

                    <div className="panel-edit-model-row-style ml-2 mr-2">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className="font-weight-bold">Rated Amps</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Amperage"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('rated_amps', +e.target.value);
                                }}
                                value={panelObj.rated_amps}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className="font-weight-bold">Volts</Form.Label>
                            <Input
                                type="select"
                                name="state"
                                id="userState"
                                className="font-weight-bold selection-volts-style"
                                placeholder="Select Volts"
                                onChange={(e) => {
                                    if (e.target.value === 'Select Volts') {
                                        return;
                                    }
                                    handleChange('voltage', e.target.value);
                                }}
                                value={panelObj.voltage}>
                                <option>Select Volts</option>
                                {panelObj.panel_type === 'distribution' && <option value="120/240">120/240</option>}
                                <option value="208/120">208/120</option>
                                <option value="480">480</option>
                                <option value="600">600</option>
                            </Input>
                        </Form.Group>
                    </div>

                    <div className="panel-edit-model-row-style ml-2 mr-2">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className="font-weight-bold">Panel Type</Form.Label>
                            <Input
                                type="select"
                                name="state"
                                id="userState"
                                className="font-weight-bold selection-volts-style"
                                onChange={(e) => {
                                    if (e.target.value === 'Select Panel Type') {
                                        return;
                                    }
                                    handleChange('panel_type', e.target.value);
                                }}
                                value={panelObj.panel_type}>
                                <option>Select Panel Type</option>
                                {panelType.map((record) => {
                                    return <option value={record.value}>{record.name}</option>;
                                })}
                            </Input>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className="font-weight-bold">Number of Breakers</Form.Label>

                            {panelObj.panel_type === 'distribution' && (
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Amps"
                                    className="font-weight-bold"
                                    onChange={(e) => {
                                        handleChange('breaker_count', +e.target.value);
                                    }}
                                    onBlur={(e) => {
                                        handleBreakerChange('distribution', +e.target.value);
                                    }}
                                    min={0}
                                    step={5}
                                    value={panelObj.breaker_count}
                                />
                            )}

                            {panelObj.panel_type === 'disconnect' && (
                                <Input
                                    type="select"
                                    name="state"
                                    id="userState"
                                    className="font-weight-bold breaker-no-width"
                                    value={panelObj.breaker_count}
                                    onChange={(e) => {
                                        handleChange('breaker_count', +e.target.value);
                                    }}
                                    onBlur={(e) => {
                                        handleBreakerChange('disconnect', +e.target.value);
                                    }}>
                                    {disconnectBreaker.map((record) => {
                                        return <option value={record.value}>{record.name}</option>;
                                    })}
                                </Input>
                            )}
                        </Form.Group>
                    </div>

                    <FormGroup className="m-2">
                        <Label for="location" className="card-title">
                            Location
                        </Label>
                        <Input
                            type="select"
                            name="state"
                            id="userState"
                            className="font-weight-bold"
                            onChange={(e) => {
                                if (e.target.value === 'Select Location') {
                                    return;
                                }
                                handleChange('space_id', e.target.value);
                            }}
                            value={panelObj.space_id}>
                            <option>Select Location</option>
                            {locationData.map((record) => {
                                return <option value={record.location_id}>{record.location_name}</option>;
                            })}
                        </Input>
                    </FormGroup>

                    <FormGroup className="m-2 mt-3">
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
                            }}
                            value={panelObj.parent_panel}>
                            <option>None</option>
                            {panelData.map((record) => {
                                return <option value={record.panel_id}>{record.panel_name}</option>;
                            })}
                        </Input>
                    </FormGroup>
                </Form>
                <Modal.Footer>
                    <Button variant="light" onClick={closeAddPanelModel}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            savePanelData();
                        }}>
                        {isProcessing ? 'Saving...' : 'Save'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddPanelModel;
