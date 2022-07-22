import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BaseUrl, generalPanels, getBreakers } from '../../../services/Network';
import Modal from 'react-bootstrap/Modal';
import { Button, Input } from 'reactstrap';
import { Cookies } from 'react-cookie';
import Skeleton from 'react-loading-skeleton';
import './style.css';

const EditSensorPanelModel = ({
    showEditSensorPanel,
    closeEditSensorPanelModel,
    currentSensorObj,
    setCurrentSensorObj,
    editSenorModelRefresh,
    setEditSenorModelRefresh,
    bldgId,
}) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [panelData, setPanelData] = useState([]);
    const [breakersData, setBreakersData] = useState([]);

    const [isPanelDataFetched, setPanelDataFetched] = useState(true);
    const [isBreakerDataFetched, setBreakerDataFetched] = useState(false);

    // const saveToSensorArray = () => {
    //     let currentArray = sensors;
    //     currentArray[currentIndex] = currentRecord;
    //     setSensors(currentArray);
    // };

    const handleSensorChange = (key, value) => {
        let obj = Object.assign({}, currentSensorObj);
        obj[key] = value;
        setCurrentSensorObj(obj);
    };

    const fetchBreakersList = async (panelId) => {
        if (panelId === '') {
            return;
        }
        if (panelId === 'Select Panel') {
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
            console.log(error);
            setBreakerDataFetched(false);
            console.log('Failed to fetch Breakers Data List');
        }
    };

    useEffect(() => {
        const fetchPanelsData = async () => {
            if (!editSenorModelRefresh) {
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

        const fetchBreakersData = async () => {
            if (!editSenorModelRefresh) {
                return;
            }
            try {
                setBreakerDataFetched(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let panelId = currentSensorObj.panel_id ? currentSensorObj.panel_id : '';
                let params = `?panel_id=${panelId}`;
                await axios.get(`${BaseUrl}${getBreakers}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setBreakersData(response.data);
                });
                setBreakerDataFetched(false);
            } catch (error) {
                console.log(error);
                setBreakerDataFetched(false);
                console.log('Failed to fetch Breakers Data List');
            }
        };

        fetchPanelsData();
        fetchBreakersData();
    }, [editSenorModelRefresh]);

    return (
        <>
            <Modal show={showEditSensorPanel} onHide={closeEditSensorPanelModel} size={'md'} centered>
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
                                defaultValue={currentSensorObj.panel_id}
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
                                defaultValue={currentSensorObj.breaker_id}
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

                    {/* {equipmentId === '' && (
                        <Form.Group className="mb-3 mt-2">
                            <Button variant="light" className="select-breaker-style">
                                Select Next Available Breaker
                            </Button>
                        </Form.Group>
                    )} */}
                </Form>
                <Modal.Footer>
                    <Button
                        variant="light"
                        onClick={() => {
                            setEditSenorModelRefresh(false);
                            closeEditSensorPanelModel();
                        }}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() => {
                            closeEditSensorPanelModel();
                            setEditSenorModelRefresh(false);
                            // saveToSensorArray();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditSensorPanelModel;
