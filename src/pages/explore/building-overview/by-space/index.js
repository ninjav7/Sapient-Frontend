import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { useAtom } from 'jotai';
import { Row, UncontrolledTooltip, Progress, Spinner } from 'reactstrap';

import { UserStore } from '../../../../store/UserStore';
import { buildingData } from '../../../../store/globalState';
import { DateRangeStore } from '../../../../store/DateRangeStore';
import { BuildingStore } from '../../../../store/BuildingStore';
import { ComponentStore } from '../../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../../store/BreadcrumbStore';
import { updateBuildingStore } from '../../../../helpers/updateBuildingStore';

import SkeletonLoader from '../../../../components/SkeletonLoader';
import Brick from '../../../../sharedComponents/brick';
import { Badge } from '../../../../sharedComponents/badge';
import { Checkbox } from '../../../../sharedComponents/form/checkbox';
import { DataTableWidget } from '../../../../sharedComponents/dataTableWidget';
import { TrendsBadge } from '../../../../sharedComponents/trendsBadge';
import Typography from '../../../../sharedComponents/typography';

import ExploreChart from '../../../../sharedComponents/exploreChart/ExploreChart';
import ExploreCompareChart from '../../../../sharedComponents/exploreCompareChart/ExploreCompareChart';

import {
    dateTimeFormatForHighChart,
    formatConsumptionValue,
    formatXaxisForHighCharts,
    pageListSizes,
} from '../../../../helpers/helpers';
import { UNITS } from '../../../../constants/units';
import { truncateString, validateSeriesDataForEquipments } from '../../utils';

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

    const [buildingListData] = useAtom(buildingData);
    const bldgName = BuildingStore.useState((s) => s.BldgName);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const startTime = DateRangeStore.useState((s) => s.startTime);
    const endTime = DateRangeStore.useState((s) => s.endTime);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    const [selectedEquipIds, setSelectedEquipIds] = useState([]);
    const [filterObj, setFilterObj] = useState({});
    const [filterOptions, setFilterOptions] = useState([]);
    const [equipDataList, setEquipDataList] = useState([]);

    const [seriesData, setSeriesData] = useState([]);
    const [pastSeriesData, setPastSeriesData] = useState([]);

    const [isFiltersFetching, setFiltersFetching] = useState(false);
    const [isFetchingChartData, setFetchingChartData] = useState(false);
    const [isFetchingPastChartData, setFetchingPastChartData] = useState(false);
    const [isEquipDataFetching, setEquipDataFetching] = useState(false);

    const [checkedAll, setCheckedAll] = useState(false);

    const [equipmentFilter, setEquipmentFilter] = useState({});

    const currentRow = () => {
        return equipDataList;
    };

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

    const renderEquipmentName = useCallback((row) => {
        return (
            <div style={{ fontSize: 0 }}>
                <a
                    className="typography-wrapper link mouse-pointer"
                    onClick={() => {
                        setEquipmentFilter({
                            equipment_id: row?.equipment_id,
                            equipment_name: row?.equipment_name,
                            device_type: row?.device_type,
                        });
                        localStorage.setItem('exploreEquipName', row?.equipment_name);
                    }}>
                    {row?.equipment_name !== '' ? row?.equipment_name : '-'}
                </a>
                <Brick sizeInPixels={3} />
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

    const handleEquipStateChange = () => {};

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
        if (pageNo !== 1 || pageSize !== 20) {
            window.scrollTo(0, 300);
        } else {
            window.scrollTo(0, 0);
        }
        setCheckedAll(false);
    }, [pageNo, pageSize]);

    useEffect(() => {
        if (bldgId && buildingListData.length !== 0) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id)
                updateBuildingStore(
                    bldgObj?.building_id,
                    bldgObj?.building_name,
                    bldgObj?.timezone,
                    bldgObj?.plug_only
                );
        }
    }, [bldgId, buildingListData]);

    const dataToRenderOnChart = validateSeriesDataForEquipments(selectedEquipIds, equipDataList, seriesData);
    const pastDataToRenderOnChart = validateSeriesDataForEquipments(selectedEquipIds, equipDataList, pastSeriesData);

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
                        id="explore-by-equipment"
                        isLoading={isEquipDataFetching}
                        isLoadingComponent={<SkeletonLoader noOfColumns={headerProps.length + 1} noOfRows={20} />}
                        isFilterLoading={isFiltersFetching}
                        onSearch={(e) => {
                            setSearch(e);
                            setCheckedAll(false);
                        }}
                        buttonGroupFilterOptions={[]}
                        rows={currentRow()}
                        searchResultRows={currentRow()}
                        filterOptions={filterOptions}
                        onDownload={() => {}}
                        isCSVDownloading={isCSVDownloading}
                        headers={headerProps}
                        customExcludedHeaders={['Panel Name', 'Breakers', 'Notes']}
                        customCheckAll={() => (
                            <Checkbox
                                label=""
                                type="checkbox"
                                id="equipment1"
                                name="equipment1"
                                checked={checkedAll}
                                onChange={() => {
                                    setCheckedAll(!checkedAll);
                                }}
                                disabled={!equipDataList || equipDataList.length > 20 || isInComparisonMode}
                            />
                        )}
                        customCheckboxForCell={(record) => (
                            <Checkbox
                                label=""
                                type="checkbox"
                                id="equip"
                                name="equip"
                                checked={selectedEquipIds.includes(record?.equipment_id)}
                                value={selectedEquipIds.includes(record?.equipment_id)}
                                onChange={(e) => {
                                    handleEquipStateChange(e.target.value, record, isInComparisonMode);
                                }}
                            />
                        )}
                        pageSize={pageSize}
                        currentPage={pageNo}
                        onPageSize={setPageSize}
                        onChangePage={setPageNo}
                        pageListSizes={pageListSizes}
                        totalCount={(() => {
                            return totalItems;
                        })()}
                    />
                </div>
            </Row>
        </React.Fragment>
    );
};

export default ExploreBySpace;
