import React, { useState, useEffect } from 'react';
import { List } from 'react-feather';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import { Row, Col, Input, Card, CardBody, Table, FormGroup } from 'reactstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import BrushChart from '../charts/BrushChart';
import { percentageHandler, convert24hourTo12HourFormat, dateFormatHandler } from '../../utils/helper';
import ExploreTable from './ExploreTable';
import { MoreVertical } from 'react-feather';
import { BaseUrl, getExplore } from '../../services/Network';
import { BreadcrumbStore } from '../../components/BreadcrumbStore';
import { DateRangeStore } from '../../components/DateRangeStore';
import './style.css';

// const BuildingPeakTable = () => {
//     const records = [
//         {
//             name: 'AHU 1',
//             changePercent: 50,
//             changeKWH: 1.2,
//             changeValue: 22,
//             peakPower: 100,
//             peakPowerTime: 0,
//         },
//         {
//             name: 'AHU 2',
//             changePercent: 10,
//             changeKWH: 1.2,
//             changeValue: 5,
//             peakPower: 0,
//             peakPowerTime: 0,
//         },
//         {
//             name: 'RTU 1',
//             changePercent: 10,
//             changeKWH: 1.2,
//             changeValue: 5,
//             peakPower: 0,
//             peakPowerTime: 0,
//         },
//         {
//             name: 'Front RTU',
//             changePercent: 10,
//             changeKWH: 1.2,
//             changeValue: 5,
//             peakPower: 0,
//             peakPowerTime: 0,
//         },
//         {
//             name: 'Chiller',
//             changePercent: 10,
//             changeKWH: 1.2,
//             changeValue: 5,
//             peakPower: 0,
//             peakPowerTime: 0,
//         },
//     ];

//     return (
//         <React.Fragment>
//             <Row>
//                 <Card>
//                     <CardBody>
//                         <Table className="mb-0 bordered">
//                             <thead>
//                                 <tr className="explore-table-row">
//                                     <th>
//                                         <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
//                                     </th>
//                                     <th className="mr-4">Name</th>
//                                     <th>% Change</th>
//                                     <th></th>
//                                     <th>Peak Power</th>
//                                     <th>Peak Power Time</th>
//                                 </tr>
//                             </thead>
//                             <tbody>
//                                 {records.map((record, index) => {
//                                     return (
//                                         <tr key={index} className="explore-table-row">
//                                             <td>
//                                                 <input type="checkbox" id="vehicle1" name="vehicle1" value="Bike" />
//                                             </td>
//                                             <th scope="row">
//                                                 <Link to="/energy/building/overview">
//                                                     <a className="building-name">{record.name}</a>
//                                                 </Link>
//                                             </th>
//                                             <td>
//                                                 +{record.changePercent}% ({record.changeKWH} kWh)
//                                             </td>
//                                             <td>
//                                                 <progress
//                                                     id="file"
//                                                     value={record.changePercent}
//                                                     min={50}
//                                                     max={100}
//                                                     style={{ height: '30px' }}>
//                                                     {record.peakPower}%
//                                                 </progress>
//                                             </td>
//                                             <td>
//                                                 <div>
//                                                     <span>-</span>
//                                                     <br />
//                                                     <progress
//                                                         id="file"
//                                                         value={record.peakPower}
//                                                         min={50}
//                                                         max={100}></progress>
//                                                 </div>
//                                             </td>
//                                             <td>
//                                                 <div>
//                                                     <span>-</span>
//                                                     <br />
//                                                     <progress
//                                                         id="file"
//                                                         value={record.peakPowerTime}
//                                                         min={50}
//                                                         max={100}></progress>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })}
//                             </tbody>
//                         </Table>
//                     </CardBody>
//                 </Card>
//             </Row>
//         </React.Fragment>
//     );
// };

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

const Explore = () => {
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const customDaySelect = [
        {
            label: 'Last 30 Days',
            value: 30,
        },
        {
            label: 'Last 7 Days',
            value: 7,
        },
        {
            label: 'Last 5 Days',
            value: 5,
        },
        {
            label: 'Last 3 Days',
            value: 3,
        },
        {
            label: 'Last 1 Day',
            value: 1,
        },
    ];

    const dateValue = DateRangeStore.useState((s) => s.dateFilter);
    const [dateFilter, setDateFilter] = useState(dateValue);

    const [exploreOpts, setExploreOpts] = useState([
        { value: 'no-grouping', label: 'No Grouping' },
        { value: 'enduses', label: 'End Use' },
        { value: 'equipment', label: 'Equipment Type' },
        { value: 'floor', label: 'Floor' },
        { value: 'location', label: 'Location' },
        { value: 'location-type', label: 'Location Type' },
    ]);

    const [activeExploreOpt, setActiveExploreOpt] = useState(exploreOpts[0]);

    const [metric, setMetric] = useState([
        { value: 'energy', label: 'Energy (kWh)' },
        { value: 'peak-power', label: 'Peak Power (kW)' },
        { value: 'carbon-emissions', label: 'Carbon Emissions' },
    ]);

    const [seriesData, setSeriesData] = useState([]);
    const [optionsData, setOptionsData] = useState({
        chart: {
            id: 'chart2',
            type: 'line',
            height: 230,
            toolbar: {
                autoSelected: 'pan',
                show: false,
            },
        },
        colors: ['#546E7A'],
        stroke: {
            width: 3,
        },
        dataLabels: {
            enabled: false,
        },
        colors: ['#3C6DF5', '#12B76A', '#DC6803', '#088AB2', '#EF4444'],
        fill: {
            opacity: 1,
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime',
        },
    });

    const [seriesLineData, setSeriesLineData] = useState([]);
    const [optionsLineData, setOptionsLineData] = useState({
        chart: {
            id: 'chart1',
            height: 130,
            type: 'area',
            brush: {
                target: 'chart2',
                enabled: true,
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date('25 April 2022').getTime(),
                    max: new Date('26 April 2022').getTime(),
                },
            },
        },
        colors: ['#008FFB'],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.1,
            },
        },
        xaxis: {
            type: 'datetime',
            tooltip: {
                enabled: false,
            },
        },
        yaxis: {
            tickAmount: 2,
        },
    });

    const [exploreTableData, setExploreTableData] = useState([]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Explore',
                        path: '/explore',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        // if (startDate === null) {
        //     return;
        // }
        // if (endDate === null) {
        //     return;
        // }
        const exploreDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                let params = `?filters=${activeExploreOpt.value}`;
                await axios
                    .post(
                        `${BaseUrl}${getExplore}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        setExploreTableData(responseData);
                        let data = responseData;
                        let exploreData = [];
                        data.forEach((record) => {
                            if (record.eq_name !== null) {
                                let recordToInsert = {
                                    name: record.eq_name,
                                    data: record.data,
                                };
                                exploreData.push(recordToInsert);
                            }
                        });
                        console.log('exploreData => ', exploreData);
                        setSeriesData(exploreData);
                        setSeriesLineData([
                            {
                                data: exploreData[0].data,
                            },
                        ]);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
            }
        };
        exploreDataFetch();
    }, [activeExploreOpt]);

    useEffect(() => {
        const setCustomDate = (date) => {
            let endCustomDate = new Date(); // today
            let startCustomDate = new Date();
            startCustomDate.setDate(startCustomDate.getDate() - date);
            setDateRange([startCustomDate, endCustomDate]);
            DateRangeStore.update((s) => {
                s.dateFilter = date;
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });
        };
        setCustomDate(dateFilter);
    }, [dateFilter]);

    return (
        <React.Fragment>
            {/* Explore Header  */}
            <Row className="page-title">
                <Col className="header-container ml-4">
                    <div>
                        <Select
                            className="react-select explorer-select-style"
                            onChange={(e) => setActiveExploreOpt(e)}
                            classNamePrefix="react-select"
                            placeholderText="p"
                            options={exploreOpts.map((record, index) => {
                                return {
                                    value: record.value,
                                    label: record.label,
                                };
                            })}
                            defaultValue={exploreOpts[0]}
                        />
                    </div>

                    <div
                        className="btn-group custom-button-group header-widget-styling"
                        role="group"
                        aria-label="Basic example">
                        {/* <DropdownButton id="dropdown-item-button" title="Energy (kWh)">
                            <Dropdown.ItemText>Primary Metric</Dropdown.ItemText>
                            <Dropdown.Divider />
                            <Dropdown.Item as="button">Energy (kWh)</Dropdown.Item>
                            <Dropdown.Item as="button">Peak Hour (kW)</Dropdown.Item>
                            <Dropdown.Item as="button">Carbon Emissions</Dropdown.Item>
                        </DropdownButton> */}

                        <div>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                className="font-weight-bold"
                                style={{ display: 'inline-block', width: 'fit-content' }}>
                                {metric.map((record, index) => {
                                    return <option value={record.value}>{record.label}</option>;
                                })}
                            </Input>
                        </div>

                        <div>
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                style={{ color: 'black', fontWeight: 'bold', width: 'fit-content' }}
                                className="select-button form-control form-control-md"
                                onChange={(e) => {
                                    setDateFilter(e.target.value);
                                }}
                                defaultValue={dateFilter}>
                                {customDaySelect.map((el, index) => {
                                    return <option value={el.value}>{el.label}</option>;
                                })}
                            </Input>
                        </div>

                        <div>
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

                        <div className="mr-3 explore-three-dot">
                            <MoreVertical className="icon-sm" />
                        </div>
                    </div>
                </Col>
            </Row>

            {/* Explore Body  */}
            {activeExploreOpt.value === 'no-grouping' && (
                <>
                    <BrushChart
                        seriesData={seriesData}
                        optionsData={optionsData}
                        seriesLineData={seriesLineData}
                        optionsLineData={optionsLineData}
                    />
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable exploreTableData={exploreTableData} />
                        </Col>
                    </Row>
                </>
            )}

            {activeExploreOpt.value === 'enduses' && (
                <>
                    <BrushChart
                        seriesData={seriesData}
                        optionsData={optionsData}
                        seriesLineData={seriesLineData}
                        optionsLineData={optionsLineData}
                    />
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable exploreTableData={exploreTableData} />
                        </Col>
                    </Row>
                </>
            )}

            {activeExploreOpt.value === 'equipment' && (
                <>
                    <BrushChart
                        seriesData={seriesData}
                        optionsData={optionsData}
                        seriesLineData={seriesLineData}
                        optionsLineData={optionsLineData}
                    />
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable exploreTableData={exploreTableData} />
                        </Col>
                    </Row>
                </>
            )}

            {activeExploreOpt.value === 'floor' && (
                <>
                    <BrushChart
                        seriesData={seriesData}
                        optionsData={optionsData}
                        seriesLineData={seriesLineData}
                        optionsLineData={optionsLineData}
                    />
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable exploreTableData={exploreTableData} />
                        </Col>
                    </Row>
                </>
            )}

            {activeExploreOpt.value === 'location' && (
                <>
                    <BrushChart
                        seriesData={seriesData}
                        optionsData={optionsData}
                        seriesLineData={seriesLineData}
                        optionsLineData={optionsLineData}
                    />
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable exploreTableData={exploreTableData} />
                        </Col>
                    </Row>
                </>
            )}

            {activeExploreOpt.value === 'location-type' && (
                <>
                    <BrushChart
                        seriesData={seriesData}
                        optionsData={optionsData}
                        seriesLineData={seriesLineData}
                        optionsLineData={optionsLineData}
                    />
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable exploreTableData={exploreTableData} />
                        </Col>
                    </Row>
                </>
            )}
        </React.Fragment>
    );
};

export default Explore;
