import React from 'react';
import { Row, Col, Card, CardBody, CardHeader, Form } from 'reactstrap';
import { ChevronDown } from 'react-feather';
import './style.css';

const Layout = () => {
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
                    {/* <Card className="custom-card card-alignment">
                        <CardHeader>
                            <div className="layout-grid-style-1">
                                <div>Building Root</div>
                                <div>Floor 1</div>
                                <div>Main Area</div>
                                <div>123</div>
                            </div>
                        </CardHeader>
                        <CardBody>
                            <div className="layout-grid-style-2">
                                <div>Floor 1</div>
                                <div>Floor 2</div>
                                <div>Floor 3</div>
                                <div>Floor 4</div>
                            </div>
                        </CardBody>
                        <CardBody>
                            <div className="layout-grid-style-2">
                                <div>Floor 1</div>
                                <div>Floor 2</div>
                                <div>Floor 3</div>
                                <div>Floor 4</div>
                            </div>
                        </CardBody>
                    </Card> */}

                    <div className="layout-container mt-4">
                        <div className="container-column">
                            <div className="container-heading">Building Root</div>
                            <div className="container-content-group">
                                <div className="container-single-content">Floor 1</div>
                                <div className="container-single-content">Floor 2</div>
                                <div className="container-single-content">Floor 3</div>
                                <div className="container-single-content">Floor 4</div>
                            </div>
                        </div>
                        <div className="header">
                            <div className="container-heading">Floor 1</div>
                            <div className="container-content-group">
                                <div className="container-single-content">Map Area</div>
                                <div className="container-single-content">Main Conference Room</div>
                                <div className="container-single-content">Conference Room 2</div>
                                <div className="container-single-content">Lighting/HVAC Zones</div>
                                <div className="container-single-content">Primary HVAC Zone</div>
                                <div className="container-single-content">Lighting Zone 1</div>
                                <div className="container-single-content">Lighting Zone 2</div>
                            </div>
                        </div>
                        <div className="header">
                            <div className="container-heading">Main Area</div>
                            <div className="container-content-group">
                                <div className="container-single-content">1WE (Mech. Room)</div>
                                <div className="container-single-content">123</div>
                                <div className="container-single-content">124</div>
                                <div className="container-single-content">125</div>
                                <div className="container-single-content">126</div>
                                <div className="container-single-content">127</div>
                                <div className="container-single-content">128</div>
                                <div className="container-single-content">129</div>
                                <div className="container-single-content">130</div>
                                <div className="container-single-content">131</div>
                                <div className="container-single-content">132</div>
                                <div className="container-single-content">133</div>
                                <div className="container-single-content">134</div>
                                <div className="container-single-content">135</div>
                            </div>
                        </div>
                        <div className="header">
                            <div className="container-heading">123</div>
                            <div className="container-content-group">
                                <div className="container-single-content">No areas in this room</div>
                                <div className="container-single-content">Equipment in this space</div>
                                <div className="container-single-content">4 items</div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Layout;
