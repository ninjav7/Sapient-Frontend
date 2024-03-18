import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Table } from 'reactstrap';
import Header from '../../components/Header';
import {
    BaseUrl,
    peakDemand,
    peakEquipType,
    peakEquipUsage,
    peakDemandTrendChart,
    peakDemandYearlyPeak,
} from '../../services/Network';
import TimeSeriesChart from '../charts/TimeSeriesChart';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Spinner } from 'reactstrap';
import { percentageHandler } from '../../utils/helper';
import { ComponentStore } from '../../store/ComponentStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { BuildingStore } from '../../store/BuildingStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { Cookies } from 'react-cookie';
import moment from 'moment';
import 'moment-timezone';
import './style.css';
import '../../sharedComponents/lineChartWidget/style.scss';
import { handleAPIRequestBody, formatConsumptionValue, xaxisFilters } from '../../helpers/helpers';

const TopBuildingPeaks = ({ peakData, setEquipTypeToFetch }) => {
    return (
        <div
            onClick={() => {
                setEquipTypeToFetch(peakData?.timestamp);
            }}
            className="mouse-pointer">
            <h5 className="card-title card-title-style">
                {`${moment(peakData?.timestamp).format('MMMM Do')} @ ${moment(peakData?.timestamp).format('LT')}`}
            </h5>
            <div className="bld-peak-content-style">
                <div className="card-text card-content-style">
                    <div>{formatConsumptionValue(peakData?.consumption?.now / 1000000, 1)}</div>
                    <div className="card-unit-style ml-1">kW</div>
                </div>
                <div className="ml-2">
                    <button
                        className="button-danger text-danger font-weight-bold font-size-5"
                        style={{ width: '100%' }}>
                        <i className="uil uil-arrow-growth">
                            <strong>
                                {percentageHandler(peakData?.consumption?.now, peakData?.consumption?.old)}%
                            </strong>
                        </i>
                    </button>
                </div>
            </div>
        </div>
    );
};

const EquipmentTypePeaks = ({ equipTypeData, isTopPeakCategoriesLoading }) => {
    return (
        <div className="m-2 mt-4">
            <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                Top Peak Categories
            </h6>
            {/* <Link to="/energy/building-peak-explore">
                <div className="float-right ml-2">
                    <Link to="/explore/portfolio/overview/by-buildings">
                        <button type="button" className="btn btn-sm btn-outline-primary font-weight-bold">
                            <i className="uil uil-pen mr-1"></i>Explore
                        </button>
                    </Link>
                </div>
            </Link> */}
            <h6 className="card-subtitle mb-2 custom-subtitle-style">At building peak time</h6>
            <Table className="mb-0" borderless hover>
                <thead className="mouse-pointer">
                    <tr>
                        <th scope="col">Equipment</th>
                        <th scope="col">Power</th>
                        <th scope="col">Change from Previous Year</th>
                    </tr>
                </thead>
                {isTopPeakCategoriesLoading ? (
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
                    <tbody className="mouse-pointer">
                        {equipTypeData?.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td className="custom-equip-style" style={{ color: '#2955e7' }}>
                                        {record?.name}
                                    </td>
                                    <td className="custom-usage-style muted">
                                        {(record?.consumption?.now / 1000000).toLocaleString(undefined, {
                                            maximumFractionDigits: 1,
                                        })}
                                    </td>
                                    <td>
                                        {record?.consumption?.now >= record?.consumption?.yearly ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record?.consumption?.now,
                                                            record?.consumption?.yearly
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
                                                            record?.consumption?.now,
                                                            record?.consumption?.yearly
                                                        )}
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
                )}
            </Table>
        </div>
    );
};

const EquipmentUsagePeaks = ({ equipUsageData, isTopPeakContributersLoading }) => {
    return (
        <div className="m-2 mt-4">
            <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                Top Peak Contributers
            </h6>
            {/* <Link to="/energy/building-peak-explore">
                <div className="float-right ml-2">
                    <Link to="/explore/portfolio/overview/by-buildings">
                        <button type="button" className="btn btn-sm btn-outline-primary font-weight-bold">
                            <i className="uil uil-pen mr-1"></i>Explore
                        </button>
                    </Link>
                </div>
            </Link> */}
            <h6 className="card-subtitle mb-2 custom-subtitle-style">At building peak time</h6>
            <Table className="mb-0" borderless hover>
                <thead>
                    <tr className="mouse-pointer">
                        <th scope="col">Equipment</th>
                        <th scope="col">Power</th>
                        <th scope="col">Change from Previous Year</th>
                    </tr>
                </thead>
                {isTopPeakContributersLoading ? (
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
                    <tbody className="mouse-pointer">
                        {equipUsageData?.map((record, index) => {
                            return (
                                <tr key={index}>
                                    <td className="custom-equip-style" style={{ color: '#2955e7' }}>
                                        {record?.name}
                                    </td>
                                    <td className="custom-usage-style muted">
                                        {(record?.consumption?.now / 1000000).toLocaleString(undefined, {
                                            maximumFractionDigits: 1,
                                        })}
                                    </td>
                                    <td>
                                        {record?.consumption?.now >= record?.consumption?.yearly ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record?.consumption?.now,
                                                            record?.consumption?.yearly
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
                                                            record?.consumption?.now,
                                                            record?.consumption?.yearly
                                                        )}
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
                )}
            </Table>
        </div>
    );
};

const PeakDemand = () => {
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const cookies = new Cookies();
    const userdata = cookies.get('user');
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const startTime = DateRangeStore.useState((s) => s.startTime);
    const endTime = DateRangeStore.useState((s) => s.endTime);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const headers = {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${userdata.token}`,
    };

    const [isPeakContentLoading, setIsPeakContentLoading] = useState(false);
    const [isTopBuildingPeaksLoading, setIsTopBuildingPeaksLoading] = useState(false);
    const [isTopPeakCategoriesLoading, setIsTopPeakCategoriesLoading] = useState(false);
    const [isTopPeakContributersLoading, setIsTopPeakContributersLoading] = useState(false);
    const [isPeakTrendChartLoading, setIsPeakTrendChartLoading] = useState(false);

    const [topBuildingPeaks, setTopBuildingPeaks] = useState([]);
    const [equipTypeToFetch, setEquipTypeToFetch] = useState('');
    const [equipTypeData, setEquipTypeData] = useState([]);
    const [equipUsageData, setEquipUsageData] = useState([]);

    const [selectedTab, setSelectedTab] = useState(0);

    const [peakDemandTrendOptions, setpeakDemandTrendOptions] = useState({
        chart: {
            type: 'area',
            stacked: false,
            zoom: {
                type: 'x',
                enabled: false,
                autoScaleYaxis: true,
            },
            toolbar: {
                autoSelected: 'zoom',
            },
        },
        dataLabels: {
            enabled: false,
        },
        markers: {
            size: 0,
        },
        stroke: {
            width: 3,
        },
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                inverseColors: false,
                opacityFrom: 0.5,
                opacityTo: 0,
                stops: [0, 90, 100],
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
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    let dateText = moment(timestamp).tz(timeZone).format('MMM D');
                    let weekText = moment(timestamp).tz(timeZone).format('ddd');
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
        tooltip: {
            shared: false,
            intersect: false,
            style: {
                fontSize: '12px',
                fontFamily: 'Inter, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
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
                        <h6 class="line-chart-widget-tooltip-title">Peak for Time Period</h6>
                        <div class="line-chart-widget-tooltip-value">${series[seriesIndex][dataPointIndex]} kW</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment(timestamp)
                            .tz(timeZone)
                            .format(`MMM D 'YY @ hh:mm A`)}</div>
                    </div>`;
            },
        },
    });

    const [peakDemandTrendData, setPeakDemandTrendData] = useState([]);

    const [yearlyPeakData, setYearlyPeakData] = useState(null);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }

        const fetchPeakDemandData = async () => {
            try {
                setIsTopBuildingPeaksLoading(true);
                setIsTopPeakCategoriesLoading(true);
                setIsTopPeakContributersLoading(true);
                let params = `?building_id=${bldgId}&consumption=power`;
                await axios
                    .post(
                        `${BaseUrl}${peakDemand}${params}`,
                        handleAPIRequestBody(startDate, endDate, timeZone, startTime, endTime),
                        {
                            headers,
                        }
                    )
                    .then((res) => {
                        let responseData = res?.data;
                        setEquipTypeToFetch(responseData[0]?.timestamp);
                        setTopBuildingPeaks(responseData);
                        setIsTopBuildingPeaksLoading(false);
                    });
            } catch (error) {
                setIsTopBuildingPeaksLoading(false);
            }
        };

        const peakDemandTrendFetch = async () => {
            try {
                setIsPeakTrendChartLoading(true);
                let params = `?building_id=${bldgId}&consumption=power`;
                await axios
                    .post(
                        `${BaseUrl}${peakDemandTrendChart}${params}`,
                        handleAPIRequestBody(startDate, endDate, timeZone, startTime, endTime),
                        {
                            headers,
                        }
                    )
                    .then((res) => {
                        let responseData = res?.data;
                        let newArray = [
                            {
                                name: 'Peak for Time Period',
                                data: [],
                            },
                        ];
                        responseData.forEach((record) => {
                            newArray[0].data.push({
                                x: record?.date,
                                y: (record?.energy_consumption / 1000000).toFixed(0),
                            });
                        });
                        setPeakDemandTrendData(newArray);
                        setIsPeakTrendChartLoading(false);
                    });
            } catch (error) {
                setIsPeakTrendChartLoading(false);
            }
        };

        const peakDemandYearlyData = async () => {
            try {
                setIsPeakContentLoading(true);
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${peakDemandYearlyPeak}${params}`,
                        handleAPIRequestBody(startDate, endDate, timeZone, startTime, endTime),
                        {
                            headers,
                        }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        setYearlyPeakData(responseData);
                        setIsPeakContentLoading(false);
                    });
            } catch (error) {
                setIsPeakContentLoading(false);
            }
        };

        fetchPeakDemandData();
        peakDemandYearlyData();
        peakDemandTrendFetch();
    }, [startDate, endDate, startTime, endTime, bldgId]);

    useEffect(() => {
        const fetchEquipTypeData = async (filterDate) => {
            if (filterDate === null || filterDate === '') {
                setIsTopPeakCategoriesLoading(false);
                return;
            }
            try {
                setIsTopPeakCategoriesLoading(true);
                let params = `?building_id=${bldgId}&consumption=power`;
                await axios
                    .post(
                        `${BaseUrl}${peakEquipType}${params}`,
                        {
                            date_from: filterDate,
                            date_to: filterDate,
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res?.data;
                        setEquipTypeData(responseData);
                        setIsTopPeakCategoriesLoading(false);
                    });
            } catch (error) {
                setIsTopPeakCategoriesLoading(false);
            }
        };

        const fetchEquipUsageData = async (filterDate) => {
            if (filterDate === null || filterDate === '') {
                setIsTopPeakContributersLoading(false);
                return;
            }
            try {
                setIsTopPeakContributersLoading(true);
                let params = `?building_id=${bldgId}&consumption=power`;
                await axios
                    .post(
                        `${BaseUrl}${peakEquipUsage}${params}`,
                        {
                            date_from: filterDate,
                            date_to: filterDate,
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res?.data;
                        setEquipUsageData(responseData);
                        setIsTopPeakContributersLoading(false);
                    });
            } catch (error) {
                setIsTopPeakContributersLoading(false);
            }
        };

        fetchEquipTypeData(equipTypeToFetch);
        fetchEquipUsageData(equipTypeToFetch);
    }, [equipTypeToFetch]);

    useEffect(() => {
        let xaxisObj = xaxisFilters(daysCount, timeZone);
        setpeakDemandTrendOptions({ ...peakDemandTrendOptions, xaxis: xaxisObj });
    }, [daysCount]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Peak Demand',
                        path: '/energy/peak-demand',
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
            <Header title="Peak Demand" type="page" />

            <Row>
                {isPeakContentLoading ? (
                    <div className="mb-2 mr-2 ml-4">
                        <Skeleton count={1} color="#f9fafb" height={80} width={500} />
                    </div>
                ) : (
                    <div className="card-group button-style ml-4">
                        <div className="card card-box-style button-style">
                            <div className="card-body card-box-style">
                                <h5 className="card-title custom-date-time-style">Current 12 Mo. Peak</h5>
                                <p className="card-text card-content-style custom-kw-style">
                                    {yearlyPeakData?.energy_consumption?.now
                                        ? formatConsumptionValue(yearlyPeakData?.energy_consumption?.now / 1000000, 1)
                                        : 0}
                                    <div className="card-unit-style ml-1 font-weight-bold mr-1">kW</div>
                                    <span className="card-unit-style">
                                        {yearlyPeakData?.energy_consumption?.now <=
                                            yearlyPeakData?.energy_consumption?.yearly && (
                                            <button
                                                className="button-success text-success font-weight-bold"
                                                style={{ width: '100px' }}>
                                                <i className="uil uil-chart-down">
                                                    <strong>
                                                        {percentageHandler(
                                                            yearlyPeakData?.energy_consumption?.now,
                                                            yearlyPeakData?.energy_consumption?.yearly
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                        {yearlyPeakData?.energy_consumption?.now >
                                            yearlyPeakData?.energy_consumption?.yearly && (
                                            <button className="button-danger text-danger " style={{ width: '100px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            yearlyPeakData?.energy_consumption?.now,
                                                            yearlyPeakData?.energy_consumption?.yearly
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="card card-box-style button-style">
                            <div className="card-body" style={{ marginTop: '6px' }}>
                                <h5 className="card-title custom-date-time-style">
                                    {moment(yearlyPeakData?.timestamp).format('MMMM D, h:mm A')}
                                </h5>
                                <p className="card-text custom-time-style">
                                    {moment(yearlyPeakData?.timestamp).format('h:mm A')}
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </Row>

            <Row className="ml-3 mt-3 mb-0">
                <div>
                    <h6 className="card-title custom-title mb-1" style={{ display: 'inline-block' }}>
                        Top 5 Building Peaks
                    </h6>

                    <div className="mt-1">
                        {isTopBuildingPeaksLoading ? (
                            <div className="mb-2 mr-2">
                                <Skeleton count={1} color="#f9fafb" height={120} width={1000} />
                            </div>
                        ) : (
                            <div className="button-style">
                                {topBuildingPeaks?.map((record, index) => {
                                    return (
                                        <>
                                            {selectedTab === index ? (
                                                <div
                                                    onClick={() => {
                                                        setSelectedTab(index);
                                                    }}
                                                    className="card peak-card-box-style-selected button-style">
                                                    <div className="card-body">
                                                        <TopBuildingPeaks
                                                            peakData={record}
                                                            setEquipTypeToFetch={setEquipTypeToFetch}
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    onClick={() => {
                                                        setSelectedTab(index);
                                                    }}
                                                    className="card peak-card-box-style button-style">
                                                    <div className="card-body">
                                                        <TopBuildingPeaks
                                                            peakData={record}
                                                            setEquipTypeToFetch={setEquipTypeToFetch}
                                                            setSelectedTab={setSelectedTab}
                                                        />
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </Row>

            <Row className="equip-peak-container ml-3 mr-3 mt-0">
                <Col xl={6}>
                    <EquipmentTypePeaks
                        equipTypeData={equipTypeData}
                        isTopPeakCategoriesLoading={isTopPeakCategoriesLoading}
                    />
                </Col>
                <Col xl={6}>
                    <EquipmentUsagePeaks
                        equipUsageData={equipUsageData}
                        isTopPeakContributersLoading={isTopPeakContributersLoading}
                    />
                </Col>
            </Row>

            <Row className="ml-1" style={{ marginRight: '6px' }}>
                <Col xl={12}>
                    <div className="peak-content-style">
                        <div className="m-1">
                            <h6 className="card-title custom-title">Building 15-Minute Demand Peaks Trend</h6>
                            <h6 className="card-subtitle mb-2 custom-subtitle-style">
                                Max power draw (15 minute period)
                            </h6>
                            {isPeakTrendChartLoading ? (
                                <div className="loader-center-style" style={{ height: '400px' }}>
                                    <Spinner className="m-2" color={'primary'} />
                                </div>
                            ) : (
                                <TimeSeriesChart
                                    height={350}
                                    options={peakDemandTrendOptions}
                                    series={peakDemandTrendData}
                                />
                            )}
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default PeakDemand;
