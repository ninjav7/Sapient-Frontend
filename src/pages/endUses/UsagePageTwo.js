import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import Header from '../../components/Header';
import UsageBarChart from './UsageBarChart';
import MixedChart from '../charts/MixedChart';
import LineColumnChart from '../charts/LineColumnChart';
import './style.css';

const UsagePageTwo = () => {
    const [endUsage, seteEndUsage] = useState([
        {
            title: 'AHUs',
            totalConsumption: 3365,
            afterHourConsumption: 232,
            val1: { value: 61, type: 'up' },
            val2: { value: 6, type: 'down' },
            val3: { value: 31, type: 'normal' },
            val4: { value: 2, type: 'up' },
        },
        {
            title: 'Chillers',
            totalConsumption: 2353,
            afterHourConsumption: 205,
            val1: { value: 32, type: 'increased' },
            val2: { value: 4, type: 'decreased' },
            val3: { value: 41, type: 'decreased' },
            val4: { value: 12, type: 'increased' },
        },
        {
            title: 'CRACs',
            totalConsumption: 1365,
            afterHourConsumption: 102,
            val1: { value: 6, type: 'increased' },
            val2: { value: 6, type: 'increased' },
            val3: { value: 3, type: 'decreased' },
            val4: { value: 2, type: 'decreased' },
        },
    ]);

    const [usage, seUsage] = useState({
        title: 'HVAC',
        totalConsumption: 7246,
        afterHourConsumption: 4288,
        lightningUtilization: 33,
        lightningDensity: 1.5,
        val1: { value: 61, type: 'up' },
        val2: { value: 6, type: 'down' },
        val3: { value: 31, type: 'normal' },
        val4: { value: 2, type: 'up' },
        val5: { value: 23, type: 'up' },
        val6: { value: 7, type: 'normal' },
    });

    return (
        <React.Fragment>
            <Header title="Lightning" />

            <Row>
                <div className="card-group button-style mt-2" style={{ marginLeft: '29px' }}>
                    <div className="card usage-card-box-style button-style">
                        <div className="card-body">
                            <p className="subtitle-style muted" style={{ margin: '2px', fontWeight: 'bold' }}>
                                Total Consumption
                            </p>
                            <p className="card-text usage-card-content-style">
                                {usage.totalConsumption.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                                <span className="card-unit-style">&nbsp;kWh</span>
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
                                style={{ width: 'auto', marginTop: '3px' }}>
                                <i className="uil uil-arrow-growth">
                                    <strong>{usage.val2.value} %</strong>
                                </i>
                            </button>
                            &nbsp;&nbsp;
                            <span className="muted">from same period last year</span>
                        </div>
                    </div>

                    <div className="card usage-card-box-style button-style">
                        <div className="card-body">
                            <p className="subtitle-style" style={{ margin: '2px', fontWeight: 'bold' }}>
                                After-Hours Consumption
                            </p>
                            <p className="card-text usage-card-content-style">
                                {usage.afterHourConsumption.toLocaleString(undefined, { maximumFractionDigits: 2 })}{' '}
                                <span className="card-unit-style">&nbsp;kWh</span>
                            </p>
                            <button
                                className="button-danger text-danger font-weight-bold font-size-5 content-stying"
                                style={{ width: 'auto' }}>
                                <i className="uil uil-arrow-growth">
                                    <strong>{usage.val3.value} %</strong>
                                </i>
                            </button>
                            &nbsp;&nbsp;
                            <span>since last period</span>
                            <br />
                            <button
                                className="button-danger text-danger font-weight-bold font-size-5"
                                style={{ width: 'auto', marginTop: '3px' }}>
                                <i className="uil uil-arrow-growth">
                                    <strong>{usage.val4.value} %</strong>
                                </i>
                            </button>
                            &nbsp;&nbsp;
                            <span>from same period last year</span>
                        </div>
                    </div>

                    <div className="card usage-card-box-style button-style">
                        <div className="card-body">
                            <p className="subtitle-style" style={{ margin: '2px', fontWeight: 'bold' }}>
                                Lightning Utilization
                            </p>
                            <p className="card-text usage-card-content-style">{usage.lightningUtilization} %</p>
                            <button
                                className="button-danger text-danger font-weight-bold font-size-5 content-stying"
                                style={{ width: 'auto' }}>
                                <i className="uil uil-arrow-growth">
                                    <strong>{usage.val3.value} %</strong>
                                </i>
                            </button>
                            &nbsp;&nbsp;
                            <span>since last period</span>
                            <br />
                            <button
                                className="button-danger text-danger font-weight-bold font-size-5"
                                style={{ width: 'auto', marginTop: '3px' }}>
                                <i className="uil uil-arrow-growth">
                                    <strong>{usage.val4.value} %</strong>
                                </i>
                            </button>
                            &nbsp;&nbsp;
                            <span>from same period last year</span>
                        </div>
                    </div>

                    <div className="card button-style float-right">
                        <div className="card-body">
                            <p className="subtitle-style" style={{ margin: '2px', fontWeight: 'bold' }}>
                                Installed Lighting Density
                            </p>
                            <p className="card-text usage-card-content-style density-content-style">
                                {usage.lightningDensity} <span className="card-unit-style">&nbsp;Watts / Sq. Ft.</span>
                            </p>
                        </div>
                    </div>
                </div>
            </Row>

            <Row>
                <Col xl={6} className="mt-5 ml-3">
                    <h6 className="card-title" style={{ fontWeight: 'bold' }}>
                        Lighting Usage vs. Occupancy
                    </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Energy Usage By Hour Trend</h6>
                    {/* <MixedChart title="" /> */}
                    <LineColumnChart title="" />
                </Col>
                <Col xl={5} className="mt-5 ml-3">
                    <h6 className="card-title" style={{ fontWeight: 'bold' }}>
                        Usage by Floor
                    </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Energy Consumption</h6>
                    <div className="card-body">
                        <div>
                            <UsageBarChart />
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default UsagePageTwo;
