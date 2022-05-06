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
import ExploreTable from './ExploreTable';
import { MoreVertical } from 'react-feather';
import { BaseUrl, getExplore } from '../../services/Network';
import { BreadcrumbStore } from '../../components/BreadcrumbStore';
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
    const TABS = {
        Tab1: '24 Hours',
        Tab2: '7 Days',
        Tab3: '30 Days',
        Tab4: 'Custom',
    };
    const [activeTab, setActiveTab] = useState(TABS.Tab3);

    // const exploreOpts = {
    //     Opts1: 'No Grouping',
    //     Opts2: 'End Use',
    //     Opts3: 'Equipment Type',
    //     Opts4: 'Floor',
    //     Opts5: 'Location',
    //     Opts6: 'Location Type',
    // };

    const [exploreOpts, setExploreOpts] = useState([
        { value: 'No Grouping', label: 'No Grouping' },
        { value: 'End Use', label: 'End Use' },
        { value: 'Equipment Type', label: 'Equipment Type' },
        { value: 'Floor', label: 'Floor' },
        { value: 'Location', label: 'Location' },
        { value: 'Location Type', label: 'Location Type' },
    ]);

    const [activeExploreOpt, setActiveExploreOpt] = useState(exploreOpts[0].value);

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
    const [optionsLineData, setOptionsLineData] = useState({});

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
        const exploreDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                await axios.post(`${BaseUrl}${getExplore}`, { headers }).then((res) => {
                    // console.log('exploreDataFetch => ', res.data);
                    let fetchedData = res.data;
                    let exploreData = [];
                    fetchedData.forEach((record) => {
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
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
            }
        };
        exploreDataFetch();
    }, [activeExploreOpt]);

    useEffect(() => {
        console.log('activeExploreOpt => ', activeExploreOpt);
        console.log('seriesData => ', seriesData);
    });

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container ml-4">
                    <div>
                        <Select
                            className="react-select explorer-select-style"
                            onChange={(e) => setActiveExploreOpt(e.value)}
                            classNamePrefix="react-select"
                            placeholderText="p"
                            options={exploreOpts.map((record, index) => {
                                return {
                                    value: record.value,
                                    label: record.label,
                                };
                            })}></Select>
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
                                style={{ display: 'inline-block' }}>
                                {metric.map((record, index) => {
                                    return <option value={record.value}>{record.label}</option>;
                                })}
                            </Input>
                        </div>

                        <div className="ml-2">
                            <Input
                                type="select"
                                name="select"
                                id="exampleSelect"
                                style={{ color: 'black', fontWeight: 'bold', width: 'auto' }}
                                className="select-button form-control form-control-md">
                                <option className="mb-0">Last 7 Days</option>
                                <option>Last 5 Days</option>
                                <option>Last 3 Days</option>
                                <option>Last 1 Day</option>
                            </Input>
                        </div>

                        <div className="mr-2">
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

            {activeExploreOpt === 'No Grouping' && (
                <>
                    <BrushChart />
                    <Row>
                        <Col lg={10} className="ml-2">
                            <ExploreTable seriesData={seriesData} optionsData={optionsData} />
                        </Col>
                    </Row>
                </>
            )}

            {activeExploreOpt === 'End Use' && (
                <>
                    <BrushChart />
                    <Row>
                        <Col lg={10} className="ml-2">
                            <ExploreTable seriesData={seriesData} optionsData={optionsData} />
                        </Col>
                    </Row>
                </>
            )}

            {activeExploreOpt === 'Equipment Type' && (
                <>
                    <BrushChart />
                    <Row>
                        <Col lg={10} className="ml-2">
                            <ExploreTable />
                        </Col>
                    </Row>
                </>
            )}

            {activeExploreOpt === 'Floor' && (
                <>
                    <BrushChart />
                    <Row>
                        <Col lg={10} className="ml-2">
                            <ExploreTable />
                        </Col>
                    </Row>
                </>
            )}

            {activeExploreOpt === 'Location' && (
                <>
                    <BrushChart />
                    <Row>
                        <Col lg={10} className="ml-2">
                            <ExploreTable />
                        </Col>
                    </Row>
                </>
            )}

            {activeExploreOpt === 'Location Type' && (
                <>
                    <BrushChart />
                    <Row>
                        <Col lg={10} className="ml-2">
                            <ExploreTable />
                        </Col>
                    </Row>
                </>
            )}
        </React.Fragment>
    );
};

export default Explore;
