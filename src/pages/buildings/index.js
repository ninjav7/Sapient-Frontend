import React, { useState, useEffect, useRef } from 'react';
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import EnergyConsumptionTotals from './EnergyConsumptionTotals';
import { faMountain } from '@fortawesome/pro-solid-svg-icons';
import { faArrowTrendUp } from '@fortawesome/pro-solid-svg-icons';
import { faTriangleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { ComponentStore } from '../../store/ComponentStore';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import LineColumnChart from '../charts/LineColumnChart';
import { formatConsumptionValue } from '../../helpers/helpers';
import { Spinner } from 'reactstrap';
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
import { percentageHandler } from '../../utils/helper';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { Link, useParams } from 'react-router-dom';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { Cookies } from 'react-cookie';
import './style.css';

export function useHover() {
    const [value, setValue] = useState(false);

    const ref = useRef(null);

    const handleMouseOver = () => setValue(true);
    const handleMouseOut = () => setValue(false);

    useEffect(
        () => {
            const node = ref.current;
            if (node) {
                node.addEventListener('mouseover', handleMouseOver);
                node.addEventListener('mouseout', handleMouseOut);

                return () => {
                    node.removeEventListener('mouseover', handleMouseOver);
                    node.removeEventListener('mouseout', handleMouseOut);
                };
            }
        },
        [ref.current] // Recall only if ref changes
    );
    return [ref, value];
}

const BuildingOverview = () => {
    // const { bldgId } = useParams();
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    let cookies = new Cookies();
    let userdata = cookies.get('user');
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

    const [buildingConsumptionChartData, setBuildingConsumptionChartData] = useState([]);
    const [isEnergyConsumptionDataLoading, setIsEnergyConsumptionDataLoading] = useState(false);
    const [isAvgConsumptionDataLoading, setIsAvgConsumptionDataLoading] = useState(false);

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
            events: {
                mounted: function (chartContext, config) {
                    chartContext.toggleDataPointSelection(0, 1);
                },
            },
        },
        labels: ['HVAC', 'Lightning', 'Plug', 'Process', 'Other'],
        colors: ['#3094B9', '#2C4A5E', '#66D6BC', '#3B8554', '#3B8554'],
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
                    // legend: {
                    //     show: true,
                    //     showForSingleSeries:true,
                    //     onItemHover: {
                    //         highlightDataSeries: true
                    //     },
                    //     onItemClick: {
                    //         toggleDataSeries: true
                    //     },
                    // },
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

    const [buildingConsumptionChartOpts, setBuildingConsumptionChartOpts] = useState({
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true,
            },
            animations: {
                enabled: false,
            },
        },
        stroke: {
            width: 0.2,
            show: true,
            curve: 'straight',
        },
        dataLabels: {
            enabled: true,
            enabledOnSeries: [1],
        },
        animations: {
            enabled: false,
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
                const { seriesX } = w.globals;
                const timestamp = new Date(seriesX[seriesIndex][dataPointIndex]);

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="line-chart-widget-tooltip-value">${formatConsumptionValue(
                            series[seriesIndex][dataPointIndex],
                            4
                        )} kWh</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment(timestamp).format(
                            `MMM D 'YY @ hh:mm A`
                        )}</div>
                    </div>`;
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    let dateText = moment(timestamp).format('MMM D');
                    let weekText = moment(timestamp).format('ddd');
                    return `${weekText} - ${dateText}`;
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
                    width: 2,
                    dashArray: 0,
                },
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    let print = parseInt(val);
                    return `${print}`;
                },
            },
            style: {
                colors: ['#1D2939'],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
    });

    const [energyConsumption, setEnergyConsumption] = useState([]);

    const [topEnergyConsumption, setTopEnergyConsumption] = useState([]);

    const [topContributors, setTopContributors] = useState([]);

    const [weekDaysOptions, setWeekDaysOptions] = useState({
        chart: {
            type: 'heatmap',
            toolbar: {
                show: true,
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
        colors: ['#87AADE', '#F87171'],
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                enableShades: true,
                distributed: true,
                radius: 1,
                useFillColorAsStroke: false,
            },
        },
        xaxis: {
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
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
    });

    const [weekDaysSeries, setWeekDaysSeries] = useState([
        {
            name: 'Weekdays',
            data: [],
        },
    ]);

    const [weekEndsSeries, setWeekEndsSeries] = useState([
        {
            name: 'Weekends',
            data: [],
        },
    ]);

    const weekdaysChartHeight = 125;
    const weekendsChartHeight = 125;

    const [weekEndsOptions, setWeekEndsOptions] = useState({
        chart: {
            type: 'heatmap',
            toolbar: {
                show: true,
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
        colors: ['#87AADE', '#F87171'],
        plotOptions: {
            heatmap: {
                shadeIntensity: 0.5,
                enableShades: true,
                distributed: true,
                radius: 1,
                useFillColorAsStroke: false,
            },
        },
        yaxis: {
            labels: {
                show: false,
            },
        },
        xaxis: {
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
        },
    });

    const handleChange = (e, value) => {
        // console.log('Selected Item ', value);
        if (value === 'HVAC') {
            setDonutChartOpts({
                chart: {
                    type: 'donut',
                    events: {
                        mounted: function (chartContext, config) {
                            chartContext.toggleDataPointSelection(0);
                        },
                    },
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
                            // legend: {
                            //     show: true,
                            //     showForSingleSeries:true,
                            //     onItemHover: {
                            //         highlightDataSeries: true
                            //     },
                            //     onItemClick: {
                            //         toggleDataSeries: true
                            //     },
                            // },
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
        } else if (value === 'Lighting') {
            setDonutChartOpts({
                chart: {
                    type: 'donut',
                    events: {
                        mounted: function (chartContext, config) {
                            chartContext.toggleDataPointSelection(1);
                        },
                    },
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
                            // legend: {
                            //     show: true,
                            //     showForSingleSeries:true,
                            //     onItemHover: {
                            //         highlightDataSeries: true
                            //     },
                            //     onItemClick: {
                            //         toggleDataSeries: true
                            //     },
                            // },
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
        } else if (value === 'Process') {
            setDonutChartOpts({
                chart: {
                    type: 'donut',
                    events: {
                        mounted: function (chartContext, config) {
                            chartContext.toggleDataPointSelection(2);
                        },
                    },
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
                            // legend: {
                            //     show: true,
                            //     showForSingleSeries:true,
                            //     onItemHover: {
                            //         highlightDataSeries: true
                            //     },
                            //     onItemClick: {
                            //         toggleDataSeries: true
                            //     },
                            // },
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
        } else if (value === 'Plug') {
            setDonutChartOpts({
                chart: {
                    type: 'donut',
                    events: {
                        mounted: function (chartContext, config) {
                            chartContext.toggleDataPointSelection(3);
                        },
                    },
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
                            // legend: {
                            //     show: true,
                            //     showForSingleSeries:true,
                            //     onItemHover: {
                            //         highlightDataSeries: true
                            //     },
                            //     onItemClick: {
                            //         toggleDataSeries: true
                            //     },
                            // },
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
        }
    };
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    const [daysCount, setDaysCount] = useState(1);

    const [hoverRef, isHovered] = useHover();
    const [isEquipmentProcessing, setIsEquipmentProcessing] = useState(false);
    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }
        const buildingOverallData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${portfolioOverall}${params}`,
                        {
                            date_from: startDate,
                            date_to: endDate,
                        },
                        { headers }
                    )
                    .then((res) => {
                        setOverview(res.data);
                        console.log(
                            'setOverview => ',
                            percentageHandler(res.data.average_energy_density.now, res.data.average_energy_density.old)
                        );
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
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${portfolioEndUser}${params}`,
                        {
                            date_from: startDate,
                            date_to: endDate,
                        },
                        { headers }
                    )
                    .then((res) => {
                        setEnergyConsumption(res.data);
                        const energyData = res.data;
                        let newDonutData = [];
                        energyData.forEach((record) => {
                            let fixedConsumption = record.energy_consumption.now / 1000;
                            newDonutData.push(fixedConsumption);
                        });
                        console.log(newDonutData);
                        setDonutChartData(newDonutData);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building EndUses Data');
            }
        };

        // const buildingAlertsData = async () => {
        //     try {
        //         let headers = {
        //             'Content-Type': 'application/json',
        //             accept: 'application/json',
        //             Authorization: `Bearer ${userdata.token}`,
        //         };
        //         let params = `?building_id=${1}`;
        //         await axios
        //             .post(
        //                 `${BaseUrl}${builidingAlerts}${params}`,
        //                 {
        //                     date_from: dateFormatHandler(startDate),
        //                     date_to: dateFormatHandler(endDate),
        //                 },
        //                 { headers }
        //             )
        //             .then((res) => {
        //                 setBuildingAlerts(res.data);
        //                 // console.log('Building Alert => ', res.data);
        //             });
        //     } catch (error) {
        //         console.log(error);
        //         console.log('Failed to fetch Building Alert Data');
        //     }
        // };

        // const buildingPeaksData = async () => {
        //     try {
        //         let headers = {
        //             'Content-Type': 'application/json',
        //             accept: 'application/json',
        //             Authorization: `Bearer ${userdata.token}`,
        //         };
        //         let params = `?building_id=${bldgId}&limit=${2}`;
        //         await axios
        //             .post(
        //                 `${BaseUrl}${builidingPeak}${params}`,
        //                 {
        //                     date_from: dateFormatHandler(startDate),
        //                     date_to: dateFormatHandler(endDate),
        //                 },
        //                 { headers }
        //             )
        //             .then((res) => {
        //                 setTopContributors(res.data);
        //                 // console.log('setTopContributors => ', res.data);
        //                 // console.log(res.data);
        //             });
        //     } catch (error) {
        //         console.log(error);
        //         console.log('Failed to fetch Building Peak Data');
        //     }
        // };

        const builidingEquipmentsData = async () => {
            try {
                setIsEquipmentProcessing(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${builidingEquipments}${params}`,
                        {
                            date_from: startDate,
                            date_to: endDate,
                        },
                        { headers }
                    )
                    .then((res) => {
                        console.log('result top ', res);
                        let data = res.data[0].top_contributors;
                        // console.log('HeatMap Data => ', data);
                        // const dataset=[
                        //     {equipment_id: '629674e71209c9a7b261620c', equipment_name: 'AHU_NYPL', energy_consumption: {now: 1216, old: 0}},
                        //     {equipment_id: '629674e71209c9a7b261620c', equipment_name: 'AHU_NYPL', energy_consumption: {now: 1561676, old: 0}},
                        //     {equipment_id: '629674e71209c9a7b261620c', equipment_name: 'AHU_NYPL', energy_consumption: {now: 34561656, old: 0}},
                        //     {equipment_id: '629674e71209c9a7b261620c', equipment_name: 'AHU_NYPL', energy_consumption: {now: 566167654, old: 0}},
                        // ]
                        let sortedData = data.sort((a, b) => {
                            return parseFloat(b.energy_consumption.now) - parseFloat(a.energy_consumption.now);
                        });
                        setTopEnergyConsumption(sortedData);
                        setIsEquipmentProcessing(false);
                    });
            } catch (error) {
                console.log(error);
                setIsEquipmentProcessing(false);
                console.log('Failed to fetch Building Equipments Data');
            }
        };

        const builidingHourlyData = async () => {
            try {
                setIsAvgConsumptionDataLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}&tz_info=${timeZone}`;
                await axios
                    .post(
                        `${BaseUrl}${builidingHourly}${params}`,
                        {
                            date_from: startDate,
                            date_to: endDate,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res?.data;

                        let weekDaysResData = response[0]?.weekdays;
                        let weekEndResData = response[0]?.weekend;

                        const weekDaysData = weekDaysResData.map((el) => {
                            return {
                                x: parseInt(moment(el.x).format('HH')),
                                y: parseInt(el.y / 1000),
                            };
                        });

                        const weekendsData = weekEndResData.map((el) => {
                            return {
                                x: parseInt(moment(el.x).format('HH')),
                                y: parseInt(el.y / 1000),
                            };
                        });

                        const newWeekdaysData = [
                            {
                                name: 'Weekdays',
                                data: [],
                            },
                        ];

                        const newWeekendsData = [
                            {
                                name: 'Weekends',
                                data: [],
                            },
                        ];

                        for (let i = 0; i < 24; i++) {
                            let matchedRecord = weekDaysData.find((record) => record.x === i);

                            if (matchedRecord) {
                                newWeekdaysData[0].data.push(matchedRecord);
                            } else {
                                newWeekdaysData[0].data.push({
                                    x: i,
                                    y: 0,
                                });
                            }
                        }

                        for (let i = 0; i < 24; i++) {
                            let matchedRecord = weekendsData.find((record) => record.x - 1 === i);
                            if (matchedRecord) {
                                matchedRecord.x = i;
                                newWeekendsData[0].data.push(matchedRecord);
                            } else {
                                newWeekendsData[0].data.push({
                                    x: i,
                                    y: 0,
                                });
                            }
                        }
                        setWeekDaysSeries(newWeekdaysData);
                        setWeekEndsSeries(newWeekendsData);
                        setIsAvgConsumptionDataLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building Hourly Data');
                setIsAvgConsumptionDataLoading(false);
            }
        };

        const buildingConsumptionChart = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                setIsEnergyConsumptionDataLoading(true);
                let params = `?building_id=${bldgId}&tz_info=${timeZone}`;
                await axios
                    .post(
                        `${BaseUrl}${getEnergyConsumption}${params}`,
                        {
                            date_from: startDate,
                            date_to: endDate,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res?.data;
                        let newArray = [
                            {
                                name: 'Energy',
                                data: [],
                            },
                        ];
                        response.forEach((record) => {
                            newArray[0].data.push({
                                x: record?.x,
                                y: parseInt(record?.y / 1000),
                            });
                        });
                        console.log('Sudhanshu :>> ', newArray);
                        setBuildingConsumptionChartData(newArray);
                        setIsEnergyConsumptionDataLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Building Consumption Chart');
                setIsEnergyConsumptionDataLoading(false);
            }
        };

        const calculateDays = () => {
            let time_difference = endDate.getTime() - startDate.getTime();
            let days_difference = time_difference / (1000 * 60 * 60 * 24);
            days_difference = days_difference + 1;
            setDaysCount(days_difference);
        };

        calculateDays();
        buildingOverallData();
        buildingEndUserData();
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
            ComponentStore.update((s) => {
                s.parent = 'buildings';
            });
        };
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <div className="ml-2">
                <Header title="Building Overview" />
            </div>
            <Row xl={12} className="mt-2">
                <div className="energy-summary-alignment">
                    <div className="card-box-style button-style">
                        <div className="card-body text-center">
                            <DetailedButton
                                title="Total Consumption"
                                description={parseInt(overview?.total_consumption.now / 1000)}
                                unit="kWh"
                                value={percentageHandler(
                                    overview.total_consumption.now,
                                    overview.total_consumption.old
                                )}
                                consumptionNormal={overview.total_consumption.now >= overview.total_consumption.old}
                                infoText={`Total energy consumption accross all your buildings for the past ${daysCount} days.`}
                                infoType={`total-bld-cnsmp`}
                            />
                        </div>
                    </div>

                    {/* {/* {/* <div className="card-box-style button-style">
                        <div className="card-body">
                            <h5 className="card-title subtitle-style">
                                Portfolio Rank&nbsp;&nbsp;
                                <div>
                                    <FontAwesomeIcon icon={faCircleInfo} size="md" color="#D0D5DD" id="title" />
                                    <UncontrolledTooltip placement="bottom" target="#title">
                                        Portfolio Rank
                                    </UncontrolledTooltip>
                                </div>
                            </h5>
                            <p className="card-text card-content-style">
                                1<span className="card-unit-style">&nbsp;&nbsp;of&nbsp;{buildingsEnergyConsume.length}</span>
                            </p>
                        </div>
                    </div> */}

                    <div className="card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="Energy Density"
                                description={(overview.average_energy_density.now / 1000).toFixed(2)}
                                unit="kWh/sq.ft."
                                value={percentageHandler(
                                    overview.average_energy_density.now,
                                    overview.average_energy_density.old
                                )}
                                consumptionNormal={
                                    overview.average_energy_density.now >= overview.average_energy_density.old
                                }
                                infoText={`Average energy density (kWh / sq.ft.) accross all your buildings for the past ${daysCount} days.`}
                                infoType={`avg-bld-dnty`}
                            />
                        </div>
                    </div>
                    {/* {/* {/* <div className="card-box-style button-style">
                        <div className="card-body">
                            <DetailedButton
                                title="12 Mo. Electric EUI"
                                description={overview.yearly_electric_eui.now / 1000}
                                unit="kBtu/ft/yr"
                                value={percentageHandler(
                                    overview.yearly_electric_eui.now,
                                    overview.yearly_electric_eui.old
                                )}
                                consumptionNormal={overview.yearly_electric_eui.now >= overview.yearly_electric_eui.old}
                                infoText={`The Electric Energy Use Intensity across all of your buildings in the last calendar year.`}
                                infoType={`total-bld-eui`}
                            />
                        </div>
                    </div> */}
                    <div className="card-box-style button-style">
                        <div className="card-body">
                            <h5 className="card-title subtitle-style" style={{ marginTop: '3px' }}>
                                Monitored Load&nbsp;&nbsp;
                                <div>
                                    <FontAwesomeIcon
                                        icon={faCircleInfo}
                                        size="md"
                                        color="#D0D5DD"
                                        id="tooltip-monitored-load"
                                    />
                                    <UncontrolledTooltip placement="bottom" target="tooltip-monitored-load">
                                        Add Monitored Load Data
                                    </UncontrolledTooltip>
                                </div>
                            </h5>
                            {/* {/* <Link
                                to={{
                                    pathname: `/settings/utility-bills`,
                                }}>
                                <button id="inner-button">Add Utility Bill</button>
                            </Link> */}
                        </div>
                    </div>
                </div>
            </Row>

            {/* <Row> */}
            <div className="bldg-page-grid-style">
                <div style={{ marginTop: '2rem', marginLeft: '23px' }}>
                    {/* Energy Consumption by End Use  */}
                    {/* <div> */}
                    {/* <div> */}
                    {/* <div style={{ display: 'inline-block' }}>
                                <h6 className="card-title custom-title">Energy Consumption by End Use</h6>
                                <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Totals</h6>
                            </div> */}
                    {/* {/* <div style={{ display: 'inline-block', float: 'right' }} className="mr-2">
                                <Link
                                    to={{
                                        pathname: `/energy/end-uses/${bldgId}`,
                                    }}>
                                    <div
                                        rel="noopener noreferrer"
                                        className="link-primary mr-3"
                                        style={{
                                            textDecoration: 'none',
                                            fontWeight: 'bold',
                                        }}>
                                        More Details
                                    </div>
                                </Link>
                            </div> */}
                    {/* </div>
                        <div className="custom-bld-enduse-style">
                            <div> */}
                    <EnergyConsumptionTotals
                        series={donutChartData}
                        options={donutChartOpts}
                        energyConsumption={energyConsumption}
                    />
                    {/* <DonutChart
                                    donutChartOpts={donutChartOpts}
                                    donutChartData={donutChartData}
                                    height={185}
                                    id={Date.now()}
                                /> */}
                    {/* </div> */}
                    {/* <div className="mt-3">
                                {energyConsumption.map((record, index) => {
                                    return (
                                        <div>
                                            <Link
                                                to={{
                                                    pathname: `/energy/${record.device.toLowerCase()}/${bldgId}`,
                                                }}>
                                                <div
                                                    className="custom-bldg-table-style building-consumption-style m-2 p-1"
                                                    onMouseOver={(e) => handleChange(e, record.device)}>
                                                    <div className="ml-2">
                                                        {record.device === 'HVAC' && (
                                                            <div
                                                                className="dot"
                                                                style={{
                                                                    background: '#3094B9',
                                                                }}></div>
                                                        )}
                                                        {record.device === 'Lighting' && (
                                                            <div
                                                                className="dot"
                                                                style={{
                                                                    background: '#2C4A5E',
                                                                }}></div>
                                                        )}
                                                        {record.device === 'Plug' && (
                                                            <div
                                                                className="dot"
                                                                style={{
                                                                    background: '#66D6BC',
                                                                }}></div>
                                                        )}
                                                        {record.device === 'Process' && (
                                                            <div
                                                                className="dot"
                                                                style={{
                                                                    background: '#3B8554',
                                                                }}></div>
                                                        )}
                                                        {record.device === 'Other' && (
                                                            <div
                                                                className="dot"
                                                                style={{
                                                                    background: '#3B8554',
                                                                }}></div>
                                                        )}
                                                    </div>
                                                    <div className="custom-bld-equip-style record-bld-style font-weight-bold">
                                                        {record.device}
                                                    </div>
                                                    <div className="custom-bld-usage-style muted table-font-style">
                                                        {(record.energy_consumption.now / 1000).toLocaleString(
                                                            undefined,
                                                            {
                                                                maximumFractionDigits: 5,
                                                            }
                                                        )}
                                                        kWh
                                                    </div>
                                                    <div className="mr-2">
                                                        {record.energy_consumption.now <=
                                                            record.energy_consumption.old && (
                                                            <button className="button-success text-success custom-bld-style">
                                                                <i className="uil uil-chart-down">
                                                                    <strong>
                                                                        {percentageHandler(
                                                                            record.energy_consumption.now,
                                                                            record.energy_consumption.old
                                                                        )}{' '}
                                                                        %
                                                                    </strong>
                                                                </i>
                                                            </button>
                                                        )}
                                                        {record.energy_consumption.now >
                                                            record.energy_consumption.old && (
                                                            <button className="button-danger text-danger custom-bld-style">
                                                                <i className="uil uil-arrow-growth">
                                                                    <strong>
                                                                        {percentageHandler(
                                                                            record.energy_consumption.now,
                                                                            record.energy_consumption.old
                                                                        )}{' '}
                                                                        %
                                                                    </strong>
                                                                </i>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
                                    );
                                })}
                            </div> */}
                    {/* </div> */}
                    {/* </div> */}

                    {/* Top 3 Peak Demand Periods  */}
                    {/* {/* {/* <Row>
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
                                    className="link-primary font-weight-bold mr-3"
                                    style={{
                                        display: 'inline-block',
                                        float: 'right',
                                        textDecoration: 'none',
                                    }}>
                                    More Details
                                </a>
                            </Link>
                            <h6 className="card-subtitle mb-2 custom-subtitle-style">
                                Max power draw (15 minutes period)
                            </h6>
                            <div className="card-group mt-2 top-peak-demand-style">
                                {topContributors.slice(0, 3).map((item, index) => (
                                    <div className="card peak-demand-container mt-3" ref={hoverRef}>
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
                                                    {(item.overall_energy_consumption / 1000).toLocaleString(
                                                        undefined,
                                                        {
                                                            maximumFractionDigits: 2,
                                                        }
                                                    )}
                                                </span>
                                                kW
                                            </h5>
                                            <div style={{ height: '75%' }}>
                                                {isHovered ? (
                                                    <div
                                                        style={{ display: 'flex', justifyContent: 'center' }}
                                                        className="m-4">
                                                        <Link
                                                            to={{
                                                                pathname: `/explore/by-building`,
                                                            }}>
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-light font-weight-bold custom-hover-btn-style">
                                                                <i className="uil uil-pen mr-1"></i>Explore
                                                            </button>
                                                        </Link>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <p className="card-text peak-card-label">Top Contributors</p>
                                                        <table className="table table-borderless small peak-table-font">
                                                            <tbody>
                                                                <tr>
                                                                    <td className="peak-table-content">
                                                                        {item.top_contributors.slice(0, 3).map((el) => (
                                                                            <tr>
                                                                                <div className="font-weight-bold text-dark">
                                                                                    {el.equipment_name}
                                                                                </div>
                                                                            </tr>
                                                                        ))}
                                                                    </td>
                                                                    <td className="peak-table-content-two">
                                                                        {item.top_contributors.map((el2) => (
                                                                            <tr
                                                                                style={{
                                                                                    fontSize: 12,
                                                                                }}>
                                                                                <div style={{ marginTop: '0.3vh' }}>
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
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </Row> */}

                    {/* Hourly Average Consumption */}
                    <Row>
                        <div className="card-body">
                            <div className="total-eng-consumtn">
                                <h6
                                    className="card-title custom-title"
                                    style={{ display: 'inline-block', fontWeight: 'bold' }}>
                                    Hourly Average Consumption
                                </h6>
                                <h6 className="card-subtitle mb-2 custom-subtitle-style">Average by Hour (kWh)</h6>
                                {isAvgConsumptionDataLoading ? (
                                    <div className="loader-center-style" style={{ height: '400px' }}>
                                        <Spinner className="m-2" color={'primary'} />
                                    </div>
                                ) : (
                                    <div>
                                        <HeatMapChart
                                            options={weekDaysOptions}
                                            series={weekDaysSeries}
                                            height={weekdaysChartHeight}
                                        />
                                        <span className="m-2"></span>
                                        <HeatMapChart
                                            options={weekEndsOptions}
                                            series={weekEndsSeries}
                                            height={weekendsChartHeight}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </Row>

                    {/* Total Energy Consumption  */}
                    <Row>
                        <div className="card-body">
                            <div className="total-eng-consumtn">
                                <h6 className="card-title custom-title">Total Energy Consumption</h6>
                                <h6 className="card-subtitle mb-2 custom-subtitle-style">
                                    Hourly Energy Consumption (kWh)
                                </h6>
                                {isEnergyConsumptionDataLoading ? (
                                    <div className="loader-center-style" style={{ height: '400px' }}>
                                        <Spinner className="m-2" color={'primary'} />
                                    </div>
                                ) : (
                                    <LineColumnChart
                                        series={buildingConsumptionChartData}
                                        options={buildingConsumptionChartOpts}
                                    />
                                )}
                            </div>
                        </div>
                    </Row>
                </div>

                {/* <Col md={4} style={{ marginTop: '2rem', marginLeft: '23px' }}> */}
                <div style={{ marginTop: '2rem', marginLeft: '23px' }}>
                    {/* {/* {/* <Row>
                        <div>
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
                                                        <FontAwesomeIcon
                                                            icon={faMountain}
                                                            size="lg"
                                                            className="ml-2"
                                                            color="#B42318
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="alert-heading">
                                                            <b>New Building Peak</b>
                                                        </span>
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
                                                        <FontAwesomeIcon
                                                            icon={faArrowTrendUp}
                                                            size="lg"
                                                            className="ml-2"
                                                            color="#DC6803"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="alert-heading">
                                                            <b>Energy Trend Upward</b>
                                                        </span>
                                                        <br />
                                                        <span className="alert-content">+25% from last 30 days</span>
                                                    </div>
                                                    <div className="float-right ml-4 alert-weekday">Yesterday</div>
                                                </div>
                                            )}
                                            {record.type === 'notification' && (
                                                <div className="alert-card">
                                                    <div>
                                                        <FontAwesomeIcon
                                                            icon={faTriangleExclamation}
                                                            size="lg"
                                                            className="ml-2"
                                                            color="#DC6803"
                                                        />
                                                    </div>
                                                    <div>
                                                        <span className="alert-heading">
                                                            <b>Service Due Soon (AHU 1)</b>
                                                        </span>
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
                        </div>
                    </Row> */}
                    <Row>
                        <div className="equip-table-container mt-1">
                            <h6 className="top-equip-title">Top Equipment Consumption</h6>
                            <table className="table table-borderless">
                                <thead>
                                    <tr className="equip-table-heading">
                                        <th>Equipment</th>
                                        <th>Energy</th>
                                        <th>Change</th>
                                    </tr>
                                </thead>
                                {isEquipmentProcessing ? (
                                    <tbody>
                                        <SkeletonTheme color="#202020" height={35}>
                                            <tr>
                                                <td>
                                                    <Skeleton count={5} />
                                                </td>

                                                <td>
                                                    <Skeleton count={5} />
                                                </td>

                                                <td>
                                                    <Skeleton count={5} />
                                                </td>
                                            </tr>
                                        </SkeletonTheme>
                                    </tbody>
                                ) : (
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
                                                                {(item.energy_consumption.now / 1000).toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        maximumFractionDigits: 2,
                                                                    }
                                                                )}
                                                            </span>
                                                            <span className="equip-table-unit">&nbsp;kWh</span>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>
                                                    <div>
                                                        <div>
                                                            {item.energy_consumption.now <
                                                                item.energy_consumption.old && (
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
                                                            {item.energy_consumption.now >
                                                                item.energy_consumption.old && (
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
                                )}
                            </table>
                        </div>
                    </Row>
                </div>
                {/* </Col> */}
            </div>
            {/* </Row> */}
        </React.Fragment>
    );
};

export default BuildingOverview;
