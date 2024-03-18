import React, { useState, useEffect, useCallback } from 'react';
import _ from 'lodash';
import { Link } from 'react-router-dom';
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
import useCSVDownload from '../../../../sharedComponents/hooks/useCSVDownload';
import Typography from '../../../../sharedComponents/typography';

import SpaceConfiguration from './SpaceConfig';
import ExploreChart from '../../../../sharedComponents/exploreChart/ExploreChart';
import ExploreCompareChart from '../../../../sharedComponents/exploreCompareChart/ExploreCompareChart';

import {
    dateTimeFormatForHighChart,
    formatConsumptionValue,
    formatXaxisForHighCharts,
    pageListSizes,
} from '../../../../helpers/helpers';

import { fetchSpaceListV2 } from '../../../spaces/services';
import { UNITS } from '../../../../constants/units';
import { getExploreByEquipmentTableCSVExport } from '../../../../utils/tablesExport';

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

    const { download } = useCSVDownload();

    const [buildingListData] = useAtom(buildingData);
    const bldgName = BuildingStore.useState((s) => s.BldgName);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
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

    const [spacesList, setSpacesList] = useState([]);
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
        setSelectedSpaceObj(el);
    };

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

        try {
            if (spacesList && spacesList.length !== 0) {
                download(
                    `${bldgName}_Energy_Consumption_By_Space${new Date().toISOString().split('T')[0]}`,
                    getExploreByEquipmentTableCSVExport(spacesList, headerProps)
                );
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'CSV export completed successfully.';
                    s.notificationType = 'success';
                });
            }
        } catch {
            UserStore.update((s) => {
                s.showNotification = true;
                s.notificationMessage = 'Data failed to export in CSV.';
                s.notificationType = 'error';
            });
        }
        setDownloadingCSVData(false);
    };

    const renderSpaceName = useCallback((row) => {
        return (
            <Link to={`/explore/building/overview/by-spaces-equipments/${bldgId}/${row?.space_id}`}>
                <p className="m-0">
                    <u>{row?.space_name !== '' ? row?.space_name : '-'}</u>
                </p>
            </Link>
        );
    });

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

    const fetchSpacesList = async () => {
        setFetchingData(true);
        setSpacesList([]);
        setTotalItems(0);

        const orderedBy = sortBy.name === undefined || sortBy.method === null ? 'consumption' : sortBy.name;
        const sortedBy = sortBy.method === undefined || sortBy.method === null ? 'dce' : sortBy.method;
        const query = { bldgId, dateFrom: startDate, dateTo: endDate, tzInfo: timeZone };

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

    useEffect(() => {
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

    useEffect(() => {
        if (!showSpaceConfigModal) setSelectedSpaceObj(null);
    }, [showSpaceConfigModal]);

    useEffect(() => {
        if (!bldgId || !startDate || !endDate) return;

        fetchSpacesList();
    }, [startDate, endDate, bldgId, search, sortBy, pageSize, pageNo, userPrefUnits]);

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
                                    data={[]}
                                    pastData={[]}
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
                                    data={[]}
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
                                id="equipment1"
                                name="equipment1"
                                checked={checkedAll}
                                onChange={() => {
                                    setCheckedAll(!checkedAll);
                                }}
                                disabled={!spacesList || spacesList.length > 20 || isInComparisonMode}
                            />
                        )}
                        customCheckboxForCell={(record) => (
                            <Checkbox
                                label=""
                                type="checkbox"
                                id="equip"
                                name="equip"
                                // checked={selectedEquipIds.includes(record?.equipment_id)}
                                // value={selectedEquipIds.includes(record?.equipment_id)}
                                // onChange={(e) => {
                                //     handleEquipStateChange(e.target.value, record, isInComparisonMode);
                                // }}
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
                selectedSpaceObj={selectedSpaceObj}
            />
        </React.Fragment>
    );
};

export default ExploreBySpace;
