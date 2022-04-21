import React, { useEffect, useState } from 'react';
import { Row, Col, Input, Card, CardBody, Table } from 'reactstrap';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import StackedColumnChart from '../charts/StackedColumnChart';
import BootstrapTable from 'react-bootstrap-table-next';
import 'react-datepicker/dist/react-datepicker.css';
import SelectTableComponent from './SelectTableComponent';
import { Line } from 'rc-progress';
import './style.css';

const BuildingPeakTable = () => {
    const records = [
        {
            name: 'AHU 1',
            changePercent: 50,
            changeKWH: 1.2,
            changeValue: 22,
            peakPower: 100,
            peakPowerTime: 0,
        },
        {
            name: 'AHU 2',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
        },
        {
            name: 'RTU 1',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
        },
        {
            name: 'Front RTU',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
        },
        {
            name: 'Chiller',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
        },
    ];

    return (
        <Card>
            <div className="table-container">
                <CardBody>
                    <Table className="mb-0 bordered">
                        <thead>
                            <tr className="explore-table-row">
                                <th>
                                    <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                                </th>
                                <th>Name</th>
                                <th></th>
                                <th>% Change</th>
                                <th></th>
                                <th>Peak Power</th>
                                <th>Peak Power Time</th>
                                <th></th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record, index) => {
                                return (
                                    <tr key={index} className="explore-table-row">
                                        <td>
                                            <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
                                        </td>

                                        <th scope="row">
                                            <Link to="/energy/building/overview">
                                                <a className="building-name">{record.name}</a>
                                            </Link>
                                        </th>
                                        <td></td>
                                        <td>
                                            +{record.changePercent}% ({record.changeKWH} kWh)
                                        </td>
                                        <td>
                                            <progress
                                                id="file"
                                                value={record.changePercent}
                                                min={50}
                                                max={100}
                                                style={{ height: '30px' }}>
                                                {record.peakPower}%
                                            </progress>
                                        </td>
                                        <td>
                                            <div className="table-peak-power">
                                                <span>-</span>
                                                <br />
                                                <progress
                                                    id="file"
                                                    value={record.peakPower}
                                                    min={50}
                                                    max={100}></progress>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <span>-</span>
                                                <br />
                                                <progress
                                                    id="file"
                                                    value={record.peakPowerTime}
                                                    min={50}
                                                    max={100}></progress>
                                            </div>
                                        </td>
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
            </div>
        </Card>
    );
};

const SelectPeakTable = () => {
    const [list, setList] = useState([
        {
            name: 'AHU 1',
            changePercent: 50,
            changeKWH: 1.2,
            changeValue: 22,
            peakPower: 100,
            peakPowerTime: 0,
            selected: false,
        },
        {
            name: 'AHU 2',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
            selected: false,
        },
        {
            name: 'RTU 1',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
            selected: false,
        },
        {
            name: 'Front RTU',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
            selected: false,
        },
        {
            name: 'Chiller',
            changePercent: 10,
            changeKWH: 1.2,
            changeValue: 5,
            peakPower: 0,
            peakPowerTime: 0,
            selected: false,
        },
    ]);
    const [masterCheck, setMasterCheck] = useState(false);
    const [selectedList, setSelectedList] = useState([]);

    // Select/ UnSelect Table rows
    const onMasterCheck = (e) => {
        let tempList = list;
        tempList.map((user) => (user.selected = e.target.checked));
        setMasterCheck(e.target.checked);
        setList(tempList);
        setSelectedList(list.filter((e) => e.selected));
    };

    // Update List Item's state and Master Checkbox State
    const onItemCheck = (e, item) => {
        let tempList = list;
        tempList.map((user) => {
            if (user.name === item.name) {
                user.selected = e.target.checked;
            }
            return user;
        });

        //To Control Master Checkbox State
        const totalItems = list.length;
        const totalCheckedItems = tempList.filter((e) => e.selected).length;

        // Update State
        setMasterCheck(totalItems === totalCheckedItems);
        setList(tempList);
        setSelectedList(list.filter((e) => e.selected));
    };

    return (
        <>
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <table className="table">
                            <thead>
                                <tr style={{ height: '42px' }}>
                                    <th scope="col">
                                        <input
                                            type="checkbox"
                                            // className="form-check-input"
                                            className="text-center-head"
                                            checked={masterCheck}
                                            id="mastercheck"
                                            onChange={(e) => onMasterCheck(e)}
                                        />
                                    </th>
                                    <th scope="col">Name</th>
                                    <th scope="col">% Change</th>
                                    {/* <th scope="col">
                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </th> */}
                                    <th scope="col">Peak Power</th>
                                    <th scope="col">Peak Power Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                {list.map((record, index) => (
                                    <tr
                                        key={index}
                                        className={record.selected ? 'selected' : ''}
                                        style={{ height: '42px' }}>
                                        <th scope="row">
                                            <input
                                                type="checkbox"
                                                checked={record.selected}
                                                className="text-center-content"
                                                id="rowcheck{user.id}"
                                                onChange={(e) => onItemCheck(e, record)}
                                            />
                                        </th>
                                        <td>{record.name}</td>
                                        <td>
                                            +{record.changePercent}% ({record.changeKWH} kWh)
                                        </td>

                                        {/* <td>
                                            <div className="table-peak-power">
                                                <span style={{ color: '#3C6DF5' }} className="font-weight-bold">
                                                    -
                                                </span>
                                                <br />
                                                <span style={{ margin: '0px' }}>
                                                    <Line
                                                        percent={record.peakPower}
                                                        strokeWidth="4"
                                                        trailWidth="4"
                                                        strokeColor="#FEC84B"
                                                        strokeLinecap="round"
                                                    />
                                                </span>
                                            </div>
                                        </td> */}

                                        <td>
                                            <div className="table-peak-power">
                                                <span style={{ color: '#3C6DF5' }} className="font-weight-bold">
                                                    -
                                                </span>
                                                <br />
                                                <span style={{ margin: '0px' }}>
                                                    <Line
                                                        percent={record.peakPower}
                                                        strokeWidth="4"
                                                        trailWidth="4"
                                                        strokeColor="#FEC84B"
                                                        strokeLinecap="round"
                                                    />
                                                </span>

                                                {/* <progress
                                                    id="file"
                                                    value={record.peakPower}
                                                    min={50}
                                                    max={100}></progress> */}
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <span style={{ color: '#3C6DF5' }} className="font-weight-bold">
                                                    -
                                                </span>
                                                <br />
                                                <span style={{ width: '14px' }}>
                                                    <Line
                                                        percent={record.peakPowerTime}
                                                        strokeWidth="3"
                                                        trailWidth="3"
                                                        strokeColor="#D0D5DD"
                                                        strokeLinecap="round"
                                                    />
                                                </span>
                                                {/* <progress
                                                    id="file"
                                                    value={record.peakPowerTime}
                                                    min={50}
                                                    max={100}></progress> */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
};

const ExploreBuildingPeak = (props) => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    // Column Chart Data
    const [columnChartSeries, setColumnChartSeries] = useState([
        {
            name: 'Building Peak',
            data: [80, 85, 83, 80, 85, 80, 82, 87, 85, 80, 85],
        },
        {
            name: 'Total',
            data: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        },
    ]);
    const [columnChartOptions, setColumnChartOptions] = useState({
        chart: {
            type: 'bar',
            stacked: true,
            stackType: '100%',
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    legend: {
                        position: 'bottom',
                        offsetX: -10,
                        offsetY: 0,
                    },
                },
            },
        ],
        xaxis: {
            categories: ['2021 Q1', '2021 Q2', '2021 Q3', '2021 Q4', '2022 Q1', '2022 Q2', '2022 Q3', '2022 Q4'],
            label: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        fill: {
            opacity: 1,
            colors: ['#EAECF0', '#F2F4F7'],
        },
        legend: {
            position: 'bottom',
            offsetX: 0,
            offsetY: 50,
        },
    });

    return (
        <React.Fragment>
            <Row className="page-title ml-2">
                <Col className="header-container">
                    <div className="explore-blg-peak">
                        <Link to="/energy/peak-demand">
                            <span className="explore-back-btn">Back</span>
                        </Link>
                        <span className="heading-style">Building Peak</span>
                        <div>
                            <span className="explore-head-date">March 3rd, 2020</span> &nbsp;&nbsp;
                            <span className="explore-head-date">3:20 PM</span>
                        </div>
                    </div>
                    <div
                        className="btn-group custom-button-group header-widget-styling"
                        role="group"
                        aria-label="Basic example">
                        <div className="mr-3">
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                style={{ color: 'black', fontWeight: 'bold' }}
                                className="select-button form-control form-control-md mr-4">
                                <option className="mb-0">Peak Power</option>
                                <option>Peak Power 2</option>
                                <option>Peak Power 3</option>
                            </Input>
                        </div>
                        <div className="mr-3">
                            <DatePicker
                                selectsRange={true}
                                startDate={startDate}
                                endDate={endDate}
                                onChange={(update) => {
                                    setDateRange(update);
                                }}
                                dateFormat="MMMM d"
                                className="select-button form-control form-control-md font-weight-bold"
                                placeholderText="Select Date Range"
                            />
                        </div>
                        <div>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                style={{ color: 'black', fontWeight: 'bold' }}
                                className="select-button form-control form-control-md mr-1">
                                <option className="mb-0">Hour</option>
                                <option>Minute</option>
                                <option>Second</option>
                            </Input>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row className="ml-2">
                <div className="explore-graph-container">
                    <StackedColumnChart options={columnChartOptions} series={columnChartSeries} height={350} />
                </div>
            </Row>
            <Row className="ml-2">
                <Col xl={12}>
                    {/* Working  */}
                    {/* <BuildingPeakTable /> */}
                    <SelectPeakTable />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default ExploreBuildingPeak;
