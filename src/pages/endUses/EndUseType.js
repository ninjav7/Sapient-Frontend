import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import moment from 'moment';
import 'moment-timezone';
import Header from '../../components/Header';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { fetchEndUsesType, fetchEndUsesEquipmentUsage, fetchEndUsesUsageChart } from '../endUses/services';
import { percentageHandler } from '../../utils/helper';
import { useParams } from 'react-router-dom';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import { apiRequestBody, formatConsumptionValue } from '../../helpers/helpers';
import { UNITS } from '../../constants/units';
import EndUsesKPIs from '../../sharedComponents/endUsesKPIs/EndUsesKPIs';
import { fetchTrendType } from './utils';
import { buildingData } from '../../store/globalState';
import { KPI_UNITS } from '../../sharedComponents/KPIs';
import colors from '../../assets/scss/_colors.scss';
import ColumnChart from '../../sharedComponents/columnChart/ColumnChart';
import { xaxisLabelsCount, xaxisLabelsFormat } from '../../sharedComponents/helpers/highChartsXaxisFormatter';
import './style.css';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';

const EndUseType = () => {
    const { endUseType } = useParams();
    const { bldgId } = useParams();

    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);
    const [buildingListData] = useAtom(buildingData);
    const [isPlugOnly, setIsPlugOnly] = useState(false);

    const [dateFormat, setDateFormat] = useState('MM/DD HH:00');
    const [energyConsumptionsCategories, setEnergyConsumptionsCategories] = useState([]);
    const [energyConsumptionsData, setEnergyConsumptionsData] = useState([]);
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

    const formatXaxis = ({ value }) => {
        return moment(value).tz(timeZone).format(`${dateFormat}`);
    };

    const toolTipFormatter = ({ value }) => {
        return daysCount >= 182
            ? moment(value).tz(timeZone).format(`MMM 'YY`)
            : moment(value).tz(timeZone).format(`MMM D 'YY @ hh:mm A`);
    };

    const [endUseName, setEndUseName] = useState('');
    const [endUsesData, setEndUsesData] = useState({});

    const fetchEndUseType = (end_uses_type) => {
        return end_uses_type === 'hvac' ? 'HVAC' : end_uses_type.charAt(0).toUpperCase() + end_uses_type.slice(1);
    };

    const plugUsageDataFetch = async (endUseTypeRequest, time_zone) => {
        const payload = apiRequestBody(startDate, endDate, time_zone);
        await fetchEndUsesUsageChart(bldgId, endUseTypeRequest, payload)
            .then((res) => {
                const response = res?.data;
                let energyCategories = [];
                let energyData = [
                    {
                        name: 'Energy',
                        data: [],
                    },
                ];
                response.forEach((record) => {
                    energyCategories.push(record?.date);
                    energyData[0].data.push(parseFloat((record?.energy_consumption / 1000).toFixed(2)));
                });
                setEnergyConsumptionsCategories(energyCategories);
                setEnergyConsumptionsData(energyData);
            })
            .catch((error) => {});
    };

    const endUsesDataFetch = async (endUseTypeRequest, time_zone) => {
        const payload = apiRequestBody(startDate, endDate, time_zone);
        await fetchEndUsesType(bldgId, endUseTypeRequest, payload)
            .then((res) => {
                let response = res?.data?.data;
                let requestEndUseType = fetchEndUseType(endUseType);
                let data = response.find((element) => element.device === requestEndUseType);
                let obj = {
                    items: [
                        {
                            title: 'Total Consumption',
                            value: formatConsumptionValue(Math.round(data?.energy_consumption?.now / 1000), 0),
                            unit: UNITS.KWH,
                            trends: [
                                {
                                    trendValue: percentageHandler(
                                        data?.energy_consumption?.now,
                                        data?.energy_consumption?.old
                                    ),
                                    trendType: fetchTrendType(
                                        data?.energy_consumption?.now,
                                        data?.energy_consumption?.old
                                    ),
                                    text: 'since last period',
                                },
                            ],
                        },
                        {
                            title: 'After-Hours Consumption',
                            value: formatConsumptionValue(
                                Math.round(data?.after_hours_energy_consumption?.now / 1000),
                                0
                            ),
                            unit: UNITS.KWH,
                            trends: [
                                {
                                    trendValue: percentageHandler(
                                        data?.after_hours_energy_consumption?.now,
                                        data?.after_hours_energy_consumption?.old
                                    ),
                                    trendType: fetchTrendType(
                                        data?.after_hours_energy_consumption?.now,
                                        data?.after_hours_energy_consumption?.old
                                    ),
                                    text: 'since last period',
                                },
                            ],
                        },
                    ],
                };
                setEndUsesData(obj);
            })
            .catch((error) => {});
    };

    useEffect(() => {
        const getXaxisForDaysSelected = (days_count) => {
            const xaxisObj = xaxisLabelsCount(days_count);
            if (xaxisObj) xaxisObj.legend = { enabled: false };
            setXAxisObj(xaxisObj);
        };

        const getFormattedChartDates = (days_count) => {
            const date_format = xaxisLabelsFormat(days_count);
            setDateFormat(date_format);
        };

        getXaxisForDaysSelected(daysCount);
        getFormattedChartDates(daysCount);
    }, [daysCount]);

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
                if (isPlugOnly) newList.shift();
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'buildings';
            });
        };
        updateBreadcrumbStore();
    }, [endUseName, isPlugOnly]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (bldgId && buildingListData.length !== 0) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id) setIsPlugOnly(bldgObj?.plug_only);
        }
    }, [buildingListData, bldgId]);

    useEffect(() => {
        setEndUseName(endUseType === 'hvac' ? 'HVAC' : endUseType.charAt(0).toUpperCase() + endUseType.slice(1));
    }, [endUseType]);

    useEffect(() => {
        if (startDate === null || endDate === null) return;

        let time_zone = 'US/Eastern';

        if (bldgId) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);

            if (bldgObj?.building_id) {
                if (bldgObj?.timezone) time_zone = bldgObj?.timezone;
                updateBuildingStore(bldgObj?.building_id, bldgObj?.building_name, bldgObj?.timezone);
            }
        }

        const endUseTypeRequest = fetchEndUseType(endUseType);

        // Planned for Future Enable of this integration
        // const equipmentUsageDataFetch = async () => {
        //     setIsEquipTypeChartLoading(true);
        //     let payload = apiRequestBody(startDate, endDate, timeZone);
        //     await fetchEndUsesEquipmentUsage(bldgId, endUseTypeRequest, payload)
        //         .then((res) => {
        //             let data = res.data;
        //             let equipTypeName = [];
        //             let equipTypeUsage = [];

        //             data.map((record, index) => {
        //                 equipTypeName.push(record.name);
        //                 equipTypeUsage.push((record.consumption.now / 1000).toFixed(2));
        //             });

        //             let xaxisData = {
        //                 categories: equipTypeName,
        //                 axisBorder: {
        //                     color: '#d6ddea',
        //                 },
        //                 axisTicks: {
        //                     color: '#d6ddea',
        //                 },
        //             };

        //             setEquipTypeChartOptions({ ...equipTypeChartOptions, xaxis: xaxisData });
        //             setHvacUsageData(data);
        //             setIsEquipTypeChartLoading(false);
        //         })
        //         .catch((error) => {
        //             setIsEquipTypeChartLoading(false);
        //         });
        // };

        endUsesDataFetch(endUseTypeRequest, time_zone);
        // equipmentUsageDataFetch(); // Planned for Future Enable of this integration
        plugUsageDataFetch(endUseTypeRequest, time_zone);
    }, [startDate, endDate, endUseType, bldgId]);

    const fetchEnduseTitle = (type) => {
        return type === 'hvac'
            ? 'HVAC Consumption'
            : (endUseType.charAt(0).toUpperCase() + endUseType.slice(1)).concat(' Consumption');
    };

    return (
        <React.Fragment>
            {endUseType === 'hvac' && <Header title="HVAC" type="page" />}
            {endUseType === 'lighting' && <Header title="Lighting" type="page" />}
            {endUseType === 'plug' && <Header title="Plug Load" type="page" />}
            {endUseType === 'process' && <Header title="Process" type="page" />}
            {endUseType === 'other' && <Header title="Other End Uses" type="page" />}

            <div className="mt-4">
                <EndUsesKPIs data={endUsesData} />
            </div>

            <div className="mt-4">
                <ColumnChart
                    title={fetchEnduseTitle(endUseType)}
                    subTitle={'Energy Usage By Hour (kWh)'}
                    colors={[colors.datavizMain2]}
                    categories={energyConsumptionsCategories}
                    tooltipUnit={KPI_UNITS.KWH}
                    series={energyConsumptionsData}
                    isLegendsEnabled={false}
                    timeZone={timeZone}
                    xAxisCallBackValue={formatXaxis}
                    restChartProps={xAxisObj}
                    tooltipCallBackValue={toolTipFormatter}
                />
            </div>

            {/* As part of @PLT-482: Removed Usage by Equipment Type Chart  */}
            {/* <div className="plug-content-style">
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
                    </div> */}

            {/* {endUseType === 'hvac' && (
                <>
                    {isEquipTypeChartLoading ? (
                        <div className="mt-4 energy-container-loader">
                            <Skeleton count={3} color="#f9fafb" height={100} />
                        </div>
                    ) : (
                        <>
                            {hvacUsageData.length !== 0 && (
                                <Row>
                                    <div className="card-body mt-4">
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
            )} */}
        </React.Fragment>
    );
};

export default EndUseType;
