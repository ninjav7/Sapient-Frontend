import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table, Button, CardHeader } from 'reactstrap';
import EnergyBarChart from '../buildings/EnergyBarChart';
import DonutChart from '../portfolio/PortfolioDonutChart';
import LineChart from '../charts/LineChart';
import './style.css';

const TimeOfDay = () => {
    const TABS = {
        Tab1: '24 Hours',
        Tab2: '7 Days',
        Tab3: '30 Days',
        Tab4: 'Custom',
    };
    const [activeTab, setActiveTab] = useState(TABS.Tab3);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col>
                    <h4 className="heading-style" style={{ marginLeft: '20px' }}>
                        Time of Day
                    </h4>
                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div>
                            {Object.keys(TABS).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={
                                        activeTab === TABS[key]
                                            ? 'btn btn-sm btn-dark font-weight-bold custom-buttons active'
                                            : 'btn btn-sm btn-light font-weight-bold custom-buttons'
                                    }
                                    onClick={() => setActiveTab(TABS[key])}>
                                    {TABS[key]}
                                </button>
                            ))}
                        </div>
                        <div className="float-right ml-2">
                            <button type="button" className="btn btn-sm btn-primary font-weight-bold">
                                <i className="uil uil-pen mr-1"></i>Explore
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={3}>
                    <div className="card-body container-style">
                        <h6 className="card-title custom-title">Off Hours Energy</h6>
                        <h6 className="card-subtitle custom-subtitle">Energy Totals</h6>
                        <div className="mt-2 " >
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
