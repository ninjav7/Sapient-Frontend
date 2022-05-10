import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import Header from '../../components/Header';
import { BaseUrl, endUses, endUsesChart } from '../../services/Network';
import StackedBarChart from '../charts/StackedBarChart';
import EnergyUsageCard from './UsageCard';
import axios from 'axios';
import { BreadcrumbStore } from '../../components/BreadcrumbStore';
import { useParams } from 'react-router-dom';
import { percentageHandler, dateFormatHandler } from '../../utils/helper';
import { DateRangeStore } from '../../components/DateRangeStore';
import './style.css';

const EndUses = () => {
    const { bldgId } = useParams();
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const [endUsage, seteEndUsage] = useState([
        {
            title: 'HVAC',
            totalConsumption: 11441,
            afterHourConsumption: 2321,
            val1: { value: 61, type: 'up' },
            val2: { value: 6, type: 'down' },
            val3: { value: 31, type: 'normal' },
            val4: { value: 2, type: 'up' },
        },
        {
            title: 'Lighting',
            totalConsumption: 7247,
            afterHourConsumption: 2321,
            val1: { value: 32, type: 'increased' },
            val2: { value: 4, type: 'decreased' },
            val3: { value: 41, type: 'decreased' },
            val4: { value: 12, type: 'increased' },
        },
        {
            title: 'Plug',
            totalConsumption: 11441,
            afterHourConsumption: 2321,
            val1: { value: 6, type: 'increased' },
            val2: { value: 6, type: 'increased' },
            val3: { value: 3, type: 'decreased' },
            val4: { value: 2, type: 'decreased' },
        },
    ]);

    const [barChartOptions, setBarChartOptions] = useState({
        chart: {
            type: 'bar',
            stacked: true,
            toolbar: {
                show: false,
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
                        val = (val / 1000).toFixed(0) + ' kWh';
                    }
                    return val;
                },
            },
        },
        colors: ['#3094B9', '#66D6BC', '#2C4A5E', '#847CB5'],
        tooltip: {
            y: {
                formatter: function (val) {
                    return val + 'kWh';
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
        const endUsesDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
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
                        setEndUsesData(res.data);
                        console.log('setEndUsesData => ', res.data);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch EndUses Data');
            }
        };
        const endUsesChartDataFetch = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                };
                let params = `?building_id=${bldgId}`;
                await axios.post(`${BaseUrl}${endUsesChart}${params}`, { headers }).then((res) => {
                    let responseData = res.data;
                    console.log('EndUses Response Data => ', responseData);
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
                    responseData[0].data.map((element) => {
                        return newXaxis.categories.push(`Week ${element._id}`);
                    });
                    setBarChartOptions({ ...barChartOptions, xaxis: newXaxis });
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch EndUses Data');
            }
        };
        endUsesDataFetch();
        endUsesChartDataFetch();
    }, [startDate, endDate]);

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
        };
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Header title="End Uses" />
            <Row>
                <div className="card-group button-style mt-1 mb-0" style={{ marginLeft: '29px' }}>
                    {endUsesData.map((record, index) => {
                        return (
                            <div className="card usage-card-box-style button-style">
                                <div className="card-body">
                                    <div>
                                        {index === 0 && (
                                            <p className="dot" style={{ backgroundColor: '#3094B9' }}>
                                                <span className="card-title card-title-style">
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.device}
                                                </span>
                                            </p>
                                        )}
                                        {index === 1 && (
                                            <p className="dot" style={{ backgroundColor: '#66D6BC' }}>
                                                <span className="card-title card-title-style">
                                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{record.device}
                                                </span>
                                            </p>
                                        )}
                                        {index === 2 && (
                                            <p className="dot" style={{ backgroundColor: '#2C4A5E' }}>
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
            <Row>
                <Col xl={12}>
                    <StackedBarChart options={barChartOptions} series={barChartData} height={440} />
                </Col>
            </Row>

            <Row style={{ marginLeft: '0.5px' }}>
                <div className="card-body">
                    <h6 className="card-title custom-title" style={{ display: 'inline-block' }}>
                        Top End Uses by Usage
                    </h6>
                    <h6 className="card-subtitle mb-2 custom-subtitle-style">
                        Click explore to see more energy usage details.
                    </h6>

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
                </div>
            </Row>
        </React.Fragment>
    );
};

export default EndUses;
