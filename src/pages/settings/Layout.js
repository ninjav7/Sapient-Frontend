import React from 'react';
import { Row, Col, Card, CardBody, CardHeader, Form } from 'reactstrap';
import { Filter } from 'react-feather';
import './style.css';

const Layout = () => {
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

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Layout
                    </span>

                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div className="float-right ml-2 mt-2 mr-1">
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
                                    <i className="uil uil-plus mr-2"></i>
                                </div>
                            </div>
                            <div className="container-content-group">
                                {floors.map((floor) => (
                                    <div className="container-single-content mr-4">
                                        <span>Floor {floor.number}</span>
                                        <span class="badge badge-light font-weight-bold float-right mr-4">
                                            {floor.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="header">
                            <div className="container-heading">
                                <span>Floor 1</span>
                                <i className="uil uil-pen ml-2"></i>
                                <div className="mr-2" style={{ marginLeft: 'auto' }}>
                                    <i className="uil uil-filter mr-3"></i>
                                    <i className="uil uil-plus mr-2"></i>
                                </div>
                            </div>
                            <div className="container-content-group">
                                {floor1.map((floor) => (
                                    <div className="container-single-content mr-4">
                                        <span>{floor.area}</span>
                                        <span class="badge badge-light font-weight-bold float-right mr-4">
                                            {floor.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="header">
                            <div className="container-heading">
                                <span>Main Area</span>
                                <i className="uil uil-pen ml-2"></i>
                                <div className="mr-2" style={{ marginLeft: 'auto' }}>
                                    <i className="uil uil-filter mr-3"></i>
                                    <i className="uil uil-plus mr-2"></i>
                                </div>
                            </div>
                            <div className="container-content-group">
                                {mainArea.map((record) => (
                                    <div className="container-single-content mr-4">
                                        <span>{record.name}</span>
                                        <span class="badge badge-light font-weight-bold float-right mr-4">
                                            {record.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="header">
                            <div className="container-heading">
                                <span>123</span>
                                <i className="uil uil-pen ml-2"></i>
                                <div className="mr-2" style={{ marginLeft: 'auto' }}>
                                    <i className="uil uil-plus mr-2"></i>
                                </div>
                            </div>
                            <div className="container-content-group">
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
