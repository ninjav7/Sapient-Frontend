import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import Header from '../../components/Header';
import { BaseUrl, endUses, endUsesChart } from '../../services/Network';
import StackedBarChart from '../charts/StackedBarChart';
import EnergyUsageCard from './UsageCard';
import axios from 'axios';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { useParams } from 'react-router-dom';
import { percentageHandler, dateFormatHandler } from '../../utils/helper';
import { DateRangeStore } from '../../store/DateRangeStore';
import useSortableData from '../../helpers/useSortableData';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import { Spinner } from 'reactstrap';
import Skeleton from 'react-loading-skeleton';
import './style.css';

const EndUses = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);

    const [isEndUsesChartLoading, setIsEndUsesChartLoading] = useState(false);
    const [isEndUsesDataFetched, setIsEndUsesDataFetched] = useState(false);

    const [barChartOptions, setBarChartOptions] = useState({
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: true,
            },
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '20%',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: false,
        },
        xaxis: {
            categories: [],
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
        },
        colors: ['#66A4CE', '#80E1D9', '#0C7EA0', '#847CB5', '#2C4A5E'],
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + 'k';
                },
            },
            theme: 'dark',
            x: { show: false },
        },
        fill: {
            opacity: 1,
        },
        states: {
            hover: {
                filter: 'none',
            },
        },
        legend: {
            show: false,
            position: 'top',
            horizontalAlign: 'center',
        },
        grid: {
            borderColor: '#f1f3fa',
        },
    });

    const [barChartData, setBarChartData] = useState([]);

    const [endUsesData, setEndUsesData] = useState([]);

    const sortArrayOfObj = (arr) => {
        let newArr = arr.sort((a, b) => a._id - b._id);
        return newArr;
    };

    const formatData = (arr) => {
        let newData = [];
        sortArrayOfObj(arr).forEach((item) => {
            newData.push(item.energy_consumption);
        });
        return newData;
    };

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }

        const endUsesDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                setIsEndUsesDataFetched(true);
                let params = `?building_id=${bldgId}`;
                await axios
                    .post(
                        `${BaseUrl}${endUses}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res.data;
                        setEndUsesData(response);
                        setIsEndUsesDataFetched(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch EndUses Data');
                setIsEndUsesDataFetched(false);
            }
        };

        const endUsesChartDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}`;
                setIsEndUsesChartLoading(true);
                await axios
                    .post(
                        `${BaseUrl}${endUsesChart}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res.data;
                        let newArray = [];
                        responseData.map((element) => {
                            let newObj = {
                                name: element.name,
                                data: formatData(element.data),
                            };
                            newArray.push(newObj);
                        });
                        setBarChartData(newArray);
                        let newXaxis = {
                            categories: [],
                        };
                        let weeksArray = [];
                        responseData.forEach((enduse) => {
                            enduse.data.forEach((element) => {
                                weeksArray.push(element._id);
                            });
                        });
                        let uniqueSet = new Set(weeksArray);
                        let newList = Array.from(uniqueSet);
                        newList.sort(function (a, b) {
                            return a - b;
                        });
                        newList.map((num) => {
                            return newXaxis.categories.push(`Week ${num}`);
                        });
                        setBarChartOptions({ ...barChartOptions, xaxis: newXaxis });
                        setIsEndUsesChartLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch EndUses Data');
                setIsEndUsesChartLoading(false);
            }
        };

        endUsesDataFetch();
        endUsesChartDataFetch();
    }, [startDate, endDate, bldgId]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'End Uses',
                        path: '/energy/end-uses',
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
            <Header title="End Uses" />

            {isEndUsesDataFetched ? (
                <Row className="ml-4">
                    <Skeleton count={1} color="#f9fafb" height={120} width={650} />
                </Row>
            ) : (
                <Row className="ml-4">
                    <div className="card-group button-style mt-1 mb-0">
                        {endUsesData.map((record, index) => {
                            return (
                                <div className="card usage-card-box-style button-style">
                                    <div className="card-body">
                                        <div>
                                            {index === 0 && (
                                                <p className="dot" style={{ backgroundColor: '#66A4CE' }}>
                                                    <span className="card-title card-title-style">
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.device}
                                                    </span>
                                                </p>
                                            )}
                                            {index === 1 && (
                                                <p className="dot" style={{ backgroundColor: '#80E1D9' }}>
                                                    <span className="card-title card-title-style">
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.device}
                                                    </span>
                                                </p>
                                            )}
                                            {index === 2 && (
                                                <p className="dot" style={{ backgroundColor: '#0C7EA0' }}>
                                                    <span className="card-title card-title-style">
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.device}
                                                    </span>
                                                </p>
                                            )}
                                            {index === 3 && (
                                                <p className="dot" style={{ backgroundColor: '#847CB5' }}>
                                                    <span className="card-title card-title-style">
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.device}
                                                    </span>
                                                </p>
                                            )}
                                            {index === 4 && (
                                                <p className="dot" style={{ backgroundColor: '#2C4A5E' }}>
                                                    <span className="card-title card-title-style">
                                                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.device}
                                                    </span>
                                                </p>
                                            )}
                                        </div>
                                        <p className="card-text card-content-style">
                                            {record.energy_consumption.now.toLocaleString(undefined, {
                                                maximumFractionDigits: 2,
                                            })}
                                            <span className="card-unit-style">&nbsp;&nbsp;kWh&nbsp;&nbsp;&nbsp;</span>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Row>
            )}

            {isEndUsesChartLoading ? (
                <Row>
                    <Col xl={12}>
                        <div className="loader-center-style" style={{ height: '400px' }}>
                            <Spinner className="m-2" color={'primary'} />
                        </div>
                    </Col>
                </Row>
            ) : (
                <Row>
                    <Col xl={12}>
                        <StackedBarChart options={barChartOptions} series={barChartData} height={400} />
                    </Col>
                </Row>
            )}

            <Row style={{ marginLeft: '0.5px' }}>
                <div className="card-body">
                    <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                        Top End Uses by Usage
                    </h6>
                    <h6 className="card-subtitle mb-2 custom-subtitle-style">
                        Click explore to see more energy usage details.
                    </h6>

                    {isEndUsesDataFetched ? (
                        <Row className="mt-4 energy-container-loader ml-1">
                            <Skeleton count={3} color="#f9fafb" height={100} />
                        </Row>
                    ) : (
                        <Row className="mt-4 energy-container">
                            {endUsesData.slice(0, 3).map((usage, index) => {
                                return (
                                    <div className="usage-card">
                                        <EnergyUsageCard
                                            bldgId={bldgId}
                                            usage={usage}
                                            button="View"
                                            lastPeriodPerTotalHrs={percentageHandler(
                                                usage.energy_consumption.now,
                                                usage.energy_consumption.old
                                            )}
                                            lastPeriodPerTotalHrsNormal={
                                                usage.energy_consumption.now >= usage.energy_consumption.old
                                            }
                                            lastYearPerTotalHrs={percentageHandler(
                                                usage.energy_consumption.now,
                                                usage.energy_consumption.yearly
                                            )}
                                            lastYearPerTotalHrsNormal={
                                                usage.energy_consumption.now >= usage.energy_consumption.yearly
                                            }
                                            lastPeriodPerAfterHrs={percentageHandler(
                                                usage.after_hours_energy_consumption.now,
                                                usage.after_hours_energy_consumption.old
                                            )}
                                            lastPeriodPerAfterHrsNormal={
                                                usage.after_hours_energy_consumption.now >=
                                                usage.after_hours_energy_consumption.old
                                            }
                                            lastYearPerAfterHrs={percentageHandler(
                                                usage.after_hours_energy_consumption.now,
                                                usage.after_hours_energy_consumption.yearly
                                            )}
                                            lastYearPerAfterHrsNormal={
                                                usage.after_hours_energy_consumption.now >=
                                                usage.after_hours_energy_consumption.yearly
                                            }
                                        />
                                    </div>
                                );
                            })}
                        </Row>
                    )}
                </div>
            </Row>
        </React.Fragment>
    );
};

export default EndUses;
