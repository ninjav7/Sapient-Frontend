import React, { useState, useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { Row, Col, Card, CardBody, Table, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import DonutChart from '../charts/DonutChart';
import ApexDonutChart from '../charts/ApexDonutChart';
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
    getBuilding,
    getEnergyConsumption,
} from '../../services/Network';
import { percentageHandler, dateFormatHandler } from '../../utils/helper';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { LoadingStore } from '../../store/LoadingStore';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowTrendUp } from '@fortawesome/pro-regular-svg-icons';
import { faArrowTrendDown } from '@fortawesome/pro-regular-svg-icons';
import { TailSpin } from 'react-loader-spinner';
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './style.css';

const PortfolioOverview = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    // const isLoading = ProcessingStore.useState((s) => s.isLoading);
    // const [isProcessing, setIsProcessing] = useState(false);
    const [buildingsEnergyConsume, setBuildingsEnergyConsume] = useState([]);
    const [energyConsumption, setenergyConsumption] = useState([]);
    const [buildingRecord, setBuildingRecord] = useState([]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [markers, setMarkers] = useState([]);
    // const [startDate, endDate] = dateRange;
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const [daysCount, setDaysCount] = useState(1);
    const [topEnergyDensity, setTopEnergyDensity] = useState(1);

    const [energyConsumptionChart, setEnergyConsumptionChart] = useState([]);

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
                format: 'dd/MMM-hh:mm TT',
            },
            y: {
                formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                    return value + ' K';
                },
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                format: 'dd/MMM - hh:mm TT',
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

    // const [series, setSeries] = useState([44, 55, 41, 17]);
    const [series, setSeries] = useState([0, 0, 0, 0]);

    const [options, setOptions] = useState({
        chart: {
            type: 'donut',
        },
        labels: ['HVAC', 'Lightning', 'Plug', 'Process'],
        colors: ['#3094B9', '#2C4A5E', '#66D6BC', '#3B8554'],
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
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios
                    .post(
                        `${BaseUrl}${portfolioOverall}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        setOveralldata(res.data);
                        console.log('setOveralldata => ', res.data);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Portfolio Overall Data');
            }
        };

        const portfolioEndUsesData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios
                    .post(
                        `${BaseUrl}${portfolioEndUser}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        setenergyConsumption(res.data);
                        const energyData = res.data;
                        let newDonutData = [];
                        energyData.forEach((record) => {
                            let fixedConsumption = record.energy_consumption.now;
                            newDonutData.push(parseInt(fixedConsumption / 1000));
                        });
                        setSeries(newDonutData);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Portfolio EndUses Data');
            }
        };

        const energyConsumptionData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = '?aggregate=day';
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
                        console.log('Line Chart Response => ', response);
                        let newArray = [
                            {
                                name: 'Energy',
                                data: [],
                            },
                        ];
                        response.forEach((record) => {
                            newArray[0].data.push({
                                // x: moment(record.x).format('MMM D'),
                                x: record.x,
                                y: (record.y / 1000).toFixed(2),
                            });
                        });
                        console.log('Line Chart New Array => ', newArray);
                        setEnergyConsumptionChart(newArray);
                    });
            } catch (error) {
                console.log(error);
                alert('Failed to fetch Energy Consumption Data');
            }
        };

        const getBuildingData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${getBuilding}`, { headers }).then((res) => {
                    let data = res.data;
                    setBuildingRecord(data);
                });
            } catch (error) {
                console.log(error);
                alert('Failed to fetch Building Data');
            }
        };

        const portfolioBuilidingsData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios
                    .post(
                        `${BaseUrl}${portfolioBuilidings}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let data = res.data;
                        localStorage.setItem('buildingId', data[0].buildingID);
                        localStorage.setItem('buildingName', data[0].buildingName);
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
                        setMarkers(markerArray);
                    });
            } catch (error) {
                console.log(error);
                alert('Failed to fetch Portfolio Buildings Data');
            }
        };

        const calculateDays = () => {
            let start = moment(startDate),
                end = moment(endDate),
                days = end.diff(start, 'days');
            days = days + 1;
            setDaysCount(days);
        };

        // const setLoading = () => {
        //     ProcessingStore.update((s) => {
        //         s.isLoading = !isLoading;
        //     });
        // };

        // setIsProcessing(true);
        // setLoading();
        getBuildingData();
        portfolioBuilidingsData();
        portfolioOverallData();
        portfolioEndUsesData();
        energyConsumptionData();
        calculateDays();
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

    useEffect(() => {
        if (!buildingsEnergyConsume.length > 0) {
            return;
        }
        let topVal = buildingsEnergyConsume[0].density;
        setTopEnergyDensity(topVal);
    }, [buildingsEnergyConsume]);

    return (
        <React.Fragment>
            {/* {!isLoading && (
                <div className="custom-loading-style"> */}
            {/* <TailSpin color="#4A4A4A" height={80} width={80} /> */}
            {/* <Spinner className="m-2" color={'primary'} />
                </div>
            )} */}

            {/* {isLoading && ( */}
            <>
                <Header title="Portfolio Overview" />
                {/* <Row>
                        <Skeleton width={80} height={20} />
                    </Row> */}
                <Row className="mt-2">
                    <div className="energy-summary-alignment">
                        <div className="card-box-style button-style">
                            <div className="card-body">
                                <h5 className="card-title subtitle-style">Total Buildings</h5>
                                <p className="card-text card-content-style">{buildingRecord.length}</p>
                            </div>
                        </div>

                        <div className="card-box-style button-style">
                            <div className="card-body">
                                <DetailedButton
                                    title="Total Consumption"
                                    description={overalldata.total_consumption.now / 1000}
                                    unit="kWh"
                                    value={percentageHandler(
                                        overalldata.total_consumption.now,
                                        overalldata.total_consumption.old
                                    )}
                                    consumptionNormal={
                                        overalldata.total_consumption.now >= overalldata.total_consumption.old
                                    }
                                    infoText={`Total energy consumption accross all your buildings for the past ${daysCount} days.`}
                                    infoType={`total-eng-cnsmp`}
                                />
                            </div>
                        </div>

                        <div className="card-box-style button-style">
                            <div className="card-body">
                                <DetailedButton
                                    title="Average Energy Density"
                                    description={overalldata.average_energy_density.now / 1000}
                                    unit="kWh/sq.ft."
                                    value={percentageHandler(
                                        overalldata.average_energy_density.now,
                                        overalldata.average_energy_density.old
                                    )}
                                    consumptionNormal={
                                        overalldata.average_energy_density.now >= overalldata.average_energy_density.old
                                    }
                                    infoText={`Average energy density (kWh / sq.ft.) accross all your buildings for the past ${daysCount} days.`}
                                    infoType={`avg-eng-dnty`}
                                />
                            </div>
                        </div>

                        <div className="card-box-style button-style">
                            <div className="card-body">
                                <DetailedButton
                                    title="12 Mo. Electric EUI"
                                    description={overalldata.yearly_electric_eui.now / 1000}
                                    unit="kBtu/ft/yr"
                                    value={percentageHandler(
                                        overalldata.yearly_electric_eui.now,
                                        overalldata.yearly_electric_eui.old
                                    )}
                                    consumptionNormal={
                                        overalldata.yearly_electric_eui.now >= overalldata.yearly_electric_eui.old
                                    }
                                    // infoText={`Total EUI (Energy Use Intensity) accross all your buildings for the past ${daysCount} days.`}
                                    infoText={`The Electric Energy Use Intensity across all of your buildings in the last calendar year.`}
                                    infoType={`total-eui`}
                                />
                            </div>
                        </div>
                    </div>
                </Row>

                <Row className="mt-2">
                    <Col xl={5}>
                        <div className="card-body mt-2">
                            <h6 className="custom-title">Energy Density Top Buildings</h6>
                            <h6 className="mb-2 custom-subtitle-style">Energy Consumption / Sq. Ft. Average</h6>
                            <div className="portfolio-map-widget">
                                <SimpleMaps markers={markers} />
                                {/* <EnergyMap /> */}
                            </div>
                        </div>
                    </Col>

                    <Col xl={7} className="mt-5">
                        <div className="card-body mt-4">
                            <span className="font-weight-bold text-muted float-left store-value-style">Store Name</span>
                            <span className="font-weight-bold text-muted float-right store-value-style">
                                Energy Density
                            </span>

                            {buildingsEnergyConsume.slice(0, 6).map((item, index) => (
                                <Col md={6} xl={12}>
                                    <Link
                                        to={{
                                            pathname: `/energy/building/overview/${item.buildingID}`,
                                        }}>
                                        <div
                                            className="progress-bar-container mt-4"
                                            onClick={() => {
                                                localStorage.setItem('buildingId', item.buildingID);
                                                localStorage.setItem('buildingName', item.buildingName);
                                                BuildingStore.update((s) => {
                                                    s.BldgId = item.buildingID;
                                                    s.BldgName = item.buildingName;
                                                });
                                                ComponentStore.update((s) => {
                                                    s.parent = 'buildings';
                                                });
                                            }}>
                                            {index === 0 && item.density === 0 && (
                                                <ProgressBar
                                                    colors={`#D14065`}
                                                    progressValue={0}
                                                    progressTitle={item.buildingName}
                                                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                                                    className="progress-bar-container custom-progress-bar"
                                                />
                                            )}
                                            {index === 0 && item.density > 0 && (
                                                <ProgressBar
                                                    colors={`#D14065`}
                                                    progressValue={100}
                                                    progressTitle={item.buildingName}
                                                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                                                    className="progress-bar-container custom-progress-bar"
                                                />
                                            )}
                                            {index === 1 && (
                                                <ProgressBar
                                                    colors={`#DF5775`}
                                                    progressValue={((item.density / topEnergyDensity) * 100).toFixed(2)}
                                                    progressTitle={item.buildingName}
                                                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                                                    className="progress-bar-container"
                                                />
                                            )}
                                            {index === 2 && (
                                                <ProgressBar
                                                    colors={`#EB6E87`}
                                                    progressValue={((item.density / topEnergyDensity) * 100).toFixed(2)}
                                                    progressTitle={item.buildingName}
                                                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                                                    className="progress-bar-container"
                                                />
                                            )}
                                            {index === 3 && (
                                                <ProgressBar
                                                    colors={`#EB6E87`}
                                                    progressValue={((item.density / topEnergyDensity) * 100).toFixed(2)}
                                                    progressTitle={item.buildingName}
                                                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                                                    className="progress-bar-container"
                                                />
                                            )}
                                            {index === 4 && (
                                                <ProgressBar
                                                    colors={`#FC9EAC`}
                                                    progressValue={((item.density / topEnergyDensity) * 100).toFixed(2)}
                                                    progressTitle={item.buildingName}
                                                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                                                    className="progress-bar-container"
                                                />
                                            )}
                                            {index === 5 && (
                                                <ProgressBar
                                                    colors={`#FFCFD6`}
                                                    progressValue={((item.density / topEnergyDensity) * 100).toFixed(2)}
                                                    progressTitle={item.buildingName}
                                                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                                                    className="progress-bar-container"
                                                />
                                            )}
                                        </div>
                                    </Link>
                                </Col>
                            ))}
                        </div>
                    </Col>
                </Row>

                <Row className="mt-2 ml-2">
                    <Col xl={7}>
                        <div className="mt-4">
                            <div>
                                <h6 className="card-title custom-title">Energy Consumption by End Use</h6>
                                <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Totals</h6>
                            </div>
                            <div className="custom-enduse-style">
                                <div>
                                    {/* <DonutChart
                                        donutChartOpts={donutChartOpts}
                                        donutChartData={donutChartData}
                                        height={185}
                                        id={Date.now()}
                                    /> */}
                                    <ApexDonutChart series={series} options={options} />
                                </div>
                                <div className="mt-3">
                                    {energyConsumption.map((record, index) => {
                                        return (
                                            <div>
                                                <div className="custom-enduse-table-style consumption-style m-2 p-1">
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
                                                    </div>
                                                    <div className="custom-equip-style record-style font-weight-bold">
                                                        {record.device}
                                                    </div>
                                                    <div className="custom-usage-style muted table-font-style">
                                                        {(record.energy_consumption.now / 1000).toLocaleString(
                                                            undefined,
                                                            {
                                                                maximumFractionDigits: 2,
                                                            }
                                                        )}
                                                        kWh
                                                    </div>
                                                    <div className="mr-2">
                                                        {record.energy_consumption.now <=
                                                            record.energy_consumption.old && (
                                                            <button className="button-success text-success custom-btn-style">
                                                                <FontAwesomeIcon
                                                                    icon={faArrowTrendDown}
                                                                    size="md"
                                                                    color="#43d39e"
                                                                    className="mr-1"
                                                                />
                                                                <strong>
                                                                    {percentageHandler(
                                                                        record.energy_consumption.now,
                                                                        record.energy_consumption.old
                                                                    )}{' '}
                                                                    %
                                                                </strong>
                                                            </button>
                                                        )}
                                                        {record.energy_consumption.now >
                                                            record.energy_consumption.old && (
                                                            <button className="button-danger text-danger custom-btn-style">
                                                                <FontAwesomeIcon
                                                                    icon={faArrowTrendUp}
                                                                    size="md"
                                                                    color="#ff5c75"
                                                                    className="mr-1"
                                                                />
                                                                <strong>
                                                                    {percentageHandler(
                                                                        record.energy_consumption.now,
                                                                        record.energy_consumption.old
                                                                    )}{' '}
                                                                    %
                                                                </strong>
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>

                        {/* <Row>
                            <Col xl={5} className="mt-4">
                                <h6 className="card-title custom-title">Energy Consumption by End Use</h6>
                                <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Totals</h6>

                                <div className="card-body mt-2">
                                    <div className="mt-4" id={Date.now()}>
                                        <DonutChart
                                            donutChartOpts={donutChartOpts}
                                            donutChartData={donutChartData}
                                            height={185}
                                            id={Date.now()}
                                        />
                                    </div>
                                </div>
                            </Col>
                            <Col xl={7} className="mt-4">
                                <Card style={{ marginTop: '80px' }}>
                                    <CardBody>
                                        <Table className="table-font-style" borderless>
                                            <tbody>
                                                {energyConsumption.map((record, index) => {
                                                    return (
                                                        <tr key={index} className="consumption-style">
                                                            <td>
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
                                                            </td>
                                                            <td className="custom-equip-style record-style font-weight-bold">
                                                                {record.device}
                                                            </td>
                                                            <td className="custom-usage-style muted table-font-style">
                                                                {record.energy_consumption.now.toLocaleString(
                                                                    undefined,
                                                                    {
                                                                        maximumFractionDigits: 2,
                                                                    }
                                                                )}
                                                                kWh
                                                            </td>
                                                            <td>
                                                                {record.energy_consumption.now <=
                                                                    record.energy_consumption.old && (
                                                                    <button
                                                                        className="button-success text-success btn-font-style"
                                                                        style={{ width: '100px' }}>
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
                                                                    <button
                                                                        className="button-danger text-danger btn-font-style"
                                                                        style={{ width: '100px' }}>
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
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </Table>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row> */}
                    </Col>

                    <Col xl={5}>
                        <div className="card-body">
                            <h6 className="card-title custom-title">Energy Consumption History</h6>
                            <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Totals by Day</h6>
                            <LineChart options={lineChartOptions} series={energyConsumptionChart} />
                        </div>
                    </Col>
                </Row>
            </>
            {/* )} */}
        </React.Fragment>
    );
};

export default PortfolioOverview;
