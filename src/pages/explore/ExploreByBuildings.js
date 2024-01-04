import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';

import { UserStore } from '../../store/UserStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { ComponentStore } from '../../store/ComponentStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';

import Header from '../../components/Header';
import Brick from '../../sharedComponents/brick';
import Select from '../../sharedComponents/form/select';
import Typography from '../../sharedComponents/typography';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../sharedComponents/form/checkbox';
import ExploreChart from '../../sharedComponents/exploreChart/ExploreChart';
import { TinyBarChart } from '../../sharedComponents/tinyBarChart';
import { TrendsBadge } from '../../sharedComponents/trendsBadge';
import Toggles from '../../sharedComponents/toggles/Toggles';
import { Button } from '../../sharedComponents/button';
import ExploreCompareChart from '../../sharedComponents/exploreCompareChart/ExploreCompareChart';

import { timeZone } from '../../utils/helper';
import { exploreBldgMetrics, calculateDataConvertion, validateSeriesDataForBuildings } from './utils';
import { getAverageValue } from '../../helpers/AveragePercent';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { dateTimeFormatForHighChart, formatXaxisForHighCharts, getPastDateRange } from '../../helpers/helpers';
import { fetchExploreByBuildingListV2, fetchExploreBuildingChart } from '../explore/services';
import { handleUnitConverstion } from '../settings/general-settings/utils';
import { getExploreByBuildingTableCSVExport } from '../../utils/tablesExport';
import { FILTER_TYPES } from '../../sharedComponents/dataTableWidget/constants';
import SkeletonLoader from '../../components/SkeletonLoader';

import './style.css';
import './styles.scss';

const ExploreByBuildings = () => {
    const { download } = useCSVDownload();

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefUnits = UserStore.useState((s) => s.unit);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [totalItems, setTotalItems] = useState(0);
    const [checkedAll, setCheckedAll] = useState(false);

    const [seriesData, setSeriesData] = useState([]);
    const [pastSeriesData, setPastSeriesData] = useState([]);

    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedBldgIds, setSelectedBldgIds] = useState([]);
    const [exploreBuildingsList, setExploreBuildingsList] = useState([]);

    const [isFilterFetching, setFetchingFilters] = useState(false);
    const [isFetchingChartData, setFetchingChartData] = useState(false);
    const [isFetchingPastChartData, setFetchingPastChartData] = useState(false);
    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);

    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    let top = '';
    let bottom = '';

    const defaultMetric = exploreBldgMetrics[0];
    const [selectedMetrics, setSelectedMetrics] = useState([defaultMetric]);
    const [metrics, setMetrics] = useState([defaultMetric]);

    const [topEnergyConsumption, setTopEnergyConsumption] = useState(0);
    const [bottomEnergyConsumption, setBottomEnergyConsumption] = useState(0);
    const [topPerChange, setTopPerChange] = useState(0);
    const [bottomPerChange, setBottomPerChange] = useState(0);
    const [topSquareFootage, setTopSquareFootage] = useState(0);
    const [bottomSquareFootage, setBottomSquareFootage] = useState(0);

    const [minConValue, set_minConValue] = useState(0);
    const [maxConValue, set_maxConValue] = useState(0);
    const [minPerValue, set_minPerValue] = useState(0);
    const [maxPerValue, set_maxPerValue] = useState(0);
    const [minSqftValue, set_minSqftValue] = useState(0);
    const [maxSqftValue, set_maxSqftValue] = useState(0);
    const [conAPIFlag, setConAPIFlag] = useState('');
    const [perAPIFlag, setPerAPIFlag] = useState('');
    const [sqftAPIFlag, setSqftAPIFlag] = useState('');
    const [selectedBuildingType, setSelectedBuildingType] = useState([]);
    const [buildingTypeList, setBuildingTypeList] = useState([]);
    const [currentButtonId, setCurrentButtonId] = useState(0);
    const [isopened, setIsOpened] = useState(false);
    const [topVal, setTopVal] = useState(0);
    const [bottomVal, setBottomVal] = useState(0);
    const [shouldRender, setShouldRender] = useState(true);

    const [selectedUnit, setSelectedUnit] = useState(exploreBldgMetrics[0].unit);
    const [selectedConsumptionLabel, setSelectedConsumptionLabel] = useState(exploreBldgMetrics[0]?.Consumption);
    const [selectedConsumption, setConsumption] = useState(exploreBldgMetrics[0]?.value);

    const [isInComparisonMode, setComparisonMode] = useState(false);

    const toggleComparision = () => {
        setComparisonMode(!isInComparisonMode);
        UserStore.update((s) => {
            s.showNotification = true;
            s.notificationMessage = isInComparisonMode ? 'Comparison Mode turned OFF' : 'Comparison Mode turned ON';
            s.notificationType = 'success';
        });
    };

    const handleMenuClose = () => setMetrics(selectedMetrics);
    const handleMetricsChange = (selectedOptions) => setSelectedMetrics(selectedOptions);

    const handleUnitChange = (value) => {
        const obj = exploreBldgMetrics.find((record) => record?.value === value);
        setSelectedUnit(obj?.unit);
    };

    const handleConsumptionChange = (value) => {
        const obj = exploreBldgMetrics.find((record) => record?.value === value);
        setSelectedConsumptionLabel(obj?.Consumption);
    };

    const currentRow = () => {
        return exploreBuildingsList;
    };

    const renderBuildingName = (row) => {
        return (
            <div style={{ fontSize: 0 }}>
                <Link
                    to={`/explore-page/by-equipment/${row?.building_id}`}
                    className="typography-wrapper link mouse-pointer"
                    onClick={() => {
                        updateBuildingStore(row?.building_id, row?.building_name, row?.timezone, row?.plug_only);
                    }}>
                    {row?.building_name}
                </Link>
                <Brick sizeInPixels={3} />
            </div>
        );
    };

    const renderSquareFootage = useCallback((row) => {
        const value = Math.round(handleUnitConverstion(row?.square_footage, row?.user_pref_units));
        const unit = `${row?.user_pref_units === `si` ? `Sq.M.` : `Sq.Ft.`}`;
        return <Typography.Body size={Typography.Sizes.sm}>{`${value} ${unit}`}</Typography.Body>;
    });

    const renderConsumption = useCallback((row) => {
        const energyValue = row?.energy_consumption?.now / 1000;
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>
                    {energyValue ? Math.round(energyValue) : 0} kWh
                </Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={getAverageValue(energyValue ? energyValue : 0, bottom, top)} />
            </>
        );
    });

    const renderPerChange = useCallback((row) => {
        return (
            <TrendsBadge
                value={Math.abs(Math.round(row?.energy_consumption?.change))}
                type={
                    row?.energy_consumption?.now < row?.energy_consumption?.old
                        ? TrendsBadge.Type.DOWNWARD_TREND
                        : TrendsBadge.Type.UPWARD_TREND
                }
            />
        );
    });

    const [tableHeader, setTableHeader] = useState([
        {
            name: 'Name',
            accessor: 'building_name',
            callbackValue: renderBuildingName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Energy Consumption',
            accessor: 'total_consumption',
            callbackValue: renderConsumption,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: '% Change',
            accessor: 'change',
            callbackValue: renderPerChange,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Square Footage',
            accessor: 'square_footage',
            callbackValue: renderSquareFootage,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Building Type',
            accessor: 'building_type',
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ]);

    const handleDownloadCsv = async () => {
        setDownloadingCSVData(true);
        const ordered_by = sortBy.name === undefined || sortBy.method === null ? 'total_consumption' : sortBy.name;
        const sort_by = sortBy.method === undefined || sortBy.method === null ? 'dce' : sortBy.method;
        const start_date = encodeURIComponent(startDate);
        const end_date = encodeURIComponent(endDate);

        let params = `?date_from=${start_date}&date_to=${end_date}&tz_info=${timeZone}&metric=energy`;

        if (ordered_by) params = params.concat(`&ordered_by=${ordered_by}`);
        if (sort_by) params = params.concat(`&sort_by=${sort_by}`);

        await fetchExploreByBuildingListV2(params)
            .then((res) => {
                const responseData = res?.data?.data;
                download(
                    `Explore_By_Building_${new Date().toISOString().split('T')[0]}`,
                    getExploreByBuildingTableCSVExport(responseData, tableHeader, userPrefUnits)
                );
                if (res?.data?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = res?.data?.success
                            ? 'CSV export completed successfully.'
                            : 'Data failed to export in CSV.';
                        s.notificationType = res?.data?.success ? 'success' : 'error';
                    });
                }
            })
            .catch((error) => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Data failed to export in CSV.';
                    s.notificationType = 'error';
                });
            })
            .finally(() => {
                setDownloadingCSVData(false);
            });
    };

    const exploreByBuildingDataFetch = async () => {
        setFetchingFilters(true);
        setIsExploreDataLoading(true);
        setExploreBuildingsList([]);

        const ordered_by = sortBy.name === undefined || sortBy.method === null ? 'total_consumption' : sortBy.name;
        const sort_by = sortBy.method === undefined || sortBy.method === null ? 'dce' : sortBy.method;
        const start_date = encodeURIComponent(startDate);
        const end_date = encodeURIComponent(endDate);

        let params = `?date_from=${start_date}&date_to=${end_date}&tz_info=${timeZone}&metric=energy`;

        if (search) params = params.concat(`&building_search=${encodeURIComponent(search)}`);
        if (ordered_by) params = params.concat(`&ordered_by=${ordered_by}`);
        if (sort_by) params = params.concat(`&sort_by=${sort_by}`);
        if (selectedBuildingType.length !== 0) {
            const buildingTypesSelected = encodeURIComponent(selectedBuildingType.join('+'));
            params.concat(`&building_type=${buildingTypesSelected}`);
        }

        if (conAPIFlag !== '') {
            const gte = (minConValue - 1) * 1000;
            const lte = (maxConValue + 1) * 1000;
            params.concat(`&energy_consumption_lte=${lte}&energy_consumption_gte=${gte}`);
        }

        if (perAPIFlag !== '') {
            const gte = minPerValue - 0.5;
            const lte = maxPerValue + 0.5;
            params.concat(`&change_lte=${lte}&change_gte=${gte}`);
        }

        if (sqftAPIFlag !== '') {
            const gte = minSqftValue;
            const lte = maxSqftValue;
            params.concat(`&square_footage_lte=${lte}&square_footage_gte=${gte}`);
        }

        await fetchExploreByBuildingListV2(params)
            .then((res) => {
                let responseData = res?.data?.data;
                if (responseData.length !== 0) {
                    responseData.forEach((el) => {
                        el.user_pref_units = userPrefUnits;
                    });
                }
                setExploreBuildingsList(responseData);

                if (responseData) setTotalItems(responseData.length);

                if (responseData.length === 0) {
                    setSelectedBldgIds([]);
                    setSeriesData([]);
                } else {
                    setSelectedBldgIds((prevState) => {
                        return prevState.filter((id) => responseData.some((bldg) => bldg?.building_id === id));
                    });
                }

                const uniqueIds = [];
                const uniqueBuildingTypes = responseData.filter((element) => {
                    const isDuplicate = uniqueIds.includes(element.building_type);
                    if (!isDuplicate) {
                        uniqueIds.push(element.building_type);
                        return true;
                    }
                    return false;
                });
                setBuildingTypeList(uniqueBuildingTypes);
                const squareFootage =
                    userPrefUnits === `si`
                        ? Math.round(handleUnitConverstion(responseData[0].square_footage, userPrefUnits))
                        : responseData[0].square_footage;
                let topConsumption = responseData[0].energy_consumption.now;
                let bottomConsumption = responseData[0].energy_consumption.now;
                let topChange = responseData[0].energy_consumption.change;
                let bottomChange = responseData[0].energy_consumption.change;
                let topSqft = squareFootage;
                let bottomSqft = squareFootage;
                responseData.map((ele) => {
                    if (Number(ele?.energy_consumption.now) > topConsumption)
                        topConsumption = ele?.energy_consumption.now;
                    if (Number(ele?.energy_consumption.now) < bottomConsumption)
                        bottomConsumption = ele?.energy_consumption.now;
                    if (Number(ele?.energy_consumption.change) > topChange) topChange = ele?.energy_consumption.change;
                    if (Number(ele?.energy_consumption.change) < bottomChange)
                        bottomChange = ele?.energy_consumption.change;
                    if (Number(ele?.square_footage) > topSqft)
                        topSqft = Math.round(handleUnitConverstion(ele?.square_footage, userPrefUnits));
                    if (Number(ele?.square_footage) < bottomSqft)
                        bottomSqft = Math.round(handleUnitConverstion(ele?.square_footage, userPrefUnits));
                });
                top = topConsumption / 1000;
                bottom = bottomConsumption / 1000;
                if (top === bottom) {
                    bottom = 0;
                }
                set_minConValue(Math.abs(Math.round(bottomConsumption / 1000)));
                setBottomEnergyConsumption(Math.abs(Math.round(bottomConsumption / 1000)));
                set_maxConValue(
                    Math.abs(
                        topConsumption === bottomConsumption
                            ? Math.round(topConsumption / 1000) + 1
                            : Math.round(topConsumption / 1000)
                    )
                );
                setTopVal(Math.round(topChange));
                setBottomVal(Math.round(bottomChange));
                setTopEnergyConsumption(Math.abs(Math.round(topConsumption / 1000)));
                set_minPerValue(Math.round(bottomChange));
                setBottomPerChange(Math.round(bottomChange));
                set_maxPerValue(topChange === bottomChange ? Math.round(topChange) + 1 : Math.round(topChange));
                setTopPerChange(Math.round(topChange));
                set_minSqftValue(Math.abs(Math.round(bottomSqft)));
                setBottomSquareFootage(Math.abs(Math.round(bottomSqft)));
                setTopSquareFootage(Math.abs(Math.round(topSqft)));
                set_maxSqftValue(Math.abs(topSqft === bottomSqft ? Math.round(topSqft) + 1 : Math.round(topSqft)));

                setIsExploreDataLoading(false);
                setFetchingFilters(false);
            })
            .catch((error) => {
                setIsExploreDataLoading(false);
                setFetchingFilters(false);
            });
    };

    const fetchSingleBldgChartData = async (bldg_id, isComparisionOn = false) => {
        const start_date = encodeURIComponent(startDate);
        const end_date = encodeURIComponent(endDate);
        const time_zone = encodeURIComponent(timeZone);
        const params = `?date_from=${start_date}&date_to=${end_date}&tz_info=${time_zone}&metric=${selectedConsumption}`;

        let paramsForPastData = `?tz_info=${time_zone}&metric=${selectedConsumption}`;
        if (isComparisionOn) {
            const pastDateObj = getPastDateRange(startDate, daysCount);
            paramsForPastData += `&date_from=${encodeURIComponent(pastDateObj?.startDate)}&date_to=${encodeURIComponent(
                pastDateObj?.endDate
            )}`;
        }

        let promisesList = [];
        promisesList.push(fetchExploreBuildingChart(params, bldg_id));
        if (isComparisionOn) promisesList.push(fetchExploreBuildingChart(paramsForPastData, bldg_id));

        Promise.all(promisesList)
            .then((res) => {
                const response = res;

                response.forEach((record, index) => {
                    if (record?.status === 200 && record?.data?.success) {
                        const { data, metadata } = record?.data;

                        const bldgObj = exploreBuildingsList.find((el) => el?.building_id === bldg_id);
                        if (!bldgObj?.building_id || data.length === 0) return;

                        let recordToInsert = [];

                        if (
                            metadata?.device_types === 'shadow meter' &&
                            (selectedConsumption === 'current' || selectedConsumption === 'voltage')
                        ) {
                            if (selectedConsumption === 'current') {
                                const firstList = {
                                    id: bldgObj?.building_id,
                                    name: `${bldgObj?.building_name} - Amps_A`,
                                    data: [],
                                };
                                const secondList = {
                                    id: bldgObj?.building_id,
                                    name: `${bldgObj?.building_name} - Amps_B`,
                                    data: [],
                                };
                                const thirdList = {
                                    id: bldgObj?.building_id,
                                    name: `${bldgObj?.building_name} - Amps_C`,
                                    data: [],
                                };

                                data.map((el) => {
                                    if (el?.data === '' && el?.data !== 0) {
                                        firstList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                        secondList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                        thirdList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                    } else {
                                        firstList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: calculateDataConvertion(el?.data?.Amps_A, selectedConsumption),
                                        });
                                        secondList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: calculateDataConvertion(el?.data?.Amps_B, selectedConsumption),
                                        });
                                        thirdList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: calculateDataConvertion(el?.data?.Amps_C, selectedConsumption),
                                        });
                                    }
                                });

                                recordToInsert.push(firstList);
                                recordToInsert.push(secondList);
                                recordToInsert.push(thirdList);
                            }
                            if (selectedConsumption === 'voltage') {
                                const firstList = {
                                    id: bldgObj?.building_id,
                                    name: `${bldgObj?.building_name} - Volts_A_N`,
                                    data: [],
                                };
                                const secondList = {
                                    id: bldgObj?.building_id,
                                    name: `${bldgObj?.building_name} - Volts_B_N`,
                                    data: [],
                                };
                                const thirdList = {
                                    id: bldgObj?.building_id,
                                    name: `${bldgObj?.building_name} - Volts_C_N`,
                                    data: [],
                                };

                                data.map((el) => {
                                    if (el?.data === '' && el?.data !== 0) {
                                        firstList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                        secondList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                        thirdList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                    } else {
                                        firstList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: calculateDataConvertion(el?.data?.Volts_A_N, selectedConsumption),
                                        });
                                        secondList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: calculateDataConvertion(el?.data?.Volts_B_N, selectedConsumption),
                                        });
                                        thirdList.data.push({
                                            x: new Date(el?.time_stamp).getTime(),
                                            y: calculateDataConvertion(el?.data?.Volts_C_N, selectedConsumption),
                                        });
                                    }
                                });

                                recordToInsert.push(firstList);
                                recordToInsert.push(secondList);
                                recordToInsert.push(thirdList);
                            }
                        } else {
                            const newBldgMappedData = data.map((el) => ({
                                x: new Date(el?.time_stamp).getTime(),
                                y: calculateDataConvertion(el?.data, selectedConsumption),
                            }));

                            recordToInsert.push({
                                id: bldgObj?.building_id,
                                name: bldgObj?.building_name,
                                data: newBldgMappedData,
                            });
                        }

                        if (index === 0) setSeriesData([...seriesData, ...recordToInsert]);
                        if (index === 1) setPastSeriesData([...pastSeriesData, ...recordToInsert]);
                    } else {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = response?.message
                                ? response?.message
                                : res
                                ? 'Unable to fetch data for selected Building.'
                                : 'Unable to fetch data due to Internal Server Error!';
                            s.notificationType = 'error';
                        });
                    }
                });
            })
            .catch((err) => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to fetch data due to Internal Server Error!.';
                    s.notificationType = 'error';
                });
            });
    };

    const fetchMultipleBldgsChartData = async (
        start_date,
        end_date,
        data_type = 'energy',
        bldgIDs = [],
        requestType = 'currentData'
    ) => {
        if (start_date === null || end_date === null || !data_type || bldgIDs.length === 0) return;

        requestType === 'currentData' ? setFetchingChartData(true) : setFetchingPastChartData(true);

        const time_zone = encodeURIComponent(timeZone);
        const params = `?date_from=${start_date}&date_to=${end_date}&tz_info=${time_zone}&metric=${data_type}`;

        const promisesList = [];

        bldgIDs.forEach((id) => {
            promisesList.push(fetchExploreBuildingChart(params, id));
        });

        requestType === 'currentData' ? setSeriesData([]) : setPastSeriesData([]);

        Promise.all(promisesList)
            .then((res) => {
                const promiseResponse = res;

                if (promiseResponse?.length !== 0) {
                    const newResponse = [];

                    promiseResponse.forEach((record, index) => {
                        const response = record?.data;
                        const { metadata } = record?.data;
                        if (response?.success && response?.data.length !== 0) {
                            const bldgObj = exploreBuildingsList.find((el) => el?.building_id === bldgIDs[index]);
                            if (!bldgObj?.building_id) return;

                            if (
                                metadata?.device_types === 'shadow meter' &&
                                (selectedConsumption === 'current' || selectedConsumption === 'voltage')
                            ) {
                                if (selectedConsumption === 'current') {
                                    const firstList = {
                                        id: bldgObj?.building_id,
                                        name: `${bldgObj?.building_name} - Amps_A`,
                                        data: [],
                                    };
                                    const secondList = {
                                        id: bldgObj?.building_id,
                                        name: `${bldgObj?.building_name} - Amps_B`,
                                        data: [],
                                    };
                                    const thirdList = {
                                        id: bldgObj?.building_id,
                                        name: `${bldgObj?.building_name} - Amps_C`,
                                        data: [],
                                    };

                                    response.data.map((el) => {
                                        if (el?.data === '' && el?.data !== 0) {
                                            firstList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                            secondList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                            thirdList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                        } else {
                                            firstList.data.push({
                                                x: new Date(el?.time_stamp).getTime(),
                                                y: calculateDataConvertion(el?.data?.Amps_A, selectedConsumption),
                                            });
                                            secondList.data.push({
                                                x: new Date(el?.time_stamp).getTime(),
                                                y: calculateDataConvertion(el?.data?.Amps_B, selectedConsumption),
                                            });
                                            thirdList.data.push({
                                                x: new Date(el?.time_stamp).getTime(),
                                                y: calculateDataConvertion(el?.data?.Amps_C, selectedConsumption),
                                            });
                                        }
                                    });

                                    newResponse.push(firstList);
                                    newResponse.push(secondList);
                                    newResponse.push(thirdList);
                                }

                                if (selectedConsumption === 'voltage') {
                                    const firstList = {
                                        id: bldgObj?.building_id,
                                        name: `${bldgObj?.building_name} - Volts_A_N`,
                                        data: [],
                                    };
                                    const secondList = {
                                        id: bldgObj?.building_id,
                                        name: `${bldgObj?.building_name} - Volts_B_N`,
                                        data: [],
                                    };
                                    const thirdList = {
                                        id: bldgObj?.building_id,
                                        name: `${bldgObj?.building_name} - Volts_C_N`,
                                        data: [],
                                    };

                                    response.data.map((el) => {
                                        if (el?.data === '' && el?.data !== 0) {
                                            firstList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                            secondList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                            thirdList.data.push({ x: new Date(el?.time_stamp).getTime(), y: null });
                                        } else {
                                            firstList.data.push({
                                                x: new Date(el?.time_stamp).getTime(),
                                                y: calculateDataConvertion(el?.data?.Volts_A_N, selectedConsumption),
                                            });
                                            secondList.data.push({
                                                x: new Date(el?.time_stamp).getTime(),
                                                y: calculateDataConvertion(el?.data?.Volts_B_N, selectedConsumption),
                                            });
                                            thirdList.data.push({
                                                x: new Date(el?.time_stamp).getTime(),
                                                y: calculateDataConvertion(el?.data?.Volts_C_N, selectedConsumption),
                                            });
                                        }
                                    });

                                    newResponse.push(firstList);
                                    newResponse.push(secondList);
                                    newResponse.push(thirdList);
                                }
                            } else {
                                const newBldgsMappedData = response?.data.map((el) => ({
                                    x: new Date(el?.time_stamp).getTime(),
                                    y: calculateDataConvertion(el?.data, data_type),
                                }));

                                newResponse.push({
                                    id: bldgObj?.building_id,
                                    name: bldgObj?.building_name,
                                    data: newBldgsMappedData,
                                });
                            }
                        }
                    });

                    requestType === 'currentData' ? setSeriesData(newResponse) : setPastSeriesData(newResponse);
                }
            })
            .catch(() => {})
            .finally(() => {
                requestType === 'currentData' ? setFetchingChartData(false) : setFetchingPastChartData(false);
            });
    };

    const handleBuildingStateChange = (value, selectedBldg, isComparisionOn = false) => {
        if (value === 'true') {
            const newDataList = seriesData.filter((item) => item?.id !== selectedBldg?.building_id);
            setSeriesData(newDataList);

            if (isComparisionOn) {
                const newPastDataList = pastSeriesData.filter((item) => item?.id !== selectedBldg?.building_id);
                setPastSeriesData(newPastDataList);
            }
        }

        if (value === 'false') {
            if (selectedBldg?.building_id) fetchSingleBldgChartData(selectedBldg?.building_id, isComparisionOn);
        }

        const isAdding = value === 'false';
        setSelectedBldgIds((prevState) => {
            return isAdding
                ? [...prevState, selectedBldg?.building_id]
                : prevState.filter((buildId) => buildId !== selectedBldg?.building_id);
        });
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Portfolio Level',
                    path: '/explore-page/by-buildings',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'explore';
        });

        updateBuildingStore('portfolio', 'Portfolio', '');
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        if (userPrefUnits) {
            let newHeaderList = tableHeader;
            newHeaderList.forEach((record) => {
                if (record?.accessor === 'square_footage') {
                    record.name = `${userPrefUnits === 'si' ? `Square Meter` : `Square Footage`}`;
                }
            });
            setTableHeader(newHeaderList);
            setShouldRender((prev) => !prev); // This is set to trigger re-render for DataTableWidget component
        }
    }, [userPrefUnits]);

    useEffect(() => {
        if (startDate === null || endDate === null) return;

        exploreByBuildingDataFetch();
    }, [
        search,
        startDate,
        endDate,
        sortBy.method,
        sortBy.name,
        conAPIFlag,
        perAPIFlag,
        sqftAPIFlag,
        selectedBuildingType,
        userPrefUnits,
    ]);

    useEffect(() => {
        const shouldExecuteCode =
            (minConValue !== maxConValue && maxConValue !== 0) ||
            (minPerValue !== maxPerValue && maxPerValue !== 0) ||
            (minSqftValue !== maxSqftValue && maxSqftValue !== 0) ||
            perAPIFlag !== '';

        if (shouldExecuteCode) {
            const filterOptionsFetched = [
                {
                    label: 'Energy Consumption',
                    value: 'energy_consumption',
                    placeholder: 'All Consumptions',
                    filterType: FILTER_TYPES.RANGE_SELECTOR,
                    filterOptions: [minConValue, maxConValue],
                    componentProps: {
                        prefix: ' kWh',
                        title: 'Consumption',
                        min: bottomEnergyConsumption,
                        max: topEnergyConsumption + 1,
                        range: [minConValue, maxConValue],
                        withTrendsFilter: false,
                    },
                    onClose: function onClose(options) {
                        set_minConValue(options[0]);
                        set_maxConValue(options[1]);
                        setConAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        set_minConValue(bottomEnergyConsumption);
                        set_maxConValue(topEnergyConsumption);
                        setConAPIFlag('');
                    },
                },
                {
                    label: '% Change',
                    value: 'change',
                    placeholder: 'All % Change',
                    filterType: FILTER_TYPES.RANGE_SELECTOR,
                    filterOptions: [minPerValue, maxPerValue],
                    componentProps: {
                        prefix: ' %',
                        title: '% Change',
                        min: bottomVal,
                        max: topVal + 1,
                        range: [minPerValue, maxPerValue],
                        withTrendsFilter: true,
                        currentButtonId: currentButtonId,
                        handleButtonClick: function handleButtonClick() {
                            for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
                                args[_key] = arguments[_key];
                                if (args[0] === 0) {
                                    setIsOpened(true);
                                    setCurrentButtonId(0);
                                    setBottomVal(bottomPerChange);
                                    setTopVal(topPerChange + 1);
                                    set_minPerValue(bottomPerChange);
                                    set_maxPerValue(topPerChange + 1);
                                }
                                if (args[0] === 1) {
                                    setIsOpened(true);
                                    setCurrentButtonId(1);
                                    if (bottomPerChange < 0) {
                                        setBottomVal(bottomPerChange);
                                        setTopVal(0);
                                        set_minPerValue(bottomPerChange);
                                        set_maxPerValue(0);
                                    } else if (bottomPerChange >= 0) {
                                        setBottomVal(0);
                                        setTopVal(1);
                                        set_minPerValue(0);
                                        set_maxPerValue(0);
                                    }
                                }
                                if (args[0] === 2) {
                                    setIsOpened(true);
                                    setCurrentButtonId(2);
                                    if (topPerChange > 0) {
                                        setBottomVal(0);
                                        setTopVal(topPerChange);
                                        set_minPerValue(0);
                                        set_maxPerValue(topPerChange);
                                    } else if (bottomPerChange >= 0) {
                                        setBottomVal(0);
                                        setTopVal(1);
                                        set_minPerValue(0);
                                        set_maxPerValue(0);
                                    }
                                }
                            }
                        },
                    },
                    isOpened: isopened,
                    onClose: function onClose(options) {
                        setIsOpened(false);
                        set_minPerValue(options[0]);
                        set_maxPerValue(options[1]);
                        setPerAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        set_minPerValue(bottomPerChange);
                        set_maxPerValue(topPerChange);
                        setPerAPIFlag('');
                    },
                },
                {
                    label: `${userPrefUnits === 'si' ? `Square Meter` : `Square Footage`}`,
                    value: 'square_footage',
                    placeholder: `All ${userPrefUnits === 'si' ? `Square Meter` : `Square Footage`}`,
                    filterType: FILTER_TYPES.RANGE_SELECTOR,
                    filterOptions: [minSqftValue, maxSqftValue],
                    componentProps: {
                        prefix: ` ${userPrefUnits === 'si' ? `sq.m.` : `sq.ft.`}`,
                        title: `${userPrefUnits === 'si' ? `Square Meter` : `Square Footage`}`,
                        min: bottomSquareFootage,
                        max: topSquareFootage + 1,
                        range: [minSqftValue, maxSqftValue],
                        withTrendsFilter: false,
                    },
                    onClose: function onClose(options) {
                        set_minSqftValue(options[0]);
                        set_maxSqftValue(options[1]);
                        setSqftAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        set_minSqftValue(bottomSquareFootage);
                        set_maxSqftValue(topSquareFootage);
                        setSqftAPIFlag('');
                    },
                },
                {
                    label: 'Building Type',
                    value: 'building_type',
                    placeholder: 'All Building Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: buildingTypeList.map((filterItem) => ({
                        value: filterItem?.building_id,
                        label: filterItem?.building_type,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let buildingType = [];
                            for (let i = 0; i < opt.length; i++) {
                                buildingType.push(opt[i].value);
                            }
                            setSelectedBuildingType(buildingType);
                        }
                    },
                    onDelete: () => {
                        setSelectedBuildingType([]);
                    },
                },
            ];
            setFilterOptions(filterOptionsFetched);
        }
    }, [minConValue, maxConValue, minPerValue, maxPerValue, minSqftValue, maxSqftValue, perAPIFlag, userPrefUnits]);

    useEffect(() => {
        if (selectedBldgIds.length !== 0) {
            fetchMultipleBldgsChartData(startDate, endDate, selectedConsumption, selectedBldgIds, 'currentData');

            if (isInComparisonMode) {
                const pastDateObj = getPastDateRange(startDate, daysCount);
                fetchMultipleBldgsChartData(
                    pastDateObj?.startDate,
                    pastDateObj?.endDate,
                    selectedConsumption,
                    selectedBldgIds,
                    'pastData'
                );
            }
        }
    }, [startDate, endDate, selectedConsumption, userPrefUnits]);

    useEffect(() => {
        if (checkedAll) {
            if (exploreBuildingsList.length !== 0 && exploreBuildingsList.length <= 20) {
                const allBldgsIds = exploreBuildingsList.map((el) => el?.building_id);
                fetchMultipleBldgsChartData(startDate, endDate, selectedConsumption, allBldgsIds);
                setSelectedBldgIds(allBldgsIds);
            }
        }
        if (!checkedAll) {
            setSeriesData([]);
            setSelectedBldgIds([]);
        }
    }, [checkedAll]);

    useEffect(() => {
        if (isInComparisonMode) {
            const pastDateObj = getPastDateRange(startDate, daysCount);
            fetchMultipleBldgsChartData(
                pastDateObj?.startDate,
                pastDateObj?.endDate,
                selectedConsumption,
                selectedBldgIds,
                'pastData'
            );
        } else {
            setPastSeriesData([]);
        }
    }, [isInComparisonMode]);

    const dataToRenderOnChart = validateSeriesDataForBuildings(selectedBldgIds, exploreBuildingsList, seriesData);
    const pastDataToRenderOnChart = validateSeriesDataForBuildings(
        selectedBldgIds,
        exploreBuildingsList,
        pastSeriesData
    );

    let tooltipUnitVal = selectedUnit;

    if (selectedConsumption.includes('carbon')) {
        tooltipUnitVal =
            userPrefUnits === 'si'
                ? selectedConsumption === 'carbon_emissions'
                    ? 'kg'
                    : 'kg/MWh'
                : selectedConsumption === 'carbon_emissions'
                ? 'lbs'
                : 'lbs/MWh';
    }

    return (
        <>
            <Row className="d-flex justify-content-end">
                <div className="d-flex flex-column p-2" style={{ gap: '0.75rem' }}>
                    <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                        <Button
                            size={Button.Sizes.lg}
                            type={isInComparisonMode ? Button.Type.secondary : Button.Type.secondaryGrey}>
                            <Toggles
                                size={Toggles.Sizes.sm}
                                isChecked={isInComparisonMode}
                                onChange={toggleComparision}
                            />
                            <Typography.Subheader size={Typography.Sizes.lg} onClick={toggleComparision}>
                                Compare
                            </Typography.Subheader>
                        </Button>
                        <Select.Multi
                            defaultValue={selectedMetrics}
                            options={exploreBldgMetrics}
                            onChange={handleMetricsChange}
                            onMenuClose={handleMenuClose}
                            placeholder={`Select Metrics ...`}
                            selectType={`explore`}
                        />
                        <Header title="" type="page" />
                    </div>
                </div>
            </Row>

            <Row>
                <div className="explore-data-table-style p-2">
                    {isFetchingChartData || isFetchingPastChartData ? (
                        <div className="explore-chart-wrapper">
                            <div className="explore-chart-loader">
                                <Spinner color="primary" />
                            </div>
                        </div>
                    ) : (
                        <>
                            {isInComparisonMode ? (
                                <ExploreCompareChart
                                    title={''}
                                    subTitle={''}
                                    data={dataToRenderOnChart}
                                    pastData={pastDataToRenderOnChart}
                                    tooltipUnit={selectedUnit}
                                    tooltipLabel={selectedConsumptionLabel}
                                    timeIntervalObj={{
                                        startDate,
                                        endDate,
                                        daysCount,
                                    }}
                                    chartProps={{
                                        tooltip: {
                                            xDateFormat: dateTimeFormatForHighChart(
                                                userPrefDateFormat,
                                                userPrefTimeFormat
                                            ),
                                        },
                                    }}
                                />
                            ) : (
                                <ExploreChart
                                    title={''}
                                    subTitle={''}
                                    tooltipUnit={tooltipUnitVal}
                                    tooltipLabel={selectedConsumptionLabel}
                                    disableDefaultPlotBands={true}
                                    data={dataToRenderOnChart}
                                    pastData={pastDataToRenderOnChart}
                                    chartProps={{
                                        navigator: {
                                            outlineWidth: 0,
                                            adaptToUpdatedData: false,
                                            stickToMax: true,
                                        },
                                        plotOptions: {
                                            series: {
                                                states: {
                                                    inactive: {
                                                        opacity: 1,
                                                    },
                                                },
                                            },
                                        },
                                        xAxis: {
                                            gridLineWidth: 0,
                                            type: 'datetime',
                                            labels: {
                                                format: formatXaxisForHighCharts(
                                                    daysCount,
                                                    userPrefDateFormat,
                                                    userPrefTimeFormat,
                                                    selectedConsumption
                                                ),
                                            },
                                        },
                                        yAxis: [
                                            {
                                                gridLineWidth: 1,
                                                lineWidth: 1,
                                                opposite: false,
                                                lineColor: null,
                                            },
                                            {
                                                opposite: true,
                                                title: false,
                                                max: 120,
                                                postFix: '23',
                                                gridLineWidth: 0,
                                            },
                                        ],
                                        tooltip: {
                                            xDateFormat: dateTimeFormatForHighChart(
                                                userPrefDateFormat,
                                                userPrefTimeFormat
                                            ),
                                        },
                                    }}
                                />
                            )}
                        </>
                    )}
                </div>
            </Row>
            <Brick sizeInRem={0.75} />
            <Row>
                <div className="explore-data-table-style">
                    <Col lg={12}>
                        <DataTableWidget
                            id="explore-by-building"
                            isLoading={isExploreDataLoading}
                            isLoadingComponent={<SkeletonLoader noOfColumns={tableHeader.length + 1} noOfRows={10} />}
                            isFilterLoading={isFilterFetching}
                            onSearch={(e) => {
                                setSearch(e);
                                setCheckedAll(false);
                            }}
                            buttonGroupFilterOptions={[]}
                            rows={currentRow()}
                            searchResultRows={currentRow()}
                            filterOptions={filterOptions}
                            onDownload={() => handleDownloadCsv()}
                            isCSVDownloading={isCSVDownloading}
                            headers={tableHeader}
                            customCheckAll={() => (
                                <Checkbox
                                    label=""
                                    type="checkbox"
                                    id="building1"
                                    name="building1"
                                    checked={checkedAll}
                                    onChange={() => {
                                        setCheckedAll(!checkedAll);
                                    }}
                                    disabled={!exploreBuildingsList || exploreBuildingsList.length > 20}
                                />
                            )}
                            customCheckboxForCell={(record) => (
                                <Checkbox
                                    label=""
                                    type="checkbox"
                                    id="building_check"
                                    name="building_check"
                                    checked={selectedBldgIds.includes(record?.building_id)}
                                    value={selectedBldgIds.includes(record?.building_id)}
                                    onChange={(e) => {
                                        handleBuildingStateChange(e.target.value, record, isInComparisonMode);
                                    }}
                                />
                            )}
                            totalCount={(() => {
                                return totalItems;
                            })()}
                        />
                    </Col>
                </div>
            </Row>
        </>
    );
};

export default ExploreByBuildings;
