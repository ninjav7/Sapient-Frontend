import React, { useState } from 'react';
import { Row, Col, Card, CardBody, Table, UncontrolledTooltip } from 'reactstrap';
import DonutChart from '../portfolio/PortfolioDonutChart';
import Header from '../../components/Header';
import './style.css';
import DetailedButton from './DetailedButton';
import EnergyLineChart from './EnergyLineChart';
import EnergyBarChart from './EnergyBarChart';

const BuildingOverview = () => {
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

    return (
        <React.Fragment>
            <Header title="Building Overview" />

            <Row>
                <div className="card-group button-style" style={{ marginLeft: '29px' }}>
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="Total Consumption"
                                description="25,441"
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
                            <h5 className="card-title card-title-style">
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
                            <a
                                href="#"
                                // target="_blank"
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
                            <h6 className="card-subtitle custom-subtitle">Energy Totals</h6>
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
                            More Details
                        </a>
                        <h6 className="card-subtitle mb-2 text-muted">Max power draw (15 minutes period)</h6>
                        <div className="card-group mt-2">
                            {topContributors.map((item, index) => (
                                <div className="card peak-demand-container">
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
                                        <table className="table table-borderless w-auto small">
                                            {/* <thead></thead> */}
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
                            More Details
                        </a>
                        <h6 className="card-subtitle mb-2 text-muted">Average by Hour</h6>
                        <EnergyBarChart />
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={8}>
                    <div className="card-body">
                        <h6 className="card-title">Total Energy Consumption</h6>
                        <h6 className="card-subtitle mb-2 text-muted">Totaled by Hour</h6>
                        <EnergyLineChart />
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default BuildingOverview;
