import React, { useState, useEffect, useCallback } from 'react';
import { Row, Col, Spinner } from 'reactstrap';
import { Link } from 'react-router-dom';

import { UserStore } from '../../../../store/UserStore';
import { DateRangeStore } from '../../../../store/DateRangeStore';
import { ComponentStore } from '../../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../../store/BreadcrumbStore';

import Brick from '../../../../sharedComponents/brick';
import Typography from '../../../../sharedComponents/typography';
import { DataTableWidget } from '../../../../sharedComponents/dataTableWidget';
import { Checkbox } from '../../../../sharedComponents/form/checkbox';
import ExploreChart from '../../../../sharedComponents/exploreChart/ExploreChart';
import { TinyBarChart } from '../../../../sharedComponents/tinyBarChart';
import { TrendsBadge } from '../../../../sharedComponents/trendsBadge';
import ExploreCompareChart from '../../../../sharedComponents/exploreCompareChart/ExploreCompareChart';

import { getAverageValue } from '../../../../helpers/AveragePercent';
import { updateBuildingStore } from '../../../../helpers/updateBuildingStore';

import { EXPLORE_FILTER_TYPE } from '../../constants';
import { dateTimeFormatForHighChart, formatXaxisForHighCharts } from '../../../../helpers/helpers';
import { handleUnitConverstion } from '../../../settings/general-settings/utils';
import SkeletonLoader from '../../../../components/SkeletonLoader';

import '../../style.css';
import '../../styles.scss';

const ExploreByFloor = (props) => {
    const { selectedUnit, selectedConsumption, selectedConsumptionLabel, isInComparisonMode } = props;

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

    const [filterOptions, setFilterOptions] = useState([]);
    const [selectedBldgIds, setSelectedBldgIds] = useState([]);
    const [exploreBuildingsList, setExploreBuildingsList] = useState([]);

    const [isFilterFetching, setFetchingFilters] = useState(false);
    const [isFetchingChartData, setFetchingChartData] = useState(false);
    const [isFetchingPastChartData, setFetchingPastChartData] = useState(false);
    const [isExploreDataLoading, setIsExploreDataLoading] = useState(false);

    let top = '';
    let bottom = '';

    const currentRow = () => {
        return exploreBuildingsList;
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

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            bs.items = [];
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

    return (
        <React.Fragment>
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
                                data={[]}
                                pastData={[]}
                                timeIntervalObj={{
                                    startDate,
                                    endDate,
                                    daysCount,
                                }}
                                chartProps={{
                                    tooltip: {
                                        xDateFormat: dateTimeFormatForHighChart(userPrefDateFormat, userPrefTimeFormat),
                                    },
                                }}
                            />
                        ) : (
                            <ExploreChart
                                title={''}
                                subTitle={''}
                                tooltipLabel={selectedConsumptionLabel}
                                disableDefaultPlotBands={true}
                                data={[]}
                                pastData={[]}
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
                                        xDateFormat: dateTimeFormatForHighChart(userPrefDateFormat, userPrefTimeFormat),
                                    },
                                }}
                            />
                        )}
                    </>
                )}
            </div>

            <Brick sizeInRem={0.75} />

            <Row className="m-0">
                <div className="explore-data-table-style">
                    <Col lg={12}>
                        <DataTableWidget
                            id="explore-by-no-grouping"
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
                            onDownload={() => {}}
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
                                />
                            )}
                            totalCount={(() => {
                                return totalItems;
                            })()}
                        />
                    </Col>
                </div>
            </Row>
        </React.Fragment>
    );
};

export default ExploreByFloor;
