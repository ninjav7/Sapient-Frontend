import React from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import './style.css';

const BuildingTable = () => {
    const records = [
        {
            date: 'Jan 2021',
            kwh: null,
            rate: null,
            avg_rate: null,
        },
        {
            date: 'Dec 2021',
            kwh: 10142,
            rate: 1369,
            avg_rate: 0.6,
        },
        {
            date: 'Nov 2021',
            kwh: 10142,
            rate: 1369,
            avg_rate: 0.6,
        },
        {
            date: 'Oct 2021',
            kwh: null,
            rate: null,
            avg_rate: null,
        },
        {
            date: 'Sept 2021',
            kwh: 10142,
            rate: 1369,
            avg_rate: 0.6,
        },
    ];

    return (
        <>
            <Card>
                <CardBody>
                    <Table className="mb-0 bordered table-styling table-hover">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>kWh</th>
                                <th>Blended Rate</th>
                                <th className="grey-out">Blended Rate</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record, index) => {
                                return record.kwh === null ? (
                                    <tr key={index} className="table-warning">
                                        <td className="text-warning font-weight-bold">{record.date}</td>
                                        {record.kwh === null ? (
                                            record.kwh === null && <td>-</td>
                                        ) : (
                                            <td>{record.kwh} kWh</td>
                                        )}
                                        {record.rate === null ? (
                                            record.rate === null && <td>-</td>
                                        ) : (
                                            <td>{record.rate} kWh</td>
                                        )}
                                        {record.avg_rate === null ? (
                                            record.avg_rate === null && <td>-</td>
                                        ) : (
                                            <td>{record.avg_rate} kWh</td>
                                        )}
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td className="text-primary font-weight-bold">Add</td>
                                    </tr>
                                ) : (
                                    <tr key={index}>
                                        <td className="font-weight-bold">{record.date}</td>
                                        {record.kwh === null ? (
                                            record.kwh === null && <td>-</td>
                                        ) : (
                                            <td className="font-weight-bold">
                                                {record.kwh.toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                })}
                                                kWh
                                            </td>
                                        )}
                                        {record.rate === null ? (
                                            record.rate === null && <td>-</td>
                                        ) : (
                                            <td className="font-weight-bold">
                                                {record.rate.toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                })}
                                                kWh
                                            </td>
                                        )}
                                        {record.avg_rate === null ? (
                                            record.avg_rate === null && <td className="text-muted grey-out">-</td>
                                        ) : (
                                            <td className="grey-out">{record.avg_rate} kWh</td>
                                        )}
                                        <td></td>
                                        <td></td>
                                        <td></td>
                                        <td></td>
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

const UtilityBills = () => {
    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style" style={{ marginLeft: '20px' }}>
                        Utility Bills
                    </span>
                </Col>
            </Row>

            <Row>
                <Col lg={12}>
                    <BuildingTable />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default UtilityBills;
