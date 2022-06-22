import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Input, Card, CardBody, Table, FormGroup } from 'reactstrap';
import { percentageHandler, dateFormatHandler } from '../../utils/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp } from '@fortawesome/pro-regular-svg-icons';
import { faArrowTrendDown } from '@fortawesome/pro-regular-svg-icons';
import { Line } from 'rc-progress';

const ExploreTable = ({
    exploreTableData,
    activeExploreOpt,
    childFilter,
    setChildFilter,
    parentFilter,
    setParentFilter,
}) => {
    useEffect(() => {
        console.log('exploreTableData => ', exploreTableData);
    });

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
                            {!(exploreTableData.length === 0) &&
                                exploreTableData.map((record, index) => {
                                    if (record.eq_name === null) {
                                        return;
                                    }
                                    return (
                                        <tr key={index}>
                                            {!(parentFilter === 'no-grouping') &&
                                                (childFilter.parent === 'equipment_type' ? (
                                                    <th scope="row">
                                                        <a
                                                            className="building-name"
                                                            onClick={() => {
                                                                setChildFilter({
                                                                    eq_id: record.eq_id,
                                                                    eq_name: record.eq_name,
                                                                    parent: childFilter.parent,
                                                                });
                                                            }}>
                                                            {record.eq_name}
                                                        </a>
                                                    </th>
                                                ) : (
                                                    <th scope="row">
                                                        <a
                                                            className="building-name"
                                                            onClick={() => {
                                                                setChildFilter({
                                                                    eq_id: record.eq_id,
                                                                    eq_name: record.eq_name,
                                                                    parent: parentFilter,
                                                                });
                                                            }}>
                                                            {record.eq_name}
                                                        </a>
                                                    </th>
                                                ))}

                                            {parentFilter === 'no-grouping' && (
                                                <th scope="row">
                                                    <a className="building-name" onClick={() => {}}>
                                                        {record.eq_name}
                                                    </a>
                                                </th>
                                            )}

                                            <td className="table-content-style">
                                                {(record.energy / 1000).toFixed(2)} kWh / sq. ft.sq. ft.
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
                                            </td>
                                            <td>
                                                {record.energy_consumption.now <= record.energy_consumption.old && (
                                                    <button
                                                        className="button-success text-success btn-font-style"
                                                        style={{ width: '100px' }}>
                                                        <FontAwesomeIcon
                                                            icon={faArrowTrendDown}
                                                            size="md"
                                                            color="#43d39e"
                                                            className="mr-1"
                                                        />
                                                        <strong>
                                                            {percentageHandler(
                                                                record.energy_consumption.now,
                                                                record.energy_consumption.old
                                                            )}{' '}
                                                            %
                                                        </strong>
                                                        <FontAwesomeIcon
                                                            icon={faArrowTrendDown}
                                                            size="md"
                                                            color="#43d39e"
                                                            className="mr-1"
                                                        />
                                                    </button>
                                                )}
                                                {record.energy_consumption.now > record.energy_consumption.old && (
                                                    <button
                                                        className="button-danger text-danger btn-font-style"
                                                        style={{ width: '100px' }}>
                                                        <FontAwesomeIcon
                                                            icon={faArrowTrendUp}
                                                            size="md"
                                                            color="#ff5c75"
                                                            className="mr-1"
                                                        />
                                                        <strong>
                                                            {percentageHandler(
                                                                record.energy_consumption.now,
                                                                record.energy_consumption.old
                                                            )}{' '}
                                                            %
                                                        </strong>
                                                    </button>
                                                )}
                                            </td>
                                            <td className="table-content-style">
                                                {record.peak.toFixed(2)} kWh / sq. ft.sq. ft.
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
                                            </td>
                                            <td>
                                                {record.peak_consumption.now <= record.peak_consumption.old && (
                                                    <button
                                                        className="button-success text-success btn-font-style"
                                                        style={{ width: '100px' }}>
                                                        <FontAwesomeIcon
                                                            icon={faArrowTrendDown}
                                                            size="md"
                                                            color="#43d39e"
                                                            className="mr-1"
                                                        />
                                                        <strong>
                                                            {percentageHandler(
                                                                record.peak_consumption.now,
                                                                record.peak_consumptionn.old
                                                            )}{' '}
                                                            %
                                                        </strong>
                                                    </button>
                                                )}
                                                {record.peak_consumption.now > record.peak_consumption.old && (
                                                    <button
                                                        className="button-danger text-danger btn-font-style"
                                                        style={{ width: '100px' }}>
                                                        <FontAwesomeIcon
                                                            icon={faArrowTrendUp}
                                                            size="md"
                                                            color="#ff5c75"
                                                            className="mr-1"
                                                        />
                                                        <strong>
                                                            {percentageHandler(
                                                                record.peak_consumption.now,
                                                                record.peak_consumption.old
                                                            )}{' '}
                                                            %
                                                        </strong>
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
