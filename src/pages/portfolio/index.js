import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import DonutChart from './PortfolioDonutChart';
import LineChart from '../charts/LineChart';
import MapChart from './MapChart';
import ProgressBar from './ProgressBar';
import DetailedButton from '../buildings/DetailedButton';
import Header from '../../components/Header';
import { servicePost, serviceGet } from '../../helpers/api';
import axios from 'axios';
import { BaseUrl, portfolioBuilidings, portfolioEndUser, portfolioOverall } from '../../services/Network';
import { percentageHandler } from '../../utils/helper';
import './style.css';

const PortfolioOverview = () => {
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

    // const buildingsEnergyConsume = [
    //     {
    //         storeName: '123 Main St. Portland, OR',
    //         energyDensity: '1.5 kWh / Sq. Ft.',
    //         value: 95,
    //     },
    //     {
    //         storeName: '15 University Blvd.',
    //         energyDensity: '1.4 kWh / Sq. Ft.',
    //         value: 80,
    //     },
    //     {
    //         storeName: '6223 Sycamore Ave.',
    //         energyDensity: '1.2 kWh / Sq. Ft.',
    //         value: 75,
    //     },
    //     {
    //         storeName: '246 Blackburn Rd.',
    //         energyDensity: '1.1 kWh / Sq. Ft.',
    //         value: 50,
    //     },
    //     {
    //         storeName: '523 James St.',
    //         energyDensity: '0.9 kWh / Sq. Ft.',
    //         value: 25,
    //     },
    //     {
    //         storeName: 'Philadelphia PA - North Side',
    //         energyDensity: '0.8 kWh / Sq. Ft.',
    //         value: 10,
    //     },
    // ];

    // const energyConsumption = [
    //     {
    //         equipName: 'HVAC',
    //         usage: 12553,
    //         percentage: 22,
    //     },
    //     {
    //         equipName: 'Lightning',
    //         usage: 11553,
    //         percentage: 22,
    //     },
    //     {
    //         equipName: 'Plug',
    //         usage: 11553,
    //         percentage: 22,
    //     },
    //     {
    //         equipName: 'Process',
    //         usage: 2333,
    //         percentage: 22,
    //     },
    // ];

    const [overalldata, setOveralldata] = useState({
        total_building: 0,
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

    const [buildingsEnergyConsume, setBuildingsEnergyConsume] = useState([]);

    const [energyConsumption, setenergyConsumption] = useState([
        {
            device: 'HVAC',
            energy_consumption: {
                now: 1000,
                old: 100,
            },
        },
    ]);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
        };
        axios
            .post(
                `${BaseUrl}${portfolioOverall}`,
                {
                    time_horizon: 0,
                    custom_time_horizon: 0,
                },
                { headers }
            )
            .then((res) => {
                setOveralldata(res.data);
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
                `${BaseUrl}${portfolioBuilidings}`,
                {
                    time_horizon: 0,
                    custom_time_horizon: 0,
                },
                { headers }
            )
            .then((res) => {
                setBuildingsEnergyConsume(res.data);
                console.log(res.data);
            })
            .catch((err) => {});
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
                setenergyConsumption(res.data);
                console.log(res.data);
            });
    }, []);

    return (
        <React.Fragment>
            <Header title="Portfolio Overview" />

            <Row>
                <div className="card-group button-style" style={{ marginLeft: '29px' }}>
                    <div className="card card-box-style button-style">
                        <div className="card-body" style={{ marginTop: '2px' }}>
                            <h5 className="card-title card-title-style">Total Buildings</h5>
                            <p className="card-text card-content-style">{overalldata.total_building}</p>
                        </div>
                    </div>

                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="Total Consumption"
                                description={overalldata.total_consumption.now}
                                unit="kWh"
                                value={percentageHandler(
                                    overalldata.total_consumption.now,
                                    overalldata.total_consumption.old
                                )}
                                consumptionNormal={
                                    overalldata.total_consumption.now >= overalldata.total_consumption.old
                                }
                            />
                        </div>
                    </div>

                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="Average Energy Density"
                                description={overalldata.average_energy_density.now}
                                unit="kWh/sq.ft."
                                value={percentageHandler(
                                    overalldata.average_energy_density.now,
                                    overalldata.average_energy_density.old
                                )}
                                consumptionNormal={
                                    overalldata.average_energy_density.now >= overalldata.average_energy_density.old
                                }
                            />
                        </div>
                    </div>

                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="12 Mo. Electric EUI"
                                description={overalldata.yearly_electric_eui.now}
                                unit="kBtu/ft/yr"
                                value={percentageHandler(
                                    overalldata.yearly_electric_eui.now,
                                    overalldata.yearly_electric_eui.old
                                )}
                                consumptionNormal={
                                    overalldata.yearly_electric_eui.now >= overalldata.yearly_electric_eui.old
                                }
                            />
                        </div>
                    </div>
                </div>
            </Row>

            <Row className="mt-2">
                <Col xl={5}>
                    <div className="card-body mt-2">
                        <h6 className="card-title">Energy Density Top Buildings</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Energy Consumption / Sq. Ft. Average</h6>
                        <div className="map-widget">
                            <MapChart />
                        </div>
                    </div>
                </Col>

                <Col xl={7} className="mt-5">
                    <div className="card-body mt-4">
                        <span className="font-weight-bold text-muted float-left store-value-style">Store Name</span>
                        <span className="font-weight-bold text-muted float-right store-value-style">
                            Energy Density
                        </span>

                        {buildingsEnergyConsume.map((item, index) => (
                            <Col md={6} xl={12}>
                                <Link to="/energy/building/overview">
                                    <div className="progress-bar-container mt-4">
                                        {/* <ProgressBar
                                            color="danger"
                                            progressValue={item.value}
                                            progressTitle={item.buildingName}
                                            progressUnit={item.density + ' k.W /Sq. feet'}
                                            className="progress-bar-container"
                                        /> */}
                                        <ProgressBar
                                            color="danger"
                                            progressValue={(item.density / 2) * 100}
                                            progressTitle={item.buildingName}
                                            progressUnit={item.density + ' k.W /Sq. feet'}
                                            className="progress-bar-container"
                                        />
                                    </div>
                                </Link>
                            </Col>
                        ))}
                    </div>
                </Col>
            </Row>

            <Row className="mt-2 ml-2">
                <Col xl={6}>
                    <Row>
                        <Col xl={6} className="mt-4">
                            <h6 className="card-title">Energy Consumption by End Use</h6>
                            <h6 className="card-subtitle mb-2 text-muted">Energy Totals</h6>
                            <div className="card-body mt-2">
                                <div className="mt-4">
                                    <DonutChart />
                                </div>
                            </div>
                        </Col>
                        <Col xl={6}>
                            <Card style={{ marginTop: '80px' }}>
                                <CardBody>
                                    <Table className="mb-0" borderless hover>
                                        <tbody>
                                            {energyConsumption.map((record, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="custom-equip-style">{record.device}</td>
                                                        <td className="custom-usage-style muted">
                                                            {record.energy_consumption.now.toLocaleString(undefined, {
                                                                maximumFractionDigits: 2,
                                                            })}{' '}
                                                            kWh
                                                        </td>
                                                        <td>
                                                            {record.energy_consumption.now <
                                                                record.energy_consumption.old && (
                                                                <button
                                                                    className="button-danger text-danger font-weight-bold font-size-5"
                                                                    style={{ width: '100px' }}>
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
                                                                    style={{ width: '100px' }}>
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

                <Col xl={6}>
                    <div className="card-body">
                        <h6 className="card-title">Energy Consumption History</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Energy Totals by Day</h6>
                        <LineChart options={lineChartOptions} series={lineChartSeries} />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default PortfolioOverview;
