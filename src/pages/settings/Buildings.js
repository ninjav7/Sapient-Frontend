import React, { useState, useEffect } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    Table,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Button,
    Input,
} from 'reactstrap';
import { Search } from 'react-feather';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BreadcrumbStore } from '../../components/BreadcrumbStore';
import { BaseUrl, getBuildings } from '../../services/Network';
import { ChevronDown } from 'react-feather';
import { BuildingStore } from '../../components/BuildingStore';
import './style.css';

const BuildingTable = ({ buildingsData }) => {
    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Sq. Ft.</th>
                            <th>Devices</th>
                        </tr>
                    </thead>
                    <tbody>
                        {buildingsData.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <th scope="row">
                                        <Link to="#">
                                            <a className="buildings-name">{record.building_name}</a>
                                        </Link>
                                        <span className="badge badge-soft-secondary label-styling mr-2">
                                            {record.building_type}
                                        </span>
                                    </th>
                                    <td className="font-weight-bold">
                                        {record.building_size.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="font-weight-bold">{0}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </CardBody>
        </Card>
    );
};

const Buildings = () => {
    // Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [buildingId, setBuildingId] = useState(1);
    // const [buildingData, setBuildingData] = useState([
    //     {
    //         name: '123 Main St. Portland, OR',
    //         label: 'Office',
    //         area: 46332,
    //         devices: 1221,
    //     },
    //     {
    //         name: '15 University Blvd.',
    //         label: 'Office',
    //         area: 31834,
    //         devices: 852,
    //     },
    //     {
    //         name: '6223 Sycamore Ave.',
    //         label: 'Office',
    //         area: 25613,
    //         devices: 25,
    //     },
    // ]);

    const [buildingsData, setBuildingsData] = useState([]);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const bldgName = BuildingStore.useState((s) => s.BldgName);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Buildings',
                        path: '/settings/buildings',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        const fetchBuildingData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                await axios.get(`${BaseUrl}${getBuildings}`, { headers }).then((res) => {
                    setBuildingsData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building Data List');
            }
        };
        fetchBuildingData();
    }, [bldgId]);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Buildings
                    </span>

                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div className="float-right ml-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Building
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={3}>
                    <div class="input-group rounded ml-4">
                        <input
                            type="search"
                            class="form-control rounded"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="search-addon"
                        />
                        <span class="input-group-text border-0" id="search-addon">
                            <Search className="icon-sm" />
                        </span>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={5}>
                    <BuildingTable buildingsData={buildingsData} />
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add Building</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Building Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Building Name"
                                className="font-weight-bold"
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Area (Sq. Ft.)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Area in Sq. Ft."
                                className="font-weight-bold"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>No of Devices</Form.Label>
                            <Form.Control type="number" placeholder="Enter Devices" className="font-weight-bold" />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        Add Building
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Buildings;
