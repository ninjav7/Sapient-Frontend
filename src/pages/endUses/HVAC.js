import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import Header from '../../components/Header';
import DonutChart from '../charts/DonutChart';
import StackedBarChart from '../charts/StackedBarChart';
import EnergyUsageCard from './UsageCard';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { BaseUrl, endUses, energyUsage, hvacUsageChart } from '../../services/Network';
import axios from 'axios';
import { percentageHandler, dateFormatHandler } from '../../utils/helper';
import { useParams } from 'react-router-dom';
import { DateRangeStore } from '../../store/DateRangeStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import './style.css';

const UsagePageOne = ({ title = 'HVAC' }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const { bldgId } = useParams();
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    const [endUsesData, setEndUsesData] = useState([]);
    const [endUsesTitle, setEndUsesTitle] = useState('');

    const [endUsage, seteEndUsage] = useState([
        {
            title: 'AHUs',
            totalConsumption: 3365,
            afterHourConsumption: 232,
            val1: { value: 61, type: 'up' },
            val2: { value: 6, type: 'down' },
            val3: { value: 31, type: 'normal' },
            val4: { value: 2, type: 'up' },
        },
        {
            title: 'Chillers',
            totalConsumption: 2353,
            afterHourConsumption: 205,
            val1: { value: 32, type: 'increased' },
            val2: { value: 4, type: 'decreased' },
            val3: { value: 41, type: 'decreased' },
            val4: { value: 12, type: 'increased' },
        },
        {
            title: 'CRACs',
            totalConsumption: 1365,
            afterHourConsumption: 102,
            val1: { value: 6, type: 'increased' },
            val2: { value: 6, type: 'increased' },
            val3: { value: 3, type: 'decreased' },
            val4: { value: 2, type: 'decreased' },
        },
    ]);

    const [endUsageData, setEndUsageData] = useState([]);

    const [usage, seUsage] = useState({
        title: 'HVAC',
        totalConsumption: '11,441',
        afterHourConsumption: '2,321',
        val1: { value: 61, type: 'up' },
        val2: { value: 6, type: 'down' },
        val3: { value: 31, type: 'normal' },
        val4: { value: 2, type: 'up' },
    });

    const [barChartOptions, setBarChartOptions] = useState({
        chart: {
            type: 'bar',
            toolbar: {
                show: true,
            },
            stacked: true,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '20%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: false,
        },
        xaxis: {
            categories: [],
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    var val = Math.abs(value);
                    if (val >= 1000) {
                        val = (val / 1000).toFixed(0) + ' kWh';
                    }
                    return val;
                },
            },
        },
        colors: ['#3094B9', '#66D6BC', '#2C4A5E', '#847CB5'],
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + 'kWh';
                },
            },
            theme: 'dark',
            x: { show: false },
        },
        fill: {
            opacity: 1,
        },
        states: {
            hover: {
                filter: 'none',
            },
        },
        legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'center',
        },
        grid: {
            borderColor: '#f1f3fa',
        },
    });
    const [barChartData, setBarChartData] = useState([]);
    // const [barChartData, setBarChartData] = useState([
    //     {
    //         name: 'HVAC',
    //         data: [15000, 14000, 12000, 11000, 12000, 14000, 12000, 11000, 12000, 10000],
    //     },
    //     {
    //         name: 'Lighting',
    //         data: [8000, 7000, 8000, 4000, 5000, 6000, 5000, 7000, 9000, 6000],
    //     },
    //     {
    //         name: 'Plug',
    //         data: [12000, 14000, 16000, 18000, 20000, 16000, 16000, 14000, 12000, 18000],
    //     },
    //     {
    //         name: 'Other',
    //         data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    //     },
    // ]);

    const [donutChartOpts, setDonutChartOpts] = useState({
        chart: {
            type: 'donut',
        },
        legend: {
            position: 'right',
            offsetY: 0,
            height: 230,
        },
        labels: ['HVAC', 'Lightning', 'Plug', 'Process'],
        colors: ['#3094B9', '#2C4A5E', '#66D6BC', '#3B8554'],
        series: [12553, 11553, 6503, 2333],
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                expandOnClick: false,
                offsetX: 0,
                offsetY: 0,
                customScale: 1,
                dataLabels: {
                    offset: 0,
                    minAngleToShowLabel: 10,
                },
                donut: {
                    size: '80%',
                    background: 'grey',
                    labels: {
                        show: true,
                        name: {
                            show: false,
                            // fontSize: '22px',
                            // fontFamily: 'Helvetica, Arial, sans-serif',
                            // fontWeight: 600,
                            // color: '#373d3f',
                            // offsetY: -10,
                            // formatter: function (val) {
                            //     return val;
                            // },
                        },
                        value: {
                            show: true,
                            fontSize: '15px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 400,
                            color: 'red',
                            // offsetY: 16,
                            formatter: function (val) {
                                return `${val} kWh`;
                            },
                        },
                        total: {
                            show: true,
                            showAlways: false,
                            label: 'Total',
                            // color: '#373d3f',
                            fontSize: '22px',
                            fontWeight: 600,
                            // formatter: function (w) {
                            //     return w.globals.seriesTotals.reduce((a, b) => {
                            //         return a + b;
                            //     }, 0);
                            // },
                            formatter: function (w) {
                                let sum = w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b;
                                }, 0);
                                return `${sum} kWh`;
                            },
                        },
                    },
                },
                legend: {
                    position: 'right',
                    offsetY: 0,
                    height: 230,
                },
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300,
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            theme: 'dark',
            x: { show: false },
        },
        legend: {
            show: false,
        },
        stroke: {
            width: 0,
        },

        itemMargin: {
            horizontal: 10,
        },
        dataLabels: {
            enabled: false,
        },
    });

    const [donutChartData, setDonutChartData] = useState([0, 0, 0, 0]);

    const sortArrayOfObj = (arr) => {
        let newArr = arr.sort((a, b) => a._id - b._id);
        return newArr;
    };

    const formatData = (arr) => {
        let newData = [];
        sortArrayOfObj(arr).forEach((item) => {
            newData.push(item.energy_consumption);
        });
        return newData;
    };

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'End Uses',
                        path: `/energy/end-uses/${localStorage.getItem('buildingId')}`,
                        active: false,
                    },
                    {
                        label: 'HVAC',
                        path: '/energy/end-uses/hvac',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'buildings';
            });
        };
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }
        const energyUsesDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}&end_uses_type=HVAC`;
                await axios
                    .post(
                        `${BaseUrl}${endUses}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        setEndUsesData(res.data);
                        console.log('setEndUsesData => ', res.data);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Enduses Data');
            }
        };

        const energyUsageDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?end_uses_type=HVAC&building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${energyUsage}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        setEndUsageData(res.data);
                        const energyData = res.data;
                        let newDonutData = [];
                        energyData.forEach((record) => {
                            let fixedConsumption = record.energy_consumption.now;
                            newDonutData.push(parseInt(fixedConsumption));
                        });
                        setDonutChartData(newDonutData);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch EndUsage Data');
            }
        };

        const hvacUsageChartData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?end_uses_type=HVAC&building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${hvacUsageChart}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = [];
                        res.data.map((record) => {
                            if (record.data.length === 0) {
                                return;
                            }
                            responseData.push(record);
                        });
                        console.log('HVAC Response Filter Data => ', responseData);

                        let newArray = [];
                        responseData.map((element) => {
                            let newObj = {
                                name: element.device,
                                data: formatData(element.data),
                            };
                            newArray.push(newObj);
                        });
                        setBarChartData(newArray);
                        let newXaxis = {
                            categories: [],
                        };
                        responseData[0].data.map((element) => {
                            return newXaxis.categories.push(`Week ${element._id}`);
                        });
                        setBarChartOptions({ ...barChartOptions, xaxis: newXaxis });
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch HVAC Usage Chart Data');
            }
        };

        hvacUsageChartData();
        energyUsesDataFetch();
        energyUsageDataFetch();
    }, [startDate, endDate, bldgId]);

    return (
        <React.Fragment>
            <Header title={title} />

            <Row>
                {endUsesData.length === 0 && (
                    <div className="endUses-button-container mt-2" style={{ marginLeft: '29px' }}>
                        <div className="usage-card-box-style enduses-button-style">
                            <div className="card-body">
                                <p className="subtitle-style" style={{ margin: '2px' }}>
                                    Total Consumption
                                </p>
                                <p className="card-text usage-card-content-style">
                                    0 <span className="card-unit-style">&nbsp;kWh</span>
                                </p>
                                <button
                                    className="button-success text-success btn-font-style"
                                    style={{ width: 'auto', marginBottom: '4px' }}>
                                    <i className="uil uil-chart-down">
                                        <strong>0 %</strong>
                                    </i>
                                </button>
                                &nbsp;&nbsp;
                                <span className="light-content-style">since last period</span>
                                <br />
                                <button
                                    className="button-success text-success btn-font-style"
                                    style={{ width: 'auto' }}>
                                    <i className="uil uil-chart-down">
                                        <strong>0 %</strong>
                                    </i>
                                </button>
                                &nbsp;&nbsp;
                                <span className="light-content-style">from same period last year</span>
                            </div>
                        </div>

                        <div className="usage-card-box-style enduses-button-style">
                            <div className="card-body">
                                <p className="subtitle-style" style={{ margin: '2px' }}>
                                    After-Hours Consumption
                                </p>
                                <p className="card-text usage-card-content-style">
                                    0<span className="card-unit-style">&nbsp;kWh</span>
                                </p>
                                <button
                                    className="button-success text-success btn-font-style"
                                    style={{ width: 'auto', marginBottom: '4px' }}>
                                    <i className="uil uil-chart-down">
                                        <strong>0 %</strong>
                                    </i>
                                </button>
                                &nbsp;&nbsp;
                                <span className="light-content-style">since last period</span>
                                <br />
                                <button
                                    className="button-success text-success btn-font-style"
                                    style={{ width: 'auto' }}>
                                    <i className="uil uil-chart-down">
                                        <strong>0 %</strong>
                                    </i>
                                </button>
                                &nbsp;&nbsp;
                                <span className="light-content-style">from same period last year</span>
                            </div>
                        </div>
                    </div>
                )}

                {endUsesData.length !== 0 &&
                    endUsesData.map((record, index) => {
                        return (
                            <div className="endUses-button-container mt-2" style={{ marginLeft: '29px' }}>
                                <div className="usage-card-box-style enduses-button-style">
                                    <div className="card-body">
                                        <p className="subtitle-style" style={{ margin: '2px' }}>
                                            Total Consumption
                                        </p>
                                        <p className="card-text usage-card-content-style">
                                            {record.energy_consumption.now.toLocaleString(undefined, {
                                                maximumFractionDigits: 2,
                                            })}
                                            <span className="card-unit-style">&nbsp;kWh</span>
                                        </p>
                                        {record.energy_consumption.now >= record.energy_consumption.old ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        ) : (
                                            <button
                                                className="button-success text-success btn-font-style"
                                                style={{ width: 'auto' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                        &nbsp;&nbsp;
                                        <span className="light-content-style">since last period</span>
                                        <br />
                                        {record.energy_consumption.now >= record.energy_consumption.yearly ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.yearly
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        ) : (
                                            <button
                                                className="button-success text-success btn-font-style"
                                                style={{ width: 'auto' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.yearly
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                        &nbsp;&nbsp;
                                        <span className="light-content-style">from same period last year</span>
                                    </div>
                                </div>

                                <div className="usage-card-box-style enduses-button-style">
                                    <div className="card-body">
                                        <p className="subtitle-style" style={{ margin: '2px' }}>
                                            After-Hours Consumption
                                        </p>
                                        <p className="card-text usage-card-content-style">
                                            {(record.after_hours_energy_consumption.now / 1000).toLocaleString(
                                                undefined,
                                                {
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                            <span className="card-unit-style">&nbsp;kWh</span>
                                        </p>
                                        {record.after_hours_energy_consumption.now >=
                                        record.after_hours_energy_consumption.old ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.after_hours_energy_consumption.now,
                                                            record.after_hours_energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        ) : (
                                            <button
                                                className="button-success text-success btn-font-style"
                                                style={{ width: 'auto' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.after_hours_energy_consumption.now,
                                                            record.after_hours_energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                        &nbsp;&nbsp;
                                        <span className="light-content-style">since last period</span>
                                        <br />
                                        {record.after_hours_energy_consumption.now >=
                                        record.after_hours_energy_consumption.yearly ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.after_hours_energy_consumption.now,
                                                            record.after_hours_energy_consumption.yearly
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        ) : (
                                            <button
                                                className="button-success text-success btn-font-style"
                                                style={{ width: 'auto' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.after_hours_energy_consumption.now,
                                                            record.after_hours_energy_consumption.yearly
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                        &nbsp;&nbsp;
                                        <span className="light-content-style">from same period last year</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
            </Row>

            <Row>
                <Col xl={8} className="mt-5 ml-3">
                    <h6 className="card-title custom-title">HVAC Usage vs. OA Temperature</h6>
                    <h6 className="custom-subtitle-style">Energy Usage By Hour Trend</h6>
                    <div style={{ width: '700px' }}>
                        <div className="card-group button-style mt-2" style={{ display: 'inline-block' }}>
                            {endUsageData.map((record, index) => {
                                return (
                                    <div className="card usage-card-box-style button-style">
                                        <div className="card-body">
                                            {index === 0 && (
                                                <>
                                                    <span
                                                        className="indicate"
                                                        style={{
                                                            backgroundColor: '#3094B9',
                                                            display: 'inline-block',
                                                        }}
                                                    />
                                                    <span
                                                        className="card-title card-title-style"
                                                        style={{ display: 'inline-block' }}>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.device}
                                                    </span>
                                                </>
                                            )}
                                            {index === 1 && (
                                                <>
                                                    <span
                                                        className="indicate"
                                                        style={{
                                                            backgroundColor: '#66D6BC',
                                                            display: 'inline-block',
                                                        }}
                                                    />
                                                    <span
                                                        className="card-title card-title-style"
                                                        style={{ display: 'inline-block' }}>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.device}
                                                    </span>
                                                </>
                                            )}
                                            {index === 2 && (
                                                <>
                                                    <span
                                                        className="indicate"
                                                        style={{
                                                            backgroundColor: '#66D6BC',
                                                            display: 'inline-block',
                                                        }}
                                                    />
                                                    <span
                                                        className="card-title card-title-style"
                                                        style={{ display: 'inline-block' }}>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.device}
                                                    </span>
                                                </>
                                            )}
                                            {index === 3 && (
                                                <>
                                                    <span
                                                        className="indicate"
                                                        style={{
                                                            backgroundColor: '#3B8554',
                                                            display: 'inline-block',
                                                        }}
                                                    />
                                                    <span
                                                        className="card-title card-title-style"
                                                        style={{ display: 'inline-block' }}>
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.device}
                                                    </span>
                                                </>
                                            )}

                                            <p className="card-text card-content-style">
                                                {record.energy_consumption.now.toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                })}
                                                <span className="card-unit-style">
                                                    &nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* <div className="card usage-card-box-style button-style">
                                <div className="card-body">
                                    <div>
                                        <p className="dot" style={{ backgroundColor: '#2C4A5E' }}>
                                            <span className="card-title card-title-style">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Chillers
                                            </span>
                                        </p>
                                    </div>
                                    <p className="card-text card-content-style">
                                        {(2353).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        <span className="card-unit-style">&nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;</span>
                                    </p>
                                </div>
                            </div>
                            <div className="card usage-card-box-style button-style">
                                <div className="card-body">
                                    <div>
                                        <p className="dot" style={{ backgroundColor: '#66D6BC' }}>
                                            <span className="card-title card-title-style">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CRACs
                                            </span>
                                        </p>
                                    </div>
                                    <p className="card-text card-content-style">
                                        {(1365).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        <span className="card-unit-style">&nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;</span>
                                    </p>
                                </div>
                            </div>
                            <div className="card usage-card-box-style button-style">
                                <div className="card-body">
                                    <div>
                                        <p className="dot" style={{ backgroundColor: '#3B8554' }}>
                                            <span className="card-title card-title-style">
                                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Other
                                            </span>
                                        </p>
                                    </div>
                                    <p className="card-text card-content-style">
                                        {(1332).toLocaleString(undefined, { maximumFractionDigits: 2 })}
                                        <span className="card-unit-style">&nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;</span>
                                    </p>
                                </div>
                            </div> */}
                        </div>

                        {/* QA Temp Icon  */}

                        <div style={{ display: 'inline-block', float: 'right' }} className="mt-4 mr-2">
                            <p className="dot" style={{ backgroundColor: '#DF3C9E' }}>
                                <span className="card-title card-title-style" style={{ width: '100px' }}>
                                    &nbsp;&nbsp;&nbsp;OA Temp
                                </span>
                            </p>
                        </div>
                    </div>
                    <StackedBarChart options={barChartOptions} series={barChartData} height={440} />
                </Col>
                <Col xl={3} className="mt-4 ml-3">
                    <h6 className="custom-title">Consumption by System</h6>
                    <h6 className="custom-subtitle-style">Energy Totals</h6>

                    <div className="card-body">
                        <div>
                            <DonutChart donutChartOpts={donutChartOpts} donutChartData={donutChartData} height={200} />
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <div className="card-body mt-5 ml-2">
                    <h6 className="custom-title" style={{ display: 'inline-block' }}>
                        Top Systems by Usage
                    </h6>
                    <h6 className="custom-subtitle-style">Click explore to see more energy usage details.</h6>

                    <Row className="mt-4 energy-container">
                        {endUsageData.map((usage, index) => {
                            return (
                                <div className="usage-card">
                                    <EnergyUsageCard
                                        usage={usage}
                                        button="Explore"
                                        lastPeriodPerTotalHrs={percentageHandler(
                                            usage.energy_consumption.now,
                                            usage.energy_consumption.old
                                        )}
                                        lastPeriodPerTotalHrsNormal={
                                            usage.energy_consumption.now >= usage.energy_consumption.old
                                        }
                                        lastYearPerTotalHrs={percentageHandler(
                                            usage.energy_consumption.now,
                                            usage.energy_consumption.yearly
                                        )}
                                        lastYearPerTotalHrsNormal={
                                            usage.energy_consumption.now >= usage.energy_consumption.yearly
                                        }
                                        lastPeriodPerAfterHrs={percentageHandler(
                                            usage.after_hours_energy_consumption.now,
                                            usage.after_hours_energy_consumption.old
                                        )}
                                        lastPeriodPerAfterHrsNormal={
                                            usage.after_hours_energy_consumption.now >=
                                            usage.after_hours_energy_consumption.old
                                        }
                                        lastYearPerAfterHrs={percentageHandler(
                                            usage.after_hours_energy_consumption.now,
                                            usage.after_hours_energy_consumption.yearly
                                        )}
                                        lastYearPerAfterHrsNormal={
                                            usage.after_hours_energy_consumption.now >=
                                            usage.after_hours_energy_consumption.yearly
                                        }
                                    />
                                </div>
                            );
                        })}
                    </Row>
                </div>
            </Row>
        </React.Fragment>
    );
};

export default UsagePageOne;
