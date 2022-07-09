import React, { useEffect, useState } from 'react';
import { Input } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRangeStore } from '../../store/DateRangeStore';
import { faXmark, faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { BaseUrl, generalActiveDevices, getLocation, sensorGraphData, listSensor } from '../../services/Network';
import axios from 'axios';
import { percentageHandler, convert24hourTo12HourFormat, dateFormatHandler } from '../../utils/helper';
import BrushChart from '../charts/BrushChart';
import { Cookies } from 'react-cookie';

const DeviceChartModel = ({ showChart, handleChartClose, sensorData, sensorLineData }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [metric, setMetric] = useState([
        { value: 'energy', label: 'Energy (kWh)' },
        { value: 'power', label: 'Peak Power (kW)' },
        { value: 'mAh', label: 'Amps (mAh)' },
        { value: 'mV', label: 'Volts (mV)' },
    ]);
    const [activeFilter, setActiveFilter] = useState('energy');
    const [deviceData, setDeviceData] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [seriesData, setSeriesData] = useState([]);
    const [startDate, endDate] = dateRange;

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
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?sensor_id=${sensorData.id}&consumption=${activeFilter}`;
                await axios
                    .post(
                        `${BaseUrl}${sensorGraphData}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res.data;
                        let data = response;
                        let exploreData = [];
                        let recordToInsert = {
                            data: data,
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
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Sensor Graph data');
            }
        };

        exploreDataFetch();
    }, [startDate, endDate, activeFilter]);

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
                    <div className="model-sensor-date-time">00-08-20-83-53-D1</div>
                    <div>
                        <span className="model-sensor-name mr-2">{sensorData.name}</span>
                        <span className="model-equip-name">{sensorData.equipment}</span>
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

            <div className="model-sensor-filters">
                <div className="">
                    <Input
                        type="select"
                        name="select"
                        id="exampleSelect"
                        className="font-weight-bold model-sensor-energy-filter mr-2"
                        style={{ display: 'inline-block', width: 'fit-content' }}
                        defaultValue={activeFilter}
                        onClick={(e) => setActiveFilter(e.target.value)}>
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
        </Modal>
    );
};

export default DeviceChartModel;
