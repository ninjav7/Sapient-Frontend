import React, { useEffect, useState } from 'react';
import { Label, Input, FormGroup, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, createPanel } from '../../../services/Network';
import { BuildingStore } from '../../../store/BuildingStore';
import { Cookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
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
        }
        if (value === 'distribution') {
            obj.breaker_count = 0;
        }
        obj[key] = value;
        setPanelObj(obj);
    };

    const savePanelData = async () => {
        try {
            setIsProcessing(true);

            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let newPanel = Object.assign({}, panelObj);
            let params = `?building_id=${bldgId}`;

            await axios.post(`${BaseUrl}${createPanel}${params}`, newPanel, { headers }).then((res) => {
                let response = res.data;
                let panelID = response.id;

                setIsProcessing(false);

                if (panelID !== '') {
                    history.push({
                        pathname: `/settings/panels/edit-panel/${panelID}`,
                    });
                }
            });
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to Create Panel & Breakers!');
        }
    };

    const voltsOption = [
        { value: '120/240', label: '120/240' },
        { value: '208/120', label: '208/120' },
        { value: '480', label: '480' },
        { value: '600', label: '600' },
    ];

    const panelOption = [
        { value: 'distribution', label: 'Distribution' },
        { value: 'disconnect', label: 'Disconnect' },
    ];

    // const locationOption = [];
    const [location, setLocation] = useState([]);
    const [parentPanel, setParentPanel] = useState([]);

    const addLocationData = () => {
        locationData.map((item) => {
            setLocation((el) => [...el, { value: `${item?.location_id}`, label: `${item?.location_name}` }]);
        });
    };

    const addPanelData = () => {
        panelData.map((item) => {
            setParentPanel((el) => [...el, { value: `${item?.panel_id}`, label: `${item?.panel_name}` }]);
        });
    };

    useEffect(() => {
        if (locationData) {
            addLocationData();
        }
    }, [locationData]);

    useEffect(() => {
        if (panelData) {
            addPanelData();
        }
    }, [panelData]);

    console.log('location', location);

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
                            <Select
                                id="exampleSelect"
                                placeholder="Select Volts"
                                name="state"
                                isSearchable={true}
                                defaultValue={'Select Volts'}
                                options={voltsOption}
                                onChange={(e) => {
                                    handleChange('voltage', e.value);
                                }}
                                className="basic-single font-weight-bold"
                            />
                        </Form.Group>
                    </div>

                    <div className="panel-edit-model-row-style ml-2 mr-2">
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className="font-weight-bold">Panel Type</Form.Label>
                            <div style={{ width: '200px' }}>
                                <Select
                                    id="exampleSelect"
                                    name="state"
                                    isSearchable={true}
                                    defaultValue={'Select Panel Type'}
                                    options={panelOption}
                                    onChange={(e) => {
                                        console.log('evolts', e.value);
                                        handleChange('panel_type', e.value);
                                    }}
                                    className="font-weight-bold"
                                    menuPlacement="auto"
                                    menuPosition="fixed"
                                />
                            </div>
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

                        <div style={{ width: '100%' }}>
                            <Select
                                isSearchable={true}
                                defaultValue={'Select Location Type'}
                                options={location}
                                onChange={(e) => {
                                    handleChange('space_id', e.value);
                                }}
                                className="font-weight-bold dropdownScrollaleDisable"
                                menuPlacement="auto"
                                menuPosition="fixed"
                                menuShouldBlockScroll={true}
                            />
                        </div>
                    </FormGroup>

                    <FormGroup className="m-2 mt-3">
                        <Label for="userState" className="card-title">
                            Parent Panel
                        </Label>
                        <Select
                            isSearchable={true}
                            defaultValue={'Select Parent Panel'}
                            options={parentPanel}
                            onChange={(e) => {
                                handleChange('parent_panel', e.value);
                            }}
                            className="font-weight-bold dropdownScrollaleDisable"
                            menuPlacement="auto"
                            menuPosition="fixed"
                            menuShouldBlockScroll={true}
                        />
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
