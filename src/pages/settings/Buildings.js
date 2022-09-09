import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button, FormGroup, Label, Input } from 'reactstrap';

import { Search } from 'react-feather';
import { Link, useLocation } from 'react-router-dom';
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
import { buildingData, userPermissionData } from '../../store/globalState';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/pro-regular-svg-icons';
import { useQuery } from 'react-query';
import { QueryClient } from 'react-query';

const BuildingTable = ({ buildingsData, isDataProcessing, setIsDataProcessing, error }) => {
    const [userPermission] = useAtom(userPermissionData);

    const [internalRoute, setInternalRoute] = useState([
        '/settings/general',
        '/settings/layout',
        '/settings/equipment',
        '/settings/panels',
        '/settings/active-devices',
    ]);

    useEffect(() => {
        if (!userPermission?.permissions?.permissions?.building_details_permission?.view) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/general';
                })
            );
        }
        if (!userPermission?.permissions?.permissions?.building_layout_permission?.view) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/layout';
                })
            );
        }
        if (!userPermission?.permissions?.permissions?.building_equipment_permission?.view) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/equipment';
                })
            );
        }
        if (!userPermission?.permissions?.permissions?.building_panels_permission?.view) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/panels';
                })
            );
            if (!internalRoute.includes('/settings/active-devices')) {
                setInternalRoute((el) => [...el, '/settings/active-devices']);
            }
        }

        if (
            userPermission?.permissions?.permissions?.building_details_permission?.view &&
            !internalRoute.includes('/settings/general')
        ) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/active-devices';
                })
            );
            setInternalRoute((el) => [...el, '/settings/general']);
        }

        if (
            userPermission?.permissions?.permissions?.building_layout_permission?.view &&
            !internalRoute.includes('/settings/layout')
        ) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/active-devices';
                })
            );
            setInternalRoute((el) => [...el, '/settings/layout']);
        }

        if (
            userPermission?.permissions?.permissions?.building_equipment_permission?.view &&
            !internalRoute.includes('/settings/equipment')
        ) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/active-devices';
                })
            );
            setInternalRoute((el) => [...el, '/settings/equipment']);
        }

        if (
            userPermission?.permissions?.permissions?.building_panels_permission?.view &&
            !internalRoute.includes('/settings/panels')
        ) {
            setInternalRoute((el) =>
                el.filter((current) => {
                    return current !== '/settings/active-devices';
                })
            );
            setInternalRoute((el) => [...el, '/settings/panels']);
        }
    }, [userPermission]);

    return (
        <Card>
            <CardBody>
                {error ? (
                    <>
                        <p>You don't have view access of this page</p>
                    </>
                ) : (
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
                                                {userPermission?.permissions?.permissions?.account_buildings_permission
                                                    ?.edit && (
                                                    <Link to={`${internalRoute[0]}`}>
                                                        <div
                                                            className="buildings-name"
                                                            onClick={() => {
                                                                console.log(
                                                                    'recordBuilding_idName',
                                                                    record.building_id,
                                                                    record.building_name
                                                                );
                                                                localStorage.setItem('buildingId', record.building_id);
                                                                localStorage.setItem(
                                                                    'buildingName',
                                                                    record.building_name
                                                                );
                                                                BuildingStore.update((s) => {
                                                                    s.BldgId = record.building_id;
                                                                    s.BldgName = record.building_name;
                                                                });
                                                            }}>
                                                            {record.building_name}
                                                        </div>
                                                    </Link>
                                                )}
                                                {!userPermission?.permissions?.permissions?.account_buildings_permission
                                                    ?.edit && (
                                                    <div
                                                        className="buildings-name"
                                                        onClick={() => {
                                                            console.log(
                                                                'recordBuilding_idName',
                                                                record.building_id,
                                                                record.building_name
                                                            );
                                                            localStorage.setItem('buildingId', record.building_id);
                                                            localStorage.setItem('buildingName', record.building_name);
                                                            BuildingStore.update((s) => {
                                                                s.BldgId = record.building_id;
                                                                s.BldgName = record.building_name;
                                                            });
                                                        }}>
                                                        {record.building_name}
                                                    </div>
                                                )}
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
                )}
            </CardBody>
        </Card>
    );
};

const Buildings = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const location = useLocation();
    const controller = new AbortController();

    const queryClient = new QueryClient();

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

    const fetchGeneralBuildingData = async ({ signal }) => {
        let headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        const { data } = await axios.get(`${BaseUrl}${generalBuilding}`, { headers }, signal);
        setBuildingsData(data);
        return data;
    };
    const { data, error, isError, isLoading } = useQuery('generalBuilding', fetchGeneralBuildingData);

    console.log('data', data, 'isLoading', isLoading, 'erro', error);
    const [userPermission] = useAtom(userPermissionData);

    return (
        <React.Fragment>
            <Row className="page-title ml-2">
                <Col className="header-container">
                    <span className="heading-style">Buildings</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            {userPermission?.permissions?.permissions?.account_buildings_permission?.create && (
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary font-weight-bold"
                                    onClick={() => {
                                        handleShow();
                                    }}>
                                    <i className="uil uil-plus mr-1"></i>
                                    Add Building
                                </button>
                            )}
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
                        error={error}
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
