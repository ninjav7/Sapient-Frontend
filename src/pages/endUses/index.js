import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Header from '../../components/Header';
import { fetchEndUsesChart, fetchEndUses } from '../endUses/services';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { percentageHandler } from '../../utils/helper';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import { apiRequestBody, xaxisFilters } from '../../helpers/helpers';
import './style.css';
import { TopEndUsesWidget } from '../../sharedComponents/topEndUsesWidget';
import { UNITS } from '../../constants/units';
import { useHistory } from 'react-router-dom';
import { formatConsumptionValue } from '../../sharedComponents/helpers/helper';
import { fetchTrendType } from './utils';
import EndUsesTypeWidget from '../../sharedComponents/endUsesTypeWidget';
import { COLOR_SCHEME_BY_DEVICE } from '../../constants/colors';

const EndUsesPage = () => {
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
    const [topEndUsesData, setTopEndUsesData] = useState([]);

    const history = useHistory();

    const redirectToEndUse = (endUseType) => {
        let endUse = endUseType.toLowerCase();
        history.push({
            pathname: `/energy/end-uses/${endUse}/${bldgId}`,
        });
    };

    useEffect(() => {
        if (endUsesData.length === 0) {
            return;
        }
        let categories = [];
        endUsesData.forEach((record) => {
            categories.push(record.color);
        });
        setBarChartOptions({ ...barChartOptions, colors: categories });
    }, [endUsesData]);

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
            setIsEndUsesDataFetched(true);
            let payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchEndUses(bldgId, payload)
                .then((res) => {
                    let response = res?.data;
                    response.sort((a, b) => b.energy_consumption.now - a.energy_consumption.now);
                    let endUsesList = [];
                    response.forEach((record, index) => {
                        let obj = {
                            title: record?.device,
                            viewHandler: () => {
                                redirectToEndUse(record?.device);
                            },
                            items: [
                                {
                                    title: 'Total Consumption',
                                    value: formatConsumptionValue(
                                        Math.round(record?.energy_consumption?.now / 1000),
                                        0
                                    ),
                                    unit: UNITS.KWH,
                                    trends: [
                                        {
                                            trendValue: percentageHandler(
                                                record?.energy_consumption?.now,
                                                record?.energy_consumption?.old
                                            ),
                                            trendType: fetchTrendType(
                                                record?.energy_consumption?.now,
                                                record?.energy_consumption?.old
                                            ),
                                            text: 'since last period',
                                        },
                                    ],
                                },
                                {
                                    title: 'After-Hours Consumption',
                                    value: formatConsumptionValue(
                                        Math.round(record?.after_hours_energy_consumption?.now / 1000),
                                        0
                                    ),
                                    unit: UNITS.KWH,
                                    trends: [
                                        {
                                            trendValue: percentageHandler(
                                                record?.after_hours_energy_consumption?.now,
                                                record?.after_hours_energy_consumption?.old
                                            ),
                                            trendType: fetchTrendType(
                                                record?.after_hours_energy_consumption?.now,
                                                record?.after_hours_energy_consumption?.old
                                            ),
                                            text: 'since last period',
                                        },
                                    ],
                                },
                            ],
                        };
                        endUsesList.push(obj);
                    });

                    let data = [];
                    response.forEach((record) => {
                        record.energy_consumption.now = formatConsumptionValue(
                            Math.round(record?.energy_consumption?.now / 1000),
                            0
                        );
                        record.color = COLOR_SCHEME_BY_DEVICE[record?.device];
                        data.push(record);
                    });
                    setEndUsesData(data);

                    setTopEndUsesData(endUsesList);
                    setIsEndUsesDataFetched(false);
                })
                .catch((error) => {
                    setIsEndUsesDataFetched(false);
                });
        };

        const endUsesChartDataFetch = async () => {
            setIsEndUsesChartLoading(true);
            let payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchEndUsesChart(bldgId, payload)
                .then((res) => {
                    let responseData = res?.data;

                    // Working loop with ApexChart
                    responseData.forEach((endUse) => {
                        endUse.data.forEach((record) => {
                            record.y = parseInt(record.y / 1000);
                        });
                    });

                    setBarChartData(responseData);
                    setIsEndUsesChartLoading(false);
                })
                .catch((error) => {
                    setIsEndUsesChartLoading(false);
                });
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

            <EndUsesTypeWidget
                endUsesData={endUsesData}
                barChartOptions={barChartOptions}
                barChartData={barChartData}
            />

            <div className="mt-4">
                <TopEndUsesWidget
                    title="Top Systems by Usage"
                    subtitle="Click explore to see more energy usage details."
                    data={topEndUsesData}
                />
            </div>
        </React.Fragment>
    );
};

export default EndUsesPage;
