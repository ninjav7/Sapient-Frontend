import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import PageTitle from '../../components/PageTitle';
import DonutChart from './PortfolioDonutChart';
import LineChart from './PortfolioLineChart';
import './style.css';

const PortfolioOverview = () => {
    return (
        <>
            <Row className="page-title">
                <Col>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Charts', path: '/charts' },
                            { label: 'Energy', path: '/building', active: true },
                        ]}
                        title={'Portfolio Overview'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <div className="card-group">
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5
                                    className="card-title card-title-style"
                                    style={{ fontSize: '14px', fontWeight: 'initial' }}>
                                    Total Consumption
                                </h5>
                                <p
                                    className="card-text card-content-style"
                                    style={{ fontSize: '16px', fontWeight: 'bolder' }}>
                                    25441 <span className="card-unit-style">&nbsp;&nbsp;kWh</span>
                                </p>
                            </div>
                        </div>
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5 className="card-title" style={{ fontSize: '14px', fontWeight: 'initial' }}>
                                    Portfolio Rank
                                </h5>
                                <p className="card-text" style={{ fontSize: '16px', fontWeight: 'bolder' }}>
                                    1 of 40
                                </p>
                            </div>
                        </div>
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5 className="card-title" style={{ fontSize: '14px', fontWeight: 'initial' }}>
                                    Energy Density
                                </h5>
                                <p className="card-text" style={{ fontSize: '16px', fontWeight: 'bolder' }}>
                                    1.3 kWh/sq.ft.
                                </p>
                            </div>
                        </div>
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5 className="card-title" style={{ fontSize: '14px' }}>
                                    12 Mo. Electric EUI
                                </h5>
                                <p className="card-text" style={{ fontSize: '16px', fontWeight: 'bolder' }}>
                                    67 kBtu/ft/yr
                                </p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={6}>
                    <div className="card-body">
                        <h6 className="card-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                            Energy Density Top Buildings
                        </h6>
                        <h6 className="card-subtitle mb-2 text-muted">Energy Consumption / Sq. Ft. Average</h6>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={6}>
                    <div className="card-body">
                        <h6 className="card-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                            Energy Consumption by End Use
                        </h6>
                        <h6 className="card-subtitle mb-2 text-muted">Energy Totals</h6>
                        <div>
                            <DonutChart />
                        </div>
                    </div>
                </Col>

                <Col xl={6}>
                    <div className="card-body">
                        <h6 className="card-title">Total Energy Consumption</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Totaled by Hour</h6>
                        <LineChart />
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default PortfolioOverview;
