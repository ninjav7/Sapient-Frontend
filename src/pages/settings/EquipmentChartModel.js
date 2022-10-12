import React, { useEffect, useState } from 'react';
import {
    Row,
    Col,
    Card,
    CardBody,
    Table,
    UncontrolledDropdown,
    DropdownMenu,
    DropdownToggle,
    DropdownItem,
    Button,
    Input,
} from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRangeStore } from '../../store/DateRangeStore';
import { faXmark, faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { BaseUrl, builidingAlerts, equipmentGraphData } from '../../services/Network';
import axios from 'axios';
import { percentageHandler, convert24hourTo12HourFormat } from '../../utils/helper';
import BrushChart from '../charts/BrushChart';
import { faAngleRight } from '@fortawesome/pro-solid-svg-icons';
import { Cookies } from 'react-cookie';

const EquipmentChartModel = ({ showChart, handleChartClose, sensorData }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [metric, setMetric] = useState([
        { value: 'energy', label: 'Energy (kWh)' },
        { value: 'peak-power', label: 'Peak Power (kW)' },
        { value: 'carbon-emissions', label: 'Carbon Emissions' },
    ]);
    const [deviceData, setDeviceData] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [seriesData, setSeriesData] = useState([]);
    const [startDate, endDate] = dateRange;
    const [topConsumption, setTopConsumption] = useState('');
    const [peak, setPeak] = useState('');

    const customDaySelect = [
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
    const [buildingAlert, setBuildingAlerts] = useState([]);
    const dateValue = DateRangeStore.useState((s) => s.dateFilter);
    const [dateFilter, setDateFilter] = useState(dateValue);

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

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }
        const exploreDataFetch = async () => {
            try {
                if (!sensorData?.eq_id) {
                    return;
                }
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?equipment_id=${sensorData.eq_id}&consumption=energy`;
                await axios
                    .post(
                        `${BaseUrl}${equipmentGraphData}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res.data;
                        let data = response;
                        setTopConsumption(data.data.YTD_DATA[0].ytd.ytd);
                        setPeak(data.data.YTD_DATA[0].ytd_peak.energy);
                        let exploreData = [];
                        let recordToInsert = {
                            data: data.data.GRAPH,
                            name: 'AHUs',
                        };
                        exploreData.push(recordToInsert);
                        setDeviceData(exploreData);
                        setSeriesData([
                            {
                                data: exploreData[0].data,
                            },
                        ]);
                    });
            } catch (error) {}
        };
        const buildingAlertsData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${1}`;
                await axios
                    .post(
                        `${BaseUrl}${builidingAlerts}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        setBuildingAlerts(res.data);
                    });
            } catch (error) {}
        };

        buildingAlertsData();
        exploreDataFetch();
    }, [startDate, endDate]);

    useEffect(() => {
        const exploreDataFetch = async () => {
            try {
                if (!sensorData?.eq_id) {
                    return;
                }
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let endDate = new Date(); // today
                let startDate = new Date();
                startDate.setDate(startDate.getDate() - 7);
                let params = `?equipment_id=${sensorData.eq_id}&consumption=energy`;
                await axios
                    .post(
                        `${BaseUrl}${equipmentGraphData}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res.data;
                        let data = response;
                        setTopConsumption(data.data.YTD_DATA[0].ytd.ytd);
                        setPeak(data.data.YTD_DATA[0].ytd_peak.energy);
                        let exploreData = [];
                        let recordToInsert = {
                            data: data.data.GRAPH,
                            name: 'AHUs',
                        };
                        exploreData.push(recordToInsert);
                        setDeviceData(exploreData);
                        setSeriesData([
                            {
                                data: exploreData[0].data,
                            },
                        ]);
                    });
            } catch (error) {}
        };
        exploreDataFetch();
    }, []);

    const generateDayWiseTimeSeries = (baseval, count, yrange) => {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = baseval;
            var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

            series.push([x, y]);
            baseval += 86400000;
            i++;
        }
        return series;
    };

    const handleRefresh = () => {
        setDateFilter(dateValue);
        let endDate = new Date(); // today
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        setDateRange([startDate, endDate]);
        setDeviceData([]);
        setSeriesData([]);
    };
    const generateDayWiseTimeSeries1 = (baseval, count, yrange) => {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = baseval;
            var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

            series.push([x, y]);
            baseval += 86400000;
            i++;
        }
        return series;
    };

    const data = generateDayWiseTimeSeries(new Date('11 Feb 2022').getTime(), 185, {
        min: 30,
        max: 90,
    });

    const data1 = generateDayWiseTimeSeries1(new Date('11 Feb 2022').getTime(), 190, {
        min: 30,
        max: 90,
    });

    const [series, setSeries] = useState([
        {
            name: 'AHU 1',
            data: [
                [1650874614695, 784.55],
                [1650874694654, 169],
                [1650782931595, 210],
                [1650874587699, 825],
                [1650955774141, 234.55],
                [1650874722069, 240],
                [1650874733485, 989.55],
            ],
        },
    ]);

    const [options, setOptions] = useState({
        chart: {
            id: 'chart2',
            type: 'line',
            height: 180,
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
        colors: ['#10B981', '#2955E7'],
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

    const [seriesLine, setSeriesLine] = useState([
        {
            data: [
                [1650874614695, 784.55],
                [1650874694654, 169],
                [1650782931595, 210],
                [1650874587699, 825],
                [1650955774141, 234.55],
                [1650874722069, 240],
                [1650874733485, 989.55],
            ],
        },
    ]);

    const [optionsLine, setOptionsLine] = useState({
        chart: {
            id: 'chart1',
            height: 90,
            type: 'area',
            brush: {
                target: 'chart2',
                enabled: true,
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date('24 May 2022').getTime(),
                    max: new Date('31 May 2022').getTime(),
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

    return (
        <Modal show={showChart} onHide={handleChartClose} size="xl" centered>
            <div className="chart-model-header">
                <div>
                    <div className="explore-filter-style ml-2">
                        Floor 1
                        <FontAwesomeIcon icon={faAngleRight} size="lg" className="ml-2" />
                        Mech Room
                        <FontAwesomeIcon icon={faAngleRight} size="lg" className="ml-2" />
                        AHU 1
                    </div>
                    <div>
                        <span className="model-sensor-name mr-2">{sensorData.eq_name}</span>
                    </div>
                </div>
                <div>
                    <FontAwesomeIcon
                        icon={faXmark}
                        size="lg"
                        onClick={() => {
                            handleChartClose();
                            handleRefresh();
                        }}
                    />
                </div>
            </div>
            <div className="nav-header-container">
                <div className="passive-page-header">
                    <div className="mt-2 single-passive-tabs-style">
                        <span className="mr-3 single-passive-tab-active">Metrics</span>
                        <span className="mr-3 single-passive-tab">Configure</span>
                        <span className="mr-3 single-passive-tab">History</span>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <div className="single-consumption-container">
                            <h6 className="top-equip-title">Top Consumption YTD</h6>
                            <div className="font-weight-bold" style={{ color: 'black' }}>
                                {topConsumption} kWh
                            </div>
                            <h6 className="top-equip-title">Peak kW YTD</h6>
                            <div className="font-weight-bold" style={{ color: 'black' }}>
                                {peak} kW
                            </div>
                        </div>

                        <div className="equipment-alert-container" style={{ marginTop: '5rem' }}>
                            <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                                Equipment Alerts
                            </h6>
                            <a
                                rel="noopener noreferrer"
                                className="link-primary mr-2"
                                style={{
                                    display: 'inline-block',
                                    float: 'right',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}></a>
                            <span
                                className="float-right mr-0 font-weight-bold"
                                style={{ color: 'blue' }}
                                onClick={() => setBuildingAlerts([])}>
                                Clear
                            </span>

                            <div className="mt-2 alert-container">
                                {buildingAlert.map((record) => {
                                    return (
                                        <>
                                            {record.type === 'building-add' && (
                                                <div className="alert-card mb-2">
                                                    <div>
                                                        <i className="uil uil-triangle" />
                                                        <span className="alert-heading">
                                                            <b> New Peak</b>
                                                        </span>
                                                        <br />
                                                        <span className="alert-content">
                                                            225.3 kW &nbsp; 3/3/22 @ 3:20 PM
                                                        </span>
                                                        <div className="float-right ml-4 alert-weekday">Today</div>
                                                    </div>
                                                </div>
                                            )}
                                            {record.type === 'energy-trend' && (
                                                <div className="alert-card mb-2">
                                                    <div>
                                                        <i className="uil uil-arrow-growth" />
                                                        <span className="alert-heading">
                                                            <b> Energy Trend</b>
                                                        </span>
                                                        <br />
                                                        <span className="alert-content">
                                                            18% from last year this time
                                                        </span>
                                                        <div className="float-right ml-4 alert-weekday">Yesterday</div>
                                                    </div>
                                                </div>
                                            )}
                                            {record.type === 'notification' && (
                                                <div className="alert-card">
                                                    <div>
                                                        <i className="uil uil-exclamation-triangle" />
                                                        <span className="alert-heading">
                                                            <b> Service Soon</b>
                                                        </span>
                                                        <br />
                                                        <span className="alert-content">80 Run Hours in 45 days</span>
                                                        <div className="float-right ml-4 alert-weekday">Yesterday</div>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                    <div className="col-8">
                        <div className="model-sensor-filters">
                            <div className="">
                                <Input
                                    type="select"
                                    name="select"
                                    id="exampleSelect"
                                    className="font-weight-bold model-sensor-energy-filter mr-2"
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
                                    className="select-button form-control form-control-md model-sensor-energy-filter"
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
                                    className="select-button form-control form-control-md font-weight-bold model-sensor-date-range"
                                    placeholderText="Select Date Range"
                                />
                            </div>

                            <div className="mr-3 sensor-chart-options">
                                <FontAwesomeIcon icon={faEllipsisV} size="lg" />
                            </div>
                        </div>

                        <div>
                            <BrushChart
                                seriesData={deviceData}
                                optionsData={options}
                                seriesLineData={seriesData}
                                optionsLineData={optionsLine}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default EquipmentChartModel;
