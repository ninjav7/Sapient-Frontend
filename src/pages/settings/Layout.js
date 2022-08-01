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
import Skeleton from 'react-loading-skeleton';
import EditFloorModal from '../../components/Layouts/EditFloorModal';
import {
    closedEditFloorModal,
    closeEditSpaceModal,
    currentFloorIdNow2,
    currentFloorIdNow3,
    currentFloorIdNow4,
    currentFloorIdNow5,
    currentFloorIdNow6,
    currentFloorIdNow7,
    currentFloorIdNow8,
    currentFloorIdNow9,
    floorid,
    flooridNew,
    floorIdState,
    floorState,
    floorStaticId,
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

    console.log('floorListAPI', floorListAPI);

    const [modalShow, setModalShow] = useState(false);
    const [floorId, setFloorId] = useState('');
    const [floorid, setFloorid] = useAtom(floorIdState);

    const [currentFloorId2, setCurrentFloorId2] = useAtom(currentFloorIdNow2);
    const [currentFloorId3, setCurrentFloorId3] = useAtom(currentFloorIdNow3);
    const [currentFloorId4, setCurrentFloorId4] = useAtom(currentFloorIdNow4);
    const [currentFloorId5, setCurrentFloorId5] = useAtom(currentFloorIdNow5);
    const [currentFloorId6, setCurrentFloorId6] = useAtom(currentFloorIdNow6);
    const [currentFloorId7, setCurrentFloorId7] = useAtom(currentFloorIdNow7);
    const [currentFloorId8, setCurrentFloorId8] = useAtom(currentFloorIdNow8);
    const [currentFloorId9, setCurrentFloorId9] = useAtom(currentFloorIdNow9);
    const [currentFloorId10, setCurrentFloorId10] = useState('');
    const [currentFloorId11, setCurrentFloorId11] = useState('');
    const [currentFloorId12, setCurrentFloorId12] = useState('');
    const [currentFloorId13, setCurrentFloorId13] = useState('');
    const [currentFloorId14, setCurrentFloorId14] = useState('');
    const [currentFloorId15, setCurrentFloorId15] = useState('');
    const [currentFloorId16, setCurrentFloorId16] = useState('');
    const [currentFloorId17, setCurrentFloorId17] = useState('');
    const [currentFloorId18, setCurrentFloorId18] = useState('');
    const [currentFloorId19, setCurrentFloorId19] = useState('');
    const [currentFloorId20, setCurrentFloorId20] = useState('');

    console.log('currentFloorId3', currentFloorId3);

    const [floorModal] = useAtom(closedEditFloorModal);

    // Space Name
    const [getSpaceName, setGetSpaceName] = useAtom(spaceName);
    const [getSpaceName2, setGetSpaceName2] = useAtom(spaceName2);
    const [getSpaceName3, setGetSpaceName3] = useAtom(spaceName3);
    const [getSpaceName4, setGetSpaceName4] = useAtom(spaceName4);
    const [getSpaceName5, setGetSpaceName5] = useAtom(spaceName5);
    const [getSpaceName6, setGetSpaceName6] = useAtom(spaceName6);
    const [getSpaceName7, setGetSpaceName7] = useAtom(spaceName7);
    const [getSpaceName8, setGetSpaceName8] = useAtom(spaceName8);
    const [getSpaceName9, setGetSpaceName9] = useAtom(spaceName9);
    const [getSpaceName10, setGetSpaceName10] = useAtom(spaceName10);
    const [getSpaceName11, setGetSpaceName11] = useAtom(spaceName11);
    const [getSpaceName12, setGetSpaceName12] = useAtom(spaceName12);
    const [getSpaceName13, setGetSpaceName13] = useAtom(spaceName13);
    const [getSpaceName14, setGetSpaceName14] = useAtom(spaceName14);
    const [getSpaceName15, setGetSpaceName15] = useAtom(spaceName15);
    const [getSpaceName16, setGetSpaceName16] = useAtom(spaceName16);
    const [getSpaceName17, setGetSpaceName17] = useAtom(spaceName17);
    const [getSpaceName18, setGetSpaceName18] = useAtom(spaceName18);
    const [getSpaceName19, setGetSpaceName19] = useAtom(spaceName19);
    const [getSpaceName20, setGetSpaceName20] = useAtom(spaceName20);
    // TODO:

    const [modelToShow, setModelToShow] = useState(1);
    const [floorIdNow, setFloorIdNow] = useAtom(floorStaticId);

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
                if (modelToShow >= 2) {
                    setSpaceListAPI(res.data.data);
                    setReloadSpace('false');
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
            <EditSpace currentFloorId={currentFloorId} show={modalSpaceShow} onHide={() => setModalSpaceShow(false)} />
            <EditSpace
                show={modalSpaceShow2}
                currentFloorId={currentFloorId2}
                onHide={() => setModalSpaceShow2(false)}
            />
            <EditSpace
                show={modalSpaceShow3}
                currentFloorId={currentFloorId3}
                onHide={() => setModalSpaceShow3(false)}
            />
            <EditSpace
                show={modalSpaceShow4}
                currentFloorId={currentFloorId4}
                onHide={() => setModalSpaceShow4(false)}
            />
            <EditSpace
                show={modalSpaceShow5}
                currentFloorId={currentFloorId5}
                onHide={() => setModalSpaceShow5(false)}
            />
            <EditSpace
                show={modalSpaceShow6}
                currentFloorId={currentFloorId6}
                onHide={() => setModalSpaceShow6(false)}
            />
            <EditSpace
                show={modalSpaceShow7}
                currentFloorId={currentFloorId7}
                onHide={() => setModalSpaceShow7(false)}
            />
            <EditSpace
                show={modalSpaceShow8}
                currentFloorId={currentFloorId8}
                onHide={() => setModalSpaceShow8(false)}
            />
            <EditSpace
                show={modalSpaceShow9}
                currentFloorId={currentFloorId9}
                onHide={() => setModalSpaceShow9(false)}
            />
            <EditSpace
                show={modalSpaceShow10}
                currentFloorId={currentFloorId10}
                onHide={() => setModalSpaceShow10(false)}
            />
            <EditSpace
                show={modalSpaceShow11}
                currentFloorId={currentFloorId11}
                onHide={() => setModalSpaceShow11(false)}
            />
            <EditSpace
                show={modalSpaceShow12}
                currentFloorId={currentFloorId12}
                onHide={() => setModalSpaceShow12(false)}
            />
            <EditSpace
                show={modalSpaceShow13}
                currentFloorId={currentFloorId13}
                onHide={() => setModalSpaceShow13(false)}
            />
            <EditSpace
                show={modalSpaceShow14}
                currentFloorId={currentFloorId14}
                onHide={() => setModalSpaceShow14(false)}
            />
            <EditSpace
                show={modalSpaceShow15}
                currentFloorId={currentFloorId15}
                onHide={() => setModalSpaceShow15(false)}
            />
            <EditSpace
                show={modalSpaceShow16}
                currentFloorId={currentFloorId16}
                onHide={() => setModalSpaceShow16(false)}
            />
            <EditSpace
                show={modalSpaceShow17}
                currentFloorId={currentFloorId17}
                onHide={() => setModalSpaceShow17(false)}
            />
            <EditSpace
                show={modalSpaceShow18}
                currentFloorId={currentFloorId18}
                onHide={() => setModalSpaceShow18(false)}
            />

            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Layout</span>
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
                                {floorListAPI?.length === 0 || floor2?.length === 0 ? (
                                    <Skeleton count={10} height={40} width={250} />
                                ) : (
                                    <>
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
                                                    setFloorIdNow(floorName?.floor_id);
                                                    setModelToShow(2);
                                                }}>
                                                <span> {floorName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type}
                                                </span>
                                            </div>
                                        ))}
                                    </>
                                )}
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
                                <div className="container-conte nt-group">
                                    {spaceListAPI?.length === 0 ? (
                                        <Skeleton count={10} height={40} width={250} />
                                    ) : (
                                        <>
                                            {spaceListAPI
                                                ?.filter((item) => item?.parent_space === null)
                                                ?.map((spaceName, i) => (
                                                    <div
                                                        className="container-single-content"
                                                        style={{ cursor: 'pointer' }}
                                                        onClick={() => {
                                                            setGetSpaceName2(spaceName?.name);
                                                            setCurrentFloorId2(spaceName?._id);
                                                            setModelToShow(3);
                                                        }}>
                                                        <span> {spaceName?.name}</span>
                                                        <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                            {spaceName?.type_name?.[0]}
                                                        </span>
                                                    </div>
                                                ))}
                                        </>
                                    )}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId2)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setCurrentFloorId3(spaceName?._id);
                                                    setGetSpaceName3(spaceName?.name);
                                                    setModelToShow(4);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                                        setModalSpaceShow3(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId3)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName4(spaceName?.name);
                                                    setCurrentFloorId4(spaceName?._id);
                                                    setModelToShow(5);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                                        setModalSpaceShow4(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId4)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName5(spaceName?.name);
                                                    setCurrentFloorId5(spaceName?._id);
                                                    setModelToShow(6);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                                        setModalSpaceShow5(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId5)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName6(spaceName?.name);
                                                    setCurrentFloorId6(spaceName?._id);
                                                    setModelToShow(7);

                                                    localStorage.setItem('parent_space', currentFloorId6);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                                        setModalSpaceShow6(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId6)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName7(spaceName?.name);
                                                    setCurrentFloorId7(spaceName?._id);
                                                    setModelToShow(8);

                                                    localStorage.setItem('parent_space', currentFloorId7);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                                        setModalSpaceShow7(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId7)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName8(spaceName?.name);
                                                    setCurrentFloorId8(spaceName?._id);
                                                    setModelToShow(9);

                                                    localStorage.setItem('parent_space', currentFloorId8);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId8)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName9(spaceName?.name);
                                                    setCurrentFloorId9(spaceName?._id);
                                                    setModelToShow(10);
                                                    localStorage.setItem('parent_space', currentFloorId9);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId9)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName10(spaceName?.name);
                                                    setCurrentFloorId10(spaceName?._id);
                                                    setModelToShow(11);
                                                    localStorage.setItem('parent_space', currentFloorId10);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId10)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName11(spaceName?.name);
                                                    setCurrentFloorId10(spaceName?._id);
                                                    setModelToShow(12);
                                                    localStorage.setItem('parent_space', currentFloorId11);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId11)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName12(spaceName?.name);
                                                    setCurrentFloorId11(spaceName?._id);
                                                    setModelToShow(13);
                                                    localStorage.setItem('parent_space', currentFloorId12);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId12)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName13(spaceName?.name);
                                                    setCurrentFloorId12(spaceName?._id);
                                                    setModelToShow(14);
                                                    localStorage.setItem('parent_space', currentFloorId13);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId13)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName14(spaceName?.name);
                                                    setCurrentFloorId13(spaceName?._id);
                                                    setModelToShow(15);
                                                    localStorage.setItem('parent_space', currentFloorId14);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId14)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName15(spaceName?.name);
                                                    setCurrentFloorId14(spaceName?._id);
                                                    setModelToShow(16);
                                                    localStorage.setItem('parent_space', currentFloorId15);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId15)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName16(spaceName?.name);
                                                    setCurrentFloorId15(spaceName?._id);
                                                    setModelToShow(17);
                                                    localStorage.setItem('parent_space', currentFloorId16);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId16)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName16(spaceName?.name);
                                                    setCurrentFloorId16(spaceName?._id);
                                                    setModelToShow(18);
                                                    localStorage.setItem('parent_space', currentFloorId17);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId17)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName18(spaceName?.name);
                                                    setCurrentFloorId17(spaceName?._id);
                                                    setModelToShow(19);
                                                    localStorage.setItem('parent_space', currentFloorId18);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId18)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName19(spaceName?.name);
                                                    setCurrentFloorId18(spaceName?._id);
                                                    setModelToShow(20);
                                                    localStorage.setItem('parent_space', currentFloorId19);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
                                    {spaceListAPI
                                        ?.filter((item) => item?.parent_space === currentFloorId19)
                                        .map((spaceName, i) => (
                                            <div
                                                className="container-single-content "
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setGetSpaceName20(spaceName?.name);
                                                    setCurrentFloorId19(spaceName?._id);
                                                    setModelToShow(21);
                                                    localStorage.setItem('parent_space', currentFloorId20);
                                                }}>
                                                <span> {spaceName?.name}</span>
                                                <span class="badge badge-light mr-4 font-weight-bold float-right ">
                                                    {spaceName?.type_name?.[0]}
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
