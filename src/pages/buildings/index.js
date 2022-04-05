import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import DonutChart from '../portfolio/PortfolioDonutChart';
import Header from '../../components/Header';
import './style.css';
import LineChart from '../charts/LineChart';
import DetailedButton from './DetailedButton';
import EnergyLineChart from './EnergyLineChart';
import HeatMapChart from '../charts/HeatMapChart';

const BuildingOverview = () => {
    const [lineChartSeries, setLineChartSeries] = useState([
        {
            data: [
                {
                    x: new Date('2022-10-1').getTime(),
                    y: 22000,
                },
                {
                    x: new Date('2022-10-2').getTime(),
                    y: 25000,
                },
                {
                    x: new Date('2022-10-3').getTime(),
                    y: 21500,
                },
                {
                    x: new Date('2022-10-4').getTime(),
                    y: 23000,
                },
                {
                    x: new Date('2022-10-5').getTime(),
                    y: 20000,
                },
                {
                    x: new Date('2022-10-6').getTime(),
                    y: 15000,
                },
                {
                    x: new Date('2022-10-7').getTime(),
                    y: 18000,
                },
                {
                    x: new Date('2022-10-8').getTime(),
                    y: 25000,
                },
                {
                    x: new Date('2022-10-9').getTime(),
                    y: 15000,
                },
                {
                    x: new Date('2022-10-10').getTime(),
                    y: 20000,
                },
                {
                    x: new Date('2022-10-11').getTime(),
                    y: 23000,
                },
                {
                    x: new Date('2022-10-12').getTime(),
                    y: 20000,
                },
                {
                    x: new Date('2022-10-13').getTime(),
                    y: 23000,
                },
                {
                    x: new Date('2022-10-14').getTime(),
                    y: 19000,
                },
                {
                    x: new Date('2022-10-15').getTime(),
                    y: 24000,
                },
                {
                    x: new Date('2022-10-16').getTime(),
                    y: 20000,
                },
                {
                    x: new Date('2022-10-17').getTime(),
                    y: 25000,
                },
                {
                    x: new Date('2022-10-18').getTime(),
                    y: 23000,
                },
                {
                    x: new Date('2022-10-19').getTime(),
                    y: 27000,
                },
                {
                    x: new Date('2022-10-20').getTime(),
                    y: 22000,
                },
                {
                    x: new Date('2022-10-21').getTime(),
                    y: 20000,
                },
                {
                    x: new Date('2022-10-22').getTime(),
                    y: 21000,
                },
                {
                    x: new Date('2022-10-23').getTime(),
                    y: 24000,
                },
                {
                    x: new Date('2022-10-24').getTime(),
                    y: 18000,
                },
                {
                    x: new Date('2022-10-25').getTime(),
                    y: 19000,
                },
                {
                    x: new Date('2022-10-26').getTime(),
                    y: 24000,
                },
                {
                    x: new Date('2022-10-27').getTime(),
                    y: 21000,
                },
                {
                    x: new Date('2022-10-28').getTime(),
                    y: 27000,
                },
                {
                    x: new Date('2022-10-29').getTime(),
                    y: 24000,
                },
                {
                    x: new Date('2022-10-30').getTime(),
                    y: 20000,
                },
            ],
        },
    ]);

    const [lineChartOptions, setLineChartOptions] = useState({
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        colors: ['#87AADE'],
        stroke: {
            curve: 'straight',
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
            },
        },
        stroke: {
            width: [2, 2],
        },
        plotOptions: {
            bar: {
                columnWidth: '20%',
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            x: {
                show: true,
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (value, timestamp, opts) {
                    return opts.dateFormatter(new Date(timestamp), 'MMM-dd');
                },
            },
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
    });

    const [energyConsumption, setEnergyConsumption] = useState([
        {
            equipName: 'HVAC',
            usage: '12,553 kWh',
            percentage: 22,
        },
        {
            equipName: 'Lightning',
            usage: '11,553 kWh',
            percentage: 22,
        },
        {
            equipName: 'Plug',
            usage: '11,553 kWh',
            percentage: 22,
        },
        {
            equipName: 'Process',
            usage: '2,333 kWh',
            percentage: 22,
        },
    ]);

    const [topEnergyConsumption, setTopEnergyConsumption] = useState([
        {
            equipment: 'AHU 1',
            power: 25.3,
            change: 22,
            status: 'up',
        },
        {
            equipment: 'AHU 2',
            power: 21.3,
            change: 3,
            status: 'down',
        },
        {
            equipment: 'RTU 1',
            power: 2.3,
            change: 6,
            status: 'normal',
        },
        {
            equipment: 'Front RTU',
            power: 25.3,
            change: 2,
            status: 'down',
        },
    ]);

    const [topContributors, setTopContributors] = useState([
        {
            date: 'March 3rd',
            time: '3:20 PM',
            power: 225.3,
            contributor: {
                ahu1: 22.2,
                ahu2: 15.3,
                compressor: 0.2,
            },
        },
        {
            date: 'April 3rd',
            time: '4:20 PM',
            power: 219.2,
            contributor: {
                ahu1: 22.2,
                ahu2: 0.4,
                compressor: 0.2,
            },
        },
        {
            date: 'March 3rd',
            time: '3:20 PM',
            power: 202.2,
            contributor: {
                ahu1: 22.2,
                ahu2: 0.4,
                compressor: 0.2,
            },
        },
    ]);

    const weekdaysOptions = {
        chart: {
            type: 'heatmap',
        },
        dataLabels: {
            enabled: false,
        },
        title: {
            text: 'Weekdays',
            style: {
                fontSize: '15px',
                fontWeight: 'bold',
                fontFamily: undefined,
                color: '#98A2B3',
            },
        },
        stroke: {
            width: 0.7,
        },
        plotOptions: {
            heatmap: {
                // shadeIntensity: 0.5,
                radius: 1,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        {
                            from: 1000,
                            to: 1999,
                            color: '#9bb4da',
                        },
                        {
                            from: 2000,
                            to: 2999,
                            color: '#819dc9',
                        },
                        {
                            from: 3000,
                            to: 3999,
                            color: '#128FD9',
                        },
                        {
                            from: 4000,
                            to: 4999,
                            color: '#F87171',
                        },
                        {
                            from: 5000,
                            to: 5999,
                            color: '#FF0000',
                        },
                    ],
                },
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        xaxis: {
            labels: {
                show: true,
            },
            categories: ['1AM', '3AM', '5AM', '7AM', '9AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12PM'],
        },
    };

    const weekdaysSeries = [
        {
            name: 'Weekends',
            data: [
                {
                    x: '1AM',
                    y: 1000,
                },
                {
                    x: '2AM',
                    y: 1000,
                },
                {
                    x: '3AM',
                    y: 2000,
                },
                {
                    x: '4AM',
                    y: 2000,
                },
                {
                    x: '5AM',
                    y: 4000,
                },
                {
                    x: '6AM',
                    y: 3000,
                },
                {
                    x: '7AM',
                    y: 3000,
                },
                {
                    x: '8AM',
                    y: 1000,
                },
                {
                    x: '9AM',
                    y: 2000,
                },
                {
                    x: '10AM',
                    y: 2000,
                },
                {
                    x: '11AM',
                    y: 1000,
                },
                {
                    x: '12PM',
                    y: 1000,
                },
                {
                    x: '1PM',
                    y: 2000,
                },
                {
                    x: '2PM',
                    y: 2000,
                },
                {
                    x: '3PM',
                    y: 3000,
                },
                {
                    x: '4PM',
                    y: 4000,
                },
                {
                    x: '5PM',
                    y: 4000,
                },
                {
                    x: '6PM',
                    y: 5000,
                },
                {
                    x: '7PM',
                    y: 5000,
                },
                {
                    x: '8PM',
                    y: 4000,
                },
                {
                    x: '9PM',
                    y: 4000,
                },
                {
                    x: '10PM',
                    y: 3000,
                },
                {
                    x: '11PM',
                    y: 2500,
                },
                {
                    x: '12AM',
                    y: 2000,
                },
            ],
        },
    ];

    const weekdaysChartHeight = 135;
    const weekendsChartHeight = 135;

    const weekendsOptions = {
        chart: {
            type: 'heatmap',
        },
        dataLabels: {
            enabled: false,
        },
        title: {
            text: 'Weekends',
            style: {
                fontSize: '15px',
                fontWeight: 'bold',
                fontFamily: undefined,
                color: '#98A2B3',
            },
        },
        stroke: {
            width: 0.7,
        },
        plotOptions: {
            heatmap: {
                // shadeIntensity: 0.5,
                radius: 1,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        {
                            from: 1000,
                            to: 1999,
                            color: '#9bb4da',
                        },
                        {
                            from: 2000,
                            to: 2999,
                            color: '#819dc9',
                        },
                        {
                            from: 3000,
                            to: 3999,
                            color: '#128FD9',
                        },
                        {
                            from: 4000,
                            to: 4999,
                            color: '#F87171',
                        },
                        {
                            from: 5000,
                            to: 5999,
                            color: '#FF0000',
                        },
                    ],
                },
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        xaxis: {
            labels: {
                show: true,
            },
            categories: ['1AM', '3AM', '5AM', '7AM', '9AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12PM'],
        },
    };

    const weekendsSeries = [
        {
            name: 'Weekends',
            data: [
                {
                    x: '1AM',
                    y: 1000,
                },
                {
                    x: '2AM',
                    y: 1000,
                },
                {
                    x: '3AM',
                    y: 2000,
                },
                {
                    x: '4AM',
                    y: 2000,
                },
                {
                    x: '5AM',
                    y: 4000,
                },
                {
                    x: '6AM',
                    y: 3000,
                },
                {
                    x: '7AM',
                    y: 3000,
                },
                {
                    x: '8AM',
                    y: 1000,
                },
                {
                    x: '9AM',
                    y: 2000,
                },
                {
                    x: '10AM',
                    y: 2000,
                },
                {
                    x: '11AM',
                    y: 1000,
                },
                {
                    x: '12PM',
                    y: 1000,
                },
                {
                    x: '1PM',
                    y: 2000,
                },
                {
                    x: '2PM',
                    y: 2000,
                },
                {
                    x: '3PM',
                    y: 3000,
                },
                {
                    x: '4PM',
                    y: 4000,
                },
                {
                    x: '5PM',
                    y: 4000,
                },
                {
                    x: '6PM',
                    y: 5000,
                },
                {
                    x: '7PM',
                    y: 5000,
                },
                {
                    x: '8PM',
                    y: 4000,
                },
                {
                    x: '9PM',
                    y: 4000,
                },
                {
                    x: '10PM',
                    y: 3000,
                },
                {
                    x: '11PM',
                    y: 2500,
                },
                {
                    x: '12AM',
                    y: 2000,
                },
            ],
        },
    ];

    return (
        <React.Fragment>
            <Header title="Building Overview" />

            <Row>
                <div className="card-group button-style" style={{ marginLeft: '29px' }}>
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="Total Consumption"
                                description={25441}
                                unit="kWh"
                                value="5"
                                consumptionNormal={true}
                            />
                        </div>
                    </div>
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <h5 className="card-title card-title-style">
                                Portfolio Rank&nbsp;&nbsp;
                                <div>
                                    <i className="uil uil-info-circle avatar-xs rounded-circle" id="title" />
                                    <UncontrolledTooltip placement="bottom" target="#title">
                                        Information ToolTips
                                    </UncontrolledTooltip>
                                </div>
                            </h5>
                            <p className="card-text card-content-style">
                                1 <span className="card-unit-style">&nbsp;&nbsp;of 40</span>
                            </p>
                        </div>
                    </div>
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="Energy Density"
                                description="1.3"
                                unit="kWh/sq.ft."
                                value="5"
                                consumptionNormal={true}
                            />
                        </div>
                    </div>
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="12 Mo. Electric EUI"
                                description="67"
                                unit="kBtu/ft/yr"
                                value="6.2"
                                consumptionNormal={false}
                            />
                        </div>
                    </div>
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <h5 className="card-title card-title-style" style={{ marginTop: '3px' }}>
                                Monitored Load&nbsp;&nbsp;
                                <div>
                                    <i className="uil uil-info-circle avatar-xs rounded-circle" id="title" />
                                    <UncontrolledTooltip placement="bottom" target="#title">
                                        Information ToolTips
                                    </UncontrolledTooltip>
                                </div>
                            </h5>
                            <button id="inner-button">Add Utility Bill</button>
                        </div>
                    </div>
                </div>
            </Row>

            <Row>
                <Col xl={8} style={{ marginTop: '2rem', marginLeft: '23px' }}>
                    <Row>
                        <Col xl={12}>
                            <h6
                                className="card-title custom-title"
                                style={{ display: 'inline-block', fontWeight: 'bold' }}>
                                Energy Consumption by End Use
                            </h6>
                            <Link to="/energy/end-uses">
                                <a
                                    rel="noopener noreferrer"
                                    className="link-primary mr-4"
                                    style={{
                                        display: 'inline-block',
                                        float: 'right',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                    }}>
                                    More Details
                                </a>
                            </Link>
                            
                            <h6 className="card-subtitle mb-2 text-muted">Energy Totals</h6>
                            {/* <h6 className="card-subtitle custom-subtitle">Energy Totals</h6> */}
                        </Col>
                        <Col xl={6}>
                            <div className="card-body">
                                <div>
                                    <DonutChart />
                                </div>
                            </div>
                        </Col>
                        <Col xl={6}>
                            <Card style={{ marginTop: '50px' }}>
                                <CardBody>
                                    <Table className="mb-0" borderless hover>
                                        <tbody>
                                            {energyConsumption.map((record, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>
                                                            {record.equipName === 'HVAC' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#3094B9' }}></div>
                                                            )}
                                                            {record.equipName === 'Lightning' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#2C4A5E' }}></div>
                                                            )}
                                                            {record.equipName === 'Plug' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#66D6BC' }}></div>
                                                            )}
                                                            {record.equipName === 'Process' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#3B8554' }}></div>
                                                            )}
                                                        </td>
                                                        <td className="custom-equip-style">{record.equipName}</td>
                                                        <td className="custom-usage-style muted">{record.usage}</td>
                                                        <td>
                                                            <button
                                                                className="button-danger text-danger font-weight-bold font-size-5"
                                                                style={{ width: '100%' }}>
                                                                <i className="uil uil-chart-down">
                                                                    <strong>{record.percentage} %</strong>
                                                                </i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col style={{ marginTop: '2rem' }}>
                    <div className="card text-dark bg-light">
                        <div
                            className="card-header font-weight-bold"
                            style={{ display: 'inline-block', fontWeight: 'bold' }}>
                            Building Alerts
                            <a
                                href="#"
                                // target="_blank"
                                rel="noopener noreferrer"
                                className="link-primary"
                                style={{
                                    display: 'inline-block',
                                    float: 'right',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}>
                                Clear
                            </a>
                        </div>
                        <div className="card-body">
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title" style={{ display: 'inline-block' }}>
                                        New Building Peak
                                    </h5>
                                    <a
                                        href="#"
                                        // target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-primary text-muted"
                                        style={{
                                            display: 'inline-block',
                                            float: 'right',
                                            textDecoration: 'none',
                                            fontWeight: 'bold',
                                        }}>
                                        Today
                                    </a>
                                    <p className="card-text">225.3 kW 3/3/22 @ 3:20 PM</p>
                                </div>
                            </div>
                            <div className="card mt-2">
                                <div className="card-body">
                                    <h5 className="card-title" style={{ display: 'inline-block' }}>
                                        Energy trend Upward
                                    </h5>
                                    <a
                                        href="#"
                                        // target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-primary text-muted"
                                        style={{
                                            display: 'inline-block',
                                            float: 'right',
                                            textDecoration: 'none',
                                            fontWeight: 'bold',
                                        }}>
                                        Yesterday
                                    </a>
                                    <p className="card-text">+25% form last 30 days</p>
                                </div>
                            </div>
                            <div className="card mt-2">
                                <div className="card-body">
                                    <h5 className="card-title" style={{ display: 'inline-block' }}>
                                        Service Due Soon (AHU 1)
                                    </h5>
                                    <a
                                        href="#"
                                        // target="_blank"
                                        rel="noopener noreferrer"
                                        className="link-primary text-muted"
                                        style={{
                                            display: 'inline-block',
                                            float: 'right',
                                            textDecoration: 'none',
                                            fontWeight: 'bold',
                                        }}>
                                        Tuesday
                                    </a>
                                    <p className="card-text">40 Run Hours in 25 Days</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={8}>
                    <div className="card-body">
                        <h6 className="card-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                            Top 3 Peak Demand Periods
                        </h6>
                        <Link to="/energy/peak-demand">
                            <a
                                rel="noopener noreferrer"
                                className="link-primary"
                                style={{
                                    display: 'inline-block',
                                    float: 'right',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}>
                                More Details
                            </a>
                        </Link>
                        <h6 className="card-subtitle mb-2 text-muted">Max power draw (15 minutes period)</h6>
                        <div className="card-group mt-2">
                            {topContributors.map((item, index) => (
                                <div className="card peak-demand-container mt-3">
                                    <div className="card-body">
                                        <h6 className="card-title text-muted">
                                            {item.date} & {item.time}
                                        </h6>
                                        <h5 className="card-title">
                                            <span style={{ color: 'black' }}>{item.power}</span>&nbsp; kW
                                        </h5>
                                        <p
                                            className="card-text"
                                            style={{ fontWeight: 'bold', paddingTop: '10px', color: 'black' }}>
                                            Top Contributor
                                        </p>
                                        <table
                                            className="table table-borderless w-auto small"
                                            style={{ fontSize: '12px' }}>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <tr>
                                                            <div className="font-weight-bold text-dark">AHU 1</div>
                                                        </tr>
                                                        <tr>
                                                            <div className="font-weight-bold text-dark">AHU 2</div>
                                                        </tr>
                                                        <tr>
                                                            <div className="font-weight-bold text-dark">
                                                                Compressor 1
                                                            </div>
                                                        </tr>
                                                    </td>
                                                    <td>
                                                        <tr>
                                                            <div className="font-weight-bold">
                                                                {item.contributor.ahu1} kW
                                                            </div>
                                                        </tr>
                                                        <tr>
                                                            <div className="font-weight-bold">
                                                                {item.contributor.ahu2} kW
                                                            </div>
                                                        </tr>
                                                        <tr>
                                                            <div className="font-weight-bold">
                                                                {item.contributor.compressor} kW
                                                            </div>
                                                        </tr>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>

                <Col xl={4}>
                    <div className="card text-dark bg-light" style={{ marginLeft: '20px' }}>
                        <div className="card-header">Top Equipment Consumption</div>
                        <div className="card-body">
                            <div className="card">
                                <div className="card-body">
                                    <table className="table table-borderless">
                                        <thead>
                                            <tr>
                                                <th scope="col" className="text-muted">
                                                    Equipment
                                                </th>
                                                <th scope="col" className="text-muted">
                                                    Power
                                                </th>
                                                <th scope="col" className="text-muted">
                                                    Change
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {topEnergyConsumption.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div>
                                                            <div
                                                                className="font-weight-bold"
                                                                style={{ color: 'black' }}>
                                                                {item.equipment}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div className="font-weight-bold">
                                                                <span style={{ color: 'black' }}>{item.power}</span>
                                                                <span>&nbsp;kW</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            {/* <div>{item.change} %</div> */}
                                                            <div>
                                                                {item.status === 'up' && (
                                                                    <button
                                                                        className="button-danger text-danger font-weight-bold font-size-5"
                                                                        style={{ width: '75px' }}>
                                                                        <i className="uil uil-arrow-growth">
                                                                            <strong>{item.change} %</strong>
                                                                        </i>
                                                                    </button>
                                                                )}
                                                                {item.status === 'down' && (
                                                                    <button
                                                                        className="button-success text-success font-weight-bold font-size-5"
                                                                        style={{ width: '75px' }}>
                                                                        <i className="uil uil-chart-down">
                                                                            <strong>{item.change} %</strong>
                                                                        </i>
                                                                    </button>
                                                                )}
                                                                {item.status === 'normal' && (
                                                                    <button
                                                                        className="button text-muted font-weight-bold font-size-5"
                                                                        style={{ width: '75px', border: 'none' }}>
                                                                        <i className="uil uil-arrow-growth">
                                                                            <strong>{item.change} %</strong>
                                                                        </i>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={8}>
                    <div className="card-body">
                        <h6 className="card-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                            Hourly Average Consumption
                        </h6>
                        <Link to="/energy/time-of-day">
                            <a
                                rel="noopener noreferrer"
                                className="link-primary"
                                style={{
                                    display: 'inline-block',
                                    float: 'right',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}>
                                More Details
                            </a>
                        </Link>
                        <h6 className="card-subtitle mb-2 text-muted">Average by Hour</h6>
                        <HeatMapChart options={weekdaysOptions} series={weekdaysSeries} height={weekdaysChartHeight} />
                        <HeatMapChart options={weekendsOptions} series={weekendsSeries} height={weekendsChartHeight} />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={8}>
                    <div className="card-body">
                        <h6 className="card-title">Total Energy Consumption</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Totaled by Hour</h6>
                        {/* <EnergyLineChart /> */}
                        <LineChart options={lineChartOptions} series={lineChartSeries} />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default BuildingOverview;
