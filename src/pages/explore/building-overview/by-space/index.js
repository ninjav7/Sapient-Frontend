import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { useHistory } from 'react-router-dom';
import { Row, UncontrolledTooltip, Progress, Spinner } from 'reactstrap';

import { UserStore } from '../../../../store/UserStore';
import { DateRangeStore } from '../../../../store/DateRangeStore';
import { BuildingStore } from '../../../../store/BuildingStore';
import { ComponentStore } from '../../../../store/ComponentStore';

import SkeletonLoader from '../../../../components/SkeletonLoader';
import Brick from '../../../../sharedComponents/brick';
import { Badge } from '../../../../sharedComponents/badge';
import { Checkbox } from '../../../../sharedComponents/form/checkbox';
import { DataTableWidget } from '../../../../sharedComponents/dataTableWidget';
import { TrendsBadge } from '../../../../sharedComponents/trendsBadge';
import useCSVDownload from '../../../../sharedComponents/hooks/useCSVDownload';
import Typography from '../../../../sharedComponents/typography';

import SpaceConfiguration from './SpaceConfig';
import ExploreChart from '../../../../sharedComponents/exploreChart/ExploreChart';
import ExploreCompareChart from '../../../../sharedComponents/exploreCompareChart/ExploreCompareChart';

import { fetchExploreSpaceChart } from './services';
import { handleDataConversion } from '../../../chartModal/helper';
import { fetchSpaceListV2 } from '../../../spaces/services';

import {
    dateTimeFormatForHighChart,
    formatConsumptionValue,
    formatXaxisForHighCharts,
    getPastDateRange,
    handleAPIRequestParams,
    pageListSizes,
} from '../../../../helpers/helpers';
import { EXPLORE_FILTER_TYPE } from '../../constants';
import { updateBreadcrumbStore } from '../../../../helpers/updateBreadcrumbStore';
import { validateSeriesDataForSpaces } from './utils';
import { getSpaceTableCSVExport } from '../../../../utils/tablesExport';
import { UNITS } from '../../../../constants/units';

import '../../style.css';
import '../../styles.scss';

const ExploreBySpace = (props) => {
    const {
        bldgId,
        selectedUnit,
        selectedConsumption,
        selectedConsumptionLabel,
        isInComparisonMode = false,
        setComparisonMode,
    } = props;

    const history = useHistory();
    const { download } = useCSVDownload();

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

    const [selectedSpaceToRedirect, setSelectedSpaceToRedirect] = useState(null);

    // Edit Space Modal
    const [showSpaceConfigModal, setSpaceConfigModal] = useState(false);
    const closeSpaceConfigModal = () => setSpaceConfigModal(false);
    const openSpaceConfigModal = () => setSpaceConfigModal(true);

    const [spaceId, setSpaceId] = useState(null);
    const [selectedSpaceObj, setSelectedSpaceObj] = useState(null);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    const [spacesList, setSpacesList] = useState([]);
    const [selectedSpaceIds, setSelectedSpaceIds] = useState([]);

    const [seriesData, setSeriesData] = useState([]);
    const [pastSeriesData, setPastSeriesData] = useState([]);

    const [isDataFetching, setFetchingData] = useState([]);
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
        setSpaceId(el?.space_id);
        setSelectedSpaceObj(el);
    };

    const updateStoreOnPageLoad = () => {
        ComponentStore.update((s) => {
            s.parent = 'explore';
        });
    };

    const handleDownloadCSV = async () => {
        setDownloadingCSVData(true);

        const query = { bldgId, dateFrom: startDate, dateTo: endDate, tzInfo: timeZone };

        await fetchSpaceListV2(query)
            .then((res) => {
                const data = res;
                if (data) {
                    if (data.length !== 0) {
                        data.forEach((el) => {
                            el.changes = Math.round(el?.consumption?.changes);
                            el.consumption = formatConsumptionValue(Math.round(el?.consumption?.new / 1000));
                        });
                    }
                    download(
                        `${bldgName}_Energy_Consumption_By_Space${new Date().toISOString().split('T')[0]}`,
                        getSpaceTableCSVExport(data, headerProps)
                    );
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'CSV export completed successfully.';
                        s.notificationType = 'success';
                    });
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Data failed to export in CSV.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch((err) => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Data failed to export in CSV due to internal server error.';
                    s.notificationType = 'error';
                });
            })
            .finally(() => {
                setDownloadingCSVData(false);
            });

        try {
            if (spacesList && spacesList.length !== 0) {
            }
        } catch {}
        setDownloadingCSVData(false);
    };

    const renderSpaceName = useCallback((row) => (
        <div
            className="typography-wrapper link mouse-pointer"
            onClick={() => {
                setSelectedSpaceToRedirect({
                    space_id: row?.space_id,
                    space_name: row?.space_name,
                });
            }}>
            {row?.space_name ?? '-'}
        </div>
    ));

    const renderConsumption = useCallback((row) => {
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>
                    {`${formatConsumptionValue(Math.round(row?.consumption?.new / 1000))} ${UNITS.KWH}`}
                </Typography.Body>
                <Brick sizeInRem={0.375} />
                <Progress multi className="custom-progress-bar" style={{ height: '6px' }}>
                    <Progress
                        bar
                        value={row?.consumption?.new}
                        max={row?.total_building_usage}
                        barClassName="custom-on-hour"
                        style={{ backgroundColor: row?.consumptionBarColor }}
                    />
                </Progress>
            </>
        );
    });

    const renderPerChange = useCallback((row) => {
        const change = row?.consumption?.changes;

        return (
            Number.isFinite(change) && (
                <TrendsBadge
                    value={Math.abs(Math.round(change))}
                    type={
                        change === 0
                            ? TrendsBadge.Type.NEUTRAL_TREND
                            : row?.consumption?.new < row?.consumption?.old
                            ? TrendsBadge.Type.DOWNWARD_TREND
                            : TrendsBadge.Type.UPWARD_TREND
                    }
                />
            )
        );
    });

    const renderSquareUnits = useCallback(
        (row) => {
            const formatSquareString = (string) => `${string} ${userPrefUnits === 'si' ? UNITS.SQ_M : UNITS.SQ_FT}`;

            return (
                <Typography.Body size={Typography.Sizes.md}>
                    {row?.square_footage
                        ? formatSquareString(row?.square_footage.toLocaleString())
                        : formatSquareString('0')}
                </Typography.Body>
            );
        },
        [userPrefUnits]
    );

    const renderTags = useCallback((row) => {
        const slicedArr = row?.tag.slice(1);

        return (
            <div className="tag-row-content">
                <Badge text={<span className="gray-950">{row?.tag[0] ? row.tag[0] : 'none'}</span>} />
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
                        let newSpaceMappedData = [];

                        if (record?.status === 200 && record?.data) {
                            const { data } = record;
                            const spaceResponseObj = data[0];

                            if (spaceResponseObj?.total_data) {
                                newSpaceMappedData = spaceResponseObj?.total_data.map((el) => ({
                                    x: new Date(el?.time_stamp).getTime(),
                                    y: handleDataConversion(el?.consumption, selectedConsumption),
                                }));
                            }
                        }

                        newResponse.push({
                            id: spaceObj?.space_id,
                            name: spaceObj?.space_name,
                            data: newSpaceMappedData,
                        });
                    });

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
                                y: handleDataConversion(el?.consumption, selectedConsumption),
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
        setSelectedSpaceIds((prevState) => {
            return isAdding
                ? [...prevState, spaceObj?.space_id]
                : prevState.filter((spaceId) => spaceId !== spaceObj?.space_id);
        });
    };

    const fetchSpacesList = async () => {
        setFetchingData(true);
        setSpacesList([]);
        setTotalItems(0);

        const orderedBy = sortBy.name === undefined || sortBy.method === null ? 'consumption' : sortBy.name;
        const sortedBy = sortBy.method === undefined || sortBy.method === null ? 'dce' : sortBy.method;
        let query = { bldgId, dateFrom: startDate, dateTo: endDate, tzInfo: timeZone, orderedBy, sortedBy };

        if (search) query.search = encodeURIComponent(search);

        await fetchSpaceListV2(query)
            .then((res) => {
                const data = res;
                if (data && data.length !== 0) {
                    setSpacesList(data);
                    setTotalItems(data.length);
                }
            })
            .catch((err) => {})
            .finally(() => {
                setFetchingData(false);
            });
    };

    const headerProps = [
        {
            name: 'Name',
            accessor: 'space_name',
            callbackValue: renderSpaceName,
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
            accessor: 'changes',
            callbackValue: renderPerChange,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Floor',
            accessor: 'floor_name',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Space Type',
            accessor: 'space_type_name',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Equipment Number',
            accessor: 'equipment_count',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: userPrefUnits === 'si' ? `Square Meters` : `Square Footage`,
            accessor: 'square_footage',
            callbackValue: renderSquareUnits,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Tags',
            accessor: 'tag',
            callbackValue: renderTags,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    useEffect(() => {
        window.scrollTo(0, 0);
        updateStoreOnPageLoad();
    }, []);

    useEffect(() => {
        if (!showSpaceConfigModal) {
            setSpaceId(null);
            setSelectedSpaceObj(null);
        }
    }, [showSpaceConfigModal]);

    useEffect(() => {
        if (!bldgId || !startDate || !endDate) return;

        fetchSpacesList();
    }, [startDate, endDate, bldgId, search, sortBy, pageSize, pageNo, userPrefUnits]);

    useEffect(() => {
        if (selectedSpaceIds.length !== 0) {
            const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);
            fetchMultipleSpaceChartData(bldgId, dateFrom, dateTo, timeZone, selectedSpaceIds, 'currentData');

            if (isInComparisonMode) {
                const pastDateObj = getPastDateRange(startDate, daysCount);
                const { dateFrom: pastDateFrom, dateTo: pastDateTo } = handleAPIRequestParams(
                    pastDateObj?.startDate,
                    pastDateObj?.endDate,
                    startTime,
                    endTime
                );

                fetchMultipleSpaceChartData(bldgId, pastDateFrom, pastDateTo, timeZone, selectedSpaceIds, 'pastData');
            }
        }
    }, [startDate, endDate, startTime, endTime]);

    useEffect(() => {
        if (checkedAll) {
            if (spacesList.length !== 0 && spacesList.length <= 20) {
                const allSpaceIds = spacesList.map((el) => el?.space_id);
                const { dateFrom, dateTo } = handleAPIRequestParams(startDate, endDate, startTime, endTime);

                fetchMultipleSpaceChartData(bldgId, dateFrom, dateTo, timeZone, allSpaceIds, 'currentData');
                setSelectedSpaceIds(allSpaceIds);

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
                        selectedSpaceIds,
                        'pastData'
                    );
                }
            }
        }
        if (!checkedAll) {
            setSeriesData([]);
            setPastSeriesData([]);
            setComparisonMode(false);
            setSelectedSpaceIds([]);
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

            fetchMultipleSpaceChartData(bldgId, pastDateFrom, pastDateTo, timeZone, selectedSpaceIds, 'pastData');
        } else {
            setPastSeriesData([]);
        }
    }, [isInComparisonMode]);

    const redirectToEndpoint = (path) => {
        history.push({
            pathname: `${path}`,
        });
    };

    useEffect(() => {
        if (selectedSpaceToRedirect) {
            updateBreadcrumbStore([
                {
                    label: 'By Location',
                    path: `/explore/building/overview/${bldgId}/${EXPLORE_FILTER_TYPE.BY_SPACE}`,
                    active: false,
                },
                {
                    label: selectedSpaceToRedirect?.space_name ?? 'Space',
                    path: `/explore/building/overview/${bldgId}/by-spaces-equipments/${selectedSpaceToRedirect?.space_id}`,
                    active: true,
                },
            ]);
            redirectToEndpoint(
                `/explore/building/overview/${bldgId}/by-spaces-equipments/${selectedSpaceToRedirect?.space_id}`
            );
        }
    }, [selectedSpaceToRedirect]);

    useEffect(() => {
        const scrollToTop = () => {
            const yOffset = pageNo !== 1 || pageSize !== 20 ? 300 : 0;
            window.scrollTo(0, yOffset);
        };

        scrollToTop();
        setCheckedAll(false);
    }, [pageNo, pageSize]);

    const dataToRenderOnChart = validateSeriesDataForSpaces(selectedSpaceIds, spacesList, seriesData);
    const pastDataToRenderOnChart = validateSeriesDataForSpaces(selectedSpaceIds, spacesList, pastSeriesData);

    return (
        <React.Fragment>
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
                                    tooltipUnit={selectedUnit}
                                    tooltipLabel={'Space'}
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
                                    chartType={selectedConsumption}
                                />
                            ) : (
                                <ExploreChart
                                    title={''}
                                    subTitle={''}
                                    isLoadingData={false}
                                    disableDefaultPlotBands={true}
                                    tooltipValuesKey={'{point.y:.1f}'}
                                    tooltipUnit={selectedUnit}
                                    tooltipLabel={selectedConsumptionLabel}
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

            <Brick sizeInRem={1} />

            <Row className="m-0">
                <div className="w-100">
                    <DataTableWidget
                        id="explore-by-spaces"
                        isLoading={isDataFetching}
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
                                checked={selectedSpaceIds.includes(record?.space_id)}
                                value={selectedSpaceIds.includes(record?.space_id)}
                                onChange={(e) => {
                                    handleSpaceStateChange(e.target.value, record, isInComparisonMode, bldgId);
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

            <SpaceConfiguration
                showSpaceConfigModal={showSpaceConfigModal}
                closeSpaceConfigModal={closeSpaceConfigModal}
                bldgId={bldgId}
                spaceId={spaceId}
                selectedSpaceObj={selectedSpaceObj}
            />
        </React.Fragment>
    );
};

export default ExploreBySpace;
