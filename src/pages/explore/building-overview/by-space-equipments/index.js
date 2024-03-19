import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { Row, UncontrolledTooltip, Progress, Spinner } from 'reactstrap';

import { UserStore } from '../../../../store/UserStore';
import { DateRangeStore } from '../../../../store/DateRangeStore';
import { BuildingStore } from '../../../../store/BuildingStore';
import { ComponentStore } from '../../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../../store/BreadcrumbStore';

import SkeletonLoader from '../../../../components/SkeletonLoader';
import Brick from '../../../../sharedComponents/brick';
import { Badge } from '../../../../sharedComponents/badge';
import { Checkbox } from '../../../../sharedComponents/form/checkbox';
import { DataTableWidget } from '../../../../sharedComponents/dataTableWidget';
import { TrendsBadge } from '../../../../sharedComponents/trendsBadge';
import useCSVDownload from '../../../../sharedComponents/hooks/useCSVDownload';
import Typography from '../../../../sharedComponents/typography';

import ExploreChart from '../../../../sharedComponents/exploreChart/ExploreChart';
import ExploreCompareChart from '../../../../sharedComponents/exploreCompareChart/ExploreCompareChart';

import { fetchExploreEquipmentsBySpace, fetchExploreSpaceChart } from './services';

import {
    dateTimeFormatForHighChart,
    formatConsumptionValue,
    formatXaxisForHighCharts,
    getPastDateRange,
    handleAPIRequestParams,
    pageListSizes,
} from '../../../../helpers/helpers';
import { getExploreByEquipmentTableCSVExport } from '../../../../utils/tablesExport';
import { UNITS } from '../../../../constants/units';

import '../../style.css';
import '../../styles.scss';
import { Button } from '../../../../sharedComponents/button';
import { Toggles } from '../../../../sharedComponents/toggles';
import Select from '../../../../sharedComponents/form/select';
import Header from '../../../../components/Header';
import { exploreBldgMetrics, truncateString, validateSeriesDataForEquipments } from '../../utils';
import { fetchExploreEquipmentList } from '../../services';

const ExploreEquipmentBySpace = () => {
    const { download } = useCSVDownload();
    const { bldgId, spaceId } = useParams();
    console.log('SSR bldgId => ', bldgId);
    console.log('SSR spaceId => ', spaceId);

    const bldgName = BuildingStore.useState((s) => s.BldgName);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const startTime = DateRangeStore.useState((s) => s.startTime);
    const endTime = DateRangeStore.useState((s) => s.endTime);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefUnits = UserStore.useState((s) => s.unit);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    // Edit Space Modal
    const [showSpaceConfigModal, setSpaceConfigModal] = useState(false);
    const closeSpaceConfigModal = () => setSpaceConfigModal(false);
    const openSpaceConfigModal = () => setSpaceConfigModal(true);

    const [selectedSpaceObj, setSelectedSpaceObj] = useState(null);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    const [isInComparisonMode, setComparisonMode] = useState(false);
    const [selectedUnit, setSelectedUnit] = useState(exploreBldgMetrics[0].unit);
    const [selectedConsumptionLabel, setSelectedConsumptionLabel] = useState(exploreBldgMetrics[0]?.Consumption);
    const [selectedConsumption, setConsumption] = useState(exploreBldgMetrics[0]?.value);

    const [selectedEquipIds, setSelectedEquipIds] = useState([]);
    const [spacesList, setspacesList] = useState([]);

    const [seriesData, setSeriesData] = useState([]);
    const [pastSeriesData, setPastSeriesData] = useState([]);

    const [isEquipDataFetching, setEquipDataFetching] = useState([]);
    const [filterOptions, setFilterOptions] = useState([]);

    const [isFiltersFetching, setFiltersFetching] = useState(false);
    const [isFetchingChartData, setFetchingChartData] = useState(false);
    const [isFetchingPastChartData, setFetchingPastChartData] = useState(false);

    const [checkedAll, setCheckedAll] = useState(false);

    const currentRow = () => {
        return spacesList;
    };

    const handleSpaceEdit = (el) => {
        openSpaceConfigModal();
        setSelectedSpaceObj(el);
    };

    const toggleComparision = () => {
        setComparisonMode(!isInComparisonMode);
        UserStore.update((s) => {
            s.showNotification = true;
            s.notificationMessage = isInComparisonMode ? 'Comparison Mode turned OFF' : 'Comparison Mode turned ON';
            s.notificationType = 'success';
        });
    };

    const handleUnitChange = (value) => {
        const obj = exploreBldgMetrics.find((record) => record?.value === value);
        setSelectedUnit(obj?.unit);
    };

    const handleConsumptionChange = (value) => {
        const obj = exploreBldgMetrics.find((record) => record?.value === value);
        setSelectedConsumptionLabel(obj?.Consumption);
    };

    const renderEquipmentName = useCallback((row) => {
        return (
            <div style={{ fontSize: 0 }}>
                <a
                    className="typography-wrapper link mouse-pointer"
                    onClick={() => {
                        // setEquipmentFilter({
                        //     equipment_id: row?.equipment_id,
                        //     equipment_name: row?.equipment_name,
                        //     device_type: row?.device_type,
                        // });
                        localStorage.setItem('exploreEquipName', row?.equipment_name);
                        // handleChartOpen();
                    }}>
                    {row?.equipment_name !== '' ? row?.equipment_name : '-'}
                </a>
                <Brick sizeInPixels={3} />
            </div>
        );
    });

    const renderConsumption = useCallback((row) => {
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>
                    {`${formatConsumptionValue(Math.round(row?.consumption?.now / 1000))} ${UNITS.KWH}`}
                </Typography.Body>
                <Brick sizeInRem={0.375} />
                <Progress multi className="custom-progress-bar">
                    <Progress
                        bar
                        value={row?.consumption?.now}
                        max={row?.totalBldgUsage}
                        barClassName="custom-on-hour"
                    />
                    <Progress
                        bar
                        value={row?.consumption?.off_hours}
                        max={row?.totalBldgUsage}
                        barClassName="custom-off-hour"
                    />
                </Progress>
            </>
        );
    });

    const renderPerChange = useCallback((row) => {
        return (
            <TrendsBadge
                value={Math.abs(Math.round(row?.consumption?.change))}
                type={
                    row?.consumption?.change === 0
                        ? TrendsBadge.Type.NEUTRAL_TREND
                        : row?.consumption?.now < row?.consumption?.old
                        ? TrendsBadge.Type.DOWNWARD_TREND
                        : TrendsBadge.Type.UPWARD_TREND
                }
            />
        );
    });

    const renderBreakers = useCallback((row) => {
        return (
            <div className="breakers-row-content">
                {row?.breaker_number.length === 0 ? (
                    <Typography.Body>-</Typography.Body>
                ) : (
                    <Badge text={<span className="gray-950">{row?.breaker_number.join(', ')}</span>} />
                )}
            </div>
        );
    });

    const renderNotes = useCallback((row) => {
        let renderText = !row?.note || row?.note === '' ? '-' : row?.note;
        if (renderText?.length > 50) renderText = truncateString(renderText);

        return (
            <div style={{ maxWidth: '15rem' }}>
                <Typography.Body size={Typography.Sizes.md}>
                    {renderText}
                    {row?.note?.length > 50 && (
                        <>
                            <div
                                className="d-inline mouse-pointer"
                                id={`notes-badge-${row?.equipment_id}`}>{` ...`}</div>
                            <UncontrolledTooltip placement="top" target={`notes-badge-${row?.equipment_id}`}>
                                {row?.note}
                            </UncontrolledTooltip>
                        </>
                    )}
                </Typography.Body>
            </div>
        );
    });

    const renderTags = useCallback((row) => {
        const slicedArr = row?.tags.slice(1);
        return (
            <div className="tag-row-content">
                <Badge text={<span className="gray-950">{row?.tags[0] ? row?.tags[0] : 'none'}</span>} />
                {slicedArr?.length > 0 ? (
                    <>
                        <Badge
                            text={
                                <span className="gray-950" id={`tags-badge-${row?.equipment_id}`}>
                                    +{slicedArr.length} more
                                </span>
                            }
                        />
                        <UncontrolledTooltip
                            placement="top"
                            target={`tags-badge-${row?.equipment_id}`}
                            className="tags-tooltip">
                            {slicedArr.map((el) => {
                                return <Badge text={<span className="gray-950">{el}</span>} />;
                            })}
                        </UncontrolledTooltip>
                    </>
                ) : null}
            </div>
        );
    });

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Building Overview',
                    path: '/explore/building/overview',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'explore';
        });
    };

    const handleDownloadCSV = async () => {
        setDownloadingCSVData(true);
        const ordered_by = sortBy.name === undefined ? 'consumption' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'dce' : sortBy.method;

        await fetchExploreEquipmentList(startDate, endDate, startTime, endTime, timeZone, bldgId, ordered_by, sort_by)
            .then((res) => {
                const { data } = res?.data;
                if (data.length !== 0) {
                    download(
                        `${bldgName}_Explore_By_Equipment_${new Date().toISOString().split('T')[0]}`,
                        getExploreByEquipmentTableCSVExport(data, headerProps)
                    );
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'CSV export completed successfully.';
                        s.notificationType = 'success';
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

    const fetchMultipleSpaceChartData = async (
        bldgId,
        start_date,
        end_date,
        time_zone,
        spaceIDs = [],
        requestType = 'currentData'
    ) => {
        if (!bldgId || start_date === null || end_date === null || spaceIDs.length === 0) return;

        requestType === 'currentData' ? setFetchingChartData(true) : setFetchingPastChartData(true);

        const promisesList = [];

        spaceIDs.forEach((id) => {
            const params = `?building_id=${bldgId}&space_ids=${id}&date_from=${start_date}&date_to=${end_date}&tz_info=${time_zone}&include_equipment=false`;
            promisesList.push(fetchExploreSpaceChart(params));
        });

        requestType === 'currentData' ? setSeriesData([]) : setPastSeriesData([]);

        Promise.all(promisesList)
            .then((res) => {
                const promiseResponse = res;

                if (promiseResponse?.length !== 0) {
                    let newResponse = [];

                    promiseResponse.forEach((record, index) => {
                        const spaceObj = spacesList.find((el) => el?.space_id === spaceIDs[index]);
                        console.log('SSR response => ', record);
                        let newSpaceMappedData = [];

                        if (record?.status === 200 && record?.data) {
                            const { data } = record;
                            const spaceResponseObj = data[0];

                            if (spaceResponseObj?.total_data) {
                                newSpaceMappedData = spaceResponseObj?.total_data.map((el) => ({
                                    x: new Date(el?.time_stamp).getTime(),
                                    y: el?.consumption === '' ? null : el?.consumption,
                                }));
                            }
                        }

                        newResponse.push({
                            id: spaceObj?.space_id,
                            name: spaceObj?.space_name,
                            data: newSpaceMappedData,
                        });
                    });

                    console.log('SSR newResponse => ', newResponse);

                    requestType === 'currentData' ? setSeriesData(newResponse) : setPastSeriesData(newResponse);
                }
            })
            .catch(() => {})
            .finally(() => {
                requestType === 'currentData' ? setFetchingChartData(false) : setFetchingPastChartData(false);
            });
    };

    const fetchSpaceChartData = async (bldgId, spaceId, isComparisionOn = false) => {
        if (!bldgId || !spaceId) return;

        const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);
        const params = `?building_id=${bldgId}&space_ids=${spaceId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${timeZone}&include_equipment=false`;

        let previousDataParams = '';

        if (isComparisionOn) {
            const pastDateObj = getPastDateRange(startDate, daysCount);
            const { dateFrom, dateTo } = handleAPIRequestParams(
                pastDateObj?.startDate,
                pastDateObj?.endDate,
                startTime,
                endTime
            );
            previousDataParams = `?building_id=${bldgId}&space_ids=${spaceId}&date_from=${dateFrom}&date_to=${dateTo}&tz_info=${timeZone}&include_equipment=false`;
        }

        let promisesList = [];
        promisesList.push(fetchExploreSpaceChart(params));
        if (isComparisionOn) promisesList.push(fetchExploreSpaceChart(previousDataParams));

        Promise.all(promisesList)
            .then((res) => {
                const response = res;
                response.forEach((record, index) => {
                    if (record?.status === 200 && record?.data) {
                        const { data } = record;

                        const spaceObj = spacesList.find((el) => el?.space_id === spaceId);

                        const spaceResponseObj = data[0];
                        let newSpaceMappedData = [];

                        if (spaceResponseObj?.total_data) {
                            newSpaceMappedData = spaceResponseObj?.total_data.map((el) => ({
                                x: new Date(el?.time_stamp).getTime(),
                                y: el?.consumption === '' ? null : el?.consumption,
                            }));
                        }

                        let recordToInsert = {
                            id: spaceObj?.space_id,
                            name: spaceObj?.space_name,
                            data: newSpaceMappedData,
                        };

                        if (index === 0) setSeriesData([...seriesData, recordToInsert]);
                        if (index === 1) setPastSeriesData([...pastSeriesData, recordToInsert]);
                    } else {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = response?.message
                                ? response?.message
                                : res
                                ? 'Unable to fetch data for selected Space.'
                                : 'Unable to fetch data due to Internal Server Error!.';
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

    const handleSpaceStateChange = (value, spaceObj, isComparisionOn = false, bldgId) => {
        if (value === 'true') {
            const newDataList = seriesData.filter((item) => item?.id !== spaceObj?.space_id);
            setSeriesData(newDataList);

            if (isComparisionOn) {
                const newPastDataList = pastSeriesData.filter((item) => item?.id !== spaceObj?.space_id);
                setPastSeriesData(newPastDataList);
            }
        }

        if (value === 'false' && spaceObj?.space_id) {
            fetchSpaceChartData(bldgId, spaceObj?.space_id, isComparisionOn);
        }

        const isAdding = value === 'false';
        setSelectedEquipIds((prevState) => {
            return isAdding
                ? [...prevState, spaceObj?.space_id]
                : prevState.filter((spaceId) => spaceId !== spaceObj?.space_id);
        });
    };

    const fetchEquipmentsList = async (bldgId, spaceId) => {
        setEquipDataFetching(true);

        setspacesList([]);

        await fetchExploreEquipmentsBySpace(startDate, endDate, startTime, endTime, timeZone, bldgId, spaceId)
            .then((res) => {
                const { data, total_data, total_building_usage } = res?.data;
                if (data) {
                    if (data.length !== 0) {
                        const updatedData = data.map((el) => ({
                            ...el,
                            totalBldgUsage: total_building_usage ? total_building_usage : 0,
                        }));
                        setspacesList(updatedData);

                        setSelectedEquipIds((prevState) => {
                            return prevState.filter((id) => updatedData.some((equip) => equip?.equipment_id === id));
                        });
                    }
                    if (data.length === 0) {
                        setSelectedEquipIds([]);
                        setSeriesData([]);
                        setComparisonMode(false);
                    }
                    if (total_data) setTotalItems(total_data);
                }
            })
            .catch((error) => {})
            .finally(() => {
                setEquipDataFetching(false);
            });
    };

    const headerProps = [
        {
            name: 'Name',
            accessor: 'equipment_name',
            callbackValue: renderEquipmentName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Energy Consumption',
            accessor: 'consumption',
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
            name: 'Location',
            accessor: 'location',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Space Type',
            accessor: 'location_type',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Equipment Type',
            accessor: 'equipments_type',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'End Use Category',
            accessor: 'end_user',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Tags',
            accessor: 'tags',
            callbackValue: renderTags,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Panel Name',
            accessor: 'panel',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Breakers',
            accessor: 'breaker_number',
            callbackValue: renderBreakers,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Notes',
            accessor: 'note',
            callbackValue: renderNotes,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        if (!showSpaceConfigModal) {
            setSelectedSpaceObj(null);
        }
    }, [showSpaceConfigModal]);

    useEffect(() => {
        if (!bldgId || !startDate || !endDate) return;

        fetchEquipmentsList(bldgId, spaceId);
    }, [startDate, endDate, bldgId, search, sortBy, pageSize, pageNo, userPrefUnits]);

    useEffect(() => {
        if (selectedEquipIds.length !== 0) {
            const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);
            fetchMultipleSpaceChartData(bldgId, dateFrom, dateTo, timeZone, selectedEquipIds, 'currentData');

            if (isInComparisonMode) {
                const pastDateObj = getPastDateRange(startDate, daysCount);
                const { dateFrom: pastDateFrom, dateTo: pastDateTo } = handleAPIRequestParams(
                    pastDateObj?.startDate,
                    pastDateObj?.endDate,
                    startTime,
                    endTime
                );

                fetchMultipleSpaceChartData(bldgId, pastDateFrom, pastDateTo, timeZone, selectedEquipIds, 'pastData');
            }
        }
    }, [startDate, endDate, startTime, endTime]);

    useEffect(() => {
        if (checkedAll) {
            if (spacesList.length !== 0 && spacesList.length <= 20) {
                const allSpaceIds = spacesList.map((el) => el?.space_id);
                const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);

                fetchMultipleSpaceChartData(bldgId, dateFrom, dateTo, timeZone, allSpaceIds, 'currentData');
                setSelectedEquipIds(allSpaceIds);

                if (isInComparisonMode) {
                    const pastDateObj = getPastDateRange(startDate, daysCount);
                    const { dateFrom: pastDateFrom, dateTo: pastDateTo } = handleAPIRequestParams(
                        pastDateObj?.startDate,
                        pastDateObj?.endDate,
                        startTime,
                        endTime
                    );

                    fetchMultipleSpaceChartData(
                        bldgId,
                        pastDateFrom,
                        pastDateTo,
                        timeZone,
                        selectedEquipIds,
                        'pastData'
                    );
                }
            }
        }
        if (!checkedAll) {
            setSeriesData([]);
            setPastSeriesData([]);
            setComparisonMode(false);
            setSelectedEquipIds([]);
        }
    }, [checkedAll]);

    useEffect(() => {
        if (isInComparisonMode) {
            const pastDateObj = getPastDateRange(startDate, daysCount);
            const { dateFrom: pastDateFrom, dateTo: pastDateTo } = handleAPIRequestParams(
                pastDateObj?.startDate,
                pastDateObj?.endDate,
                startTime,
                endTime
            );

            fetchMultipleSpaceChartData(bldgId, pastDateFrom, pastDateTo, timeZone, selectedEquipIds, 'pastData');
        } else {
            setPastSeriesData([]);
        }
    }, [isInComparisonMode]);

    useEffect(() => {
        const scrollToTop = () => {
            const yOffset = pageNo !== 1 || pageSize !== 20 ? 300 : 0;
            window.scrollTo(0, yOffset);
        };

        scrollToTop();
        setCheckedAll(false);
    }, [pageNo, pageSize]);

    const dataToRenderOnChart = validateSeriesDataForEquipments(selectedEquipIds, spacesList, seriesData);
    const pastDataToRenderOnChart = validateSeriesDataForEquipments(selectedEquipIds, spacesList, pastSeriesData);

    return (
        <React.Fragment>
            <Row className="m-0 d-flex justify-content-between">
                <div></div>
                <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                    <Button
                        size={Button.Sizes.lg}
                        type={isInComparisonMode ? Button.Type.secondary : Button.Type.secondaryGrey}>
                        <Toggles size={Toggles.Sizes.sm} isChecked={isInComparisonMode} onChange={toggleComparision} />
                        <Typography.Subheader size={Typography.Sizes.lg} onClick={toggleComparision}>
                            Compare
                        </Typography.Subheader>
                    </Button>

                    <Select
                        defaultValue={selectedConsumption}
                        options={exploreBldgMetrics}
                        onChange={(e) => {
                            setConsumption(e.value);
                            handleUnitChange(e.value);
                            handleConsumptionChange(e.value);
                        }}
                    />

                    <Header title="" type="page" />
                </div>
            </Row>

            <Brick sizeInRem={1} />

            <Row className="m-0">
                <div className="explore-data-table-style">
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
                                    tooltipUnit={''}
                                    tooltipLabel={''}
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
                                    chartType={''}
                                />
                            ) : (
                                <ExploreChart
                                    title={''}
                                    subTitle={''}
                                    isLoadingData={false}
                                    disableDefaultPlotBands={true}
                                    tooltipValuesKey={'{point.y:.1f}'}
                                    tooltipUnit={''}
                                    tooltipLabel={''}
                                    data={dataToRenderOnChart}
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
                                                    'energy'
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

            <Brick sizeInRem={1} />

            <Row className="m-0">
                <div className="w-100">
                    <DataTableWidget
                        id="explore-by-spaces"
                        isLoading={isEquipDataFetching}
                        isLoadingComponent={<SkeletonLoader noOfColumns={headerProps.length + 2} noOfRows={20} />}
                        isFilterLoading={isFiltersFetching}
                        onSearch={(e) => {
                            setSearch(e);
                            setCheckedAll(false);
                        }}
                        buttonGroupFilterOptions={[]}
                        rows={currentRow()}
                        searchResultRows={currentRow()}
                        filterOptions={filterOptions}
                        onDownload={handleDownloadCSV}
                        isCSVDownloading={isCSVDownloading}
                        headers={headerProps}
                        customCheckAll={() => (
                            <Checkbox
                                label=""
                                type="checkbox"
                                id="space1"
                                name="space1"
                                checked={checkedAll}
                                onChange={() => {
                                    setCheckedAll(!checkedAll);
                                }}
                                disabled={!spacesList || spacesList.length > 20}
                            />
                        )}
                        customCheckboxForCell={(record) => (
                            <Checkbox
                                label=""
                                type="checkbox"
                                id="space_check"
                                name="space_check"
                                checked={selectedEquipIds.includes(record?.space_id)}
                                value={selectedEquipIds.includes(record?.space_id)}
                                onChange={(e) => {
                                    // handleSpaceStateChange(e.target.value, record, isInComparisonMode, bldgId);
                                }}
                            />
                        )}
                        pageSize={pageSize}
                        currentPage={pageNo}
                        onPageSize={setPageSize}
                        onChangePage={setPageNo}
                        pageListSizes={pageListSizes}
                        isEditable={() => true}
                        onEditRow={(record, id, row) => handleSpaceEdit(row)}
                        totalCount={(() => {
                            return totalItems;
                        })()}
                    />
                </div>
            </Row>
        </React.Fragment>
    );
};

export default ExploreEquipmentBySpace;
