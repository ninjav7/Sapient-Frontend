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
} from 'reactstrap';
import { Filter } from 'react-feather';
import './style.css';
// import { useSelector } from 'react-redux';
import axios from 'axios';
import { BaseUrl, getLayouts } from '../../services/Network';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';

const Layout = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    // const store = useSelector((state) => state.counterState);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [floorsData, setfloorsData] = useState([]);
    const [indexSpace1, setIndexSpace1] = useState([]);
    const [indexSpace1Name, setIndexSpace1Name] = useState('');
    const [indexSpace2, setIndexSpace2] = useState([]);
    const [indexSpace2Name, setIndexSpace2Name] = useState('');
    const [indexSpace3, setIndexSpace3] = useState([]);
    const [indexSpace3Name, setIndexSpace3Name] = useState('');
    const floors = [
        {
            number: 1,
            label: 'Floor',
        },
        {
            number: 2,
            label: 'Floor',
        },
        {
            number: 3,
            label: 'Floor',
        },
        {
            number: 4,
            label: 'Floor',
        },
    ];

    const floor1 = [
        {
            area: 'Main Area',
            label: 'Room',
        },
        {
            area: 'Front Office',
            label: 'Room',
        },
        {
            area: 'Main Conference Room',
            label: 'Room',
        },
        {
            area: 'Conference Room 2',
            label: 'Area',
        },
        {
            area: 'Primary HVAC Zone',
            label: 'HVAC',
        },
        {
            area: 'Lighting Zone 1',
            label: 'Lighting',
        },
        {
            area: 'Lighting Zone 2',
            label: 'Lighting',
        },
    ];

    const mainArea = [
        {
            name: '1WE  (Mech. Room)',
            label: 'Room',
        },
        {
            name: '123',
            label: 'Room',
        },
        {
            name: '124',
            label: 'Room',
        },
        {
            name: '125',
            label: 'Room',
        },
        {
            name: '126',
            label: 'Room',
        },
        {
            name: '127',
            label: 'Room',
        },
        {
            name: '128',
            label: 'Room',
        },
        {
            name: '129',
            label: 'Room',
        },
        {
            name: '130',
            label: 'Room',
        },
        {
            name: '131',
            label: 'Room',
        },
        {
            name: '132',
            label: 'Room',
        },
        {
            name: '133',
            label: 'Room',
        },
        {
            name: '134',
            label: 'Room',
        },
        {
            name: '135',
            label: 'Room',
        },
    ];
    const relatedSpaceHandler = (i, item) => {
        console.log(i);

        setIndexSpace1(floorsData[i]['related_spaces']);
        setIndexSpace1Name(item.floor_name);
        console.log(floorsData[i]['related_spaces']);
    };
    const relatedSpaceHandler2 = (i, item) => {
        const relatedSpaceArray = indexSpace1[i];
        if (indexSpace1[i]['related_space']) {
            setIndexSpace2(relatedSpaceArray['related_space']);
            setIndexSpace2Name(item.name);
        }
    };
    const relatedSpaceHandler3 = (i, item) => {
        console.log('indexSpace3', indexSpace3);
        console.log('index', i);
        const relatedSpaceArray = indexSpace2[i];
        console.log(relatedSpaceArray);
        if (indexSpace2[i]['related_space']) {
            setIndexSpace3(relatedSpaceArray['related_space']);
            setIndexSpace3Name(item.name);
            console.log(indexSpace2[i]['related_space']);
        }
    };
    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            // 'user-auth': '628f3144b712934f578be895',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.get(`${BaseUrl}${getLayouts}/${bldgId}`, { headers }).then((res) => {
            console.log(res.data);
            setfloorsData(res.data);
            let data = {};
            if (bldgId) {
                console.log(data);
            }
        });
    }, [bldgId]);

    useEffect(() => {
        setIndexSpace2([]);
        setIndexSpace3([]);
        setIndexSpace2Name('');
        setIndexSpace3Name('');
    }, [indexSpace1]);

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
                                            <DropdownItem>Add Floor</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>
                            <div className="container-content-group">
                                {floorsData.map((floor, i) => (
                                    <div
                                        className="container-single-content mr-4"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => relatedSpaceHandler(i, floor)}>
                                        <span> {floor.floor_name}</span>
                                        <span class="badge badge-light font-weight-bold float-right mr-4">
                                            {/* {floor.tag[0]} */}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="header">
                            <div className="container-heading">
                                <span>{indexSpace1Name}</span>
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
                                            <DropdownItem>Add Space</DropdownItem>
                                            <DropdownItem>Add HVAC Zone</DropdownItem>
                                            <DropdownItem>Add Lightning Zone</DropdownItem>
                                            <DropdownItem>Add Panel</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>
                            <div className="container-content-group">
                                {indexSpace1.map((floor, i) => (
                                    <div
                                        className="container-single-content mr-4"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => relatedSpaceHandler2(i, floor)}>
                                        <span>{floor.name}</span>
                                        <span class="badge badge-light font-weight-bold float-right mr-4">
                                            {floor.tag[0]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="header">
                            <div className="container-heading">
                                <span>{indexSpace2Name}</span>
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
                                            <DropdownItem>Add Room</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledDropdown>
                                </div>
                            </div>
                            <div className="container-content-group">
                                {indexSpace2.map((record, i) => (
                                    <div
                                        className="container-single-content mr-4"
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => relatedSpaceHandler3(i, record)}>
                                        <span>{record.name}</span>
                                        <span class="badge badge-light font-weight-bold float-right mr-4">
                                            {record.tag[0]}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="header">
                            <div className="container-heading">
                                <span>{indexSpace3Name}</span>
                                <i className="uil uil-pen ml-2"></i>
                                <div className="mr-2" style={{ marginLeft: 'auto' }}>
                                    <i className="uil uil-plus mr-2"></i>
                                </div>
                            </div>
                            <div className="container-content-group">
                                {indexSpace3.map((record) => (
                                    <div className="container-single-content mr-4">
                                        <span>{record.name || ''}</span>
                                        <span class="badge badge-light font-weight-bold float-right mr-4">
                                            {record.tag[0] || ''}
                                        </span>
                                    </div>
                                ))}
                                <span className="text-center m-2">No area in this room</span>
                                <span className="text-left text-uppercase m-2 equip-head-style">
                                    Equipment in this space
                                </span>
                                <div className="m-2">
                                    <span style={{ fontWeight: 600 }} className="mt-3">
                                        4 items
                                    </span>
                                    <button type="button" class="btn btn-light btn-sm float-right font-weight-bold">
                                        Views
                                    </button>
                                </div>

                                {/* <div className="container-single-content">No areas in this room</div>
                                <div className="container-single-content">Equipment in this space</div>
                                <div className="container-single-content">4 items</div> */}
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Layout;
