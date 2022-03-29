import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table, Button, CardHeader } from 'reactstrap';
import StackedBarChart from '../charts/StackedBarChart';
import './style.css';

const EnergyUsageCard = ({ usage }) => {
    return (
        <Card>
            <CardBody className="pb-0 pt-2 mt-2" style={{ backgroundColor: '#f9fafb' }}>
                <h6 className="card-title title-style" style={{ display: 'inline-block', fontWeight: 'bolder' }}>
                    {usage.title}
                </h6>
                <div className="float-right ml-2">
                    <Button color="light" className="btn btn-sm btn-outline-dark font-weight-bold button-style">
                        View
                    </Button>
                </div>
                <div className="mt-2">
                    <p className="subtitle-style muted" style={{ margin: '1px', fontWeight: 'bold' }}>
                        Total Consumption
                    </p>
                    <p className="card-text card-content-style">
                        {usage.totalConsumption} <span className="card-unit-style">&nbsp;kWh</span>
                    </p>
                    <button className="button-danger text-danger font-weight-bold font-size-5" style={{ width: '4vw' }}>
                        <i className="uil uil-chart-down">
                            <strong>{usage.val1.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span className="muted">since last period</span>
                    <br />
                    <button
                        className="button-danger text-danger font-weight-bold font-size-5 content-stying"
                        style={{ width: '4vw' }}>
                        <i className="uil uil-chart-down">
                            <strong>{usage.val2.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span className="muted">from same period last year</span>
                </div>
                <div className="mt-4 mb-4">
                    <p className="subtitle-style" style={{ margin: '2px', fontWeight: 'bold' }}>
                        After-Hours Consumption
                    </p>
                    <p className="card-text card-content-style">
                        {usage.afterHourConsumption} <span className="card-unit-style">&nbsp;kWh</span>
                    </p>
                    <button
                        className="button-danger text-danger font-weight-bold font-size-5 content-stying"
                        style={{ width: '4vw' }}>
                        <i className="uil uil-chart-down">
                            <strong>{usage.val3.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span>since last period</span>
                    <br />
                    <button className="button-danger text-danger font-weight-bold font-size-5" style={{ width: '4vw' }}>
                        <i className="uil uil-chart-down">
                            <strong>{usage.val4.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span>from same period last year</span>
                </div>
            </CardBody>
        </Card>
    );
};

const EndUses = () => {
    const TABS = {
        Tab1: '24 Hours',
        Tab2: '7 Days',
        Tab3: '30 Days',
        Tab4: 'Custom',
    };

    const [endUsage, seteEndUsage] = useState([
        {
            title: 'HVAC',
            totalConsumption: '11,441',
            afterHourConsumption: '2,321',
            val1: { value: 6, type: 'decreased' },
            val2: { value: 6, type: 'decreased' },
            val3: { value: 3, type: 'increased' },
            val4: { value: 2, type: 'increased' },
        },
        {
            title: 'Lighting',
            totalConsumption: '7,247',
            afterHourConsumption: '2,321',
            val1: { value: 3, type: 'increased' },
            val2: { value: 4, type: 'decreased' },
            val3: { value: 4, type: 'decreased' },
            val4: { value: 1, type: 'increased' },
        },
        {
            title: 'Plug',
            totalConsumption: '11,441',
            afterHourConsumption: '2,321',
            val1: { value: 6, type: 'increased' },
            val2: { value: 6, type: 'increased' },
            val3: { value: 3, type: 'decreased' },
            val4: { value: 2, type: 'decreased' },
        },
    ]);

    const [activeTab, setActiveTab] = useState(TABS.Tab3);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col>
                    <h4 className="heading-style" style={{ marginLeft: '20px' }}>
                        End Uses
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

            <Row>
                <Col xl={8}>
                    <StackedBarChart />
                </Col>
            </Row>

            <Row style={{ marginLeft: '0.5px' }}>
                <div className="card-body">
                    <h6 className="card-title custom-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                        Top End Uses by Usage
                    </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Click explore to see more energy usage details.</h6>

                    <Row className="mt-4 energy-container">
                        {endUsage.map((usage, index) => {
                            return (
                                <div className="energy-usage">
                                    <EnergyUsageCard usage={usage} />
                                </div>
                            );
                        })}
                        {/* <div className="energy-usage">
                            <EnergyUsageCard energyConsumption={energyConsumption} />
                        </div>
                        <div className="energy-usage">
                            <EnergyUsageCard energyConsumption={energyConsumption} />
                        </div> */}
                    </Row>
                </div>
            </Row>
        </React.Fragment>
    );
};

export default EndUses;
