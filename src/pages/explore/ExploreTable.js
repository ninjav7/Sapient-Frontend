import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Input, Card, CardBody, Table, FormGroup } from 'reactstrap';
import { percentageHandler, dateFormatHandler } from '../../utils/helper';
import { Line } from 'rc-progress';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ChildFilterStore } from '../../store/ChildFilterStore';

const ExploreTable = ({
    exploreTableData,
    activeExploreOpt,
    childFilter,
    setChildFilter,
    parentFilter,
    setParentFilter,
    topEnergyConsumption,
    topPeakPower,
    equipmmentFilter,
    setEquipmentFilter,
    isExploreDataLoading,
    handleChartOpen,
}) => {
    console.log(topEnergyConsumption);
    const handleBuildingClicked = (id, name) => {
        setChildFilter({
            building_id: id,
            building_name: name,
        });
        ChildFilterStore.update((s) => {
            s.Building_id = id;
            s.Building_name = name;
        });
    };

    return (
        <>
            <Card>
                <CardBody>
                    <Table className="mb-0 bordered">
                        <thead>
                            <tr>
                                <th className="table-heading-style">
                                    <input type="checkbox" style={{ marginRight: '0.5rem' }} />
                                    Name
                                </th>
                                <th className="table-heading-style">Energy Consumption </th>
                                <th className="table-heading-style">% Change</th>
                                {/* <th className="table-heading-style">Peak Power</th> */}
                                {/* <th className="table-heading-style">% Change</th>
                                <th className="table-heading-style">Location</th> */}
                            </tr>
                        </thead>

                        {isExploreDataLoading ? (
                            <tbody>
                                <SkeletonTheme color="#202020" height={35}>
                                    <tr>
                                        <td>
                                            <Skeleton count={5} />
                                        </td>

                                        <td>
                                            <Skeleton count={5} />
                                        </td>

                                        <td>
                                            <Skeleton count={5} />
                                        </td>
                                    </tr>
                                </SkeletonTheme>
                            </tbody>
                        ) : (
                            <tbody>
                                {!(exploreTableData.length === 0) &&
                                    exploreTableData.map((record, index) => {
                                        if (record?.eq_name === null) {
                                            return;
                                        }
                                        return (
                                            <tr key={index}>
                                                {/* {!(parentFilter === 'by-building') &&
                        (childFilter.parent === 'equipment_type' ? (
                            <th scope="row">
                                <a
                                    className="building-name"
                                    onClick={() => {
                                        setChildFilter({
                                            eq_id: record?.eq_id,
                                            eq_name: record?.eq_name,
                                            parent: childFilter.parent,
                                        });
                                    }}>
                                    {record?.eq_name}
                                </a>
                            </th>
                        ) : (
                            <th scope="row">
                                <a
                                    className="building-name"
                                    onClick={() => {
                                        setChildFilter({
                                            eq_id: record?.eq_id,
                                            eq_name: record?.eq_name,
                                            parent: parentFilter,
                                        });
                                    }}>
                                    {record?.eq_name}
                                </a>
                            </th>
                        ))} */}

                                                {parentFilter === 'by-building' && (
                                                    <th scope="row">
                                                        <a
                                                            className="building-name"
                                                            onClick={(e) => {
                                                                handleBuildingClicked(
                                                                    record?.building_id,
                                                                    record?.building_name
                                                                );
                                                            }}>
                                                            {record?.building_name}
                                                        </a>
                                                    </th>
                                                )}
                                                {parentFilter === 'by-equipment' && (
                                                    <th scope="row">
                                                        <a
                                                            className="building-name"
                                                            onClick={() => {
                                                                setEquipmentFilter({
                                                                    equipments_id: record?.equipment_id,
                                                                    equipments_name: record?.equipment_name,
                                                                });
                                                                handleChartOpen();
                                                            }}>
                                                            {record?.equipment_name}
                                                        </a>
                                                    </th>
                                                )}

                                                <td className="table-content-style">
                                                    {(record?.energy_consumption.now / 1000).toFixed(5)} kWh / sq.
                                                    ft.sq. ft.
                                                    <br />
                                                    <div style={{ width: '100%', display: 'inline-block' }}>
                                                        {index === 0 && record?.energy_consumption.now === 0 && (
                                                            <Line
                                                                percent={0}
                                                                strokeWidth="3"
                                                                trailWidth="3"
                                                                strokeColor={`#D14065`}
                                                                strokeLinecap="round"
                                                            />
                                                        )}
                                                        {index === 0 && record?.energy_consumption.now > 0 && (
                                                            <Line
                                                                percent={parseFloat(
                                                                    (record?.energy_consumption.now /
                                                                        topEnergyConsumption) *
                                                                        100
                                                                ).toFixed(2)}
                                                                strokeWidth="3"
                                                                trailWidth="3"
                                                                strokeColor={`#D14065`}
                                                                strokeLinecap="round"
                                                            />
                                                        )}
                                                        {index === 1 && (
                                                            <Line
                                                                percent={parseFloat(
                                                                    (record?.energy_consumption.now /
                                                                        topEnergyConsumption) *
                                                                        100
                                                                ).toFixed(2)}
                                                                strokeWidth="3"
                                                                trailWidth="3"
                                                                strokeColor={`#DF5775`}
                                                                strokeLinecap="round"
                                                            />
                                                        )}
                                                        {index === 2 && (
                                                            <Line
                                                                percent={parseFloat(
                                                                    (record?.energy_consumption.now /
                                                                        topEnergyConsumption) *
                                                                        100
                                                                ).toFixed(2)}
                                                                strokeWidth="3"
                                                                trailWidth="3"
                                                                strokeColor={`#EB6E87`}
                                                                strokeLinecap="round"
                                                            />
                                                        )}
                                                        {index === 3 && (
                                                            <Line
                                                                percent={parseFloat(
                                                                    (record?.energy_consumption.now /
                                                                        topEnergyConsumption) *
                                                                        100
                                                                ).toFixed(2)}
                                                                strokeWidth="3"
                                                                trailWidth="3"
                                                                strokeColor={`#EB6E87`}
                                                                strokeLinecap="round"
                                                            />
                                                        )}
                                                        {index === 4 && (
                                                            <Line
                                                                percent={parseFloat(
                                                                    (record?.energy_consumption.now /
                                                                        topEnergyConsumption) *
                                                                        100
                                                                ).toFixed(2)}
                                                                strokeWidth="3"
                                                                trailWidth="3"
                                                                strokeColor={`#FC9EAC`}
                                                                strokeLinecap="round"
                                                            />
                                                        )}
                                                        {index === 5 && (
                                                            <Line
                                                                percent={parseFloat(
                                                                    (record?.energy_consumption.now /
                                                                        topEnergyConsumption) *
                                                                        100
                                                                ).toFixed(2)}
                                                                strokeWidth="3"
                                                                trailWidth="3"
                                                                strokeColor={`#FFCFD6`}
                                                                strokeLinecap="round"
                                                            />
                                                        )}
                                                    </div>
                                                    {/* <br />
                        <div style={{ width: '50%', display: 'inline-block' }}>
                            <Line
                                percent={}
                                strokeWidth="7"
                                trailWidth="7"
                                strokeColor="#F0F2F5"
                                //strokeColor="#00FF00"
                                strokeLinecap="round"
                            />
                        </div> */}
                                                </td>
                                                <td>
                                                    {record?.energy_consumption.now <=
                                                        record?.energy_consumption.old && (
                                                        <button
                                                            className="button-success text-success btn-font-style"
                                                            style={{ width: 'auto' }}>
                                                            <i className="uil uil-chart-down">
                                                                <strong>
                                                                    {percentageHandler(
                                                                        record?.energy_consumption.now,
                                                                        record?.energy_consumption.old
                                                                    )}
                                                                    %
                                                                </strong>
                                                            </i>
                                                        </button>

                                                        // <button
                                                        //     className="button-success text-success btn-font-style"
                                                        //     style={{ width: '100px' }}>
                                                        //     <i className="uil uil-chart-down">
                                                        //         <strong>
                                                        //             {percentageHandler(
                                                        //                 record?.energy_consumption.now,
                                                        //                 record?.energy_consumption.old
                                                        //             )}{' '}
                                                        //             %
                                                        //         </strong>
                                                        //     </i>
                                                        // </button>
                                                    )}
                                                    {record?.energy_consumption.now >
                                                        record?.energy_consumption.old && (
                                                        <button
                                                            className="button-danger text-danger btn-font-style"
                                                            style={{ width: 'auto', marginBottom: '4px' }}>
                                                            <i className="uil uil-arrow-growth">
                                                                <strong>
                                                                    {percentageHandler(
                                                                        record?.energy_consumption.now,
                                                                        record?.energy_consumption.old
                                                                    )}
                                                                    %
                                                                </strong>
                                                            </i>
                                                        </button>
                                                        // <button
                                                        //     className="button-danger text-danger btn-font-style"
                                                        //     style={{ width: '100px' }}>
                                                        //     <i className="uil uil-arrow-growth">
                                                        //         <strong>
                                                        //             {percentageHandler(
                                                        //                 record?.energy_consumption.now,
                                                        //                 record?.energy_consumption.old
                                                        //             )}{' '}
                                                        //             %
                                                        //         </strong>
                                                        //     </i>
                                                        // </button>
                                                    )}
                                                </td>
                                                {/* <td className="table-content-style">
                        {record?.peak_power.now.toFixed(2)} kWh / sq. ft.sq. ft.
                        <br />
                    <div style={{ width: '100%', display: 'inline-block' }}>
                        {index === 0 && record?.peak_power.now === 0 && (
                            <Line
                                percent={0}
                                strokeWidth="3"
                                trailWidth="3"
                                strokeColor={`#D14065`}
                                strokeLinecap="round"
                            />
                        )}
                        {index === 0 && record?.peak_power.now > 0 && (
                            <Line
                                percent={parseFloat(
                                    (record?.peak_power.now / topPeakPower) * 100
                                ).toFixed(2)}
                                strokeWidth="3"
                                trailWidth="3"
                                strokeColor={`#D14065`}
                                strokeLinecap="round"
                            />
                        )}
                        {index === 1 && (
                            <Line
                                percent={parseFloat(
                                    (record?.peak_power.now / topPeakPower) * 100
                                ).toFixed(2)}
                                strokeWidth="3"
                                trailWidth="3"
                                strokeColor={`#DF5775`}
                                strokeLinecap="round"
                            />
                        )}
                        {index === 2 && (
                            <Line
                                percent={parseFloat(
                                    (record?.peak_power.now / topPeakPower) * 100
                                ).toFixed(2)}
                                strokeWidth="3"
                                trailWidth="3"
                                strokeColor={`#EB6E87`}
                                strokeLinecap="round"
                            />
                        )}
                        {index === 3 && (
                            <Line
                                percent={parseFloat(
                                    (record?.peak_power.now /topPeakPower) * 100
                                ).toFixed(2)}
                                strokeWidth="3"
                                trailWidth="3"
                                strokeColor={`#EB6E87`}
                                strokeLinecap="round"
                            />
                        )}
                        {index === 4 && (
                            <Line
                                percent={parseFloat(
                                    (record?.peak_power.now / topPeakPower) * 100
                                ).toFixed(2)}
                                strokeWidth="3"
                                trailWidth="3"
                                strokeColor={`#FC9EAC`}
                                strokeLinecap="round"
                            />
                        )}
                        {index === 5 && (
                            <Line
                                percent={parseFloat(
                                    (record?.peak_power.now /topPeakPower) * 100
                                ).toFixed(2)}
                                strokeWidth="3"
                                trailWidth="3"
                                strokeColor={`#FFCFD6`}
                                strokeLinecap="round"
                            />
                        )}
                    </div>
                    </td> */}
                                                {/* <td>
                        {record?.peak_power.now <= record?.peak_power.old && (
                            <button
                                className="button-success text-success btn-font-style"
                                style={{ width: '100px' }}>
                                <i className="uil uil-chart-down">
                                    <strong>
                                        {percentageHandler(
                                            record?.peak_power.now,
                                            record?.peak_power.old
                                        )}{' '}
                                        %
                                    </strong>
                                </i>
                            </button>
                        )}
                        {record?.peak_power.now > record?.peak_power.old && (
                            <button
                                className="button-danger text-danger btn-font-style"
                                style={{ width: '100px' }}>
                                <i className="uil uil-arrow-growth">
                                    <strong>
                                        {percentageHandler(
                                            record?.peak_power.now,
                                            record?.peak_power.old
                                        )}{' '}
                                        %
                                    </strong>
                                </i>
                            </button>
                        )}
                    </td> */}
                                                {/* <td className="">{record?.location}</td> */}
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        )}
                    </Table>
                </CardBody>
            </Card>
        </>
    );
};

export default ExploreTable;
