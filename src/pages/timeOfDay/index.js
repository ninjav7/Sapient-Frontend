import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Button, CardHeader } from 'reactstrap';
import Header from '../../components/Header';
import HeatMapChart from '../charts/HeatMapChart';
import DonutChart from '../charts/DonutChart';
import LineChart from '../charts/LineChart';
import { useParams } from 'react-router-dom';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import axios from 'axios';
import { BaseUrl, builidingHourly, avgDailyUsageByHour } from '../../services/Network';
import { dateFormatHandler } from '../../utils/helper';
import moment from 'moment';
import './style.css';

const TimeOfDay = () => {
    const { bldgId } = useParams();

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    const apexLineChartWithLables = {
        chart: {
            height: 380,
            type: 'line',
            zoom: {
                enabled: false,
            },
            toolbar: {
                show: false,
            },
        },
        colors: ['#5369f8', '#43d39e', '#f77e53', '#1ce1ac', '#25c2e3', '#ffbe0b'],
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
        title: {
            // text: 'Average High & Low Temperature',
            align: 'left',
            style: {
                fontSize: '14px',
            },
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2,
            },
            borderColor: '#f1f3fa',
        },
        // markers: {
        //     style: 'inverted',
        //     size: 6,
        // },
        xaxis: {
            // categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
            categories: [],
        },
        yaxis: {
            // min: 5,
            // max: 40,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            floating: true,
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
    };

    const apexLineChartWithLablesData = [
        {
            name: 'Weekdays',
            data: [9, 15, 18, 20, 24, 17, 16],
        },
        {
            name: 'Weekends',
            data: [5, 11, 14, 18, 17, 13, 13],
        },
    ];

    const [lineChartOptions, setLineChartOptions] = useState({
        chart: {
            height: 380,
            type: 'line',
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
        // title: {
        //     text: 'Average High & Low Temperature',
        //     align: 'left',
        //     style: {
        //         fontSize: '14px',
        //     },
        // },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2,
            },
            borderColor: '#f1f3fa',
        },
        // markers: {
        //     style: 'inverted',
        //     size: 6,
        // },
        xaxis: {
            categories: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24],
        },
        yaxis: {
            // min: 5,
            // max: 40,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'center',
            floating: true,
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
    });
    const [lineChartData, setLineChartData] = useState([
        {
            name: 'Weekdays',
            data: [],
        },
        {
            name: 'Weekends',
            data: [],
        },
    ]);

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
                radius: 0,
                useFillColorAsStroke: false,

                // xaxis: {
                //     range: 4,
                // },
                colorScale: {
                    ranges: [
                        {
                            from: 0,
                            to: 499,
                            color: '#9bb4da',
                            name: 'Low',
                        },
                        {
                            from: 500,
                            to: 999,
                            color: '#819dc9',
                            name: 'Medium',
                        },
                        {
                            from: 1000,
                            to: 1499,
                            color: '#128FD9',
                            name: 'High',
                        },
                        {
                            from: 1500,
                            to: 1999,
                            color: '#F87171',
                            name: 'Very High',
                        },
                        {
                            from: 2000,
                            to: 3999,
                            color: '#FF0000',
                            name: 'Extreme',
                        },
                    ],
                },
            },
        },
        yaxis: {
            labels: {
                show: true,
                minWidth: 40,
                maxWidth: 160,
            },
        },
        xaxis: {
            labels: {
                show: true,
                align: 'top',
            },
            categories: ['1AM', '3AM', '5AM', '7AM', '9AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12PM'],
        },
    };

    const [weekdaysSeries, setWeekdaysSeries] = useState([]);

    // const weekdaysSeries = [
    //     {
    //         name: 'Monday',
    //         data: [
    //             {
    //                 x: '1AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '2AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '3AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '4AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '5AM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '7AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '8AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '9AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '10AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '11AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '12PM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '1PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '2PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '3PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '4PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '5PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '7PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '8PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '9PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '10PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '11PM',
    //                 y: 2500,
    //             },
    //             {
    //                 x: '12AM',
    //                 y: 2000,
    //             },
    //         ],
    //     },
    //     {
    //         name: 'Tuesday',
    //         data: [
    //             {
    //                 x: '1AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '2AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '3AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '4AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '5AM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '7AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '8AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '9AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '10AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '11AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '12PM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '1PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '2PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '3PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '4PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '5PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '7PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '8PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '9PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '10PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '11PM',
    //                 y: 2500,
    //             },
    //             {
    //                 x: '12AM',
    //                 y: 2000,
    //             },
    //         ],
    //     },
    //     {
    //         name: 'Wednesday',
    //         data: [
    //             {
    //                 x: '1AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '2AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '3AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '4AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '5AM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '7AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '8AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '9AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '10AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '11AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '12PM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '1PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '2PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '3PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '4PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '5PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '7PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '8PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '9PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '10PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '11PM',
    //                 y: 2500,
    //             },
    //             {
    //                 x: '12AM',
    //                 y: 2000,
    //             },
    //         ],
    //     },
    //     {
    //         name: 'Thursday',
    //         data: [
    //             {
    //                 x: '1AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '2AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '3AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '4AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '5AM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '7AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '8AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '9AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '10AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '11AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '12PM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '1PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '2PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '3PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '4PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '5PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '7PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '8PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '9PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '10PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '11PM',
    //                 y: 2500,
    //             },
    //             {
    //                 x: '12AM',
    //                 y: 2000,
    //             },
    //         ],
    //     },
    //     {
    //         name: 'Friday',
    //         data: [
    //             {
    //                 x: '1AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '2AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '3AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '4AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '5AM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '7AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '8AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '9AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '10AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '11AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '12PM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '1PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '2PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '3PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '4PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '5PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '7PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '8PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '9PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '10PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '11PM',
    //                 y: 2500,
    //             },
    //             {
    //                 x: '12AM',
    //                 y: 2000,
    //             },
    //         ],
    //     },
    //     {
    //         name: 'Saturday',
    //         data: [
    //             {
    //                 x: '1AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '2AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '3AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '4AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '5AM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '7AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '8AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '9AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '10AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '11AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '12PM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '1PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '2PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '3PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '4PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '5PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '7PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '8PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '9PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '10PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '11PM',
    //                 y: 2500,
    //             },
    //             {
    //                 x: '12AM',
    //                 y: 2000,
    //             },
    //         ],
    //     },
    //     {
    //         name: 'Sunday',
    //         data: [
    //             {
    //                 x: '1AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '2AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '3AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '4AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '5AM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '7AM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '8AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '9AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '10AM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '11AM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '12PM',
    //                 y: 1000,
    //             },
    //             {
    //                 x: '1PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '2PM',
    //                 y: 2000,
    //             },
    //             {
    //                 x: '3PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '4PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '5PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '6PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '7PM',
    //                 y: 5000,
    //             },
    //             {
    //                 x: '8PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '9PM',
    //                 y: 4000,
    //             },
    //             {
    //                 x: '10PM',
    //                 y: 3000,
    //             },
    //             {
    //                 x: '11PM',
    //                 y: 2500,
    //             },
    //             {
    //                 x: '12AM',
    //                 y: 2000,
    //             },
    //         ],
    //     },
    // ];

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
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${builidingHourly}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res.data;

                        let weekDaysResData = response[0].weekdays;
                        let weekEndResData = response[0].weekend;

                        const weekDaysData = weekDaysResData.map((el) => {
                            return {
                                x: parseInt(moment(el.x).format('HH')),
                                y: el.y,
                            };
                        });

                        const weekendsData = weekEndResData.map((el) => {
                            return {
                                x: parseInt(moment(el.x).format('HH')),
                                y: el.y,
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

                        const chartData = [];

                        for (let i = 1; i <= 24; i++) {
                            let matchedRecord = weekDaysData.find((record) => record.x === i);
                            if (matchedRecord) {
                                newWeekdaysData.data.push(parseInt(matchedRecord.y));
                            } else {
                                newWeekdaysData.data.push(0);
                            }
                        }

                        for (let i = 1; i <= 24; i++) {
                            let matchedRecord = weekendsData.find((record) => record.x === i);

                            if (matchedRecord) {
                                newWeekendsData.data.push(parseInt(matchedRecord.y));
                            } else {
                                newWeekendsData.data.push(0);
                            }
                        }
                        chartData.push(newWeekdaysData);
                        chartData.push(newWeekendsData);
                        setLineChartData(chartData);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Daily Usage Hour Data');
            }
        };

        const averageUsageByHourFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${avgDailyUsageByHour}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res.data;

                        // default chart structure
                        let heatMapData = [
                            {
                                name: 'Sunday',
                                data: [],
                            },
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
                        ];

                        // length === 0  then below data
                        let defaultList = [
                            {
                                x: 1,
                                y: 0,
                            },
                            {
                                x: 2,
                                y: 0,
                            },
                            {
                                x: 3,
                                y: 0,
                            },
                            {
                                x: 4,
                                y: 0,
                            },
                            {
                                x: 5,
                                y: 0,
                            },
                            {
                                x: 6,
                                y: 0,
                            },
                            {
                                x: 7,
                                y: 0,
                            },
                            {
                                x: 8,
                                y: 0,
                            },
                            {
                                x: 9,
                                y: 0,
                            },
                            {
                                x: 10,
                                y: 0,
                            },
                            {
                                x: 11,
                                y: 0,
                            },
                            {
                                x: 12,
                                y: 0,
                            },
                            {
                                x: 13,
                                y: 0,
                            },
                            {
                                x: 14,
                                y: 0,
                            },
                            {
                                x: 15,
                                y: 0,
                            },
                            {
                                x: 16,
                                y: 0,
                            },
                            {
                                x: 17,
                                y: 0,
                            },
                            {
                                x: 18,
                                y: 0,
                            },
                            {
                                x: 19,
                                y: 0,
                            },
                            {
                                x: 20,
                                y: 0,
                            },
                            {
                                x: 21,
                                y: 0,
                            },
                            {
                                x: 22,
                                y: 0,
                            },
                            {
                                x: 23,
                                y: 0,
                            },
                            {
                                x: 24,
                                y: 0,
                            },
                        ];

                        let sun = [];
                        let mon = [];
                        let tue = [];
                        let wed = [];
                        let thu = [];
                        let fri = [];
                        let sat = [];

                        // Seperate record based on days
                        response.map((record) => {
                            if (record.timeline.weekday === 0) {
                                sun.push(record);
                            }
                            if (record.timeline.weekday === 1) {
                                mon.push(record);
                            }
                            if (record.timeline.weekday === 2) {
                                tue.push(record);
                            }
                            if (record.timeline.weekday === 3) {
                                wed.push(record);
                            }
                            if (record.timeline.weekday === 4) {
                                thu.push(record);
                            }
                            if (record.timeline.weekday === 5) {
                                fri.push(record);
                            }
                            if (record.timeline.weekday === 6) {
                                sat.push(record);
                            }
                        });

                        heatMapData.map((record) => {
                            if (record.name === 'Sunday') {
                                let newData = [];
                                if (sun.length !== 0) {
                                    for (let i = 1; i <= 24; i++) {
                                        let found = sun.find((x) => x.timeline.hour === i);

                                        if (found !== undefined) {
                                            console.log('Inside if block');
                                            newData.push({
                                                x: i,
                                                y: found.energy_consuption,
                                            });
                                        } else {
                                            console.log('Inside else block');
                                            newData.push({
                                                x: i,
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
                                    for (let i = 1; i <= 24; i++) {
                                        let found = mon.find((x) => x.timeline.hour === i);

                                        if (found !== undefined) {
                                            console.log('Inside if block');
                                            newData.push({
                                                x: i,
                                                y: found.energy_consuption,
                                            });
                                        } else {
                                            console.log('Inside else block');
                                            newData.push({
                                                x: i,
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
                                    for (let i = 1; i <= 24; i++) {
                                        let found = tue.find((x) => x.timeline.hour === i);

                                        if (found !== undefined) {
                                            console.log('Inside if block');
                                            newData.push({
                                                x: i,
                                                y: found.energy_consuption,
                                            });
                                        } else {
                                            console.log('Inside else block');
                                            newData.push({
                                                x: i,
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
                                    for (let i = 1; i <= 24; i++) {
                                        let found = wed.find((x) => x.timeline.hour === i);

                                        if (found !== undefined) {
                                            console.log('Inside if block');
                                            newData.push({
                                                x: i,
                                                y: found.energy_consuption,
                                            });
                                        } else {
                                            console.log('Inside else block');
                                            newData.push({
                                                x: i,
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
                                    for (let i = 1; i <= 24; i++) {
                                        let found = thu.find((x) => x.timeline.hour === i);

                                        if (found !== undefined) {
                                            console.log('Inside if block');
                                            newData.push({
                                                x: i,
                                                y: found.energy_consuption,
                                            });
                                        } else {
                                            console.log('Inside else block');
                                            newData.push({
                                                x: i,
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
                                    for (let i = 1; i <= 24; i++) {
                                        let found = fri.find((x) => x.timeline.hour === i);

                                        if (found !== undefined) {
                                            console.log('Inside if block');
                                            newData.push({
                                                x: i,
                                                y: found.energy_consuption,
                                            });
                                        } else {
                                            console.log('Inside else block');
                                            newData.push({
                                                x: i,
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
                                    for (let i = 1; i <= 24; i++) {
                                        let found = sat.find((x) => x.timeline.hour === i);

                                        if (found !== undefined) {
                                            console.log('Inside if block');
                                            newData.push({
                                                x: i,
                                                y: found.energy_consuption,
                                            });
                                        } else {
                                            console.log('Inside else block');
                                            newData.push({
                                                x: i,
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

                        console.log('heatMapData => ', heatMapData);
                        setWeekdaysSeries(heatMapData);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Daily Usage Hour Data');
            }
        };

        dailyUsageByHour();
        averageUsageByHourFetch();
    }, [startDate, endDate, bldgId]);

    return (
        <React.Fragment>
            <Header title="Time of Day" />
            <Row className="">
                <Col xl={3}>
                    <div className="card-body container-style">
                        <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                            Off Hours Energy
                        </h6>
                        <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Totals</h6>
                        <div className="mt-2 ">
                            <DonutChart donutChartOpts={donutChartOpts} donutChartData={donutChartData} height={200} />
                        </div>
                    </div>
                </Col>
                <Col xl={9}>
                    <div className="card-body">
                        <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                            Average Daily Usage by Hour
                        </h6>
                        <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Usage By Hour</h6>
                        <HeatMapChart options={weekdaysOptions} series={weekdaysSeries} height={weekdaysChartHeight} />
                    </div>
                </Col>
            </Row>

            <Row className="mt-2">
                <Col xl={11}>
                    <div className="card-body ">
                        <h6 className="card-title custom-title">Average Daily Usage by Hour</h6>
                        <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Usage By Hour Trend</h6>
                        <div className="mt-2">
                            {/* <LineChart title="" /> */}
                            <LineChart title="" options={lineChartOptions} series={lineChartData} height={400} />
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default TimeOfDay;
