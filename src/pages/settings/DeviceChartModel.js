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
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import Form from 'react-bootstrap/Form';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRangeStore } from '../../store/DateRangeStore';
import { faXmark, faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { BaseUrl, generalActiveDevices, getLocation, sensorGraphData, listSensor } from '../../services/Network';
import axios from 'axios';
import { percentageHandler, convert24hourTo12HourFormat, dateFormatHandler } from '../../utils/helper';
import BrushChart from '../charts/BrushChart';
import { Cookies } from 'react-cookie';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

const DeviceChartModel = ({ showChart, handleChartClose, sensorData, sensorLineData }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const CONVERSION_ALLOWED_UNITS = ['mV', 'mAh', 'power'];
    const UNIT_DIVIDER = 1000;
    const [metric, setMetric] = useState([
        { value: 'energy', label: 'consumedEnergy (Wh)' },
        { value: 'mV', label: 'voltage (V)' },
        { value: 'mAh', label: 'amperage (A)' },
        { value: 'power', label: 'realPower (W)' },
    ]);
    const [selectedConsumption, setConsumption] = useState(metric[0].value);
    const [deviceData, setDeviceData] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [seriesData, setSeriesData] = useState([]);
    const [startDate, endDate] = dateRange;
    const [sDateStr, setSDateStr] = useState('');
    const [eDateStr, setEDateStr] = useState('');
    const [dropDown, setDropDown] = useState('dropdown-menu dropdown-menu-right');

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
            endCustomDate.setDate(endCustomDate.getDate() - 1);
            setDateRange([startCustomDate, endCustomDate]);
            DateRangeStore.update((s) => {
                s.dateFilter = date;
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });
            let estr = endCustomDate.getFullYear() + '-' + endCustomDate.getMonth() + '-' + endCustomDate.getDate();
            let sstr =
                startCustomDate.getFullYear() + '-' + startCustomDate.getMonth() + '-' + startCustomDate.getDate();
            setEDateStr(estr);
            setSDateStr(sstr);
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
                if (sensorData.id === undefined) {
                    return;
                }
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?sensor_id=${sensorData.id}&consumption=${selectedConsumption}`;
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
                            name: selectedConsumption,
                        };

                        try {
                            recordToInsert.data = recordToInsert.data.map((_data) => {
                                if (CONVERSION_ALLOWED_UNITS.indexOf(selectedConsumption) > -1) {
                                    _data[1] = _data[1] / UNIT_DIVIDER;
                                }

                                return _data;
                            });
                        } catch (error) {}
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
    }, [startDate, endDate, selectedConsumption]);

    const handleRefresh = () => {
        setDateFilter(dateValue);
        let endDate = new Date(); // today
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
        setDateRange([startDate, endDate]);
        setDeviceData([]);
        setSeriesData([]);
    };
    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const exportToCSV = () => {
        let fileName = 'energy';
        const ws = XLSX.utils.json_to_sheet(deviceData[0].data);
        const wb = { Sheets: { data: ws }, SheetNames: ['data'] };
        const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    const [options, setOptions] = useState({
        chart: {
            id: 'chart2',
            type: 'line',
            height: 180,
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
        colors: ['#10B981', '#2955E7'],
        fill: {
            opacity: 1,
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return moment(timestamp).format('DD/MMM - hh:mm');
                },
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return val.toFixed(2);
                },
            },
        },
    });

    const [optionsLine, setOptionsLine] = useState({
        chart: {
            id: 'chart1',
            height: 90,
            type: 'area',
            brush: {
                target: 'chart2',
                enabled: true,
            },
            toolbar: {
                show: false,
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
            labels: {
                formatter: function (val, timestamp) {
                    return moment(timestamp).format('DD/MMM');
                },
            },
        },
        yaxis: {
            tickAmount: 2,
            labels: {
                formatter: function (val) {
                    return val.toFixed(2);
                },
            },
        },
    });
    const handleShow = () => {
        if (dropDown === 'dropdown-menu dropdown-menu-right') setDropDown('dropdown-menu dropdown-menu-right show');
        else setDropDown('dropdown-menu dropdown-menu-right');
    };

    return (
        <Modal show={showChart} onHide={handleChartClose} size="xl" centered>
            <div className="chart-model-header">
                <div>
                    <div className="model-sensor-date-time">{localStorage.getItem('identifier')}</div>
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
                        onChange={(e) => {
                            setConsumption(e.target.value);
                        }}
                        className="font-weight-bold model-sensor-energy-filter mr-2"
                        style={{ display: 'inline-block', width: 'fit-content' }}
                        defaultValue={selectedConsumption}>
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
                    <Dropdown>
                        <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                            <FontAwesomeIcon icon={faEllipsisV} size="lg" />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <Dropdown.Item>
                                <i className="uil uil-download-alt mr-2"></i>Configure Column
                            </Dropdown.Item>
                            <Dropdown.Item onClick={exportToCSV}>
                                <i className="uil uil-download-alt mr-2"></i>Download Data
                            </Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
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
