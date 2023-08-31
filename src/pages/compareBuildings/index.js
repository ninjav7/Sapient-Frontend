import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import { Row, Col } from 'reactstrap';
import { formatConsumptionValue } from '../../helpers/helpers';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { useHistory } from 'react-router-dom';
import { ComponentStore } from '../../store/ComponentStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import Typography from '../../sharedComponents/typography';
import { TrendsBadge } from '../../sharedComponents/trendsBadge';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { getCompareBuildingTableCSVExport } from '../../utils/tablesExport';
import { Badge } from '../../sharedComponents/badge';
import { TinyBarChart } from '../../sharedComponents/tinyBarChart';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { timeZone } from '../../utils/helper';
import { apiRequestBody } from '../../helpers/helpers';
import { primaryGray1000 } from '../../assets/scss/_colors.scss';
import { getAverageValue } from '../../helpers/AveragePercent';
import Brick from '../../sharedComponents/brick';
import { updateBuildingStore } from '../../helpers/updateBuildingStore';
import { UserStore } from '../../store/UserStore';
import { UNITS } from '../../constants/units';
import { handleUnitConverstion } from '../settings/general-settings/utils';
import { fetchCompareBuildingsV2 } from './services';
import './style.css';

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
            <th>
                <Skeleton count={5} />
            </th>
        </tr>
    </SkeletonTheme>
);

const CompareBuildingsTable = ({
    tableHeader,
    isLoadingBuildingData,
    buildingsData,
    search,
    handleDownloadCsv,
    setSearch,
    totalItemsSearched,
}) => {
    return (
        <DataTableWidget
            isLoading={isLoadingBuildingData}
            isLoadingComponent={<SkeletonLoading />}
            id="compare-building"
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
    );
};

const CompareBuildings = () => {
    const history = useHistory();
    const { download } = useCSVDownload();
    const [buildingsData, setBuildingsData] = useState([]);

    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);
    const userPrefUnits = UserStore.useState((s) => s.unit);

    const [sortBy, setSortBy] = useState({});
    const [search, setSearch] = useState('');
    const [shouldRender, setShouldRender] = useState(true);

    const [topEnergyDensity, setTopEnergyDensity] = useState();
    const [totalItemsSearched, setTotalItemsSearched] = useState(0);

    const [isLoadingBuildingData, setIsLoadingBuildingData] = useState(false);
    let entryPoint = '';
    let top = '';

    const renderName = (row) => {
        return (
            <>
                <Typography.Link
                    size={Typography.Sizes.md}
                    className="mouse-pointer"
                    onClick={() => {
                        updateBuildingStore(row?.building_id, row?.building_name, row?.timezone, row?.plug_only);
                        history.push({
                            pathname: `/energy/building/overview/${row?.building_id}`,
                        });
                    }}>
                    {row?.building_name !== '' ? row?.building_name : '-'}
                </Typography.Link>
                <div className="mt-1 w-50">
                    <Badge text={row?.building_type || '-'} />
                </div>
            </>
        );
    };

    const renderEnergyDensity = (row) => {
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>
                    {`${formatConsumptionValue(row?.average_consumption, 2)} ${row?.average_consumption_units}`}
                </Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={getAverageValue(row?.average_consumption, 0, top)} />
            </>
        );
    };

    const renderTotalConsumption = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {`${formatConsumptionValue(Math.round(row?.total_consumption / 1000))} ${UNITS.KWH}`}
            </Typography.Body>
        );
    };

    const renderEquipmentCount = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{`${row?.equipment_count}`}</Typography.Body>;
    };

    const renderChangeEnergy = (row) => {
        return (
            <div>
                {row?.energy_consumption.now >= row?.energy_consumption.old ? (
                    <TrendsBadge
                        value={Math.abs(Math.round(row?.energy_consumption.change))}
                        type={TRENDS_BADGE_TYPES.UPWARD_TREND}
                    />
                ) : (
                    <TrendsBadge
                        value={Math.abs(Math.round(row?.energy_consumption.change))}
                        type={TRENDS_BADGE_TYPES.DOWNWARD_TREND}
                    />
                )}
            </div>
        );
    };

    const renderSquareFootage = (row) => {
        return <div>{formatConsumptionValue(row?.square_footage)}</div>;
    };

    const [tableHeader, setTableHeader] = useState([
        {
            name: 'Name',
            accessor: 'building_name',
            callbackValue: renderName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: `Average Consumption / ${userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`}`,
            accessor: 'average_consumption',
            callbackValue: renderEnergyDensity,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Total Consumption',
            accessor: 'total_consumption',
            callbackValue: renderTotalConsumption,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: '% Change',
            accessor: 'change',
            callbackValue: renderChangeEnergy,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: `${userPrefUnits === 'si' ? `Sq. M.` : `Sq. Ft.`}`,
            accessor: 'square_footage',
            callbackValue: renderSquareFootage,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Equipment Count',
            accessor: 'equipment_count',
            callbackValue: renderEquipmentCount,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ]);

    const fetchCompareBuildingsData = async (search, ordered_by = 'total_consumption', sort_by, userPrefUnits) => {
        setIsLoadingBuildingData(true);

        const start_date = encodeURIComponent(startDate);
        const end_date = encodeURIComponent(endDate);

        let params = `?date_from=${start_date}&date_to=${end_date}&tz_info=${timeZone}&ordered_by=${ordered_by}`;

        if (search) params = params.concat(`&building_search=${encodeURIComponent(search)}`);
        if (sort_by) params = params.concat(`&sort_by=${sort_by}`);

        await fetchCompareBuildingsV2(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    let responseData = response?.data;

                    let topVal = Math.max(...responseData.map((o) => o.average_consumption));
                    top = Math.max(...responseData.map((o) => o.average_consumption));
                    responseData.length !== 0 &&
                        responseData.forEach((el) => {
                            el.square_footage = Math.round(handleUnitConverstion(el.square_footage, userPrefUnits));
                            el.average_consumption = el?.average_consumption / 1000;
                            el.average_consumption_units = `${
                                userPrefUnits === 'si' ? `kWh / sq. m.` : `kWh / sq. ft.`
                            }`;
                        });
                    setTopEnergyDensity(topVal);
                    setBuildingsData(responseData);
                }
                setIsLoadingBuildingData(false);
            })
            .catch((error) => {
                setIsLoadingBuildingData(false);
            });
    };

    const handleDownloadCsv = async () => {
        download('Compare_Buildings', getCompareBuildingTableCSVExport(buildingsData, tableHeader));
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Compare Buildings',
                    path: '/energy/compare-buildings',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'portfolio';
        });
        updateBuildingStore('portfolio', 'Portfolio', '');
    };

    useEffect(() => {
        if (userPrefUnits) {
            let newHeaderList = tableHeader;
            newHeaderList.forEach((record) => {
                if (record?.accessor === 'average_consumption') {
                    record.name = `Average Consumption / ${
                        userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`
                    }`;
                }
                if (record?.accessor === 'square_footage') {
                    record.name = `${userPrefUnits === 'si' ? `Sq. M.` : `Sq. Ft.`}`;
                }
            });
            setTableHeader(newHeaderList);
            setShouldRender((prev) => !prev); // This is set to trigger re-render for DataTableWidget component
        }
    }, [userPrefUnits]);

    useEffect(() => {
        const ordered_by = sortBy.name === undefined ? 'total_consumption' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'dce' : sortBy.method;

        fetchCompareBuildingsData(search, ordered_by, sort_by, userPrefUnits);
    }, [search, sortBy, daysCount, userPrefUnits]);

    useEffect(() => {
        entryPoint = 'entered';
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Header title="Compare Buildings" type="page" />
            <Row className="mt-4">
                <Col lg={12}>
                    <CompareBuildingsTable
                        tableHeader={tableHeader}
                        isLoadingBuildingData={isLoadingBuildingData}
                        buildingsData={buildingsData}
                        search={search}
                        sortBy={sortBy}
                        handleDownloadCsv={handleDownloadCsv}
                        setSearch={setSearch}
                        setSortBy={setSortBy}
                        totalItemsSearched={totalItemsSearched}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default CompareBuildings;
