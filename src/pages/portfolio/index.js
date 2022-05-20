import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';
import DonutChart from '../charts/DonutChart';
// import DoughnutChart from '../charts/DoughnutChart';
import LineChart from '../charts/LineChart';
// import MapChart from '../charts/MapChart';
import SimpleMaps from '../charts/SimpleMaps';
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
import { TailSpin } from 'react-loader-spinner';
// import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './style.css';

const PortfolioOverview = () => {
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
                show: false,
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
                            newDonutData.push(parseInt(fixedConsumption));
                        });
                        setDonutChartData(newDonutData);
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
                };
                await axios.get(`${BaseUrl}${getBuilding}`, { headers }).then((res) => {
                    let data = res.data;
                    let activeBldgs = data.filter((bld) => bld.active === true);
                    setBuildingRecord(activeBldgs);
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
                        console.log('setBuildingsEnergyConsume => ', data);
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
                        console.log('markerArray => ', markerArray);
                        setMarkers(markerArray);
                    });
            } catch (error) {
                console.log(error);
                alert('Failed to fetch Portfolio Buildings Data');
            }
        };

        const calculateDays = () => {
            // let time_difference = endDate.getTime() - startDate.getTime();
            // let days_difference = time_difference / (1000 * 60 * 60 * 24);
            // if (days_difference === 0) {
            //     days_difference = 1;
            // }
            // setDaysCount(days_difference);
            // let days_differences = moment.duration(startDate.diff(endDate)).asDays();

            let start = moment(startDate),
                end = moment(endDate),
                days = end.diff(start, 'days');

            if (days === 0) {
                days = 1;
            }
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
                                    description={overalldata.total_consumption.now}
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
                                    description={overalldata.average_energy_density.now}
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
                                    description={overalldata.yearly_electric_eui.now}
                                    unit="kBtu/ft/yr"
                                    value={percentageHandler(
                                        overalldata.yearly_electric_eui.now,
                                        overalldata.yearly_electric_eui.old
                                    )}
                                    consumptionNormal={
                                        overalldata.yearly_electric_eui.now >= overalldata.yearly_electric_eui.old
                                    }
                                    infoText={`Total EUI (Energy Use Intensity) accross all your buildings for the past ${daysCount} days.`}
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
                                {/* <ReactGoogleMap /> */}
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
                                            }}>
                                            {index === 0 ? (
                                                <ProgressBar
                                                    color="danger"
                                                    progressValue={100}
                                                    progressTitle={item.buildingName}
                                                    progressUnit={item.density.toFixed(2) + ' k.W /Sq. feet'}
                                                    className="progress-bar-container custom-progress-bar"
                                                />
                                            ) : (
                                                <ProgressBar
                                                    color="danger"
                                                    progressValue={((item.density / topEnergyDensity) * 100).toFixed(2)}
                                                    progressTitle={item.buildingName}
                                                    progressUnit={item.density.toFixed(2) + ' k.W /Sq. feet'}
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
                        <Row>
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
                        </Row>
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
