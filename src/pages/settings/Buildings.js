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
    FormGroup,
    Label,
    Input,
} from 'reactstrap';
import { Search } from 'react-feather';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { BaseUrl, getBuildings, createBuilding } from '../../services/Network';
import { ChevronDown } from 'react-feather';
import { BuildingStore } from '../../store/BuildingStore';
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

    const [isProcessing, setIsProcessing] = useState(false);

    // building type
    const [buildingType, setBuildingType] = useState([
        { value: 'Commercial Building', label: 'Commercial Building' },
        { value: 'Residential Building', label: 'Residential Building' },
    ]);
    const [buildingTypeSelected, setBuildingTypeSelected] = useState(buildingType[0].value);

    const [createBuildingData, setCreateBuildingData] = useState({});

    const [buildingsData, setBuildingsData] = useState([]);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const bldgName = BuildingStore.useState((s) => s.BldgName);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createBuildingData);
        obj[key] = value;
        setCreateBuildingData(obj);
    };

    const saveBuilding = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                'user-auth': '628f3144b712934f578be895',
            };
            setIsProcessing(true);

            axios.post(`${BaseUrl}${createBuilding}`, createBuildingData, { header }).then((res) => {
                console.log('createBuilding sending data to API => ', res.data);
                // handleClose();
            });

            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            alert('Failed to create Building');
        }
    };

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
        console.log('createBuildingData => ', createBuildingData);
    });

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

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                }}>
                                <i className="uil uil-plus mr-1"></i>
                                Add Building
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
                <Col lg={6}>
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
                                onChange={(e) => {
                                    handleChange('building_name', e.target.value);
                                }}
                                autoFocus
                            />
                        </Form.Group>

                        <FormGroup>
                            <Label for="userState" className="card-title">
                                Type
                            </Label>
                            <div>
                                <Input
                                    type="select"
                                    name="typee"
                                    id="exampleSelect"
                                    onChange={(e) => {
                                        setBuildingTypeSelected(e.target.value);
                                        handleChange('building_type', e.target.value);
                                    }}
                                    className="font-weight-bold">
                                    <option>Select Building Type</option>
                                    {buildingType.map((record) => {
                                        return <option value={record.value}>{record.label}</option>;
                                    })}
                                </Input>
                            </div>
                        </FormGroup>

                        {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Area (Sq. Ft.)</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter Area in Sq. Ft."
                                className="font-weight-bold"
                            />
                        </Form.Group> */}

                        {/* <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>No of Devices</Form.Label>
                            <Form.Control type="number" placeholder="Enter Devices" className="font-weight-bold" />
                        </Form.Group> */}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="light" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        variant="primary"
                        disabled={isProcessing}
                        onClick={() => {
                            saveBuilding();
                            // handleClose();
                        }}>
                        {isProcessing ? 'Adding...' : 'Add Building'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Buildings;
