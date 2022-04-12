import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import DonutChart from '../portfolio/PortfolioDonutChart';
import Header from '../../components/Header';
import './style.css';
import LineChart from '../charts/LineChart';
import DetailedButton from './DetailedButton';
import EnergyLineChart from './EnergyLineChart';
import HeatMapChart from '../charts/HeatMapChart';
import axios from 'axios';
import {
    BaseUrl,
    builidingAlerts,
    builidingEquipments,
    builidingHourly,
    builidingOverview,
    builidingPeak,
    portfolioEndUser,
} from '../../services/Network';
import { percentageHandler } from '../../utils/helper';
const BuildingOverview = () => {
    const [overview, setOverview] = useState({
        total_building: 0,
        portfolio_rank: '10 of 50',
        total_consumption: {
            now: 0,
            old: 0,
        },
        average_energy_density: {
            now: 0,
            old: 0,
        },
        yearly_electric_eui: {
            now: 0,
            old: 0,
        },
    });
    // const [buildingAlert, setBuildingAlerts] = useState([
    //     {
    //         type: 'string',
    //         building_name: 'New Building Peak',
    //         building_address: 'address',
    //         trend: 'string',
    //         last_known_value: '100',
    //         current_value: '10',
    //         message: 'test',
    //         due_message: '10',
    //         created_at: 'Today',
    //     },
    //     {
    //         type: 'type2',
    //         building_name: 'Energy trend Upward',
    //         building_address: 'address',
    //         trend: 'string',
    //         last_known_value: '100',
    //         current_value: '10',
    //         message: 'test',
    //         due_message: '10',
    //         created_at: 'Today',
    //     },
    // ]);

    const [buildingAlert, setBuildingAlerts] = useState([]);

    const [buildingPeak, setBuildingPeak] = useState([
        {
            type: 'string',
            building_name: 'New Building Peak',
            building_address: 'address',
            trend: 'string',
            last_known_value: '100',
            current_value: '10',
            message: 'test',
            due_message: '10',
            created_at: 'Today',
        },
        {
            type: 'type2',
            building_name: 'Energy trend Upward',
            building_address: 'address',
            trend: 'string',
            last_known_value: '100',
            current_value: '10',
            message: 'test',
            due_message: '10',
            created_at: 'Today',
        },
    ]);

    const [buildingsEnergyConsume, setbuildingsEnergyConsume] = useState([]);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        const params = `?building_id=${1}`;
        axios
            .post(
                `${BaseUrl}${builidingOverview}${params}`,
                {
                    time_horizon: 0,
                    custom_time_horizon: 0,
                },
                { headers }
            )
            .then((res) => {
                setOverview(res.data);
                console.log(res.data);
            });
    }, []);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        axios
            .post(
                `${BaseUrl}${portfolioEndUser}`,
                {
                    time_horizon: 0,
                    custom_time_horizon: 0,
                },
                { headers }
            )
            .then((res) => {
                setEnergyConsumption(res.data);
                console.log(res.data);
            })
            .catch((err) => {});
    }, []);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        const params = `?building_id=${1}`;
        axios
            .post(
                `${BaseUrl}${builidingAlerts}${params}`,
                {
                    time_horizon: 0,
                    custom_time_horizon: 0,
                },
                { headers }
            )
            .then((res) => {
                setBuildingAlerts(res.data);
                console.log(res.data);
            });
    }, []);

    // peaks api call
    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        const params = `?building_id=${1}&limit=${2}`;
        axios
            .post(
                `${BaseUrl}${builidingPeak}${params}`,
                {
                    time_horizon: 0,
                    custom_time_horizon: 0,
                },
                { headers }
            )
            .then((res) => {
                setTopContributors(res.data);
                console.log(res.data);
            });
    }, []);
    // builidingEquipments
    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        const params = `?building_id=${1}`;
        axios
            .post(
                `${BaseUrl}${builidingEquipments}${params}`,
                {
                    time_horizon: 0,
                    custom_time_horizon: 0,
                },
                { headers }
            )
            .then((res) => {
                setTopEnergyConsumption(res.data[0].top_contributors);
                console.log(res.data);
            });
    }, []);
    // builidingHourly
    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        const params = `?building_id=${1}&aggregate=${'hi'}`;
        axios
            .post(
                `${BaseUrl}${builidingHourly}${params}`,
                {
                    time_horizon: 0,
                    custom_time_horizon: 0,
                },
                { headers }
            )
            .then((res) => {
                const data = res.data.map((el) => {
                    return {
                        x: el.energy_consumption,
                        y: el.timestamp,
                    };
                });
                const arr = [
                    {
                        data: data,
                    },
                ];
                console.log(res.data);
                console.log(arr);
                // setLineChartSeries(arr);
            });
    }, []);

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
            device: 'HVAC',
            energy_consumption: {
                now: 8000,
                old: 100,
            },
        },
        {
            device: 'HVAC',
            energy_consumption: {
                now: 1000,
                old: 100,
            },
        },
        {
            device: 'HVAC',
            energy_consumption: {
                now: 1000,
                old: 100,
            },
        },
        {
            device: 'HVAC',
            energy_consumption: {
                now: 1000,
                old: 100,
            },
        },
    ]);

    const [topEnergyConsumption, setTopEnergyConsumption] = useState([
        {
            equipment_id: 0,
            equipment_name: 'AHU 1',
            energy_consumption: {
                now: 25.3,
                old: 20,
            },
        },
        {
            equipment_id: 1,
            equipment_name: 'AHU 2',
            energy_consumption: {
                now: 75.3,
                old: 20,
            },
        },
        {
            equipment_id: 2,
            equipment_name: 'AHU 3',
            energy_consumption: {
                now: 89.3,
                old: 20,
            },
        },
        {
            equipment_id: 3,
            equipment_name: 'AHU 4',
            energy_consumption: {
                now: 100.3,
                old: 20,
            },
        },
    ]);

    const [topContributors, setTopContributors] = useState([
        {
            timeRange: {
                frm: 'yyy-mm-dd',
                to: 'yyy-mm-dd',
            },
            overall_energy_consumption: 0,
            top_contributors: [
                {
                    equipment_id: 0,
                    equipment_name: 'string',
                    energy_consumption: {
                        now: 0,
                        ol: 0,
                    },
                },
            ],
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
                                description={overview.total_consumption.now}
                                unit="kWh"
                                value={percentageHandler(
                                    overview.total_consumption.now,
                                    overview.total_consumption.old
                                )}
                                consumptionNormal={overview.total_consumption.now >= overview.total_consumption.old}
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
                                {overview.portfolio_rank.split('of')[0]}{' '}
                                <span className="card-unit-style">
                                    &nbsp;&nbsp;of {overview.portfolio_rank.split('of')[1]}
                                </span>
                            </p>
                        </div>
                    </div>
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="Energy Density"
                                description={overview.average_energy_density.now}
                                unit="kWh/sq.ft."
                                value={percentageHandler(
                                    overview.average_energy_density.now,
                                    overview.average_energy_density.old
                                )}
                                consumptionNormal={
                                    overview.average_energy_density.now >= overview.average_energy_density.old
                                }
                            />
                        </div>
                    </div>
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="12 Mo. Electric EUI"
                                description={overview.yearly_electric_eui.now}
                                unit="kBtu/ft/yr"
                                value={percentageHandler(
                                    overview.yearly_electric_eui.now,
                                    overview.yearly_electric_eui.old
                                )}
                                consumptionNormal={overview.yearly_electric_eui.now >= overview.yearly_electric_eui.old}
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
                                                            {record.device === 'HVAC' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#3094B9' }}></div>
                                                            )}
                                                            {record.device === 'Lightning' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#2C4A5E' }}></div>
                                                            )}
                                                            {record.device === 'Plug' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#66D6BC' }}></div>
                                                            )}
                                                            {record.device === 'Process' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#3B8554' }}></div>
                                                            )}
                                                        </td>
                                                        <td className="custom-equip-style">{record.device}</td>
                                                        <td className="custom-usage-style muted">{record.device}</td>
                                                        <td>
                                                            {record.energy_consumption.now <
                                                                record.energy_consumption.old && (
                                                                <button
                                                                    className="button-danger text-danger font-weight-bold font-size-5"
                                                                    style={{ width: '100%' }}>
                                                                    <i className="uil uil-chart-down">
                                                                        <strong>
                                                                            {percentageHandler(
                                                                                record.energy_consumption.now,
                                                                                record.energy_consumption.old
                                                                            )}{' '}
                                                                            %
                                                                        </strong>
                                                                    </i>
                                                                </button>
                                                            )}
                                                            {record.energy_consumption.now >=
                                                                record.energy_consumption.old && (
                                                                <button
                                                                    className="button-success text-success font-weight-bold font-size-5"
                                                                    style={{ width: '100%' }}>
                                                                    <i className="uil uil-arrow-growth">
                                                                        <strong>
                                                                            {percentageHandler(
                                                                                record.energy_consumption.now,
                                                                                record.energy_consumption.old
                                                                            )}{' '}
                                                                            %
                                                                        </strong>
                                                                    </i>
                                                                </button>
                                                            )}
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
                            {buildingAlert.map((record) => {
                                return (
                                    <div className="card">
                                        <div className="card-body">
                                            <h5 className="card-title" style={{ display: 'inline-block' }}>
                                                {record.building_name || 'NA'}
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
                                                {record.created_at || 'NA'}
                                            </a>
                                            <p className="card-text">{record.current_value || 'NA'} kW </p>
                                        </div>
                                    </div>
                                );
                            })}
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
                                            {item.timeRange.frm.slice(0, 10)} &{' '}
                                            {new Date(item.timeRange.frm).toLocaleTimeString('en', {
                                                timeStyle: 'short',
                                                hour12: false,
                                                timeZone: 'UTC',
                                            })}
                                        </h6>
                                        <h5 className="card-title">
                                            <span style={{ color: 'black' }}>{item.overall_energy_consumption}</span>
                                            &nbsp; kW
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
                                                        {item.top_contributors.map((el) => (
                                                            <tr>
                                                                <div className="font-weight-bold text-dark">
                                                                    {el.equipment_name}
                                                                </div>
                                                            </tr>
                                                        ))}
                                                    </td>
                                                    <td>
                                                        {item.top_contributors.map((el2) => (
                                                            <tr>
                                                                <div className="font-weight-bold">
                                                                    {el2.energy_consumption.now} kW
                                                                </div>
                                                            </tr>
                                                        ))}
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
                                                <th scope="col" className="text-muted" style={{ width: '100%' }}>
                                                    Change
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ fontSize: '12px' }}>
                                            {topEnergyConsumption.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div>
                                                            <div
                                                                className="font-weight-bold"
                                                                style={{ color: 'black' }}>
                                                                {item.equipment_name}
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div className="font-weight-bold">
                                                                <span style={{ color: 'black' }}>
                                                                    {item.energy_consumption.now}
                                                                </span>
                                                                <span>&nbsp;kW</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            {/* <div>{item.change} %</div> */}
                                                            <div>
                                                                {item.energy_consumption.now <
                                                                    item.energy_consumption.old && (
                                                                    <button
                                                                        className="button-danger text-danger font-weight-bold font-size-5"
                                                                        style={{ width: 'auto' }}>
                                                                        <i className="uil uil-chart-down">
                                                                            <strong>
                                                                                {percentageHandler(
                                                                                    item.energy_consumption.now,
                                                                                    item.energy_consumption.old
                                                                                )}{' '}
                                                                                %
                                                                            </strong>
                                                                        </i>
                                                                    </button>
                                                                )}
                                                                {item.energy_consumption.now >
                                                                    item.energy_consumption.old && (
                                                                    <button
                                                                        className="button-success text-success font-weight-bold font-size-5"
                                                                        style={{ width: '100%' }}>
                                                                        <i className="uil uil-arrow-growth">
                                                                            <strong>
                                                                                {percentageHandler(
                                                                                    item.energy_consumption.now,
                                                                                    item.energy_consumption.old
                                                                                )}{' '}
                                                                                %
                                                                            </strong>
                                                                        </i>
                                                                    </button>
                                                                )}
                                                                {item.energy_consumption.now ===
                                                                    item.energy_consumption.old && (
                                                                    <button
                                                                        className="button text-muted font-weight-bold font-size-5"
                                                                        style={{ width: '100%', border: 'none' }}>
                                                                        <i className="uil uil-arrow-growth">
                                                                            <strong>
                                                                                {percentageHandler(
                                                                                    item.energy_consumption.now,
                                                                                    item.energy_consumption.old
                                                                                )}{' '}
                                                                                %
                                                                            </strong>
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
