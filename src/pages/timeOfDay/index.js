import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button, CardHeader } from 'reactstrap';
import Header from '../../components/Header';
import HeatMapChart from '../charts/HeatMapChart';
import DonutChart from '../charts/DonutChart';
import LineChart from '../charts/LineChart';
import LineAreaChart from '../charts/LineAreaChart';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import axios from 'axios';
import { BaseUrl, builidingHourly, avgDailyUsageByHour } from '../../services/Network';
import moment from 'moment';
import { ComponentStore } from '../../store/ComponentStore';
import { BuildingStore } from '../../store/BuildingStore';
import './style.css';
import { Cookies } from 'react-cookie';
import { Spinner } from 'reactstrap';

const TimeOfDay = () => {
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    // temperory soln
    const getTimeData = (value) => {
        if (value === 1) {
            return '12AM';
        }
        if (value === 13) {
            return '12PM';
        }
        if (value >= 2 && value <= 12) {
            let num = value - 1;
            let time = `${num}AM`;
            return time;
        }
        if (value >= 14) {
            let num = value - 13;
            let time = `${num}PM`;
            return time;
        }
    };

    const areaChartOptions = {
        chart: {
            height: 380,
            type: 'area',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: true,
            },
        },
        colors: ['#5369f8', '#43d39e'],
        tooltip: {
            theme: 'dark',
            x: { show: false },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [3, 3],
            curve: 'straight',
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'],
                opacity: 0.2,
            },
            borderColor: '#f1f3fa',
        },
        xaxis: {
            // categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
            categories: [
                '12AM',
                '1AM',
                '2AM',
                '3AM',
                '4AM',
                '5AM',
                '6AM',
                '7AM',
                '8AM',
                '9AM',
                '10AM',
                '11AM',
                '12PM',
                '1PM',
                '2PM',
                '3PM',
                '4PM',
                '5PM',
                '6PM',
                '7PM',
                '8PM',
                '9PM',
                '10PM',
                '11PM',
            ],
            // labels: {
            //     formatter: function (val, timestamp) {
            //         let dateText = moment(timestamp).format('M/DD');
            //         let weekText = moment(timestamp).format('ddd');
            //         return `${weekText} ${dateText}`;
            //     },
            // },
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
                    let print = val.toFixed(0);
                    return `${print}`;
                },
            },
        },
        legend: {
            show: true,
            showForNullSeries: true,
            showForZeroSeries: true,
            showForSingleSeries: true,
            position: 'top',
            horizontalAlign: 'center',
            floating: true,
            onItemClick: {
                toggleDataSeries: false,
            },
            onItemHover: {
                highlightDataSeries: true,
            },
            markers: {
                onClick: { toggleDataSeries: false },
            },
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        toolbar: {
                            show: false,
                        },
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
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
            // x: {
            //     show: true,
            //     type: 'datetime',
            //     labels: {
            //         formatter: function (val, timestamp) {
            //             return moment(timestamp).format('DD/MM - HH:mm');
            //         },
            //     },
            // },
            y: {
                formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                    return value + ' K';
                },
            },
            marker: {
                show: false,
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const { colors } = w.globals;
                const { seriesX } = w.globals;
                const { seriesNames } = w.globals;
                const timestamp = seriesX[seriesIndex][dataPointIndex];
                const day = seriesNames[seriesIndex];
                let ch = '';
                ch =
                    ch +
                    `<div class="line-chart-widget-tooltip-time-period" style="margin-bottom:10px;">Time: ${getTimeData(
                        w.globals.labels[dataPointIndex]
                    )}</div><table style="border:none;">`;
                for (let i = 0; i < series.length; i++) {
                    ch =
                        ch +
                        `<tr style="style="border:none;"><td><span class="tooltipclass" style="background-color:${
                            colors[i]
                        };"></span> &nbsp;${seriesNames[i]} </td><td> &nbsp;${series[i][dataPointIndex].toFixed(
                            0
                        )} kWh </td></tr>`;
                }

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title" style="font-weight:bold;">Energy Consumption</h6>
                        ${ch}
                    </table></div>`;
            },
        },
    };
    const [areaChartData, setAreaChartData] = useState([]);
    const [isAvgUsageChartLoading, setIsAvgUsageChartLoading] = useState(false);

    const weekdaysOptions = {
        chart: {
            type: 'heatmap',
            toolbar: {
                show: true,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 1,
        },
        legend: {
            show: false,
        },
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                enableShades: true,
                distributed: true,
                radius: 1,
                useFillColorAsStroke: false,
            },
        },
        colors: ['#87AADE'],
        yaxis: {
            labels: {
                show: true,
                minWidth: 40,
                maxWidth: 160,
            },
            categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        },
        xaxis: {
            labels: {
                show: true,
                align: 'top',
            },
            categories: [
                '12AM',
                '1AM',
                '2AM',
                '3AM',
                '4AM',
                '5AM',
                '6AM',
                '7AM',
                '8AM',
                '9AM',
                '10AM',
                '11AM',
                '12PM',
                '1PM',
                '2PM',
                '3PM',
                '4PM',
                '5PM',
                '6PM',
                '7PM',
                '8PM',
                '9PM',
                '10PM',
                '11PM',
            ],
            position: 'top',
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
                    return value + ' K';
                },
            },
            marker: {
                show: false,
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const { seriesNames } = w.globals;
                const day = seriesNames[seriesIndex];
                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Usage by Hour</h6>
                        <div class="line-chart-widget-tooltip-value">${series[seriesIndex][dataPointIndex].toFixed(
                            0
                        )} kWh</div>
                        <div class="line-chart-widget-tooltip-time-period">
                        ${day}, ${w.globals.labels[dataPointIndex]}
                        </div>
                    </div>`;
            },
        },
    };

    const [weekdaysSeries, setWeekdaysSeries] = useState([]);
    const [isAvgHourlyChartLoading, setIsAvgHourlyChartLoading] = useState(false);

    const weekdaysChartHeight = 235;

    const [donutChartOpts, setDonutChartOpts] = useState({
        chart: {
            type: 'donut',
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
                            fontSize: '20px',
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
                        show: true,
                        showForSingleSeries: true,
                        onItemHover: {
                            highlightDataSeries: true,
                        },
                        onItemClick: {
                            toggleDataSeries: true,
                        },
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

    const [donutChartData, setDonutChartData] = useState([12553, 11553, 6503, 2333]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Time Of Day',
                        path: '/energy/time-of-day',
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
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }
        const dailyUsageByHour = async () => {
            try {
                setIsAvgUsageChartLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${builidingHourly}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res?.data;

                        let weekDaysResData = response[0]?.weekdays;
                        let weekEndResData = response[0]?.weekend;

                        const weekDaysData = weekDaysResData.map((el) => {
                            return {
                                x: parseInt(moment.utc(el.x).format('HH')),
                                y: el.y.toFixed(0),
                            };
                        });

                        const weekendsData = weekEndResData.map((el) => {
                            return {
                                x: parseInt(moment.utc(el.x).format('HH')),
                                y: el.y.toFixed(0),
                            };
                        });

                        const newWeekdaysData = {
                            name: 'Weekdays',
                            data: [],
                        };
                        const newWeekendsData = {
                            name: 'Weekends',
                            data: [],
                        };

                        const chartDataToDisplay = [];

                        for (let i = 0; i < 24; i++) {
                            let matchedRecord = weekDaysData.find((record) => record.x === i);
                            if (matchedRecord) {
                                newWeekdaysData.data.push(parseInt(matchedRecord.y / 1000));
                            } else {
                                newWeekdaysData.data.push(0);
                            }
                        }

                        for (let i = 0; i < 24; i++) {
                            let matchedRecord = weekendsData.find((record) => record.x === i);

                            if (matchedRecord) {
                                newWeekendsData.data.push(parseInt(matchedRecord.y / 1000));
                            } else {
                                newWeekendsData.data.push(0);
                            }
                        }
                        chartDataToDisplay.push(newWeekdaysData);
                        chartDataToDisplay.push(newWeekendsData);
                        setAreaChartData(chartDataToDisplay);
                        setIsAvgUsageChartLoading(false);
                    });
            } catch (error) {
                setIsAvgUsageChartLoading(false);
            }
        };

        const averageUsageByHourFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                setIsAvgHourlyChartLoading(true);
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${avgDailyUsageByHour}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res.data;

                        // default chart structure
                        let heatMapData = [
                            {
                                name: 'Monday',
                                data: [],
                            },
                            {
                                name: 'Tuesday',
                                data: [],
                            },
                            {
                                name: 'Wednesday',
                                data: [],
                            },
                            {
                                name: 'Thursday',
                                data: [],
                            },
                            {
                                name: 'Friday',
                                data: [],
                            },
                            {
                                name: 'Saturday',
                                data: [],
                            },
                            {
                                name: 'Sunday',
                                data: [],
                            },
                        ];

                        // length === 0  then below data
                        let defaultList = [
                            {
                                x: 12 + 'AM',
                                y: 0,
                            },
                            {
                                x: 1 + 'AM',
                                y: 0,
                            },
                            {
                                x: 2 + 'AM',
                                y: 0,
                            },
                            {
                                x: 3 + 'AM',
                                y: 0,
                            },
                            {
                                x: 4 + 'AM',
                                y: 0,
                            },
                            {
                                x: 5 + 'AM',
                                y: 0,
                            },
                            {
                                x: 6 + 'AM',
                                y: 0,
                            },
                            {
                                x: 7 + 'AM',
                                y: 0,
                            },
                            {
                                x: 8 + 'AM',
                                y: 0,
                            },
                            {
                                x: 9 + 'AM',
                                y: 0,
                            },
                            {
                                x: 10 + 'AM',
                                y: 0,
                            },
                            {
                                x: 11 + 'AM',
                                y: 0,
                            },
                            {
                                x: 12 + 'PM',
                                y: 0,
                            },
                            {
                                x: 1 + 'PM',
                                y: 0,
                            },
                            {
                                x: 2 + 'PM',
                                y: 0,
                            },
                            {
                                x: 3 + 'PM',
                                y: 0,
                            },
                            {
                                x: 4 + 'PM',
                                y: 0,
                            },
                            {
                                x: 5 + 'PM',
                                y: 0,
                            },
                            {
                                x: 6 + 'PM',
                                y: 0,
                            },
                            {
                                x: 7 + 'PM',
                                y: 0,
                            },
                            {
                                x: 8 + 'PM',
                                y: 0,
                            },
                            {
                                x: 9 + 'PM',
                                y: 0,
                            },
                            {
                                x: 10 + 'PM',
                                y: 0,
                            },
                            {
                                x: 11 + 'PM',
                                y: 0,
                            },
                        ];

                        let mon = [];
                        let tue = [];
                        let wed = [];
                        let thu = [];
                        let fri = [];
                        let sat = [];
                        let sun = [];

                        // Seperate record based on days

                        response.map((record) => {
                            if (record.timeline.weekday === 1) {
                                sun.push(record);
                            }
                            if (record.timeline.weekday === 2) {
                                mon.push(record);
                            }
                            if (record.timeline.weekday === 3) {
                                tue.push(record);
                            }
                            if (record.timeline.weekday === 4) {
                                wed.push(record);
                            }
                            if (record.timeline.weekday === 5) {
                                thu.push(record);
                            }
                            if (record.timeline.weekday === 6) {
                                fri.push(record);
                            }
                            if (record.timeline.weekday === 7) {
                                sat.push(record);
                            }
                        });

                        heatMapData.map((record) => {
                            if (record.name === 'Sunday') {
                                let newData = [];
                                if (sun.length !== 0) {
                                    for (let i = 0; i <= 23; i++) {
                                        let found = sun.find((x) => x.timeline.hour === i);
                                        let xval = '';
                                        if (i === 0) {
                                            xval = 12 + 'AM';
                                        } else if (i < 12) {
                                            xval = i + 'AM';
                                        } else {
                                            if (i == 12) {
                                                xval = 12 + 'PM';
                                            } else {
                                                var val = i % 12;
                                                xval = val + 'PM';
                                            }
                                        }
                                        if (found !== undefined) {
                                            newData.push({
                                                x: xval,
                                                y: (found.energy_consuption / 1000).toFixed(0),
                                            });
                                        } else {
                                            newData.push({
                                                x: xval,
                                                y: 0,
                                            });
                                        }
                                    }
                                    record.data = newData;
                                } else {
                                    record.data = defaultList;
                                }
                            }

                            if (record.name === 'Monday') {
                                let newData = [];
                                if (mon.length !== 0) {
                                    for (let i = 0; i <= 23; i++) {
                                        let found = mon.find((x) => x.timeline.hour === i);
                                        let xval = '';
                                        if (i === 0) {
                                            xval = 12 + 'AM';
                                        } else if (i < 12) {
                                            xval = i + 'AM';
                                        } else {
                                            if (i == 12) {
                                                xval = 12 + 'PM';
                                            } else {
                                                var val = i % 12;
                                                xval = val + 'PM';
                                            }
                                        }
                                        if (found !== undefined) {
                                            newData.push({
                                                x: xval,
                                                y: (found.energy_consuption / 1000).toFixed(0),
                                            });
                                        } else {
                                            newData.push({
                                                x: xval,
                                                y: 0,
                                            });
                                        }
                                    }
                                    record.data = newData;
                                } else {
                                    record.data = defaultList;
                                }
                            }

                            if (record.name === 'Tuesday') {
                                let newData = [];
                                if (tue.length !== 0) {
                                    for (let i = 0; i <= 23; i++) {
                                        let found = tue.find((x) => x.timeline.hour === i);
                                        let xval = '';
                                        if (i === 0) {
                                            xval = 12 + 'AM';
                                        } else if (i < 12) {
                                            xval = i + 'AM';
                                        } else {
                                            if (i == 12) {
                                                xval = 12 + 'PM';
                                            } else {
                                                var val = i % 12;
                                                xval = val + 'PM';
                                            }
                                        }
                                        if (found !== undefined) {
                                            newData.push({
                                                x: xval,
                                                y: (found.energy_consuption / 1000).toFixed(0),
                                            });
                                        } else {
                                            newData.push({
                                                x: xval,
                                                y: 0,
                                            });
                                        }
                                    }
                                    record.data = newData;
                                } else {
                                    record.data = defaultList;
                                }
                            }

                            if (record.name === 'Wednesday') {
                                let newData = [];
                                if (wed.length !== 0) {
                                    for (let i = 0; i <= 23; i++) {
                                        let found = wed.find((x) => x.timeline.hour === i);
                                        let xval = '';
                                        if (i === 0) {
                                            xval = 12 + 'AM';
                                        } else if (i < 12) {
                                            xval = i + 'AM';
                                        } else {
                                            if (i == 12) {
                                                xval = 12 + 'PM';
                                            } else {
                                                var val = i % 12;
                                                xval = val + 'PM';
                                            }
                                        }
                                        if (found !== undefined) {
                                            newData.push({
                                                x: xval,
                                                y: (found.energy_consuption / 1000).toFixed(0),
                                            });
                                        } else {
                                            newData.push({
                                                x: xval,
                                                y: 0,
                                            });
                                        }
                                    }
                                    record.data = newData;
                                } else {
                                    record.data = defaultList;
                                }
                            }

                            if (record.name === 'Thursday') {
                                let newData = [];
                                if (thu.length !== 0) {
                                    for (let i = 0; i <= 23; i++) {
                                        let found = thu.find((x) => x.timeline.hour === i);
                                        let xval = '';
                                        if (i === 0) {
                                            xval = 12 + 'AM';
                                        } else if (i < 12) {
                                            xval = i + 'AM';
                                        } else {
                                            if (i == 12) {
                                                xval = 12 + 'PM';
                                            } else {
                                                var val = i % 12;
                                                xval = val + 'PM';
                                            }
                                        }
                                        if (found !== undefined) {
                                            newData.push({
                                                x: xval,
                                                y: (found.energy_consuption / 1000).toFixed(0),
                                            });
                                        } else {
                                            newData.push({
                                                x: xval,
                                                y: 0,
                                            });
                                        }
                                    }
                                    record.data = newData;
                                } else {
                                    record.data = defaultList;
                                }
                            }

                            if (record.name === 'Friday') {
                                let newData = [];
                                if (fri.length !== 0) {
                                    for (let i = 0; i <= 23; i++) {
                                        let found = fri.find((x) => x.timeline.hour === i);
                                        let xval = '';
                                        if (i === 0) {
                                            xval = 12 + 'AM';
                                        } else if (i < 12) {
                                            xval = i + 'AM';
                                        } else {
                                            if (i == 12) {
                                                xval = 12 + 'PM';
                                            } else {
                                                var val = i % 12;
                                                xval = val + 'PM';
                                            }
                                        }
                                        if (found !== undefined) {
                                            newData.push({
                                                x: xval,
                                                y: (found.energy_consuption / 1000).toFixed(0),
                                            });
                                        } else {
                                            newData.push({
                                                x: xval,
                                                y: 0,
                                            });
                                        }
                                    }
                                    record.data = newData;
                                } else {
                                    record.data = defaultList;
                                }
                            }

                            if (record.name === 'Saturday') {
                                let newData = [];
                                if (sat.length !== 0) {
                                    for (let i = 0; i <= 23; i++) {
                                        let found = sat.find((x) => x.timeline.hour === i);
                                        let xval = '';
                                        if (i === 0) {
                                            xval = 12 + 'AM';
                                        } else if (i < 12) {
                                            xval = i + 'AM';
                                        } else {
                                            if (i == 12) {
                                                xval = 12 + 'PM';
                                            } else {
                                                var val = i % 12;
                                                xval = val + 'PM';
                                            }
                                        }
                                        if (found !== undefined) {
                                            newData.push({
                                                x: xval,
                                                y: (found.energy_consuption / 1000).toFixed(0),
                                            });
                                        } else {
                                            newData.push({
                                                x: xval,
                                                y: 0,
                                            });
                                        }
                                    }
                                    record.data = newData;
                                } else {
                                    record.data = defaultList;
                                }
                            }
                        });

                        setWeekdaysSeries(heatMapData.reverse());
                        setIsAvgHourlyChartLoading(false);
                    });
            } catch (error) {
                setIsAvgHourlyChartLoading(false);
            }
        };

        dailyUsageByHour();
        averageUsageByHourFetch();
    }, [startDate, endDate, bldgId]);

    return (
        <React.Fragment>
            <div className="ml-2">
                <Header title="Time of Day" />
            </div>

            <Row className="ml-2">
                <Col xl={3}>
                    <div className="card-body timeofday-content-style">
                        <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                            After-Hours Energy
                        </h6>
                        <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Totals</h6>
                        <div className="mt-2 ">
                            <DonutChart donutChartOpts={donutChartOpts} donutChartData={donutChartData} height={200} />
                        </div>
                    </div>
                </Col>
                <Col xl={9}>
                    <div className="card-body timeofday-content-style">
                        <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                            Hourly Average Consumption
                        </h6>
                        <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Usage By Hour</h6>

                        {isAvgHourlyChartLoading ? (
                            <div className="loader-center-style" style={{ height: '400px' }}>
                                <Spinner className="m-2" color={'primary'} />
                            </div>
                        ) : (
                            <HeatMapChart
                                options={weekdaysOptions}
                                series={weekdaysSeries}
                                height={weekdaysChartHeight}
                            />
                        )}
                    </div>
                </Col>
            </Row>

            <Row className="mt-2 ml-2">
                <Col xl={11}>
                    <div className="card-body timeofday-content-style">
                        <h6 className="card-title custom-title">Average Daily Usage by Hour</h6>
                        <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Usage By Hour (kWh)</h6>

                        {isAvgUsageChartLoading ? (
                            <div className="loader-center-style" style={{ height: '400px' }}>
                                <Spinner className="m-2" color={'primary'} />
                            </div>
                        ) : (
                            <LineAreaChart options={areaChartOptions} series={areaChartData} height={400} />
                        )}
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default TimeOfDay;
