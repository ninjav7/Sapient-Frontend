import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table, Button, CardHeader } from 'reactstrap';
import Header from '../../components/Header';
import EnergyBarChart from '../buildings/EnergyBarChart';
import DonutChart from '../portfolio/PortfolioDonutChart';
import LineChart from '../charts/LineChart';
import './style.css';

const TimeOfDay = () => {
    return (
        <React.Fragment>
            <Header title="Time of Day" />
            <Row className="mt-2">
                <Col xl={3}>
                    <div className="card-body container-style">
                        <h6 className="card-title custom-title">Off Hours Energy</h6>
                        <h6 className="card-subtitle custom-subtitle">Energy Totals</h6>
                        <div className="mt-2 ">
                            <DonutChart />
                        </div>
                    </div>
                </Col>
                <Col xl={9}>
                    <div className="card-body">
                        <h6 className="card-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                            Average Daily Usage by Hour
                        </h6>
                        <h6 className="card-subtitle mb-2 text-muted">Energy Usage By Hour</h6>
                        <EnergyBarChart />
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={11}>
                    <div className="card-body ">
                        <h6 className="card-title custom-title">Average Daily Usage by Hour</h6>
                        <h6 className="card-subtitle custom-subtitle">Energy Usage By Hour Trend</h6>
                        <div className="mt-2">
                            <LineChart title="" />
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default TimeOfDay;
