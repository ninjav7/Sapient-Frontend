import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import Header from '../../components/Header';
import { BaseUrl, endUses } from '../../services/Network';
import StackedBarChart from '../charts/StackedBarChart';
import EnergyUsageCard from './UsageCard';
import axios from 'axios';
import './style.css';

const EndUses = () => {
    const [endUsage, seteEndUsage] = useState([
        {
            title: 'HVAC',
            totalConsumption: 11441,
            afterHourConsumption: 2321,
            val1: { value: 61, type: 'up' },
            val2: { value: 6, type: 'down' },
            val3: { value: 31, type: 'normal' },
            val4: { value: 2, type: 'up' },
        },
        {
            title: 'Lighting',
            totalConsumption: 7247,
            afterHourConsumption: 2321,
            val1: { value: 32, type: 'increased' },
            val2: { value: 4, type: 'decreased' },
            val3: { value: 41, type: 'decreased' },
            val4: { value: 12, type: 'increased' },
        },
        {
            title: 'Plug',
            totalConsumption: 11441,
            afterHourConsumption: 2321,
            val1: { value: 6, type: 'increased' },
            val2: { value: 6, type: 'increased' },
            val3: { value: 3, type: 'decreased' },
            val4: { value: 2, type: 'decreased' },
        },
    ]);

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

    const [endUsesData, setEndUsesData] = useState([]);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        const params = `?building_id=${1}`;
        axios
            .post(
                `${BaseUrl}${endUses}${params}`,
                {
                    time_horizon: 0,
                    custom_time_horizon: '2022-04-01&2022-04-05',
                },
                { headers }
            )
            .then((res) => {
                setEndUsesData(res.data);
                console.log(res.data);
            });
    }, []);

    return (
        <React.Fragment>
            <Header title="End Uses" />
            <Row>
                <div className="card-group button-style" style={{ marginLeft: '29px' }}>
                    <div className="card usage-card-box-style button-style">
                        <div className="card-body">
                            <div>
                                <p className="dot" style={{ backgroundColor: '#3094B9' }}>
                                    <span className="card-title card-title-style">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;HVAC
                                    </span>
                                </p>
                            </div>
                            <p className="card-text card-content-style">
                                {(11441).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                <span className="card-unit-style">&nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;</span>
                            </p>
                        </div>
                    </div>
                    <div className="card usage-card-box-style button-style">
                        <div className="card-body">
                            <div>
                                <p className="dot" style={{ backgroundColor: '#66D6BC' }}>
                                    <span className="card-title card-title-style">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Lightning
                                    </span>
                                </p>
                            </div>
                            <p className="card-text card-content-style">
                                {(7246).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                <span className="card-unit-style">&nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;</span>
                            </p>
                        </div>
                    </div>
                    <div className="card usage-card-box-style button-style">
                        <div className="card-body">
                            <div>
                                <p className="dot" style={{ backgroundColor: '#2C4A5E' }}>
                                    <span className="card-title card-title-style">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Plug
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
                                <p className="dot" style={{ backgroundColor: '#847CB5' }}>
                                    <span className="card-title card-title-style">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other
                                    </span>
                                </p>
                            </div>
                            <p className="card-text card-content-style">
                                {(0).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                <span className="card-unit-style">&nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;</span>
                            </p>
                        </div>
                    </div>
                </div>
            </Row>
            <Row>
                <Col xl={12}>
                    <StackedBarChart options={barChartOptions} series={barChartData} height={440} />
                </Col>
            </Row>

            <Row style={{ marginLeft: '0.5px' }}>
                <div className="card-body">
                    <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                        Top End Uses by Usage
                    </h6>
                    <h6 className="card-subtitle mb-2 custom-subtitle-style">
                        Click explore to see more energy usage details.
                    </h6>

                    <Row className="mt-4 energy-container">
                        {endUsage.map((usage, index) => {
                            return (
                                <div className="usage-card">
                                    <EnergyUsageCard usage={usage} button="View" />
                                </div>
                            );
                        })}
                    </Row>
                </div>
            </Row>
        </React.Fragment>
    );
};

export default EndUses;
