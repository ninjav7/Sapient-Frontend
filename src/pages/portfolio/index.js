import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import DonutChart from './PortfolioDonutChart';
import LineChart from './PortfolioLineChart';
import MapChart from './MapChart';
import ProgressBar from './ProgressBar';
import DetailedButton from '../buildings/DetailedButton';
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
    ];

    const TABS = {
        Tab1: '24 Hours',
        Tab2: '7 Days',
        Tab3: '30 Days',
        Tab4: 'Custom',
    };

    const [activeTab, setActiveTab] = useState(TABS.Tab3);

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col>
                    <h4 className="heading-style" style={{marginLeft: '20px'}}>Portfolio Overview</h4>
                    <div className="btn-group custom-button-group" role="group" aria-label="Basic example">
                        <div>
                            {Object.keys(TABS).map((key) => (
                                <button
                                    key={key}
                                    type="button"
                                    className={
                                        activeTab === TABS[key]
                                            ? 'btn btn-sm btn-dark font-weight-bold custom-buttons active'
                                            : 'btn btn-sm btn-light font-weight-bold custom-buttons'
                                    }
                                    onClick={() => setActiveTab(TABS[key])}>
                                    {TABS[key]}
                                </button>
                            ))}
                        </div>
                        <div className="float-right ml-2">
                            <button type="button" className="btn btn-sm btn-primary font-weight-bold">
                                <i className="uil uil-pen mr-1"></i>Explore
                            </button>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                {/* <Col> */}
                <div className="card-group button-style" style={{marginLeft: '29px'}}>
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <h5 className="card-title card-title-style">Total Buildings</h5>
                            <p className="card-text card-content-style">16</p>
                        </div>
                    </div>

                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="Total Consumption"
                                description="325,441"
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
                                description="1.25"
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
                </div>
                {/* </Col> */}
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
                            <Card style={{ marginTop: '90px' }}>
                                <CardBody>
                                    <Table className="mb-0" borderless hover>
                                        <tbody>
                                            {energyConsumption.map((record, index) => {
                                                return (
                                                    <tr key={index}>
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
