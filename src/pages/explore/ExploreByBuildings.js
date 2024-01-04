import React, { useState, useEffect, useCallback } from 'react';
import moment from 'moment';
import _ from 'lodash';
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
import SynchronizedCharts from '../../sharedComponents/synchronizedCharts';
import { TinyBarChart } from '../../sharedComponents/tinyBarChart';
import { TrendsBadge } from '../../sharedComponents/trendsBadge';

import { timeZone } from '../../utils/helper';
import { exploreBldgMetrics, calculateDataConvertion, validateSeriesDataForBuildings } from './utils';
import { getAverageValue } from '../../helpers/AveragePercent';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { formatXaxisForHighCharts } from '../../helpers/helpers';
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
    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedBldgIds, setSelectedBldgIds] = useState([]);
    const [exploreBuildingsList, setExploreBuildingsList] = useState([]);

    const [isFilterFetching, setFetchingFilters] = useState(false);
    const [isFetchingChartData, setFetchingChartData] = useState(false);
    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);

    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    let top = '';
    let bottom = '';

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

    const [synchronizedChartData, setSynchronizedChartData] = useState({
        xData: [],
        datasets: [],
    });

    const currentRow = () => {
        return exploreBuildingsList;
    };

    const handleMenuClose = () => setMetrics(selectedMetrics);
    const handleMetricsChange = (selectedOptions) => setSelectedMetrics(selectedOptions);

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

    const fetchSingleBldgChartData = async (bldg_id) => {
        if (metrics.length === 0) return;

        const start_date = encodeURIComponent(startDate);
        const end_date = encodeURIComponent(endDate);
        const time_zone = encodeURIComponent(timeZone);

        const promisesList = [];

        metrics.forEach((metric) => {
            let params = `?date_from=${start_date}&date_to=${end_date}&tz_info=${time_zone}&metric=${metric?.value}`;
            if (
                metric.value !== 'energy' ||
                metric.value !== 'carbon_emissions' ||
                metric.value !== 'generated_carbon_rate'
            ) {
                params += `&aggregate=hour`;
            }
            promisesList.push(fetchExploreBuildingChart(params, bldg_id));
        });

        Promise.all(promisesList)
            .then((res) => {
                const promiseResponse = res;
                const bldgObj = exploreBuildingsList.find((el) => el?.building_id === bldg_id);

                // Made copy of synced chart obj
                const previousSyncChartObj = _.cloneDeep(synchronizedChartData);

                if (promiseResponse && promiseResponse.length !== 0) {
                    promiseResponse.forEach((res, index) => {
                        const response = res?.data;

                        let metricObj = {
                            name: metrics[index].label,
                            data: [],
                            unit: metrics[index].unit,
                            metric: metrics[index].label,
                        };

                        if (response?.success) {
                            const { data } = response;
                            let timestamps = [];

                            const metricBldgDataObj = {
                                name: `${bldgObj?.building_name} - ${metrics[index].label}`,
                                data: [],
                            };

                            data.forEach((el) => {
                                if (index === 0 && synchronizedChartData?.xData.length === 0) {
                                    const time_format = userPrefTimeFormat === `24h` ? `HH:mm` : `hh:mm A`;
                                    const date_format = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM 'YY` : `MMM D 'YY`;

                                    timestamps.push(
                                        moment.utc(el?.time_stamp).format(`${date_format} @ ${time_format}`)
                                    );
                                }

                                metricBldgDataObj.data.push(calculateDataConvertion(el?.data, metrics[index]?.value));
                            });

                            if (index === 0 && synchronizedChartData?.xData.length === 0) {
                                previousSyncChartObj.xData = [...timestamps];
                            }

                            metricObj.data.push(metricBldgDataObj);
                        }

                        if (synchronizedChartData?.datasets.length === 0) {
                            previousSyncChartObj.datasets.push(metricObj);
                        } else {
                            previousSyncChartObj.datasets.forEach((el) => {
                                if (el?.name === metricObj?.metric) {
                                    el.data.push({
                                        name: metricObj?.data[0].name,
                                        data: metricObj?.data[0].data,
                                    });
                                }
                            });
                        }
                    });
                }
                setSynchronizedChartData(previousSyncChartObj);
            })
            .catch((err) => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to selected Building!';
                    s.notificationType = 'error';
                });
            });
    };

    const fetchMultipleBldgsChartData = async (start_date, end_date, selected_metrics = [], bldgIDs = []) => {
        if (start_date === null || end_date === null || selected_metrics.length === 0 || bldgIDs.length === 0) return;

        setFetchingChartData(true);

        setSynchronizedChartData({});

        let promisesList = [];
        let newMetricsMappedData = [];

        const time_zone = encodeURIComponent(timeZone);

        selected_metrics.forEach((metric) => {
            const params = `?date_from=${start_date}&date_to=${end_date}&tz_info=${time_zone}&metric=${metric?.value}`;

            let newMetricObj = {
                name: metric?.label,
                data: [],
                unit: metric?.unit,
                metric: metric?.label,
                value: metric?.value,
            };

            bldgIDs.forEach((bldg_id) => {
                const bldgObj = exploreBuildingsList.find((el) => el?.building_id === bldg_id);
                newMetricObj.data.push({
                    name: `${bldgObj?.building_name} - ${metric?.label}`,
                    data: [],
                });

                promisesList.push(fetchExploreBuildingChart(params, bldg_id));
            });

            newMetricsMappedData.push(newMetricObj);
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
                            console.log('Sudhanshu data => ', data);
                            console.log('Sudhanshu response_index => ', response_index);

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
                                    calculateDataConvertion(el?.data, metrics[response_index]?.value)
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

                    newMetricsMappedData.forEach((metric_obj, metric_index) => {
                        metric_obj.data.forEach((building_obj, building_index) => {
                            building_obj.data = resultArray[metric_index][building_index];
                        });
                    });

                    newSyncChartObj.datasets = newMetricsMappedData;
                    setSynchronizedChartData(newSyncChartObj);
                }
            })
            .catch(() => {})
            .finally(() => {
                setFetchingChartData(false);
            });
    };

    const handleBuildingStateChange = (value, selectedBldg) => {
        if (value === 'true') {
            const newDataList = seriesData.filter((item) => item?.id !== selectedBldg?.building_id);
            setSeriesData(newDataList);
        }

        if (value === 'false') {
            if (selectedBldg?.building_id) fetchSingleBldgChartData(selectedBldg?.building_id);
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
        if (selectedBldgIds.length !== 0 && metrics.length !== 0) {
            fetchMultipleBldgsChartData(startDate, endDate, metrics, selectedBldgIds);
        }
    }, [startDate, endDate, metrics, userPrefUnits]);

    useEffect(() => {
        if (checkedAll) {
            if (exploreBuildingsList.length !== 0 && exploreBuildingsList.length <= 20) {
                const allBldgsIds = exploreBuildingsList.map((el) => el?.building_id);
                fetchMultipleBldgsChartData(startDate, endDate, metrics[0]?.value, allBldgsIds);
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
            <Row className="explore-filters-style p-2">
                <div className="mr-2">
                    <Select.Multi
                        defaultValue={selectedMetrics}
                        options={exploreBldgMetrics}
                        onChange={handleMetricsChange}
                        onMenuClose={handleMenuClose}
                        placeholder={`Select Metrics ...`}
                        selectType={`explore`}
                    />
                </div>
                <Header title="" type="page" />
            </Row>

            <Row>
                <div className="explore-data-table-style p-2">
                    {isFetchingChartData ? (
                        <div className="explore-chart-wrapper">
                            <div className="explore-chart-loader">
                                <Spinner color="primary" />
                            </div>
                        </div>
                    ) : (
                        <SynchronizedCharts
                            syncChartData={synchronizedChartData}
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
                                        handleBuildingStateChange(e.target.value, record);
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
