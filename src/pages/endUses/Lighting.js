import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Table } from 'reactstrap';
import Header from '../../components/Header';
import UsageBarChart from './UsageBarChart';
import MixedChart from '../charts/MixedChart';
import LineColumnChart from '../charts/LineColumnChart';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import axios from 'axios';
import { BaseUrl, endUses, endUsesFloorChart, endUsesUsageChart } from '../../services/Network';
import { percentageHandler, dateFormatHandler } from '../../utils/helper';
import { useParams } from 'react-router-dom';
import { DateRangeStore } from '../../store/DateRangeStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import './style.css';

const UsagePageTwo = ({ title = 'Lighting' }) => {
    const { bldgId } = useParams();

    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const [endUsesData, setEndUsesData] = useState([]);

    const [floorUsageChartOptions, setFloorUsageChartOptions] = useState({
        chart: {
            height: 380,
            type: 'bar',
            toolbar: {
                show: true,
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
        // colors: ['#847CB5'],
        colors: ['#6d669b'],
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff'],
        },

        xaxis: {
            categories: ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Floor 5'],
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

    const [floorUsageChartData, setFloorUsageChartData] = useState([
        {
            name: 'Usage by Floor',
            data: [],
        },
    ]);

    const [energyChartOptions, setEnergyChartOptions] = useState({
        options: {
            chart: {
                height: 350,
                type: 'line',
                toolbar: {
                    show: true,
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
            labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001'],
            xaxis: {
                type: 'datetime',
            },
            yaxis: [
                {
                    title: {
                        text: 'Consumption',
                    },
                },
                {
                    opposite: true,
                    title: {
                        text: 'Occupancy',
                    },
                },
            ],
        },
    });

    const [energyChartData, setEnergyChartData] = useState([
        {
            name: 'CONSUMPTION',
            type: 'column',
            data: [],
        },
        {
            name: 'OCCUPANCY',
            type: 'line',
            data: [],
        },
    ]);

    const [endUsage, seteEndUsage] = useState([
        {
            title: 'AHUs',
            totalConsumption: 3365,
            afterHourConsumption: 232,
            val1: { value: 61, type: 'up' },
            val2: { value: 6, type: 'down' },
            val3: { value: 31, type: 'normal' },
            val4: { value: 2, type: 'up' },
        },
        {
            title: 'Chillers',
            totalConsumption: 2353,
            afterHourConsumption: 205,
            val1: { value: 32, type: 'increased' },
            val2: { value: 4, type: 'decreased' },
            val3: { value: 41, type: 'decreased' },
            val4: { value: 12, type: 'increased' },
        },
        {
            title: 'CRACs',
            totalConsumption: 1365,
            afterHourConsumption: 102,
            val1: { value: 6, type: 'increased' },
            val2: { value: 6, type: 'increased' },
            val3: { value: 3, type: 'decreased' },
            val4: { value: 2, type: 'decreased' },
        },
    ]);

    const [usage, seUsage] = useState({
        title: 'HVAC',
        totalConsumption: 7246,
        afterHourConsumption: 4288,
        lightningUtilization: 33,
        lightningDensity: 1.5,
        val1: { value: 61, type: 'up' },
        val2: { value: 6, type: 'down' },
        val3: { value: 31, type: 'normal' },
        val4: { value: 2, type: 'up' },
        val5: { value: 23, type: 'up' },
        val6: { value: 7, type: 'normal' },
    });

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
                        label: 'Lightning',
                        path: '/energy/end-uses/lighting',
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
        window.scrollTo(0, 0);
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
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}&end_uses_type=Lighting`;
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
                        setEndUsesData(res.data);
                        // console.log('Lighting setEndUsesData => ', res.data);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch EndUses Data');
            }
        };

        const endUsesFloorDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}&end_uses_type=lighting`;
                await axios
                    .post(
                        `${BaseUrl}${endUsesFloorChart}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        let data = res.data;
                        let floorName = [];
                        let floorConsumption = [];
                        data.map((record, index) => {
                            floorName.push(record.floor);
                            floorConsumption.push(parseInt(record.energy_consumption.toFixed(2)));
                        });
                        let floorConsumptionData = [
                            {
                                name: 'Usage by Floor',
                                data: floorConsumption,
                            },
                        ];

                        let xaxisData = {
                            categories: floorName,
                            axisBorder: {
                                color: '#d6ddea',
                            },
                            axisTicks: {
                                color: '#d6ddea',
                            },
                        };
                        setFloorUsageChartOptions({ ...floorUsageChartOptions, xaxis: xaxisData });
                        setFloorUsageChartData(floorConsumptionData);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch EndUses Floor Data');
            }
        };

        const endUsesUsageDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    // 'user-auth': '628f3144b712934f578be895',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?building_id=${bldgId}&end_uses_type=lighting`;
                await axios
                    .post(
                        `${BaseUrl}${endUsesUsageChart}${params}`,
                        {
                            date_from: dateFormatHandler(startDate),
                            date_to: dateFormatHandler(endDate),
                        },
                        { headers }
                    )
                    .then((res) => {
                        // console.log('endUsesUsageChart => ', res.data);
                        let data = res.data;
                        let energyUsage = [
                            {
                                name: 'CONSUMPTION',
                                type: 'column',
                                data: [],
                            },
                            {
                                name: 'OCCUPANCY',
                                type: 'line',
                                data: [],
                            },
                        ];
                        data.map((record) => {
                            energyUsage[0].data.push(record.energy_consumption);
                        });
                        setEnergyChartData(energyUsage);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch EndUses Usage Data');
            }
        };

        endUsesDataFetch();
        endUsesFloorDataFetch();
        endUsesUsageDataFetch();
    }, [startDate, endDate, bldgId]);

    return (
        <React.Fragment>
            <Header title={title} />

            <Row>
                {endUsesData.length === 0 && (
                    <div className="endUses-button-container mt-2" style={{ marginLeft: '29px' }}>
                        <div className="usage-card-box-style enduses-button-style">
                            <div className="card-body">
                                <p className="subtitle-style" style={{ margin: '2px' }}>
                                    Total Consumption
                                </p>
                                <p className="card-text usage-card-content-style">
                                    0 <span className="card-unit-style">&nbsp;kWh</span>
                                </p>
                                <button
                                    className="button-success text-success btn-font-style"
                                    style={{ width: 'auto', marginBottom: '4px' }}>
                                    <i className="uil uil-chart-down">
                                        <strong>0 %</strong>
                                    </i>
                                </button>
                                &nbsp;&nbsp;
                                <span className="light-content-style">since last period</span>
                                <br />
                                <button
                                    className="button-success text-success btn-font-style"
                                    style={{ width: 'auto' }}>
                                    <i className="uil uil-chart-down">
                                        <strong>0 %</strong>
                                    </i>
                                </button>
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
                                    0<span className="card-unit-style">&nbsp;kWh</span>
                                </p>
                                <button
                                    className="button-success text-success btn-font-style"
                                    style={{ width: 'auto', marginBottom: '4px' }}>
                                    <i className="uil uil-chart-down">
                                        <strong>0 %</strong>
                                    </i>
                                </button>
                                &nbsp;&nbsp;
                                <span className="light-content-style">since last period</span>
                                <br />
                                <button
                                    className="button-success text-success btn-font-style"
                                    style={{ width: 'auto' }}>
                                    <i className="uil uil-chart-down">
                                        <strong>0 %</strong>
                                    </i>
                                </button>
                                &nbsp;&nbsp;
                                <span className="light-content-style">from same period last year</span>
                            </div>
                        </div>
                    </div>
                )}

                {endUsesData.length !== 0 &&
                    endUsesData.map((record, index) => {
                        return (
                            <div className="endUses-button-container mt-2" style={{ marginLeft: '29px' }}>
                                <div className="usage-card-box-style enduses-button-style">
                                    <div className="card-body">
                                        <p className="subtitle-style" style={{ margin: '2px' }}>
                                            Total Consumption
                                        </p>
                                        <p className="card-text usage-card-content-style">
                                            {record.energy_consumption.now.toLocaleString(undefined, {
                                                maximumFractionDigits: 2,
                                            })}
                                            <span className="card-unit-style">&nbsp;kWh</span>
                                        </p>
                                        {record.energy_consumption.now >= record.energy_consumption.old ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.old
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
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.old
                                                        )}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                        &nbsp;&nbsp;
                                        <span className="light-content-style">since last period</span>
                                        <br />
                                        {record.energy_consumption.now >= record.energy_consumption.yearly ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.yearly
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
                                                            record.energy_consumption.now,
                                                            record.energy_consumption.yearly
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
                                            {(record.after_hours_energy_consumption.now / 1000).toLocaleString(
                                                undefined,
                                                {
                                                    maximumFractionDigits: 2,
                                                }
                                            )}
                                            <span className="card-unit-style">&nbsp;kWh</span>
                                        </p>
                                        {record.after_hours_energy_consumption.now >=
                                        record.after_hours_energy_consumption.old ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {record.after_hours_energy_consumption.now
                                                            ? percentageHandler(
                                                                  record.after_hours_energy_consumption.now / 1000,
                                                                  record.after_hours_energy_consumption.old / 1000
                                                              )
                                                            : 0}
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
                                                        {record.after_hours_energy_consumption.now
                                                            ? percentageHandler(
                                                                  record.after_hours_energy_consumption.now / 1000,
                                                                  record.after_hours_energy_consumption.old / 1000
                                                              )
                                                            : 0}
                                                        %
                                                    </strong>
                                                </i>
                                            </button>
                                        )}
                                        &nbsp;&nbsp;
                                        <span className="light-content-style">since last period</span>
                                        <br />
                                        {record.after_hours_energy_consumption.now >=
                                        record.after_hours_energy_consumption.yearly ? (
                                            <button
                                                className="button-danger text-danger btn-font-style"
                                                style={{ width: 'auto', marginBottom: '4px' }}>
                                                <i className="uil uil-arrow-growth">
                                                    <strong>
                                                        {percentageHandler(
                                                            record.after_hours_energy_consumption.now,
                                                            record.after_hours_energy_consumption.yearly
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
                                                            record.after_hours_energy_consumption.now,
                                                            record.after_hours_energy_consumption.yearly
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

                                {/* <div className="card usage-card-box-style button-style">
                                <div className="card-body">
                                    <p className="subtitle-style" style={{ margin: '2px', fontWeight: 'bold' }}>
                                        Lightning Utilization
                                    </p>
                                    <p className="card-text usage-card-content-style">{usage.lightningUtilization} %</p>
                                    <button
                                        className="button-danger text-danger btn-font-style"
                                        style={{ width: 'auto' }}>
                                        <i className="uil uil-arrow-growth">
                                            <strong>{usage.val3.value} %</strong>
                                        </i>
                                    </button>
                                    &nbsp;&nbsp;
                                    <span className="light-content-style">since last period</span>
                                    <br />
                                    <button
                                        className="button-danger text-danger btn-font-style"
                                        style={{ width: 'auto', marginTop: '3px' }}>
                                        <i className="uil uil-arrow-growth">
                                            <strong>{usage.val4.value} %</strong>
                                        </i>
                                    </button>
                                    &nbsp;&nbsp;
                                    <span className="light-content-style">from same period last year</span>
                                </div>
                            </div>

                            <div className="float-right">
                                <div className="card-body">
                                    <p className="subtitle-style" style={{ margin: '2px' }}>
                                        Installed Lighting Density
                                    </p>
                                    <p className="card-text usage-card-content-style density-content-style">
                                        {usage.lightningDensity}{' '}
                                        <span className="card-unit-style">&nbsp;Watts / Sq. Ft.</span>
                                    </p>
                                </div>
                            </div> */}
                            </div>
                        );
                    })}
            </Row>

            <Row>
                <Col xl={6} className="mt-5 ml-3">
                    <h6 className="card-title custom-title">Lighting Usage vs. Occupancy</h6>
                    <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Usage By Hour Trend</h6>
                    <LineColumnChart
                        title=""
                        energyChartData={energyChartData}
                        energyChartOptions={energyChartOptions}
                    />
                </Col>
                <Col xl={5} className="mt-5 ml-3">
                    <div className="usage-floor-styling">
                        <h6 className="card-title custom-title">Usage by Floor</h6>
                        <h6 className="card-subtitle mb-2 custom-subtitle-style">Energy Consumption</h6>
                        <div className="card-body">
                            <div>
                                <UsageBarChart
                                    floorUsageChartOptions={floorUsageChartOptions}
                                    floorUsageChartData={floorUsageChartData}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default UsagePageTwo;
