import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import 'react-loading-skeleton/dist/skeleton.css';
import { ComponentStore } from '../../store/ComponentStore';
import { useAtom } from 'jotai';
import moment from 'moment';
import 'moment-timezone';
import { useHistory, useParams } from 'react-router-dom';
import { fetchEnergyConsumptionV2 } from '../buildings/services';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { buildingData } from '../../store/globalState';
import { UserStore } from '../../store/UserStore';
import BuildingKPIs from './BuildingKPIs';
import { UNITS } from '../../constants/units';
import ColumnLineChart from '../../sharedComponents/columnLineChart/ColumnLineChart';
import colors from '../../assets/scss/_colors.scss';
import { xaxisLabelsCount, xaxisLabelsFormat } from '../../sharedComponents/helpers/highChartsXaxisFormatter';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import './style.css';
import { fetchMetricsKpiBuildingPage } from './services';

const CarbonBuilding = () => {
    const { bldgId } = useParams();
    const [buildingListData] = useAtom(buildingData);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    let time_zone = 'US/Eastern';

    const history = useHistory();
    const [kpiMetrics, setKpiMetrics] = useState({
        average: { now: 0, old: 0, change: 0 },
        current_carbon_intensity: { now: 0, old: 0 },
        total: { now: 0, old: 0, change: 0 },
        egrid_emission_factor: 0,
        average_carbon_intensity: { now: 0, old: 0, change: 0 },
    });
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefUnits = UserStore.useState((s) => s.unit);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [dateFormatLocal, setDateFormat] = useState('MM/DD HH:00');

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
    const [carbonConsumptionsCategories, setCarbonConsumptionsCategories] = useState([]);

    const [energyConsumptionsData, setEnergyConsumptionsData] = useState([{}]);
    const [carbonIntensity, setCarbonIntensity] = useState([{}]);

    const [chartsData, setChartsData] = useState([]);
    const [dataToDisplay, setDataToDisplay] = useState([]);
    const [legendObj, setLegendObj] = useState({
        carbon: true,
        energy: true,
    });
    const [timeFormatChanged, setTimeFormatChanged] = useState(false);
    const [dateFormatChanged, setDateFormatChanged] = useState('');
    const [unitFormatChanged, setUnitFormatChanged] = useState(false);
    const { dateFormat, timeFormat, unit } = UserStore.useState((s) => ({
        dateFormat: s.dateFormat,
        timeFormat: s.timeFormat,
        unit: s.unit,
    }));

    useEffect(() => {
        if (dateFormat) {
            setDateFormatChanged(dateFormat);
        }
        if (timeFormat) {
            setTimeFormatChanged(timeFormat);
        }
        if (unit) {
            setUnitFormatChanged(unit);
        }
    }, [dateFormat, timeFormat, unit]);

    useEffect(() => {
        let time_zone = 'US/Eastern';
        fetchMetricsKpi();
        buildingConsumptionChartEnergy(time_zone);
        buildingEnergyConsumptionChartCarbon(time_zone);
    }, [timeFormatChanged, dateFormatChanged, unitFormatChanged]);

    const formatXaxis = ({ value }) => {
        return moment.utc(value).format(`${dateFormatLocal}`);
    };

    const toolTipFormatter = ({ value }) => {
        const time_format = userPrefTimeFormat === `24h` ? `HH:mm` : `hh:mm A`;
        const date_format = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM 'YY` : `MMM D 'YY`;

        return daysCount >= 182
            ? moment.utc(value).format(`MMM 'YY`)
            : moment.utc(value).format(`${date_format} @ ${time_format}`);
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Building Overview',
                    path: '/carbon/building/overview',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'carbon-buildings';
        });
    };

    useEffect(() => {
        const getXaxisForDaysSelected = (days_count) => {
            const xaxisObj = xaxisLabelsCount(days_count);
            if (xaxisObj) xaxisObj.legend = { enabled: false };
            setXAxisObj(xaxisObj);
        };

        const getFormattedChartDates = (days_count, timeFormat, dateFormatLocal) => {
            const date_format = xaxisLabelsFormat(days_count, timeFormat, dateFormatLocal);
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
        fetchMetricsKpi();
        buildingConsumptionChartEnergy(time_zone);
        buildingEnergyConsumptionChartCarbon(time_zone);
    }, [startDate, endDate, bldgId, userPrefUnits]);

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    const fetchMetricsKpi = async () => {
        const payload = {
            building_id: bldgId,
            metric: 'carbon',
            date_from: startDate,
            date_to: endDate,
            tz_info: time_zone,
        };
        await fetchMetricsKpiBuildingPage(payload).then((res) => {
            setKpiMetrics(res.data);
        });
    };
    useEffect(() => {
        fetchMetricsKpi();
    }, [bldgId]);

    useEffect(() => {
        if (bldgId && buildingListData.length !== 0) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id) setIsPlugOnly(bldgObj?.plug_only);
        }
    }, [buildingListData, bldgId]);

    const buildingConsumptionChartEnergy = async (time_zone) => {
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
                            type: 'column',
                            color: colors.datavizMain2,
                            yAxis: 0,
                            tooltip: {
                                valueSuffix: ' KWh',
                            },
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

    const buildingEnergyConsumptionChartCarbon = async (time_zone) => {
        const payload = {
            date_from: encodeURIComponent(startDate),
            date_to: encodeURIComponent(endDate),
            tz_info: time_zone,
            bldg_id: bldgId,
        };
        await fetchEnergyConsumptionV2(payload, 'generated_carbon_rate')
            .then((res) => {
                const response = res?.data;
                if (response?.success && response?.data.length !== 0) {
                    let carbonCategories = [];
                    let carbonData = [
                        {
                            name: 'Carbon',
                            data: [],
                            type: 'spline',
                            yAxis: 1,
                            color: colors.datavizMain1,
                            tooltip: {
                                valueSuffix: userPrefUnits == 'si' ? ' kgs/MWh' : ' lbs/MWh',
                            },
                        },
                    ];
                    response.data.forEach((record) => {
                        carbonCategories.push(record?.time_stamp);
                        carbonData[0].data.push(record?.data);
                    });

                    setCarbonConsumptionsCategories(carbonCategories);
                    setCarbonIntensity(carbonData);
                }
            })
            .catch((error) => {});
    };

    const handleLegendStatusChange = (key, value) => {
        setLegendObj((prevLegendObj) => ({
            ...prevLegendObj,
            [key]: value,
        }));
    };

    useEffect(() => {
        const mergedList = [];
        if (energyConsumptionsData[0].name) {
            mergedList[0] = energyConsumptionsData[0];
        }
        if (carbonIntensity[0].name) {
            mergedList[1] = carbonIntensity[0];
        }
        setChartsData(mergedList);
    }, [energyConsumptionsData, carbonIntensity]);

    useEffect(() => {
        if (legendObj?.carbon && legendObj?.energy) {
            setDataToDisplay(chartsData);
        }
        if (!legendObj?.carbon && !legendObj?.energy) setDataToDisplay([]);
        if (legendObj?.carbon && !legendObj?.energy) {
            let obj = chartsData.find((el) => el?.name === 'Carbon');
            setDataToDisplay([obj]);
        }
        if (!legendObj?.carbon && legendObj?.energy) {
            let obj = chartsData.find((el) => el?.name === 'Energy');
            setDataToDisplay([obj]);
        }
    }, [legendObj, chartsData]);

    return (
        <React.Fragment>
            <Header title="Building Overview" type="page" />

            <div className="mt-4 mb-4">
                <BuildingKPIs daysCount={daysCount} overalldata={kpiMetrics} userPrefUnits={userPrefUnits} />
            </div>
            <div className="mt-4">
                <ColumnLineChart
                    colors={[colors.datavizMain2, colors.datavizMain1]}
                    categories={carbonConsumptionsCategories}
                    tooltipUnit={UNITS.KWH}
                    carbonUnits={userPrefUnits}
                    series={dataToDisplay}
                    isLegendsEnabled={false}
                    plotBandsLegends={[
                        {
                            label: `Carbon Intensity (${userPrefUnits == 'si' ? 'kgs/MWh' : 'lbs/MWh'})`,
                            color: colors.datavizMain1,
                            type: 'spline',
                            onClick: (event) => handleLegendStatusChange('carbon', !event),
                        },
                        {
                            label: 'Energy Consumption (kWh)',
                            type: 'column',
                            color: colors.datavizMain2,
                            onClick: (event) => handleLegendStatusChange('energy', !event),
                        },
                    ]}
                    timeZone={timeZone}
                    xAxisCallBackValue={formatXaxis}
                    restChartProps={xAxisObj}
                    tooltipCallBackValue={toolTipFormatter}
                />
            </div>
        </React.Fragment>
    );
};

export default CarbonBuilding;
