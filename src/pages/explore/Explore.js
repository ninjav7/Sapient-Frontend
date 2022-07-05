import React, { useState, useEffect } from 'react';
import { List } from 'react-feather';
import { Link } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import EquipmentChartModel from '../settings/EquipmentChartModel';
import { Row, Col, Input, Card, CardBody, Table, FormGroup } from 'reactstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import BrushChart from '../charts/BrushChart';
import { percentageHandler, convert24hourTo12HourFormat, dateFormatHandler } from '../../utils/helper';
import ExploreTable from './ExploreTable';
import { MoreVertical } from 'react-feather';
import { BaseUrl, getExplore } from '../../services/Network';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/pro-solid-svg-icons';
import { Cookies } from 'react-cookie';
import { ComponentStore } from '../../store/ComponentStore';
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
    const [parentFilter, setParentFilter] = useState('');

    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    const customDaySelect = [
        {
            label: 'Today',
            value: 0,
        },
        {
            label: 'Last 7 Days',
            value: 7,
        },
        {
            label: 'Last 4 Weeks',
            value: 28,
        },
        {
            label: 'Last 3 Months',
            value: 90,
        },
        {
            label: 'Last 12 Months',
            value: 365,
        },
    ];

    const dateValue = DateRangeStore.useState((s) => s.dateFilter);
    const [dateFilter, setDateFilter] = useState(dateValue);

    const [exploreOpts, setExploreOpts] = useState([
        { value: 'no-grouping', label: 'No Grouping' },
        { value: 'enduses', label: 'End Use' },
        { value: 'equipment_type', label: 'Equipment Type' },
        { value: 'floor', label: 'Floor' },
        { value: 'location', label: 'Location' },
        { value: 'location-type', label: 'Location Type' },
    ]);
    const [activeExploreOpt, setActiveExploreOpt] = useState(exploreOpts[0]);

    const [exploreSecondLvlOpts, setExploreSecondLvlOpts] = useState([]);
    const [activeSecondLvlOpt, setActiveSecondLvlOpt] = useState(exploreSecondLvlOpts[0]);

    const [exploreThirdLvlOpts, setExploreThirdLvlOpts] = useState([]);
    const [activeThirdLvlOpt, setActiveThirdLvlOpt] = useState(exploreThirdLvlOpts[0]);
    const [counter, setCounter] = useState(0);
    const [showChart, setShowChart] = useState(false);
    const handleChartClose = () => setShowEquipmentChart(false);

    // const [endUsesFilter, setEndUsesFilter] = useState([
    //     { value: 'enduses', label: 'HVAC' },
    //     { value: 'lighting', label: 'Lighting' },
    //     { value: 'equipment', label: 'Plug' },
    //     { value: 'location', label: 'Process' },
    // ]);

    const [metric, setMetric] = useState([
        { value: 'energy', label: 'Energy (kWh)' },
        { value: 'peak-power', label: 'Peak Power (kW)' },
        { value: 'carbon-emissions', label: 'Carbon Emissions' },
    ]);
    const [equipmentData, setEquipmentData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [optionsData, setOptionsData] = useState({
        chart: {
            id: 'chart2',
            type: 'line',
            height: 230,
            toolbar: {
                autoSelected: 'pan',
                show: true,
            },
            animations: {
                enabled: false,
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
            toolbar: {
                show: false,
            },
            type: 'area',
            brush: {
                target: 'chart2',
                enabled: true,
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date('01 June 2022').getTime(),
                    max: new Date('02 June 2022').getTime(),
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
    const [mainParent, setMainParent] = useState([]);
    const [childFilter, setChildFilter] = useState({});
    const [secActive, setSecActive] = useState('');
    const [thirdActive, setThirdActive] = useState('');

    // New Approach
    const [currentFilterLevel, setCurrentFilterLevel] = useState('first');

    const [firstLevelExploreData, setFirstLevelExploreData] = useState();
    const [firstLevelExploreOpts, setFirstLevelExploreOpts] = useState({
        chart: {
            id: 'chart2',
            type: 'line',
            height: 230,
            toolbar: {
                autoSelected: 'pan',
                show: true,
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
    const [secondLevelExploreData, setSecondLevelExploreData] = useState();
    const [secondLevelExploreOpts, setSecondLevelExploreOpts] = useState({
        chart: {
            id: 'chart2',
            type: 'line',
            height: 230,
            toolbar: {
                autoSelected: 'pan',
                show: true,
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
    const [thirdLevelExploreData, setThirdLevelExploreData] = useState();
    const [thirdLevelExploreOpts, setThirdLevelExploreOpts] = useState({
        chart: {
            id: 'chart2',
            type: 'line',
            height: 230,
            toolbar: {
                autoSelected: 'pan',
                show: true,
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
    const [showEquipmentChart, setShowEquipmentChart] = useState(false);
    const [firstLevelLineData, setFirstLevelLineData] = useState();
    const [firstLevelLineOpts, setFirstLevelLineOpts] = useState({
        chart: {
            id: 'chart1',
            height: 130,
            toolbar: {
                show: false,
            },
            type: 'area',
            brush: {
                target: 'chart2',
                enabled: true,
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date('01 June 2022').getTime(),
                    max: new Date('02 June 2022').getTime(),
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
    const [secondLevelLineData, setSecondLevelLineData] = useState();
    const [secondLevelLineOpts, setSecondLevelLineOpts] = useState({
        chart: {
            id: 'chart1',
            height: 130,
            toolbar: {
                show: false,
            },
            type: 'area',
            brush: {
                target: 'chart2',
                enabled: true,
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date('01 June 2022').getTime(),
                    max: new Date('02 June 2022').getTime(),
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
    const [thirdLevelLineData, setThirdLevelLineData] = useState();
    const [thirdLevelLineOpts, setThirdLevelLineOpts] = useState({
        chart: {
            id: 'chart1',
            height: 130,
            toolbar: {
                show: false,
            },
            type: 'area',
            brush: {
                target: 'chart2',
                enabled: true,
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date('01 June 2022').getTime(),
                    max: new Date('02 June 2022').getTime(),
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

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Explore',
                        path: '/explore/page',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'explore';
            });
        };
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }
        const exploreDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
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
                        setExploreTableData([]);
                        setSeriesData([]);
                        setSeriesLineData([]);
                        let responseData = res.data;

                        let childExploreList = [];
                        responseData.forEach((record) => {
                            let obj = {
                                value: record.eq_name,
                                label: record.eq_name,
                                eq_id: record.eq_id,
                            };
                            childExploreList.push(obj);
                        });
                        setExploreSecondLvlOpts(childExploreList);
                        console.log('childExploreList => ', childExploreList);
                        console.log('SSR API response => ', responseData);
                        // setCounter(counter+1);
                        // console.log(counter+1);
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
                        // console.log('SSR Customized exploreData => ', exploreData);
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
    }, [activeExploreOpt, startDate, endDate]);

    useEffect(() => {
        let obj = activeExploreOpt;
        setParentFilter(obj.value);
    }, [activeExploreOpt]);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }
        const exploreDataFetch = async () => {
            try {
                const start = performance.now();
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?filters=no-grouping`;
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
                        console.log('SSR API response => ', responseData);
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
                        setSeriesData(exploreData);
                        setSeriesLineData([
                            {
                                data: exploreData[0].data,
                            },
                        ]);
                    });
                const duration = performance.now() - start;
                console.log('fetching time ', duration);
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
            }
        };

        exploreDataFetch();
    }, []);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }
        window.scroll(0, 0);

        const exploreFilterDataFetch = async () => {
            if (counter === 2) {
                setShowEquipmentChart(true);
                console.log(childFilter);
                setEquipmentData(childFilter);
            } else {
                try {
                    const start = performance.now();
                    let headers = {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                        // 'user-auth': '628f3144b712934f578be895',
                        Authorization: `Bearer ${userdata.token}`,
                    };
                    let params = `?filters=${childFilter.parent}&filter_id=${childFilter.eq_id}`;
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
                            setExploreTableData([]);
                            setSeriesData([]);
                            setSeriesLineData([]);
                            let responseData = res.data;
                            console.log('SSR API response => ', responseData);
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
                            // console.log('SSR Customized exploreData => ', exploreData);
                            setCounter(counter + 1);
                            console.log('Counter ', counter + 1);
                            setSeriesData(exploreData);
                            setSeriesLineData([
                                {
                                    data: exploreData[0].data,
                                },
                            ]);
                            if (counter + 1 === 1) {
                                setSecActive(childFilter);
                            }
                            if (counter + 1 === 2) {
                                setThirdActive(childFilter);
                            }
                            let newObj = childFilter;
                            newObj.parent = 'equipment_type';
                            setChildFilter(newObj);
                            setParentFilter(newObj.parent);
                            const duration = performance.now() - start;
                            console.log('fetching time ', duration);
                        });
                } catch (error) {
                    console.log(error);
                    console.log('Failed to fetch Explore Data');
                }
            }
        };

        exploreFilterDataFetch();
    }, [childFilter]);

    useEffect(() => {
        console.log('Child Filter => ', childFilter);
    });

    useEffect(() => {
        const setCustomDate = (date) => {
            let endCustomDate = new Date(); // today
            let startCustomDate = new Date();
            startCustomDate.setDate(startCustomDate.getDate() - date);
            endCustomDate.setDate(endCustomDate.getDate() - 1);
            setDateRange([startCustomDate, endCustomDate]);
            DateRangeStore.update((s) => {
                s.dateFilter = date;
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });
        };
        setCustomDate(dateFilter);
    }, [dateFilter]);

    useEffect(() => {
        console.log('set active => ', secActive.eq_name);
        console.log('parentFilter => ', parentFilter);
        console.log('childFilter => ', childFilter);
        console.log('childFilter Parent => ', mainParent);
        console.log('activeExploreOpt => ', activeExploreOpt.value);
    });

    return (
        <>
            {/* Explore Header  */}
            <Row className="page-title ml-2 mr-2 explore-page-filter">
                {mainParent.value === activeExploreOpt.value ? (
                    <div className="explore-equip-filter" style={{ display: 'flex' }}>
                        <div className="explore-filter-style ml-2">By {activeExploreOpt.label}</div>
                        <div>
                            <FontAwesomeIcon icon={faAngleRight} size="lg" className="ml-2" />
                        </div>
                        {counter === 1 ? (
                            <>
                                <div className="explore-filter-style ml-2">{secActive.eq_name}</div>
                                <div>
                                    <FontAwesomeIcon icon={faAngleRight} size="lg" className="ml-2" />
                                </div>
                                {/* <div>
                            <Select
                                className="react-select endUses-select-style mr-2"
                                classNamePrefix="react-select"
                                placeholderText="p"
                                onChange={(e) => {
                                    setActiveExploreOpt(e);
                                }}
                                options={exploreSecondLvlOpts.map((record, index) => {
                                    return {
                                        value: record.value,
                                        label: record.label,
                                    };
                                })}
                                defaultValue={exploreSecondLvlOpts[0]}
                            />
                        </div> */}
                                <div>Grouped by Equipment Type</div>
                            </>
                        ) : counter === 2 ? (
                            <>
                                <div className="explore-filter-style ml-2">{secActive.eq_name}</div>
                                <div>
                                    <FontAwesomeIcon icon={faAngleRight} size="lg" className="ml-2" />
                                </div>
                                <div className="explore-filter-style ml-2">{thirdActive.eq_name}</div>
                                <div>
                                    <FontAwesomeIcon icon={faAngleRight} size="lg" className="ml-2" />
                                </div>
                            </>
                        ) : (
                            ''
                        )}
                    </div>
                ) : (
                    <div>
                        <Select
                            className="react-select explorer-select-style ml-4"
                            onChange={(e) => {
                                setActiveExploreOpt(e);
                                setMainParent(e);
                            }}
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
                )}

                <div className="btn-group custom-button-group header-widget-styling">
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
                    <div className="explore-three-dot">
                        <MoreVertical className="icon-sm" />
                    </div>
                </div>
            </Row>
            <EquipmentChartModel
                showChart={showEquipmentChart}
                handleChartClose={handleChartClose}
                sensorData={equipmentData}
            />
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
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                childFilter={childFilter}
                                setChildFilter={setChildFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                            />
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
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                childFilter={childFilter}
                                setChildFilter={setChildFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                            />
                        </Col>
                    </Row>
                </>
            )}

            {activeExploreOpt.value === 'equipment_type' && (
                <>
                    <BrushChart
                        seriesData={seriesData}
                        optionsData={optionsData}
                        seriesLineData={seriesLineData}
                        optionsLineData={optionsLineData}
                    />
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                childFilter={childFilter}
                                setChildFilter={setChildFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                            />
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
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                childFilter={childFilter}
                                setChildFilter={setChildFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                            />
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
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                childFilter={childFilter}
                                setChildFilter={setChildFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                            />
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
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                childFilter={childFilter}
                                setChildFilter={setChildFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                            />
                        </Col>
                    </Row>
                </>
            )}
        </>
    );
};

export default Explore;
