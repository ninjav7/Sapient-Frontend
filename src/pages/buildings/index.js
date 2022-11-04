import React, { useState, useEffect } from 'react';
import { Row } from 'reactstrap';
import Header from '../../components/Header';
import axios from 'axios';
import 'react-loading-skeleton/dist/skeleton.css';
import { ComponentStore } from '../../store/ComponentStore';
import { formatConsumptionValue, xaxisFilters } from '../../helpers/helpers';
import moment from 'moment';
import 'moment-timezone';
import {fetchOverallBldgData,
    fetchOverallEndUse,
    fetchBuildingEquipments,
    fetchBuilidingHourly,
    fetchEnergyConsumption
} from '../buildings/services';
import { percentageHandler } from '../../utils/helper';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { Cookies } from 'react-cookie';

import BuildingKPIs from './BuildingKPIs';
import TotalEnergyConsumption from '../../sharedComponents/totalEnergyConsumption';
import EnergyConsumptionByEndUse from '../../sharedComponents/energyConsumptionByEndUse';
import HourlyAvgConsumption from './HourlyAvgConsumption';
import TopConsumptionWidget from '../../sharedComponents/topConsumptionWidget/TopConsumptionWidget';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import './style.css';

const BuildingOverview = () => {
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const startEndDayCount = DateRangeStore.useState((s) => +s.daysCount);

    let cookies = new Cookies();
    let userdata = cookies.get('user');

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

    const [buildingConsumptionChartData, setBuildingConsumptionChartData] = useState([]);
    const [isEnergyConsumptionDataLoading, setIsEnergyConsumptionDataLoading] = useState(false);
    const [isAvgConsumptionDataLoading, setIsAvgConsumptionDataLoading] = useState(false);

    const [donutChartOpts, setDonutChartOpts] = useState({
        chart: {
            type: 'donut',
            toolbar: {
                show: true,
            },
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
                        },
                        value: {
                            show: true,
                            fontSize: '15px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 400,
                            color: 'red',
                            formatter: function (val) {
                                return `${val} kWh`;
                            },
                        },
                        total: {
                            show: true,
                            showAlways: false,
                            label: 'Total',
                            fontSize: '22px',
                            fontWeight: 600,
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

    const [hourlyAvgConsumpData, setHourlyAvgConsumpData] = useState([]);

    const heatMapChartHeight = 125;

    const [energyConsumption, setEnergyConsumption] = useState([]);

    const [topEnergyConsumptionData, setTopEnergyConsumptionData] = useState([]);

    const [daysCount, setDaysCount] = useState(1);

    const hourlyAvgConsumpOpts = {
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
                colorScale: {
                    ranges: [
                        {
                            from: 0,
                            to: 3,
                            color: '#F5F8FF',
                        },
                        {
                            from: 4,
                            to: 8,
                            color: '#EDF3FF',
                        },
                        {
                            from: 9,
                            to: 12,
                            color: '#E5EDFF',
                        },
                        {
                            from: 13,
                            to: 16,
                            color: '#DDE8FE',
                        },
                        {
                            from: 17,
                            to: 21,
                            color: '#D6E2FE',
                        },
                        {
                            from: 22,
                            to: 25,
                            color: '#CEDDFE',
                        },
                        {
                            from: 26,
                            to: 29,
                            color: '#C6D7FE',
                        },
                        {
                            from: 30,
                            to: 33,
                            color: '#BED1FE',
                        },
                        {
                            from: 34,
                            to: 38,
                            color: '#B6CCFE',
                        },
                        {
                            from: 39,
                            to: 42,
                            color: '#AEC6FE',
                        },
                        {
                            from: 43,
                            to: 46,
                            color: '#A6C0FD',
                        },
                        {
                            from: 47,
                            to: 51,
                            color: '#9EBBFD',
                        },
                        {
                            from: 52,
                            to: 55,
                            color: '#96B5FD',
                        },
                        {
                            from: 56,
                            to: 59,
                            color: '#8EB0FD',
                        },
                        {
                            from: 60,
                            to: 64,
                            color: '#86AAFD',
                        },
                        {
                            from: 65,
                            to: 68,
                            color: '#7FA4FD',
                        },
                        {
                            from: 69,
                            to: 72,
                            color: '#F8819D',
                        },
                        {
                            from: 73,
                            to: 76,
                            color: '#F87795',
                        },
                        {
                            from: 77,
                            to: 81,
                            color: '#F86D8E',
                        },
                        {
                            from: 82,
                            to: 85,
                            color: '#F76486',
                        },
                        {
                            from: 86,
                            to: 89,
                            color: '#F75A7F',
                        },
                        {
                            from: 90,
                            to: 94,
                            color: '#F75077',
                        },
                        {
                            from: 95,
                            to: 98,
                            color: '#F64770',
                        },
                        {
                            from: 98,
                            to: 100,
                            color: '#F63D68',
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
            position: 'bottom',
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
                const energyVal = w.config.series[seriesIndex].data[dataPointIndex].z;

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Usage by Hour</h6>
                        <div class="line-chart-widget-tooltip-value">${energyVal} kWh</div>
                        <div class="line-chart-widget-tooltip-time-period">
                        ${day}, ${w.globals.labels[dataPointIndex]}
                        </div>
                    </div>`;
            },
        },
    };

    const fetchTrendBadgeType = (now, old) => {
        if (now > old) {
            return TRENDS_BADGE_TYPES.UPWARD_TREND;
        }
        if (now < old) {
            return TRENDS_BADGE_TYPES.DOWNWARD_TREND;
        }
    };

    const getAverageValue = (value, min, max) => {
        if (min == undefined || max === undefined) {
            return 0;
        }
        let percentage = Math.round(((value - min) / (max - min)) * 100);
        return parseInt(percentage);
    };

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }

        const buildingOverallData = async () => {
                let payload =  {
                    date_from: startDate.toLocaleDateString(),
                    date_to: endDate.toLocaleDateString(),
                    tz_info: timeZone,
                };
                await fetchOverallBldgData(bldgId, payload)
                .then((res) => {
                        setOverallBldgData(res.data);
                    })
                    .catch((error) => {
                    });
             };

        const buildingEndUserData = async () => {
            let payload =  {
                date_from: startDate.toLocaleDateString(),
                date_to: endDate.toLocaleDateString(),
                tz_info: timeZone,
            };
            await fetchOverallEndUse(bldgId, payload)
            .then((res) => {
                        setEnergyConsumption(res.data);
                        const energyData = res.data;
                        let newDonutData = [];
                        energyData.forEach((record) => {
                            let fixedConsumption = parseInt(record.energy_consumption.now);
                            newDonutData.push(fixedConsumption);
                        });
                        setDonutChartData(newDonutData);
                    })
                    .catch((error) => {
                    });
        };

        const builidingEquipmentsData = async () => {
            let payload =  {
                date_from: startDate.toLocaleDateString(),
                date_to: endDate.toLocaleDateString(),
                tz_info: timeZone,
            };
            await fetchBuildingEquipments(bldgId, payload)
            .then((res) => {
                        let response = res.data[0].top_contributors;
                        let topEnergyData = [];
                        response.forEach((record) => {
                            let obj = {
                                link: '#',
                                label: record?.equipment_name,
                                value: parseInt(record?.energy_consumption.now / 1000),
                                unit: UNITS.KWH,
                                badgePercentage: percentageHandler(
                                    record?.energy_consumption.now,
                                    record?.energy_consumption.old
                                ),
                                badgeType: fetchTrendBadgeType(
                                    record?.energy_consumption.now,
                                    record?.energy_consumption.old
                                ),
                            };
                            topEnergyData.push(obj);
                        });
                        setTopEnergyConsumptionData(topEnergyData);
                    })
                    .catch((error) => {
                    });
        };

        const buildingHourlyData = async () => {
            setIsAvgConsumptionDataLoading(true);
                let payload =  {
                    date_from: startDate.toLocaleDateString(),
                    date_to: endDate.toLocaleDateString(),
                    tz_info: timeZone,
                };
                await fetchBuilidingHourly(bldgId, payload)
                .then((res) => {
                        let response = res?.data;
                        let weekDaysResData = response[0]?.weekdays;
                        let weekEndResData = response[0]?.weekend;

                        let weekEndList = [];
                        let weekDaysList = [];

                        const weekDaysData = weekDaysResData.map((el) => {
                            weekDaysList.push(parseInt(el.y / 1000));
                            return {
                                x: parseInt(moment.utc(el.x).format('HH')),
                                y: parseInt(el.y / 1000),
                            };
                        });

                        const weekendsData = weekEndResData.map((el) => {
                            weekEndList.push(parseInt(el.y / 1000));
                            return {
                                x: parseInt(moment.utc(el.x).format('HH')),
                                y: parseInt(el.y / 1000),
                            };
                        });

                        let finalList = weekEndList.concat(weekDaysList);
                        finalList.sort((a, b) => a - b);

                        let minVal = finalList[0];
                        let maxVal = finalList[finalList.length - 1];

                        let heatMapData = [];

                        let newWeekdaysData = {
                            name: 'Week days',
                            data: [],
                        };

                        let newWeekendsData = {
                            name: 'Weekends',
                            data: [],
                        };

                        for (let i = 0; i < 24; i++) {
                            let matchedRecord = weekDaysData.find((record) => record.x === i);

                            if (matchedRecord) {
                                matchedRecord.z = matchedRecord.y;
                                matchedRecord.y = getAverageValue(matchedRecord.y, minVal, maxVal);
                                newWeekdaysData.data.push(matchedRecord);
                            } else {
                                newWeekdaysData.data.push({
                                    x: i,
                                    y: getAverageValue(i, minVal, maxVal),
                                    z: 0,
                                });
                            }
                        }

                        for (let i = 0; i < 24; i++) {
                            let matchedRecord = weekendsData.find((record) => record.x === i);

                            if (matchedRecord) {
                                matchedRecord.z = matchedRecord.y;
                                matchedRecord.y = getAverageValue(matchedRecord.y, minVal, maxVal);
                                newWeekendsData.data.push(matchedRecord);
                            } else {
                                newWeekendsData.data.push({
                                    x: i,
                                    y: getAverageValue(i, minVal, maxVal),
                                    z: 0,
                                });
                            }
                        }
                        for (let i = 0; i < 24; i++) {
                            if (i === 0) {
                                newWeekdaysData.data[i].x = '12AM';
                                newWeekendsData.data[i].x = '12AM';
                            } else if (i === 12) {
                                newWeekdaysData.data[i].x = '12PM';
                                newWeekendsData.data[i].x = '12PM';
                            } else if (i > 12) {
                                let a = i % 12;
                                newWeekdaysData.data[i].x = a + 'PM';
                                newWeekendsData.data[i].x = a + 'PM';
                            } else {
                                newWeekdaysData.data[i].x = i + 'AM';
                                newWeekendsData.data[i].x = i + 'AM';
                            }
                        }

                        heatMapData.push(newWeekendsData);
                        heatMapData.push(newWeekdaysData);

                        setHourlyAvgConsumpData(heatMapData.reverse());
                        setIsAvgConsumptionDataLoading(false);
                    })
                    .catch((error) => {
                setIsAvgConsumptionDataLoading(false);
            });
        };

        const buildingConsumptionChart = async () => {
            setIsEnergyConsumptionDataLoading(true);
            let payload =  {
                date_from: startDate.toLocaleDateString(),
                date_to: endDate.toLocaleDateString(),
                tz_info: timeZone,
            };
            await fetchEnergyConsumption(bldgId, payload)
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
                    })
                    .catch((error) => {
                        setIsEnergyConsumptionDataLoading(false);
            });
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
        buildingHourlyData();
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

            <Row lg={12} className="ml-2 mb-4">
                <BuildingKPIs daysCount={startEndDayCount} overalldata={overallBldgData} />
            </Row>

            <div className="bldg-page-grid-style">
                <div className="ml-2">
                    <EnergyConsumptionByEndUse
                        title="Energy Consumption by End Use"
                        subtitle="Energy Totals"
                        series={donutChartData}
                        options={donutChartOpts}
                        energyConsumption={energyConsumption}
                        bldgId={bldgId}
                        pageType="building"
                    />

                    <HourlyAvgConsumption
                        title="Hourly Average Consumption"
                        subtitle="Average by Hour (kWh)"
                        isAvgConsumptionDataLoading={isAvgConsumptionDataLoading}
                        startEndDayCount={startEndDayCount}
                        hourlyAvgConsumpOpts={hourlyAvgConsumpOpts}
                        hourlyAvgConsumpData={hourlyAvgConsumpData}
                        heatMapChartHeight={heatMapChartHeight}
                        timeZone={timeZone}
                        className="mt-4"
                        bldgId={bldgId}
                        pageType="building"
                    />

                    <TotalEnergyConsumption
                        title="Total Energy Consumption"
                        subtitle="Hourly Energy Consumption (kWh)"
                        series={buildingConsumptionChartData}
                        isConsumpHistoryLoading={isEnergyConsumptionDataLoading}
                        startEndDayCount={startEndDayCount}
                        timeZone={timeZone}
                        pageType="building"
                        className="mt-4"
                    />
                </div>

                <TopConsumptionWidget
                    title="Top Energy Consumers"
                    heads={['Equipment', 'Energy', 'Change']}
                    rows={topEnergyConsumptionData}
                    className={'fit-container-style mt-0'}
                />
            </div>
        </React.Fragment>
    );
};

export default BuildingOverview;
