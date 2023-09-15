import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import Header from '../../components/Header';
import { fetchEndUsesChart, fetchEndUses } from '../endUses/services';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { percentageHandler } from '../../utils/helper';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import { UserStore } from '../../store/UserStore';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { apiRequestBody } from '../../helpers/helpers';
import { TopEndUsesWidget } from '../../sharedComponents/topEndUsesWidget';
import { UNITS } from '../../constants/units';
import { useHistory, useParams } from 'react-router-dom';
import { formatConsumptionValue } from '../../sharedComponents/helpers/helper';
import { fetchTrendType } from './utils';
import EndUsesTypeWidget from './endUsesTypeWidget';
import { COLOR_SCHEME_BY_DEVICE } from '../../constants/colors';
import Brick from '../../sharedComponents/brick';
import { xaxisLabelsCount, xaxisLabelsFormat } from '../../sharedComponents/helpers/highChartsXaxisFormatter';
import { buildingData } from '../../store/globalState';
import './style.css';

const EndUsesPage = () => {
    const history = useHistory();

    const { bldgId } = useParams();
    const [buildingListData] = useAtom(buildingData);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);

    const [endUsesData, setEndUsesData] = useState([]);
    const [topEndUsesData, setTopEndUsesData] = useState([]);
    const [isFetchingData, setFetchingData] = useState(false);
    const [isFetchingEndUseData, setFetchingEndUseData] = useState(false);

    const [endUseCategories, setEndUseCategories] = useState([]);
    const [stackedColumnChartCategories, setStackedColumnChartCategories] = useState([]);
    const [stackedColumnChartData, setStackedColumnChartData] = useState([]);
    const [isChartLoading, setChartLoading] = useState(false);

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

    const redirectToEndUse = (endUseType) => {
        let endUse = endUseType.toLowerCase();
        history.push({
            pathname: `/energy/end-uses/${endUse}/${bldgId}`,
        });
    };

    const endUsesDataFetch = async (time_zone) => {
        setFetchingData(true);
        setFetchingEndUseData(true);

        const params = `?building_id=${bldgId}`;
        const payload = apiRequestBody(startDate, endDate, time_zone);

        await fetchEndUses(params, payload)
            .then((res) => {
                const response = res?.data?.data;
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
                                value: formatConsumptionValue(Math.round(record?.energy_consumption?.now / 1000), 0),
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
            })
            .finally(() => {
                setFetchingData(false);
                setFetchingEndUseData(false);
            });
    };

    const endUsesChartDataFetch = async (time_zone) => {
        setStackedColumnChartData([]);
        setChartLoading(true);
        const payload = apiRequestBody(startDate, endDate, time_zone);

        await fetchEndUsesChart(bldgId, payload)
            .then((res) => {
                let responseData = res?.data;

                const formattedTimestamp = [];
                const endUseColors = [];

                const formattedData = responseData.map((record, index) => {
                    let obj = {
                        name: record?.name,
                        data: [],
                    };
                    endUseColors.push(COLOR_SCHEME_BY_DEVICE[record?.name]);
                    record.data.forEach((el) => {
                        if (index === 0) formattedTimestamp.push(el?.time_stamp);
                        obj.data.push(
                            isNaN(el?.consumption) ? el?.consumption : parseFloat((el?.consumption / 1000).toFixed(2))
                        );
                    });
                    return obj;
                });

                setEndUseCategories(endUseColors);
                setStackedColumnChartCategories(formattedTimestamp);
                setStackedColumnChartData(formattedData);
            })
            .finally(() => {
                setChartLoading(false);
            });
    };

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

        endUsesDataFetch(time_zone);
        endUsesChartDataFetch(time_zone);
    }, [startDate, endDate, bldgId]);

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
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Header title="End Uses" type="page" />

            <Brick sizeInRem={1.5} />

            <EndUsesTypeWidget
                endUsesData={endUsesData}
                stackedColumnChartData={stackedColumnChartData}
                stackedColumnChartCategories={stackedColumnChartCategories}
                endUseCategories={endUseCategories}
                xAxisObj={xAxisObj}
                timeZone={timeZone}
                dateFormat={dateFormat}
                daysCount={daysCount}
                isChartLoading={isChartLoading}
                isFetchingEndUseData={isFetchingEndUseData}
            />

            <Brick sizeInRem={1.5} />

            <TopEndUsesWidget
                title="Top Systems by Usage"
                subtitle="Click explore to see more energy usage details."
                data={topEndUsesData}
                isDataLoading={isFetchingData}
            />
        </React.Fragment>
    );
};

export default EndUsesPage;
