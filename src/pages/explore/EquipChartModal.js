import React, { useEffect, useState } from 'react';
import { Row, Col, Input, FormGroup, Spinner } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { faEllipsisV, faPowerOff } from '@fortawesome/pro-regular-svg-icons';
import {
    BaseUrl,
    builidingAlerts,
    equipmentGraphData,
    updateEquipment,
    listSensor,
    equipmentDetails,
    getExploreEquipmentYTDUsage,
    getEndUseId,
    equipmentType,
    getLocation,
} from '../../services/Network';
import axios from 'axios';
import BrushChart from '../charts/BrushChart';
import { Cookies } from 'react-cookie';
import Dropdown from 'react-bootstrap/Dropdown';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { TagsInput } from 'react-tag-input-component';
import SocketLogo from '../../assets/images/active-devices/Sockets.svg';
import UnionLogo from '../../assets/images/active-devices/Union.svg';
import 'react-loading-skeleton/dist/skeleton.css';
import { CSVLink } from 'react-csv';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRangeStore } from '../../store/DateRangeStore';
import ModalHeader from '../../components/ModalHeader';
import './style.css';

const EquipChartModal = ({
    showEquipmentChart,
    handleChartOpen,
    equipData,
    handleChartClose,
    fetchEquipmentData,
    showWindow,
    equipmentFilter,
}) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const bldgId = localStorage.getItem('exploreBldId');

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));

    const [isEquipDataFetched, setIsEquipDataFetched] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const metric = [
        { value: 'energy', label: 'Energy (kWh)', unit: 'kWh' },
        { value: 'power', label: 'Power (W)', unit: 'W' },
        // { value: 'carbon-emissions', label: 'Carbon Emissions' },
    ];

    const [selectedUnit, setSelectedUnit] = useState(metric[0].unit);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);
    const [endUse, setEndUse] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
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
    const [equipmentData, setEquipmentData] = useState({});
    const [equipResult, setEquipResult] = useState([]);
    const [buildingAlert, setBuildingAlerts] = useState([]);
    const [equipFilter, setEquipFilter] = useState(equipmentFilter);
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

    const handleUnitChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedUnit(obj.unit);
        console.log(obj.unit);
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
                });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Building Alert Data');
        }
    };

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
        let endDate = new Date(); // today
        let startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);
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
            //@TODO NEED?
            // enabled: false,
            shared: false,
            intersect: false,
            style: {
                fontSize: '12px',
                fontFamily: 'Inter, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
            x: {
                show: true,
                type: 'datetime',
                labels: {
                    formatter: function (val, timestamp) {
                        return moment(timestamp).format('DD/MM - HH:mm');
                    },
                },
            },
            y: {
                formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                    return value;
                },
            },
            marker: {
                show: false,
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const { seriesX } = w.globals;
                const timestamp = new Date(seriesX[seriesIndex][dataPointIndex]);

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="line-chart-widget-tooltip-value">${
                            w.config.series[0].unit === 'kWh'
                                ? series[seriesIndex][dataPointIndex].toFixed(3)
                                : series[seriesIndex][dataPointIndex].toFixed(3)
                        } 
                         ${w.config.series[0].unit}</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment(timestamp).format(
                            `MMM D 'YY @ HH:mm`
                        )}</div>
                    </div>`;
            },
        },
    });

    // const [seriesLine, setSeriesLine] = useState([
    //     {
    //         data: [
    //             [1650874614695, 784.55],
    //             [1650874694654, 169],
    //             [1650782931595, 210],
    //             [1650874587699, 825],
    //             [1650955774141, 234.55],
    //             [1650874722069, 240],
    //             [1650874733485, 989.55],
    //         ],
    //     },
    // ]);

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

        return [['timestamp', `${selectedConsumption} ${selectedUnit}`], ...streamData];
    };
    //Single Active Equipment Manipulation

    //let equipResult = [];

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
        // let obj = Object.assign({}, updateEqipmentData);
        // if (key === 'equipment_type') {
        //     const result1 = equipmentTypeData.find(({ equipment_id }) => equipment_id === value);
        //     // console.log(result1.end_use_name);
        //     const eq_id = endUse.find(({ name }) => name === result1.end_use_name);
        //     // console.log(eq_id);
        //     if (deviceType === 'passive') {
        //         var x = document.getElementById('endUsePop');
        //         x.value = eq_id.end_user_id;
        //     }
        //     obj['end_use'] = eq_id.end_user_id;
        // }
        // obj[key] = value;
        // // console.log(obj);
        // setUpdateEqipmentData(obj);
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
            let params = `?equipment_id=${equipData?.equipments_id}`;
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

    useEffect(() => {
        console.log(equipmentFilter);
        if (!equipmentFilter?.equipment_id) {
            return;
        }
        if (startDate === null) {
            return;
        }

        if (endDate === null) {
            return;
        }

        if (sensorData.length !== 0) {
            buildingAlertsData();
        }
        fetchEquipmentChart(equipmentFilter?.equipment_id);
    }, [endDate, selectedConsumption]);
    const fetchEquipmentChart = async (equipId) => {
        try {
            setIsEquipDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let params = `?equipment_id=${equipId}&consumption=${selectedConsumption}&divisible_by=1000`;
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
                    let data = response.data;
                    let exploreData = [];
                    let recordToInsert = {
                        data: data,
                        name: 'AHUs',
                        unit: selectedUnit,
                    };
                    exploreData.push(recordToInsert);
                    setDeviceData(exploreData);
                    setSeriesData([
                        {
                            data: exploreData[0].data,
                        },
                    ]);
                    setIsEquipDataFetched(false);
                });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Explore Data');
            setIsEquipDataFetched(false);
        }
    };

    useEffect(() => {
        console.log(equipmentFilter);
        if (!equipmentFilter?.equipment_id) {
            return;
        }

        const fetchEquipmentYTDUsageData = async (equipId) => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };

                let params = `?equipment_id=${equipId}&consumption=energy`;

                await axios
                    .post(
                        `${BaseUrl}${getExploreEquipmentYTDUsage}${params}`,
                        {
                            date_from: startDate,
                            date_to: endDate,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res.data;
                        let data = response.data;
                        setTopConsumption(data[0].ytd.ytd);
                        setPeak(data[0].ytd_peak.energy);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
            }
        };
        const fetchEquipmentDetails = async (equipId) => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };

                let params = `/${equipId}`;

                await axios.get(`${BaseUrl}${equipmentDetails}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setEquipmentData(response.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Explore Data');
            }
        };
        const fetchBuildingAlerts = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
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
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building Alert Data');
            }
        };
        const fetchEndUseData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${getEndUseId}`, { headers }).then((res) => {
                    setEndUse(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch End Use Data');
            }
        };

        const fetchEquipTypeData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${equipmentType}${params}`, { headers }).then((res) => {
                    let response = res.data.data;
                    response.sort((a, b) => {
                        return a.equipment_type.localeCompare(b.equipment_type);
                    });
                    setEquipmentTypeData(response);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Equipment Type Data');
            }
        };
        const fetchLocationData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                    setLocationData(res.data);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Location Data');
            }
        };

        fetchEquipmentChart(equipmentFilter?.equipment_id);
        //fetchEquipmentYTDUsageData(equipmentFilter?.equipment_id);
        fetchEquipmentDetails(equipmentFilter?.equipment_id);
        fetchBuildingAlerts();
        fetchEndUseData();
        fetchEquipTypeData();
        fetchLocationData();
    }, [equipmentFilter]);

    useEffect(() => {
        if (equipmentTypeData.lenght === 0) {
            return;
        }
        let res = [];
        res = equipmentTypeData.find(({ equipment_type }) => equipment_type === equipmentData?.equipments_type);
        console.log(res);
        setEquipResult(res);
    }, [equipmentTypeData]);

    useEffect(() => {
        if (equipmentData.length === 0) {
            return;
        }
        const fetchActiveDeviceSensorData = async () => {
            // console.log(equipmentData);
            if (equipmentData !== null) {
                // console.log(equipmentData.device_type);
                if (
                    equipmentData.device_type === 'passive' ||
                    equipmentData.device_id === '' ||
                    equipmentData.device_id === undefined
                ) {
                    return;
                }
            }
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${equipmentData.device_id}`;
                axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    setSensors(response);
                    let sensorId = response.find(
                        ({ equipment_type_name }) => equipment_type_name === equipmentData.equipments_type
                    );
                    // console.log(sensorId);
                    // setSensorData(sensorId);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Active device sensor data');
            }
        };
        if (equipmentData !== null) {
            if (equipmentData.device_type !== 'passive') {
                fetchActiveDeviceSensorData();
            }
        }
    }, [equipmentData]);

    return (
        <Modal show={showEquipmentChart} onHide={handleChartClose} dialogClassName="modal-container-style" centered>
            <>
                <Modal.Body>
                    {equipmentData?.device_type === 'active' ? (
                        <>
                            <Row>
                                <Col lg={12}>
                                    <h6 className="text-muted">
                                        {equipmentData?.location} {'>'} {equipmentData?.equipments_type}
                                    </h6>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={9}>
                                    <div>
                                        <span className="heading-style">{equipmentData?.equipments_name}</span>
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
                                                onClick={() => {
                                                    setSelectedTab(0);
                                                    handleChartClose();
                                                    setEquipResult([]);
                                                }}>
                                                Cancel
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-md btn-primary font-weight-bold mr-4"
                                                onClick={() => {
                                                    setSelectedTab(0);
                                                    handleChartClose();
                                                    setEquipResult([]);
                                                }}>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        ''
                    )}
                    {equipmentData?.device_type === 'passive' ? (
                        <>
                            <Row>
                                <Col lg={12}>
                                    <h6 className="text-muted">
                                        {equipmentData?.location} {'>'} {equipmentData?.equipments_type}
                                    </h6>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={9}>
                                    <div>
                                        <span className="heading-style">{equipmentData?.equipments_name}</span>
                                    </div>
                                </Col>
                                <Col lg={3}>
                                    <div className="button-wrapper">
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-md btn-light font-weight-bold mr-4"
                                                onClick={() => {
                                                    setSelectedTab(0);
                                                    handleChartClose();
                                                    setEquipResult([]);
                                                }}>
                                                Cancel
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-md btn-primary font-weight-bold mr-4"
                                                onClick={() => {
                                                    setSelectedTab(0);
                                                    handleChartClose();
                                                    setEquipResult([]);
                                                }}>
                                                Save
                                            </button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </>
                    ) : (
                        ''
                    )}
                    <div className="mt-2 mouse-pointer">
                        <span
                            className={selectedTab === 0 ? 'mr-3 equip-tab-active' : 'mr-3 equip-tab'}
                            onClick={() => setSelectedTab(0)}>
                            Metrics
                        </span>
                        <span
                            className={selectedTab === 1 ? 'mr-3 equip-tab-active' : 'mr-3 equip-tab'}
                            onClick={() => setSelectedTab(1)}>
                            Configure
                        </span>
                        <span
                            className={selectedTab === 2 ? 'mr-3 equip-tab-active' : 'mr-3 equip-tab'}
                            onClick={() => setSelectedTab(2)}>
                            History
                        </span>
                    </div>

                    {selectedTab === 0 && (
                        <Row className="mt-2">
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
                                                                <div className="float-right ml-4 alert-weekday">
                                                                    Today
                                                                </div>
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
                                    <div>
                                        <Input
                                            type="select"
                                            name="select"
                                            id="exampleSelect"
                                            onChange={(e) => {
                                                if (e.target.value === 'passive-power') {
                                                    return;
                                                }
                                                setConsumption(e.target.value);
                                                handleUnitChange(e.target.value);
                                            }}
                                            className="font-weight-bold model-sensor-energy-filter mr-2"
                                            style={{ display: 'inline-block', width: 'fit-content' }}
                                            defaultValue={selectedConsumption}>
                                            {metric.map((record, index) => {
                                                return <option value={record.value}>{record.label}</option>;
                                            })}
                                        </Input>
                                    </div>

                                    <ModalHeader />

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

                                {isEquipDataFetched ? (
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
                    )}

                    {selectedTab === 1 ? (
                        equipmentData?.device_type === 'passive' ? (
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
                                                    defaultValue={equipmentData?.equipments_name}
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
                                                    defaultValue={equipResult?.equipment_id}
                                                    onChange={(e) => {
                                                        handleChange('equipment_type', e.target.value);
                                                    }}>
                                                    <option selected>Select Type</option>
                                                    {equipmentTypeData?.map((record) => {
                                                        return (
                                                            <option value={record?.equipment_id}>
                                                                {record?.equipment_type}
                                                            </option>
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
                                                    defaultValue={equipResult?.end_use_id}>
                                                    <option selected>Select Category</option>
                                                    {endUse?.map((record) => {
                                                        return (
                                                            <option value={record?.end_user_id}>{record?.name}</option>
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
                                                    {locationData?.map((record) => {
                                                        return (
                                                            <option value={record?.location_id}>
                                                                {record?.location_name}
                                                            </option>
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
                                                    value={equipmentData !== null ? equipmentData?.tags : ''}
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
                                                    defaultValue={equipmentData !== null ? equipmentData?.note : ''}
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
                                                            equipmentData !== null
                                                                ? equipmentData?.device_id !== ''
                                                                    ? `/settings/passive-devices/single/${equipmentData?.device_id}`
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
                        ) : (
                            ''
                        )
                    ) : (
                        ''
                    )}

                    {selectedTab === 1 ? (
                        equipmentData?.device_type === 'active' ? (
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
                                                    defaultValue={equipmentData?.equipments_name}
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
                                                    defaultValue={
                                                        equipResult.length === 0 ? '' : equipResult.equipment_id
                                                    }
                                                    onChange={(e) => {
                                                        handleChange('equipment_type', e.target.value);
                                                    }}>
                                                    <option selected>Select Type</option>
                                                    {equipmentTypeData.map((record) => {
                                                        return (
                                                            <option value={record.equipment_id}>
                                                                {record.equipment_type}
                                                            </option>
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
                                                    value={equipmentData !== null ? equipmentData.location : ''}
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
                                                    value={equipmentData !== null ? equipmentData.tags : ''}
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
                                                    defaultValue={equipmentData !== null ? equipmentData?.note : ''}
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
                                                        equipmentData !== null
                                                            ? equipmentData.device_id !== ''
                                                                ? `/settings/active-devices/single/${equipmentData.device_id}`
                                                                : `equipment/#`
                                                            : '',
                                                }}>
                                                <button
                                                    type="button"
                                                    class="btn btn-light btn-md font-weight-bold float-right mr-2"
                                                    disabled={
                                                        equipmentData !== null
                                                            ? equipmentData.device_id === ''
                                                                ? true
                                                                : false
                                                            : true
                                                    }>
                                                    View Devices
                                                </button>
                                            </Link>
                                        </div>
                                        <div>
                                            {equipmentData !== null
                                                ? equipmentData.status === 'Online' && (
                                                      <div className="icon-bg-pop-styling">
                                                          ONLINE <i className="uil uil-wifi mr-1 icon-styling"></i>
                                                      </div>
                                                  )
                                                : ''}
                                            {equipmentData !== null
                                                ? equipmentData.status === 'Offline' && (
                                                      <div className="icon-bg-pop-styling-slash">
                                                          OFFLINE{' '}
                                                          <i className="uil uil-wifi-slash mr-1 icon-styling"></i>
                                                      </div>
                                                  )
                                                : ''}
                                        </div>
                                        <div className="mt-4 modal-right-group">
                                            <FormGroup>
                                                <div className="single-line-style">
                                                    <h6
                                                        className="card-subtitle mb-2 text-muted"
                                                        htmlFor="customSwitches">
                                                        MAC Address
                                                    </h6>
                                                    <h6 className="card-title">
                                                        {equipmentData !== null ? equipmentData.device_mac : ''}
                                                    </h6>
                                                </div>
                                            </FormGroup>
                                            <FormGroup>
                                                <div className="single-line-style">
                                                    <h6
                                                        className="card-subtitle mb-2 text-muted"
                                                        htmlFor="customSwitches">
                                                        Device type
                                                    </h6>
                                                    <h6 className="card-title">
                                                        {equipmentData !== null ? equipmentData.device_type : ''}
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
                                                    {equipmentData !== null ? equipmentData.device_location : ''}
                                                </h6>
                                            </div>
                                        </FormGroup>
                                    </div>
                                </Col>
                            </Row>
                        ) : (
                            ''
                        )
                    ) : (
                        ''
                    )}
                </Modal.Body>
            </>
        </Modal>
    );
};

export default EquipChartModal;
