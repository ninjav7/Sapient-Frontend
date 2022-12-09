import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button, FormGroup, Label, Input } from 'reactstrap';

import { Search } from 'react-feather';
import { Link, useLocation } from 'react-router-dom';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { BaseUrl, getBuilding, createBuilding, generalBuilding } from '../../services/Network';
import { ChevronDown } from 'react-feather';
import { BuildingListStore, BuildingStore } from '../../store/BuildingStore';
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
import Select from 'react-select';
import { textAlign } from '@mui/system';

const BuildingTable = ({ buildingsData, isDataProcessing, setIsDataProcessing, error }) => {
    const [userPermission] = useAtom(userPermissionData);

    const [internalRoute, setInternalRoute] = useState([
        '/settings/general',
        '/settings/layout',
        '/settings/equipment',
        '/settings/panels',
        '/settings/active-devices',
    ]);

    const handleBuildingClick = (record) => {
        localStorage.setItem('buildingId', record.building_id);
        localStorage.setItem('buildingName', record.building_name);
        localStorage.setItem('buildingTimeZone', record.timezone);
        BuildingStore.update((s) => {
            s.BldgId = record.building_id;
            s.BldgName = record.building_name;
            s.BldgTimeZone = record.timezone;
        });
    };

    useEffect(() => {
        if (userPermission?.user_role !== 'admin') {
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
        }
        if (userPermission.user_role === 'admin') {
            setInternalRoute([]);
            setInternalRoute(['/settings/general']);
        }
    }, [userPermission]);

    return (
        <Card>
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
                                            {userPermission?.user_role === 'admin' ||
                                            userPermission?.permissions?.permissions?.account_buildings_permission
                                                ?.edit ? (
                                                <Link to={`${internalRoute[0]}`}>
                                                    <div
                                                        className="buildings-name"
                                                        onClick={() => {
                                                            handleBuildingClick(record);
                                                        }}>
                                                        {record.building_name}
                                                    </div>
                                                </Link>
                                            ) : (
                                                <div
                                                    className="buildings-name"
                                                    onClick={() => {
                                                        handleBuildingClick(record);
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
        </Card>
    );
};

const Buildings = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const location = useLocation();
    const controller = new AbortController();

    const [formalidation, setFormalidation] = useState(false);

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
    const [buildingTypeSelected, setBuildingTypeSelected] = useState('');

    useEffect(() => {
        if (buildingName.length > 0 && buildingTypeSelected.length > 0) {
            setFormalidation(true);
        }
    }, [buildingName, buildingTypeSelected]);

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
            await axios.post(`${BaseUrl}${createBuilding}`, buildingData, { headers }).then((res) => {
                handleClose();
                fetchGeneralBuildingData();
                fetchBuildingData();
                BuildingListStore.update((s) => {
                    s.fetchBuildingList = true;
                });
            });
            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
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
            setIsDataProcessing(false);
        } catch (error) {
            setIsDataProcessing(false);
        }
    };

    useEffect(() => {
        fetchBuildingData();
    }, [buildingListData]);

    const fetchGeneralBuildingData = async () => {
        let headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        const { data } = await axios.get(`${BaseUrl}${generalBuilding}`, { headers });
        setBuildingsData(data);
        return data;
    };
    const { data, error, isError, isLoading } = useQuery('generalBuilding', fetchGeneralBuildingData);

    const [userPermission] = useAtom(userPermissionData);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Buildings</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mr-2">
                            {userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.account_buildings_permission?.create ? (
                                <button
                                    type="button"
                                    className="btn btn-md btn-primary font-weight-bold"
                                    onClick={() => {
                                        handleShow();
                                    }}>
                                    <i className="uil uil-plus mr-1"></i>
                                    Add Building
                                </button>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-4">
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
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={10} className="mt-4">
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
                                <Select
                                    options={buildingType}
                                    name="typee"
                                    id="exampleSelect"
                                    onChange={(e) => {
                                        setBuildingTypeSelected(e.value);
                                    }}
                                    className="font-weight-bold"
                                />
                            </div>
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div style={{ display: 'flex', width: '100%', gap: '4px' }}>
                        <Button
                            style={{ width: '50%', backgroundColor: '#fff', border: '1px solid black', color: '#000' }}
                            onClick={() => {
                                setFormalidation(false);
                                handleClose();
                            }}>
                            Cancel
                        </Button>
                        <div style={{ width: '50%' }}>
                            {!formalidation ? (
                                <Button
                                    style={{ width: '100%', backgroundColor: '#444CE7', border: 'none' }}
                                    variant="primary"
                                    disabled={true}
                                    onClick={saveBuilding}>
                                    {isProcessing ? 'Adding...' : 'Add Building'}
                                </Button>
                            ) : (
                                <Button
                                    style={{ width: '100%', backgroundColor: '#444CE7', border: 'none' }}
                                    variant="primary"
                                    disabled={isProcessing}
                                    onClick={saveBuilding}>
                                    {isProcessing ? 'Adding...' : 'Add Building'}
                                </Button>
                            )}
                        </div>
                    </div>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default Buildings;
