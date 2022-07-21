import React, { useEffect, useState } from 'react';
import { Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { useAtom } from 'jotai';
import './style.css';
import axios from 'axios';
import { BaseUrl, createSpace, getFloors, getLayouts, getSpaces } from '../../services/Network';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import EditFloorModal from '../../components/Layouts/EditFloorModal';
import {
    closedEditFloorModal,
    closeEditSpaceModal,
    floorid,
    floorState,
    iterationDataList,
    iterationNumber,
    spaceId,
    spaceName,
} from '../../store/globalState';
import InfiniteSpae from '../../components/Layouts/InfiniteSpae';
import EditSpace from '../../components/Layouts/EditSpace';

const Layout = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    console.log('userdata', userdata);

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    // Saving API data
    const [floorListAPI, setFloorListAPI] = useState([]);
    const [spaceListAPI, setSpaceListAPI] = useState([]);
    console.log('floorListAPI', floorListAPI);

    const [modalShow, setModalShow] = useState(false);
    const [floorId, setFloorId] = useState('');

    const [floorModal] = useAtom(closedEditFloorModal);
    const [getSpaceName, setGetSpaceName] = useAtom(spaceName);
    // const [spaceID, setSpaceID] = useAtom(spaceId);

    const [iterationValue, setInterationValue] = useAtom(iterationDataList);
    const [iteratingNumber, setIteratingNumber] = useAtom(iterationNumber);

    const [modelToShow, setModelToShow] = useState(1);
    const [modalSpaceShow, setModalSpaceShow] = useState(false);
    const [closeModal] = useAtom(closeEditSpaceModal);

    const [currentFloorId, setCurrentFloorId] = useAtom(floorid);
    console.log('iterationValue', iterationValue, iteratingNumber);
    const [floor2] = useAtom(floorState);
    console.log('floor2', floor2);
    const [spaceBody, setSpaceBody] = useState({
        floor_id: currentFloorId,
        building_id: bldgId,
    });

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        const params = `?building_id=${bldgId}`;
        axios.get(`${BaseUrl}${getFloors}${params}`, { headers }).then((res) => {
            setFloorListAPI(res.data.data);
        });
    }, [bldgId]);

    // Call only when floor create modal is completed
    useEffect(() => {
        if (floorModal) {
            const headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            const params = `?building_id=${bldgId}`;
            axios.get(`${BaseUrl}${getFloors}${params}`, { headers }).then((res) => {
                setFloorListAPI(res.data.data);
            });
        }
    }, [floorModal]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Layout',
                        path: '/settings/layout',
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

    useEffect(() => {
        if (floorId) {
            const headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            const params = `?floor_id=${floorId}`;
            axios.get(`${BaseUrl}${getSpaces}${params}`, { headers }).then((res) => {
                setSpaceListAPI(res.data.data);
            });
        }
    }, [floorId]);

    const createSpacesAPI = () => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.post(`${BaseUrl}${createSpace}`, spaceBody, { headers }).then((res) => {});
    };

    useEffect(() => {
        if (closeModal) {
            createSpacesAPI();
        }
    }, [closeModal]);

    return (
        <React.Fragment>
            <EditFloorModal show={modalShow} onHide={() => setModalShow(false)} />
            <EditSpace show={modalSpaceShow} onHide={() => setModalSpaceShow(false)} />
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Layout
                    </span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div className="mt-2 mr-2">
                            <span className="text-warning font-weight-bold">3 Unsaved Changes</span>
                        </div>
                        <div className="float-right ml-2">
                            <button type="button" className="btn btn-md btn-light font-weight-bold">
                                Revert Changes
                            </button>
                        </div>
                        <div className="float-right ml-2">
                            <button type="button" className="btn btn-md btn-light font-weight-bold">
                                Save Draft
                            </button>
                        </div>
                        <div className="float-right ml-2">
                            <button type="button" className="btn btn-md btn-primary font-weight-bold">
                                Publish
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <div className="layout-container mt-4">
                        {/* Floor List */}

                        <div className="container-column">
                            <div className="container-heading">
                                <span>Building Root</span>
                                <div className="mr-2" style={{ marginLeft: 'auto' }}>
                                    <i className="uil uil-filter mr-3"></i>
                                    {/* <i className="uil uil-plus mr-2"></i> */}
                                    <UncontrolledDropdown className="align-self-center float-right">
                                        <DropdownToggle
                                            tag="button"
                                            className="btn btn-link p-0 dropdown-toggle text-muted">
                                            <i className="uil uil-plus mr-2"></i>
                                        </DropdownToggle>
                                        <DropdownMenu right>
                                            <DropdownItem
                                                onClick={() => {
                                                    setModalShow(true);
                                                }}>
                                                Add Floor
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>
                            <div className="container-content-group">
                                {floorListAPI.map((floorName, i) => (
                                    <div
                                        className="container-single-content mr-4"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setFloorId(floorName?.floor_id);
                                            // setSpaceID(floorName?.floor_id);
                                            setCurrentFloorId(floorName?.floor_id);
                                            setGetSpaceName(floorName?.name);
                                            setModelToShow(2);
                                        }}>
                                        <span> {floorName?.name}</span>
                                        <span class="badge badge-light font-weight-bold float-right mr-4"></span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Spaces */}
                        {/* {Array(iteratingNumber)
                            .fill(0)
                            .map((_, i) => {
                                return <InfiniteSpae floorId={floorId} />;
                            })} */}
                        {/* Create Space */}
                        {modelToShow >= 2 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName}</span>
                                    <div className="mr-2" style={{ marginLeft: 'auto' }}>
                                        <i className="uil uil-filter mr-3"></i>
                                        {/* <i className="uil uil-plus mr-2"></i> */}
                                        <UncontrolledDropdown className="align-self-center float-right">
                                            <DropdownToggle
                                                tag="button"
                                                className="btn btn-link p-0 dropdown-toggle text-muted">
                                                <i className="uil uil-plus mr-2"></i>
                                            </DropdownToggle>
                                            <DropdownMenu right>
                                                <DropdownItem
                                                    onClick={() => {
                                                        setModalSpaceShow(true);
                                                    }}>
                                                    Add Floor
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI.map((spaceName, i) => (
                                        <div
                                            className="container-single-content mr-4"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                // setFloorId(spaceName?.floor_id);
                                                // setSpaceID(spaceName?.floor_id);
                                                setGetSpaceName(spaceName?.name);
                                                // setIteratingNumber(iteratingNumber + 1);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light font-weight-bold float-right mr-4"></span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Layout;
