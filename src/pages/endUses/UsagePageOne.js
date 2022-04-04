import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import Header from '../../components/Header';
import DonutChart from '../portfolio/PortfolioDonutChart';
import StackedBarChart from '../charts/StackedBarChart';
import EnergyUsageCard from './UsageCard';
import './style.css';

const UsagePageOne = (props) => {
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
        totalConsumption: '11,441',
        afterHourConsumption: '2,321',
        val1: { value: 61, type: 'up' },
        val2: { value: 6, type: 'down' },
        val3: { value: 31, type: 'normal' },
        val4: { value: 2, type: 'up' },
    });

    const [barChartOptions, setBarChartOptions] = useState({
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '40%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: false,
        },
        xaxis: {
            categories: [
                'Week 1',
                'Week 2',
                'Week 3',
                'Week 4',
                'Week 5',
                'Week 6',
                'Week 7',
                'Week 8',
                'Week 9',
                'Week 10',
            ],
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    var val = Math.abs(value);
                    if (val >= 1000) {
                        val = (val / 1000).toFixed(0) + ' K';
                    }
                    return val;
                },
            },
        },
        colors: ['#3094B9', '#66D6BC', '#2C4A5E', '#847CB5'],
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + 'K';
                },
            },
            theme: 'dark',
            x: { show: false },
        },
        fill: {
            opacity: 1,
        },
        states: {
            hover: {
                filter: 'none',
            },
        },
        legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'center',
        },

        grid: {
            borderColor: '#f1f3fa',
        },
    });

    const [barChartData, setBarChartData] = useState([
        {
            name: 'HVAC',
            data: [15000, 14000, 12000, 11000, 12000, 14000, 12000, 11000, 12000, 10000],
        },
        {
            name: 'Lighting',
            data: [8000, 7000, 8000, 4000, 5000, 6000, 5000, 7000, 9000, 6000],
        },
        {
            name: 'Plug',
            data: [12000, 14000, 16000, 18000, 20000, 16000, 16000, 14000, 12000, 18000],
        },
        {
            name: 'Other',
            data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        },
    ]);

    return (
        <React.Fragment>
            <Header title="HVAC" />

            <Row>
                <div className="card-group button-style mt-2" style={{ marginLeft: '29px' }}>
                    <div className="card usage-card-box-style button-style">
                        <div className="card-body">
                            <p className="subtitle-style muted" style={{ margin: '2px', fontWeight: 'bold' }}>
                                Total Consumption
                            </p>
                            <p className="card-text usage-card-content-style">
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
                                {usage.afterHourConsumption} <span className="card-unit-style">&nbsp;kWh</span>
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
                </div>
            </Row>

            <Row>
                <Col xl={7} className="mt-5 ml-3">
                    <h6 className="card-title" style={{ fontWeight: 'bold' }}>
                        HVAC Usage vs. OA Temperature
                    </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Energy Usage By Hour Trend</h6>
                    <StackedBarChart options={barChartOptions} series={barChartData} height={440} />
                </Col>
                <Col xl={4} className="mt-5 ml-3">
                    <h6 className="card-title" style={{ fontWeight: 'bold' }}>
                        Consumption by System
                    </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Energy Totals</h6>
                    <div className="card-body">
                        <div>
                            <DonutChart />
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <div className="card-body mt-5 ml-2">
                    <h6 className="card-title custom-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                        Top Systems by Usage
                    </h6>
                    <h6 className="card-subtitle mb-2 text-muted">Click explore to see more energy usage details.</h6>

                    <Row className="mt-4 energy-container">
                        {endUsage.map((usage, index) => {
                            return (
                                <div className="usage-card">
                                    <EnergyUsageCard usage={usage} button="Explore" />
                                </div>
                            );
                        })}
                    </Row>
                </div>
            </Row>
        </React.Fragment>
    );
};

export default UsagePageOne;
