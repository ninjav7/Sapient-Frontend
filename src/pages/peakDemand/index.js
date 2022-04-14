import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import { BaseUrl, builidingPeak } from '../../services/Network';
import DetailedButton from '../buildings/DetailedButton';
import LineAnnotationChart from '../charts/LineAnnotationChart';
import exploreBuildingPeak from './ExploreBuildingPeak';

const BuildingPeakButton = (props) => {
    // peaks api call

    return (
        <>
            <h5 className="card-title card-title-style">{props.title}&nbsp;&nbsp;</h5>
            <p className="card-text card-content-style">
                {props.description}
                <span className="card-unit-style">
                    &nbsp;&nbsp;{props.unit}&nbsp;&nbsp;&nbsp;
                    {props.consumptionNormal && (
                        <button
                            className="button-success text-success font-weight-bold font-size-5"
                            style={{ width: '100%' }}>
                            <i className="uil uil-arrow-growth">
                                <strong>{props.value} %</strong>
                            </i>
                        </button>
                    )}
                    {!props.consumptionNormal && (
                        <button
                            className="button-danger text-danger font-weight-bold font-size-5"
                            style={{ width: '100%' }}>
                            <i className="uil uil-chart-down">
                                <strong>{props.value} %</strong>
                            </i>
                        </button>
                    )}
                </span>
            </p>
        </>
    );
};

const Peaks = ({ energyConsumption, title, subtitle }) => {
    return (
        <Card>
            <CardBody className="pb-0 pt-2">
                <h6 className="card-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                    {title}
                </h6>
                <Link to="/energy/building-peak-explore">
                    <div className="float-right ml-2">
                        <button type="button" className="btn btn-sm btn-outline-primary font-weight-bold">
                            <i className="uil uil-pen mr-1"></i>Explore
                        </button>
                    </div>
                </Link>
                <h6 className="card-subtitle mb-2 text-muted">{subtitle}</h6>
                <Table className="mb-0" borderless hover>
                    <thead>
                        <tr>
                            <th scope="col">Equipment</th>
                            <th scope="col">Power</th>
                            <th scope="col">Change from Previous Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {energyConsumption.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td className="custom-equip-style" style={{ color: '#2955e7' }}>
                                        {record.equipName}
                                    </td>
                                    <td className="custom-usage-style muted">{record.usage}</td>
                                    <td>
                                        <button
                                            className="button-danger text-danger font-weight-bold font-size-5"
                                            style={{ width: 'auto' }}>
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
    );
};

const PeakDemand = () => {
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

    const [topEnergyConsumption, setTopEnergyConsumption] = useState([
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

    const [energyConsumption, setEnergyConsumption] = useState([
        {
            equipName: 'AHUs',
            usage: '25.3 kW',
            percentage: 25,
        },
        {
            equipName: 'CRACs',
            usage: '21.3 kW',
            percentage: 8,
        },
        {
            equipName: 'Refrigerators',
            usage: '5.3 kW',
            percentage: 6,
        },
        {
            equipName: 'Desktop PCs',
            usage: '2.3 kW',
            percentage: 2,
        },
        {
            equipName: 'Laptop PCs',
            usage: '1.2 kW',
            percentage: 1,
        },
        {
            equipName: 'Space Heaters',
            usage: '0.2 kW',
            percentage: 2,
        },
    ]);

    const [singleEquipPeak, setSingleEquipPeak] = useState([
        {
            equipName: 'AHU 1',
            usage: '25.3 kW',
            percentage: 25,
        },
        {
            equipName: 'AHU 2',
            usage: '21.3 kW',
            percentage: 8,
        },
        {
            equipName: 'RTU 1',
            usage: '5.3 kW',
            percentage: 6,
        },
        {
            equipName: 'Front RTU',
            usage: '2.3 kW',
            percentage: 2,
        },
        {
            equipName: 'Chiller',
            usage: '1.2 kW',
            percentage: 1,
        },
        {
            equipName: 'Chiller',
            usage: '0.2 kW',
            percentage: 2,
        },
    ]);

    return (
        <React.Fragment>
            <Header title="Peak Demand" />

            <Row>
                <div className="card-group button-style" style={{ marginLeft: '29px' }}>
                    <div className="card card-box-style button-style">
                        <div className="card-body peak-card-box-style">
                            <h5 className="card-title card-title-style">Current 12 Mo. Peak&nbsp;&nbsp;</h5>
                            <p className="card-text card-content-style">
                                261
                                <span className="card-unit-style">
                                    &nbsp;&nbsp;kW&nbsp;&nbsp;&nbsp;
                                    <button
                                        className="button-success text-success font-weight-bold font-size-5"
                                        style={{ width: '100%' }}>
                                        <i className="uil uil-chart-down">
                                            <strong>5 %</strong>
                                        </i>
                                    </button>
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="card card-box-style button-style">
                        <div className="card-body" style={{ marginTop: '4px' }}>
                            <h5 className="card-title card-title-style">July 9, 4:30 PM&nbsp;&nbsp;</h5>
                            <p className="card-text bold">4:30 PM</p>
                        </div>
                    </div>
                </div>
            </Row>

            <Row style={{ marginLeft: '0.5px' }}>
                <div className="card-body">
                    <h6 className="card-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                        Top 5 Building Peaks
                    </h6>

                    <Row>
                        <div className="card-group button-style" style={{ marginLeft: '10px' }}>
                            <div className="card card-box-style button-style">
                                <div className="card-body">
                                    <BuildingPeakButton
                                        title="March 3rd @ 3:20 PM"
                                        description="225.3"
                                        unit="kW"
                                        value="12"
                                        consumptionNormal={true}
                                    />
                                </div>
                            </div>
                            <div className="card card-box-style button-style">
                                <div className="card-body">
                                    <BuildingPeakButton
                                        title="March 1st @ 3:50 PM"
                                        description="221.3"
                                        unit="kW"
                                        value="8"
                                        consumptionNormal={false}
                                    />
                                </div>
                            </div>
                            <div className="card card-box-style button-style">
                                <div className="card-body">
                                    <BuildingPeakButton
                                        title="April 12th @ 3:20 PM"
                                        description="202.3"
                                        unit="kW"
                                        value="1"
                                        consumptionNormal={true}
                                    />
                                </div>
                            </div>
                            <div className="card card-box-style button-style">
                                <div className="card-body">
                                    <BuildingPeakButton
                                        title="April 12th @ 3:20 PM"
                                        description="202.3"
                                        unit="kW"
                                        value="1"
                                        consumptionNormal={false}
                                    />
                                </div>
                            </div>
                            <div className="card card-box-style button-style">
                                <div className="card-body">
                                    <BuildingPeakButton
                                        title="Jan 2nd @ 4:20 PM"
                                        description="125.3"
                                        unit="kW"
                                        value="2"
                                        consumptionNormal={false}
                                    />
                                </div>
                            </div>
                        </div>
                    </Row>

                    <Row className="mt-4" style={{}}>
                        <Col xl={6}>
                            <Peaks
                                energyConsumption={energyConsumption}
                                title="Equipment Type Peaks"
                                subtitle="At building peak time"
                            />
                        </Col>
                        <Col xl={6}>
                            <Peaks
                                energyConsumption={singleEquipPeak}
                                title="Individual Equipment Peaks"
                                subtitle="At building peak time"
                            />
                        </Col>
                    </Row>
                </div>
            </Row>

            <Row>
                <Col xl={12}>
                    <Card>
                        <CardBody className="pt-2 pb-3">
                            <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                                Building 15-Minute Demand Peaks Trend
                            </h6>
                            <Button
                                className="button-success text-success font-weight-bold font-size-5 float-right"
                                size={'sm'}
                                color="primary"
                                style={{ width: 'auto' }}>
                                <i className="uil uil-chart-down">
                                    <strong>5 %</strong>
                                </i>
                            </Button>
                            <h6 className="card-subtitle mb-2 text-muted">Max power draw (15 minute period)</h6>
                            <LineAnnotationChart title="" height={350} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default PeakDemand;
