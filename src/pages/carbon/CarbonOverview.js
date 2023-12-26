import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import Header from '../../components/Header';
import moment from 'moment';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { Badge } from '../../sharedComponents/badge';
import { fetchCompareBuildingsV2, getCarbonBuildingChartData } from '../compareBuildings/services';
import { getCarbonCompareBuildingsTableCSVExport } from '../../utils/tablesExport';
import { apiRequestBody } from '../../helpers/helpers';
import {
    fetchPortfolioBuilidings,
    fetchPortfolioOverall,
    fetchPortfolioEndUse,
    fetchPortfolioEnergyConsumption,
} from '../portfolio/services';

import { TrendsBadge } from '../../sharedComponents/trendsBadge';

import { useHistory } from 'react-router-dom';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';

import { primaryGray1000 } from '../../assets/scss/_colors.scss';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import Typography from '../../sharedComponents/typography';

import { timeZone } from '../../utils/helper';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import PortfolioKPIs from './PortfolioKPIs';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import Brick from '../../sharedComponents/brick';
import { UNITS } from '../../constants/units';
import { xaxisLabelsCount, xaxisLabelsFormat } from '../../sharedComponents/helpers/highChartsXaxisFormatter';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { UserStore } from '../../store/UserStore';
import SkeletonLoader from '../../components/SkeletonLoader';
import './style.scss';

const CarbonOverview = () => {
    const [userPermission] = useAtom(userPermissionData);
    const [buildingsEnergyConsume, setBuildingsEnergyConsume] = useState([]);

    const history = useHistory();
    const { download } = useCSVDownload();
    const [buildingsData, setBuildingsData] = useState([]);

    const [sortBy, setSortBy] = useState({});
    const [search, setSearch] = useState('');

    const userPrefUnits = UserStore.useState((s) => s.unit);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);
    const [totalItemsSearched, setTotalItemsSearched] = useState(0);
    const tableHeader = [
        {
            name: 'Name',
            accessor: 'building_name',
            callbackValue: (row) => renderName(row),
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: `Average Emissions Rate `,
            accessor: 'average_carbon_intensity',
            callbackValue: (row) => renderAverageEmissionRate(row),

            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Total Carbon Emissions',
            accessor: 'total_carbon_emissions',
            callbackValue: (row) => renderTotalConsumption(row),
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: '% Change',
            accessor: 'change',
            callbackValue: (row) => renderChangeEnergy(row),
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: `${userPrefUnits === 'si' ? `Sq. M.` : `Sq. Ft.`}`,
            accessor: 'square_footage',
            callbackValue: (row) => renderSquareFootage(row),
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    const [isLoadingBuildingData, setIsLoadingBuildingData] = useState(false);
    let entryPoint = '';
    let top = '';
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const [overalldata, setOveralldata] = useState({
        total_building: 0,
        total: {
            now: 0,
            change: 0,
            old: 0,
        },
    });
    const portfolioOverallData = async () => {
        setIsKPIsLoading(true);
        let payload = {
            date_from: startDate,
            date_to: endDate,
            tz_info: timeZone,
            metric: 'carbon',
        };

        await fetchPortfolioOverall(payload)
            .then((res) => {
                if (res?.data) setOveralldata(res?.data.data);
                setIsKPIsLoading(false);
            })
            .catch((error) => {
                setIsKPIsLoading(false);
            });
    };

    useEffect(() => {
        if (startDate === null || endDate === null) return;

        portfolioOverallData();
        const portfolioBuilidingsData = async () => {
            let payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchPortfolioBuilidings(payload)
                .then((res) => {
                    let data = res.data;
                    setBuildingsEnergyConsume(data);
                })
                .catch((error) => {});
        };

        portfolioBuilidingsData();
    }, [startDate, endDate, userPrefUnits]);

    const [isKPIsLoading, setIsKPIsLoading] = useState(false);
    const [dateFormat, setDateFormat] = useState('MM/DD HH:00');
    const [energyConsumptionsCategories, setEnergyConsumptionsCategories] = useState([]);
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

    const formatXaxis = ({ value }) => {
        return moment.utc(value).format(`${dateFormat}`);
    };

    const toolTipFormatter = ({ value }) => {
        const time_format = userPrefTimeFormat === `24h` ? `HH:mm` : `hh:mm A`;
        const date_format = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM 'YY` : `MMM D 'YY`;

        return daysCount >= 182
            ? moment.utc(value).format(`MMM 'YY`)
            : moment.utc(value).format(`${date_format} @ ${time_format}`);
    };

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

    const fetchcompareBuildingsData = async (search, ordered_by = 'building_name', sort_by, userPrefUnits) => {
        setIsLoadingBuildingData(true);
        let params = `?date_from=${startDate}&date_to=${endDate}&tz_info=${timeZone}&metric=carbon&ordered_by=${ordered_by}`;
        if (search) params = params.concat(`&building_search=${encodeURIComponent(search)}`);
        if (sort_by) params = params.concat(`&sort_by=${sort_by}`);
        await fetchCompareBuildingsV2(params)
            .then((res) => {
                let response = res?.data.data;
                setBuildingsData(response);
                setIsLoadingBuildingData(false);
            })
            .catch((error) => {
                setIsLoadingBuildingData(false);
            });
    };
    useEffect(() => {
        const ordered_by = sortBy.name === undefined ? 'building_name' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'dce' : sortBy.method;

        fetchcompareBuildingsData(search, ordered_by, sort_by, userPrefUnits);
    }, [search, sortBy, daysCount, userPrefUnits]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Portfolio Overview',
                        path: '/carbon/portfolio/overview',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'carbon-portfolio';
            });
        };
        const updateBuildingData = () => {
            updateBuildingStore('portfolio', 'Portfolio', '');
        };

        updateBreadcrumbStore();
        updateBuildingData();
    }, []);

    const renderName = (row) => {
        return (
            <>
                <Typography.Link
                    size={Typography.Sizes.md}
                    className="mouse-pointer"
                    onClick={() => {
                        updateBuildingStore(row?.building_id, row?.building_name, row?.timezone, row?.plug_only);
                        history.push({
                            pathname: `/carbon/building/overview/${row.building_id}`,
                        });
                    }}>
                    {row.building_name !== '' ? row.building_name : '-'}
                </Typography.Link>
                <div className="mt-1 w-50">
                    <Badge text={row.building_type || '-'} />
                </div>
            </>
        );
    };

    const handleDownloadCsv = async () => {
        download(
            'Compare_Buildings',
            getCarbonCompareBuildingsTableCSVExport(buildingsData, tableHeader(userPrefUnits))
        );
    };

    const renderAverageEmissionRate = (row) => {
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>
                    {row?.average_carbon_intensity !== null ? parseFloat(row?.average_carbon_intensity).toFixed(2) : 0}{' '}
                    {userPrefUnits === 'si' ? `${UNITS.kg}/MWh` : `${UNITS.ibs}/MWh`}
                </Typography.Body>
            </>
        );
    };

    const renderTotalConsumption = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {Math.round(row.total_carbon_emissions)} {userPrefUnits === 'si' ? `${UNITS.kg}` : `${UNITS.ibs}`}
            </Typography.Body>
        );
    };

    const renderChangeEnergy = (row) => {
        return (
            <div>
                {row.carbon_emissions.now >= row.carbon_emissions.old ? (
                    <TrendsBadge
                        value={Math.abs(Math.round(row.carbon_emissions.change))}
                        type={TRENDS_BADGE_TYPES.UPWARD_TREND}
                    />
                ) : (
                    <TrendsBadge
                        value={Math.abs(Math.round(row.carbon_emissions.change))}
                        type={TRENDS_BADGE_TYPES.DOWNWARD_TREND}
                    />
                )}
            </div>
        );
    };

    const renderSquareFootage = (row) => {
        return <div>{row.square_footage}</div>;
    };

    return (
        <>
            <Header title="Portfolio Overview" type="page" />
            <Brick sizeInRem={1.5} />

            {userPermission?.user_role === 'admin' ||
            userPermission?.permissions?.permissions?.energy_portfolio_permission?.view ? (
                <>
                    <Row>
                        <div>
                            <PortfolioKPIs
                                daysCount={daysCount}
                                totalBuilding={buildingsEnergyConsume.length}
                                overalldata={overalldata}
                                userPrefUnits={userPrefUnits}
                            />
                        </div>
                    </Row>

                    <Brick sizeInRem={1.5} />
                    <Row>
                        <Col xl={12}>
                            <DataTableWidget
                                isLoading={isLoadingBuildingData}
                                isLoadingComponent={<SkeletonLoader noOfColumns={tableHeader.length} noOfRows={8} />}
                                id="carbon-compare-building"
                                onSearch={(query) => setSearch(query)}
                                rows={buildingsData}
                                searchResultRows={buildingsData}
                                onDownload={handleDownloadCsv}
                                headers={tableHeader}
                                buttonGroupFilterOptions={[]}
                                totalCount={() => {
                                    if (search) {
                                        return totalItemsSearched;
                                    }
                                    return 0;
                                }}
                            />
                        </Col>
                    </Row>
                </>
            ) : (
                <div>You don't have the permission to view this page</div>
            )}
        </>
    );
};

export default CarbonOverview;
