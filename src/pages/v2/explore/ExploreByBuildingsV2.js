import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import moment from 'moment';
import { Row, Col, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';

import { UserStore } from '../../../store/UserStore';
import { DateRangeStore } from '../../../store/DateRangeStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { updateBuildingStore } from '../../../helpers/updateBuildingStore';

import Header from '../../../components/Header';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import SkeletonLoader from '../../../components/SkeletonLoader';
import Select from '../../../sharedComponents/form/select';
import Typography from '../../../sharedComponents/typography';
import { TinyBarChart } from '../../../sharedComponents/tinyBarChart';
import { TrendsBadge } from '../../../sharedComponents/trendsBadge';
import Toggles from '../../../sharedComponents/toggles/Toggles';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../../sharedComponents/form/checkbox';
import SynchronizedCharts from '../../../sharedComponents/synchronizedCharts';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';

import ExploreAlert from './ExploreAlert';

import { timeZone } from '../../../utils/helper';
import { getAverageValue } from '../../../helpers/AveragePercent';
import { formatXaxisForHighCharts, getPastDateRange, handleAPIRequestParams } from '../../../helpers/helpers';

import { handleUnitConverstion } from '../../settings/general-settings/utils';
import { FILTER_TYPES } from '../../../sharedComponents/dataTableWidget/constants';
import { exploreBldgMetrics, calculateDataConvertion, validateSeriesDataForBuildings } from './utils';
import { getColorBasedOnIndex } from '../../../sharedComponents/synchronizedCharts/utils';

import { getWeatherData } from '../../../services/weather';
import { getExploreByBuildingTableCSVExport } from '../../../utils/tablesExport';
import { fetchExploreByBuildingListV2, fetchExploreBuildingChart } from '../explore/services';

import './style.css';
import './styles.scss';

const ExploreByBuildingsV2 = () => {
    const { download } = useCSVDownload();

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const startTime = DateRangeStore.useState((s) => s.startTime);
    const endTime = DateRangeStore.useState((s) => s.endTime);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefUnits = UserStore.useState((s) => s.unit);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [totalItems, setTotalItems] = useState(0);
    const [checkedAll, setCheckedAll] = useState(false);

    const [seriesData, setSeriesData] = useState([]);
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedBldgIds, setSelectedBldgIds] = useState([]);
    const [exploreBuildingsList, setExploreBuildingsList] = useState([]);

    const [isFilterFetching, setFetchingFilters] = useState(false);

    const [isFetchingChartData, setFetchingChartData] = useState(false);
    const [isFetchingPastChartData, setFetchingPastChartData] = useState(false);

    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);

    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    const [showAlert, setModalAlert] = useState(false);
    const handleModalClose = () => setModalAlert(false);
    const handleModalOpen = () => setModalAlert(true);

    let top = '';
    let bottom = '';

    const defaultExploreChartObj = {
        xData: [],
        datasets: [],
    };

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

    const defaultMetric = exploreBldgMetrics[0];
    const [selectedMetrics, setSelectedMetrics] = useState([defaultMetric]);
    const [metrics, setMetrics] = useState([defaultMetric]);

    const [isInComparisonMode, setComparisonMode] = useState(false);

    const [synchronizedChartData, setSynchronizedChartData] = useState(defaultExploreChartObj);
    const [pastSynchronizedChartData, setPastSynchronizedChartData] = useState(defaultExploreChartObj);

    const currentRow = () => {
        return exploreBuildingsList;
    };

    const handleMenuClose = () => {
        // When Unselecting Metrics
        if (selectedMetrics.length < metrics.length) {
            const newDataSets = synchronizedChartData.datasets.filter((data) =>
                selectedMetrics.some((metric) => metric?.label === data?.name)
            );
            const newPastDataSets = pastSynchronizedChartData.datasets.filter((data) =>
                selectedMetrics.some((metric) => metric?.label === data?.name)
            );
            if (newDataSets) {
                setSynchronizedChartData((prevChartData) => ({
                    ...prevChartData,
                    datasets: newDataSets,
                }));
            }
            if (newPastDataSets) {
                setPastSynchronizedChartData((prevChartData) => ({
                    ...prevChartData,
                    datasets: newPastDataSets,
                }));
            }
        }

        setMetrics(selectedMetrics);
    };

    const handleMetricsChange = (selectedOptions) => setSelectedMetrics(selectedOptions);

    const toggleComparision = () => {
        setComparisonMode(!isInComparisonMode);
        UserStore.update((s) => {
            s.showNotification = true;
            s.notificationMessage = isInComparisonMode ? 'Comparison Mode turned OFF' : 'Comparison Mode turned ON';
            s.notificationType = 'success';
        });
    };

    const renderBuildingName = (row) => {
        return (
            <div style={{ fontSize: 0 }}>
                <Link
                    to={`/explore/building/overview/${row?.building_id}/${EXPLORE_FILTER_TYPE.NO_GROUPING}`}
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

        const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);
        const start_date = encodeURIComponent(dateFrom);
        const end_date = encodeURIComponent(dateTo);

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

        const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);
        const start_date = encodeURIComponent(dateFrom);
        const end_date = encodeURIComponent(dateTo);

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

    const fetchSingleBldgChartData = async (
        startDate,
        endDate,
        bldg_id,
        requestType = 'currentData',
        selected_metrics = []
    ) => {
        if (metrics.length === 0) return;
        const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);
        const start_date = encodeURIComponent(dateFrom);
        const end_date = encodeURIComponent(dateTo);
        const time_zone = encodeURIComponent(timeZone);
        const currentChartData = requestType === 'currentData' ? synchronizedChartData : pastSynchronizedChartData;
        const selectedRecordCount = currentChartData?.datasets[0]?.data.length ?? 0;

        const promisesList = [];

        selected_metrics.forEach((metric) => {
            let params = `?date_from=${start_date}&date_to=${end_date}&tz_info=${time_zone}&metric=${metric?.value}`;

            if (metric?.value === 'weather') {
                promisesList.push(
                    getWeatherData({
                        date_from: start_date,
                        date_to: end_date,
                        tz_info: time_zone,
                        bldg_id,
                        range: 'hour',
                    })
                );
            } else {
                const isMetricValid = ['energy', 'carbon_emissions', 'generated_carbon_rate'].includes(metric?.value);
                if (!isMetricValid) params += `&aggregate=hour`;
                promisesList.push(fetchExploreBuildingChart(params, bldg_id));
            }
        });

        Promise.all(promisesList)
            .then((res) => {
                const promiseResponse = res;
                const bldgObj = exploreBuildingsList.find((el) => el?.building_id === bldg_id);

                // Made copy of synced chart obj
                const previousSyncChartObj = _.cloneDeep(currentChartData);

                if (promiseResponse && promiseResponse.length !== 0) {
                    promiseResponse.forEach((res, index) => {
                        const response = res?.data;

                        let metricObj = {
                            name: selected_metrics[index].label,
                            data: [],
                            unit: selected_metrics[index].unit,
                            metric: selected_metrics[index].label,
                        };

                        if (response?.success) {
                            const { data } = response;

                            let timestamps = [];

                            const metricBldgDataObj = {
                                id: bldg_id,
                                name: `${bldgObj?.building_name} - ${selected_metrics[index].label}`,
                                chart_unit: selected_metrics[index].unit,
                                chart_color: getColorBasedOnIndex(selectedRecordCount),
                                data: [],
                            };

                            data.forEach((el) => {
                                if (index === 0 && currentChartData?.xData.length === 0) {
                                    const time_format = userPrefTimeFormat === `24h` ? `HH:mm` : `hh:mm A`;
                                    const date_format = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM 'YY` : `MMM D 'YY`;

                                    timestamps.push(
                                        moment.utc(el?.time_stamp).format(`${date_format} @ ${time_format}`)
                                    );
                                }

                                metricBldgDataObj.data.push(
                                    calculateDataConvertion(
                                        selected_metrics[index]?.value === 'weather' ? el?.temp_f : el?.data,
                                        selected_metrics[index]?.value
                                    )
                                );
                            });

                            if (index === 0 && currentChartData?.xData.length === 0) {
                                previousSyncChartObj.xData = [...timestamps];
                            }

                            metricObj.data.push(metricBldgDataObj);
                        }

                        if (currentChartData?.datasets.length === 0) {
                            previousSyncChartObj.datasets.push(metricObj);
                        } else {
                            previousSyncChartObj.datasets.forEach((el) => {
                                if (el?.name === metricObj?.metric) {
                                    el.data.push({
                                        id: bldg_id,
                                        name: metricObj?.data[0].name,
                                        chart_unit: metricObj?.unit,
                                        chart_color: getColorBasedOnIndex(selectedRecordCount),
                                        data: metricObj?.data[0].data,
                                    });
                                }
                            });
                        }
                    });
                }

                if (requestType === 'currentData') setSynchronizedChartData(previousSyncChartObj);
                if (requestType === 'pastData') setPastSynchronizedChartData(previousSyncChartObj);
            })
            .catch((err) => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to selected Building!';
                    s.notificationType = 'error';
                });
            });
    };

    const fetchMultipleBldgsChartData = async (
        start_date,
        end_date,
        selected_metrics = [],
        bldgIDs = [],
        requestType = 'currentData'
    ) => {
        if (start_date === null || end_date === null || selected_metrics.length === 0 || bldgIDs.length === 0) return;

        requestType === 'currentData' ? setFetchingChartData(true) : setFetchingPastChartData(true);

        setSynchronizedChartData(defaultExploreChartObj);
        setPastSynchronizedChartData(defaultExploreChartObj);

        let promisesList = [];
        let formattedMetrics = [];
        let apiRequestListToTrack = [];

        const { dateFrom, dateTo } = handleAPIRequestParams(start_date, end_date, startTime, endTime);
        const time_zone = encodeURIComponent(timeZone);

        selected_metrics.forEach((metric) => {
            const params = `?date_from=${encodeURIComponent(dateFrom)}&date_to=${encodeURIComponent(
                dateTo
            )}&tz_info=${time_zone}&metric=${metric?.value}`;

            let newMetricObj = {
                name: metric?.label,
                data: [],
                unit: metric?.unit,
                metric: metric?.label,
                value: metric?.value,
            };

            bldgIDs.forEach((bldg_id, index) => {
                const bldgObj = exploreBuildingsList.find((el) => el?.building_id === bldg_id);

                apiRequestListToTrack.push({
                    bldgId: bldg_id,
                    metricsType: metric?.value,
                });

                newMetricObj.data.push({
                    id: bldg_id,
                    name: `${bldgObj?.building_name} - ${metric?.label}`,
                    chart_unit: metric?.unit,
                    chart_color: getColorBasedOnIndex(index),
                    data: [],
                });

                if (metric?.value === 'weather') {
                    promisesList.push(
                        getWeatherData({
                            date_from: encodeURIComponent(dateFrom),
                            date_to: encodeURIComponent(dateTo),
                            tz_info: time_zone,
                            bldg_id,
                            range: 'hour',
                        })
                    );
                } else {
                    promisesList.push(fetchExploreBuildingChart(params, bldg_id));
                }
            });

            formattedMetrics.push(newMetricObj);
        });

        Promise.all(promisesList)
            .then((res) => {
                const promiseResponse = res;

                let newSyncChartObj = {
                    xData: [],
                    datasets: [],
                };

                if (promiseResponse && promiseResponse.length !== 0) {
                    let dataList = [];

                    promiseResponse.forEach((response, response_index) => {
                        if (response?.status === 200 && response?.data?.success) {
                            const { data } = response?.data;

                            let newFormattedData = [];

                            data.forEach((el) => {
                                if (response_index === 0) {
                                    const time_format = userPrefTimeFormat === `24h` ? `HH:mm` : `hh:mm A`;
                                    const date_format = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM 'YY` : `MMM D 'YY`;

                                    newSyncChartObj.xData.push(
                                        moment.utc(el?.time_stamp).format(`${date_format} @ ${time_format}`)
                                    );
                                }

                                newFormattedData.push(
                                    calculateDataConvertion(
                                        apiRequestListToTrack[response_index]?.metricsType === 'weather'
                                            ? el?.temp_f
                                            : el?.data,
                                        apiRequestListToTrack[response_index]?.metricsType
                                    )
                                );
                            });

                            dataList.push(newFormattedData);
                        }
                    });

                    let resultArray = [];
                    const chunkSize = bldgIDs.length;

                    for (let i = 0; i < dataList.length; i += chunkSize) {
                        const chunk = dataList.slice(i, i + chunkSize);
                        resultArray.push(chunk);
                    }

                    formattedMetrics.forEach((metric_obj, metric_index) => {
                        metric_obj.data.forEach((building_obj, building_index) => {
                            building_obj.data = resultArray[metric_index][building_index];
                        });
                    });

                    newSyncChartObj.datasets = formattedMetrics;

                    if (requestType === 'currentData') setSynchronizedChartData(newSyncChartObj);
                    if (requestType === 'pastData') setPastSynchronizedChartData(newSyncChartObj);
                }
            })
            .catch(() => {})
            .finally(() => {
                requestType === 'currentData' ? setFetchingChartData(false) : setFetchingPastChartData(false);
            });
    };

    const filterUnselectedData = (currentChartData, bldg_id) => {
        const chartData = _.cloneDeep(currentChartData);

        if (chartData.datasets) {
            chartData.datasets.forEach((record) => {
                const { data } = record;
                if (data) {
                    record.data = data.filter((el) => el.id !== bldg_id);
                    record.data.forEach((el, index) => {
                        el.chart_color = getColorBasedOnIndex(index);
                    });
                }
            });
        }

        return chartData;
    };

    const handleBuildingStateChange = (value, selectedBldg, isComparisionOn = false, selected_metrics = []) => {
        if (selected_metrics.length === 0) {
            handleModalOpen();
            return;
        }

        if (value === 'true') {
            const newDataSet = filterUnselectedData(synchronizedChartData, selectedBldg?.building_id);
            const newPastDataSet = filterUnselectedData(pastSynchronizedChartData, selectedBldg?.building_id);

            if (newDataSet) setSynchronizedChartData(newDataSet);
            if (newPastDataSet) setPastSynchronizedChartData(newPastDataSet);
        }

        if (value === 'false') {
            if (selectedBldg?.building_id && selected_metrics.length !== 0) {
                fetchSingleBldgChartData(
                    startDate,
                    endDate,
                    selectedBldg?.building_id,
                    'currentData',
                    selected_metrics
                );

                if (isComparisionOn) {
                    const pastDateObj = getPastDateRange(startDate, daysCount);
                    fetchSingleBldgChartData(
                        pastDateObj?.startDate,
                        pastDateObj?.endDate,
                        selectedBldg?.building_id,
                        'pastData',
                        selected_metrics
                    );
                }
            }
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
                    path: '/explore/portfolio/overview',
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
        startTime,
        endTime,
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
        if (selectedBldgIds.length !== 0 && metrics.length !== 0) {
            fetchMultipleBldgsChartData(startDate, endDate, metrics, selectedBldgIds, 'currentData');

            if (isInComparisonMode) {
                const pastDateObj = getPastDateRange(startDate, daysCount);
                fetchMultipleBldgsChartData(
                    pastDateObj?.startDate,
                    pastDateObj?.endDate,
                    metrics,
                    selectedBldgIds,
                    'pastData'
                );
            }
        }
    }, [
        startDate,
        endDate,
        startTime,
        endTime,
        metrics,
        userPrefDateFormat,
        userPrefTimeFormat,
        userPrefUnits,
        isInComparisonMode,
    ]);

    useEffect(() => {
        if (checkedAll) {
            if (exploreBuildingsList.length !== 0 && exploreBuildingsList.length <= 20) {
                const allBldgsIds = exploreBuildingsList.map((el) => el?.building_id);
                fetchMultipleBldgsChartData(startDate, endDate, metrics, allBldgsIds);
                setSelectedBldgIds(allBldgsIds);
            }
        }
        if (!checkedAll) {
            setSeriesData([]);
            setSelectedBldgIds([]);
        }
    }, [checkedAll]);

    const dataToRenderOnChart = validateSeriesDataForBuildings(selectedBldgIds, exploreBuildingsList, seriesData);

    let tooltipUnitVal = metrics[0]?.unit;

    if (metrics[0]?.value.includes('carbon')) {
        tooltipUnitVal =
            userPrefUnits === 'si'
                ? metrics[0]?.value === 'carbon_emissions'
                    ? 'kg'
                    : 'kg/MWh'
                : metrics[0]?.value === 'carbon_emissions'
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
                        <SynchronizedCharts
                            currentChartData={synchronizedChartData}
                            pastChartData={pastSynchronizedChartData}
                            isComparisionOn={isInComparisonMode}
                            xAxisLabels={formatXaxisForHighCharts(
                                daysCount,
                                userPrefDateFormat,
                                userPrefTimeFormat,
                                'energy'
                            )}
                        />
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
                                    // disabled={!exploreBuildingsList || exploreBuildingsList.length > 20}
                                    disabled={true}
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
                                        handleBuildingStateChange(
                                            e.target.value,
                                            record,
                                            isInComparisonMode,
                                            selectedMetrics
                                        );
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

            <ExploreAlert
                isModalOpen={showAlert}
                onCancel={handleModalClose}
                title={`Metric Selection Required`}
                message={`Kindly choose the Metric type to access data for the Building.`}
            />
        </>
    );
};

export default ExploreByBuildingsV2;
