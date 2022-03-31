import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import DonutChart from './PortfolioDonutChart';
import LineChart from './PortfolioLineChart';
import MapChart from './MapChart';
import ProgressBar from './ProgressBar';
import DetailedButton from '../buildings/DetailedButton';
import Header from '../../components/Header';
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
            usage: 12553,
            percentage: 22,
        },
        {
            equipName: 'Lightning',
            usage: 11553,
            percentage: 22,
        },
        {
            equipName: 'Plug',
            usage: 11553,
            percentage: 22,
        },
        {
            equipName: 'Process',
            usage: 2333,
            percentage: 22,
        },
    ];

    return (
        <React.Fragment>
            <Header title="Portfolio Overview" />

            <Row>
                <div className="card-group button-style" style={{ marginLeft: '29px' }}>
                    <div className="card card-box-style button-style">
                        <div className="card-body" style={{ marginTop: '2px' }}>
                            <h5 className="card-title card-title-style">Total Buildings</h5>
                            <p className="card-text card-content-style">16</p>
                        </div>
                    </div>

                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="Total Consumption"
                                description={325441}
                                unit="kWh"
                                value="5"
                                consumptionNormal={true}
                            />
                        </div>
                    </div>

                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="Average Energy Density"
                                description={1.25}
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
                                description={67}
                                unit="kBtu/ft/yr"
                                value="6.2"
                                consumptionNormal={false}
                            />
                        </div>
                    </div>
                </div>
            </Row>

            <Row className="mt-2">
                <Col xl={5}>
                    <div className="card-body mt-2">
                        <h6 className="card-title custom-title">Energy Density Top Buildings</h6>
                        <h6 className="card-subtitle custom-subtitle">Energy Consumption / Sq. Ft. Average</h6>
                        <div className="map-widget">
                            <MapChart />
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
                                <div
                                    className="progress-bar-container mt-4"
                                    onClick={(e) => {
                                        window.open('/energy/building', '_parent');
                                    }}>
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

            <Row className="mt-2">
                <Col xl={6}>
                    <Row>
                        <Col xl={6}>
                            <div className="card-body">
                                <h6 className="card-title custom-title">Energy Consumption by End Use</h6>
                                <h6 className="card-subtitle custom-subtitle">Energy Totals</h6>
                                <div className="mt-2">
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
                                                        <td className="custom-equip-style">{record.equipName}</td>
                                                        <td className="custom-usage-style muted">
                                                            {record.usage.toLocaleString(undefined, {
                                                                maximumFractionDigits: 2,
                                                            })} kWh
                                                        </td>
                                                        <td>
                                                            <button
                                                                className="button-danger text-danger font-weight-bold font-size-5"
                                                                style={{ width: '75px' }}>
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

                <Col xl={6}>
                    <div className="card-body">
                        <h6 className="card-title custom-title">Total Energy Consumption</h6>
                        <h6 className="card-subtitle custom-subtitle">Totaled by Hour</h6>
                        <LineChart />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default PortfolioOverview;
