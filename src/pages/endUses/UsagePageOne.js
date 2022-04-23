import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import Header from '../../components/Header';
import DonutChart from '../charts/DonutChart';
import StackedBarChart from '../charts/StackedBarChart';
import EnergyUsageCard from './UsageCard';
import './style.css';

const UsagePageOne = ({ title = 'HVAC' }) => {
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

    const [donutChartOpts, setDonutChartOpts] = useState({
        chart: {
            type: 'donut',
        },
        labels: ['HVAC', 'Lightning', 'Plug', 'Process'],
        colors: ['#3094B9', '#2C4A5E', '#66D6BC', '#3B8554'],
        series: [12553, 11553, 6503, 2333],
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                expandOnClick: false,
                offsetX: 0,
                offsetY: 0,
                customScale: 1,
                dataLabels: {
                    offset: 0,
                    minAngleToShowLabel: 10,
                },
                donut: {
                    size: '80%',
                    background: 'grey',
                    labels: {
                        show: true,
                        name: {
                            show: false,
                            // fontSize: '22px',
                            // fontFamily: 'Helvetica, Arial, sans-serif',
                            // fontWeight: 600,
                            // color: '#373d3f',
                            // offsetY: -10,
                            // formatter: function (val) {
                            //     return val;
                            // },
                        },
                        value: {
                            show: true,
                            fontSize: '20px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 400,
                            color: 'red',
                            // offsetY: 16,
                            formatter: function (val) {
                                return `${val} kWh`;
                            },
                        },
                        total: {
                            show: true,
                            showAlways: false,
                            label: 'Total',
                            // color: '#373d3f',
                            fontSize: '22px',
                            fontWeight: 600,
                            // formatter: function (w) {
                            //     return w.globals.seriesTotals.reduce((a, b) => {
                            //         return a + b;
                            //     }, 0);
                            // },
                            formatter: function (w) {
                                let sum = w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b;
                                }, 0);
                                return `${sum} kWh`;
                            },
                        },
                    },
                },
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300,
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            theme: 'dark',
            x: { show: false },
        },
        legend: {
            show: false,
        },
        stroke: {
            width: 0,
        },

        itemMargin: {
            horizontal: 10,
        },
        dataLabels: {
            enabled: false,
        },
    });

    const [donutChartData, setDonutChartData] = useState([12553, 11553, 6503, 2333]);

    return (
        <React.Fragment>
            <Header title={title} />

            <Row>
                <div className="endUses-button-container mt-2" style={{ marginLeft: '29px' }}>
                    <div className="card usage-card-box-style enduses-button-style">
                        <div className="card-body">
                            <p className="subtitle-style" style={{ margin: '2px' }}>
                                Total Consumption
                            </p>
                            <p className="card-text usage-card-content-style">
                                {usage.totalConsumption} <span className="card-unit-style">&nbsp;kWh</span>
                            </p>
                            <button className="button-danger text-danger btn-font-style" style={{ width: 'auto' }}>
                                <i className="uil uil-arrow-growth">
                                    <strong>{usage.val1.value} %</strong>
                                </i>
                            </button>
                            &nbsp;&nbsp;
                            <span className="light-content-style">since last period</span>
                            <br />
                            <button
                                className="button-danger text-danger btn-font-style"
                                style={{ width: 'auto', marginTop: '3px' }}>
                                <i className="uil uil-arrow-growth">
                                    <strong>{usage.val2.value} %</strong>
                                </i>
                            </button>
                            &nbsp;&nbsp;
                            <span className="light-content-style">from same period last year</span>
                        </div>
                    </div>

                    <div className="card usage-card-box-style enduses-button-style">
                        <div className="card-body">
                            <p className="subtitle-style" style={{ margin: '2px' }}>
                                After-Hours Consumption
                            </p>
                            <p className="card-text usage-card-content-style">
                                {usage.afterHourConsumption} <span className="card-unit-style">&nbsp;kWh</span>
                            </p>
                            <button className="button-danger text-danger btn-font-style" style={{ width: 'auto' }}>
                                <i className="uil uil-arrow-growth">
                                    <strong>{usage.val3.value} %</strong>
                                </i>
                            </button>
                            &nbsp;&nbsp;
                            <span className="light-content-style">since last period</span>
                            <br />
                            <button
                                className="button-danger text-danger btn-font-style"
                                style={{ width: 'auto', marginTop: '3px' }}>
                                <i className="uil uil-arrow-growth">
                                    <strong>{usage.val4.value} %</strong>
                                </i>
                            </button>
                            &nbsp;&nbsp;
                            <span className="light-content-style">from same period last year</span>
                        </div>
                    </div>
                </div>
            </Row>

            <Row>
                <Col xl={8} className="mt-5 ml-3">
                    <h6 className="card-title custom-title">HVAC Usage vs. OA Temperature</h6>
                    <h6 className="custom-subtitle-style">Energy Usage By Hour Trend</h6>
                    <div style={{ width: '700px' }}>
                        {/* Buttons */}

                        <div className="card-group button-style mt-2" style={{ display: 'inline-block' }}>
                            <div className="card usage-card-box-style button-style">
                                <div className="card-body">
                                    <div>
                                        <p className="dot" style={{ backgroundColor: '#3094B9' }}>
                                            <span className="card-title card-title-style">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;AHUs
                                            </span>
                                        </p>
                                    </div>
                                    <p className="card-text card-content-style">
                                        {(3356).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        <span className="card-unit-style">&nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;</span>
                                    </p>
                                </div>
                            </div>
                            <div className="card usage-card-box-style button-style">
                                <div className="card-body">
                                    <div>
                                        <p className="dot" style={{ backgroundColor: '#2C4A5E' }}>
                                            <span className="card-title card-title-style">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chillers
                                            </span>
                                        </p>
                                    </div>
                                    <p className="card-text card-content-style">
                                        {(2353).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        <span className="card-unit-style">&nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;</span>
                                    </p>
                                </div>
                            </div>
                            <div className="card usage-card-box-style button-style">
                                <div className="card-body">
                                    <div>
                                        <p className="dot" style={{ backgroundColor: '#66D6BC' }}>
                                            <span className="card-title card-title-style">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CRACs
                                            </span>
                                        </p>
                                    </div>
                                    <p className="card-text card-content-style">
                                        {(1365).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        <span className="card-unit-style">&nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;</span>
                                    </p>
                                </div>
                            </div>
                            <div className="card usage-card-box-style button-style">
                                <div className="card-body">
                                    <div>
                                        <p className="dot" style={{ backgroundColor: '#3B8554' }}>
                                            <span className="card-title card-title-style">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other
                                            </span>
                                        </p>
                                    </div>
                                    <p className="card-text card-content-style">
                                        {(1332).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        <span className="card-unit-style">&nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;</span>
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* QA Temp Icon  */}

                        <div style={{ display: 'inline-block', float: 'right' }} className="mt-4 mr-2">
                            <p className="dot" style={{ backgroundColor: '#DF3C9E' }}>
                                <span className="card-title card-title-style" style={{ width: '100px' }}>
                                    &nbsp;&nbsp;&nbsp;OA Temp
                                </span>
                            </p>
                        </div>
                    </div>
                    <StackedBarChart options={barChartOptions} series={barChartData} height={440} />
                </Col>
                <Col xl={3} className="mt-5 ml-3">
                    <h6 className="custom-title">Consumption by System</h6>
                    <h6 className="custom-subtitle-style">Energy Totals</h6>

                    <div className="card-body">
                        <div>
                            <DonutChart options={donutChartOpts} series={donutChartData} height={200} />
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <div className="card-body mt-5 ml-2">
                    <h6 className="custom-title" style={{ display: 'inline-block' }}>
                        Top Systems by Usage
                    </h6>
                    <h6 className="custom-subtitle-style">Click explore to see more energy usage details.</h6>

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
