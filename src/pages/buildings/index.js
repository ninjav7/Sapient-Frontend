import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import 'react-loading-skeleton/dist/skeleton.css';
import { ComponentStore } from '../../store/ComponentStore';
import { apiRequestBody } from '../../helpers/helpers';
import { useAtom } from 'jotai';
import moment from 'moment';
import 'moment-timezone';
import { useHistory, useParams } from 'react-router-dom';
import {
    fetchOverallBldgData,
    fetchBuildingEquipments,
    fetchBuilidingHourly,
    fetchEnergyConsumption,
    fetchEndUseByBuilding,
    fetchEnergyConsumptionByEquipType,
    fetchEnergyConsumptionBySpaceType,
    fetchEnergyConsumptionByFloor,
    fetchEnergyConsumptionV2,
} from '../buildings/services';
import { percentageHandler } from '../../utils/helper';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { buildingData } from '../../store/globalState';
import { UserStore } from '../../store/UserStore';
import BuildingKPIs from './BuildingKPIs';
import EnergyConsumptionByEndUse from '../../sharedComponents/energyConsumptionByEndUse';
import HourlyAvgConsumption from './HourlyAvgConsumption';
import TopConsumptionWidget from '../../sharedComponents/topConsumptionWidget/TopConsumptionWidget';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import EquipChartModal from '../chartModal/EquipChartModal';
import ColumnChart from '../../sharedComponents/columnChart/ColumnChart';
import colors from '../../assets/scss/_colors.scss';
import { xaxisLabelsCount, xaxisLabelsFormat } from '../../sharedComponents/helpers/highChartsXaxisFormatter';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { LOW_MED_HIGH_TYPES } from '../../sharedComponents/common/charts/modules/contants';
import { getWeatherData } from '../../services/weather';
import EnergyConsumptionChart from './energy-consumption/EnergyConsumptionChart';
import './style.css';

const BuildingOverview = () => {
    const { bldgId } = useParams();
    const [buildingListData] = useAtom(buildingData);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const history = useHistory();

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefUnits = UserStore.useState((s) => s.unit);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [overallBldgData, setOverallBldgData] = useState({
        total_building: 0,
        portfolio_rank: '10 of 50',
        total_consumption: {
            now: 0,
            old: 0,
        },
        average_energy_density: {
            now: 0,
            old: 0,
        },
        yearly_electric_eui: {
            now: 0,
            old: 0,
        },
    });

    const [dateFormat, setDateFormat] = useState('MM/DD HH:00');

    const [xAxisObj, setXAxisObj] = useState({
        xAxis: {
            tickPositioner: function () {
                var positions = [],
                    tick = Math.floor(this.dataMin),
                    increment = Math.ceil((this.dataMax - this.dataMin) / 4);
                if (this.dataMax !== null && this.dataMin !== null) {
                    for (tick; tick - increment <= this.dataMax; tick += increment) {
                        positions.push(tick);
                    }
                }
                return positions;
            },
        },
    });

    const [isPlugOnly, setIsPlugOnly] = useState(false);
    const [energyConsumptionsCategories, setEnergyConsumptionsCategories] = useState([]);
    const [energyConsumptionsData, setEnergyConsumptionsData] = useState([]);
    const [isAvgConsumptionDataLoading, setIsAvgConsumptionDataLoading] = useState(false);

    const [hourlyAvgConsumpData, setHourlyAvgConsumpData] = useState([]);
    const heatMapChartHeight = 125;
    const [energyConsumption, setEnergyConsumption] = useState([]);
    const [topEnergyConsumptionData, setTopEnergyConsumptionData] = useState([]);
    const [topEnergyDataFetching, setTopEnergyDataFetching] = useState(false);

    const [weatherData, setWeatherData] = useState(null);
    const [isWeatherChartVisible, setWeatherChartVisibility] = useState(false);

    const [equipTypeData, setEquipTypeData] = useState([]);
    const [spaceTypeData, setSpaceTypeData] = useState([]);
    const [floorData, setFloorData] = useState([]);

    const [isFetchingEquipType, setFetchingEquipType] = useState(false);
    const [isFetchingSpaceType, setFetchingSpaceType] = useState(false);
    const [isFetchingFloor, setFetchingFloor] = useState(false);

    const [totalBldgUsageByEquipType, setTotalBldgUsageByEquipType] = useState(0);
    const [totalBldgUsageBySpaceType, setTotalBldgUsageBySpaceType] = useState(0);
    const [totalBldgUsageByFloor, setTotalBldgUsageByFloor] = useState(0);

    //EquipChartModel
    const [equipmentFilter, setEquipmentFilter] = useState({});
    const [selectedModalTab, setSelectedModalTab] = useState(0);
    const [showEquipmentChart, setShowEquipmentChart] = useState(false);
    const handleChartOpen = () => setShowEquipmentChart(true);
    const handleChartClose = () => setShowEquipmentChart(false);

    const formatXaxis = ({ value }) => {
        return moment.utc(value).format(`${dateFormat}`);
    };

    const toolTipFormatter = ({ value }) => {
        const time_format = userPrefTimeFormat === `24h` ? `HH:mm` : `hh:mm A`;
        const date_format = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM 'YY` : `MMM D 'YY`;

        return daysCount >= 182
            ? moment.utc(value).format(`MMM 'YY`)
            : moment.utc(value).format(`${date_format} @ ${time_format}`);
    };

    const fetchTrendBadgeType = (now, old) => {
        if (now > old) return TRENDS_BADGE_TYPES.UPWARD_TREND;
        if (now < old) return TRENDS_BADGE_TYPES.DOWNWARD_TREND;
    };

    const getAverageValue = (value, min, max) => {
        if (min == undefined || max === undefined) return 0;
        let percentage = Math.round(((value - min) / (max - min)) * 100);
        return isNaN(percentage) ? 0 : Math.round(percentage);
    };

    const handleRouteChange = (path) => {
        history.push({
            pathname: `${path}/${bldgId}`,
        });
    };

    const handleClick = (row) => {
        let arr = topEnergyConsumptionData.filter((item) => item.label === row);
        setEquipmentFilter({
            equipment_id: arr[0]?.id,
            equipment_name: arr[0]?.label,
        });
        localStorage.setItem('exploreEquipName', arr[0]?.label);
        handleChartOpen();
    };

    const builidingEquipmentsData = async (timeZone) => {
        const payload = apiRequestBody(startDate, endDate, timeZone);
        setTopEnergyDataFetching(true);

        await fetchBuildingEquipments(bldgId, payload)
            .then((res) => {
                let response = res.data[0].top_contributors;
                let topEnergyData = [];
                response.forEach((record) => {
                    let obj = {
                        link: '#',
                        id: record?.equipment_id,
                        label: record?.equipment_name ? record?.equipment_name : `-`,
                        value: Math.round(record?.energy_consumption.now / 1000),
                        unit: UNITS.KWH,
                        badgePercentage: percentageHandler(
                            record?.energy_consumption.now,
                            record?.energy_consumption.old
                        ),
                        badgeType: fetchTrendBadgeType(record?.energy_consumption.now, record?.energy_consumption.old),
                    };
                    topEnergyData.push(obj);
                });
                setTopEnergyConsumptionData(topEnergyData);
                setTopEnergyDataFetching(false);
            })
            .catch((error) => {
                setTopEnergyDataFetching(false);
            });
    };

    const buildingOverallData = async (time_zone) => {
        const payload = apiRequestBody(startDate, endDate, time_zone);
        await fetchOverallBldgData(bldgId, payload)
            .then((res) => {
                if (res?.data) setOverallBldgData(res?.data);
            })
            .catch((error) => {});
    };

    const buildingEndUserData = async (time_zone) => {
        const params = `?building_id=${bldgId}&off_hours=false`;
        const payload = apiRequestBody(startDate, endDate, time_zone);
        await fetchEndUseByBuilding(params, payload)
            .then((res) => {
                const response = res?.data?.data;
                response.sort((a, b) => b?.energy_consumption.now - a?.energy_consumption.now);
                setEnergyConsumption(response);
            })
            .catch((error) => {});
    };

    const buildingHourlyData = async (time_zone) => {
        setIsAvgConsumptionDataLoading(true);
        const payload = apiRequestBody(startDate, endDate, time_zone);
        await fetchBuilidingHourly(bldgId, payload)
            .then((res) => {
                let response = res?.data;
                let weekDaysResData = response[0]?.weekdays;
                let weekEndResData = response[0]?.weekend;

                let weekEndList = [];
                let weekDaysList = [];

                const weekDaysData = weekDaysResData.map((el) => {
                    weekDaysList.push(parseFloat(el.y / 1000).toFixed(2));
                    return {
                        x: parseInt(moment.utc(el.x).format('HH')),
                        y: (el.y / 1000).toFixed(2),
                    };
                });

                const weekendsData = weekEndResData.map((el) => {
                    weekEndList.push(parseFloat(el.y / 1000).toFixed(2));
                    return {
                        x: parseInt(moment.utc(el.x).format('HH')),
                        y: (el.y / 1000).toFixed(2),
                    };
                });

                let finalList = weekEndList.concat(weekDaysList);

                finalList.sort((a, b) => a - b);

                let minVal = finalList[0];
                let maxVal = finalList[finalList.length - 1];

                if (minVal === maxVal) {
                    minVal = 0;
                }

                let heatMapData = [];

                let newWeekdaysData = {
                    name: 'Week days',
                    data: [],
                };

                let newWeekendsData = {
                    name: 'Weekends',
                    data: [],
                };

                for (let i = 0; i < 24; i++) {
                    let matchedRecord = weekDaysData.find((record) => record.x === i);

                    if (matchedRecord) {
                        matchedRecord.z = matchedRecord.y;
                        matchedRecord.y = getAverageValue(matchedRecord.y, minVal, maxVal);
                        newWeekdaysData.data.push(matchedRecord);
                    } else {
                        newWeekdaysData.data.push({
                            x: i,
                            y: 0,
                            z: 0,
                        });
                    }
                }

                for (let i = 0; i < 24; i++) {
                    let matchedRecord = weekendsData.find((record) => record.x === i);

                    if (matchedRecord) {
                        matchedRecord.z = matchedRecord.y;
                        matchedRecord.y = getAverageValue(matchedRecord.y, minVal, maxVal);
                        newWeekendsData.data.push(matchedRecord);
                    } else {
                        newWeekendsData.data.push({
                            x: i,
                            y: 0,
                            z: 0,
                        });
                    }
                }
                for (let i = 0; i < 24; i++) {
                    if (i === 0) {
                        newWeekdaysData.data[i].x = '12AM';
                        newWeekendsData.data[i].x = '12AM';
                    } else if (i === 12) {
                        newWeekdaysData.data[i].x = '12PM';
                        newWeekendsData.data[i].x = '12PM';
                    } else if (i > 12) {
                        let a = i % 12;
                        newWeekdaysData.data[i].x = a + 'PM';
                        newWeekendsData.data[i].x = a + 'PM';
                    } else {
                        newWeekdaysData.data[i].x = i + 'AM';
                        newWeekendsData.data[i].x = i + 'AM';
                    }
                }

                heatMapData.push(newWeekendsData);
                heatMapData.push(newWeekdaysData);

                setHourlyAvgConsumpData(heatMapData.reverse());
                setIsAvgConsumptionDataLoading(false);
            })
            .catch((error) => {
                setIsAvgConsumptionDataLoading(false);
            });
    };

    const buildingConsumptionChart = async (time_zone) => {
        const payload = {
            date_from: encodeURIComponent(startDate),
            date_to: encodeURIComponent(endDate),
            tz_info: time_zone,
            bldg_id: bldgId,
        };
        await fetchEnergyConsumptionV2(payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success && response?.data.length !== 0) {
                    let energyCategories = [];
                    let energyData = [
                        {
                            name: 'Energy',
                            data: [],
                        },
                    ];
                    response.data.forEach((record) => {
                        energyCategories.push(record?.time_stamp);
                        energyData[0].data.push(parseFloat((record?.data / 1000).toFixed(2)));
                    });
                    setEnergyConsumptionsCategories(energyCategories);
                    setEnergyConsumptionsData(energyData);
                }
            })
            .catch((error) => {});
    };

    const fetchWeatherData = async (time_zone) => {
        const payload = {
            date_from: encodeURIComponent(startDate),
            date_to: encodeURIComponent(endDate),
            tz_info: time_zone,
            bldg_id: bldgId,
        };
        await getWeatherData(payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    const tempData = [];
                    const highTemp = {
                        type: LOW_MED_HIGH_TYPES.HIGH,
                        data: [],
                        color: colors.datavizRed500,
                    };
                    const avgTemp = {
                        type: LOW_MED_HIGH_TYPES.MED,
                        data: [],
                        color: colors.primaryGray450,
                    };
                    const lowTemp = {
                        type: LOW_MED_HIGH_TYPES.LOW,
                        data: [],
                        color: colors.datavizBlue400,
                    };
                    response.data.forEach((record) => {
                        if (record.hasOwnProperty('temp')) avgTemp.data.push(record?.temp);
                        if (record.hasOwnProperty('max_temp')) highTemp.data.push(record?.max_temp);
                        if (record.hasOwnProperty('min_temp')) lowTemp.data.push(record?.min_temp);
                    });
                    if (avgTemp?.data.length !== 0) tempData.push(avgTemp);
                    if (highTemp?.data.length !== 0) tempData.push(highTemp);
                    if (lowTemp?.data.length !== 0) tempData.push(lowTemp);
                    if (tempData.length !== 0) setWeatherData(tempData);
                } else {
                    setWeatherData(null);
                }
            })
            .catch(() => {
                setWeatherData(null);
            });
    };

    const getEnergyConsumptionByEquipType = async (time_zone) => {
        setFetchingEquipType(true);

        const payload = {
            bldg_id: bldgId,
            date_from: encodeURIComponent(startDate),
            date_to: encodeURIComponent(endDate),
            tz_info: time_zone,
        };

        await fetchEnergyConsumptionByEquipType(payload)
            .then((res) => {
                const response = res?.data;
                if (response?.data?.total_building_usage)
                    setTotalBldgUsageByEquipType(response?.data?.total_building_usage);
                if (response?.success && response?.data?.equipment_type_usage.length !== 0) {
                    setEquipTypeData(response?.data?.equipment_type_usage);
                }
                setFetchingEquipType(false);
            })
            .catch(() => {
                setFetchingEquipType(false);
            });
    };

    const getEnergyConsumptionBySpaceType = async (time_zone) => {
        setFetchingSpaceType(true);

        const payload = {
            bldg_id: bldgId,
            date_from: encodeURIComponent(startDate),
            date_to: encodeURIComponent(endDate),
            tz_info: time_zone,
        };

        await fetchEnergyConsumptionBySpaceType(payload)
            .then((res) => {
                const response = res?.data;
                if (response?.data?.total_building_usage)
                    setTotalBldgUsageBySpaceType(response?.data?.total_building_usage);
                if (response?.success && response?.data?.space_type_usage.length !== 0) {
                    setSpaceTypeData(response?.data?.space_type_usage);
                }
                setFetchingSpaceType(false);
            })
            .catch(() => {
                setFetchingSpaceType(false);
            });
    };

    const getEnergyConsumptionByFloor = async (time_zone) => {
        setFetchingFloor(true);

        const payload = {
            bldg_id: bldgId,
            date_from: encodeURIComponent(startDate),
            date_to: encodeURIComponent(endDate),
            tz_info: time_zone,
        };

        await fetchEnergyConsumptionByFloor(payload)
            .then((res) => {
                const response = res?.data;
                if (response?.data?.total_building_usage)
                    setTotalBldgUsageByFloor(response?.data?.total_building_usage);
                if (response?.success && response?.data?.floor_usage.length !== 0) {
                    setFloorData(response?.data?.floor_usage);
                }
                setFetchingFloor(false);
            })
            .catch(() => {
                setFetchingFloor(false);
            });
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Building Overview',
                    path: '/energy/building/overview',
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
        const getXaxisForDaysSelected = (days_count) => {
            const xaxisObj = xaxisLabelsCount(days_count);
            if (xaxisObj) xaxisObj.legend = { enabled: false };
            setXAxisObj(xaxisObj);
        };

        const getFormattedChartDates = (days_count, timeFormat, dateFormat) => {
            const date_format = xaxisLabelsFormat(days_count, timeFormat, dateFormat);
            setDateFormat(date_format);
        };

        getXaxisForDaysSelected(daysCount);
        getFormattedChartDates(daysCount, userPrefTimeFormat, userPrefDateFormat);
    }, [daysCount, userPrefTimeFormat, userPrefDateFormat]);

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

        buildingOverallData(time_zone);
        buildingEndUserData(time_zone);
        builidingEquipmentsData(time_zone);
        buildingHourlyData(time_zone);
        buildingConsumptionChart(time_zone);
        getEnergyConsumptionByEquipType(time_zone);
        getEnergyConsumptionBySpaceType(time_zone);
        getEnergyConsumptionByFloor(time_zone);
    }, [startDate, endDate, bldgId, userPrefUnits]);

    useEffect(() => {
        if (isWeatherChartVisible && bldgId) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            fetchWeatherData(bldgObj?.timezone);
        }
    }, [isWeatherChartVisible, startDate, endDate]);

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        if (bldgId && buildingListData.length !== 0) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id) setIsPlugOnly(bldgObj?.plug_only);
        }
    }, [buildingListData, bldgId]);

    return (
        <React.Fragment>
            <Header title="Building Overview" type="page" />

            <div className="mt-4 mb-4">
                <BuildingKPIs daysCount={daysCount} overalldata={overallBldgData} userPrefUnits={userPrefUnits} />
            </div>

            <div className="bldg-page-grid-style">
                <div>
                    {!isPlugOnly && (
                        <EnergyConsumptionByEndUse
                            title="Energy Consumption by End Use"
                            subtitle="Energy Totals"
                            energyConsumption={energyConsumption}
                            bldgId={bldgId}
                            pageType="building"
                            handleRouteChange={() => handleRouteChange('/energy/end-uses')}
                            showRouteBtn={true}
                        />
                    )}

                    {isPlugOnly ? (
                        <>
                            <ColumnChart
                                title="Total Energy Consumption"
                                subTitle="Hourly Energy Consumption (kWh)"
                                onMoreDetail={() => handleRouteChange('/energy/end-uses/plug')}
                                colors={[colors.datavizMain2]}
                                categories={energyConsumptionsCategories}
                                tooltipUnit={UNITS.KWH}
                                series={energyConsumptionsData}
                                isLegendsEnabled={false}
                                timeZone={timeZone}
                                xAxisCallBackValue={formatXaxis}
                                restChartProps={xAxisObj}
                                tooltipCallBackValue={toolTipFormatter}
                                temperatureSeries={weatherData}
                                plotBands={null}
                                upperLegendsProps={{
                                    weather: {
                                        onClick: ({ withTemp }) => {
                                            setWeatherChartVisibility(withTemp);
                                        },
                                        isAlwaysShown: true,
                                    },
                                }}
                                withTemp={isWeatherChartVisible}
                            />

                            <HourlyAvgConsumption
                                title="Hourly Average Consumption"
                                subtitle="Average by Hour (kWh)"
                                isAvgConsumptionDataLoading={isAvgConsumptionDataLoading}
                                startEndDayCount={daysCount}
                                series={hourlyAvgConsumpData}
                                height={heatMapChartHeight}
                                timeZone={timeZone}
                                className="mt-4"
                                pageType="building"
                                handleRouteChange={() => handleRouteChange('/energy/time-of-day')}
                                showRouteBtn={true}
                                timeFormat={userPrefTimeFormat}
                            />
                        </>
                    ) : (
                        <>
                            <HourlyAvgConsumption
                                title="Hourly Average Consumption"
                                subtitle="Average by Hour (kWh)"
                                isAvgConsumptionDataLoading={isAvgConsumptionDataLoading}
                                startEndDayCount={daysCount}
                                series={hourlyAvgConsumpData}
                                height={heatMapChartHeight}
                                timeZone={timeZone}
                                className="mt-4"
                                pageType="building"
                                handleRouteChange={() => handleRouteChange('/energy/time-of-day')}
                                showRouteBtn={true}
                                timeFormat={userPrefTimeFormat}
                            />

                            <div className="mt-4">
                                <ColumnChart
                                    title="Total Energy Consumption"
                                    subTitle="Hourly Energy Consumption (kWh)"
                                    onMoreDetail={() => handleRouteChange('/energy/end-uses')}
                                    colors={[colors.datavizMain2]}
                                    categories={energyConsumptionsCategories}
                                    tooltipUnit={UNITS.KWH}
                                    series={energyConsumptionsData}
                                    isLegendsEnabled={false}
                                    timeZone={timeZone}
                                    xAxisCallBackValue={formatXaxis}
                                    restChartProps={xAxisObj}
                                    tooltipCallBackValue={toolTipFormatter}
                                    temperatureSeries={weatherData}
                                    plotBands={null}
                                    upperLegendsProps={{
                                        weather: {
                                            onClick: ({ withTemp }) => {
                                                setWeatherChartVisibility(withTemp);
                                            },
                                            isAlwaysShown: true,
                                        },
                                    }}
                                    withTemp={isWeatherChartVisible}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="w-100">
                    <div>
                        <TopConsumptionWidget
                            title="Top Energy Consumers"
                            heads={['Equipment', 'Energy', 'Change']}
                            rows={topEnergyConsumptionData}
                            className={'fit-container-style w-100'}
                            handleClick={handleClick}
                            widgetType="TopEnergyConsumersWidget"
                            tableStyle={{ width: '75%' }}
                            isFetching={topEnergyDataFetching}
                        />
                    </div>
                    <div className="mt-4">
                        <EnergyConsumptionChart
                            title="Energy Consumption by Equipment Type"
                            subTitle="Occupied Hours and Off Hours Energy Used"
                            isFetching={isFetchingEquipType}
                            rows={equipTypeData}
                            totalBldgUsage={totalBldgUsageByEquipType}
                        />
                    </div>
                    <div className="mt-4">
                        <EnergyConsumptionChart
                            title="Energy Consumption by Space Type"
                            subTitle="Occupied Hours and Off Hours Energy Used"
                            isFetching={isFetchingSpaceType}
                            rows={spaceTypeData}
                            totalBldgUsage={totalBldgUsageBySpaceType}
                        />
                    </div>
                    <div className="mt-4">
                        <EnergyConsumptionChart
                            title="Energy Consumption by Floor"
                            subTitle="Occupied Hours and Off Hours Energy Used"
                            isFetching={isFetchingFloor}
                            rows={floorData}
                            totalBldgUsage={totalBldgUsageByFloor}
                        />
                    </div>
                </div>
            </div>

            <div>
                <EquipChartModal
                    showEquipmentChart={showEquipmentChart}
                    handleChartClose={handleChartClose}
                    equipmentFilter={equipmentFilter}
                    fetchEquipmentData={builidingEquipmentsData}
                    selectedTab={selectedModalTab}
                    setSelectedTab={setSelectedModalTab}
                    activePage="buildingOverview"
                />
            </div>
        </React.Fragment>
    );
};

export default BuildingOverview;
