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
    FormGroup,
    Spinner,
} from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import DatePicker from 'react-datepicker';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRangeStore } from '../../store/DateRangeStore';
import { faXmark, faEllipsisV, faPowerOff, faTrash } from '@fortawesome/pro-regular-svg-icons';
import {
    BaseUrl,
    builidingAlerts,
    equipmentGraphData,
    updateEquipment,
    listSensor,
    sensorGraphData,
} from '../../services/Network';
import axios from 'axios';
import { percentageHandler, convert24hourTo12HourFormat, dateFormatHandler } from '../../utils/helper';
import BrushChart from '../charts/BrushChart';
import { faAngleRight, faAngleDown, faAngleUp, faPlus } from '@fortawesome/pro-solid-svg-icons';
import { Cookies } from 'react-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import {
    generalEquipments,
    getLocation,
    equipmentType,
    createEquipment,
    getEndUseId,
    searchEquipment,
} from '../../services/Network';
import { ComponentStore } from '../../store/ComponentStore';
import { ChevronDown, Search } from 'react-feather';
import './style.css';
import moment from 'moment';
import { TagsInput } from 'react-tag-input-component';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import SocketLogo from '../../assets/images/active-devices/Sockets.svg';
import UnionLogo from '../../assets/images/active-devices/Union.svg';
import { MultiSelect } from 'react-multi-select-component';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { CSVLink } from 'react-csv';
import { result } from 'lodash';

const EquipmentDeviceChartModel = ({
    showChart,
    handleChartClose,
    showWindow,
    equipData,
    equipmentTypeData,
    endUse,
    fetchEquipmentData,
    deviceType,
    locationData,
}) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    console.log(equipData);

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
    const [metricClass, setMetricClass] = useState('mr-3 single-passive-tab-active tab-switch');
    const [configureClass, setConfigureClass] = useState('mr-3 single-passive-tab tab-switch');
    const [historyClass, setHistoryClass] = useState('mr-3 single-passive-tab tab-switch');
    const [selected, setSelected] = useState([]);
    const [selectedZones, setSelectedZones] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [updateEqipmentData, setUpdateEqipmentData] = useState({});
    const [showTab, setShowTab] = useState('');
    const [selectedConsumption, setConsumption] = useState(metric[0].value);
    const [sensorData, setSensorData] = useState([]);

    const [isSensorChartLoading, setIsSensorChartLoading] = useState(false);

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
    const CONVERSION_ALLOWED_UNITS = ['mV', 'mAh', 'power'];
    const UNIT_DIVIDER = 1000;
    const getRequiredConsumptionLabel = (value) => {
        let label = '';

        metric.map((m) => {
            if (m.value === value) {
                label = m.label;
            }

            return m;
        });

        return label;
    };

    useEffect(() => {
        const setCustomDate = (date) => {
            let endCustomDate = new Date(); // today
            let startCustomDate = new Date();
            startCustomDate.setDate(startCustomDate.getDate() - date);
            endCustomDate.setDate(endCustomDate.getDate());

            setDateRange([startCustomDate, endCustomDate]);

            DateRangeStore.update((s) => {
                s.dateFilter = date;
                s.startDate = startCustomDate;
                s.endDate = endCustomDate;
            });

            // let estr = endCustomDate.getFullYear() + '-' + endCustomDate.getMonth() + '-' + endCustomDate.getDate();
            // let sstr =
            //     startCustomDate.getFullYear() + '-' + startCustomDate.getMonth() + '-' + startCustomDate.getDate();
            // setEDateStr(estr);
            // setSDateStr(sstr);
        };

        setCustomDate(dateFilter);
    }, [dateFilter]);
    const exploreDataFetch = async () => {
        try {
            console.log(sensorData.length);
            if (equipData.equipments_id === undefined) {
                return;
            }
            setIsSensorChartLoading(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?equipment_id=${equipData.equipments_id}&consumption=${selectedConsumption}`;
            await axios
                .post(
                    `${BaseUrl}${equipmentGraphData}${params}`,
                    {
                        date_from: startDate,
                        date_to: endDate,
                    },
                    { headers }
                )
                .then((res) => {
                    let response = res.data;
                    let data = response;
                    let exploreData = [];

                    let recordToInsert = {
                        data: data,
                        name: getRequiredConsumptionLabel(selectedConsumption),
                    };
                    try {
                        recordToInsert.data = recordToInsert.data.map((_data) => {
                            _data[0] = new Date(_data[0]);
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
                    setIsSensorChartLoading(false);
                });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Sensor Graph data');
        }
    };
    const buildingAlertsData = async () => {
        if (startDate === null) {
            return;
        }

        if (endDate === null) {
            return;
        }
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
                        date_from: startDate,
                        date_to: endDate,
                    },
                    { headers }
                )
                .then((res) => {
                    setBuildingAlerts(res.data);
                    // console.log('Building Alert => ', res.data);
                });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Building Alert Data');
        }
    };

    useEffect(() => {
        if (startDate === null) {
            return;
        }

        if (endDate === null) {
            return;
        }

        if (sensorData.length !== 0) {
            exploreDataFetch();
            buildingAlertsData();
        }
    }, [startDate, endDate, selectedConsumption]);

    useEffect(() => {
        if (showWindow === 'configure') {
            setShowTab('configure');
            setConfigureClass('mr-3 single-passive-tab-active tab-switch');
            setMetricClass('mr-3 single-passive-tab tab-switch');
            setHistoryClass('mr-3 single-passive-tab tab-switch');
        }
        if (showWindow === 'metrics') setShowTab('metrics');
        //exploreDataFetch();
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
                    return moment(timestamp).format('DD/MMM - HH:mm');
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
        tooltip: {
            x: {
                show: true,
                format: 'MM/dd HH:mm',
            },
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
            toolbar: {
                show: false,
            },

            selection: {
                enabled: true,
                // xaxis: {
                //     min: new Date('19 July 2022').getTime(),
                //     max: new Date('20 July 2022').getTime(),
                // },
            },
            animations: {
                enabled: false,
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

    const getCSVLinkData = () => {
        // console.log("csv entered");
        let arr = seriesData.length > 0 ? seriesData[0].data : [];
        // console.log(arr);
        // console.log(sData);
        let streamData = seriesData.length > 0 ? seriesData[0].data : [];

        // streamData.unshift(['Timestamp', selectedConsumption])

        return [['timestamp', selectedConsumption], ...streamData];
    };
    //Single Active Equipment Manipulation

    useEffect(() => {
        const fetchActiveDeviceSensorData = async () => {
            console.log(equipData);
            if (equipData !== null) {
                console.log(equipData.device_type);
                if (equipData.device_type === 'passive' || equipData.device_id === '') {
                    return;
                }
            }
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${equipData.device_id}`;
                axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setSensors(response);
                    let sensorId = response.find(
                        ({ equipment_type_name }) => equipment_type_name === equipData.equipments_type
                    );
                    console.log(sensorId);
                    setSensorData(sensorId);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Active device sensor data');
            }
        };
        console.log(equipData !== null ? equipData.device_type : '');
        if (equipData !== null) {
            if (equipData.device_type !== 'passive') {
                // fetchActiveDeviceSensorData();
            }
            // exploreDataFetch();
        }
    }, [equipData]);
    var result = [];
    if (equipData !== null && equipData !== undefined) {
        if (equipmentTypeData !== undefined)
            result = equipmentTypeData.find(({ equipment_type }) => equipment_type === equipData.equipments_type);
        // var x=document.getElementById('endUsePop');
        // console.log(x);
        // if(x!==null)
        // x.value=result.end_use_name;
        // console.log(result);
    }
    console.log(equipData);
    const handleSwitch = (val) => {
        switch (val) {
            case 'metrics':
                setShowTab('metrics');
                setMetricClass('mr-3 single-passive-tab-active tab-switch');
                setConfigureClass('mr-3 single-passive-tab tab-switch');
                setHistoryClass('mr-3 single-passive-tab tab-switch');
                break;
            case 'configure':
                setShowTab('configure');
                setMetricClass('mr-3 single-passive-tab tab-switch');
                setConfigureClass('mr-3 single-passive-tab-active tab-switch');
                setHistoryClass('mr-3 single-passive-tab tab-switch');
                break;
            case 'history':
                setShowTab('history');
                setMetricClass('mr-3 single-passive-tab tab-switch');
                setConfigureClass('mr-3 single-passive-tab tab-switch');
                setHistoryClass('mr-3 single-passive-tab-active tab-switch');
                break;
        }
    };
    const handleChange = (key, value) => {
        let obj = Object.assign({}, updateEqipmentData);
        if (key === 'equipment_type') {
            const result1 = equipmentTypeData.find(({ equipment_id }) => equipment_id === value);
            // console.log(result1.end_use_name);
            const eq_id = endUse.find(({ name }) => name === result1.end_use_name);
            // console.log(eq_id);
            if (deviceType === 'passive') {
                var x = document.getElementById('endUsePop');
                x.value = eq_id.end_user_id;
            }
            obj['end_use'] = eq_id.end_user_id;
        }
        obj[key] = value;
        // console.log(obj);
        setUpdateEqipmentData(obj);
    };
    const handleSave = () => {
        try {
            let obj = Object.assign({}, updateEqipmentData);
            obj['tag'] = selected;
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?equipment_id=${equipData.equipments_id}`;
            axios
                .post(`${BaseUrl}${updateEquipment}${params}`, obj, {
                    headers: header,
                })
                .then((res) => {
                    // console.log(res.data);
                    fetchEquipmentData();
                    handleChartClose();
                });
        } catch (error) {
            console.log('Failed to update Passive device data');
        }
    };

    return (
        <Modal show={showChart} onHide={handleChartClose} dialogClassName="modal-container-style" centered>
            {deviceType === 'active' ? (
                <>
                    <Modal.Body>
                        <Row>
                            <Col lg={12}>
                                <h6 className="text-muted">{`${equipData !== null ? equipData.location : ''} > ${
                                    equipData !== null ? equipData.equipments_type : ''
                                }`}</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={9}>
                                <div>
                                    <span className="heading-style">
                                        {equipData !== null ? equipData.equipments_type : ''}
                                    </span>
                                </div>
                            </Col>
                            <Col lg={3}>
                                <div className="button-wrapper">
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-md btn-outline-danger font-weight-bold mr-4">
                                            <FontAwesomeIcon icon={faPowerOff} size="lg" style={{ color: 'red' }} />{' '}
                                            Turn Off
                                        </button>
                                    </div>

                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-md btn-light font-weight-bold mr-4"
                                            onClick={(e) => {
                                                handleChartClose();
                                                setSensorData([]);
                                            }}>
                                            Cancel
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-md btn-primary font-weight-bold mr-4"
                                            onClick={handleSave}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                </>
            ) : (
                ''
            )}
            {deviceType === 'passive' ? (
                <>
                    <Modal.Body>
                        <Row>
                            <Col lg={12}>
                                <h6 className="text-muted">{`Floor 1 > 252 > ${
                                    equipData !== null ? equipData.equipments_type : ''
                                }`}</h6>
                            </Col>
                        </Row>
                        <Row>
                            <Col lg={9}>
                                <div>
                                    <span className="heading-style">
                                        {equipData !== null ? equipData.equipments_type : ''}
                                    </span>
                                </div>
                            </Col>
                            <Col lg={3}>
                                <div className="button-wrapper">
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-md btn-light font-weight-bold mr-4"
                                            onClick={(e) => {
                                                handleChartClose();
                                                setSensorData([]);
                                            }}>
                                            Cancel
                                        </button>
                                    </div>
                                    <div>
                                        <button
                                            type="button"
                                            className="btn btn-md btn-primary font-weight-bold mr-4"
                                            onClick={handleSave}>
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Modal.Body>
                </>
            ) : (
                ''
            )}
            <div className="nav-header-container">
                <div className="passive-page-header">
                    <div className="mt-2 single-passive-tabs-style">
                        <button
                            className={metricClass}
                            onClick={(e) => {
                                handleSwitch('metrics');
                                exploreDataFetch();
                                buildingAlertsData();
                            }}>
                            Metrics
                        </button>
                        <button
                            className={configureClass}
                            onClick={(e) => {
                                handleSwitch('configure');
                            }}>
                            Configure
                        </button>
                        <button
                            className={historyClass}
                            onClick={(e) => {
                                handleSwitch('history');
                            }}>
                            History
                        </button>
                    </div>
                </div>
            </div>
            {showTab === 'metrics' ? (
                <Modal.Body>
                    <Row>
                        <Col lg={4}>
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
                                                            <div className="float-right ml-4 alert-weekday">
                                                                Yesterday
                                                            </div>
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
                                                            <span className="alert-content">
                                                                80 Run Hours in 45 days
                                                            </span>
                                                            <div className="float-right ml-4 alert-weekday">
                                                                Yesterday
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </>
                                        );
                                    })}
                                </div>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className="model-sensor-filters">
                                <div className="">
                                    <Input
                                        type="select"
                                        name="select"
                                        id="exampleSelect"
                                        onChange={(e) => {
                                            if (e.target.value === 'passive-power') {
                                                return;
                                            }
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
                                            setDateFilter(+e.target.value);
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
                                                <i className="uil uil-calendar-alt mr-2"></i>Configure Column
                                            </Dropdown.Item>

                                            <div className="mr-3">
                                                <CSVLink
                                                    style={{ color: 'black', paddingLeft: '1.5rem' }}
                                                    filename={`active-device-${selectedConsumption}-${new Date().toUTCString()}.csv`}
                                                    target="_blank"
                                                    data={getCSVLinkData()}>
                                                    <i className="uil uil-download-alt mr-2"></i>
                                                    Download CSV
                                                </CSVLink>
                                            </div>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                            </div>

                            {isSensorChartLoading ? (
                                <div className="loader-center-style">
                                    <Spinner className="m-2" color={'primary'} />
                                </div>
                            ) : (
                                <div>
                                    <BrushChart
                                        seriesData={deviceData}
                                        optionsData={options}
                                        seriesLineData={seriesData}
                                        optionsLineData={optionsLine}
                                    />
                                </div>
                            )}
                        </Col>
                    </Row>
                </Modal.Body>
            ) : (
                ''
            )}
            {showTab === 'configure' && deviceType === 'active' ? (
                <Modal.Body>
                    <Row>
                        <Col lg={8}>
                            <Row>
                                <Col lg={12}>
                                    <h4>Equipment Details</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={6}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Equipment Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Equipment Name"
                                            className="font-weight-bold"
                                            defaultValue={equipData !== null ? equipData.equipments_name : ''}
                                            onChange={(e) => {
                                                handleChange('name', e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col lg={6}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Equipment Type</Form.Label>
                                        <Input
                                            type="select"
                                            name="select"
                                            id="exampleSelect"
                                            className="font-weight-bold"
                                            defaultValue={result.length === 0 ? '' : result.equipment_id}
                                            onChange={(e) => {
                                                handleChange('equipment_type', e.target.value);
                                            }}>
                                            <option selected>Select Type</option>
                                            {equipmentTypeData.map((record) => {
                                                return (
                                                    <option value={record.equipment_id}>{record.equipment_type}</option>
                                                );
                                            })}
                                        </Input>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Equipment Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            readOnly
                                            placeholder="Enter Location"
                                            className="font-weight-bold"
                                            value={equipData !== null ? equipData.location : ''}
                                        />
                                        <Form.Label>Location this equipment is installed in.</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Applied Rule</Form.Label>
                                        <Input
                                            type="select"
                                            name="select"
                                            id="exampleSelect"
                                            className="font-weight-bold">
                                            <option selected>Desktop PC</option>
                                            <option>Refigerator</option>
                                        </Input>
                                        <Form.Label>
                                            The rule applied to this equipment to control when it is on.
                                        </Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Tags</Form.Label>
                                        <TagsInput
                                            value={equipData !== null ? equipData.tags : ''}
                                            onChange={setSelected}
                                            name="tag"
                                            placeHolder="+ Add Tag"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Notes</Form.Label>
                                        <Input
                                            type="textarea"
                                            name="text"
                                            id="exampleText"
                                            rows="3"
                                            placeholder="Enter a Note..."
                                            defaultValue={equipData !== null ? equipData.note : ''}
                                            onChange={(e) => {
                                                handleChange('note', e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={4}>
                            <div className="modal-right-container">
                                <div className="equip-socket-container">
                                    <div className="mt-2 sockets-slots-container">
                                        {sensors.map((record, index) => {
                                            return (
                                                <>
                                                    {record.status && (
                                                        <div>
                                                            <div className="power-off-style">
                                                                <FontAwesomeIcon
                                                                    icon={faPowerOff}
                                                                    size="lg"
                                                                    color="#3C6DF5"
                                                                />
                                                            </div>
                                                            {record.equipment_type_id === '' ? (
                                                                <div className="socket-rect">
                                                                    <img src={SocketLogo} alt="Socket" />
                                                                </div>
                                                            ) : (
                                                                <div className="online-socket-container">
                                                                    <img
                                                                        src={UnionLogo}
                                                                        alt="Union"
                                                                        className="union-icon-style"
                                                                        width="35vw"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}

                                                    {!record.status && (
                                                        <div>
                                                            <div className="power-off-style">
                                                                <FontAwesomeIcon
                                                                    icon={faPowerOff}
                                                                    size="lg"
                                                                    color="#EAECF0"
                                                                />
                                                            </div>
                                                            {record.equipment_type_id === '' ? (
                                                                <div className="socket-rect">
                                                                    <img src={SocketLogo} alt="Socket" />
                                                                </div>
                                                            ) : (
                                                                <div className="online-socket-container">
                                                                    <img
                                                                        src={UnionLogo}
                                                                        alt="Union"
                                                                        className="union-icon-style"
                                                                        width="35vw"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className="modal-right-card mt-2">
                                    <span className="modal-right-card-title">Power Strip Socket 2</span>
                                    <Link
                                        to={{
                                            pathname:
                                                equipData !== null
                                                    ? equipData.device_id !== ''
                                                        ? `/settings/active-devices/single/${equipData.device_id}`
                                                        : `equipment/#`
                                                    : '',
                                        }}>
                                        <button
                                            type="button"
                                            class="btn btn-light btn-md font-weight-bold float-right mr-2"
                                            disabled={
                                                equipData !== null ? (equipData.device_id === '' ? true : false) : true
                                            }>
                                            View Devices
                                        </button>
                                    </Link>
                                </div>
                                <div>
                                    {equipData !== null
                                        ? equipData.status === 'Online' && (
                                              <div className="icon-bg-pop-styling">
                                                  ONLINE <i className="uil uil-wifi mr-1 icon-styling"></i>
                                              </div>
                                          )
                                        : ''}
                                    {equipData !== null
                                        ? equipData.status === 'Offline' && (
                                              <div className="icon-bg-pop-styling-slash">
                                                  OFFLINE <i className="uil uil-wifi-slash mr-1 icon-styling"></i>
                                              </div>
                                          )
                                        : ''}
                                </div>
                                <div className="mt-4 modal-right-group">
                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                MAC Address
                                            </h6>
                                            <h6 className="card-title">
                                                {equipData !== null ? equipData.device_mac : ''}
                                            </h6>
                                        </div>
                                    </FormGroup>
                                    <FormGroup>
                                        <div className="single-line-style">
                                            <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                                Device type
                                            </h6>
                                            <h6 className="card-title">
                                                {equipData !== null ? equipData.device_type : ''}
                                            </h6>
                                        </div>
                                    </FormGroup>
                                </div>
                                <FormGroup>
                                    <div className="single-line-style">
                                        <h6 className="card-subtitle mb-2 text-muted" htmlFor="customSwitches">
                                            Installed at
                                        </h6>
                                        <h6 className="card-title">
                                            {equipData !== null ? equipData.device_location : ''}
                                        </h6>
                                    </div>
                                </FormGroup>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            ) : (
                ''
            )}
            {showTab === 'configure' && deviceType === 'passive' ? (
                <Modal.Body>
                    <Row>
                        <Col lg={8}>
                            <Row>
                                <Col lg={12}>
                                    <h4>Equipment Details</h4>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={4}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Equipment Name</Form.Label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Enter Equipment Name"
                                            className="font-weight-bold"
                                            defaultValue={equipData !== null ? equipData.equipments_name : ''}
                                            onChange={(e) => {
                                                handleChange('name', e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                                <Col lg={4}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Equipment Type</Form.Label>
                                        <Input
                                            type="select"
                                            name="select"
                                            id="exampleSelect"
                                            className="font-weight-bold"
                                            defaultValue={result.length === 0 ? '' : result.equipment_id}
                                            onChange={(e) => {
                                                handleChange('equipment_type', e.target.value);
                                            }}>
                                            <option selected>Select Type</option>
                                            {equipmentTypeData.map((record) => {
                                                return (
                                                    <option value={record.equipment_id}>{record.equipment_type}</option>
                                                );
                                            })}
                                        </Input>
                                    </Form.Group>
                                </Col>
                                <Col lg={4}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>End Use Category</Form.Label>
                                        <Input
                                            type="select"
                                            name="select"
                                            id="endUsePop"
                                            className="font-weight-bold"
                                            defaultValue={result.length === 0 ? '' : result.end_use_id}>
                                            <option selected>Select Category</option>
                                            {endUse.map((record) => {
                                                return <option value={record.end_user_id}>{record.name}</option>;
                                            })}
                                        </Input>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Equipment Location</Form.Label>
                                        <Input
                                            type="select"
                                            name="select"
                                            id="exampleSelect"
                                            className="font-weight-bold"
                                            // defaultValue={loc.length===0?"":loc.location_id}
                                            onChange={(e) => {
                                                handleChange('space_id', e.target.value);
                                            }}>
                                            <option value="" selected>
                                                Select Location
                                            </option>
                                            {locationData.map((record) => {
                                                return (
                                                    <option value={record.location_id}>{record.location_name}</option>
                                                );
                                            })}
                                        </Input>
                                        <Form.Label>Location this equipment is installed in.</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Serves Zones</Form.Label>
                                        <TagsInput
                                            value={selectedZones}
                                            onChange={setSelectedZones}
                                            name="Zones"
                                            placeHolder="+ Add Location"
                                        />
                                        <Form.Label>What area this piece of equipment services.</Form.Label>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Tags</Form.Label>
                                        <TagsInput
                                            value={equipData !== null ? equipData.tags : ''}
                                            onChange={setSelected}
                                            name="tag"
                                            placeHolder="+ Add Tag"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={12}>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                        <Form.Label>Notes</Form.Label>
                                        <Input
                                            type="textarea"
                                            name="text"
                                            id="exampleText"
                                            rows="3"
                                            placeholder="Enter a Note..."
                                            defaultValue={equipData !== null ? equipData.note : ''}
                                            onChange={(e) => {
                                                handleChange('note', e.target.value);
                                            }}
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Col>
                        <Col lg={4}>
                            <div className="modal-right-container">
                                <div className="pic-container">
                                    <div className="modal-right-pic"></div>
                                    <div className="modal-right-card mt-2" style={{ padding: '1rem' }}>
                                        <span className="modal-right-card-title">Energy Monitoring</span>

                                        <Link
                                            to={{
                                                pathname:
                                                    equipData !== null
                                                        ? equipData.device_id !== ''
                                                            ? `/settings/passive-devices/single/${equipData.device_id}`
                                                            : `equipment/#`
                                                        : '',
                                            }}>
                                            <button
                                                type="button"
                                                class="btn btn-light btn-md font-weight-bold float-right mr-2">
                                                View
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Modal.Body>
            ) : (
                ''
            )}
        </Modal>
    );
};

export default EquipmentDeviceChartModel;
