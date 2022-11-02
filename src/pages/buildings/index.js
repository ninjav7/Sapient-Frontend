import React, { useState, useEffect, useRef } from 'react';
import { Row, Col, Card, CardBody, Table, UncontrolledTooltip } from 'reactstrap';
import DonutChart from '../charts/DonutChart';
import Header from '../../components/Header';
import LineChart from '../charts/LineChart';
import DetailedButton from './DetailedButton';
import HeatMapChart from '../charts/HeatMapChart';
import upGraph from '../../assets/icon/buildings/up-graph.svg';
import serviceAlert from '../../assets/icon/buildings/service-alert.svg';
import buildingPeak from '../../assets/icon/buildings/building-peak.svg';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { faMountain } from '@fortawesome/pro-solid-svg-icons';
import { faArrowTrendUp } from '@fortawesome/pro-solid-svg-icons';
import { faTriangleExclamation } from '@fortawesome/pro-solid-svg-icons';
import { ComponentStore } from '../../store/ComponentStore';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import LineColumnChart from '../charts/LineColumnChart';
import { formatConsumptionValue, xaxisFilters } from '../../helpers/helpers';
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
import { fetchOverallBldgData } from './services';
import moment from 'moment';
import 'moment-timezone';
import { percentageHandler } from '../../utils/helper';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { useHistory } from 'react-router-dom';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { Cookies } from 'react-cookie';
import Button from '../../sharedComponents/button/Button';
import { ReactComponent as ArrowRight } from '../../sharedComponents/assets/icons/arrow-right.svg';
import './style.css';
import BuildingKPIs from './BuildingKPIs';
import TotalEnergyConsumption from '../../sharedComponents/totalEnergyConsumption';
import EnergyConsumptionByEndUse from '../../sharedComponents/energyConsumptionByEndUse';

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

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const startEndDayCount = DateRangeStore.useState((s) => +s.daysCount);

    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const history = useHistory();

    const [overallBldgData, setOverallBldgData] = useState({
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

    const ICON_SIZES = {
        [Button.Sizes.lg]: 11,
    };

    const [buildingConsumptionChartData, setBuildingConsumptionChartData] = useState([]);
    const [isEnergyConsumptionDataLoading, setIsEnergyConsumptionDataLoading] = useState(false);
    const [isAvgConsumptionDataLoading, setIsAvgConsumptionDataLoading] = useState(false);

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

    const [buildingConsumptionChartOpts, setBuildingConsumptionChartOpts] = useState({
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: false,
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
            marker: {
                show: false,
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const { seriesX } = w.globals;
                const timestamp = seriesX[seriesIndex][dataPointIndex];

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="line-chart-widget-tooltip-value">${formatConsumptionValue(
                            series[seriesIndex][dataPointIndex],
                            4
                        )} kWh</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment(timestamp)
                            .tz(timeZone)
                            .format(`MMM D 'YY @ hh:mm A`)}</div>
                    </div>`;
            },
        },
        xaxis: {
            labels: {
                formatter: function (val) {
                    return moment(val).tz(timeZone).format('MM/DD HH:00');
                },
                hideOverlappingLabels: Boolean,
                rotate: 0,
                trim: false,
            },
            tickAmount: 12,
            axisTicks: {
                show: true,
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
    });

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

        // const overAllBuildingData = async () => {
        //     let payload = {
        //         date_from: startDate.toLocaleDateString(),
        //         date_to: endDate.toLocaleDateString(),
        //         tz_info: timeZone,
        //     };
        //     await fetchOverallBldgData(bldgId, payload)
        //         .then((res) => {
        //             setOverview(res.data);
        //         })
        //         .catch((error) => {});
        // };

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
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        setOverallBldgData(res.data);
                    });
            } catch (error) {}
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
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        setEnergyConsumption(res.data);
                        const energyData = res.data;
                        let newDonutData = [];
                        energyData.forEach((record) => {
                            let fixedConsumption = parseInt(record.energy_consumption.now);
                            newDonutData.push(fixedConsumption);
                        });
                        setDonutChartData(newDonutData);
                    });
            } catch (error) {}
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
        //             });
        //     } catch (error) {
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
        //             });
        //     } catch (error) {
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
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let data = res.data[0].top_contributors;
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
                setIsEquipmentProcessing(false);
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
                                y: parseInt(el.y / 1000),
                            };
                        });

                        const weekendsData = weekEndResData.map((el) => {
                            return {
                                x: parseInt(moment.utc(el.x).format('HH')),
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
                            let matchedRecord = weekendsData.find((record) => record.x === i);
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
                        for (let i = 0; i < 24; i++) {
                            if (i === 0) {
                                newWeekdaysData[0].data[i].x = '12AM';
                                newWeekendsData[0].data[i].x = '12AM';
                            } else if (i === 12) {
                                newWeekdaysData[0].data[i].x = '12PM';
                                newWeekendsData[0].data[i].x = '12PM';
                            } else if (i > 12) {
                                let a = i % 12;
                                newWeekdaysData[0].data[i].x = a + 'PM';
                                newWeekendsData[0].data[i].x = a + 'PM';
                            } else {
                                newWeekdaysData[0].data[i].x = i + 'AM';
                                newWeekendsData[0].data[i].x = i + 'AM';
                            }
                        }
                        setWeekDaysSeries(newWeekdaysData);
                        setWeekEndsSeries(newWeekendsData);
                        setIsAvgConsumptionDataLoading(false);
                    });
            } catch (error) {
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
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${getEnergyConsumption}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
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
                        setBuildingConsumptionChartData(newArray);
                        setIsEnergyConsumptionDataLoading(false);
                    });
            } catch (error) {
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

    useEffect(() => {
        let xaxisObj = xaxisFilters(startEndDayCount, timeZone);
        setBuildingConsumptionChartOpts({ ...buildingConsumptionChartOpts, xaxis: xaxisObj });
    }, [startEndDayCount]);

    return (
        <React.Fragment>
            <Header title="Building Overview" type="page" />

            <Row lg={12} className="ml-2">
                <BuildingKPIs daysCount={startEndDayCount} overalldata={overallBldgData} />
            </Row>

            <div className="bldg-page-grid-style">
                <div>
                    <EnergyConsumptionByEndUse
                        title="Energy Consumption by End Use"
                        subtitle="Totals in kWh"
                        series={donutChartData}
                        options={donutChartOpts}
                        energyConsumption={energyConsumption}
                        bldgId={bldgId}
                        pageType="building"
                    />

                    <Row>
                        <div className="card-body" style={{ padding: '0.5rem' }}>
                            <div className="total-eng-consumtn">
                                <div className="container-header mb-1">
                                    <div>
                                        <h6 className="card-title custom-title mb-1">Hourly Average Consumption</h6>
                                        <h6 className="card-subtitle mb-2 custom-subtitle-style">
                                            Average by Hour (kWh)
                                        </h6>
                                    </div>
                                    <div>
                                        <Button
                                            label="More Details"
                                            size={Button.Sizes.lg}
                                            icon={<ArrowRight style={{ height: ICON_SIZES[Button.Sizes.lg] }} />}
                                            type={Button.Type.tertiary}
                                            iconAlignment={Button.IconAlignment.right}
                                            onClick={() => {
                                                history.push({
                                                    pathname: `/energy/time-of-day/${bldgId}`,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
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

                    <Row>
                        <Col lg={12}>
                            <TotalEnergyConsumption
                                title="Total Energy Consumption"
                                subtitle="Hourly Energy Consumption (kWh)"
                                series={buildingConsumptionChartData}
                                isConsumpHistoryLoading={isEnergyConsumptionDataLoading}
                                startEndDayCount={startEndDayCount}
                                timeZone={timeZone}
                            />
                        </Col>
                    </Row>
                </div>

                <div style={{ marginTop: '2rem', marginLeft: '23px' }}>
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
            </div>
        </React.Fragment>
    );
};

export default BuildingOverview;
