import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { serviceGet } from '../../helpers/api';
// import { generalUtilityBills } from '../../services/Network';
import { BreadcrumbStore } from '../../components/BreadcrumbStore';
import './style.css';

const UtilityBills = () => {
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
    const [buildingId, setBuildingId] = useState(1);

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

    useEffect(() => {
        async function getUtilityBillsData() {
            try {
                let req = {};
                let response = await serviceGet(`/api/config/utility_bills/${buildingId}`, req);
                console.log('Response fetched');
                setUtilityData(response);
                console.log('Response Set');
                console.log('Response => ', response);
            } catch (error) {
                console.log(error);
                alert('Failed to fetch utility bills data!');
            }
        }
        getUtilityBillsData();
    }, []);

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
                                        <th>Blended Rate</th>
                                        <th className="grey-out">Blended Rate</th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {utilityData.map((record, index) => {
                                        return record.kWh === null ? (
                                            <tr key={index} className="table-warning">
                                                <td className="text-warning font-weight-bold">{record.date}</td>
                                                {record.kWh === null ? (
                                                    record.kWh === null && <td>-</td>
                                                ) : (
                                                    <td>{record.kWh} kWh</td>
                                                )}
                                                {record.blended_rate === null ? (
                                                    record.blended_rate === null && <td>-</td>
                                                ) : (
                                                    <td>{record.blended_rate} kWh</td>
                                                )}
                                                {avgRate === null ? (
                                                    avgRate === null && <td>-</td>
                                                ) : (
                                                    <td>{avgRate} kWh</td>
                                                )}
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                {/* <td className="text-primary font-weight-bold">Add</td> */}
                                                <td className="font-weight-bold">
                                                    <a
                                                        class="link-primary"
                                                        onClick={() => {
                                                            handleShow();
                                                            // handleEditItem(record);
                                                        }}>
                                                        Add
                                                    </a>
                                                    {/* <button type="button" class="btn btn-link" onClick={handleShow}>
                                                        Add
                                                    </button> */}
                                                </td>
                                            </tr>
                                        ) : (
                                            <tr key={index}>
                                                <td className="font-weight-bold">{record.date}</td>
                                                {record.kWh === null ? (
                                                    record.kWh === null && <td>-</td>
                                                ) : (
                                                    <td className="font-weight-bold">
                                                        {record.kWh}
                                                        kWh
                                                    </td>
                                                )}
                                                {record.rate === null ? (
                                                    record.rate === null && <td>-</td>
                                                ) : (
                                                    <td className="font-weight-bold">
                                                        {record.rate}
                                                        kWh
                                                    </td>
                                                )}
                                                {avgRate === null ? (
                                                    avgRate === null && <td className="text-muted grey-out">-</td>
                                                ) : (
                                                    <td className="grey-out">{avgRate} kWh</td>
                                                )}
                                                <td></td>
                                                <td></td>
                                                <td></td>
                                                <td></td>
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
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>kWh</Form.Label>
                            <Form.Control type="number" placeholder="Enter kWh" autoFocus />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Total Paid</Form.Label>
                            <Form.Control type="number" placeholder="Enter total paid on bill" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default UtilityBills;
