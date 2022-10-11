import React, { useEffect, useState, useMemo } from 'react';
import Header from '../../components/Header';
import { Link } from 'react-router-dom';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import { MultiSelect } from 'react-multi-select-component';
import { Search } from 'react-feather';
import { Line } from 'rc-progress';
import { ComponentStore } from '../../store/ComponentStore';
//import { faHome } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BaseUrl, compareBuildings } from '../../services/Network';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { percentageHandler } from '../../utils/helper';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { faAngleDown, faAngleUp } from '@fortawesome/pro-solid-svg-icons';
import './style.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { timeZone } from '../../utils/helper';

const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);
    // console.log(items);
    // console.log(config);
    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

const BuildingTable = ({ buildingsData, selectedOptions, buildingDataWithFilter, isBuildingDataFetched }) => {
    const [topEnergyDensity, setTopEnergyDensity] = useState(1);
    const [topHVACConsumption, setTopHVACConsumption] = useState(1);
    const [nameOrder, setNameOrder] = useState(false);
    const [densityOrder, setDensityOrder] = useState(false);
    const [totalOrder, setTotalOrder] = useState(false);
    const [squareFtOrder, setSquareFtOrder] = useState(false);
    // const { items, requestSort, sortConfig } = useSortableData(buildingsData);
    // const getClassNamesFor = (name) => {
    //     if (!sortConfig) {
    //         return;
    //     }
    //     return sortConfig.key === name ? sortConfig.direction : undefined;
    // };
    const columns = [
        {
            dataField: 'building_name',
            text: 'Name',
            sort: true,
            style: { color: 'blue' },
        },
        {
            dataField: 'energy_density',
            text: 'Energy Density',
            sort: true,
        },
        {
            dataField: 'energy_per',
            text: '% Change',
            sort: true,
        },
        {
            dataField: 'hvac_consumption',
            text: 'HVAC Consumption',
            sort: true,
        },
        {
            dataField: 'hvac_per',
            text: '% Change',
            sort: true,
        },
        {
            dataField: 'total_consumption',
            text: 'Total Consumption',
            sort: true,
        },
        {
            dataField: 'total_per',
            text: '% Change',
            sort: true,
        },
        {
            dataField: 'sq_ft',
            text: 'Sq. Ft.',
            sort: true,
        },
        {
            dataField: 'buildingAccess',
            text: 'Monitored Load',
            sort: true,
        },
    ];

    const handleColumnSort = (order, columnName) => {
        if (columnName === 'building_name') {
            setDensityOrder(false);
            setTotalOrder(false);
            setSquareFtOrder(false);
        }
        if (columnName === 'energy_density') {
            setNameOrder(false);
            setTotalOrder(false);
            setSquareFtOrder(false);
        }
        if (columnName === 'total_consumption') {
            setDensityOrder(false);
            setNameOrder(false);
            setSquareFtOrder(false);
        }
        if (columnName === 'square_footage') {
            setDensityOrder(false);
            setTotalOrder(false);
            setNameOrder(false);
        }

        buildingDataWithFilter(order, columnName);
    };

    useEffect(() => {
        if (!buildingsData.length > 0) {
            return;
        }
        let topVal = buildingsData[0].energy_density;
        setTopEnergyDensity(topVal);
        let hvacVal = buildingsData[0].hvac_consumption.now;
        setTopHVACConsumption(hvacVal);
    }, [buildingsData]);

    return (
        <Card>
            <CardBody>
                {/* <BootstrapTable keyField='id' data={ userData } columns={ columns } bordered={ false } sort={ { dataField: 'name', order: 'asc' } } /> */}
                <Table className="mb-0 bordered">
                    <thead>
                        <tr className="mouse-pointer">
                            {selectedOptions.some((record) => record.value === 'name') && (
                                <th className="table-heading-style" onClick={() => setNameOrder(!nameOrder)}>
                                    <div className="active-device-flex">
                                        <div
                                            style={{
                                                border: 'none',
                                                backgroundColor: 'white',
                                                fontWeight: 'bolder',
                                                fontSize: '16px',
                                            }}>
                                            Name
                                        </div>
                                        {nameOrder ? (
                                            <div
                                                className="ml-2"
                                                onClick={() => handleColumnSort("ace", 'building_name')}>
                                                <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                            </div>
                                        ) : (
                                            <div
                                                className="ml-2"
                                                onClick={() => handleColumnSort("dce", 'building_name')}>
                                                <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            )}
                            {selectedOptions.some((record) => record.value === 'density') && (
                                <th className="table-heading-style" onClick={() => setDensityOrder(!densityOrder)}>
                                    <div className="active-device-flex">
                                        <div
                                            style={{
                                                border: 'none',
                                                backgroundColor: 'white',
                                                fontWeight: 'bolder',
                                                fontSize: '16px',
                                            }}>
                                            Energy Density{' '}
                                        </div>
                                        {densityOrder ? (
                                            <div
                                                className="ml-2"
                                                onClick={() => handleColumnSort("ace", 'energy_density')}>
                                                <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                            </div>
                                        ) : (
                                            <div
                                                className="ml-2"
                                                onClick={() => handleColumnSort("dce", 'energy_density')}>
                                                <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            )}
                            {selectedOptions.some((record) => record.value === 'per_change') && (
                                <th className="table-heading-style">
                                    <button
                                        type="button"
                                        // onClick={() => requestSort('change')}
                                        // className={getClassNamesFor('change')}
                                        style={{
                                            border: 'none',
                                            backgroundColor: 'white',
                                            fontWeight: 'bolder',
                                            fontSize: '16px',
                                        }}>
                                        % Change
                                    </button>
                                </th>
                            )}
                            {selectedOptions.some((record) => record.value === 'hvac') && (
                                <th className="table-heading-style">
                                    <button
                                        type="button"
                                        // onClick={() => requestSort('hvac_consumption')}
                                        // className={getClassNamesFor('hvac_consumption')}
                                        style={{
                                            border: 'none',
                                            backgroundColor: 'white',
                                            fontWeight: 'bolder',
                                            fontSize: '16px',
                                        }}>
                                        HVAC Consumption
                                    </button>
                                </th>
                            )}
                            {selectedOptions.some((record) => record.value === 'hvac_per') && (
                                <th className="table-heading-style">
                                    <button
                                        type="button"
                                        // onClick={() => requestSort('hvac_per')}
                                        // className={getClassNamesFor('hvac_per')}
                                        style={{
                                            border: 'none',
                                            backgroundColor: 'white',
                                            fontWeight: 'bolder',
                                            fontSize: '16px',
                                        }}>
                                        % Change
                                    </button>
                                </th>
                            )}
                            {selectedOptions.some((record) => record.value === 'total') && (
                                <th className="table-heading-style" onClick={() => setTotalOrder(!totalOrder)}>
                                    <div className="active-device-flex">
                                        <div
                                            style={{
                                                border: 'none',
                                                backgroundColor: 'white',
                                                fontWeight: 'bolder',
                                                fontSize: '16px',
                                            }}>
                                            Total Consumption{' '}
                                        </div>
                                        {totalOrder ? (
                                            <div
                                                className="ml-2"
                                                onClick={() => handleColumnSort("ace", 'total_consumption')}>
                                                <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                            </div>
                                        ) : (
                                            <div
                                                className="ml-2"
                                                onClick={() => handleColumnSort("dce", 'total_consumption')}>
                                                <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            )}
                            {selectedOptions.some((record) => record.value === 'total_per') && (
                                <th className="table-heading-style">
                                    <button
                                        type="button"
                                        // onClick={() => requestSort('total_per')}
                                        // className={getClassNamesFor('total_per')}
                                        style={{
                                            border: 'none',
                                            backgroundColor: 'white',
                                            fontWeight: 'bolder',
                                            fontSize: '16px',
                                        }}>
                                        % Change
                                    </button>
                                </th>
                            )}
                            {selectedOptions.some((record) => record.value === 'sq_ft') && (
                                <th className="table-heading-style" onClick={() => setSquareFtOrder(!squareFtOrder)}>
                                    <div className="active-device-flex">
                                        <div
                                            style={{
                                                border: 'none',
                                                backgroundColor: 'white',
                                                fontWeight: 'bolder',
                                                fontSize: '16px',
                                            }}>
                                            Sq. Ft.{' '}
                                        </div>
                                        {squareFtOrder ? (
                                            <div
                                                className="ml-2"
                                                onClick={() => handleColumnSort("ace", 'square_footage')}>
                                                <FontAwesomeIcon icon={faAngleUp} color="grey" size="md" />
                                            </div>
                                        ) : (
                                            <div
                                                className="ml-2"
                                                onClick={() => handleColumnSort("dce", 'square_footage')}>
                                                <FontAwesomeIcon icon={faAngleDown} color="grey" size="md" />
                                            </div>
                                        )}
                                    </div>
                                </th>
                            )}
                            {/* {selectedOptions.some((record) => record.value === 'load') && (
                                <th className="table-heading-style">
                                    <button
                                        type="button"
                                        // onClick={() => requestSort('')}
                                        // className={getClassNamesFor('')}
                                        style={{
                                            border: 'none',
                                            backgroundColor: 'white',
                                            fontWeight: 'bolder',
                                            fontSize: '16px',
                                        }}>
                                        Monitored Load
                                    </button>
                                </th>
                            )} */}
                        </tr>
                    </thead>
                    {isBuildingDataFetched ? (
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

                                    <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td>
                                    {/* <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td>

                                    <td>
                                        <Skeleton count={5} />
                                    </td> */}
                                </tr>
                            </SkeletonTheme>
                        </tbody>
                    ) : (
                        <tbody>
                            {buildingsData.map((record, index) => {
                                return (
                                    <tr key={record.building_id} className="mouse-pointer">
                                        {selectedOptions.some((record) => record.value === 'name') && (
                                            <th scope="row">
                                                <Link
                                                    to={{
                                                        pathname: `/energy/building/overview/${record.building_id}`,
                                                    }}>
                                                    <a className="building-name">{record.building_name}</a>
                                                </Link>
                                                <span className="badge badge-soft-secondary mr-2">Office</span>
                                            </th>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'density') && (
                                            <td className="table-content-style">
                                                {parseFloat((record.energy_density)/1000).toFixed(2)} kWh / sq. ft.sq. ft.
                                                <br />
                                                <div style={{ width: '100%', display: 'inline-block' }}>
                                                    {index === 0 && record.energy_density === 0 && (
                                                        <Line
                                                            percent={0}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#D14065`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 0 && record.energy_density > 0 && (
                                                        <Line
                                                            percent={parseFloat(
                                                                (record.energy_density / topEnergyDensity) * 100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#D14065`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 1 && (
                                                        <Line
                                                            percent={parseFloat(
                                                                (record.energy_density / topEnergyDensity) * 100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#DF5775`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 2 && (
                                                        <Line
                                                            percent={parseFloat(
                                                                (record.energy_density / topEnergyDensity) * 100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#EB6E87`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 3 && (
                                                        <Line
                                                            percent={parseFloat(
                                                                (record.energy_density / topEnergyDensity) * 100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#EB6E87`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 4 && (
                                                        <Line
                                                            percent={parseFloat(
                                                                (record.energy_density / topEnergyDensity) * 100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#FC9EAC`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 5 && (
                                                        <Line
                                                            percent={parseFloat(
                                                                (record.energy_density / topEnergyDensity) * 100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#FFCFD6`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'per_change') && (
                                            <td>
                                                {record.energy_consumption.now >= record.energy_consumption.old ? (
                                                    <button
                                                        className="button-danger text-danger btn-font-style"
                                                        style={{ width: 'auto', marginBottom: '4px' }}>
                                                        <i className="uil uil-arrow-growth">
                                                            <strong>
                                                                {percentageHandler(
                                                                    record.energy_consumption.now,
                                                                    record.energy_consumption.old
                                                                )}
                                                                %
                                                            </strong>
                                                        </i>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="button-success text-success btn-font-style"
                                                        style={{ width: 'auto' }}>
                                                        <i className="uil uil-chart-down">
                                                            <strong>
                                                                {percentageHandler(
                                                                    record.energy_consumption.now,
                                                                    record.energy_consumption.old
                                                                )}
                                                                %
                                                            </strong>
                                                        </i>
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'hvac') && (
                                            <td className="table-content-style">
                                                {parseFloat(record.hvac_consumption.now).toFixed(0)} kWh / sq. ft.sq.
                                                ft.
                                                <br />
                                                <div style={{ width: '100%', display: 'inline-block' }}>
                                                    {/* <Line
                                                percent={percentageHandler(
                                                    record.hvac_consumption.now,
                                                    record.hvac_consumption.old
                                                )}
                                                strokeWidth="4"
                                                trailWidth="4"
                                                strokeColor="#C64245"
                                                strokeLinecap="round"
                                            /> */}
                                                    {index === 0 && record.hvac_consumption.now === 0 && (
                                                        <Line
                                                            percent={0}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#D14065`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 0 && record.hvac_consumption.now > 0 && (
                                                        <Line
                                                            percent={(
                                                                (record.hvac_consumption.now / topHVACConsumption) *
                                                                100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#D14065`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 1 && (
                                                        <Line
                                                            percent={(
                                                                (record.hvac_consumption.now / topHVACConsumption) *
                                                                100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#DF5775`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 2 && (
                                                        <Line
                                                            percent={(
                                                                (record.hvac_consumption.now / topHVACConsumption) *
                                                                100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#EB6E87`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 3 && (
                                                        <Line
                                                            percent={(
                                                                (record.hvac_consumption.now / topHVACConsumption) *
                                                                100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#EB6E87`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 4 && (
                                                        <Line
                                                            percent={(
                                                                (record.hvac_consumption.now / topHVACConsumption) *
                                                                100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#FC9EAC`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                    {index === 5 && (
                                                        <Line
                                                            percent={(
                                                                (record.hvac_consumption.now / topHVACConsumption) *
                                                                100
                                                            ).toFixed(0)}
                                                            strokeWidth="3"
                                                            trailWidth="3"
                                                            strokeColor={`#FFCFD6`}
                                                            strokeLinecap="round"
                                                        />
                                                    )}
                                                </div>
                                            </td>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'hvac_per') && (
                                            <td>
                                                {record.hvac_consumption.now >= record.hvac_consumption.old ? (
                                                    <button
                                                        className="button-danger text-danger btn-font-style"
                                                        style={{ width: 'auto', marginBottom: '4px' }}>
                                                        <i className="uil uil-arrow-growth">
                                                            <strong>
                                                                {percentageHandler(
                                                                    record.hvac_consumption.now,
                                                                    record.hvac_consumption.old
                                                                )}
                                                                %
                                                            </strong>
                                                        </i>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="button-success text-success btn-font-style"
                                                        style={{ width: 'auto' }}>
                                                        <i className="uil uil-chart-down">
                                                            <strong>
                                                                {percentageHandler(
                                                                    record.hvac_consumption.now,
                                                                    record.hvac_consumption.old
                                                                )}
                                                                %
                                                            </strong>
                                                        </i>
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'total') && (
                                            <td className="value-style">
                                                {(record.total_consumption / 1000).toFixed(0)}
                                                kWh
                                            </td>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'total_per') && (
                                            <td>
                                                {record.total_consumption >= record.energy_consumption.old ? (
                                                    <button
                                                        className="button-danger text-danger btn-font-style"
                                                        style={{ width: 'auto', marginBottom: '4px' }}>
                                                        <i className="uil uil-arrow-growth">
                                                            <strong>
                                                                {percentageHandler(
                                                                    record.total_consumption,
                                                                    record.energy_consumption.old
                                                                )}
                                                                %
                                                            </strong>
                                                        </i>
                                                    </button>
                                                ) : (
                                                    <button
                                                        className="button-success text-success btn-font-style"
                                                        style={{ width: 'auto' }}>
                                                        <i className="uil uil-chart-down">
                                                            <strong>
                                                                {percentageHandler(
                                                                    record.total_consumption,
                                                                    record.energy_consumption.old
                                                                )}
                                                                %
                                                            </strong>
                                                        </i>
                                                    </button>
                                                )}
                                            </td>
                                        )}
                                        {selectedOptions.some((record) => record.value === 'sq_ft') && (
                                            <td className="value-style">
                                                {record.sq_ft?.toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                            </td>
                                        )}
                                    </tr>
                                );
                            })}
                        </tbody>
                    )}
                </Table>
            </CardBody>
        </Card>
    );
};

const CompareBuildings = () => {
    const [buildingsData, setBuildingsData] = useState([]);
    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const tableColumnOptions = [
        { label: 'Name', value: 'name' },
        { label: 'Energy Density', value: 'density' },
        { label: '% Change', value: 'per_change' },
        { label: 'HVAC Consumption', value: 'hvac' },
        { label: 'HVAC % change', value: 'hvac_per' },
        { label: 'Total Consumption', value: 'total' },
        { label: 'Total % change', value: 'total_per' },
        { label: 'Sq. ft.', value: 'sq_ft' },
        { label: 'Monitored Load', value: 'load' },
    ];

    const [isBuildingDataFetched, setIsBuildingDataFetched] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Compare Buildings',
                        path: '/energy/compare-buildings',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        ComponentStore.update((s) => {
            s.parent = 'portfolio';
        });
        updateBreadcrumbStore();
        let arr = [
            { label: 'Name', value: 'name' },
            { label: 'Energy Density', value: 'density' },
            //{ label: '% Change', value: 'per_change' },
            //{ label: 'HVAC Consumption', value: 'hvac' },
            //{ label: 'HVAC % change', value: 'hvac_per' },
            { label: 'Total Consumption', value: 'total' },
            { label: 'Total % change', value: 'total_per' },
            { label: 'Sq. ft.', value: 'sq_ft' },
            // { label: 'Monitored Load', value: 'load' },
        ];
        setSelectedOptions(arr);
    }, []);

    const compareBuildingsData = async () => {
        try {
            setIsBuildingDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let arr = {
                date_from: startDate.toLocaleDateString(),
                date_to: endDate.toLocaleDateString(),
                tz_info: timeZone,
            };

            let count = parseInt(localStorage.getItem('dateFilter'));
            let params = `?days=${daysCount}`;
            await axios.post(`${BaseUrl}${compareBuildings}${params}`, arr, { headers }).then((res) => {
                let response = res?.data;
                console.log(response?.data)
                //response.data.sort((a, b) => b.energy_consumption - a.energy_consumption);
                setBuildingsData(response?.data);
                setIsBuildingDataFetched(false);
                // console.log('setBuildingsData => ', res.data);
            });
        } catch (error) {
            console.log(error);
            setIsBuildingDataFetched(false);
            console.log('Failed to fetch Buildings Data');
        }
    };

    useEffect(() => {
        compareBuildingsData();
    }, [daysCount]);

    const buildingDataWithFilter = async (order, filterBy) => {
        try {
            setIsBuildingDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let arr = {
                date_from: startDate.toLocaleDateString(),
                date_to: endDate.toLocaleDateString(),
                tz_info: timeZone,
            };
            let count = parseInt(localStorage.getItem('dateFilter'));
            let params=""
            if(buildingInput.length>1){
                params = `?days=${daysCount}&order_by=${filterBy}&sort_by=${order}&building_search=${buildingInput}`;
            }
            else{
            params = `?days=${daysCount}&order_by=${filterBy}&sort_by=${order}`;
            }
            await axios.post(`${BaseUrl}${compareBuildings}${params}`, arr, { headers }).then((res) => {
                let response = res?.data;
                console.log(response);
                //response.data.sort((a, b) => b.energy_consumption - a.energy_consumption);
                console.log(response);
                setBuildingsData(response?.data);
                setIsBuildingDataFetched(false);
            });
        } catch (error) {
            console.log(error);
            setIsBuildingDataFetched(false);
            console.log('Failed to fetch all Equipments Data');
        }
    };

    const [buildingInput, setBuildingInput] = useState('');

    // const searchCompareBuildingsFunc = async () => {
    //     setIsBuildingDataFetched(true);
    //     try {
    //         let headers = {
    //             'Content-Type': 'application/json',
    //             accept: 'application/json',
    //             Authorization: `Bearer ${userdata.token}`,
    //         };
    //         let count = parseInt(localStorage.getItem('dateFilter'));
    //         let arr = {
    //             date_from: startDate.toLocaleDateString(),
    //             date_to: endDate.toLocaleDateString(),
    //             tz_info: timeZone,
    //         };
    //         let params = `?days=${count}&building_name=${buildingInput}`;
    //         await axios.post(`${BaseUrl}${searchCompareBuildings}${params}`, arr, { headers }).then((res) => {
    //             let response = res.data;
    //             response.sort((a, b) => b.energy_consumption - a.energy_consumption);
    //             setBuildingsData(response);
    //             setIsBuildingDataFetched(false);
    //         });
    //     } catch (error) {
    //         console.log(error);
    //         setIsBuildingDataFetched(false);
    //         console.log('Failed to fetch all Equipments Data');
    //     }
    // };

    // const handleKeyDownSearch = (e) => {
    //     if (e.key === 'Enter') {
    //         if (buildingInput.length >= 1) {
    //             searchCompareBuildingsFunc();
    //         }
    //         if (buildingInput.length === 0) {
    //             compareBuildingsData();
    //         }
    //     }
    // };
    useEffect(() => {
        if (buildingInput === '') compareBuildingsData();
    }, [buildingInput]);

    return (
        <React.Fragment>
            <Header title="Compare Buildings" />

            {/* <Row className="m-4">
                <div>
                    <FontAwesomeIcon icon={faHome} />
                </div>
            </Row> */}

            <Row className="mt-2">
                <Col xl={3}>
                    <div className="input-group rounded ml-4">
                        <input
                            type="search"
                            className="form-control rounded"
                            placeholder="Search"
                            aria-label="Search"
                            aria-describedby="search-addon"
                            onChange={(e) => {
                                setBuildingInput(e.target.value);
                            }}
                            // onKeyDown={handleKeyDownSearch}
                        />
                        <span
                            className="input-group-text border-0"
                            id="search-addon"
                            style={{ cursor: 'pointer' }}
                            onClick={() => {
                                if (buildingInput.length >= 1) {
                                    buildingDataWithFilter("ace","building_name");
                                }
                                if (buildingInput.length === 0) {
                                    compareBuildingsData();
                                }
                            }}>
                            <Search className="icon-sm" />
                        </span>
                    </div>
                </Col>
                {/* <Col xl={9}>
                    <button type="button" className="btn btn-white d-inline ml-2">
                        <i className="uil uil-plus mr-1"></i>Add Filter
                    </button>
                    <div className="float-right">
                        <MultiSelect
                            options={tableColumnOptions}
                            value={selectedOptions}
                            onChange={setSelectedOptions}
                            labelledBy="Columns"
                            className="column-filter-styling"
                            valueRenderer={() => {
                                return 'Columns';
                            }}
                            ClearSelectedIcon={null}
                        />
                    </div>
                </Col> */}
            </Row>
            <Row>
                <Col xl={12}>
                    <BuildingTable
                        buildingsData={buildingsData}
                        selectedOptions={selectedOptions}
                        buildingDataWithFilter={buildingDataWithFilter}
                        isBuildingDataFetched={isBuildingDataFetched}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default CompareBuildings;
