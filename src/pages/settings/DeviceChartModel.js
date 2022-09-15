import React, { useEffect, useState } from 'react';
import { Input, Spinner } from 'reactstrap';
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
import { percentageHandler, convert24hourTo12HourFormat } from '../../utils/helper';
import BrushChart from '../charts/BrushChart';
import { Cookies } from 'react-cookie';
import { CSVLink } from 'react-csv';
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
}) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const [dateRange, setDateRange] = useState([null, null]);
    const [startDate, endDate] = dateRange;

    // const [sDateStr, setSDateStr] = useState('');
    // const [eDateStr, setEDateStr] = useState('');

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
                setIsSensorChartLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?sensor_id=${sensorData.id}&consumption=${selectedConsumption}&tz_info=${timeZone}`;
                await axios
                    .post(
                        `${BaseUrl}${sensorGraphData}${params}`,
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

    // const exportToCSV=()=>{

    //     let fileName="energy";

    //     const ws = XLSX.utils.json_to_sheet(deviceData[0].data);

    //     const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };

    //     const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    //     const data = new Blob([excelBuffer], {type: fileType});

    //     FileSaver.saveAs(data, fileName + fileExtension);

    // }

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
                    return moment(timestamp).format('DD/MMM - HH:mm');
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
                    return val.toFixed(2);
                },
            },
        },
        // tooltip: {
        //     x: {
        //         show: true,
        //         format: 'MM/dd HH:mm',
        //     },
        // },
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
                    return value + ' K';
                },
            },
            marker: {
                show: false,
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const { labels } = w.globals;
                const timestamp = labels[dataPointIndex];

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="line-chart-widget-tooltip-value">${series[seriesIndex][dataPointIndex]} kWh</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment(timestamp).format(
                            `MMM D 'YY @ hh:mm A`
                        )}</div>
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
    // const TimeZoneConvert=(arr=[])=>{
    //     arr.forEach((x)=>{
    //         var d=new Date(x[0]);
    //         console.log(x[0]);
    //         console.log(x[0].getTime());
    //         // var MyTimeZone=Intl.DateTimeFormat().resolvedOptions().timeZone;
    //         console.log(x[0].getTimezoneOffset());

    //         var date=new Date();
    //         var offset=date.getTimezoneOffset();var date=new Date();
    //         var offset=date.getTimezoneOffset();
    //         console.log(offset)
    //         var nd=new Date(x[0].getTime()+(60000*(x[0].getTimezoneOffset()-offset)));
    //         // var utc=d.getTime()+(d.getTimezoneOffset()/-60);    //
    //         // console.log(utc);
    //         // console.log(offset)
    //         // var nd=new Date((utc+(3600000*offset)));
    //         console.log(nd);
    //         // console.log(nd.toLocaleString())
    //     })
    // }
    const getCSVLinkData = () => {
        // console.log("csv entered");
        let arr = seriesData.length > 0 ? seriesData[0].data : [];
        let sData = removeDuplicates(arr);
        // console.log(arr);
        // console.log(sData);
        let streamData = seriesData.length > 0 ? seriesData[0].data : [];

        // streamData.unshift(['Timestamp', selectedConsumption])

        return [['timestamp', selectedConsumption], ...streamData];
    };

    useEffect(() => {
        // console.log('optionsLine => ', optionsLine);
        // if (endDate) {
        //     let eDate = moment();
        //     eDate.subtract(1, 'days');
        //     eDate.format('DD-MM-YYYY');
        //     console.log('eDate', eDate);
        // }
        // console.log(
        //     'startDate => ',
        //     endDate ? moment(endDate.getDate() - 1).format('DD MMMM YYYY') : new Date('15 July 2022').getTime()
        // );
        // console.log(
        //     'endDate => ',
        //     endDate ? moment(endDate.getDate()).format('DD MMMM YYYY') : new Date('15 July 2022').getTime()
        // );
    });

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

            <div className="model-sensor-filters-v2">
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
        </Modal>
    );
};

export default DeviceChartModel;
