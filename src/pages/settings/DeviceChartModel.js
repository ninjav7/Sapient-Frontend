import React, { useEffect, useState } from 'react';
import { Input, Spinner } from 'reactstrap';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import moment from 'moment';
import 'moment-timezone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faEllipsisV } from '@fortawesome/pro-regular-svg-icons';
import { BaseUrl, generalActiveDevices, getLocation, sensorGraphData, listSensor } from '../../services/Network';
import axios from 'axios';
import BrushChart from '../charts/BrushChart';
import { Cookies } from 'react-cookie';
import { CSVLink } from 'react-csv';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import Header from '../../components/Header';
import { formatConsumptionValue, xaxisFilters } from '../../helpers/helpers';
import '../../pages/portfolio/style.scss';
import './style.css';

const DeviceChartModel = ({
    showChart,
    handleChartClose,
    sensorData,
    sensorLineData,
    seriesData,
    setSeriesData,
    deviceData,
    setDeviceData,
    CONVERSION_ALLOWED_UNITS,
    UNIT_DIVIDER,
    metric,
    setMetric,
    selectedConsumption,
    setConsumption,
    getRequiredConsumptionLabel,
    isSensorChartLoading,
    setIsSensorChartLoading,
    timeZone,
    selectedUnit,
    setSelectedUnit,
    daysCount,
}) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [dropDown, setDropDown] = useState('dropdown-menu dropdown-menu-right');

    const handleRefresh = () => {
        setDeviceData([]);
        setSeriesData([]);
        setSelectedUnit(metric[0].unit);
        setConsumption(metric[0].value);
    };

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';

    const [options, setOptions] = useState({
        chart: {
            id: 'chart-line2',
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
                    return `${moment(timestamp).tz(timeZone).format('DD/MM')} ${moment(timestamp)
                        .tz(timeZone)
                        .format('LT')}`;
                },
            },
            style: {
                colors: ['#1D2939'],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
            crosshairs: {
                show: true,
                position: 'front',
                stroke: {
                    color: '#7C879C',
                    width: 1,
                    dashArray: 0,
                },
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return val.toFixed(0);
                },
            },
        },
        tooltip: {
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
                const { seriesX } = w.globals;
                const timestamp = new Date(seriesX[seriesIndex][dataPointIndex]);

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="line-chart-widget-tooltip-value">${series[seriesIndex][dataPointIndex].toFixed(
                            0
                        )} ${selectedUnit}</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment(timestamp)
                            .tz(timeZone)
                            .format(`MMM D 'YY @ hh:mm A`)}</div>
                    </div>`;
            },
        },
    });

    const [optionsLine, setOptionsLine] = useState({
        chart: {
            id: 'chart-line',

            height: 90,

            type: 'area',

            brush: {
                target: 'chart-line2',

                enabled: true,
            },

            toolbar: {
                show: false,
            },

            selection: {
                enabled: true,
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
                    return '';
                },
            },
        },

        yaxis: {
            tickAmount: 2,

            labels: {
                formatter: function (val) {
                    return val.toFixed(0);
                },
            },
        },
    });

    const handleShow = () => {
        if (dropDown === 'dropdown-menu dropdown-menu-right') setDropDown('dropdown-menu dropdown-menu-right show');
        else setDropDown('dropdown-menu dropdown-menu-right');
    };

    const removeDuplicates = (arr = []) => {
        const map = new Map();
        arr.forEach((x) => map.set(JSON.stringify(x), x));
        arr = [...map.values()];
        return arr;
    };

    const getCSVLinkData = () => {
        let arr = seriesData.length > 0 ? seriesData[0].data : [];
        let sData = removeDuplicates(arr);
        let streamData = seriesData.length > 0 ? seriesData[0].data : [];
        return [['timestamp', selectedConsumption], ...streamData];
    };

    const handleUnitChange = (value) => {
        let obj = metric.find((record) => record.value === value);
        setSelectedUnit(obj.unit);
    };

    useEffect(() => {
        let xaxisObj = xaxisFilters(daysCount, timeZone);
        setOptions({ ...options, xaxis: xaxisObj });
        setOptionsLine({ ...optionsLine, xaxis: xaxisObj });
    }, [daysCount]);

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
                if (!showChart) {
                    return;
                }
                setIsSensorChartLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?sensor_id=${sensorData.id}&consumption=${selectedConsumption}&building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${sensorGraphData}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        setDeviceData([]);
                        setSeriesData([]);
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
                setIsSensorChartLoading(false);
            }
        };
        exploreDataFetch();
    }, [startDate, endDate, selectedConsumption]);

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
                const { seriesX } = w.globals;
                let timestamp = new Date(seriesX[seriesIndex][dataPointIndex]);

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="line-chart-widget-tooltip-value">${formatConsumptionValue(
                            series[seriesIndex][dataPointIndex],
                            0
                        )} ${selectedUnit}</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment(timestamp)
                            .tz(timeZone)
                            .format(`MMM D 'YY @ hh:mm A`)}</div>
                    </div>`;
            },
        };
        let xaxisObj = xaxisFilters(daysCount, timeZone);
        setOptions({ ...options, xaxis: xaxisObj, tooltip: toolTip });
        setOptionsLine({ ...optionsLine, xaxis: xaxisObj });
    }, [selectedUnit]);

    return (
        <Modal show={showChart} size="xl" centered backdrop="static" keyboard={false}>
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

            <div className="model-sensor-filters-v2">
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

                <div
                    className="btn-group custom-button-group header-widget-styling"
                    role="group"
                    aria-label="Basic example">
                    <Header type="modal" />
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
        </Modal>
    );
};

export default DeviceChartModel;
