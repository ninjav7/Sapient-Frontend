import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './style.css';
import axios from 'axios';
import { BaseUrl, generalUtilityBills } from '../../services/Network';
import moment from 'moment';
import { BuildingStore } from '../../components/BuildingStore';
import { BreadcrumbStore } from '../../components/BreadcrumbStore';

const UtilityBills = () => {
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [avgRate, setAvgRate] = useState(0.6);
    const [inputField, setInputField] = useState({
        kWh: 0,
        total_paid: 0,
    });
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
    const [buildingId, setBuildingId] = useState(1);
    const [billId, setBillId] = useState('');
    const [render, setRender] = useState(false);

    // Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // const handleEditItem = (selectedRecord) => {
    //     // e.preventDefault();
    //     console.log(selectedRecord);
    // };

    // handleEditItem(selectedItem) {
    //     return e => {
    //       e.preventDefault()
    //       let { items } = this.state
    //       items = items.map(item => ({
    //         ...item,
    //         showModal: selectedItem.id === item.id,
    //       }))
    //       this.setState({ items })
    //     }
    //   }

    // useEffect(() => {
    //     async function getUtilityBillsData() {
    //         try {
    //             let req = {};
    //             let response = await serviceGet(`/api/config/utility_bills/${buildingId}`, req);
    //             console.log('Response fetched');
    //             // setUtilityData(response);
    //             console.log('Response Set');
    //             console.log('Response => ', response);
    //         } catch (error) {
    //             console.log(error);
    //             alert('Failed to fetch utility bills data!');
    //         }
    //     }
    //     getUtilityBillsData();
    // }, []);
    useEffect(() => {
        const fetchUtilityBillsData = async () => {
            try {
                if (bldgId) {
                    let headers = {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                    };
                    await axios.get(`${BaseUrl}${generalUtilityBills}/${bldgId}`, { headers }).then((res) => {
                        console.log(res);
                        setUtilityData(res.data);
                    });
                }
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch UtilityBills Data');
            }
        };
        fetchUtilityBillsData();
    }, [bldgId]);

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
        };
        updateBreadcrumbStore();
    }, []);

    const dateFormater = (date) => {
        return moment().format('MMM YYYY');
    };

    const inputsHandler = (e) => {
        setInputField({ ...inputField, [e.target.name]: e.target.value });
    };
    const EditHandler = (e) => {
        e.preventDefault();
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        axios.patch(`${BaseUrl}${generalUtilityBills}/${billId}`, inputField, { headers }).then((res) => {
            console.log(res.data);
            handleClose();
            setRender(!render);
        });
    };
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
                                                            // handleEditItem(record);
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
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Edit Utility Bill</Modal.Title>
                </Modal.Header>
                <Form onSubmit={EditHandler}>
                    <Modal.Body>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>kWh</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter kWh"
                                autoFocus
                                onChange={inputsHandler}
                                name="kWh"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Total Paid</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter total paid on bill"
                                onChange={inputsHandler}
                                name="total_paid"
                            />
                        </Form.Group>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="light" onClick={handleClose}>
                            Cancel
                        </Button>
                        <Button variant="primary" type="submit">
                            Save
                        </Button>
                    </Modal.Footer>
                </Form>
            </Modal>
        </React.Fragment>
    );
};

export default UtilityBills;
