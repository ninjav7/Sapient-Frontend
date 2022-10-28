import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import 'moment-timezone';
import { Row, Col } from 'reactstrap';
import Header from '../../components/Header';
import { BaseUrl, endUses, endUsesChart } from '../../services/Network';
import StackedBarChart from '../charts/StackedBarChart';
import EndUsesCard from './EndUsesCard';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { percentageHandler } from '../../utils/helper';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import { Spinner } from 'reactstrap';
import Skeleton from 'react-loading-skeleton';
import { formatConsumptionValue, xaxisFilters } from '../../helpers/helpers';
import './style.css';

const EndUsesPage = () => {
    const cookies = new Cookies();
    const userdata = cookies.get('user');

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const [isEndUsesChartLoading, setIsEndUsesChartLoading] = useState(false);
    const [isEndUsesDataFetched, setIsEndUsesDataFetched] = useState(false);

    const [barChartOptions, setBarChartOptions] = useState({
        chart: {
            type: 'bar',
            height: 400,
            stacked: true,
            toolbar: {
                show: true,
            },
            animations: {
                enabled: false,
            },
            zoom: {
                enabled: false,
            },
        },
        colors: ['#66A4CE', '#FBE384', '#59BAA4', '#80E1D9', '#847CB5'],
        fill: {
            opacity: 1,
            colors: ['#66A4CE', '#FBE384', '#59BAA4', '#80E1D9', '#847CB5'],
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
            // custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            //     const { seriesX } = w.globals;
            //     const timestamp = new Date(seriesX[seriesIndex][dataPointIndex]);

            //     return `<div class="line-chart-widget-tooltip">
            //             <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
            //             <div class="line-chart-widget-tooltip-value">${formatConsumptionValue(
            //                 series[seriesIndex][dataPointIndex],
            //                 0
            //             )} kWh</div>
            //             <div class="line-chart-widget-tooltip-time-period">${moment(timestamp)
            //                 .tz(timeZone)
            //                 .format(`MMM D 'YY @ hh:mm A`)}</div>
            //         </div>`;
            // },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const { colors } = w.globals;
                const { seriesX } = w.globals;
                const { seriesNames } = w.globals;
                const timestamp = new Date(seriesX[seriesIndex][dataPointIndex]);
                let ch = '';
                ch =
                    ch +
                    `<div class="line-chart-widget-tooltip-time-period" style="margin-bottom:10px;">${moment(
                        seriesX[0][dataPointIndex]
                    )
                        .tz(timeZone)
                        .format(`MMM D 'YY @ hh:mm A`)}</div><table style="border:none;">`;
                for (let i = 0; i < series.length; i++) {
                    ch =
                        ch +
                        `<tr style="style="border:none;"><td><span class="tooltipclass" style="background-color:${
                            colors[i]
                        };"></span> &nbsp;${seriesNames[i]} </td><td> &nbsp;${series[i][dataPointIndex].toFixed(
                            0
                        )} kWh </td></tr>`;
                }

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title" style="font-weight:bold;">Energy Consumption</h6>
                        ${ch}
                    </table></div>`;
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    let dateText = moment(timestamp).tz(timeZone).format('M/DD');
                    let weekText = moment(timestamp).tz(timeZone).format('ddd');
                    return `${weekText} ${dateText}`;
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
                    width: 1,
                    dashArray: 0,
                },
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
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let response = res.data;
                        let data = [];
                        response.forEach((record, index) => {
                            if (index === 0) {
                                record.color = '#66A4CE';
                            }
                            if (index === 1) {
                                record.color = '#FBE384';
                            }
                            if (index === 2) {
                                record.color = '#59BAA4';
                            }
                            if (index === 3) {
                                record.color = '#80E1D9';
                            }
                            if (index === 4) {
                                record.color = '#847CB5';
                            }
                            data.push(record);
                        });
                        setEndUsesData(data);
                        setIsEndUsesDataFetched(false);
                    });
            } catch (error) {
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

                setIsEndUsesChartLoading(true);

                // let filter = '';
                // let days = fetchDiffDaysCount(startDate, endDate);
                // if (days <= 31) {
                //     filter = 'hour';
                // }
                // if (days > 31 && days <= 365) {
                //     filter = 'day';
                // }
                // if (days > 365) {
                //     filter = 'month';
                // }

                let params = `?building_id=${bldgId}`;

                await axios
                    .post(
                        `${BaseUrl}${endUsesChart}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let responseData = res?.data;
                        responseData.forEach((endUse) => {
                            endUse.data.forEach((record) => {
                                record.y = parseInt(record.y / 1000);
                            });
                        });
                        setBarChartData(responseData);
                        setIsEndUsesChartLoading(false);
                    });
            } catch (error) {
                setIsEndUsesChartLoading(false);
            }
        };

        endUsesDataFetch();
        endUsesChartDataFetch();
    }, [startDate, endDate, bldgId]);

    useEffect(() => {
        let xaxisObj = xaxisFilters(daysCount, timeZone);
        setBarChartOptions({ ...barChartOptions, xaxis: xaxisObj });
    }, [daysCount]);

    return (
        <React.Fragment>
            <Header title="End Uses" type="page" />

            {isEndUsesDataFetched ? (
                <Row className="ml-4">
                    <Skeleton count={1} color="#f9fafb" height={120} width={650} />
                </Row>
            ) : (
                <Row className="ml-4">
                    <div className="card-group button-style mt-1 mb-0">
                        {endUsesData?.map((record, index) => {
                            return (
                                <div className="card usage-card-box-style button-style">
                                    <div className="card-body">
                                        <div className="enduses-content-1">
                                            <p className="dot" style={{ backgroundColor: record?.color }}></p>
                                            <span className="card-title card-title-style">{record?.device}</span>
                                        </div>
                                        <div className="enduses-content-2">
                                            <span className="card-text card-content-style">
                                                {(record?.energy_consumption?.now / 1000).toLocaleString(undefined, {
                                                    maximumFractionDigits: 0,
                                                })}
                                            </span>
                                            <span className="card-unit-style">kWh</span>
                                        </div>
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
                <Row className="ml-2 mt-4">
                    <Col xl={12}>
                        <StackedBarChart options={barChartOptions} series={barChartData} height={400} />
                    </Col>
                </Row>
            )}

            <Row style={{ marginLeft: '0.5px' , marginRight:"0px", marginleft:'0px'}}>
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
                            {endUsesData?.slice(0, 5).map((usage, index) => {
                                return (
                                    <div className="usage-card">
                                        <EndUsesCard
                                            bldgId={bldgId}
                                            usage={usage}
                                            lastPeriodPerTotalHrs={percentageHandler(
                                                usage?.energy_consumption?.now,
                                                usage?.energy_consumption?.old
                                            )}
                                            lastPeriodPerTotalHrsNormal={
                                                usage?.energy_consumption?.now >= usage?.energy_consumption?.old
                                            }
                                            lastYearPerTotalHrs={percentageHandler(
                                                usage?.energy_consumption?.now,
                                                usage?.energy_consumption?.yearly
                                            )}
                                            lastYearPerTotalHrsNormal={
                                                usage?.energy_consumption?.now >= usage?.energy_consumption?.yearly
                                            }
                                            lastPeriodPerAfterHrs={percentageHandler(
                                                usage?.after_hours_energy_consumption?.now,
                                                usage?.after_hours_energy_consumption?.old
                                            )}
                                            lastPeriodPerAfterHrsNormal={
                                                usage?.after_hours_energy_consumption?.now >=
                                                usage?.after_hours_energy_consumption?.old
                                            }
                                            lastYearPerAfterHrs={percentageHandler(
                                                usage?.after_hours_energy_consumption?.now,
                                                usage?.after_hours_energy_consumption?.yearly
                                            )}
                                            lastYearPerAfterHrsNormal={
                                                usage?.after_hours_energy_consumption?.now >=
                                                usage?.after_hours_energy_consumption?.yearly
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

export default EndUsesPage;
