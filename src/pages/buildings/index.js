import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, UncontrolledTooltip } from 'reactstrap';
import DonutChart from '../charts/DonutChart';
import Header from '../../components/Header';
import LineChart from '../charts/LineChart';
import DetailedButton from './DetailedButton';
import EnergyLineChart from './EnergyLineChart';
import HeatMapChart from '../charts/HeatMapChart';
import upGraph from '../../assets/icon/buildings/up-graph.svg';
import serviceAlert from '../../assets/icon/buildings/service-alert.svg';
import buildingPeak from '../../assets/icon/buildings/building-peak.svg';
import axios from 'axios';
import {
    BaseUrl,
    builidingAlerts,
    builidingEquipments,
    builidingHourly,
    getEnergyConsumption,
    builidingPeak,
    portfolioEndUser,
    portfolioOverall,
} from '../../services/Network';
import moment from 'moment';
import { percentageHandler, dateFormatHandler } from '../../utils/helper';
import { BreadcrumbStore } from '../../components/BreadcrumbStore';
import { Link, useParams } from 'react-router-dom';
import { DateRangeStore } from '../../components/DateRangeStore';
import './style.css';

const BuildingOverview = () => {
    const { bldgId } = useParams();

    const [overview, setOverview] = useState({
        total_building: 0,
        portfolio_rank: '10 of 50',
        total_consumption: {
            now: 0,
            old: 0,
        },
        average_energy_density: {
            now: 0,
            old: 0,
        },
        yearly_electric_eui: {
            now: 0,
            old: 0,
        },
    });

    const [buildingConsumptionChart, setBuildingConsumptionChart] = useState([]);

    // const [buildingAlert, setBuildingAlerts] = useState([
    //     {
    //         type: 'string',
    //         building_name: 'New Building Peak',
    //         building_address: 'address',
    //         trend: 'string',
    //         last_known_value: '100',
    //         current_value: '10',
    //         message: 'test',
    //         due_message: '10',
    //         created_at: 'Today',
    //     },
    //     {
    //         type: 'type2',
    //         building_name: 'Energy trend Upward',
    //         building_address: 'address',
    //         trend: 'string',
    //         last_known_value: '100',
    //         current_value: '10',
    //         message: 'test',
    //         due_message: '10',
    //         created_at: 'Today',
    //     },
    // ]);

    const [buildingAlert, setBuildingAlerts] = useState([]);

    const [buildingPeak, setBuildingPeak] = useState([
        {
            type: 'string',
            building_name: 'New Building Peak',
            building_address: 'address',
            trend: 'string',
            last_known_value: '100',
            current_value: '10',
            message: 'test',
            due_message: '10',
            created_at: 'Today',
        },
        {
            type: 'type2',
            building_name: 'Energy trend Upward',
            building_address: 'address',
            trend: 'string',
            last_known_value: '100',
            current_value: '10',
            message: 'test',
            due_message: '10',
            created_at: 'Today',
        },
    ]);

    const [buildingsEnergyConsume, setbuildingsEnergyConsume] = useState([]);

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

    const [lineChartSeries, setLineChartSeries] = useState([
        {
            data: [
                {
                    x: new Date('2022-10-1').getTime(),
                    y: 22000,
                },
                {
                    x: new Date('2022-10-2').getTime(),
                    y: 25000,
                },
                {
                    x: new Date('2022-10-3').getTime(),
                    y: 21500,
                },
                {
                    x: new Date('2022-10-4').getTime(),
                    y: 23000,
                },
                {
                    x: new Date('2022-10-5').getTime(),
                    y: 20000,
                },
                {
                    x: new Date('2022-10-6').getTime(),
                    y: 15000,
                },
                {
                    x: new Date('2022-10-7').getTime(),
                    y: 18000,
                },
                {
                    x: new Date('2022-10-8').getTime(),
                    y: 25000,
                },
                {
                    x: new Date('2022-10-9').getTime(),
                    y: 15000,
                },
                {
                    x: new Date('2022-10-10').getTime(),
                    y: 20000,
                },
                {
                    x: new Date('2022-10-11').getTime(),
                    y: 23000,
                },
                {
                    x: new Date('2022-10-12').getTime(),
                    y: 20000,
                },
                {
                    x: new Date('2022-10-13').getTime(),
                    y: 23000,
                },
                {
                    x: new Date('2022-10-14').getTime(),
                    y: 19000,
                },
                {
                    x: new Date('2022-10-15').getTime(),
                    y: 24000,
                },
                {
                    x: new Date('2022-10-16').getTime(),
                    y: 20000,
                },
                {
                    x: new Date('2022-10-17').getTime(),
                    y: 25000,
                },
                {
                    x: new Date('2022-10-18').getTime(),
                    y: 23000,
                },
                {
                    x: new Date('2022-10-19').getTime(),
                    y: 27000,
                },
                {
                    x: new Date('2022-10-20').getTime(),
                    y: 22000,
                },
                {
                    x: new Date('2022-10-21').getTime(),
                    y: 20000,
                },
                {
                    x: new Date('2022-10-22').getTime(),
                    y: 21000,
                },
                {
                    x: new Date('2022-10-23').getTime(),
                    y: 24000,
                },
                {
                    x: new Date('2022-10-24').getTime(),
                    y: 18000,
                },
                {
                    x: new Date('2022-10-25').getTime(),
                    y: 19000,
                },
                {
                    x: new Date('2022-10-26').getTime(),
                    y: 24000,
                },
                {
                    x: new Date('2022-10-27').getTime(),
                    y: 21000,
                },
                {
                    x: new Date('2022-10-28').getTime(),
                    y: 27000,
                },
                {
                    x: new Date('2022-10-29').getTime(),
                    y: 24000,
                },
                {
                    x: new Date('2022-10-30').getTime(),
                    y: 20000,
                },
            ],
        },
    ]);

    const [lineChartOptions, setLineChartOptions] = useState({
        chart: {
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        colors: ['#87AADE'],
        stroke: {
            curve: 'straight',
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
            },
        },
        stroke: {
            width: [2, 2],
        },
        plotOptions: {
            bar: {
                columnWidth: '20%',
            },
        },
        tooltip: {
            shared: true,
            intersect: false,
            x: {
                show: true,
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (value, timestamp, opts) {
                    return opts.dateFormatter(new Date(timestamp), 'MMMdd');
                },
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    var val = Math.abs(value);
                    if (val >= 1000) {
                        val = (val / 1000).toFixed(0) + ' K';
                    }
                    return val;
                },
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
    });

    // const [energyConsumption, setEnergyConsumption] = useState([
    //     {
    //         device: 'HVAC',
    //         energy_consumption: {
    //             now: 8000,
    //             old: 100,
    //         },
    //     },
    //     {
    //         device: 'HVAC',
    //         energy_consumption: {
    //             now: 1000,
    //             old: 100,
    //         },
    //     },
    //     {
    //         device: 'HVAC',
    //         energy_consumption: {
    //             now: 1000,
    //             old: 100,
    //         },
    //     },
    //     {
    //         device: 'HVAC',
    //         energy_consumption: {
    //             now: 1000,
    //             old: 100,
    //         },
    //     },
    // ]);

    const [energyConsumption, setEnergyConsumption] = useState([]);

    // const [topEnergyConsumption, setTopEnergyConsumption] = useState([
    //     {
    //         equipment_id: 0,
    //         equipment_name: 'AHU 1',
    //         energy_consumption: {
    //             now: 25.3,
    //             old: 20,
    //         },
    //     },
    //     {
    //         equipment_id: 1,
    //         equipment_name: 'AHU 2',
    //         energy_consumption: {
    //             now: 75.3,
    //             old: 20,
    //         },
    //     },
    //     {
    //         equipment_id: 2,
    //         equipment_name: 'AHU 3',
    //         energy_consumption: {
    //             now: 89.3,
    //             old: 20,
    //         },
    //     },
    //     {
    //         equipment_id: 3,
    //         equipment_name: 'AHU 4',
    //         energy_consumption: {
    //             now: 100.3,
    //             old: 20,
    //         },
    //     },
    // ]);
    const [topEnergyConsumption, setTopEnergyConsumption] = useState([]);

    // const [topContributors, setTopContributors] = useState([
    //     {
    //         timeRange: {
    //             frm: 'yyy-mm-dd',
    //             to: 'yyy-mm-dd',
    //         },
    //         overall_energy_consumption: 0,
    //         top_contributors: [
    //             {
    //                 equipment_id: 0,
    //                 equipment_name: 'string',
    //                 energy_consumption: {
    //                     now: 0,
    //                     ol: 0,
    //                 },
    //             },
    //         ],
    //     },
    // ]);

    const [topContributors, setTopContributors] = useState([]);

    const weekDaysOptions = {
        chart: {
            type: 'heatmap',
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        title: {
            text: 'Weekdays',
            align: 'left',
            margin: 1,
            offsetX: 12,
            offsetY: 20,
            floating: false,
            style: {
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'Inter',
                color: '#98A2B3',
            },
        },
        stroke: {
            width: 0.7,
        },
        plotOptions: {
            heatmap: {
                // shadeIntensity: 0.5,
                radius: 1,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        {
                            from: 0,
                            to: 25,
                            color: '#9bb4da',
                        },
                        {
                            from: 26,
                            to: 50,
                            color: '#819dc9',
                        },
                        {
                            from: 51,
                            to: 100,
                            color: '#128FD9',
                        },
                        {
                            from: 101,
                            to: 150,
                            color: '#F87171',
                        },
                        {
                            from: 151,
                            to: 200,
                            color: '#FF0000',
                        },
                    ],
                },
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        xaxis: {
            labels: {
                show: true,
            },
            categories: ['1AM', '3AM', '5AM', '7AM', '9AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12PM'],
        },
    };

    // const weekdaysSeries = [
    //     {
    //         name: 'Weekdays',
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

    const [weekDaysSeries, setWeekDaysSeries] = useState([
        {
            name: 'Weekdays',
            data: [],
        },
    ]);

    const weekdaysChartHeight = 125;
    const weekendsChartHeight = 125;

    const weekendsOptions = {
        chart: {
            type: 'heatmap',
            toolbar: {
                show: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        title: {
            text: 'Weekends',
            align: 'left',
            margin: 1,
            offsetX: 12,
            offsetY: 20,
            floating: false,
            style: {
                fontSize: '14px',
                fontWeight: '600',
                fontFamily: 'Inter',
                color: '#98A2B3',
            },
        },
        stroke: {
            width: 0.7,
        },
        plotOptions: {
            heatmap: {
                // shadeIntensity: 0.5,
                radius: 1,
                useFillColorAsStroke: false,
                colorScale: {
                    ranges: [
                        {
                            from: 1000,
                            to: 1999,
                            color: '#9bb4da',
                        },
                        {
                            from: 2000,
                            to: 2999,
                            color: '#819dc9',
                        },
                        {
                            from: 3000,
                            to: 3999,
                            color: '#128FD9',
                        },
                        {
                            from: 4000,
                            to: 4999,
                            color: '#F87171',
                        },
                        {
                            from: 5000,
                            to: 5999,
                            color: '#FF0000',
                        },
                    ],
                },
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        xaxis: {
            labels: {
                show: true,
            },
            categories: ['1AM', '3AM', '5AM', '7AM', '9AM', '12PM', '2PM', '4PM', '6PM', '8PM', '10PM', '12PM'],
        },
    };

    const weekendsSeries = [
        {
            name: 'Weekends',
            data: [
                {
                    x: '1AM',
                    y: 1000,
                },
                {
                    x: '2AM',
                    y: 1000,
                },
                {
                    x: '3AM',
                    y: 2000,
                },
                {
                    x: '4AM',
                    y: 2000,
                },
                {
                    x: '5AM',
                    y: 4000,
                },
                {
                    x: '6AM',
                    y: 3000,
                },
                {
                    x: '7AM',
                    y: 3000,
                },
                {
                    x: '8AM',
                    y: 1000,
                },
                {
                    x: '9AM',
                    y: 2000,
                },
                {
                    x: '10AM',
                    y: 2000,
                },
                {
                    x: '11AM',
                    y: 1000,
                },
                {
                    x: '12PM',
                    y: 1000,
                },
                {
                    x: '1PM',
                    y: 2000,
                },
                {
                    x: '2PM',
                    y: 2000,
                },
                {
                    x: '3PM',
                    y: 3000,
                },
                {
                    x: '4PM',
                    y: 4000,
                },
                {
                    x: '5PM',
                    y: 4000,
                },
                {
                    x: '6PM',
                    y: 5000,
                },
                {
                    x: '7PM',
                    y: 5000,
                },
                {
                    x: '8PM',
                    y: 4000,
                },
                {
                    x: '9PM',
                    y: 4000,
                },
                {
                    x: '10PM',
                    y: 3000,
                },
                {
                    x: '11PM',
                    y: 2500,
                },
                {
                    x: '12AM',
                    y: 2000,
                },
            ],
        },
    ];

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    useEffect(() => {
        const buildingOverallData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${portfolioOverall}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        setOverview(res.data);
                        console.log('setOverview => ', res.data);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building Overall Data');
            }
        };

        const buildingEndUserData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${portfolioEndUser}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        setEnergyConsumption(res.data);
                        console.log('setenergyConsumption', res.data);
                        const energyData = res.data;
                        let newDonutData = [];
                        energyData.forEach((record) => {
                            let fixedConsumption = record.energy_consumption.now;
                            // newArray.push(fixedConsumption);
                            newDonutData.push(parseInt(fixedConsumption));
                        });
                        setDonutChartData(newDonutData);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building EndUses Data');
            }
        };

        const buildingAlertsData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                let params = `?building_id=${1}`;
                await axios
                    .post(
                        `${BaseUrl}${builidingAlerts}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        setBuildingAlerts(res.data);
                        console.log('Building Alert => ', res.data);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building Alert Data');
            }
        };

        const buildingPeaksData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                let params = `?building_id=${bldgId}&limit=${2}`;
                await axios
                    .post(
                        `${BaseUrl}${builidingPeak}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        setTopContributors(res.data);
                        console.log(res.data);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building Peak Data');
            }
        };

        const builidingEquipmentsData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${builidingEquipments}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        setTopEnergyConsumption(res.data[0].top_contributors);
                        console.log(res.data);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building Equipments Data');
            }
        };

        const builidingHourlyData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                let params = `?building_id=${bldgId}&aggregate=${'hi'}`;
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
                        const data = res.data.map((el) => {
                            return {
                                x: parseInt(el.timestamp),
                                y: el.energy_consumption,
                            };
                        });

                        const newHeatMapData = [
                            {
                                name: 'Weekdays',
                                data: [],
                            },
                        ];

                        for (let i = 1; i <= 24; i++) {
                            let matchedRecord = data.find((record) => record.x === i);

                            console.log('matchedRecord => ', matchedRecord);

                            if (matchedRecord) {
                                newHeatMapData[0].data.push(matchedRecord);
                            } else {
                                newHeatMapData[0].data.push({
                                    x: i,
                                    y: 0,
                                });
                            }
                        }
                        setWeekDaysSeries(newHeatMapData);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building Hourly Data');
            }
        };

        const buildingConsumptionChart = async () => {
            if (startDate !== null) {
                try {
                    let headers = {
                        'Content-Type': 'application/json',
                        accept: 'application/json',
                    };
                    let params = `?aggregate=day&building_id=${bldgId}`;
                    await axios
                        .post(
                            `${BaseUrl}${getEnergyConsumption}${params}`,
                            {
                                date_from: dateFormatHandler(startDate),
                                date_to: dateFormatHandler(endDate),
                            },
                            { headers }
                        )
                        .then((res) => {
                            let response = res.data;
                            let newArray = [
                                {
                                    data: [],
                                },
                            ];
                            response.forEach((record) => {
                                newArray[0].data.push({
                                    x: moment(record.x).format('MMM D'),
                                    y: record.y.toFixed(2),
                                });
                            });
                            console.log('newArray => ', newArray);
                            setBuildingConsumptionChart(newArray);
                        });
                } catch (error) {
                    console.log(error);
                    alert('Failed to fetch Building Consumption Chart');
                }
            }
        };

        buildingOverallData();
        buildingEndUserData();
        buildingAlertsData();
        buildingPeaksData();
        builidingEquipmentsData();
        builidingHourlyData();
        buildingConsumptionChart();
    }, [startDate, endDate, bldgId]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Building Overview',
                        path: '/energy/building/overview',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
        };
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Header title="Building Overview" />
            {/* <h3>ID : {bldgId}</h3> */}
            <Row xl={12}>
                <div className="card-group button-style" style={{ marginLeft: '29px' }}>
                    <div className="card card-box-style button-style">
                        <div className="card-body text-center">
                            <DetailedButton
                                title="Total Consumption"
                                description={overview.total_consumption.now}
                                unit="kWh"
                                value={percentageHandler(
                                    overview.total_consumption.now,
                                    overview.total_consumption.old
                                )}
                                consumptionNormal={overview.total_consumption.now >= overview.total_consumption.old}
                            />
                        </div>
                    </div>
                    {/* <div className="card card-box-style button-style">
                            <div className="card-body">
                                <h5 className="card-title subtitle-style">
                                    Portfolio Rank&nbsp;&nbsp;
                                    <div>
                                        <i className="uil uil-info-circle avatar-xs rounded-circle" id="title" />
                                        <UncontrolledTooltip placement="bottom" target="#title">
                                            Information ToolTips
                                        </UncontrolledTooltip>
                                    </div>
                                </h5>
                                <p className="card-text card-content-style">
                                    {overview.portfolio_rank.split('of')[0]}{' '}
                                    <span className="card-unit-style">
                                        &nbsp;&nbsp;of{' '}
                                        {overview.portfolio_rank
                                            ? overview.portfolio_rank.split('of')[1]
                                            : overview.portfolio_rank.split('of')[1]}
                                    </span>
                                </p>
                            </div>
                        </div> */}
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="Energy Density"
                                description={overview.average_energy_density.now}
                                unit="kWh/sq.ft."
                                value={percentageHandler(
                                    overview.average_energy_density.now,
                                    overview.average_energy_density.old
                                )}
                                consumptionNormal={
                                    overview.average_energy_density.now >= overview.average_energy_density.old
                                }
                            />
                        </div>
                    </div>
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="12 Mo. Electric EUI"
                                description={overview.yearly_electric_eui.now}
                                unit="kBtu/ft/yr"
                                value={percentageHandler(
                                    overview.yearly_electric_eui.now,
                                    overview.yearly_electric_eui.old
                                )}
                                consumptionNormal={overview.yearly_electric_eui.now >= overview.yearly_electric_eui.old}
                            />
                        </div>
                    </div>
                    <div className="card card-box-style button-style">
                        <div className="card-body">
                            <h5 className="card-title subtitle-style" style={{ marginTop: '3px' }}>
                                Monitored Load&nbsp;&nbsp;
                                <div>
                                    <i className="uil uil-info-circle avatar-xs rounded-circle" id="title" />
                                    <UncontrolledTooltip placement="bottom" target="#title">
                                        Information ToolTips
                                    </UncontrolledTooltip>
                                </div>
                            </h5>
                            <button id="inner-button">Add Utility Bill</button>
                        </div>
                    </div>
                </div>
            </Row>

            <div className="energy-blg-container mt-3">
                <div className="energy-blg-container-one">
                    {/* Heading  */}
                    <div className="card-body">
                        <h6 className="card-title custom-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                            Energy Consumption by End Use
                        </h6>
                        <Link
                            to={{
                                pathname: `/energy/end-uses/${bldgId}`,
                            }}>
                            <div
                                rel="noopener noreferrer"
                                className="link-primary mr-4"
                                style={{
                                    display: 'inline-block',
                                    float: 'right',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}>
                                More Details
                            </div>
                        </Link>
                        <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Totals</h6>
                    </div>
                    <div className="energy-blg-container-one-content mr-2">
                        <div className="energy-chart-style">
                            <DonutChart donutChartOpts={donutChartOpts} donutChartData={donutChartData} height={180} />
                        </div>

                        <div>
                            <Table className="mb-0 building-table-font-style" borderless>
                                <tbody>
                                    {energyConsumption.map((record, index) => {
                                        return (
                                            <tr key={index} className="building-consumption-style">
                                                <td>
                                                    {record.device === 'HVAC' && (
                                                        <div
                                                            className="dot"
                                                            style={{ backgroundColor: '#3094B9' }}></div>
                                                    )}
                                                    {record.device === 'Lighting' && (
                                                        <div
                                                            className="dot"
                                                            style={{ backgroundColor: '#2C4A5E' }}></div>
                                                    )}
                                                    {record.device === 'Plug' && (
                                                        <div
                                                            className="dot"
                                                            style={{ backgroundColor: '#66D6BC' }}></div>
                                                    )}
                                                    {record.device === 'Process' && (
                                                        <div
                                                            className="dot"
                                                            style={{ backgroundColor: '#3B8554' }}></div>
                                                    )}
                                                </td>
                                                <td className="building-table-font-style">{record.device}</td>
                                                <td className="custom-usage-style muted table-font-style">
                                                    {record.energy_consumption.now.toLocaleString(undefined, {
                                                        maximumFractionDigits: 2,
                                                    })}
                                                    kWh
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>

                <div className="energy-blg-container-two mr-4">
                    {/* Equipment Alert */}
                    <h6 className="card-title custom-title mt-4" style={{ display: 'inline-block' }}>
                        Top Equipment Consumption
                    </h6>
                    <div className="equip-table-container">
                        <table className="table table-borderless">
                            <thead>
                                <tr className="equip-table-heading">
                                    <th>Equipment</th>
                                    <th>Power</th>
                                    <th>Change</th>
                                </tr>
                            </thead>
                            <tbody style={{ fontSize: '12px' }}>
                                {topEnergyConsumption.map((item, index) => (
                                    <tr key={index}>
                                        <td className="equip-table-content">
                                            <div>
                                                <div className="font-weight-bold" style={{ color: 'black' }}>
                                                    {item.equipment_name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="equip-table-content">
                                            <div>
                                                <div>
                                                    <span>
                                                        {item.energy_consumption.now.toLocaleString(undefined, {
                                                            maximumFractionDigits: 2,
                                                        })}
                                                    </span>
                                                    <span className="equip-table-unit">&nbsp;kWh</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div>
                                                <div>
                                                    {item.energy_consumption.now < item.energy_consumption.old && (
                                                        <button
                                                            className="button-success text-success equip-table-button"
                                                            style={{ width: 'auto' }}>
                                                            <i className="uil uil-chart-down">
                                                                <strong>
                                                                    {percentageHandler(
                                                                        item.energy_consumption.now,
                                                                        item.energy_consumption.old
                                                                    )}{' '}
                                                                    %
                                                                </strong>
                                                            </i>
                                                        </button>
                                                    )}
                                                    {item.energy_consumption.now > item.energy_consumption.old && (
                                                        <button
                                                            className="button-danger text-danger equip-table-button"
                                                            style={{ width: 'auto' }}>
                                                            <i className="uil uil-arrow-growth">
                                                                <strong>
                                                                    {percentageHandler(
                                                                        item.energy_consumption.now,
                                                                        item.energy_consumption.old
                                                                    )}{' '}
                                                                    %
                                                                </strong>
                                                            </i>
                                                        </button>
                                                    )}
                                                    {item.energy_consumption.now === item.energy_consumption.old && (
                                                        <button
                                                            className="button text-muted equip-table-button"
                                                            style={{ width: 'auto', border: 'none' }}>
                                                            <i className="uil uil-arrow-growth">
                                                                <strong>
                                                                    {percentageHandler(
                                                                        item.energy_consumption.now,
                                                                        item.energy_consumption.old
                                                                    )}{' '}
                                                                    %
                                                                </strong>
                                                            </i>
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="energy-blg-container-three mt-4">
                    <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                        Building Alerts
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
                    <span className="float-right" onClick={() => setBuildingAlerts([])}>
                        Clear
                    </span>
                    {/* </Link> */}

                    <div className="mt-2 alert-container">
                        {buildingAlert.map((record) => {
                            return (
                                <>
                                    {record.type === 'building-add' && (
                                        <div className="alert-card mb-2">
                                            <div>
                                                <i className="uil uil-triangle" />
                                            </div>
                                            <div>
                                                <span className="alert-heading">New Building Peak</span>
                                                <br />
                                                <span className="alert-content">225.3 kW &nbsp; 3/3/22 @ 3:20 PM</span>
                                            </div>
                                            <div className="float-right ml-4 alert-weekday">Today</div>
                                        </div>
                                    )}
                                    {record.type === 'energy-trend' && (
                                        <div className="alert-card mb-2">
                                            <div>
                                                <i className="uil uil-arrow-growth" />
                                            </div>
                                            <div>
                                                <span className="alert-heading">Energy Trend Upward</span>
                                                <br />
                                                <span className="alert-content">+25% from last 30 days</span>
                                            </div>
                                            <div className="float-right ml-4 alert-weekday">Yesterday</div>
                                        </div>
                                    )}
                                    {record.type === 'notification' && (
                                        <div className="alert-card">
                                            <div>
                                                <i className="uil uil-exclamation-triangle" />
                                            </div>
                                            <div>
                                                <span className="alert-heading">Service Due Soon (AHU 1)</span>
                                                <br />
                                                <span className="alert-content">40 Run Hours &nbsp; in 25 Days</span>
                                            </div>
                                            <div className="float-right ml-4 alert-weekday">Tuesday</div>
                                        </div>
                                    )}
                                </>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* <Row xl={12} className="mt-3">
                <Col xl={5} style={{ marginLeft: '23px' }}>
                    <Row xl={8}>
                        <div className="card-body">
                            <h6
                                className="card-title custom-title"
                                style={{ display: 'inline-block', fontWeight: 'bold' }}>
                                Energy Consumption by End Use
                            </h6>
                            <Link to="/energy/end-uses">
                                <a
                                    rel="noopener noreferrer"
                                    className="link-primary mr-4"
                                    style={{
                                        display: 'inline-block',
                                        float: 'right',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                    }}>
                                    More Details
                                </a>
                            </Link>
                            <h6 className="card-subtitle mb-2 text-muted">Energy Totals</h6>
                        </div>
                    </Row>

                    <Row xl={4}>
                        <Col xl={6}>
                            <div className="card-body">
                                <DonutChart options={donutChartOpts} series={donutChartData} height={170} />
                            </div>
                        </Col>
                        <Col xl={6}>
                            <Card>
                                <CardBody>
                                    <Table className="mb-0 building-table-font-style" borderless>
                                        <tbody>
                                            {energyConsumption.map((record, index) => {
                                                return (
                                                    <tr key={index} className="building-consumption-style">
                                                        <td>
                                                            {record.device === 'HVAC' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#3094B9' }}></div>
                                                            )}
                                                            {record.device === 'Lightning' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#2C4A5E' }}></div>
                                                            )}
                                                            {record.device === 'Plug' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#66D6BC' }}></div>
                                                            )}
                                                            {record.device === 'Process' && (
                                                                <div
                                                                    className="dot"
                                                                    style={{ backgroundColor: '#3B8554' }}></div>
                                                            )}
                                                        </td>
                                                        <td className="building-table-font-style font-weight-bold">
                                                            {record.device}
                                                        </td>
                                                        <td className="custom-usage-style muted table-font-style">
                                                            {record.energy_consumption.now.toLocaleString(undefined, {
                                                                maximumFractionDigits: 2,
                                                            })}
                                                            kWh
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Col>

                <Col xl={3}>
                    <div>
                        <Col>
                            <h6
                                className="card-title custom-title mt-4"
                                style={{ display: 'inline-block', fontWeight: 'bold' }}>
                                Top Equipment Consumption
                            </h6>
                            <div className="equip-table-container">
                                <table className="table table-borderless">
                                    <thead>
                                        <tr className="equip-table-heading">
                                            <th>Equipment</th>
                                            <th>Power</th>
                                            <th>Change</th>
                                        </tr>
                                    </thead>
                                    <tbody style={{ fontSize: '12px' }}>
                                        {topEnergyConsumption.map((item, index) => (
                                            <tr key={index}>
                                                <td className="equip-table-content">
                                                    <div>
                                                        <div className="font-weight-bold" style={{ color: 'black' }}>
                                                            {item.equipment_name}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="equip-table-content">
                                                    <div>
                                                        <div>
                                                            <span>{item.energy_consumption.now}</span>
                                                            <span className="equip-table-unit">&nbsp;kW</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div>
                                                            {item.energy_consumption.now <
                                                                item.energy_consumption.old && (
                                                                <button
                                                                    className="button-danger text-danger equip-table-button"
                                                                    style={{ width: 'auto' }}>
                                                                    <i className="uil uil-chart-down">
                                                                        <strong>
                                                                            {percentageHandler(
                                                                                item.energy_consumption.now,
                                                                                item.energy_consumption.old
                                                                            )}{' '}
                                                                            %
                                                                        </strong>
                                                                    </i>
                                                                </button>
                                                            )}
                                                            {item.energy_consumption.now >
                                                                item.energy_consumption.old && (
                                                                <button
                                                                    className="button-success text-success equip-table-button"
                                                                    style={{ width: 'auto' }}>
                                                                    <i className="uil uil-arrow-growth">
                                                                        <strong>
                                                                            {percentageHandler(
                                                                                item.energy_consumption.now,
                                                                                item.energy_consumption.old
                                                                            )}{' '}
                                                                            %
                                                                        </strong>
                                                                    </i>
                                                                </button>
                                                            )}
                                                            {item.energy_consumption.now ===
                                                                item.energy_consumption.old && (
                                                                <button
                                                                    className="button text-muted equip-table-button"
                                                                    style={{ width: 'auto', border: 'none' }}>
                                                                    <i className="uil uil-arrow-growth">
                                                                        <strong>
                                                                            {percentageHandler(
                                                                                item.energy_consumption.now,
                                                                                item.energy_consumption.old
                                                                            )}{' '}
                                                                            %
                                                                        </strong>
                                                                    </i>
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Col>
                    </div>
                </Col>

                <Col xl={3}>
                    <div>
                        <Col className="mt-4">
                            <h6
                                className="card-title custom-title"
                                style={{ display: 'inline-block', fontWeight: 'bold' }}>
                                Building Alerts
                            </h6>
                            <Link to="/energy/end-uses">
                                <a
                                    rel="noopener noreferrer"
                                    className="link-primary mr-2"
                                    style={{
                                        display: 'inline-block',
                                        float: 'right',
                                        textDecoration: 'none',
                                        fontWeight: 'bold',
                                    }}>
                                    Clear
                                </a>
                            </Link>

                            <div className="mt-2 alert-container">
                                {buildingAlert.map((record) => {
                                    return (
                                        <>
                                            {record.type === 'building-add' && (
                                                <div className="alert-card mb-2">
                                                    <div>
                                                        <i className="uil uil-triangle" />
                                                    </div>
                                                    <div>
                                                        <span className="alert-heading">New Building Peak</span>
                                                        <br />
                                                        <span className="alert-content">
                                                            225.3 kW &nbsp; 3/3/22 @ 3:20 PM
                                                        </span>
                                                    </div>
                                                    <div className="float-right ml-4 alert-weekday">Today</div>
                                                </div>
                                            )}
                                            {record.type === 'energy-trend' && (
                                                <div className="alert-card mb-2">
                                                    <div>
                                                        <i className="uil uil-arrow-growth" />
                                                    </div>
                                                    <div>
                                                        <span className="alert-heading">Energy Trend Upward</span>
                                                        <br />
                                                        <span className="alert-content">+25% from last 30 days</span>
                                                    </div>
                                                    <div className="float-right ml-4 alert-weekday">Yesterday</div>
                                                </div>
                                            )}
                                            {record.type === 'notification' && (
                                                <div className="alert-card">
                                                    <div>
                                                        <i className="uil uil-exclamation-triangle" />
                                                    </div>
                                                    <div>
                                                        <span className="alert-heading">Service Due Soon (AHU 1)</span>
                                                        <br />
                                                        <span className="alert-content">
                                                            40 Run Hours &nbsp; in 25 Days
                                                        </span>
                                                    </div>
                                                    <div className="float-right ml-4 alert-weekday">Tuesday</div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })}
                            </div>
                        </Col>
                    </div>
                </Col>
            </Row> */}

            {/* Hourly Average Consumption */}
            <Row>
                <Col lg={8}>
                    <div className="card-body">
                        <h6 className="card-title custom-title" style={{ display: 'inline-block', fontWeight: 'bold' }}>
                            Hourly Average Consumption
                        </h6>
                        <Link
                            to={{
                                pathname: `/energy/time-of-day/${bldgId}`,
                            }}>
                            <a
                                rel="noopener noreferrer"
                                className="link-primary"
                                style={{
                                    display: 'inline-block',
                                    float: 'right',
                                    textDecoration: 'none',
                                    fontWeight: 'bold',
                                }}>
                                More Details
                            </a>
                        </Link>
                        <h6 className="card-subtitle mb-2 custom-subtitle-style">Average by Hour</h6>
                        <div className="hour-avg-consumtn p-1">
                            <HeatMapChart
                                options={weekDaysOptions}
                                series={weekDaysSeries}
                                height={weekdaysChartHeight}
                            />
                            <HeatMapChart
                                options={weekDaysOptions}
                                // options={weekendsOptions}
                                // series={weekendsSeries}
                                series={weekDaysSeries}
                                height={weekendsChartHeight}
                            />
                        </div>
                    </div>
                </Col>
            </Row>
            {/* Top 3 Peak Demand Periods  */}
            <Row>
                <Col lg={8}>
                    <div className="card-body">
                        <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                            Top 3 Peak Demand Periods
                        </h6>
                        <Link
                            to={{
                                pathname: `/energy/peak-demand/${bldgId}`,
                            }}>
                            <a
                                rel="noopener noreferrer"
                                className="link-primary font-weight-bold"
                                style={{
                                    display: 'inline-block',
                                    float: 'right',
                                    textDecoration: 'none',
                                }}>
                                More Details
                            </a>
                        </Link>
                        <h6 className="card-subtitle mb-2 custom-subtitle-style">Max power draw (15 minutes period)</h6>
                        <div className="card-group mt-2 top-peak-demand-style">
                            {topContributors.map((item, index) => (
                                <div className="card peak-demand-container mt-3">
                                    <div className="card-body">
                                        <h6
                                            className="card-title text-muted peak-demand-card-style"
                                            style={{ margin: '2px', marginLeft: '5px', fontSize: 14 }}>
                                            {moment(item.timeRange.frm.slice(0, 10)).format('MMMM Do')} @{' '}
                                            {new Date(item.timeRange.frm).toLocaleTimeString('en', {
                                                timeStyle: 'short',
                                                hour12: true,
                                                timeZone: 'UTC',
                                            })}
                                        </h6>
                                        <h5 className="card-title ml-1">
                                            <span style={{ color: 'black' }}>
                                                {item.overall_energy_consumption.toLocaleString(undefined, {
                                                    maximumFractionDigits: 2,
                                                })}
                                            </span>{' '}
                                            kW
                                        </h5>
                                        <p className="card-text peak-card-label">Top Contributors</p>
                                        <table className="table table-borderless small peak-table-font">
                                            <tbody>
                                                <tr>
                                                    <td className="peak-table-content">
                                                        {item.top_contributors.map((el) => (
                                                            <tr>
                                                                <div className="font-weight-bold text-dark">
                                                                    {el.equipment_name}
                                                                </div>
                                                            </tr>
                                                        ))}
                                                    </td>
                                                    <td className="peak-table-content-two">
                                                        {item.top_contributors.map((el2) => (
                                                            <tr style={{ fontSize: 12 }}>
                                                                <div className="">
                                                                    {el2.energy_consumption.now.toLocaleString(
                                                                        undefined,
                                                                        {
                                                                            maximumFractionDigits: 2,
                                                                        }
                                                                    )}{' '}
                                                                    kW
                                                                </div>
                                                            </tr>
                                                        ))}
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
            </Row>
            {/* Total Energy Consumption  */}
            <Row>
                <Col xl={8}>
                    <div className="card-body">
                        <h6 className="card-title custom-title">Total Energy Consumption</h6>
                        <h6 className="card-subtitle mb-2 custom-subtitle-style">Totaled by Hour</h6>
                        <div className="total-eng-consumtn">
                            <LineChart options={lineChartOptions} series={buildingConsumptionChart} />
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default BuildingOverview;
