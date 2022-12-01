import React, { useEffect, useState } from 'react';
import { Row, Col, Input, FormGroup, Spinner } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DateRangeStore } from '../../store/DateRangeStore';
import { faEllipsisV, faPowerOff, faArrowUpFromSquare } from '@fortawesome/pro-regular-svg-icons';
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
import { getFormattedTimeIntervalData } from '../../helpers/formattedChartData';import axios from 'axios';
import BrushChart from '../charts/BrushChart';
import { Cookies } from 'react-cookie';
import { useHistory } from 'react-router-dom';
import moment from 'moment';
import 'moment-timezone';
import { TagsInput } from 'react-tag-input-component';
import { BuildingStore } from '../../store/BuildingStore';
import SocketLogo from '../../assets/images/active-devices/Sockets.svg';
import DoubleBreakerUninked from '../../assets/images/equip-modal/Double_Breaker_Unlinked.svg';
import UnionLogo from '../../assets/images/active-devices/Union.svg';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import Header from '../../components/Header';
import { formatConsumptionValue, xaxisFilters } from '../../helpers/helpers';
import Button from '../../sharedComponents/button/Button';
import './style.css';
import { equipOptions, equipOptionsLines } from '../../helpers/ChartOption';
import { apiRequestBody } from '../../helpers/helpers';
import Select from '../../sharedComponents/form/select';

const EquipChartModal = ({
    showEquipmentChart,
    handleChartClose,
    fetchEquipmentData,
    equipmentFilter,
    selectedTab,
    setSelectedTab,
    activePage,
}) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const history = useHistory();

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const [isEquipDataFetched, setIsEquipDataFetched] = useState(false);

    const metric = [
        { value: 'energy', label: 'Energy (kWh)', unit: 'kWh', Consumption: 'Energy' },
        { value: 'power', label: 'Power (W)', unit: 'W', Consumption: 'Power' },
        { value: 'rmsCurrentMilliAmps', label: 'Current (A)', unit: 'A', Consumption: 'Current' },
    ];

    const [selectedUnit, setSelectedUnit] = useState(metric[0].unit);
    const [selectedConsumptionLabel, setSelectedConsumptionLabel] = useState(metric[0].Consumption);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);
    const [endUse, setEndUse] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [seriesData, setSeriesData] = useState([]);
    const [isYtdDataFetching, setIsYtdDataFetching] = useState(false);
    const [ytdData, setYtdData] = useState({});
    const [selected, setSelected] = useState([]);
    const [selectedZones, setSelectedZones] = useState([]);
    const [sensors, setSensors] = useState([]);
    const [updateEqipmentData, setUpdateEqipmentData] = useState({});
    const [isDataChanged, setDataChanged] = useState(false);
    const [defaultEquipData, setDefaultEquipData] = useState({});
    const [selectedConsumption, setConsumption] = useState(metric[0].value);
    const [sensorData, setSensorData] = useState([]);
    const [equipmentData, setEquipmentData] = useState({});
    const [equipBreakerLink, setEquipBreakerLink] = useState([]);
    const [equipResult, setEquipResult] = useState({});

    const [location, setLocation] = useState('');
    const [equipType, setEquipType] = useState('');

    const [equipmentTypeDataNow, setEquipmentTypeDataNow] = useState([]);

    const addEquimentType = () => {
        equipmentTypeData.map((item) => {
            setEquipmentTypeDataNow((el) => [
                ...el,
                { value: `${item?.equipment_id}`, label: `${item?.equipment_type}` },
            ]);
        });
    };

    const [buildingAlert, setBuildingAlerts] = useState([]);

    const handleUnitChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedUnit(obj.unit);
    };
    const handleConsumptionChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedConsumptionLabel(obj.Consumption);
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
                .post(`${BaseUrl}${builidingAlerts}${params}`, apiRequestBody(startDate, endDate, timeZone), {
                    headers,
                })
                .then((res) => {
                    setBuildingAlerts(res.data);
                });
        } catch (error) {}
    };

    const [options, setOptions] = useState(equipOptions(timeZone));

    const [optionsLine, setOptionsLine] = useState(equipOptionsLines);

    const validateDataChange = (key, value) => {
        if (key === 'name') {
            if (defaultEquipData?.equipments_name === value) {
                setDataChanged(false);
                return;
            }
        }
        if (key === 'end_use') {
            if (defaultEquipData?.end_use_id === value) {
                setDataChanged(false);
                return;
            }
        }
        if (key === 'space_id') {
            if (defaultEquipData?.location_id === value) {
                setDataChanged(false);
                return;
            }
        }
        if (key === 'note') {
            if (defaultEquipData?.note === value) {
                setDataChanged(false);
                return;
            }
        }
        if (key === 'equipment_type') {
            if (defaultEquipData?.equipments_type_id === value) {
                setDataChanged(false);
                return;
            }
        }
        if (key === 'tags') {
            if (defaultEquipData?.tags === value) {
                setDataChanged(false);
                return;
            }
        }
        setDataChanged(true);
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, updateEqipmentData);
        let equipObj = Object.assign({}, equipmentData);
        obj[key] = value;
        validateDataChange(key, value);
        if (key === 'space_id') {
            setLocation(value);
        }
        if (key === 'equipment_type') {
            setEquipType(value);
        }
        if (key === 'end_use') {
            equipObj['end_use_id'] = value;
            setEquipmentData(equipObj);
        }
        if (key === 'tags') {
            setSelected(value);
        }
        setUpdateEqipmentData(obj);
    };

    const handleEquipTypeChange = (key, value, deviceType) => {
        let obj = Object.assign({}, updateEqipmentData);
        let equipObj = Object.assign({}, equipmentData);

        if (deviceType === 'passive') {
            let data = equipmentTypeData.find((record) => record?.equipment_id === value);
            obj['end_use'] = data?.end_use_id;
            equipObj['end_use_id'] = data?.end_use_id;
            setEquipmentData(equipObj);
            setEquipType(value);
        }

        if (deviceType === 'active') {
            setEquipType(value);
        }

        obj[key] = value;
        validateDataChange(key, value);
        setUpdateEqipmentData(obj);
    };

    const handleSave = () => {
        try {
            let obj = Object.assign({}, updateEqipmentData);
            if (obj.tags) {
                obj.tag = obj.tags;
                delete obj.tags;
            }
            let header = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?equipment_id=${equipmentData?.equipments_id}`;
            axios
                .post(`${BaseUrl}${updateEquipment}${params}`, obj, {
                    headers: header,
                })
                .then((res) => {
                    let arr = apiRequestBody(startDate, endDate, timeZone);
                    setSelectedTab(0);
                    setEquipResult({});
                    setEquipmentData({});
                    setUpdateEqipmentData({});
                    setDataChanged(false);
                    if (activePage === 'explore') {
                        setSelectedTab(0);
                    }
                    if (activePage === 'equipment') {
                        setSelectedTab(1);
                    }
                    handleChartClose();
                    fetchEquipmentData(arr);
                });
        } catch (error) {}
    };

    const handleCloseWithoutSave = () => {
        handleChartClose();
        setEquipResult({});
        setEquipmentData({});
        setDataChanged(false);
        setUpdateEqipmentData({});
        if (activePage === 'explore') {
            setSelectedTab(0);
        }
        if (activePage === 'equipment') {
            setSelectedTab(1);
        }
    };

    const fetchEquipmentChart = async (equipId) => {
        try {
            setIsEquipDataFetched(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            let params = `?building_id=${bldgId}&equipment_id=${equipId}&consumption=${selectedConsumption}&divisible_by=1000${
                selectedConsumption === 'rmsCurrentMilliAmps' ? '&detailed=true' : ''
            }`;
            await axios
                .post(`${BaseUrl}${equipmentGraphData}${params}`, apiRequestBody(startDate, endDate, timeZone), {
                    headers,
                })
                .then((res) => {
                    let response = res.data;

                    let data = response.data.map((_data) => {
                        _data[1] = parseInt(_data[1]);
                        return _data;
                    });

                    data.forEach((record) => {});
                    let exploreData = [];

                    if (selectedConsumption === 'rmsCurrentMilliAmps') {
                        let exploreData = [];
                        let NulledData = [];
                        let data = response.data;
                        for (let i = 0; i < data.length; i++) {
                            data[i].data.map((ele) => {
                                if (ele[1] === '') {
                                    NulledData.push([new Date(ele[0]), null]);
                                } else {
                                    NulledData.push([new Date(ele[0]), ele[1]]);
                                }
                            });
                            let recordToInsert = {
                                data: NulledData,
                                name: `Sensor ${data[i]?.sensor_name}`,
                                unit: selectedUnit,
                            };
                            exploreData.push(recordToInsert);
                        }
                        setDeviceData(exploreData);
                        setSeriesData(exploreData);
                        setIsEquipDataFetched(false);
                    } else {
                        let data = response.data.map((_data) => {
                            _data[1] = parseInt(_data[1]);
                            return _data;
                        });

                        let exploreData = [];
                        let NulledData = [];
                        data.map((ele) => {
                            if (ele[1] === '') {
                                NulledData.push([new Date(ele[0]), null]);
                            } else {
                                NulledData.push([new Date(ele[0]), ele[1]]);
                            }
                        });
                        let recordToInsert = {
                            data: NulledData,
                            name: localStorage.getItem('exploreEquipName'),
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
                    }
                });
        } catch (error) {
            setIsEquipDataFetched(false);
        }
    };

    const redirectToConfigDevicePage = (equipDeviceId, deviceType) => {
        if (equipDeviceId === '' || equipDeviceId === null) {
            return;
        }

        if (deviceType === 'active-device') {
            history.push({
                pathname: `/settings/active-devices/single/${equipDeviceId}`,
            });
        }

        if (deviceType === 'passive-device') {
            history.push({
                pathname: `/settings/passive-devices/single/${equipDeviceId}`,
            });
        }
    };

    const fetchEquipmentYTDUsageData = async (equipId) => {
        try {
            setIsYtdDataFetching(true);
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let params = `?building_id=${bldgId}&equipment_id=${equipId}&consumption=energy`;

            await axios
                .post(
                    `${BaseUrl}${getExploreEquipmentYTDUsage}${params}`,
                    apiRequestBody(startDate, endDate, timeZone),
                    { headers }
                )
                .then((res) => {
                    let response = res.data.data;
                    setYtdData(response[0]);
                    setIsYtdDataFetching(false);
                });
        } catch (error) {
            setIsYtdDataFetching(false);
        }
    };

    useEffect(() => {
        if (!equipmentFilter?.equipment_id) {
            return;
        }

        const fetchEquipmentDetails = async (equipId) => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };

                let params = `/${equipId}`;

                await axios.get(`${BaseUrl}${equipmentDetails}${params}`, { headers }).then((res) => {
                    let response = res.data.data;
                    setLocation(response?.location_id);
                    setEquipType(response?.equipments_type_id);

                    setEquipBreakerLink(response?.breaker_link);
                    setDefaultEquipData(response);
                    setEquipmentData(response);
                });
            } catch (error) {}
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
                    .post(`${BaseUrl}${builidingAlerts}${params}`, apiRequestBody(startDate, endDate, timeZone), {
                        headers,
                    })
                    .then((res) => {
                        setBuildingAlerts(res.data);
                    });
            } catch (error) {}
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
            } catch (error) {}
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
            } catch (error) {}
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
            } catch (error) {}
        };

        fetchEquipmentChart(equipmentFilter?.equipment_id);
        fetchEquipmentYTDUsageData(equipmentFilter?.equipment_id);
        fetchEquipmentDetails(equipmentFilter?.equipment_id);
        fetchEndUseData();
        fetchEquipTypeData();
        fetchLocationData();
    }, [equipmentFilter]);

    useEffect(() => {
        if (equipmentTypeData.length === 0 || Object.keys(equipmentData).length === 0) {
            return;
        }
        let res = equipmentTypeData.find(({ equipment_type }) => equipment_type === equipmentData?.equipments_type);
        setEquipResult(res);
    }, [equipmentTypeData, equipmentData]);

    useEffect(() => {
        if (equipmentData.length === 0) {
            return;
        }

        const fetchActiveDeviceSensorData = async () => {
            if (equipmentData !== null) {
                if (
                    equipmentData?.device_type === 'passive' ||
                    equipmentData?.device_id === '' ||
                    equipmentData?.device_id === undefined
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
                });
            } catch (error) {}
        };

        if (equipmentData !== null) {
            if (equipmentData?.device_type !== 'passive') {
                fetchActiveDeviceSensorData();
            }
        }
    }, [equipmentData]);

    useEffect(() => {
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
        fetchEquipmentYTDUsageData(equipmentFilter?.equipment_id);
    }, [startDate, endDate, selectedConsumption]);

    // useEffect(() => {
    //     let xaxisObj = xaxisFilters(daysCount, timeZone);
    //     let xaxisLineObj = {
    //         type: 'datetime',
    //         labels: {
    //             show: false,
    //         },
    //     };
    //     setOptions({ ...options, xaxis: xaxisObj });
    //     setOptionsLine({ ...optionsLine, xaxis: xaxisLineObj });
    // }, [daysCount]);

    useEffect(() => {
        let toolTip = {
            shared: false,
            intersect: false,
            style: {
                fontSize: '12px',
                fontFamily: 'Inter, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
            marker: {
                show: false,
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const { colors } = w.globals;
                const { seriesX } = w.globals;
                const { seriesNames } = w.globals;
                let ch = '';
                ch =
                    ch +
                    `<div class="line-chart-widget-tooltip-time-period" style="margin-bottom:10px;">${moment(
                        seriesX[0][dataPointIndex]
                    )
                        .tz(timeZone)
                        .format(`MMM D 'YY @ hh:mm A`)}</div><table style="border:none;">`;
                for (let i = 0; i < series.length; i++) {
                    if (isNaN(parseInt(series[i][dataPointIndex])) === false)
                        ch =
                            ch +
                            `<tr style="style="border:none;"><td><span class="tooltipclass" style="background-color:${
                                colors[i]
                            };"></span> &nbsp;${seriesNames[i]} </td><td> &nbsp;${series[i][dataPointIndex].toFixed(
                                2
                            )} kWh </td></tr>`;
                }

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title" style="font-weight:bold;">${selectedConsumptionLabel}</h6>
                        ${ch}
                    </table></div>`;
            },
        };
        let xaxisObj = xaxisFilters(daysCount, timeZone);
        let xaxisLineObj = {
            type: 'datetime',
            labels: {
                show: false,
            },
        };
        setOptions({ ...options, xaxis: xaxisObj, tooltip: toolTip });
        setOptionsLine({ ...optionsLine, xaxis: xaxisLineObj });
    }, [daysCount]);

    useEffect(() => {
        if (equipmentTypeData) {
            addEquimentType();
        }
    }, [equipmentTypeData]);

    return (
        <Modal
            show={showEquipmentChart}
            onHide={handleChartClose}
            dialogClassName="modal-container-style"
            centered
            backdrop="static"
            keyboard={false}>
            <>
                <Modal.Body className="p-4">
                    {equipmentData?.device_type === 'active' ? (
                        <>
                            <Row>
                                <Col lg={12}>
                                    <h6 className="text-muted">{equipmentData?.location}</h6>
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={8}>
                                    <div>
                                        <span className="heading-style">{equipmentData?.equipments_name}</span>
                                    </div>
                                </Col>
                                <Col lg={4}>
                                    <div className="equip-button-wrapper">
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-md btn-outline-danger font-weight-bold">
                                                <FontAwesomeIcon icon={faPowerOff} size="lg" style={{ color: 'red' }} />{' '}
                                                Turn Off
                                            </button>
                                        </div>

                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-md btn-light font-weight-bold mr-4 ml-4"
                                                onClick={() => {
                                                    handleCloseWithoutSave();
                                                }}>
                                                Cancel
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-md btn-primary font-weight-bold"
                                                onClick={() => {
                                                    handleSave();
                                                }}
                                                disabled={!isDataChanged}>
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
                                    <h6 className="text-muted">{equipmentData?.location}</h6>
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
                                                    handleCloseWithoutSave();
                                                }}>
                                                Cancel
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-md btn-primary font-weight-bold mr-4"
                                                onClick={() => {
                                                    handleSave();
                                                }}
                                                disabled={!isDataChanged}>
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

                    {equipmentData?.device_type === '' ? (
                        <>
                            <Row>
                                <Col lg={12}>
                                    <h6 className="text-muted">{equipmentData?.location}</h6>
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
                                                    handleCloseWithoutSave();
                                                }}>
                                                Cancel
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                type="button"
                                                className="btn btn-md btn-primary font-weight-bold mr-4"
                                                onClick={() => {
                                                    handleSave();
                                                }}
                                                disabled={!isDataChanged}>
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
                        {/* <span
                            className={selectedTab === 2 ? 'mr-3 equip-tab-active' : 'mr-3 equip-tab'}
                            onClick={() => setSelectedTab(2)}>
                            History
                        </span> */}
                    </div>

                    {selectedTab === 0 && (
                        <Row className="mt-4">
                            <Col lg={4}>
                                <div className="ytd-container">
                                    <div>
                                        <div className="ytd-heading">
                                            {`Total Consumption (${moment(startDate).format('MMM D')} to ${moment(
                                                endDate
                                            ).format('MMM D')})`}
                                        </div>
                                        {isYtdDataFetching ? (
                                            <Skeleton count={1} />
                                        ) : (
                                            <div className="ytd-flex">
                                                <span className="mr-1 ytd-value">
                                                    {ytdData?.ytd?.ytd
                                                        ? formatConsumptionValue(ytdData?.ytd?.ytd / 1000, 0)
                                                        : 0}
                                                </span>
                                                <span className="ytd-unit">kWh</span>
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <div className="ytd-heading">
                                            {`Peak kW (${moment(startDate).format('MMM D')} to ${moment(endDate).format(
                                                'MMM D'
                                            )})`}
                                        </div>
                                        {isYtdDataFetching ? (
                                            <Skeleton count={1} />
                                        ) : (
                                            <div className="ytd-flex">
                                                {equipmentData?.device_type === 'active' ? (
                                                    <span className="mr-1 ytd-value">
                                                        {ytdData?.ytd_peak?.power
                                                            ? formatConsumptionValue(ytdData?.ytd_peak?.power / 1000, 1)
                                                            : 0}
                                                    </span>
                                                ) : (
                                                    <span className="mr-1 ytd-value">
                                                        {ytdData?.ytd_peak?.power
                                                            ? formatConsumptionValue(
                                                                  ytdData?.ytd_peak?.power / 1000000,
                                                                  1
                                                              )
                                                            : 0}
                                                    </span>
                                                )}

                                                {ytdData?.ytd_peak?.time_stamp ? (
                                                    <span className="ytd-unit">
                                                        {`kW @ ${moment
                                                            .utc(ytdData?.ytd_peak?.time_stamp)
                                                            .clone()
                                                            .tz(timeZone)
                                                            .format('MM/DD  H:mm')}`}
                                                    </span>
                                                ) : (
                                                    <span className="ytd-unit">kW</span>
                                                )}
                                            </div>
                                        )}
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
                                <div className="equip-model">
                                    <div className="pt-3">
                                        <div className="ytd-heading">
                                            Device : &nbsp;
                                            <span style={{ fontWeight: 'normal', textDecoration: 'underline' }}>
                                                {equipmentData?.device_mac}
                                            </span>
                                            &nbsp;
                                            <Button
                                                style={{ border: 'none' }}
                                                onClick={() => {
                                                    redirectToConfigDevicePage(
                                                        equipmentData?.device_id,
                                                        equipmentData?.device_type === 'passive'
                                                            ? 'passive-device'
                                                            : equipmentData?.device_type === 'active'
                                                            ? 'active-device'
                                                            : ''
                                                    );
                                                }}
                                                disabled={
                                                    equipmentData?.device_type === 'passive'
                                                        ? equipBreakerLink?.length === 0
                                                            ? true
                                                            : false
                                                        : equipmentData !== null
                                                        ? equipmentData.device_id === ''
                                                            ? true
                                                            : false
                                                        : true
                                                }>
                                                <FontAwesomeIcon
                                                    icon={faArrowUpFromSquare}
                                                    size="lg"
                                                    style={{ color: 'black' }}
                                                />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="d-flex">
                                        <div className="mr-2">
                                            <Select
                                                defaultValue={selectedConsumption}
                                                options={metric}
                                                onChange={(e) => {
                                                    if (e.value === 'passive-power') {
                                                        return;
                                                    }
                                                    setConsumption(e.value);
                                                    handleUnitChange(e.value);
                                                    handleConsumptionChange(e.value);
                                                }}
                                            />
                                        </div>

                                        <Header type="modal" />
                                    </div>
                                    {/* <div className="mr-3 sensor-chart-options">
                                        <Dropdown>
                                            <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                                                <FontAwesomeIcon icon={faEllipsisV} size="lg" />
                                            </Dropdown.Toggle>

                                            <Dropdown.Menu>
                                                <Dropdown.Item>
                                                    <i className="uil uil-calendar-alt mr-2"></i>Configure Column
                                                </Dropdown.Item>

                                                <Dropdown.Item>
                                                    <i className="uil uil-download-alt mr-2"></i>
                                                    Download CSV
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div> */}
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

                    {selectedTab === 1 && (
                        <>
                            {equipmentData?.device_type === 'passive' ? (
                                <Row className="mt-4">
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
                                                    {/* equipmentTypeDataNow */}
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="exampleSelect"
                                                        className="font-weight-bold"
                                                        value={equipType}
                                                        onChange={(e) => {
                                                            handleEquipTypeChange(
                                                                'equipment_type',
                                                                e.target.value,
                                                                'passive'
                                                            );
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
                                                        onChange={(e) => {
                                                            handleChange('end_use', e.target.value);
                                                        }}
                                                        value={equipmentData?.end_use_id}>
                                                        <option selected>Select Category</option>
                                                        {endUse?.map((record) => {
                                                            return (
                                                                <option value={record?.end_user_id}>
                                                                    {record?.name}
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
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="exampleSelect"
                                                        className="font-weight-bold"
                                                        onChange={(e) => {
                                                            handleChange('location_id', e.target.value);
                                                        }}
                                                        value={location}>
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
                                                        onChange={(value) => {
                                                            handleChange('tags', value);
                                                        }}
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
                                            <div className="equip-panel-info">
                                                {/* <div className="modal-right-pic"></div> */}
                                                {equipBreakerLink?.length === 0 ? (
                                                    <div className="equip-breaker-style">
                                                        <img src={DoubleBreakerUninked} alt="DoubleBreakerUninked" />
                                                    </div>
                                                ) : (
                                                    <>
                                                        {equipBreakerLink?.length === 1 && (
                                                            <div className="breaker-container-style">
                                                                <div className="breaker-number-style-single">
                                                                    <div>{equipBreakerLink[0]?.breaker_number}</div>
                                                                </div>
                                                                <div className="breaker-number-style-single">
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[1]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                </div>
                                                                <div className="breaker-voltage-style">
                                                                    <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                    <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                </div>
                                                                <div className="breaker-number-style">
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket-single-style"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {equipBreakerLink?.length === 2 && (
                                                            <div className="breaker-container-style">
                                                                <div className="breaker-number-style">
                                                                    <div>{equipBreakerLink[0]?.breaker_number}</div>
                                                                    <div>{equipBreakerLink[1]?.breaker_number}</div>
                                                                </div>
                                                                <div className="breaker-number-style">
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[0]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[1]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                </div>
                                                                <div className="breaker-voltage-style">
                                                                    <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                    <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                </div>
                                                                <div className="breaker-number-style">
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket-double-style"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {equipBreakerLink?.length === 3 && (
                                                            <div className="breaker-container-style">
                                                                <div className="breaker-number-style">
                                                                    <div>{equipBreakerLink[0]?.breaker_number}</div>
                                                                    <div>{equipBreakerLink[1]?.breaker_number}</div>
                                                                    <div>{equipBreakerLink[2]?.breaker_number}</div>
                                                                </div>
                                                                <div className="breaker-number-style">
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[0]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[1]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[2]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                </div>
                                                                <div className="breaker-voltage-style">
                                                                    <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                    <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                </div>
                                                                <div className="breaker-number-style">
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket-triple-style"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                <div className="modal-right-card mt-2" style={{ padding: '1rem' }}>
                                                    <span className="modal-right-card-title">Energy Monitoring</span>

                                                    <Button
                                                        label="View"
                                                        size={Button.Sizes.md}
                                                        type={Button.Type.secondaryGrey}
                                                        onClick={() => {
                                                            redirectToConfigDevicePage(
                                                                equipmentData?.device_id,
                                                                'passive-device'
                                                            );
                                                        }}
                                                        disabled={equipBreakerLink?.length === 0 ? true : false}
                                                    />
                                                </div>
                                                <div className="equip-breaker-container">
                                                    <div className="equip-breaker-detail">
                                                        <div className="phase-style">
                                                            <div className="equip-breaker-header mb-1">Phases</div>
                                                            <div className="equip-breaker-value float-left">
                                                                {equipBreakerLink[0]?.breaker_type}
                                                            </div>
                                                        </div>
                                                        <div className="installed-style">
                                                            <div className="equip-breaker-header mb-1">
                                                                Installed at
                                                            </div>
                                                            <div className="equip-breaker-value float-left">
                                                                {equipBreakerLink?.length === 1 &&
                                                                    `${equipBreakerLink[0]?.panel_name} > Breaker ${equipBreakerLink[0]?.breaker_number}`}
                                                                {equipBreakerLink?.length === 2 &&
                                                                    `${equipBreakerLink[0]?.panel_name} > Breakers ${equipBreakerLink[0]?.breaker_number}, ${equipBreakerLink[1]?.breaker_number}`}
                                                                {equipBreakerLink?.length === 3 &&
                                                                    `${equipBreakerLink[0]?.panel_name} > Breakers ${equipBreakerLink[0]?.breaker_number}, ${equipBreakerLink[1]?.breaker_number}, ${equipBreakerLink[2]?.breaker_number}`}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            ) : (
                                ''
                            )}

                            {equipmentData?.device_type === '' ? (
                                <Row className="mt-4">
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
                                                    {/* equipmentTypeDataNow */}
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="exampleSelect"
                                                        className="font-weight-bold disabled"
                                                        value={equipType}
                                                        onChange={(e) => {
                                                            handleEquipTypeChange(
                                                                'equipment_type',
                                                                e.target.value,
                                                                'passive'
                                                            );
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
                                                        onChange={(e) => {
                                                            handleChange('end_use', e.target.value);
                                                        }}
                                                        value={equipmentData?.end_use_id}>
                                                        <option selected>Select Category</option>
                                                        {endUse?.map((record) => {
                                                            return (
                                                                <option value={record?.end_user_id}>
                                                                    {record?.name}
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
                                                    <Input
                                                        type="select"
                                                        name="select"
                                                        id="exampleSelect"
                                                        className="font-weight-bold"
                                                        onChange={(e) => {
                                                            handleChange('space_id', e.target.value);
                                                        }}
                                                        value={location}>
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
                                                        onChange={(value) => {
                                                            handleChange('tags', value);
                                                        }}
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
                                            <div className="equip-panel-info">
                                                {equipBreakerLink?.length === 0 ? (
                                                    <div className="breaker-container-disabled-style">
                                                        <div className="breaker-number-style">
                                                            <div></div>
                                                        </div>
                                                        <div className="breaker-number-style-single">
                                                            <div className="breaker-offline-style"></div>
                                                        </div>
                                                        <div className="breaker-voltage-style">
                                                            <div></div>
                                                            <div></div>
                                                        </div>
                                                        <div className="breaker-number-style">
                                                            <div className="breaker-socket1-style-disbaled"></div>
                                                            <div className="breaker-socket-single-style-disabled"></div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {equipBreakerLink?.length === 1 && (
                                                            <div className="breaker-container-disabled-style">
                                                                <div className="breaker-number-style-single">
                                                                    <div>{equipBreakerLink[0]?.breaker_number}</div>
                                                                </div>
                                                                <div className="breaker-number-style-single">
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[0]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                </div>
                                                                <div className="breaker-voltage-style">
                                                                    <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                    <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                </div>
                                                                <div className="breaker-number-style">
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket-single-style-disabled"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {equipBreakerLink?.length === 2 && (
                                                            <div className="breaker-container-disabled-style">
                                                                <div className="breaker-number-style">
                                                                    <div>{equipBreakerLink[0]?.breaker_number}</div>
                                                                    <div>{equipBreakerLink[1]?.breaker_number}</div>
                                                                </div>
                                                                <div className="breaker-number-style">
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[0]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[1]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                </div>
                                                                <div className="breaker-voltage-style">
                                                                    <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                    <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                </div>
                                                                <div className="breaker-number-style">
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket-double-style-disabled"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                        {equipBreakerLink?.length === 3 && (
                                                            <div className="breaker-container-disabled-style">
                                                                <div className="breaker-number-style">
                                                                    <div>{equipBreakerLink[0]?.breaker_number}</div>
                                                                    <div>{equipBreakerLink[1]?.breaker_number}</div>
                                                                    <div>{equipBreakerLink[2]?.breaker_number}</div>
                                                                </div>
                                                                <div className="breaker-number-style">
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[0]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[1]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                    <div
                                                                        className={
                                                                            equipBreakerLink[2]?.sensor_id === ''
                                                                                ? 'breaker-offline-style'
                                                                                : 'breaker-online-style'
                                                                        }></div>
                                                                </div>
                                                                <div className="breaker-voltage-style">
                                                                    <div>{`${equipBreakerLink[0]?.rated_amps}A`}</div>
                                                                    <div>{`${equipBreakerLink[0]?.voltage}V`}</div>
                                                                </div>
                                                                <div className="breaker-number-style">
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket1-style"></div>
                                                                    <div className="breaker-socket-triple-style-disabled"></div>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                                <div className="modal-right-card mt-2" style={{ padding: '1rem' }}>
                                                    <span className="modal-right-card-title">Energy Monitoring</span>

                                                    <Button
                                                        label="View"
                                                        size={Button.Sizes.md}
                                                        type={Button.Type.secondaryGrey}
                                                        onClick={() => {
                                                            redirectToConfigDevicePage(
                                                                equipmentData?.device_id,
                                                                'passive-device'
                                                            );
                                                        }}
                                                        disabled
                                                    />
                                                </div>
                                                {equipBreakerLink?.length === 0 ? (
                                                    <></>
                                                ) : (
                                                    <div className="equip-breaker-container">
                                                        <div className="equip-breaker-detail">
                                                            <div className="phase-style">
                                                                <div className="equip-breaker-header mb-1">Phases</div>
                                                                <div className="equip-breaker-value float-left">
                                                                    {equipBreakerLink[0]?.breaker_type}
                                                                </div>
                                                            </div>
                                                            <div className="installed-style">
                                                                <div className="equip-breaker-header mb-1">
                                                                    Installed at
                                                                </div>
                                                                <div className="equip-breaker-value float-left">
                                                                    {equipBreakerLink?.length === 1 &&
                                                                        `${equipBreakerLink[0]?.panel_name} > Breaker ${equipBreakerLink[0]?.breaker_number}`}
                                                                    {equipBreakerLink?.length === 2 &&
                                                                        `${equipBreakerLink[0]?.panel_name} > Breakers ${equipBreakerLink[0]?.breaker_number}, ${equipBreakerLink[1]?.breaker_number}`}
                                                                    {equipBreakerLink?.length === 3 &&
                                                                        `${equipBreakerLink[0]?.panel_name} > Breakers ${equipBreakerLink[0]?.breaker_number}, ${equipBreakerLink[1]?.breaker_number}, ${equipBreakerLink[2]?.breaker_number}`}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </Col>
                                </Row>
                            ) : (
                                ''
                            )}

                            {equipmentData?.device_type === 'active' ? (
                                <Row className="mt-4">
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
                                                        value={equipType}
                                                        onChange={(e) => {
                                                            handleEquipTypeChange(
                                                                'equipment_type',
                                                                e.target.value,
                                                                'active'
                                                            );
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
                                                        className="font-weight-bold"
                                                        disabled>
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
                                                        onChange={(value) => {
                                                            handleChange('tags', value);
                                                        }}
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
                                                        value={equipmentData !== null ? equipmentData?.note : ''}
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
                                                                        <div className="power-off-style-equip">
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
                                                                            <div className="online-socket-container-equip">
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

                                                <Button
                                                    label="View Devices"
                                                    size={Button.Sizes.md}
                                                    type={Button.Type.secondaryGrey}
                                                    onClick={() => {
                                                        redirectToConfigDevicePage(
                                                            equipmentData?.device_id,
                                                            'active-device'
                                                        );
                                                    }}
                                                    disabled={
                                                        equipmentData !== null
                                                            ? equipmentData.device_id === ''
                                                                ? true
                                                                : false
                                                            : true
                                                    }
                                                />
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
                                                            {equipmentData !== null ? equipmentData?.device_type : ''}
                                                        </h6>
                                                    </div>
                                                </FormGroup>
                                            </div>
                                            <FormGroup>
                                                <div className="single-line-style">
                                                    <h6
                                                        className="card-subtitle mb-2 text-muted"
                                                        htmlFor="customSwitches">
                                                        Installed at
                                                    </h6>
                                                    <h6 className="card-title">
                                                        {equipmentData !== null ? equipmentData.location : ''}
                                                    </h6>
                                                </div>
                                            </FormGroup>
                                        </div>
                                    </Col>
                                </Row>
                            ) : (
                                ''
                            )}
                        </>
                    )}
                </Modal.Body>
            </>
        </Modal>
    );
};

export default EquipChartModal;
