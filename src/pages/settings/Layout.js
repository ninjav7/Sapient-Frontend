import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    CardHeader,
    Form,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownItem,
    DropdownToggle,
    Input,
    Label,
} from 'reactstrap';
import { useAtom } from 'jotai';
import './style.css';
import axios from 'axios';
import { BaseUrl, getFloors, getLayouts } from '../../services/Network';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Button } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import { Cookies } from 'react-cookie';
import EditFloorModal from '../../components/Layouts/EditFloorModal';
import { areaList, floorList, iterationNumber, spacesList } from '../../store/globalState';
import EditSpace from '../../components/Layouts/EditSpace';
import EditArea from '../../components/Layouts/EditArea';
import InfiniteLayout from '../../components/Layouts/InfiniteLayout';

const Layout = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    console.log('userdata', userdata);

    // const store = useSelector((state) => state.counterState);
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [floorClicked, setFloorClicked] = useState('');
    const [spaceClicked, setSpaceClicked] = useState('');
    const [areaClicked, setAreaClicked] = useState('');
    const [clickedToOpen, setClickedToOpen] = useState(1);
    const [modalShow, setModalShow] = useState(false);
    const [modalShowSpace, setModalShowSpace] = useState(false);
    const [modalShowArea, setModalShowArea] = useState(false);

    const [floorName] = useAtom(floorList);
    const [space] = useAtom(spacesList);
    const [area] = useAtom(areaList);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            // 'user-auth': '628f3144b712934f578be895',
            Authorization: `Bearer ${userdata.token}`,
        };
        const params = `?building_id=${bldgId}`;
        axios.get(`${BaseUrl}${getFloors}${params}`, { headers }).then((res) => {
            console.log(res.data);
            // setfloorsData(res.data);
            // let data = {};
            // if (bldgId) {
            //     console.log(data);
            // }
        });
    }, [bldgId]);

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

    return (
        <React.Fragment>
            <EditFloorModal show={modalShow} onHide={() => setModalShow(false)} />
            <EditSpace floorIndex={floorClicked} show={modalShowSpace} onHide={() => setModalShowSpace(false)} />
            <EditArea spaceIndex={spaceClicked} show={modalShowArea} onHide={() => setModalShowArea(false)} />
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
                                {floorName.map((floorName, i) => (
                                    <div
                                        className="container-single-content mr-4"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => {
                                            setFloorClicked(i);
                                            setClickedToOpen(2);
                                        }}>
                                        <span> {floorName}</span>
                                        <span class="badge badge-light font-weight-bold float-right mr-4">
                                            {/* {floor.tag[0]} */}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Open on floor name onClick */}
                        {clickedToOpen >= 2 && (
                            <div className="header">
                                <div className="container-heading">
                                    <span>{floorName[floorClicked]}</span>
                                    <i className="uil uil-pen ml-2"></i>
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
                                                        setModalShowSpace(true);
                                                    }}>
                                                    Add Space
                                                </DropdownItem>
                                                <DropdownItem>Add HVAC Zone</DropdownItem>
                                                <DropdownItem>Add Lightning Zone</DropdownItem>
                                                <DropdownItem>Add Panel</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {space
                                        ?.filter((items) => items?.floorIndex === floorClicked)
                                        .map((item, i) => (
                                            <div
                                                className="container-single-content mr-4"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setSpaceClicked(i);
                                                    setClickedToOpen(3);
                                                }}>
                                                <span>{item.spaceName}</span>
                                                <span class="badge badge-light font-weight-bold float-right mr-4">
                                                    {item?.typeName}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Open on space name onClick */}
                        {clickedToOpen >= 3 && (
                            <div className="header">
                                <div className="container-heading">
                                    <span>{space[spaceClicked]?.spaceName}</span>
                                    <i className="uil uil-pen ml-2"></i>
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
                                                        setModalShowArea(true);
                                                    }}>
                                                    Add Room
                                                </DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledDropdown>
                                    </div>
                                </div>
                                <div className="container-content-group">
                                    {area
                                        ?.filter((item) => item?.spaceIndex === spaceClicked)
                                        ?.map((record, i) => (
                                            <div
                                                className="container-single-content mr-4"
                                                style={{ cursor: 'pointer' }}
                                                onClick={() => {
                                                    setAreaClicked(i);
                                                    setClickedToOpen(4);
                                                }}>
                                                <span>{record.areaName}</span>
                                                <span class="badge badge-light font-weight-bold float-right mr-4">
                                                    {record?.typeName}
                                                </span>
                                            </div>
                                        ))}
                                </div>
                            </div>
                        )}

                        {/* Open an area name onClick */}
                        {/* <InfiniteLayout /> */}
                        {/* {clickedToOpen >= 4 &&
                            Array(iterations)
                                .fill(0)
                                .map((_, i) => {
                                    return <InfiniteLayout iterationValue={i} />;
                                })} */}
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Layout;
