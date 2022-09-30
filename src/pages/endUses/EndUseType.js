import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import { Row, Col } from 'reactstrap';
import Header from '../../components/Header';
import UsageBarChart from './UsageBarChart';
import HvacUsesCard from './HvacUsesCard';
import LineColumnChart from '../charts/LineColumnChart';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import axios from 'axios';
import { BaseUrl, endUses, endUsesEquipmentUsage, endUsesUsageChart } from '../../services/Network';
import { percentageHandler } from '../../utils/helper';
import { useParams } from 'react-router-dom';
import { DateRangeStore } from '../../store/DateRangeStore';
import { Cookies } from 'react-cookie';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import Skeleton from 'react-loading-skeleton';
import { Spinner } from 'reactstrap';
import { formatConsumptionValue } from '../../helpers/helpers';
import './style.css';

const EndUseType = () => {
    const { endUseType } = useParams();

    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));

    const [equipTypeChartOptions, setEquipTypeChartOptions] = useState({
        chart: {
            height: 380,
            type: 'bar',
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: {
                    position: 'top',
                },
            },
        },
        tooltip: {
            theme: 'dark',
            x: { show: false },
        },
        dataLabels: {
            enabled: false,
            offsetX: -6,
            style: {
                fontSize: '12px',
                colors: ['#fff'],
            },
        },
        colors: ['#6d669b'],
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff'],
        },

        xaxis: {
            categories: ['EquipType 1', 'EquipType 2', 'EquipType 3', 'EquipType 4', 'EquipType 5'],
            axisBorder: {
                color: '#d6ddea',
            },
            axisTicks: {
                color: '#d6ddea',
            },
        },
        yaxis: {
            labels: {
                offsetX: -10,
            },
        },
        legend: {
            offsetY: -10,
        },
        states: {
            hover: {
                filter: 'none',
            },
        },
        grid: {
            borderColor: '#f1f3fa',
        },
    });

    const [equipTypeChartData, setEquipTypeChartData] = useState([
        {
            name: 'Usage by Floor',
            data: [],
        },
    ]);

    const [energyChartOptions, setEnergyChartOptions] = useState({
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true,
            },
            zoom: {
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
                        <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="line-chart-widget-tooltip-value">${series[seriesIndex][dataPointIndex]} kWh</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment(timestamp)
                            .tz(timeZone)
                            .format(`MMM D 'YY @ hh:mm A`)}</div>
                    </div>`;
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
            style: {
                colors: ['#1D2939'],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
    });

    const [energyChartData, setEnergyChartData] = useState([]);
    const [endUseName, setEndUseName] = useState('');

    const [isEndUsesDataFetched, setIsEndUsesDataFetched] = useState(false);
    const [isPlugLoadChartLoading, setIsPlugLoadChartLoading] = useState(false);
    const [isEquipTypeChartLoading, setIsEquipTypeChartLoading] = useState(false);

    const [endUsesData, setEndUsesData] = useState({});

    const [hvacUsageData, setHvacUsageData] = useState([]);

    const fetchEndUseType = (end_uses_type) => {
        if (end_uses_type === 'hvac') {
            return 'HVAC';
        }

        if (end_uses_type === 'lighting') {
            return 'Lighting';
        }

        if (end_uses_type === 'plug') {
            return 'Plug';
        }

        if (end_uses_type === 'process') {
            return 'Process';
        }

        if (end_uses_type === 'other') {
            return 'Other';
        }
    };

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'End Uses',
                        path: `/energy/end-uses/${localStorage.getItem('buildingId')}`,
                        active: false,
                    },
                    {
                        label: endUseName,
                        path: '/energy/end-uses',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'buildings';
            });
            setEnergyChartOptions({
                ...energyChartOptions,
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
                    y: {
                        formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                            return value + ' K';
                        },
                    },
                    marker: {
                        show: false,
                    },
                    custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                        const { labels } = w.globals;
                        const timestamp = labels[dataPointIndex];

                        return `<div class="line-chart-widget-tooltip">
                            <h6 class="line-chart-widget-tooltip-title">${endUseName} Consumption</h6>
                            <div class="line-chart-widget-tooltip-value">${formatConsumptionValue(
                                series[seriesIndex][dataPointIndex],
                                0
                            )} kWh</div>
                            <div class="line-chart-widget-tooltip-time-period">${moment(timestamp)
                                .tz(timeZone)
                                .format(`MMM D 'YY @ hh:mm A`)}</div>
                        </div>`;
                    },
                },
            });
        };
        updateBreadcrumbStore();
    }, [endUseName]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (endUseType === 'hvac') {
            setEndUseName('HVAC');
        }

        if (endUseType === 'lighting') {
            setEndUseName('Lighting');
        }

        if (endUseType === 'plug') {
            setEndUseName('Plug');
        }

        if (endUseType === 'process') {
            setEndUseName('Process');
        }

        if (endUseType === 'other') {
            setEndUseName('Other');
        }
    }, [endUseType]);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }

        let endUseTypeRequest = fetchEndUseType(endUseType);

        const endUsesDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                setIsEndUsesDataFetched(true);
                let params = `?building_id=${bldgId}&end_uses_type=${endUseTypeRequest}`;
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
                        let requestEndUseType = fetchEndUseType(endUseType);
                        let data = response.find((element) => element.device === requestEndUseType);
                        setEndUsesData(data);
                        setIsEndUsesDataFetched(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch EndUses Data');
                setIsEndUsesDataFetched(false);
            }
        };

        const equipmentUsageDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                setIsEquipTypeChartLoading(true);
                let params = `?building_id=${bldgId}&end_uses_type=${endUseTypeRequest}`;
                await axios
                    .post(
                        `${BaseUrl}${endUsesEquipmentUsage}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let data = res.data;
                        let equipTypeName = [];
                        let equipTypeUsage = [];

                        data.map((record, index) => {
                            equipTypeName.push(record.name);
                            equipTypeUsage.push((record.consumption.now / 1000).toFixed(2));
                        });

                        let equipTypeConsumption = [
                            {
                                name: 'Usage by Equipment Type',
                                data: equipTypeUsage,
                            },
                        ];

                        let xaxisData = {
                            categories: equipTypeName,
                            axisBorder: {
                                color: '#d6ddea',
                            },
                            axisTicks: {
                                color: '#d6ddea',
                            },
                        };

                        setEquipTypeChartOptions({ ...equipTypeChartOptions, xaxis: xaxisData });
                        setEquipTypeChartData(equipTypeConsumption);
                        setHvacUsageData(data);
                        setIsEquipTypeChartLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch EndUses Floor Data');
                setIsEquipTypeChartLoading(false);
            }
        };

        const plugUsageDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                setIsPlugLoadChartLoading(true);
                let params = `?building_id=${bldgId}&end_uses_type=${endUseTypeRequest}`;
                await axios
                    .post(
                        `${BaseUrl}${endUsesUsageChart}${params}`,
                        {
                            date_from: startDate.toLocaleDateString(),
                            date_to: endDate.toLocaleDateString(),
                            tz_info: timeZone,
                        },
                        { headers }
                    )
                    .then((res) => {
                        let data = res.data;
                        let energyData = [
                            {
                                name: 'CONSUMPTION',
                                data: [],
                            },
                        ];
                        data.map((record) => {
                            let obj = {
                                x: record.date,
                                y: parseInt(record.energy_consumption / 1000),
                            };
                            energyData[0].data.push(obj);
                        });
                        setEnergyChartData(energyData);
                        setIsPlugLoadChartLoading(false);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch EndUses Usage Data');
                setIsPlugLoadChartLoading(false);
            }
        };

        endUsesDataFetch();
        equipmentUsageDataFetch();
        plugUsageDataFetch();
    }, [startDate, endDate, endUseType, bldgId]);

    return (
        <React.Fragment>
            {endUseType === 'hvac' && <Header title="HVAC" />}
            {endUseType === 'lighting' && <Header title="Lighting" />}
            {endUseType === 'plug' && <Header title="Plug Load" />}
            {endUseType === 'process' && <Header title="Process" />}
            {endUseType === 'other' && <Header title="Other EndUses" />}

            {isEndUsesDataFetched ? (
                <Row className="ml-3">
                    <Skeleton count={1} color="#f9fafb" height={150} width={1100} />
                </Row>
            ) : (
                <Row className="ml-3">
                    <div className="endUses-button-container mt-2">
                        <div className="usage-card-box-style enduses-button-style">
                            <div className="card-body">
                                <p className="subtitle-style" style={{ margin: '2px' }}>
                                    Total Consumption
                                </p>
                                <p className="card-text usage-card-content-style">
                                    {endUsesData?.energy_consumption?.now === 0
                                        ? 0
                                        : (endUsesData?.energy_consumption?.now / 1000).toLocaleString(undefined, {
                                              maximumFractionDigits: 0,
                                          })}
                                    <span className="card-unit-style">&nbsp;kWh</span>
                                </p>
                                {endUsesData?.energy_consumption?.now >= endUsesData?.energy_consumption?.old ? (
                                    <button
                                        className="button-danger text-danger btn-font-style"
                                        style={{ width: 'auto', marginBottom: '4px' }}>
                                        <i className="uil uil-arrow-growth">
                                            <strong>
                                                {percentageHandler(
                                                    endUsesData?.energy_consumption?.now,
                                                    endUsesData?.energy_consumption?.old
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
                                                    endUsesData?.energy_consumption?.now,
                                                    endUsesData?.energy_consumption?.old
                                                )}
                                                %
                                            </strong>
                                        </i>
                                    </button>
                                )}
                                &nbsp;&nbsp;
                                <span className="light-content-style">since last period</span>
                                <br />
                                {endUsesData?.energy_consumption?.now >= endUsesData?.energy_consumption?.yearly ? (
                                    <button
                                        className="button-danger text-danger btn-font-style"
                                        style={{ width: 'auto', marginBottom: '4px' }}>
                                        <i className="uil uil-arrow-growth">
                                            <strong>
                                                {percentageHandler(
                                                    endUsesData?.energy_consumption?.now,
                                                    endUsesData?.energy_consumption?.yearly
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
                                                    endUsesData?.energy_consumption?.now,
                                                    endUsesData?.energy_consumption?.yearly
                                                )}
                                                %
                                            </strong>
                                        </i>
                                    </button>
                                )}
                                &nbsp;&nbsp;
                                <span className="light-content-style">from same period last year</span>
                            </div>
                        </div>

                        <div className="usage-card-box-style enduses-button-style">
                            <div className="card-body">
                                <p className="subtitle-style" style={{ margin: '2px' }}>
                                    After-Hours Consumption
                                </p>
                                <p className="card-text usage-card-content-style">
                                    {endUsesData?.after_hours_energy_consumption?.now === 0
                                        ? 0
                                        : (endUsesData?.after_hours_energy_consumption?.now / 1000).toLocaleString(
                                              undefined,
                                              {
                                                  maximumFractionDigits: 0,
                                              }
                                          )}
                                    <span className="card-unit-style">&nbsp;kWh</span>
                                </p>
                                {endUsesData?.after_hours_energy_consumption?.now >=
                                endUsesData?.after_hours_energy_consumption?.old ? (
                                    <button
                                        className="button-danger text-danger btn-font-style"
                                        style={{ width: 'auto', marginBottom: '4px' }}>
                                        <i className="uil uil-arrow-growth">
                                            <strong>
                                                {percentageHandler(
                                                    endUsesData?.after_hours_energy_consumption?.now,
                                                    endUsesData?.after_hours_energy_consumption?.old
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
                                                    endUsesData?.after_hours_energy_consumption?.now,
                                                    endUsesData?.after_hours_energy_consumption?.old
                                                )}
                                                %
                                            </strong>
                                        </i>
                                    </button>
                                )}
                                &nbsp;&nbsp;
                                <span className="light-content-style">since last period</span>
                                <br />
                                {endUsesData?.after_hours_energy_consumption?.now >=
                                endUsesData?.after_hours_energy_consumption?.yearly ? (
                                    <button
                                        className="button-danger text-danger btn-font-style"
                                        style={{ width: 'auto', marginBottom: '4px' }}>
                                        <i className="uil uil-arrow-growth">
                                            <strong>
                                                {percentageHandler(
                                                    endUsesData?.after_hours_energy_consumption?.now,
                                                    endUsesData?.after_hours_energy_consumption?.yearly
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
                                                    endUsesData?.after_hours_energy_consumption?.now,
                                                    endUsesData?.after_hours_energy_consumption?.yearly
                                                )}
                                                %
                                            </strong>
                                        </i>
                                    </button>
                                )}
                                &nbsp;&nbsp;
                                <span className="light-content-style">from same period last year</span>
                            </div>
                        </div>
                    </div>
                </Row>
            )}

            {endUseType === 'hvac' ? (
                <Row>
                    <Col xl={12} className="mt-5 ml-3">
                        <div className="plug-content-style">
                            <h6 className="card-title custom-title">HVAC Consumption</h6>

                            <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Usage By Hour (kWh)</h6>
                            {isPlugLoadChartLoading ? (
                                <div className="loader-center-style" style={{ height: '400px' }}>
                                    <Spinner className="m-2" color={'primary'} />
                                </div>
                            ) : (
                                <LineColumnChart series={energyChartData} options={energyChartOptions} />
                            )}
                        </div>
                    </Col>
                </Row>
            ) : (
                <Row>
                    <Col xl={6} className="mt-5 ml-3">
                        <div className="plug-content-style">
                            {endUseType === 'lighting' && (
                                <h6 className="card-title custom-title">Lighting Consumption</h6>
                            )}
                            {endUseType === 'plug' && (
                                <h6 className="card-title custom-title">Plug Load Consumption</h6>
                            )}
                            {endUseType === 'process' && (
                                <h6 className="card-title custom-title">Process Consumption</h6>
                            )}
                            {endUseType === 'other' && (
                                <h6 className="card-title custom-title">Other EndUses Consumption</h6>
                            )}
                            <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Usage By Hour Trend</h6>
                            {isPlugLoadChartLoading ? (
                                <div className="loader-center-style" style={{ height: '400px' }}>
                                    <Spinner className="m-2" color={'primary'} />
                                </div>
                            ) : (
                                <LineColumnChart series={energyChartData} options={energyChartOptions} />
                            )}
                        </div>
                    </Col>

                    <Col xl={5} className="mt-5 ml-3">
                        <div className="plug-content-style">
                            <h6 className="card-title custom-title">Usage by Equipment Type</h6>

                            <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Consumption</h6>
                            {isEquipTypeChartLoading ? (
                                <div className="loader-center-style" style={{ height: '400px' }}>
                                    <Spinner className="m-2" color={'primary'} />
                                </div>
                            ) : (
                                <UsageBarChart
                                    equipTypeChartOptions={equipTypeChartOptions}
                                    equipTypeChartData={equipTypeChartData}
                                />
                            )}
                        </div>
                    </Col>
                </Row>
            )}

            {endUseType === 'hvac' && (
                <>
                    {isEquipTypeChartLoading ? (
                        <Row className="mt-4 energy-container-loader ml-1">
                            <Skeleton count={3} color="#f9fafb" height={100} />
                        </Row>
                    ) : (
                        <>
                            {hvacUsageData.length !== 0 && (
                                <Row>
                                    <div className="card-body mt-5 ml-2">
                                        <h6 className="custom-title" style={{ display: 'inline-block' }}>
                                            Top Systems by Usage
                                        </h6>
                                        <h6 className="custom-subtitle-style">
                                            Click explore to see more energy usage details.
                                        </h6>

                                        <Row className="mt-4 energy-container">
                                            {hvacUsageData.map((usage, index) => {
                                                return (
                                                    <div className="usage-card">
                                                        <HvacUsesCard
                                                            usage={usage}
                                                            lastPeriodPerTotalHrs={percentageHandler(
                                                                usage?.consumption?.now,
                                                                usage?.consumption?.old
                                                            )}
                                                            lastPeriodPerTotalHrsNormal={
                                                                usage?.consumption?.now >= usage?.consumption?.old
                                                            }
                                                            lastYearPerTotalHrs={percentageHandler(
                                                                usage?.consumption?.now,
                                                                usage?.consumption?.yearly
                                                            )}
                                                            lastYearPerTotalHrsNormal={
                                                                usage?.consumption?.now >= usage?.consumption?.yearly
                                                            }
                                                            lastPeriodPerAfterHrs={percentageHandler(
                                                                usage?.after_hours_consumption?.now,
                                                                usage?.after_hours_consumption?.old
                                                            )}
                                                            lastPeriodPerAfterHrsNormal={
                                                                usage?.after_hours_consumption?.now >=
                                                                usage?.after_hours_consumption?.old
                                                            }
                                                            lastYearPerAfterHrs={percentageHandler(
                                                                usage?.after_hours_consumption?.now,
                                                                usage?.after_hours_consumption?.yearly
                                                            )}
                                                            lastYearPerAfterHrsNormal={
                                                                usage?.after_hours_consumption?.now >=
                                                                usage?.after_hours_consumption?.yearly
                                                            }
                                                        />
                                                    </div>
                                                );
                                            })}
                                        </Row>
                                    </div>
                                </Row>
                            )}
                        </>
                    )}
                </>
            )}
        </React.Fragment>
    );
};

export default EndUseType;
