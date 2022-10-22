import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { Row, Col, Card, CardBody, Table, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import DonutChart from '../charts/DonutChart';
import ApexDonutChart from '../charts/ApexDonutChart';
import ApexCharts from 'apexcharts';
import LineChart from '../charts/LineChart';
import SimpleMaps from '../charts/SimpleMaps';
import EnergyMap from './EnergyMap';
import ReactGoogleMap from './ReactGoogleMap';
import ProgressBar from './ProgressBar';
import DetailedButton from '../buildings/DetailedButton';
import Header from '../../components/Header';
import axios from 'axios';
import moment from 'moment';
import {
    BaseUrl,
    portfolioBuilidings,
    portfolioEndUser,
    portfolioOverall,
    getEnergyConsumption,
} from '../../services/Network';
import { timeZone, numberWithCommas } from '../../utils/helper';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { LoadingStore } from '../../store/LoadingStore';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import { TailSpin } from 'react-loader-spinner';
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './style.scss';
import PortfolioKPIs from './PortfolioKPIs';
// import EnergyDensityMap from './EnergyDensityMap';
import EnergyConsumptionTotals from './EnergyConsumptionTotals';
import EnergyConsumptionHistory from './EnergyConsumptionHistory';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import { getFormattedTimeIntervalObjectData } from '../../helpers/formattedChartData';

const PortfolioOverview = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    // const isLoading = ProcessingStore.useState((s) => s.isLoading);
    // const [isProcessing, setIsProcessing] = useState(false);
    const [buildingsEnergyConsume, setBuildingsEnergyConsume] = useState([]);
    const [energyConsumption, setenergyConsumption] = useState([]);
    const [isEnergyConsumptionChartLoading, setIsEnergyConsumptionChartLoading] = useState(false);
    const [markers, setMarkers] = useState([]);

    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const [startEndDayCount, setStartEndDayCount] = useState(0);
    // const [topEnergyDensity, setTopEnergyDensity] = useState(1);

    const [energyConsumptionChart, setEnergyConsumptionChart] = useState([]);
    const [isConsumpHistoryLoading, setIsConsumpHistoryLoading] = useState(false);

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
            ],
        },
    ]);

    const [lineChartOptions, setLineChartOptions] = useState({
        chart: {
            toolbar: {
                show: false,
            },
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        toolbar: {
            show: true,
        },
        colors: ['#5E94E4'],
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
            },
            y: {
                formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                    return value + ' K';
                },
            },
        },
        xaxis: {
            type: 'datetime',
            // labels: {
            //     format: 'dd/MMM - hh:mm TT',
            // },
            labels: {
                formatter: function (val, timestamp) {
                    return moment(timestamp).format('MMM DD');
                    return moment(timestamp).format('DD/MMM - hh:mm');
                },
            },
        },
        yaxis: {
            labels: {
                formatter: function (value) {
                    var val = Math.abs(value);
                    // if (val >= 1000) {
                    //     val = (val / 1000).toFixed(0) + ' K';
                    // }
                    return val + ' K';
                },
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
    });

    const [overalldata, setOveralldata] = useState({
        total_building: 0,
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
    const [isKPIsLoading, setIsKPIsLoading] = useState(false);

    // const [donutChartData, setDonutChartData] = useState([12553, 11553, 6503, 2333]);
    const [donutChartData, setDonutChartData] = useState([0, 0, 0, 0]);

    const [donutChartOpts, setDonutChartOpts] = useState({
        chart: {
            type: 'donut',
            background: 'transparent',
        },
        labels: ['HVAC', 'Lightning', 'Plug', 'Process'],
        colors: ['#3094B9', '#2C4A5E', '#66D6BC', '#3B8554'],
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
                    foreColor: '#3b70bf',
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
                            color: '#ffe700',
                            fontSize: '20px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 400,
                            // offsetY: 16,
                            formatter: function (val) {
                                return `${val} kWh`;
                            },
                        },
                        total: {
                            show: true,
                            showAlways: false,
                            label: 'Total',
                            color: ['#373d3f'],
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
            enabled: false,
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

    let [color, setColor] = useState('#ffffff');

    const handleChange = (e, value) => {
        if (value === 'HVAC') {
            const seriesIndex = 0;
            const dataPointIndex = 0;
            ApexCharts.exec('genderplot', 'toggleDataPointSelection', seriesIndex, dataPointIndex);
        } else if (value === 'Lighting') {
            const seriesIndex = 0;
            const dataPointIndex = 1;
            ApexCharts.exec('genderplot', 'toggleDataPointSelection', seriesIndex, dataPointIndex);
        } else if (value === 'Process') {
            const seriesIndex = 0;
            const dataPointIndex = 2;
            ApexCharts.exec('genderplot', 'toggleDataPointSelection', seriesIndex, dataPointIndex);
        } else if (value === 'Plug') {
            const seriesIndex = 0;
            const dataPointIndex = 3;
            ApexCharts.exec('genderplot', 'toggleDataPointSelection', seriesIndex, dataPointIndex);
        }
    };
    // const [series, setSeries] = useState([44, 55, 41, 17]);
    const [series, setSeries] = useState([0, 0, 0, 0]);

    const [options, setOptions] = useState({
        chart: {
            type: 'donut',
            id: 'genderplot',
            events: {
                mounted: function (chartContext, config) {
                    chartContext.toggleDataPointSelection(0, 0);
                },
            },
        },
        labels: ['HVAC', 'Lightning', 'Plug', 'Process', 'Other'],
        colors: ['#3094B9', '#2C4A5E', '#66D6BC', '#3B8554', '#D70040'],
        legend: {
            show: false,
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: 0,
        },
        itemMargin: {
            horizontal: 10,
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '80%',
                    background: 'grey',
                    foreColor: '#3b70bf',
                    labels: {
                        show: true,
                        name: {
                            show: false,
                        },
                        value: {
                            show: true,
                            color: '#000000',
                            fontSize: '20px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            fontWeight: 400,
                            formatter: function (val) {
                                return `${val} kWh`;
                            },
                        },
                        total: {
                            show: true,
                            showAlways: false,
                            label: 'Total',
                            color: '#000000',
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
                        width: 200,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
    });

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }

        const portfolioOverallData = async () => {
            try {
                setIsKPIsLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios
                    .post(
                        `${BaseUrl}${portfolioOverall}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        setOveralldata(res.data);
                        setIsKPIsLoading(false);
                    });
            } catch (error) {
                setIsKPIsLoading(false);
            }
        };

        const portfolioEndUsesData = async () => {
            try {
                setIsEnergyConsumptionChartLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios
                    .post(
                        `${BaseUrl}${portfolioEndUser}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res?.data;
                        response.forEach((record) => {
                            record.energy_consumption.now = parseInt(record.energy_consumption.now / 1000);
                            record.energy_consumption.old = parseInt(record.energy_consumption.old / 1000);
                            record.after_hours_energy_consumption.now = parseInt(
                                record.after_hours_energy_consumption.now / 1000
                            );
                            record.after_hours_energy_consumption.old = parseInt(
                                record.after_hours_energy_consumption.old / 1000
                            );
                        });
                        setenergyConsumption(response);
                        const energyData = res.data;
                        let newDonutData = [];
                        energyData.forEach((record) => {
                            newDonutData.push(parseInt(record.energy_consumption.now));
                        });
                        setSeries(newDonutData);
                        setIsEnergyConsumptionChartLoading(false);
                    });
            } catch (error) {
                setIsEnergyConsumptionChartLoading(false);
            }
        };

        const energyConsumptionData = async () => {
            try {
                setIsConsumpHistoryLoading(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios
                    .post(
                        `${BaseUrl}${getEnergyConsumption}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let newArray = [
                            {
                                name: 'Energy',
                                data: [],
                            },
                        ];
                        res.data.forEach((record) => {
                            const d = new Date(record.x);
                            const milliseconds = d.getTime();
                            newArray[0].data.push({
                                x: milliseconds,
                                y: (record.y / 1000).toFixed(0),
                            });
                        });
                        // const formattedData = getFormattedTimeIntervalObjectData(newArray, startDate, endDate);
                        // console.log('formattedData => ', formattedData);
                        setEnergyConsumptionChart(newArray);
                        setIsConsumpHistoryLoading(false);
                    });
            } catch (error) {
                setIsConsumpHistoryLoading(false);
            }
        };

        const portfolioBuilidingsData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios
                    .post(
                        `${BaseUrl}${portfolioBuilidings}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let data = res.data;
                        setBuildingsEnergyConsume(data);
                        let markerArray = [];
                        data.map((record) => {
                            let markerObj = {
                                markerOffset: 25,
                                name: record.buildingName,
                                coordinates: [parseInt(record.lat), parseInt(record.long)],
                            };
                            markerArray.push(markerObj);
                        });
                        const markerArr = [
                            { markerOffset: 25, name: 'NYPL', coordinates: [-74.006, 40.7128] },
                            { markerOffset: 25, name: 'Justin', coordinates: [90.56, 76.76] },
                        ];
                        setMarkers(markerArr);
                    });
            } catch (error) {}
        };

        // const calculateDays = () => {
        //     let time_difference = endDate.getTime() - startDate.getTime();
        //     let days_difference = time_difference / (1000 * 60 * 60 * 24);
        //     days_difference = days_difference + 1;
        //     setDaysCount(days_difference);
        // };

        // const setLoading = () => {
        //     ProcessingStore.update((s) => {
        //         s.isLoading = !isLoading;
        //     });
        // };

        // setIsProcessing(true);
        // setLoading();

        portfolioBuilidingsData();
        portfolioOverallData();
        portfolioEndUsesData();
        energyConsumptionData();
        // calculateDays();

        // setLoading();
        // setIsProcessing(false);
    }, [startDate, endDate]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Portfolio Overview',
                        path: '/energy/portfolio/overview',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'portfolio';
            });
        };
        updateBreadcrumbStore();
    }, []);

    const [userPermission] = useAtom(userPermissionData);

    useEffect(() => {
        const start = moment(startDate);
        const end = moment(endDate);
        const days = end.diff(start, 'days');
        setStartEndDayCount(days + 1);
    });

    return (
        <>
            <Header title="Portfolio Overview" type="page" />
            {userPermission?.user_role === 'admin' ||
            userPermission?.permissions?.permissions?.energy_portfolio_permission?.view ? (
                <>
                    <Row className="mt-2 mb-2">
                        <div className="col">
                            <PortfolioKPIs
                                daysCount={daysCount}
                                totalBuilding={buildingsEnergyConsume.length}
                                overalldata={overalldata}
                                isKPIsLoading={isKPIsLoading}
                            />
                        </div>
                    </Row>

                    {/* <div className="portfolio-consume-widget-wrapper mt-5 ml-2"> */}
                    <Row className="ml-0 mt-3">
                        <Col xl={6}>
                            <EnergyConsumptionTotals
                                series={series}
                                options={options}
                                energyConsumption={energyConsumption}
                                isEnergyConsumptionChartLoading={isEnergyConsumptionChartLoading}
                            />
                        </Col>
                        <Col xl={6}>
                            <EnergyConsumptionHistory
                                series={energyConsumptionChart}
                                isConsumpHistoryLoading={isConsumpHistoryLoading}
                                startEndDayCount={startEndDayCount}
                            />
                        </Col>
                    </Row>
                    {/* </div> */}
                </>
            ) : (
                <p>You don't have the permission to view this page</p>
            )}
        </>
    );
};

export default PortfolioOverview;
