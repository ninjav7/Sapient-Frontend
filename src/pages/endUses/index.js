import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table, Button, CardHeader } from 'reactstrap';
import Header from '../../components/Header';
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
                    <button
                        className="button-danger text-danger font-weight-bold font-size-5"
                        style={{ width: 'auto' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>{usage.val1.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span className="muted">since last period</span>
                    <br />
                    <button
                        className="button-danger text-danger font-weight-bold font-size-5 content-stying"
                        style={{ width: '4vw' }}>
                        <i className="uil uil-arrow-growth">
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
                        <i className="uil uil-arrow-growth">
                            <strong>{usage.val3.value} %</strong>
                        </i>
                    </button>
                    &nbsp;&nbsp;
                    <span>since last period</span>
                    <br />
                    <button
                        className="button-danger text-danger font-weight-bold font-size-5"
                        style={{ width: 'auto' }}>
                        <i className="uil uil-arrow-growth">
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
    const [endUsage, seteEndUsage] = useState([
        {
            title: 'HVAC',
            totalConsumption: '11,441',
            afterHourConsumption: '2,321',
            val1: { value: 61, type: 'up' },
            val2: { value: 6, type: 'down' },
            val3: { value: 31, type: 'normal' },
            val4: { value: 2, type: 'up' },
        },
        {
            title: 'Lighting',
            totalConsumption: '7,247',
            afterHourConsumption: '2,321',
            val1: { value: 32, type: 'increased' },
            val2: { value: 4, type: 'decreased' },
            val3: { value: 41, type: 'decreased' },
            val4: { value: 12, type: 'increased' },
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

    return (
        <React.Fragment>
            <Header title="End Uses" />
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
                                <div className="usage-card">
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
