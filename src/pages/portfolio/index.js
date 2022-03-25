import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import DonutChart from './PortfolioDonutChart';
import LineChart from './PortfolioLineChart';
import GeoLocation from './GeoLocation';
import ProgressBar from './ProgressBar';
import StatisticsWidget from '../../components/StatisticsWidget';
import StatisticsProgressWidget from '../../components/StatisticsProgressWidget';
import StatisticsChartWidget from '../../components/StatisticsChartWidget';
import StatisticsChartWidget2 from '../../components/StatisticsChartWidget2';
import classNames from 'classnames';
import './style.css';

const PortfolioOverview = () => {
    const buildingsEnergyConsume = [
        {
            storeName: '123 Main St. Portland, OR',
            energyDensity: '1.5 kWh / Sq. Ft.',
            value: 95,
        },
        {
            storeName: '15 University Blvd.',
            energyDensity: '1.4 kWh / Sq. Ft.',
            value: 80,
        },
        {
            storeName: '6223 Sycamore Ave.',
            energyDensity: '1.2 kWh / Sq. Ft.',
            value: 75,
        },
        {
            storeName: '246 Blackburn Rd.',
            energyDensity: '1.1 kWh / Sq. Ft.',
            value: 50,
        },
        {
            storeName: '523 James St.',
            energyDensity: '0.9 kWh / Sq. Ft.',
            value: 25,
        },
        {
            storeName: 'Philadelphia PA - North Side',
            energyDensity: '0.8 kWh / Sq. Ft.',
            value: 10,
        },
    ];

    const energyConsumption = [
        {
            equipName: 'HVAC',
            usage: '12,553 kWh',
            percentage: 22,
        },
        {
            equipName: 'Lightning',
            usage: '12,553 kWh',
            percentage: 22,
        },
        {
            equipName: 'Plug',
            usage: '12,553 kWh',
            percentage: 22,
        },
        {
            equipName: 'Process',
            usage: '12,553 kWh',
            percentage: 22,
        },
    ];

    return (
        <>
            <Row className="page-title">
                <Col>
                    <h4 className="heading-style">Portfolio Overview</h4>
                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-outline-secondary custom-buttons">
                            24 Hours
                        </button>
                        <button type="button" className="btn btn-outline-secondary custom-buttons">
                            7 Days
                        </button>
                        <button type="button" className="btn btn-outline-secondary custom-buttons active">
                            30 Days
                        </button>
                        <button type="button" className="btn btn-outline-secondary custom-buttons">
                            Custom
                        </button>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <div className="card-group">
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5 className="card-title card-title-style">Total Buildings</h5>
                                <p className="card-text card-content-style">
                                    16 <span className="card-unit-style">&nbsp;&nbsp;</span>
                                </p>
                            </div>
                        </div>
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5 className="card-title card-title-style">Total Consumption</h5>
                                <p className="card-text card-content-style">
                                    325,441{' '}
                                    <span className="card-unit-style">
                                        &nbsp;&nbsp;kWh&nbsp;
                                        <button className="button-success text-success font-weight-bold font-size-5">
                                            <i className="bi-graph-up">5 %</i>
                                        </button>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5 className="card-title card-title-style">Average Energy Density</h5>
                                <p className="card-text card-content-style">
                                    1.25{' '}
                                    <span className="card-unit-style">
                                        &nbsp;&nbsp;kWh/sq.ft.&nbsp;
                                        <button className="button-success text-success font-weight-bold font-size-5">
                                            <i className="bi-graph-up">5 %</i>
                                        </button>
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5 className="card-title card-title-style">12 Mo. Electric EUI</h5>
                                <p className="card-text card-content-style">
                                    67{' '}
                                    <span className="card-unit-style">
                                        &nbsp;&nbsp;kBtu/ft/yr&nbsp;
                                        <button className="button-danger text-danger font-weight-bold font-size-5">
                                            <i className="bi-graph-up">6.2 %</i>
                                        </button>
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={5}>
                    <div className="card-body mt-4">
                        <h6 className="card-title custom-title">Energy Density Top Buildings</h6>
                        <h6 className="card-subtitle custom-subtitle">Energy Consumption / Sq. Ft. Average</h6>
                        <div className="map-widget">
                            <GeoLocation />
                        </div>
                    </div>
                </Col>

                <Col xl={7} className="mt-5">
                    <div className="card-body mt-4">
                        <span className="text-muted font-weight-semibold float-left store-value-style">Store Name</span>
                        <span className="text-muted font-weight-semibold float-right store-value-style">
                            Energy Density
                        </span>

                        {buildingsEnergyConsume.map((item, index) => (
                            <Col md={6} xl={12}>
                                <div className="progress-bar-container mt-4">
                                    <ProgressBar
                                        color="danger"
                                        progressValue={item.value}
                                        progressTitle={item.storeName}
                                        progressUnit={item.energyDensity}
                                        className="progress-bar-container"
                                    />
                                </div>
                            </Col>
                        ))}
                    </div>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col xl={6}>
                    {/* <Row xl={12}>
                        <h6 className="card-title custom-title">Energy Consumption by End Use</h6>
                        <h6 className="card-subtitle custom-subtitle">Energy Totals</h6>
                    </Row> */}
                    <Row>
                        <Col xl={6}>
                            <div className="card-body donut-style">
                                <h6 className="card-title custom-title">Energy Consumption by End Use</h6>
                                <h6 className="card-subtitle custom-subtitle">Energy Totals</h6>
                                <div className="mt-2">
                                    <DonutChart />
                                </div>
                            </div>
                        </Col>
                        <Col xl={6}>
                            <Card style={{ marginTop: '90px' }}>
                                <CardBody>
                                    <Table className="mb-0" bordered hover>
                                        <tbody>
                                            {energyConsumption.map((record, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className="custom-equip-style">{record.equipName}</td>
                                                        <td className="custom-usage-style muted">
                                                            {/* {`${record.usage} kWh`} */}
                                                            {record.usage}
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="button-danger text-danger font-weight-bold font-size-5"
                                                                style={{ width: '50px' }}>
                                                                <i className="bi-graph-up">{`${record.percentage} %`}</i>
                                                            </button>
                                                            {/* <button className="custom-percent-style">
                                                                {`${record.percentage} %`}
                                                            </button> */}
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
                        <h6 className="card-title custom-title">Total Energy Consumption</h6>
                        <h6 className="card-subtitle custom-subtitle">Totaled by Hour</h6>
                        <LineChart />
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default PortfolioOverview;
