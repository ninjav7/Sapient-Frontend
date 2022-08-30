import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Row, Col, Card, CardBody, Table, Button } from 'reactstrap';
import Header from '../../components/Header';
import { Link, useParams } from 'react-router-dom';
import {
    BaseUrl,
    peakDemand,
    peakEquipType,
    peakEquipUsage,
    peakDemandTrendChart,
    peakDemandYearlyPeak,
} from '../../services/Network';
import DetailedButton from '../buildings/DetailedButton';
import LineAnnotationChart from '../charts/LineAnnotationChart';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { Spinner } from 'reactstrap';
import { percentageHandler, dateFormatHandler } from '../../utils/helper';
import { ComponentStore } from '../../store/ComponentStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { BuildingStore } from '../../store/BuildingStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { Cookies } from 'react-cookie';
import moment from 'moment';
import './style.css';

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
                    <div>{peakData?.consumption?.now / 1000}</div>
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

const EquipmentTypePeaks = ({ equipTypeData, isTopPeakCategoriesLoading, setEquipUsageToFetch }) => {
    return (
        <div className="m-2 mt-4">
            <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                Top Peak Categories
            </h6>
            {/* <Link to="/energy/building-peak-explore">
                <div className="float-right ml-2">
                    <Link to="/explore-page/by-buildings">
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
                                    <td
                                        className="custom-equip-style"
                                        style={{ color: '#2955e7' }}
                                        onClick={setEquipUsageToFetch(record?.id)}>
                                        {record?.name}
                                    </td>
                                    <td className="custom-usage-style muted">
                                        {record?.consumption?.now.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
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
                    <Link to="/explore-page/by-buildings">
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
                                        {record?.consumption?.now.toLocaleString(undefined, {
                                            maximumFractionDigits: 2,
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
    const cookies = new Cookies();
    const userdata = cookies.get('user');

    // Loaders
    const [isPeakContentLoading, setIsPeakContentLoading] = useState(false);
    const [isTopBuildingPeaksLoading, setIsTopBuildingPeaksLoading] = useState(false);
    const [isTopPeakCategoriesLoading, setIsTopPeakCategoriesLoading] = useState(false);
    const [isTopPeakContributersLoading, setIsTopPeakContributersLoading] = useState(false);
    const [isPeakTrendChartLoading, setIsPeakTrendChartLoading] = useState(false);

    const [topBuildingPeaks, setTopBuildingPeaks] = useState([]);
    const [equipTypeToFetch, setEquipTypeToFetch] = useState('');
    const [equipUsageToFetch, setEquipUsageToFetch] = useState('');
    const [equipTypeData, setEquipTypeData] = useState([]);
    const [equipUsageData, setEquipUsageData] = useState([]);

    const [selectedTab, setSelectedTab] = useState(0);

    const [peakDemandTrendOptions, setPeakDemandTrendOptions] = useState({
        tooltip: {
            theme: 'dark',
            x: { show: false },
        },
        annotations: {
            yaxis: [
                {
                    y: 8200,
                    borderColor: '#0acf97',
                    label: {
                        borderColor: '#0acf97',
                        style: {
                            color: '#fff',
                            background: '#0acf97',
                        },
                    },
                },
            ],
            xaxis: [
                {
                    x: new Date('23 Nov 2017').getTime(),
                    borderColor: '#775DD0',
                    label: {
                        borderColor: '#775DD0',
                        style: {
                            color: '#fff',
                            background: '#775DD0',
                        },
                    },
                },
                {
                    x: new Date('03 Dec 2017').getTime(),
                    borderColor: '#ffbc00',
                    label: {
                        borderColor: '#ffbc00',
                        style: {
                            color: '#fff',
                            background: '#ffbc00',
                        },
                        orientation: 'horizontal',
                    },
                },
            ],
        },
        chart: {
            type: 'line',
            toolbar: {
                show: true,
            },
        },
        labels: [],
        colors: ['#39afd1'],
        dataLabels: {
            enabled: false,
        },
        stroke: {
            width: [3, 3],
            curve: 'smooth',
        },
        xaxis: {
            labels: {
                labels: {
                    format: 'd',
                },
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return val + 'K';
                },
            },
        },
        grid: {
            row: {
                colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.2,
            },
            borderColor: '#e9ecef',
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

    const [peakDemandTrendData, setPeakDemandTrendData] = useState([
        {
            name: 'Peak for Time Period',
            data: [],
        },
    ]);

    const [yearlyPeakData, setYearlyPeakData] = useState(null);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }

        const fetchPeakDemandData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                setIsTopBuildingPeaksLoading(true);
                setIsTopPeakCategoriesLoading(true);
                setIsTopPeakContributersLoading(true);
                let params = `?building_id=${bldgId}&consumption=energy`;
                await axios
                    .post(
                        `${BaseUrl}${peakDemand}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res?.data;
                        setEquipTypeToFetch(responseData[0]?.timestamp);
                        setTopBuildingPeaks(responseData);
                        setIsTopBuildingPeaksLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Top Building Peak Data');
                setIsTopBuildingPeaksLoading(false);
            }
        };

        const peakDemandTrendFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                setIsPeakTrendChartLoading(true);
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${peakDemandTrendChart}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res?.data;
                        let newPeakData = [
                            {
                                name: 'Peak for Time Period',
                                data: [],
                            },
                        ];
                        let newData = [];
                        let newDateLabels = [];
                        responseData.map((record) => {
                            newData.push((record?.energy_consumption / 1000).toFixed(5));
                            newDateLabels.push(moment(record?.date).format('LL'));
                        });
                        newPeakData[0].data = newData;
                        setPeakDemandTrendData(newPeakData);
                        setPeakDemandTrendOptions({ ...peakDemandTrendOptions, labels: newDateLabels });
                        setIsPeakTrendChartLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Peak-Demand Trend Chart Data');
                setIsPeakTrendChartLoading(false);
            }
        };

        const peakDemandYearlyData = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                setIsPeakContentLoading(true);
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${peakDemandYearlyPeak}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        setYearlyPeakData(responseData);
                        setIsPeakContentLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Peak-Demand Yearly Peak Data');
                setIsPeakContentLoading(false);
            }
        };

        fetchPeakDemandData();
        peakDemandYearlyData();
        peakDemandTrendFetch();
    }, [startDate, endDate, bldgId]);

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

    useEffect(() => {
        const fetchEquipTypeData = async (filterDate) => {
            if (filterDate === null || filterDate === '') {
                setIsTopPeakCategoriesLoading(false);
                setIsTopPeakContributersLoading(false);
                return;
            }
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                console.log('Reached to UseEffect');
                console.log('Reached to UseEffect filterDate', filterDate);
                setIsTopPeakCategoriesLoading(true);
                setIsTopPeakContributersLoading(true);
                let params = `?building_id=${bldgId}&consumption=energy`;
                await axios
                    .post(
                        `${BaseUrl}${peakEquipType}${params}`,
                        {
                            date_from: dateFormatHandler(filterDate),
                            date_to: dateFormatHandler(filterDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res?.data;
                        setEquipUsageToFetch(responseData[0].id);
                        setEquipTypeData(responseData);
                        setIsTopPeakCategoriesLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Top Peak Categories');
                setIsTopPeakCategoriesLoading(false);
            }
        };
        fetchEquipTypeData(equipTypeToFetch);
    }, [equipTypeToFetch]);

    useEffect(() => {
        const fetchEquipUsageData = async (equipId, filterDate) => {
            if (filterDate === null || filterDate === '') {
                setIsTopPeakCategoriesLoading(false);
                setIsTopPeakContributersLoading(false);
                return;
            }
            if (equipId === '') {
                setIsTopPeakCategoriesLoading(false);
                setIsTopPeakContributersLoading(false);
                return;
            }
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                setIsTopPeakContributersLoading(true);
                let params = `?building_id=${bldgId}&consumption=energy`;
                await axios
                    .post(
                        `${BaseUrl}${peakEquipUsage}${params}`,
                        {
                            date_from: dateFormatHandler(filterDate),
                            date_to: dateFormatHandler(filterDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res?.data;
                        setEquipUsageData(responseData);
                        setIsTopPeakContributersLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Top Peak Contributer');
                setIsTopPeakContributersLoading(false);
            }
        };
        fetchEquipUsageData(equipUsageToFetch, equipTypeToFetch);
    }, [equipUsageToFetch]);

    return (
        <React.Fragment>
            <Header title="Peak Demand" />

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
                                    {yearlyPeakData?.energy_consumption?.now / 1000}
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

            <Row className="ml-3 mt-3">
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

            <Row className="equip-peak-container ml-3">
                <Col xl={6}>
                    <EquipmentTypePeaks
                        equipTypeData={equipTypeData}
                        isTopPeakCategoriesLoading={isTopPeakCategoriesLoading}
                        setEquipUsageToFetch={setEquipUsageToFetch}
                    />
                </Col>
                <Col xl={6}>
                    <EquipmentUsagePeaks
                        equipUsageData={equipUsageData}
                        isTopPeakContributersLoading={isTopPeakContributersLoading}
                    />
                </Col>
            </Row>

            <Row className="ml-1">
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
                                <LineAnnotationChart
                                    height={350}
                                    peakDemandTrendOptions={peakDemandTrendOptions}
                                    peakDemandTrendData={peakDemandTrendData}
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
