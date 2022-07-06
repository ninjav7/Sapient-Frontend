import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './style.css';
import axios from 'axios';
import { BaseUrl, generalUtilityBills, updateUtilityBill } from '../../services/Network';
import moment from 'moment';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';

const UtilityBills = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const activeBuildingId = localStorage.getItem('buildingId');

    const [avgRate, setAvgRate] = useState(0.6);

    // Table data
    const [records, setRecords] = useState([
        {
            id: 1,
            date: 'Jan 2021',
            kwh: null,
            rate: null,
            avg_rate: null,
        },
        {
            id: 2,
            date: 'Dec 2021',
            kwh: 10142,
            rate: 1369,
            avg_rate: 0.6,
        },
        {
            id: 3,
            date: 'Nov 2021',
            kwh: 10142,
            rate: 1369,
            avg_rate: 0.6,
        },
        {
            id: 4,
            date: 'Oct 2021',
            kwh: null,
            rate: null,
            avg_rate: null,
        },
        {
            id: 5,
            date: 'Sept 2021',
            kwh: 10142,
            rate: 1369,
            avg_rate: 0.6,
        },
    ]);

    const [utilityData, setUtilityData] = useState([]);
    const [billId, setBillId] = useState('');

    const [pageRefresh, setPageRefresh] = useState(false);
    const [activeBillObj, setActiveBillObj] = useState({});

    const [render, setRender] = useState(false);

    // Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleUtilityBillChange = (key, value) => {
        let obj = Object.assign({}, activeBillObj);
        obj[key] = parseInt(value);
        setActiveBillObj(obj);
    };

    useEffect(() => {
        const fetchUtilityBillsData = async () => {
            try {
                if (activeBuildingId) {
                    let headers = {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                        Authorization: `Bearer ${userdata.token}`,
                    };
                    await axios.get(`${BaseUrl}${generalUtilityBills}/${activeBuildingId}`, { headers }).then((res) => {
                        console.log(res);
                        let responseData = res.data;
                        responseData.sort(
                            (a, b) => new moment(a.date).format('MMM YYYY') - new moment(b.date).format('MMM YYYY')
                        );
                        setUtilityData(responseData);
                    });
                }
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch UtilityBills Data');
            }
        };
        fetchUtilityBillsData();
    }, [activeBuildingId]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Utility Bills',
                        path: '/settings/utility-bills',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        updateBreadcrumbStore();
    }, []);

    const fetchUtilityBillsData = async () => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            await axios.get(`${BaseUrl}${generalUtilityBills}/${activeBuildingId}`, { headers }).then((res) => {
                console.log(res);
                let responseData = res.data;
                responseData.sort(
                    (a, b) => new moment(a.date).format('MMM YYYY') - new moment(b.date).format('MMM YYYY')
                );
                setUtilityData(responseData);
            });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch UtilityBills Data');
        }
    };

    const dateFormater = (date) => {
        return moment(date).format('MMM YYYY');
    };

    const updateUtilityBillData = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let billObj = {
                kWh: activeBillObj.kWh,
                total_paid: activeBillObj.total_paid,
            };

            let params = `/${activeBillObj.id}`;

            await axios
                .patch(`${BaseUrl}${updateUtilityBill}${params}`, billObj, {
                    headers: header,
                })
                .then((res) => {
                    let response = res.data;
                });
            fetchUtilityBillsData();
        } catch (error) {
            console.log('Failed to update Uility Bill Data');
        }
    };

    useEffect(() => {
        console.log('activeBuildingId => ', activeBuildingId);
    });

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Utility Bills
                    </span>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <Card>
                        <CardBody>
                            <Table className="mb-0 bordered table-styling table-hover">
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>kWh</th>
                                        <th>Total Paid</th>
                                        <th>Blended Rate</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {utilityData.map((record, index) => {
                                        return record.kWh === null ? (
                                            <tr key={index} className="table-warning">
                                                <td className="text-warning font-weight-bold">
                                                    {dateFormater(record.date)}
                                                </td>
                                                {record.kWh === null ? (
                                                    record.kWh === null && <td>-</td>
                                                ) : (
                                                    <td>{record.kWh} kWh</td>
                                                )}
                                                {record.total_paid === null ? (
                                                    record.total_paid === null && <td>-</td>
                                                ) : (
                                                    <td>{record.total_paid} kWh</td>
                                                )}
                                                {record.blended_rate === null ? (
                                                    record.blended_rate === null && <td>-</td>
                                                ) : (
                                                    <td>{record.blended_rate} kWh</td>
                                                )}
                                                <td className="font-weight-bold">
                                                    <a
                                                        class="link-primary"
                                                        onClick={() => {
                                                            handleShow();
                                                            setBillId(record.id);
                                                        }}>
                                                        Add
                                                    </a>
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={index}>
                                                <td className="font-weight-bold">{dateFormater(record.date)}</td>
                                                {record.kWh === null ? (
                                                    record.kWh === null && <td>-</td>
                                                ) : (
                                                    <td className="font-weight-bold">
                                                        {record.kWh}
                                                        kWh
                                                    </td>
                                                )}
                                                {record.total_paid === null ? (
                                                    record.total_paid === null && <td>-</td>
                                                ) : (
                                                    <td className="font-weight-bold">
                                                        {record.total_paid}
                                                        kWh
                                                    </td>
                                                )}
                                                {record.blended_rate === null ? (
                                                    record.blended_rate === null && <td>-</td>
                                                ) : (
                                                    <td>{record.blended_rate} kWh</td>
                                                )}
                                                <td className="font-weight-bold">
                                                    <a
                                                        class="link-primary"
                                                        onClick={() => {
                                                            handleShow();
                                                            setActiveBillObj(record);
                                                            setBillId(record.id);
                                                        }}>
                                                        Edit
                                                    </a>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered backdrop="static" keyboard={false}>
                <Modal.Header>
                    <Modal.Title>Edit Utility Bill</Modal.Title>
                </Modal.Header>
                <Form>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className="font-weight-bold">kWh</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter kWh"
                                autoFocus
                                onChange={(e) => {
                                    handleUtilityBillChange('kWh', e.target.value);
                                }}
                                name="kWh"
                                className="font-weight-bold"
                                value={activeBillObj.kWh}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Total Paid</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Total paid on bill"
                                onChange={(e) => {
                                    handleUtilityBillChange('total_paid', e.target.value);
                                }}
                                name="total_paid"
                                className="font-weight-bold"
                                value={activeBillObj.total_paid}
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button
                            variant="primary"
                            type="submit"
                            onClick={() => {
                                updateUtilityBillData();
                                handleClose();
                            }}>
                            Update
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </React.Fragment>
    );
};

export default UtilityBills;
