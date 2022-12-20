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
import EndUsesTypeWidget from './endUsesTypeWidget';
import { COLOR_SCHEME_BY_DEVICE } from '../../constants/colors';
import Brick from '../../sharedComponents/brick';

const EndUsesPage = () => {
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const [isEndUsesChartLoading, setIsEndUsesChartLoading] = useState(false);
    const [isEndUsesDataFetched, setIsEndUsesDataFetched] = useState(false);

    const [endUsesData, setEndUsesData] = useState([]);
    const [topEndUsesData, setTopEndUsesData] = useState([]);

    const [stackedColumnChartCategories, setStackedColumnChartCategories] = useState([]);
    const [stackedColumnChartData, setStackedColumnChartData] = useState([]);

    const history = useHistory();

    const redirectToEndUse = (endUseType) => {
        let endUse = endUseType.toLowerCase();
        history.push({
            pathname: `/energy/end-uses/${endUse}/${bldgId}`,
        });
    };

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

                    const formattedTimestamp = [];
                    const formattedData = responseData.map((record, index) => {
                        let obj = {
                            name: record?.name,
                            data: [],
                        };
                        record.data.forEach((el) => {
                            if (index === 0) {
                                formattedTimestamp.push(el?.time_stamp);
                            }
                            obj.data.push(el?.consumption / 1000);
                        });
                        return obj;
                    });

                    setStackedColumnChartCategories(formattedTimestamp);
                    setStackedColumnChartData(formattedData);
                    setIsEndUsesChartLoading(false);
                })
                .catch((error) => {
                    setIsEndUsesChartLoading(false);
                });
        };

        endUsesDataFetch();
        endUsesChartDataFetch();
    }, [startDate, endDate, bldgId]);

    return (
        <React.Fragment>
            <Header title="End Uses" type="page" />

            <Brick sizeInRem={1.5} />

            <EndUsesTypeWidget
                endUsesData={endUsesData}
                stackedColumnChartData={stackedColumnChartData}
                stackedColumnChartCategories={stackedColumnChartCategories}
            />

            <Brick sizeInRem={1.5} />

            <TopEndUsesWidget
                title="Top Systems by Usage"
                subtitle="Click explore to see more energy usage details."
                data={topEndUsesData}
            />
        </React.Fragment>
    );
};

export default EndUsesPage;
