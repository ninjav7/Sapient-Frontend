import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, generalPanels, getBreakers } from '../../../services/Network';
import Modal from 'react-bootstrap/Modal';
import { Button, Input } from 'reactstrap';
import { Cookies } from 'react-cookie';
import Skeleton from 'react-loading-skeleton';
import './style.css';

const AddSensorPanelModel = ({
    showBreaker,
    handleBreakerClose,
    currentRecord,
    setCurrentRecord,
    sensors,
    setSensors,
    currentIndex,
    setCurrentIndex,
    bldgId,
    equipmentId,
}) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [panelData, setPanelData] = useState([]);
    const [breakersData, setBreakersData] = useState([]);

    const [isPanelDataFetched, setPanelDataFetched] = useState(true);
    const [isBreakerDataFetched, setBreakerDataFetched] = useState(false);

    const saveToSensorArray = () => {
        let currentArray = sensors;
        currentArray[currentIndex] = currentRecord;
        setSensors(currentArray);
    };

    const handleSensorChange = (key, value) => {
        let obj = Object.assign({}, currentRecord);
        obj[key] = value;
        setCurrentRecord(obj);
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
                setBreakersData(res.data);
            });
            setBreakerDataFetched(false);
        } catch (error) {
            console.log(error);
            setBreakerDataFetched(false);
            console.log('Failed to fetch Breakers Data List');
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
                    setPanelData(res.data);
                });
                setPanelDataFetched(false);
            } catch (error) {
                console.log(error);
                setPanelDataFetched(false);
                console.log('Failed to fetch Panels Data List');
            }
        };
        fetchPanelsData();
    }, [showBreaker]);

    return (
        <>
            <Modal show={showBreaker} onHide={handleBreakerClose} size={'md'} centered>
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
                                defaultValue={currentRecord.panel_name}
                                onChange={(e) => {
                                    handleSensorChange('panel_name', e.target.value);
                                    fetchBreakersList(e.target.value);
                                }}>
                                <option selected>Select Panel</option>
                                {panelData.map((record) => {
                                    return <option value={record.panel_id}>{record.panel_name}</option>;
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
                                defaultValue={currentRecord.breaker_name}
                                onChange={(e) => {
                                    handleSensorChange('breaker_name', e.target.value);
                                }}>
                                <option selected>Select Breaker</option>
                                {breakersData.map((record) => {
                                    return <option value={record.id}>{record.name}</option>;
                                })}
                            </Input>
                        )}
                    </Form.Group>

                    {equipmentId === '' && (
                        <Form.Group className="mb-3 mt-2">
                            <Button variant="light" className="select-breaker-style">
                                Select Next Available Breaker
                            </Button>
                        </Form.Group>
                    )}
                </Form>
                <Modal.Footer>
                    <Button variant="light" onClick={handleBreakerClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            handleBreakerClose();
                            saveToSensorArray();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default AddSensorPanelModel;
