import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import Highcharts from 'highcharts';
import { useParams } from 'react-router-dom';
import Header from '../../components/Header';
import { UserStore } from '../../store/UserStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { ComponentStore } from '../../store/ComponentStore';
import { BuildingStore } from '../../store/BuildingStore';
import { fetchBuilidingHourly, fetchAvgDailyUsageByHour, fetchBuildingAfterHours } from '../timeOfDay/services';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import EndUseTotals from './EndUseTotals';
import HeatMapWidget from '../../sharedComponents/heatMapWidget';
import { apiRequestBody } from '../../helpers/helpers';
import LineChart from '../../sharedComponents/lineChart/LineChart';
import Brick from '../../sharedComponents/brick';
import { separateAndCalculateEnergyData } from './utils';
import { buildingData } from '../../store/globalState';
import './style.css';

const TimeOfDay = () => {
    const { bldgId } = useParams();
    const [buildingListData] = useAtom(buildingData);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const isPlugOnly = BuildingStore.useState((s) => s.isPlugOnly);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [lineChartData, setLineChartData] = useState([]);

    const [dateFilter, setDateRange] = useState({
        minDate: '',
        maxDate: '',
    });

    const [heatMapChartData, setHeatMapChartData] = useState([]);

    const weekdaysChartHeight = '400px';

    const [energyConsumption, setEnergyConsumption] = useState([]);

    const metric = [{ value: 'energy', label: 'Energy', unit: 'kWh', Consumption: 'Energy' }];

    const getAverageValue = (value, min, max) => {
        if (min == undefined || max === undefined) return 0;
        const percentage = Math.round(((value - min) / (max - min)) * 100);
        return Math.round(percentage);
    };

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
        if (startDate === null || endDate === null) return;

        let time_zone = 'US/Eastern';

        if (bldgId) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);

            if (bldgObj?.building_id) {
                if (bldgObj?.timezone) time_zone = bldgObj?.timezone;
                updateBuildingStore(
                    bldgObj?.building_id,
                    bldgObj?.building_name,
                    bldgObj?.timezone,
                    bldgObj?.plug_only
                );
            }
        }

        const endUsesByOfHour = async (is_plug_only) => {
            setEnergyConsumption([]);

            const params = `?building_id=${bldgId}${is_plug_only || is_plug_only === 'true' ? '' : `&off_hours=true`}`;
            const payload = apiRequestBody(startDate, endDate, time_zone);
            await fetchBuildingAfterHours(params, payload)
                .then((res) => {
                    if (res?.data.success) {
                        const response = res?.data?.data;
                        if (is_plug_only || is_plug_only === 'true') {
                            if (response.length !== 0) {
                                const overAllConsumptionData = separateAndCalculateEnergyData(response);
                                setEnergyConsumption(overAllConsumptionData);
                            }
                        } else {
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
                        }
                    }
                })
                .catch((error) => {});
        };

        const dailyUsageByHour = async () => {
            const payload = apiRequestBody(startDate, endDate, time_zone);
            setLineChartData([]);

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
            const payload = apiRequestBody(startDate, endDate, time_zone);
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

                    mon.forEach((record) => finalList.push((record?.energy_consuption / 1000).toFixed(2)));
                    tue.forEach((record) => finalList.push((record?.energy_consuption / 1000).toFixed(2)));
                    wed.forEach((record) => finalList.push((record?.energy_consuption / 1000).toFixed(2)));
                    thu.forEach((record) => finalList.push((record?.energy_consuption / 1000).toFixed(2)));
                    fri.forEach((record) => finalList.push((record?.energy_consuption / 1000).toFixed(2)));
                    sat.forEach((record) => finalList.push((record?.energy_consuption / 1000).toFixed(2)));
                    sun.forEach((record) => finalList.push((record?.energy_consuption / 1000).toFixed(2)));

                    finalList.sort((a, b) => a - b);

                    let minVal = parseFloat(finalList[0]);
                    let maxVal = parseFloat(finalList[finalList.length - 1]);

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
                })
                .catch((error) => {});
        };

        endUsesByOfHour(isPlugOnly);
        dailyUsageByHour();
        averageUsageByHourFetch();
    }, [startDate, endDate, bldgId, isPlugOnly]);

    return (
        <React.Fragment>
            <Header title="Time of Day" type="page" />

            <Brick sizeInRem={1.5} />

            <div className="custom-time-of-day-grid">
                <EndUseTotals
                    energyConsumption={energyConsumption}
                    className={'h-100'}
                    isPlugOnly={isPlugOnly || isPlugOnly === 'true' ? true : false}
                />

                <HeatMapWidget
                    title="Hourly Average Consumption"
                    subtitle="Energy Usage By Hour (kWh)"
                    series={heatMapChartData}
                    height={weekdaysChartHeight}
                    timeZone={timeZone}
                    showRouteBtn={false}
                    labelsPosition={'top'}
                    className={'h-100'}
                    timeFormat={userPrefTimeFormat}
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
                chartProps={{
                    tooltip: {
                        xDateFormat: userPrefTimeFormat === `12h` ? `Time: %I:%M %p` : `Time: %H:%M`,
                    },
                    xAxis: {
                        labels: {
                            formatter: function (val) {
                                return Highcharts.dateFormat(
                                    userPrefTimeFormat === `12h` ? `%I:%M %p` : `%H:%M`,
                                    val.value
                                );
                            },
                        },
                    },
                }}
            />
        </React.Fragment>
    );
};

export default TimeOfDay;
