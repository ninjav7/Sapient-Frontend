import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button, FormGroup, Label, Input } from 'reactstrap';
import { Search } from 'react-feather';
import { Link } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { BaseUrl, createBuilding, generalBuilding } from '../../services/Network';
import { ChevronDown } from 'react-feather';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './style.css';
import { useAtom } from 'jotai';
import { buildingData } from '../../store/globalState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';

const BuildingTable = ({ buildingsData, isDataProcessing, setIsDataProcessing }) => {
    return (
        <Card>
            <CardBody>
                <Table className="mb-0 bordered table-hover">
                    <thead>
                        <tr className="mouse-pointer">
                            <th>Name</th>
                            <th>Sq. Ft.</th>
                            <th>Devices</th>
                        </tr>
                    </thead>
                    {isDataProcessing ? (
                        <tbody>
                            <SkeletonTheme color="#202020" height={35}>
                                <tr>
                                    <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td>
                                </tr>
                            </SkeletonTheme>
                        </tbody>
                    ) : (
                        <tbody>
                            {buildingsData.map((record, index) => {
                                return (
                                    <tr key={index} className="mouse-pointer">
                                        <th scope="row">
                                            <Link to="/settings/general">
                                                <div
                                                    className="buildings-name"
                                                    onClick={() => {
                                                        localStorage.setItem('buildingId', record._id);
                                                        localStorage.setItem('buildingName', record.name);
                                                        BuildingStore.update((s) => {
                                                            s.BldgId = record._id;
                                                            s.BldgName = record.name;
                                                        });
                                                    }}>
                                                    {record.name}
                                                </div>
                                            </Link>
                                            <span className="badge badge-soft-secondary label-styling mr-2">
                                                {record.building_type}
                                            </span>
                                        </th>
                                        <td className="font-weight-bold">
                                            {record.building_size.toLocaleString(undefined, {
                                                maximumFractionDigits: 2,
                                            })}
                                        </td>
                                        <td className="font-weight-bold">{record.num_of_devices}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </Table>
            </CardBody>
        </Card>
    );
};

const Buildings = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    // Modal states
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isDataProcessing, setIsDataProcessing] = useState(true);

    // building type
    const [buildingType, setBuildingType] = useState([
        { value: 'Office Building', label: 'Office Building' },
        { value: 'Residential Building', label: 'Residential Building' },
    ]);
    const [buildingName, setBuildingName] = useState('');
    const [buildingTypeSelected, setBuildingTypeSelected] = useState(buildingType[0].value);

    const [createBuildingData, setCreateBuildingData] = useState({});

    const [buildingsData, setBuildingsData] = useState([]);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const bldgName = BuildingStore.useState((s) => s.BldgName);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createBuildingData);
        obj[key] = value;
        setCreateBuildingData(obj);
        console.log(obj);
    };

    const saveBuilding = async () => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let buildingData = {
                building_name: buildingName,
                building_type: buildingTypeSelected,
            };
            setIsProcessing(true);
            console.log(createBuildingData);
            await axios.post(`${BaseUrl}${createBuilding}`, buildingData, { headers }).then((res) => {
                console.log('createBuilding sending data to API => ', res.data);
                // console.log('setOverview => ', res.data);
                handleClose();
                fetchBuildingData();
            });
            // axios.post(`${BaseUrl}${createBuilding}`, createBuildingData, { header }).then((res) => {
            //     console.log('createBuilding sending data to API => ', res.data);

            // });

            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
            console.log('Failed to create Building');
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
            ComponentStore.update((s) => {
                s.parent = 'account';
            });
        };
        updateBreadcrumbStore();
    }, []);

    const [buildingListData] = useAtom(buildingData);

    const fetchBuildingData = async () => {
        try {
            setIsDataProcessing(true);

            //setBuildingsData(buildingListData);
            setIsDataProcessing(false);
        } catch (error) {
            console.log(error);
            setIsDataProcessing(false);
            console.log('Failed to fetch Building Data List');
        }
    };

    useEffect(() => {
        fetchBuildingData();
    }, [buildingListData]);

    const fetchGeneralBuildingData = async()=>{
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
          
            await axios.get(`${BaseUrl}${generalBuilding}`, { headers }).then((res) => {
                console.log('createBuilding sending data to API => ', res.data);
                setBuildingsData(res.data)
            });
        } catch (error) {
            console.log('Failed to create Building');
        }

    }

    useEffect(()=>{
          fetchGeneralBuildingData();
    },[])

    return (
        <React.Fragment>
            <Row className="page-title ml-2">
                <Col className="header-container">
                    <span className="heading-style">Buildings</span>

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

            <Row className="mt-2 ml-2">
                <Col xl={3}>
                    <div className="">
                        <div className="active-sensor-header">
                            <div className="search-container mr-2">
                                <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                                <input
                                    className="search-box ml-2"
                                    type="search"
                                    name="search"
                                    placeholder="Search..."
                                    // value={searchSensor}
                                    // onChange={handleSearchChange}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={6}>
                    <BuildingTable
                        buildingsData={buildingsData}
                        isDataProcessing={isDataProcessing}
                        setIsDataProcessing={setIsDataProcessing}
                    />
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
                                    setBuildingName(e.target.value);
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
                    <Button variant="primary" disabled={isProcessing} onClick={saveBuilding}>
                        {isProcessing ? 'Adding...' : 'Add Building'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Buildings;
