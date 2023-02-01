import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { fetchBuilidingHourly, fetchAvgDailyUsageByHour, fetchBuildingAfterHours } from '../timeOfDay/services';
import EndUseTotals from './EndUseTotals';
import { ComponentStore } from '../../store/ComponentStore';
import { BuildingStore } from '../../store/BuildingStore';
import HeatMapWidget from '../../sharedComponents/heatMapWidget';
import { apiRequestBody } from '../../helpers/helpers';
import LineChart from '../../sharedComponents/lineChart/LineChart';
import './style.css';
import Brick from '../../sharedComponents/brick';

const TimeOfDay = () => {
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    // temperory soln
    const getTimeData = (value) => {
        if (value === 1) {
            return '12AM';
        }
        if (value === 13) {
            return '12PM';
        }
        if (value >= 2 && value <= 12) {
            let num = value - 1;
            let time = `${num}AM`;
            return time;
        }
        if (value >= 14) {
            let num = value - 13;
            let time = `${num}PM`;
            return time;
        }
    };

    const [lineChartData, setLineChartData] = useState([]);

    const [dateFilter, setDateRange] = useState({
        minDate: '',
        maxDate: '',
    });

    const [heatMapChartData, setHeatMapChartData] = useState([]);
    const [isAvgHourlyChartLoading, setIsAvgHourlyChartLoading] = useState(false);

    const weekdaysChartHeight = '400px';

    const [energyConsumption, setEnergyConsumption] = useState([]);

    const [isEndUsageChartLoading, setIsEndUsageChartLoading] = useState(false);

    const metric = [{ value: 'energy', label: 'Energy', unit: 'kWh', Consumption: 'Energy' }];

    const getAverageValue = (value, min, max) => {
        if (min == undefined || max === undefined) {
            return 0;
        }
        let percentage = Math.round(((value - min) / (max - min)) * 100);
        return Math.round(percentage);
    };

    const [donutChartData, setDonutChartData] = useState([12553, 11553, 6503, 2333, 5452]);

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Time Of Day',
                    path: '/energy/time-of-day',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'buildings';
        });
    };

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        if (startDate === null) {
            return;
        }
        if (endDate === null) {
            return;
        }

        const endUsesByOfHour = async () => {
            setIsEndUsageChartLoading(true);
            const params = `?building_id=${bldgId}&off_hours=true`;
            const payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchBuildingAfterHours(params, payload)
                .then((res) => {
                    const response = res?.data?.data;
                    if (response.length !== 0) {
                        response.forEach((el) => {
                            el.after_hours_energy_consumption.now = Math.round(
                                el?.after_hours_energy_consumption?.now / 1000
                            );
                            el.after_hours_energy_consumption.old = Math.round(
                                el?.after_hours_energy_consumption?.old / 1000
                            );
                        });
                    }
                    setEnergyConsumption(response);
                    const energyData = response;
                    let newDonutData = [];
                    energyData.forEach((record) => {
                        let fixedConsumption = parseInt(record?.after_hours_energy_consumption?.now);
                        newDonutData.push(fixedConsumption);
                    });
                    setDonutChartData(newDonutData);
                    setIsEndUsageChartLoading(false);
                })
                .catch((error) => {
                    setIsEndUsageChartLoading(false);
                });
        };

        const dailyUsageByHour = async () => {
            let payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchBuilidingHourly(bldgId, payload)
                .then((res) => {
                    const response = res?.data;

                    const newWeekdaysData = {
                        name: 'Weekdays',
                        data: [],
                    };
                    const newWeekendsData = {
                        name: 'Weekends',
                        data: [],
                    };

                    const range = {
                        minDate: '',
                        maxDate: '',
                    };

                    const weekDaysResData = response[0]?.weekdays;
                    const weekEndResData = response[0]?.weekend;

                    weekDaysResData.forEach((el, index) => {
                        if (index === 0) range.minDate = new Date(el.x).getTime();
                        if (index === weekDaysResData.length - 1) range.maxDate = new Date(el.x).getTime();

                        newWeekdaysData.data.push({
                            x: new Date(el.x).getTime(),
                            y: parseFloat((el.y / 1000).toFixed(2)),
                        });

                        newWeekendsData.data.push({
                            x: new Date(el.x).getTime(),
                            y: weekEndResData[index].y ? parseFloat((weekEndResData[index].y / 1000).toFixed(2)) : 0,
                        });
                    });

                    if (weekDaysResData.length === 0) {
                        weekEndResData.forEach((el, index) => {
                            if (index === 0) range.minDate = new Date(el.x).getTime();
                            if (index === weekEndResData.length - 1) range.maxDate = new Date(el.x).getTime();

                            newWeekendsData.data.push({
                                x: new Date(el.x).getTime(),
                                y: parseFloat((el.y / 1000).toFixed(2)),
                            });

                            newWeekdaysData.data.push({
                                x: new Date(el.x).getTime(),
                                y: weekDaysResData[index].y
                                    ? parseFloat((weekDaysResData[index].y / 1000).toFixed(2))
                                    : 0,
                            });
                        });
                    }

                    const chartDataToDisplay = [];

                    chartDataToDisplay.push(newWeekdaysData);
                    chartDataToDisplay.push(newWeekendsData);

                    setLineChartData(chartDataToDisplay);
                    setDateRange(range);
                })
                .catch((error) => {});
        };

        const averageUsageByHourFetch = async () => {
            setIsAvgHourlyChartLoading(true);
            let payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchAvgDailyUsageByHour(bldgId, payload)
                .then((res) => {
                    let response = res.data;

                    // default chart structure
                    let heatMapData = [
                        {
                            name: 'Monday',
                            data: [],
                        },
                        {
                            name: 'Tuesday',
                            data: [],
                        },
                        {
                            name: 'Wednesday',
                            data: [],
                        },
                        {
                            name: 'Thursday',
                            data: [],
                        },
                        {
                            name: 'Friday',
                            data: [],
                        },
                        {
                            name: 'Saturday',
                            data: [],
                        },
                        {
                            name: 'Sunday',
                            data: [],
                        },
                    ];

                    // length === 0  then below data
                    let defaultList = [
                        {
                            x: 12 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 1 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 2 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 3 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 4 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 5 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 6 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 7 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 8 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 9 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 10 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 11 + 'AM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 12 + 'PM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 1 + 'PM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 2 + 'PM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 3 + 'PM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 4 + 'PM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 5 + 'PM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 6 + 'PM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 7 + 'PM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 8 + 'PM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 9 + 'PM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 10 + 'PM',
                            y: 0,
                            z: 0,
                        },
                        {
                            x: 11 + 'PM',
                            y: 0,
                            z: 0,
                        },
                    ];

                    let mon = [];
                    let tue = [];
                    let wed = [];
                    let thu = [];
                    let fri = [];
                    let sat = [];
                    let sun = [];

                    // Seperate record based on days
                    response.map((record) => {
                        if (record.timeline.weekday === 1) {
                            sun.push(record);
                        }
                        if (record.timeline.weekday === 2) {
                            mon.push(record);
                        }
                        if (record.timeline.weekday === 3) {
                            tue.push(record);
                        }
                        if (record.timeline.weekday === 4) {
                            wed.push(record);
                        }
                        if (record.timeline.weekday === 5) {
                            thu.push(record);
                        }
                        if (record.timeline.weekday === 6) {
                            fri.push(record);
                        }
                        if (record.timeline.weekday === 7) {
                            sat.push(record);
                        }
                    });

                    let finalList = [];

                    mon.forEach((record) => finalList.push(Math.round(record?.energy_consuption / 1000)));
                    tue.forEach((record) => finalList.push(Math.round(record?.energy_consuption / 1000)));
                    wed.forEach((record) => finalList.push(Math.round(record?.energy_consuption / 1000)));
                    thu.forEach((record) => finalList.push(Math.round(record?.energy_consuption / 1000)));
                    fri.forEach((record) => finalList.push(Math.round(record?.energy_consuption / 1000)));
                    sat.forEach((record) => finalList.push(Math.round(record?.energy_consuption / 1000)));
                    sun.forEach((record) => finalList.push(Math.round(record?.energy_consuption / 1000)));

                    finalList.sort((a, b) => a - b);

                    let minVal = finalList[0];
                    let maxVal = finalList[finalList.length - 1];

                    if (minVal === maxVal) {
                        minVal = 0;
                    }

                    heatMapData.map((record) => {
                        if (record.name === 'Sunday') {
                            let newData = [];
                            if (sun.length !== 0) {
                                for (let i = 0; i <= 23; i++) {
                                    let found = sun.find((x) => x.timeline.hour === i);
                                    let xval = '';
                                    if (i === 0) {
                                        xval = 12 + 'AM';
                                    } else if (i < 12) {
                                        xval = i + 'AM';
                                    } else {
                                        if (i == 12) {
                                            xval = 12 + 'PM';
                                        } else {
                                            var val = i % 12;
                                            xval = val + 'PM';
                                        }
                                    }
                                    if (found !== undefined) {
                                        newData.push({
                                            x: xval,
                                            y: getAverageValue(
                                                (found.energy_consuption / 1000).toFixed(2),
                                                minVal,
                                                maxVal
                                            ),
                                            z: (found.energy_consuption / 1000).toFixed(2),
                                        });
                                    } else {
                                        newData.push({
                                            x: xval,
                                            y: 0,
                                            z: 0,
                                        });
                                    }
                                }
                                record.data = newData;
                            } else {
                                record.data = defaultList;
                            }
                        }

                        if (record.name === 'Monday') {
                            let newData = [];
                            if (mon.length !== 0) {
                                for (let i = 0; i <= 23; i++) {
                                    let found = mon.find((x) => x.timeline.hour === i);
                                    let xval = '';
                                    if (i === 0) {
                                        xval = 12 + 'AM';
                                    } else if (i < 12) {
                                        xval = i + 'AM';
                                    } else {
                                        if (i == 12) {
                                            xval = 12 + 'PM';
                                        } else {
                                            var val = i % 12;
                                            xval = val + 'PM';
                                        }
                                    }
                                    if (found !== undefined) {
                                        newData.push({
                                            x: xval,
                                            y: getAverageValue(
                                                (found.energy_consuption / 1000).toFixed(2),
                                                minVal,
                                                maxVal
                                            ),
                                            z: (found.energy_consuption / 1000).toFixed(2),
                                        });
                                    } else {
                                        newData.push({
                                            x: xval,
                                            y: 0,
                                            z: 0,
                                        });
                                    }
                                }
                                record.data = newData;
                            } else {
                                record.data = defaultList;
                            }
                        }

                        if (record.name === 'Tuesday') {
                            let newData = [];
                            if (tue.length !== 0) {
                                for (let i = 0; i <= 23; i++) {
                                    let found = tue.find((x) => x.timeline.hour === i);
                                    let xval = '';
                                    if (i === 0) {
                                        xval = 12 + 'AM';
                                    } else if (i < 12) {
                                        xval = i + 'AM';
                                    } else {
                                        if (i == 12) {
                                            xval = 12 + 'PM';
                                        } else {
                                            var val = i % 12;
                                            xval = val + 'PM';
                                        }
                                    }
                                    if (found !== undefined) {
                                        newData.push({
                                            x: xval,
                                            y: getAverageValue(
                                                (found.energy_consuption / 1000).toFixed(2),
                                                minVal,
                                                maxVal
                                            ),
                                            z: (found.energy_consuption / 1000).toFixed(2),
                                        });
                                    } else {
                                        newData.push({
                                            x: xval,
                                            y: 0,
                                            z: 0,
                                        });
                                    }
                                }
                                record.data = newData;
                            } else {
                                record.data = defaultList;
                            }
                        }

                        if (record.name === 'Wednesday') {
                            let newData = [];
                            if (wed.length !== 0) {
                                for (let i = 0; i <= 23; i++) {
                                    let found = wed.find((x) => x.timeline.hour === i);
                                    let xval = '';
                                    if (i === 0) {
                                        xval = 12 + 'AM';
                                    } else if (i < 12) {
                                        xval = i + 'AM';
                                    } else {
                                        if (i == 12) {
                                            xval = 12 + 'PM';
                                        } else {
                                            var val = i % 12;
                                            xval = val + 'PM';
                                        }
                                    }
                                    if (found !== undefined) {
                                        newData.push({
                                            x: xval,
                                            y: getAverageValue(
                                                (found.energy_consuption / 1000).toFixed(2),
                                                minVal,
                                                maxVal
                                            ),
                                            z: (found.energy_consuption / 1000).toFixed(2),
                                        });
                                    } else {
                                        newData.push({
                                            x: xval,
                                            y: 0,
                                            z: 0,
                                        });
                                    }
                                }
                                record.data = newData;
                            } else {
                                record.data = defaultList;
                            }
                        }

                        if (record.name === 'Thursday') {
                            let newData = [];
                            if (thu.length !== 0) {
                                for (let i = 0; i <= 23; i++) {
                                    let found = thu.find((x) => x.timeline.hour === i);
                                    let xval = '';
                                    if (i === 0) {
                                        xval = 12 + 'AM';
                                    } else if (i < 12) {
                                        xval = i + 'AM';
                                    } else {
                                        if (i == 12) {
                                            xval = 12 + 'PM';
                                        } else {
                                            var val = i % 12;
                                            xval = val + 'PM';
                                        }
                                    }
                                    if (found !== undefined) {
                                        newData.push({
                                            x: xval,
                                            y: getAverageValue(
                                                (found.energy_consuption / 1000).toFixed(2),
                                                minVal,
                                                maxVal
                                            ),
                                            z: (found.energy_consuption / 1000).toFixed(2),
                                        });
                                    } else {
                                        newData.push({
                                            x: xval,
                                            y: 0,
                                            z: 0,
                                        });
                                    }
                                }
                                record.data = newData;
                            } else {
                                record.data = defaultList;
                            }
                        }

                        if (record.name === 'Friday') {
                            let newData = [];
                            if (fri.length !== 0) {
                                for (let i = 0; i <= 23; i++) {
                                    let found = fri.find((x) => x.timeline.hour === i);
                                    let xval = '';
                                    if (i === 0) {
                                        xval = 12 + 'AM';
                                    } else if (i < 12) {
                                        xval = i + 'AM';
                                    } else {
                                        if (i == 12) {
                                            xval = 12 + 'PM';
                                        } else {
                                            var val = i % 12;
                                            xval = val + 'PM';
                                        }
                                    }
                                    if (found !== undefined) {
                                        newData.push({
                                            x: xval,
                                            y: getAverageValue(
                                                (found.energy_consuption / 1000).toFixed(2),
                                                minVal,
                                                maxVal
                                            ),
                                            z: (found.energy_consuption / 1000).toFixed(2),
                                        });
                                    } else {
                                        newData.push({
                                            x: xval,
                                            y: 0,
                                            z: 0,
                                        });
                                    }
                                }
                                record.data = newData;
                            } else {
                                record.data = defaultList;
                            }
                        }

                        if (record.name === 'Saturday') {
                            let newData = [];
                            if (sat.length !== 0) {
                                for (let i = 0; i <= 23; i++) {
                                    let found = sat.find((x) => x.timeline.hour === i);
                                    let xval = '';
                                    if (i === 0) {
                                        xval = 12 + 'AM';
                                    } else if (i < 12) {
                                        xval = i + 'AM';
                                    } else {
                                        if (i == 12) {
                                            xval = 12 + 'PM';
                                        } else {
                                            var val = i % 12;
                                            xval = val + 'PM';
                                        }
                                    }
                                    if (found !== undefined) {
                                        newData.push({
                                            x: xval,
                                            y: getAverageValue(
                                                (found.energy_consuption / 1000).toFixed(2),
                                                minVal,
                                                maxVal
                                            ),
                                            z: (found.energy_consuption / 1000).toFixed(2),
                                        });
                                    } else {
                                        newData.push({
                                            x: xval,
                                            y: 0,
                                            z: 0,
                                        });
                                    }
                                }
                                record.data = newData;
                            } else {
                                record.data = defaultList;
                            }
                        }
                    });

                    setHeatMapChartData(heatMapData.reverse());
                    setIsAvgHourlyChartLoading(false);
                })
                .catch((error) => {
                    setIsAvgHourlyChartLoading(false);
                });
        };

        endUsesByOfHour();
        dailyUsageByHour();
        averageUsageByHourFetch();
    }, [startDate, endDate, bldgId]);

    return (
        <React.Fragment>
            <Header title="Time of Day" type="page" />

            <Brick sizeInRem={1.5} />

            <div className="custom-time-of-day-grid">
                <EndUseTotals series={donutChartData} energyConsumption={energyConsumption} className={'h-100'} />
                <HeatMapWidget
                    title="Hourly Average Consumption"
                    subtitle="Energy Usage By Hour (kWh)"
                    series={heatMapChartData}
                    height={weekdaysChartHeight}
                    timeZone={timeZone}
                    showRouteBtn={false}
                    labelsPosition={'top'}
                    className={'h-100'}
                />
            </div>

            <Brick sizeInRem={1.5} />

            <LineChart
                title="Average Daily Usage by Hour"
                subTitle="Energy Usage By Hour (kWh)"
                handleMoreClick={null}
                dateRange={dateFilter}
                data={lineChartData}
                tooltipUnit={metric[0].unit}
                tooltipLabel={metric[0].label}
            />
        </React.Fragment>
    );
};

export default TimeOfDay;
