import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import Header from '../../components/Header';
import moment from 'moment';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { formatConsumptionValue } from '../../helpers/helpers';
import { getAverageValue } from '../../helpers/AveragePercent';
import { Badge } from '../../sharedComponents/badge';
import { fetchCompareBuildings, getCarbonBuildingChartData } from '../../services/compareBuildings';
import { getCompareBuildingTableCSVExport } from '../../utils/tablesExport';

import { TrendsBadge } from '../../sharedComponents/trendsBadge';

import {
    fetchPortfolioBuilidings,
    fetchPortfolioOverall,
    fetchPortfolioEndUse,
    fetchPortfolioEnergyConsumption,
} from '../portfolio/services';
import { useHistory } from 'react-router-dom';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';

import { TinyBarChart } from '../../sharedComponents/tinyBarChart';

import { primaryGray1000 } from '../../assets/scss/_colors.scss';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import Typography from '../../sharedComponents/typography';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { timeZone } from '../../utils/helper';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import 'react-loading-skeleton/dist/skeleton.css';
import PortfolioKPIs from './PortfolioKPIs';
import EnergyConsumptionByEndUse from '../../sharedComponents/energyConsumptionByEndUse';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import { apiRequestBody } from '../../helpers/helpers';
import Brick from '../../sharedComponents/brick';
import ColumnChart from '../../sharedComponents/columnChart/ColumnChart';
import colors from '../../assets/scss/_colors.scss';
import { UNITS } from '../../constants/units';
import { xaxisLabelsCount, xaxisLabelsFormat } from '../../sharedComponents/helpers/highChartsXaxisFormatter';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { UserStore } from '../../store/UserStore';
import './style.scss';

export const handleUnitConverstion = (value = 0, currentType = 'imp') => {
    if (currentType === 'si') value = value / 10.7639;
    return value;
};

const SkeletonLoading = () => (
    <SkeletonTheme color={primaryGray1000} height={35}>
        <tr>
            <th>
                <Skeleton count={5} />
            </th>
            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>
            <th>
                <Skeleton count={5} />
            </th>
        </tr>
    </SkeletonTheme>
);

const SingularityWidget = () => {
    useEffect(() => {
        // Install Singularity on the webpage
        (function (window, document) {
            if (window.singularity) console.error('singularity embed already included');
            window.singularity = {};
            const m = ['init', 'chart', 'debug'];
            window.singularity._c = [];
            m.forEach(
                (me) =>
                    (window.singularity[me] = function () {
                        window.singularity._c.push([me, arguments]);
                    })
            );
            const elt = document.createElement('script');
            elt.type = 'text/javascript';
            elt.async = true;
            elt.src = 'https://js.singularity.energy/widget/shim.js';
            const before = document.getElementsByTagName('script')[0];
            before.parentNode.insertBefore(elt, before);
        })(window, document, undefined);

        // Initialize the Singularity widget with your public ID
        // window?.singularity?.authorize("2a5154fe73f74442a36c2cd6267ab602");

        window.singularity.init('eb096e746b');
        window.singularity.chart({
            containerId: 'element-id-for-singularity-chart',
            width: '800',
            height: '440',
            title: "Today's carbon intensity comparison",
            style: { fontFamily: 'sans-serif' },
            series: [
                {
                    timeframe: 'realtime',
                    data: {
                        type: 'carbon_intensity',
                        source: 'ISONE',
                    },
                    name: 'New England (ISONE)',
                },
                {
                    timeframe: 'realtime',
                    data: {
                        type: 'carbon_intensity',
                        source: 'NYISO',
                    },
                    name: 'New York (NYISO)',
                },
                {
                    timeframe: 'realtime',
                    data: {
                        type: 'carbon_intensity',
                        source: 'CAISO',
                    },
                    name: 'California (CAISO)',
                },
            ],
            chart: {
                yAxis: {
                    gridLineColor: 'rgba(200,200,200, 0.2)',
                    title: { text: 'lbs CO2 per MWh' },
                },
                time: { useUTC: false },
                legend: { enabled: true },
                tooltip: {
                    dateFormat: {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    },
                    yLabel: 'lbs/MWh',
                },
            },
        });
    }, []);
    return <div id="element-id-for-singularity-chart"></div>;
};

const CarbonOverview = () => {
    const [userPermission] = useAtom(userPermissionData);
    const [buildingsEnergyConsume, setBuildingsEnergyConsume] = useState([]);
    const [energyConsumption, setenergyConsumption] = useState([]);
    const [isEnergyConsumptionChartLoading, setIsEnergyConsumptionChartLoading] = useState(false);
    const [markers, setMarkers] = useState([]);

    const history = useHistory();
    const { download } = useCSVDownload();
    const [buildingsData, setBuildingsData] = useState([]);

    const [sortBy, setSortBy] = useState({});
    const [search, setSearch] = useState('');
    const [shouldRender, setShouldRender] = useState(true);

    const [topEnergyDensity, setTopEnergyDensity] = useState();
    const [totalItemsSearched, setTotalItemsSearched] = useState(0);
    const [tableHeader, setTableHeader] = useState([
        {
            name: 'Name',
            accessor: 'building_name',
            callbackValue: (row) => renderName(row),
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: `Average Consumption / ${userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`}`,
            accessor: 'energy_density',
            callbackValue: (row) => renderEnergyDensity(row),

            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Total Consumption',
            accessor: 'total_consumption',
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
    ]);

    const [isLoadingBuildingData, setIsLoadingBuildingData] = useState(false);
    let entryPoint = '';
    let top = '';
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);

    const userPrefUnits = UserStore.useState((s) => s.unit);
    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    const [overalldata, setOveralldata] = useState({
        total_building: 0,
        total_consumption: {
            now: 0,
            old: 0,
        },
        total_carbon_emissions: {
            now: 10,
            old: 8,
        },
        yearly_electric_eui: {
            now: 0,
            old: 0,
        },
    });
    useEffect(() => {
        if (userPrefUnits) {
            let newHeaderList = tableHeader;
            newHeaderList.forEach((record) => {
                if (record?.accessor === 'building_size') {
                    record.name = `${userPrefUnits === 'si' ? `Sq. M.` : `Sq. Ft.`}`;
                }
            });
            setTableHeader(newHeaderList);
        }
    }, [userPrefUnits]);
    const [isKPIsLoading, setIsKPIsLoading] = useState(false);
    const [dateFormat, setDateFormat] = useState('MM/DD HH:00');
    const [energyConsumptionsCategories, setEnergyConsumptionsCategories] = useState([]);
    const [energyConsumptionsData, setEnergyConsumptionsData] = useState([]);
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
    const fetchcompareBuildingsData = async (search, ordered_by = 'energy_density', sort_by, userPrefUnits) => {
        setIsLoadingBuildingData(true);
        let payload = apiRequestBody(startDate, endDate, timeZone);
        let params = `?ordered_by=${ordered_by}`;
        if (search) params = params.concat(`&building_search=${encodeURIComponent(search)}`);
        if (sort_by) params = params.concat(`&sort_by=${sort_by}`);
        await fetchCompareBuildings(params, payload)
            .then((res) => {
                let response = res?.data;
                let topVal = Math.max(...response.map((o) => o.energy_density));
                top = Math.max(...response.map((o) => o.energy_density));
                response.length !== 0 &&
                    response.forEach((el) => {
                        el.square_footage = Math.round(handleUnitConverstion(el.square_footage, userPrefUnits));
                        el.energy_density = el?.energy_density / 1000;
                        el.energy_density_units = `${userPrefUnits === 'si' ? `kWh / sq. m.` : `kWh / sq. ft.`}`;
                    });
                setTopEnergyDensity(topVal);
                setBuildingsData(response);
                setIsLoadingBuildingData(false);
            })
            .catch((error) => {
                setIsLoadingBuildingData(false);
            });
    };
    useEffect(() => {
        const ordered_by = sortBy.name === undefined ? 'energy_density' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'dce' : sortBy.method;

        fetchcompareBuildingsData(search, ordered_by, sort_by, userPrefUnits);
    }, [search, sortBy, daysCount, userPrefUnits]);
    useEffect(() => {
        if (startDate === null || endDate === null) return;

        // const portfolioOverallData = async () => {
        //     setIsKPIsLoading(true);
        //     let payload = apiRequestBody(startDate, endDate, timeZone);
        //     await fetchPortfolioOverall(payload)
        //         .then((res) => {
        //             if (res?.data) setOveralldata(res?.data);
        //             setIsKPIsLoading(false);
        //         })
        //         .catch((error) => {
        //             setIsKPIsLoading(false);
        //         });
        // };

        const portfolioEndUsesData = async () => {
            setIsEnergyConsumptionChartLoading(true);
            const params = `?off_hours=false`;
            const payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchPortfolioEndUse(params, payload)
                .then((res) => {
                    const response = res?.data?.data;
                    response.sort((a, b) => b?.energy_consumption?.now - a?.energy_consumption?.now);
                    response.forEach((record) => {
                        record.energy_consumption.now = Math.round(record.energy_consumption.now);
                        record.energy_consumption.old = Math.round(record.energy_consumption.old);
                    });
                    setenergyConsumption(response);
                    setIsEnergyConsumptionChartLoading(false);
                })
                .catch((error) => {
                    setIsEnergyConsumptionChartLoading(false);
                });
        };

        const energyConsumptionData = async () => {
            const payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchPortfolioEnergyConsumption(payload)
                .then((res) => {
                    const response = res?.data;
                    let energyCategories = [];
                    let energyData = [
                        {
                            name: 'Energy',
                            data: [],
                        },
                    ];
                    response.forEach((record) => {
                        energyCategories.push(record?.x);
                        energyData[0].data.push(parseFloat((record?.y / 1000).toFixed(2)));
                    });
                    setEnergyConsumptionsCategories(energyCategories);
                    setEnergyConsumptionsData(energyData);
                })
                .catch((error) => {});
        };

        const portfolioBuilidingsData = async () => {
            let payload = apiRequestBody(startDate, endDate, timeZone);
            await fetchPortfolioBuilidings(payload)
                .then((res) => {
                    let data = res.data;
                    setBuildingsEnergyConsume(data);
                    let markerArray = [];
                    data.map((record) => {
                        let markerObj = {
                            markerOffset: 25,
                            name: record.buildingName,
                            coordinates: [parseInt(record.lat), parseInt(record.long)],
                        };
                        markerArray.push(markerObj);
                    });
                    const markerArr = [
                        { markerOffset: 25, name: 'NYPL', coordinates: [-74.006, 40.7128] },
                        { markerOffset: 25, name: 'Justin', coordinates: [90.56, 76.76] },
                    ];
                    setMarkers(markerArr);
                })
                .catch((error) => {});
        };

        portfolioBuilidingsData();
        // portfolioOverallData();
        portfolioEndUsesData();
        energyConsumptionData();
    }, [startDate, endDate, userPrefUnits]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Carbon Overview',
                        path: '/carbon/portfolio/overview',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'carbon';
            });
        };

        const updateBuildingData = () => {
            updateBuildingStore('carbon', 'Carbon', '');
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
                        updateBuildingStore(row.building_id, row.building_name, row.timezone);
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
        download('Compare_Buildings', getCompareBuildingTableCSVExport(buildingsData, tableHeader));
    };

    const renderEnergyDensity = (row) => {
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>
                    {Math.round(row?.energy_density)} {row?.energy_density_units}
                </Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={getAverageValue(row.energy_density, 0, top)} />
            </>
        );
    };

    const renderTotalConsumption = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {Math.round(row.total_consumption / 1000)} {UNITS.KWH}
            </Typography.Body>
        );
    };


    const renderChangeEnergy = (row) => {
        return (
            <div>
                {row.energy_consumption.now >= row.energy_consumption.old ? (
                    <TrendsBadge
                        value={Math.abs(Math.round(row.energy_consumption.change))}
                        type={TRENDS_BADGE_TYPES.UPWARD_TREND}
                    />
                ) : (
                    <TrendsBadge
                        value={Math.abs(Math.round(row.energy_consumption.change))}
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
                                isLoadingComponent={<SkeletonLoading />}
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
                    <SingularityWidget />
                </>
            ) : (
                <div>You don't have the permission to view this page</div>
            )}
        </>
    );
};

export default CarbonOverview;
