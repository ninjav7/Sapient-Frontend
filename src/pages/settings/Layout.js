import React, { useEffect, useState } from 'react';
import { Row, Col, UncontrolledDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { useAtom } from 'jotai';
import './style.css';
import axios from 'axios';
import { BaseUrl, createSpace, getFloors, getLayouts, getSpaces, getSpaceTypes } from '../../services/Network';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import EditFloorModal from '../../components/Layouts/EditFloorModal';
import {
    closedEditFloorModal,
    closeEditSpaceModal,
    floorid,
    flooridNew,
    floorIdState,
    floorState,
    iterationDataList,
    iterationNumber,
    reloadSpaces,
    spaceId,
    spaceName,
    spaceName10,
    spaceName11,
    spaceName12,
    spaceName13,
    spaceName14,
    spaceName15,
    spaceName16,
    spaceName17,
    spaceName18,
    spaceName19,
    spaceName2,
    spaceName20,
    spaceName3,
    spaceName4,
    spaceName5,
    spaceName6,
    spaceName7,
    spaceName8,
    spaceName9,
    spaceNameList,
} from '../../store/globalState';
import InfiniteSpae from '../../components/Layouts/InfiniteSpace';
import EditSpace from '../../components/Layouts/EditSpace';
import InfiniteSpace from '../../components/Layouts/InfiniteSpace';

const Layout = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    console.log('userdata', userdata);

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    // Saving API data
    const [floorListAPI, setFloorListAPI] = useState([]);
    const [spaceListAPI, setSpaceListAPI] = useState([]);
    const [spaceListAPI2, setSpaceListAPI2] = useState([]);
    const [spaceListAPI3, setSpaceListAPI3] = useState([]);
    const [spaceListAPI4, setSpaceListAPI4] = useState([]);
    const [spaceListAPI5, setSpaceListAPI5] = useState([]);
    const [spaceListAPI6, setSpaceListAPI6] = useState([]);
    const [spaceListAPI7, setSpaceListAPI7] = useState([]);
    const [spaceListAPI8, setSpaceListAPI8] = useState([]);
    const [spaceListAPI9, setSpaceListAPI9] = useState([]);
    const [spaceListAPI10, setSpaceListAPI10] = useState([]);
    const [spaceListAPI11, setSpaceListAPI11] = useState([]);
    const [spaceListAPI12, setSpaceListAPI12] = useState([]);
    const [spaceListAPI13, setSpaceListAPI13] = useState([]);
    const [spaceListAPI14, setSpaceListAPI14] = useState([]);
    const [spaceListAPI15, setSpaceListAPI15] = useState([]);
    const [spaceListAPI16, setSpaceListAPI16] = useState([]);
    const [spaceListAPI17, setSpaceListAPI17] = useState([]);
    const [spaceListAPI18, setSpaceListAPI18] = useState([]);
    const [spaceListAPI19, setSpaceListAPI19] = useState([]);
    const [spaceListAPI20, setSpaceListAPI20] = useState([]);
    console.log('floorListAPI', floorListAPI);

    const [modalShow, setModalShow] = useState(false);
    const [floorId, setFloorId] = useState('');
    const [floorid, setFloorid] = useAtom(floorIdState);

    const [floorModal] = useAtom(closedEditFloorModal);

    // Space Name
    const [getSpaceName, setGetSpaceName] = useAtom(spaceName);
    const [getSpaceName2, setGetSpaceName2] = useAtom(spaceName2);
    const [getSpaceName3, setGetSpaceName3] = useAtom(spaceName3);
    const [getSpaceName4, setGetSpaceName4] = useAtom(spaceName3);
    const [getSpaceName5, setGetSpaceName5] = useAtom(spaceName4);
    const [getSpaceName6, setGetSpaceName6] = useAtom(spaceName5);
    const [getSpaceName7, setGetSpaceName7] = useAtom(spaceName6);
    const [getSpaceName8, setGetSpaceName8] = useAtom(spaceName7);
    const [getSpaceName9, setGetSpaceName9] = useAtom(spaceName8);
    const [getSpaceName10, setGetSpaceName10] = useAtom(spaceName9);
    const [getSpaceName11, setGetSpaceName11] = useAtom(spaceName10);
    const [getSpaceName12, setGetSpaceName12] = useAtom(spaceName11);
    const [getSpaceName13, setGetSpaceName13] = useAtom(spaceName12);
    const [getSpaceName14, setGetSpaceName14] = useAtom(spaceName13);
    const [getSpaceName15, setGetSpaceName15] = useAtom(spaceName14);
    const [getSpaceName16, setGetSpaceName16] = useAtom(spaceName15);
    const [getSpaceName17, setGetSpaceName17] = useAtom(spaceName16);
    const [getSpaceName18, setGetSpaceName18] = useAtom(spaceName17);
    const [getSpaceName19, setGetSpaceName19] = useAtom(spaceName18);
    const [getSpaceName20, setGetSpaceName20] = useAtom(spaceName19);
    const [getSpaceName21, setGetSpaceName21] = useAtom(spaceName20);
    // TODO:
    const [spaceNames, setSpaceNames] = useAtom(spaceNameList);
    // const [spaceID, setSpaceID] = useAtom(spaceId);

    const [iterationValue, setInterationValue] = useAtom(iterationDataList);
    const [iteratingNumber, setIteratingNumber] = useAtom(iterationNumber);

    const [modelToShow, setModelToShow] = useState(1);

    // Modal to show
    const [modalSpaceShow, setModalSpaceShow] = useState(false);
    const [modalSpaceShow2, setModalSpaceShow2] = useState(false);
    const [modalSpaceShow3, setModalSpaceShow3] = useState(false);
    const [modalSpaceShow4, setModalSpaceShow4] = useState(false);
    const [modalSpaceShow5, setModalSpaceShow5] = useState(false);
    const [modalSpaceShow6, setModalSpaceShow6] = useState(false);
    const [modalSpaceShow7, setModalSpaceShow7] = useState(false);
    const [modalSpaceShow8, setModalSpaceShow8] = useState(false);
    const [modalSpaceShow9, setModalSpaceShow9] = useState(false);
    const [modalSpaceShow10, setModalSpaceShow10] = useState(false);
    const [modalSpaceShow11, setModalSpaceShow11] = useState(false);
    const [modalSpaceShow12, setModalSpaceShow12] = useState(false);
    const [modalSpaceShow13, setModalSpaceShow13] = useState(false);
    const [modalSpaceShow14, setModalSpaceShow14] = useState(false);
    const [modalSpaceShow15, setModalSpaceShow15] = useState(false);
    const [modalSpaceShow16, setModalSpaceShow16] = useState(false);
    const [modalSpaceShow17, setModalSpaceShow17] = useState(false);
    const [modalSpaceShow18, setModalSpaceShow18] = useState(false);
    const [modalSpaceShow19, setModalSpaceShow19] = useState(false);
    const [modalSpaceShow20, setModalSpaceShow20] = useState(false);

    const [closeModal] = useAtom(closeEditSpaceModal);

    const [currentFloorId, setCurrentFloorId] = useAtom(flooridNew);

    console.log('iterationValue', iterationValue, iteratingNumber);
    const [floor2, setFloor1] = useAtom(floorState);
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

    const [reloadSpace, setReloadSpace] = useAtom(reloadSpaces);
    console.log('reloadSpace', reloadSpace);

    useEffect(() => {
        if (floorid || reloadSpace === 'true') {
            const headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            const params = `?floor_id=${floorid}`;
            axios.get(`${BaseUrl}${getSpaces}${params}`, { headers }).then((res) => {
                if (modelToShow === 2) {
                    setSpaceListAPI(res.data.data);
                    setReloadSpace('false');
                }
                if (modelToShow === 3) {
                    setSpaceListAPI2(res.data.data);
                }
                if (modelToShow === 4) {
                    setSpaceListAPI3(res.data.data);
                }
                if (modelToShow === 5) {
                    setSpaceListAPI4(res.data.data);
                }
                if (modelToShow === 6) {
                    setSpaceListAPI5(res.data.data);
                }
                if (modelToShow === 7) {
                    setSpaceListAPI6(res.data.data);
                }
                if (modelToShow === 8) {
                    setSpaceListAPI7(res.data.data);
                }
                if (modelToShow === 9) {
                    setSpaceListAPI8(res.data.data);
                }
                if (modelToShow === 10) {
                    setSpaceListAPI9(res.data.data);
                }
                if (modelToShow === 11) {
                    setSpaceListAPI10(res.data.data);
                }
                if (modelToShow === 12) {
                    setSpaceListAPI11(res.data.data);
                }
                if (modelToShow === 13) {
                    setSpaceListAPI12(res.data.data);
                }
                if (modelToShow === 14) {
                    setSpaceListAPI13(res.data.data);
                }
                if (modelToShow === 15) {
                    setSpaceListAPI14(res.data.data);
                }
                if (modelToShow === 16) {
                    setSpaceListAPI15(res.data.data);
                }
                if (modelToShow === 17) {
                    setSpaceListAPI16(res.data.data);
                }
                if (modelToShow === 18) {
                    setSpaceListAPI17(res.data.data);
                }
                if (modelToShow === 19) {
                    setSpaceListAPI18(res.data.data);
                }
            });
        }
    }, [floorid, reloadSpace]);

    const createSpacesAPI = () => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.post(`${BaseUrl}${createSpace}`, spaceBody, { headers }).then((res) => {});
    };

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.get(`${BaseUrl}${getSpaceTypes}`, { headers }).then((res) => {
            setFloor1(res?.data?.data?.[0]?.generic_spacetypes);
        });
    }, []);

    useEffect(() => {
        if (closeModal) {
            createSpacesAPI();
        }
    }, [closeModal]);

    return (
        <React.Fragment>
            <EditFloorModal show={modalShow} onHide={() => setModalShow(false)} />
            <EditSpace show={modalSpaceShow} onHide={() => setModalSpaceShow(false)} />
            <EditSpace show={modalSpaceShow2} onHide={() => setModalSpaceShow2(false)} />
            <EditSpace show={modalSpaceShow3} onHide={() => setModalSpaceShow3(false)} />
            <EditSpace show={modalSpaceShow4} onHide={() => setModalSpaceShow4(false)} />
            <EditSpace show={modalSpaceShow5} onHide={() => setModalSpaceShow5(false)} />
            <EditSpace show={modalSpaceShow6} onHide={() => setModalSpaceShow6(false)} />
            <EditSpace show={modalSpaceShow7} onHide={() => setModalSpaceShow7(false)} />
            <EditSpace show={modalSpaceShow8} onHide={() => setModalSpaceShow8(false)} />
            <EditSpace show={modalSpaceShow9} onHide={() => setModalSpaceShow9(false)} />
            <EditSpace show={modalSpaceShow10} onHide={() => setModalSpaceShow10(false)} />
            <EditSpace show={modalSpaceShow11} onHide={() => setModalSpaceShow11(false)} />
            <EditSpace show={modalSpaceShow12} onHide={() => setModalSpaceShow12(false)} />
            <EditSpace show={modalSpaceShow13} onHide={() => setModalSpaceShow13(false)} />
            <EditSpace show={modalSpaceShow14} onHide={() => setModalSpaceShow14(false)} />
            <EditSpace show={modalSpaceShow15} onHide={() => setModalSpaceShow15(false)} />
            <EditSpace show={modalSpaceShow16} onHide={() => setModalSpaceShow16(false)} />
            <EditSpace show={modalSpaceShow17} onHide={() => setModalSpaceShow17(false)} />
            <EditSpace show={modalSpaceShow18} onHide={() => setModalSpaceShow18(false)} />
            <EditSpace show={modalSpaceShow19} onHide={() => setModalSpaceShow19(false)} />
            <EditSpace show={modalSpaceShow20} onHide={() => setModalSpaceShow20(false)} />
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Layout</span>

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
                                        className="container-single-content "
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            // setFloorId(floorName?.floor_id);
                                            setFloorid(floorName?.floor_id);
                                            // setSpaceID(floorName?.floor_id);
                                            setCurrentFloorId(floorName?.floor_id);
                                            setGetSpaceName(floorName?.name);
                                            setModelToShow(2);
                                        }}>
                                        <span> {floorName?.name}</span>
                                        <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                            {spaceName?.type}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* modal to show 2 */}
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
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI.map((spaceName, i) => (
                                        <div
                                            className="container-single-content"
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setFloorid(spaceName?.id);
                                                setGetSpaceName2(spaceName?.name);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(3);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 3 */}
                        {modelToShow >= 3 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName2}</span>
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
                                                        setModalSpaceShow2(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI2.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setGetSpaceName3(spaceName?.name);
                                                setModelToShow(4);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 4 */}
                        {modelToShow >= 4 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName3}</span>
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
                                                        setModalSpaceShow4(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI3.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName4(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(5);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 5 */}
                        {modelToShow >= 5 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName4}</span>
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
                                                        setModalSpaceShow5(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI4.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName5(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(6);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 6 */}
                        {modelToShow >= 6 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName5}</span>
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
                                                        setModalSpaceShow6(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI5.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName6(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(7);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 7 */}
                        {modelToShow >= 7 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName6}</span>
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
                                                        setModalSpaceShow7(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI6.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName7(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(8);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 8 */}
                        {modelToShow >= 8 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName7}</span>
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
                                                        setModalSpaceShow8(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI7.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName8(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(9);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 9 */}
                        {modelToShow >= 9 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName8}</span>
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
                                                        setModalSpaceShow8(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI8.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName9(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(10);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 10 */}
                        {modelToShow >= 10 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName9}</span>
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
                                                        setModalSpaceShow9(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI9.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName10(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(11);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 11 */}
                        {modelToShow >= 11 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName10}</span>
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
                                                        setModalSpaceShow10(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI10.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName11(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(12);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 12 */}
                        {modelToShow >= 12 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName11}</span>
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
                                                        setModalSpaceShow11(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI11.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName12(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(13);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 13 */}
                        {modelToShow >= 13 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName12}</span>
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
                                                        setModalSpaceShow12(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI12.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName13(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(14);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 14 */}
                        {modelToShow >= 14 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName13}</span>
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
                                                        setModalSpaceShow13(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI13.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName14(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(15);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 15 */}
                        {modelToShow >= 15 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName14}</span>
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
                                                        setModalSpaceShow14(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI14.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName15(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(16);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 16 */}
                        {modelToShow >= 16 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName15}</span>
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
                                                        setModalSpaceShow15(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI15.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName16(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(17);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 17 */}
                        {modelToShow >= 17 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName16}</span>
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
                                                        setModalSpaceShow16(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI16.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName17(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(18);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 18 */}
                        {modelToShow >= 18 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName17}</span>
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
                                                        setModalSpaceShow17(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI17.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName18(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(19);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 19 */}
                        {modelToShow >= 19 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName18}</span>
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
                                                        setModalSpaceShow18(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI18.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName19(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(20);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* modal to show 20 */}
                        {modelToShow >= 20 && (
                            <div className="container-column">
                                <div className="container-heading">
                                    <span>{getSpaceName19}</span>
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
                                                        setModalSpaceShow19(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI19.map((spaceName, i) => (
                                        <div
                                            className="container-single-content "
                                            style={{ cursor: 'pointer' }}
                                            onClick={() => {
                                                setGetSpaceName20(spaceName?.name);
                                                setFloorid(spaceName?.id);
                                                setCurrentFloorId(spaceName?.id);
                                                setModelToShow(21);
                                            }}>
                                            <span> {spaceName?.name}</span>
                                            <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                {spaceName?.type}
                                            </span>
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
