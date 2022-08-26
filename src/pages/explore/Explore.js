import React, { useState, useEffect } from 'react';
import { List } from 'react-feather';
import { Link, useLocation, useHistory } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import EquipmentDeviceChartModel from '../settings/EquipmentDeviceChartModel';
import { Row, Col, Input, Card, CardBody, Table, FormGroup } from 'reactstrap';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown';
import axios from 'axios';
import { ChevronDown, Search } from 'react-feather';
import BrushChart from '../charts/BrushChart';
import { percentageHandler, convert24hourTo12HourFormat, dateFormatHandler } from '../../utils/helper';
import ExploreTable from './ExploreTable';
import { MoreVertical } from 'react-feather';
import { BaseUrl, getExplore, getExploreByBuilding, getExploreByEquipment } from '../../services/Network';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/pro-solid-svg-icons';
import { Cookies } from 'react-cookie';
import { ComponentStore } from '../../store/ComponentStore';
import { BuildingStore } from '../../store/BuildingStore';
import { Spinner } from 'reactstrap';
import './style.css';
import { ChildFilterStore } from '../../store/ChildFilterStore';

const Explore = () => {
    const [parentFilter, setParentFilter] = useState('');

    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);

    const currentParentRoute = ComponentStore.useState((s) => s.parent);
    const ChildFilterId = ChildFilterStore.useState((s) => s.Building_id);
    const ChildFilterName = ChildFilterStore.useState((s) => s.Building_name);
    const location = useLocation();
    let history = useHistory();

    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;
    const [topEnergyConsumption, setTopEnergyConsumption] = useState(1);
    const [topPeakPower, setPeakPower] = useState(1);

    const customDaySelect = [
        {
            label: 'Today',
            value: 0,
        },
        {
            label: 'Last Day',
            value: 1,
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

    const [exploreOpts, setExploreOpts] = useState([{ value: 'by-building', label: 'By Building' }]);
    const [activeExploreOpt, setActiveExploreOpt] = useState(exploreOpts[0]);

    const [exploreSecondLvlOpts, setExploreSecondLvlOpts] = useState([]);
    const [activeSecondLvlOpt, setActiveSecondLvlOpt] = useState(exploreSecondLvlOpts[0]);

    const [exploreThirdLvlOpts, setExploreThirdLvlOpts] = useState([]);
    const [activeThirdLvlOpt, setActiveThirdLvlOpt] = useState(exploreThirdLvlOpts[0]);
    const [counter, setCounter] = useState(0);
    const [showChart, setShowChart] = useState(false);
    const handleChartClose = () => setShowEquipmentChart(false);

    const metric = [
        { value: 'energy', label: 'Energy (kWh)' },
        { value: 'power', label: 'Peak Power (kW)' },
    ];

    const [equipmentData, setEquipmentData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [optionsData, setOptionsData] = useState({
        chart: {
            id: 'chart2',
            type: 'line',
            height: '1000px',
            toolbar: {
                autoSelected: 'pan',
                show: false,
            },

            animations: {
                enabled: false,
            },
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            fontSize: '18px',
            fontFamily: 'Helvetica, Arial',
            fontWeight: 600,
            itemMargin: {
                horizontal: 30,
                vertical: 20,
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
            height: '500px',
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
                // xaxis: {
                //     min: new Date('01 June 2022').getTime(),
                //     max: new Date('02 June 2022').getTime(),
                // },
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
    const [equipmentFilter, setEquipmentFilter] = useState({});
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
                // xaxis: {
                //     min: new Date('01 June 2022').getTime(),
                //     max: new Date('02 June 2022').getTime(),
                // },
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
                // xaxis: {
                //     min: new Date('01 June 2022').getTime(),
                //     max: new Date('02 June 2022').getTime(),
                // },
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
                // xaxis: {
                //     min: new Date('01 June 2022').getTime(),
                //     max: new Date('02 June 2022').getTime(),
                // },
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
                        label: 'Portfolio Level',
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
        localStorage.removeItem('explorer');
        // console.log(currentParentRoute);
        // console.log(location);
        // console.log(ComponentStore.getRawState())
        // let parentState=ComponentStore.getRawState()
        // if(parentState.parent==='explore'){
        //     history.push('/explore/page');
        //     window.location.reload();
        // }
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
                setIsExploreDataLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?consumption=energy`;
                await axios
                    .post(
                        `${BaseUrl}${getExploreByBuilding}${params}`,
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

                        // let childExploreList = [];
                        // responseData.forEach((record) => {
                        //     let obj = {
                        //         value: record.eq_name,
                        //         label: record.eq_name,
                        //         eq_id: record.eq_id,
                        //     };
                        //     childExploreList.push(obj);
                        // });
                        // setExploreSecondLvlOpts(childExploreList);
                        // console.log('childExploreList => ', childExploreList);
                        console.log('SSR API response => ', responseData);
                        setTopEnergyConsumption(responseData[0].energy_consumption.now);
                        setPeakPower(responseData[0].peak_power.now);
                        // setCounter(counter+1);
                        // console.log(counter+1);
                        setExploreTableData(responseData);
                        let data = responseData;
                        let exploreData = [];
                        data.forEach((record) => {
                            if (record.building_name !== null) {
                                let recordToInsert = {
                                    name: record.building_name,
                                    data: record.building_consumption,
                                };
                                exploreData.push(recordToInsert);
                            }
                        });
                        // console.log('SSR Customized exploreData => ', exploreData);
                        setSeriesData(exploreData);
                        console.log(exploreData);
                        setSeriesLineData([
                            {
                                data: exploreData[0].data,
                            },
                        ]);
                        setIsExploreDataLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
                setIsExploreDataLoading(false);
            }
        };

        exploreDataFetch();
    }, [startDate, endDate]);

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
                setIsExploreDataLoading(true);
                const start = performance.now();
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?consumption=energy`;
                await axios
                    .post(
                        `${BaseUrl}${getExploreByBuilding}${params}`,
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
                            if (record.building_name !== null) {
                                let recordToInsert = {
                                    name: record.building_name,
                                    data: record.building_consumption,
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
                        setIsExploreDataLoading(false);
                    });
                const duration = performance.now() - start;
                // console.log('fetching time ', duration);
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
                setIsExploreDataLoading(false);
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
            console.log(childFilter);
            // if (counter === 2) {
            //     setShowEquipmentChart(true);
            //     console.log(childFilter);
            //     setEquipmentData(childFilter);
            // } else {
            localStorage.setItem('explorer', true);

            console.log(ChildFilterId);
            console.log(ChildFilterName);
            // ComponentStore.update((s) => {
            //     s.parent = 'explore';
            // });
            try {
                setIsExploreDataLoading(true);
                const start = performance.now();
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };

                let params = `?consumption=energy&building_id=${childFilter.building_id}`;
                await axios
                    .post(
                        `${BaseUrl}${getExploreByEquipment}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        setActiveExploreOpt({ value: 'by-equipment', label: 'By Equipment' });
                        setExploreTableData([]);
                        setSeriesData([]);
                        setSeriesLineData([]);
                        setParentFilter('by-equipment');
                        let responseData = res.data;
                        console.log('SSR API response => ', responseData);
                        setTopEnergyConsumption(responseData[0].energy_consumption.now);
                        setPeakPower(responseData[0].peak_power.now);
                        // setCounter(counter+1);
                        // console.log(counter+1);
                        setExploreTableData(responseData);
                        let data = responseData;
                        let exploreData = [];
                        data.forEach((record) => {
                            if (record.equipment_name !== null) {
                                let recordToInsert = {
                                    name: record.equipment_name,
                                    data: record.equipment_consumption,
                                };
                                exploreData.push(recordToInsert);
                            }
                        });
                        // console.log('SSR Customized exploreData => ', exploreData);
                        setSeriesData(exploreData);
                        console.log(exploreData);
                        setSeriesLineData([
                            {
                                data: exploreData[0].data,
                            },
                        ]);
                        setIsExploreDataLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
                setIsExploreDataLoading(false);
            }
            console.log(childFilter);
            BuildingStore.update((s) => {
                s.BldgId = childFilter.building_id;
                s.BldgName = childFilter.building_name;
            });
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Building View',
                        path: '/explore/page',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            //     }
        };

        exploreFilterDataFetch();
    }, [childFilter]);
    useEffect(() => {
        console.log(equipmentFilter);
        if (Object.keys(equipmentFilter).length !== 0) setShowEquipmentChart(true);
    }, [equipmentFilter]);

    useEffect(() => {
        const setCustomDate = (date) => {
            let endCustomDate = new Date(); // today
            let startCustomDate = new Date();
            //startCustomDate.setDate(startCustomDate.getDate() - date-1);
            startCustomDate.setDate(startCustomDate.getDate() - date);
            console.log(date);
            if (date !== '0') endCustomDate.setDate(endCustomDate.getDate() - 1);

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
                        {/* <Select
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
                        /> */}
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
            <EquipmentDeviceChartModel
                showChart={showEquipmentChart}
                handleChartClose={handleChartClose}
                equipData={equipmentFilter}
                showWindow={'metrics'}
            />
            {/* Explore Body  */}
            {activeExploreOpt.value === 'by-building' && (
                <div className="explore-content-style">
                    {isExploreDataLoading ? (
                        <div className="loader-center-style" style={{ height: '400px' }}>
                            <Spinner className="m-2" color={'primary'} />
                        </div>
                    ) : (
                        <BrushChart
                            seriesData={seriesData}
                            optionsData={optionsData}
                            seriesLineData={seriesLineData}
                            optionsLineData={optionsLineData}
                        />
                    )}
                    <Row className="mt-2">
                        <Col xl={3}>
                            <div className="input-group rounded ml-4">
                                <input
                                    type="search"
                                    className="form-control rounded"
                                    placeholder="Search"
                                    aria-label="Search"
                                    aria-describedby="search-addon"
                                />
                                <span className="input-group-text border-0" id="search-addon">
                                    <Search className="icon-sm" />
                                </span>
                            </div>
                        </Col>
                        <Col xl={9}>
                            <button type="button" className="btn btn-white d-inline ml-2">
                                <i className="uil uil-plus mr-1"></i>Add Filter
                            </button>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                childFilter={childFilter}
                                setChildFilter={setChildFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                                topEnergyConsumption={topEnergyConsumption}
                                topPeakPower={topPeakPower}
                                isExploreDataLoading={isExploreDataLoading}
                            />
                        </Col>
                    </Row>
                </div>
            )}

            {activeExploreOpt.value === 'by-equipment' && (
                <div className="explore-content-style">
                    {isExploreDataLoading ? (
                        <div className="loader-center-style" style={{ height: '400px' }}>
                            <Spinner className="m-2" color={'primary'} />
                        </div>
                    ) : (
                        <BrushChart
                            seriesData={seriesData}
                            optionsData={optionsData}
                            seriesLineData={seriesLineData}
                            optionsLineData={optionsLineData}
                        />
                    )}
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                equipmentFilter={equipmentFilter}
                                setEquipmentFilter={setEquipmentFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                                isExploreDataLoading={isExploreDataLoading}
                            />
                        </Col>
                    </Row>
                </div>
            )}

            {activeExploreOpt.value === 'equipment_type' && (
                <div className="explore-content-style">
                    {isExploreDataLoading ? (
                        <div className="loader-center-style" style={{ height: '400px' }}>
                            <Spinner className="m-2" color={'primary'} />
                        </div>
                    ) : (
                        <BrushChart
                            seriesData={seriesData}
                            optionsData={optionsData}
                            seriesLineData={seriesLineData}
                            optionsLineData={optionsLineData}
                        />
                    )}

                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                childFilter={childFilter}
                                setChildFilter={setChildFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                                isExploreDataLoading={isExploreDataLoading}
                            />
                        </Col>
                    </Row>
                </div>
            )}

            {activeExploreOpt.value === 'floor' && (
                <div className="explore-content-style">
                    {isExploreDataLoading ? (
                        <div className="loader-center-style" style={{ height: '400px' }}>
                            <Spinner className="m-2" color={'primary'} />
                        </div>
                    ) : (
                        <BrushChart
                            seriesData={seriesData}
                            optionsData={optionsData}
                            seriesLineData={seriesLineData}
                            optionsLineData={optionsLineData}
                        />
                    )}
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                childFilter={childFilter}
                                setChildFilter={setChildFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                                isExploreDataLoading={isExploreDataLoading}
                            />
                        </Col>
                    </Row>
                </div>
            )}

            {activeExploreOpt.value === 'location' && (
                <div className="explore-content-style">
                    {isExploreDataLoading ? (
                        <div className="loader-center-style" style={{ height: '400px' }}>
                            <Spinner className="m-2" color={'primary'} />
                        </div>
                    ) : (
                        <BrushChart
                            seriesData={seriesData}
                            optionsData={optionsData}
                            seriesLineData={seriesLineData}
                            optionsLineData={optionsLineData}
                        />
                    )}
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                childFilter={childFilter}
                                setChildFilter={setChildFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                                isExploreDataLoading={isExploreDataLoading}
                            />
                        </Col>
                    </Row>
                </div>
            )}

            {activeExploreOpt.value === 'location-type' && (
                <div className="explore-content-style">
                    {isExploreDataLoading ? (
                        <div className="loader-center-style" style={{ height: '400px' }}>
                            <Spinner className="m-2" color={'primary'} />
                        </div>
                    ) : (
                        <BrushChart
                            seriesData={seriesData}
                            optionsData={optionsData}
                            seriesLineData={seriesLineData}
                            optionsLineData={optionsLineData}
                        />
                    )}
                    <Row>
                        <Col lg={12} className="ml-2">
                            <ExploreTable
                                exploreTableData={exploreTableData}
                                activeExploreOpt={activeExploreOpt}
                                childFilter={childFilter}
                                setChildFilter={setChildFilter}
                                parentFilter={parentFilter}
                                setParentFilter={setParentFilter}
                                isExploreDataLoading={isExploreDataLoading}
                            />
                        </Col>
                    </Row>
                </div>
            )}
        </>
    );
};

export default Explore;
