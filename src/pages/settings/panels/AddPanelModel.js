import React, { useState } from 'react';
import { Label, Input, FormGroup, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, createPanel } from '../../../services/Network';
import { Cookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import '../style.css';
import './panel-style.css';

const AddPanelModel = ({ showPanelModel, panelData, locationData, closeAddPanelModel }) => {
    const cookies = new Cookies();
    const userdata = cookies.get('user');
    const history = useHistory();
    // const navigate = useNavigate();

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

    const handleChange = (key, value) => {
        let obj = Object.assign({}, panelObj);
        if (value === 'Select Location') {
            value = '';
        }
        if (value === 'None') {
            value = '';
        }
        obj[key] = value;
        setPanelObj(obj);
    };

    const savePanelData = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let newPanel = Object.assign({}, panelObj);
            let panelId;

            setIsProcessing(true);

            await axios
                .post(`${BaseUrl}${createPanel}`, newPanel, {
                    headers: header,
                })
                .then((res) => {
                    let response = res.data;
                    panelId = response.id;
                });
            setIsProcessing(false);
            history.push({
                pathname: `/settings/panels/create-panel/${panelId}`,
            });
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to Create Panel');
        }
    };

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
                            <Form.Label className="font-weight-bold">Rated Apms</Form.Label>
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
                                <option value="120/240">120/240</option>
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
                            <Form.Control
                                type="number"
                                placeholder="Enter Amps"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('breaker_count', +e.target.value);
                                }}
                                value={panelObj.breaker_count}
                            />
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
