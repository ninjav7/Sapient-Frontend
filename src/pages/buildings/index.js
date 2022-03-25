import React, { useState } from 'react';
import { Row, Col } from 'reactstrap';
import PageTitle from '../../components/PageTitle';
import './style.css';
import EnergyLineChart from './EnergyLineChart';
import EnergyBarChart from './EnergyBarChart';
import EnergyDonutChart from './EnergyDonutChart';

const BuildingOverview = () => {
    const [energyConsumption, setEnergyConsumption] = useState([
        {
            equipment: 'AHU 1',
            power: 25.3,
            change: 22,
        },
        {
            equipment: 'AHU 2',
            power: 21.3,
            change: 3,
        },
        {
            equipment: 'RTU 1',
            power: 2.3,
            change: 6,
        },
        {
            equipment: 'Front RTU',
            power: 25.3,
            change: 2,
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
            <Row className="page-title">
                <Col>
                    <PageTitle
                        breadCrumbItems={[
                            { label: 'Charts', path: '/charts' },
                            { label: 'Energy', path: '/building', active: true },
                        ]}
                        title={'Building Overview'}
                    />
                </Col>
            </Row>

            <Row>
                <Col md={6}>
                    <div className="card-group">
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5 className="card-title card-title-style">Total Consumption</h5>
                                <p className="card-text card-content-style">
                                    25441 <span className="card-unit-style">&nbsp;&nbsp;kWh</span>
                                </p>
                            </div>
                        </div>
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5 className="card-title card-title-style">Portfolio Rank</h5>
                                <p className="card-text card-content-style">
                                    1 <span className="card-unit-style">&nbsp;&nbsp;of 40</span>
                                </p>
                            </div>
                        </div>
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5 className="card-title card-title-style">Energy Density</h5>
                                <p className="card-text card-content-style">
                                    1.3 <span className="card-unit-style">&nbsp;&nbsp;kWh/sq.ft.</span>
                                </p>
                            </div>
                        </div>
                        <div className="card card-box-style">
                            <div className="card-body">
                                <h5 className="card-title card-title-style">12 Mo. Electric EUI</h5>
                                <p className="card-text card-content-style">
                                    67 <span className="card-unit-style">&nbsp;&nbsp;kBtu/ft/yr</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col xl={8}>
                    <div className="card-body">
                        <h6 className="card-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                            Energy Consumption by End Use
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
                        <h6 className="card-subtitle mb-2 text-muted">Energy Totals</h6>
                        <EnergyDonutChart />
                    </div>
                </Col>

                <Col xl={4}>
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
                                <div className="card" style={{ margin: '1rem', border: '0.5px solid #a9aaaf' }}>
                                    <div className="card-body">
                                        <h6 className="card-title text-muted">
                                            {item.date} & {item.time}
                                        </h6>
                                        <h5 className="card-title">{item.power} kW</h5>
                                        <p className="card-text" style={{ fontWeight: 'bold', paddingTop: '10px' }}>
                                            Top Contributor
                                        </p>
                                        <table className="table table-borderless w-auto small">
                                            {/* <thead></thead> */}
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        <tr>
                                                            <div>AHU 1</div>
                                                        </tr>
                                                        <tr>
                                                            <div>AHU 2</div>
                                                        </tr>
                                                        <tr>
                                                            <div>Compressor 1</div>
                                                        </tr>
                                                    </td>
                                                    <td>
                                                        <tr>
                                                            <div>{item.contributor.ahu1} kW</div>
                                                        </tr>
                                                        <tr>
                                                            <div>{item.contributor.ahu2} kW</div>
                                                        </tr>
                                                        <tr>
                                                            <div>{item.contributor.compressor} kW</div>
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
                    <div className="card text-dark bg-light">
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
                                            {energyConsumption.map((item, index) => (
                                                <tr key={index}>
                                                    <td>
                                                        <div>
                                                            <div>{item.equipment}</div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div>{item.power} kW</div>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <div>
                                                            <div>{item.change} %</div>
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
