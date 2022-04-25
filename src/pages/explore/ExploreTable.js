import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Input, Card, CardBody, Table, FormGroup } from 'reactstrap';
import { Line } from 'rc-progress';

const ExploreTable = () => {
    const records = [
        {
            name: 'AHU1',
            energyConsume: 1.5,
            energyPerChg: '22',
            energyPerChgStatus: 'up',
            peakPower: 0.8,
            peakPerChg: '40',
            peakPerChgStatus: 'down',
            location: 'Floor 1',
            energyPer: 50,
            peakPer: 20,
        },
        {
            name: 'AHU2',
            energyConsume: 1.5,
            energyPerChg: '22',
            energyPerChgStatus: 'up',
            peakPower: 0.8,
            peakPerChg: '40',
            peakPerChgStatus: 'down',
            location: 'Floor 1',
            energyPer: 50,
            peakPer: 20,
        },
        {
            name: 'Chiller 1',
            energyConsume: 1.5,
            energyPerChg: '22',
            energyPerChgStatus: 'up',
            peakPower: 0.8,
            peakPerChg: '40',
            peakPerChgStatus: 'down',
            location: 'Floor 1',
            energyPer: 50,
            peakPer: 20,
        },
        {
            name: 'Chiller 2',
            energyConsume: 1.5,
            energyPerChg: '22',
            energyPerChgStatus: 'up',
            peakPower: 0.8,
            peakPerChg: '40',
            peakPerChgStatus: 'down',
            location: 'Floor 1',
            energyPer: 50,
            peakPer: 20,
        },
        {
            name: 'Cooler 1',
            energyConsume: 1.5,
            energyPerChg: '22',
            energyPerChgStatus: 'up',
            peakPower: 0.8,
            peakPerChg: '40',
            peakPerChgStatus: 'down',
            location: 'Floor 1',
            energyPer: 50,
            peakPer: 20,
        },
        {
            name: 'Cooler 2',
            energyConsume: 1.5,
            energyPerChg: '22',
            energyPerChgStatus: 'up',
            peakPower: 0.8,
            peakPerChg: '40',
            peakPerChgStatus: 'down',
            location: 'Floor 1',
            energyPer: 50,
            peakPer: 20,
        },
    ];

    return (
        <>
            <Card>
                <CardBody>
                    <Table className="mb-0 bordered">
                        <thead>
                            <tr>
                                <th className="table-heading-style">Name</th>
                                <th className="table-heading-style">Energy (kWh)</th>
                                <th className="table-heading-style">% Change</th>
                                <th className="table-heading-style">Peak Power</th>
                                <th className="table-heading-style">% Change</th>
                                <th className="table-heading-style">Location</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record, index) => {
                                return (
                                    <tr key={index}>
                                        <th scope="row">
                                            <Link to="/energy/building/overview">
                                                <a className="building-name">{record.name}</a>
                                            </Link>
                                        </th>
                                        <td className="table-content-style">
                                            {record.energyConsume} kWh / sq. ft.sq. ft.
                                            <br />
                                            <div style={{ width: '50%', display: 'inline-block' }}>
                                                <Line
                                                    percent="100"
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#F0F2F5"
                                                    // strokeColor="#00FF00"
                                                    strokeLinecap="round"
                                                />
                                            </div>
                                            <div style={{ width: '50%', display: 'inline-block' }}>
                                                {record.energyPer >= 90 && (
                                                    <Line
                                                        percent={record.energyPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#D23C35"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.energyPer < 90 && record.energyPer > 75 && (
                                                    <Line
                                                        percent={record.energyPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#C64245"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.energyPer <= 75 && record.energyPer > 50 && (
                                                    <Line
                                                        percent={record.consumtnPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#B04D66"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.energyPer <= 50 && record.energyPer > 40 && (
                                                    <Line
                                                        percent={record.consumtnPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#9B5985"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.energyPer <= 40 && record.energyPer > 30 && (
                                                    <Line
                                                        percent={record.energyPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#935C91"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.energyPer <= 30 && record.energyPer > 20 && (
                                                    <Line
                                                        percent={record.energyPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#8763BF"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.energyPer <= 20 && (
                                                    <Line
                                                        percent={record.energyPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#766CCE"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {record.energyPerChgStatus === 'up' && (
                                                <button
                                                    className="button-danger text-danger font-weight-bold font-size-5"
                                                    style={{ width: '100%' }}>
                                                    <i className="uil uil-arrow-growth">
                                                        <strong>{record.energyPerChg} %</strong>
                                                    </i>
                                                </button>
                                            )}
                                            {record.energyPerChgStatus === 'down' && (
                                                <button
                                                    className="button-danger text-danger btn-font-style"
                                                    style={{ width: '100%' }}>
                                                    <i className="uil uil-chart-down">
                                                        <strong>{record.energyPerChg} %</strong>
                                                    </i>
                                                </button>
                                            )}
                                            {record.energyPerChgStatus === 'normal' && (
                                                <button
                                                    className="button text-muted btn-font-style"
                                                    style={{ width: '100%', border: 'none' }}>
                                                    <i className="uil uil-arrow-growth">
                                                        <strong>{record.energyPerChg} %</strong>
                                                    </i>
                                                </button>
                                            )}
                                        </td>
                                        <td className="table-content-style">
                                            {record.peakPower} kWh / sq. ft.sq. ft.
                                            <br />
                                            <div style={{ width: '50%', display: 'inline-block' }}>
                                                <Line
                                                    percent="100"
                                                    strokeWidth="7"
                                                    trailWidth="7"
                                                    strokeColor="#F0F2F5"
                                                    // strokeColor="#00FF00"
                                                    strokeLinecap="round"
                                                />
                                            </div>
                                            <div style={{ width: '50%', display: 'inline-block' }}>
                                                {record.peakPer >= 90 && (
                                                    <Line
                                                        percent={record.peakPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#D23C35"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.peakPer < 90 && record.peakPer > 75 && (
                                                    <Line
                                                        percent={record.peakPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#C64245"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.peakPer <= 75 && record.peakPer > 50 && (
                                                    <Line
                                                        percent={record.peakPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#B04D66"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.peakPer <= 50 && record.peakPer > 40 && (
                                                    <Line
                                                        percent={record.peakPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#9B5985"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.peakPer <= 40 && record.peakPer > 30 && (
                                                    <Line
                                                        percent={record.peakPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#935C91"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.peakPer <= 30 && record.peakPer > 20 && (
                                                    <Line
                                                        percent={record.peakPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#8763BF"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                                {record.peakPer <= 20 && (
                                                    <Line
                                                        percent={record.peakPer}
                                                        strokeWidth="7"
                                                        trailWidth="7"
                                                        strokeColor="#766CCE"
                                                        strokeLinecap="square"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            {record.hvacPerChgStatus === 'up' && (
                                                <button
                                                    className="button-danger text-danger btn-font-style"
                                                    style={{ width: '100%' }}>
                                                    <i className="uil uil-arrow-growth">
                                                        <strong>{record.energyPerChg} %</strong>
                                                    </i>
                                                </button>
                                            )}
                                            {record.hvacPerChgStatus === 'down' && (
                                                <button
                                                    className="button-success text-success btn-font-style"
                                                    style={{ width: '100%' }}>
                                                    <i className="uil uil-chart-down">
                                                        <strong>{record.energyPerChg} %</strong>
                                                    </i>
                                                </button>
                                            )}
                                            {record.hvacPerChgStatus === 'normal' && (
                                                <button
                                                    className="button text-muted btn-font-style"
                                                    style={{ width: '100%', border: 'none' }}>
                                                    <i className="uil uil-arrow-growth">
                                                        <strong>{record.energyPerChg} %</strong>
                                                    </i>
                                                </button>
                                            )}
                                        </td>
                                        <td className="">{record.location}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </Table>
                </CardBody>
            </Card>
        </>
    );
};

export default ExploreTable;
