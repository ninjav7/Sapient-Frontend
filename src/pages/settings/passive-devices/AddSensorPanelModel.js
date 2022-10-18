import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, generalPanels, getBreakers, linkPassiveSensorToBreaker } from '../../../services/Network';
import Modal from 'react-bootstrap/Modal';
import { Button, Input } from 'reactstrap';
import { Cookies } from 'react-cookie';
import Skeleton from 'react-loading-skeleton';
import './style.css';

const AddSensorPanelModel = ({ showBreaker, handleBreakerClose, bldgId, sensorObj }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [panelData, setPanelData] = useState([]);
    const [breakersData, setBreakersData] = useState([]);
    const [passiveSensorObj, setPassiveSensorObj] = useState({
        panel_id: '',
        breaker_id: '',
    });

    const [isPanelDataFetched, setPanelDataFetched] = useState(true);
    const [isBreakerDataFetched, setBreakerDataFetched] = useState(false);

    const handlePassiveSensorChange = (key, value) => {
        let obj = Object.assign({}, passiveSensorObj);
        if (key === 'panel_id') {
            obj['breaker_id'] = '';
        }
        if (value === 'Select Breaker') {
            value = '';
        }
        obj[key] = value;
        setPassiveSensorObj(obj);
    };

    const fetchBreakersList = async (panelId) => {
        if (panelId === '') {
            return;
        }
        try {
            setBreakerDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?panel_id=${panelId}`;
            await axios.get(`${BaseUrl}${getBreakers}${params}`, { headers }).then((res) => {
                let response = res.data.data;
                setBreakersData(response);
            });
            setBreakerDataFetched(false);
        } catch (error) {
            setBreakerDataFetched(false);
        }
    };

    const linkPassiveSensorToPanelBreaker = async () => {
        try {
            setBreakerDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?sensor_id=${sensorObj?.id}&breaker_id=${passiveSensorObj?.breaker_id}&building_id=${bldgId}`;
            await axios.post(`${BaseUrl}${linkPassiveSensorToBreaker}${params}`, {}, { headers }).then((res) => {
                let response = res.data;
            });
        } catch (error) {}
    };

    const getAvailableBreaker = () => {
        if (breakersData.length === 0) {
            return;
        }
        if (passiveSensorObj?.panel_id === '') {
            return;
        }
        let breakerObj = breakersData.find((record) => record.sensor_link === '');
        if (typeof breakerObj !== 'undefined') {
            let obj = Object.assign({}, passiveSensorObj);
            obj['breaker_id'] = breakerObj?.id;
            setPassiveSensorObj(obj);
        }
    };

    useEffect(() => {
        const fetchPanelsData = async () => {
            if (!showBreaker) {
                return;
            }
            try {
                setPanelDataFetched(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalPanels}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    let data = [];
                    response.forEach((element) => {
                        let obj = {
                            label: element?.panel_name,
                            value: element?.panel_id,
                        };
                        data.push(obj);
                    });
                    setPanelData(data);
                });
                setPanelDataFetched(false);
            } catch (error) {
                setPanelDataFetched(false);
            }
        };
        fetchPanelsData();
    }, [showBreaker]);

    return (
        <>
            <Modal
                show={showBreaker}
                onHide={handleBreakerClose}
                size={'md'}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Header className="m-3 p-2 mb-0">
                    <Modal.Title>Select Breaker</Modal.Title>
                </Modal.Header>
                <Form className="m-4 mt-0">
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Panel</Form.Label>
                        {isPanelDataFetched ? (
                            <Skeleton count={1} height={40} className="mb-2" />
                        ) : (
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                value={passiveSensorObj?.panel_id}
                                onChange={(e) => {
                                    handlePassiveSensorChange('panel_id', e.target.value);
                                    fetchBreakersList(e.target.value);
                                }}>
                                <option selected>Select Panel</option>
                                {panelData.map((record) => {
                                    return <option value={record.value}>{record.label}</option>;
                                })}
                            </Input>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Breaker</Form.Label>
                        {isBreakerDataFetched ? (
                            <Skeleton count={1} height={35} />
                        ) : (
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                value={passiveSensorObj?.breaker_id}
                                onChange={(e) => {
                                    handlePassiveSensorChange('breaker_id', e.target.value);
                                }}>
                                <option selected>Select Breaker</option>
                                {breakersData.map((record) => {
                                    return (
                                        <option value={record?.id} disabled={record?.sensor_link === '' ? false : true}>
                                            {record?.name}
                                        </option>
                                    );
                                })}
                            </Input>
                        )}
                    </Form.Group>

                    {passiveSensorObj?.breaker_id === '' && (
                        <Form.Group className="mb-3 mt-2">
                            <Button variant="light" className="select-breaker-style" onClick={getAvailableBreaker}>
                                Select Next Available Breaker
                            </Button>
                        </Form.Group>
                    )}
                </Form>
                <Modal.Footer>
                    <Button
                        variant="light"
                        onClick={() => {
                            setPassiveSensorObj({
                                panel_id: '',
                                breaker_id: '',
                            });
                            handleBreakerClose();
                        }}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            linkPassiveSensorToPanelBreaker();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddSensorPanelModel;
