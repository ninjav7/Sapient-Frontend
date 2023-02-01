import React, { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import { Row, Col } from 'reactstrap';
import { formatConsumptionValue } from '../../helpers/helpers';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { useHistory } from 'react-router-dom';
import { ComponentStore } from '../../store/ComponentStore';
import { fetchCompareBuildings } from '../../services/compareBuildings';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { percentageHandler } from '../../utils/helper';
import Typography from '../../sharedComponents/typography';
import { TrendsBadge } from '../../sharedComponents/trendsBadge';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { getCompareBuildingTableCSVExport } from '../../utils/tablesExport';
import { Badge } from '../../sharedComponents/badge';
import { TinyBarChart } from '../../sharedComponents/tinyBarChart';
import './style.css';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { timeZone } from '../../utils/helper';
import { BuildingStore } from '../../store/BuildingStore';
import { apiRequestBody } from '../../helpers/helpers';
import { primaryGray1000 } from '../../assets/scss/_colors.scss';
import { getAverageValue } from '../../helpers/AveragePercent';
import Brick from '../../sharedComponents/brick';

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

const CompareBuildings = () => {
    const [buildingsData, setBuildingsData] = useState([]);
    const startDate = DateRangeStore.useState((s) => new Date(s.startDate));
    const [sortBy, setSortBy] = useState({});
    const history = useHistory();
    const { download } = useCSVDownload();
    const [search, setSearch] = useState('');
    const [topEnergyDensity, setTopEnergyDensity] = useState();
    const [totalItemsSearched, setTotalItemsSearched] = useState(0);
    const endDate = DateRangeStore.useState((s) => new Date(s.endDate));
    const daysCount = DateRangeStore.useState((s) => +s.daysCount);
    const [isLoadingBuildingData, setIsLoadingBuildingData] = useState(false);
    let entryPoint = '';
    let top = '';

    useEffect(() => {
        entryPoint = 'entered';
    }, []);

    useEffect(() => {
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

            localStorage.setItem('building_Id', 'portfolio');
            localStorage.setItem('buildingName', 'Portfolio');

            BuildingStore.update((s) => {
                s.Building_Id = 'portfolio';
                s.Building_Name = 'Portfolio';
            });
        };
        updateBreadcrumbStore();
    }, []);

    const fetchcompareBuildingsData = async () => {
        setIsLoadingBuildingData(true);
        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name,
                sort_by: sortBy.method,
            };
        let payload = apiRequestBody(startDate, endDate, timeZone);
        let params = ``;
        if (sorting?.order_by && sorting?.sort_by) {
            params += `?order_by=${sorting?.order_by}&sort_by=${sorting?.sort_by}`;
        }
        if (search.length) {
            params += `?building_search=${search}`;
        }
        await fetchCompareBuildings(params, payload)
            .then((res) => {
                let response = res?.data;
                let topVal = Math.max(...response.map((o) => o.energy_density));
                top = topVal;
                setTopEnergyDensity(topVal);
                setBuildingsData(response);
                setIsLoadingBuildingData(false);
            })
            .catch((error) => {
                setIsLoadingBuildingData(false);
            });
    };

    const renderEnergyDensity = (row) => {
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>
                    {row.energy_density.toFixed(2)} kWh / sq. ft.
                </Typography.Body>
                <Brick sizeInRem={0.375} />
                <TinyBarChart percent={getAverageValue(row.energy_density, 0, top)} />
            </>
        );
    };

    const renderName = (row) => {
        return (
            <>
                <Typography.Link
                    size={Typography.Sizes.md}
                    className="mouse-pointer"
                    onClick={() => {
                        localStorage.setItem('building_Id', row.building_id);
                        localStorage.setItem('buildingName', row.building_name);
                        localStorage.setItem('buildingTimeZone', row.timezone);
                        BuildingStore.update((s) => {
                            s.BldgId = row.building_id;
                            s.BldgTimeZone = row.timezone;
                            s.BldgName = row.building_name;
                        });
                        history.push({
                            pathname: `/energy/building/overview/${row.building_id}`,
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

    const renderTotalConsumption = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {parseInt(row.total_consumption / 1000)}
                {` kWh`}
            </Typography.Body>
        );
    };

    const renderChangeEnergy = (row) => {
        const diffPercentage = percentageHandler(row.energy_consumption.now, row.energy_consumption.old);
        return (
            <div>
                {row.energy_consumption.now >= row.energy_consumption.old ? (
                    <TrendsBadge value={diffPercentage} type={TRENDS_BADGE_TYPES.UPWARD_TREND} />
                ) : (
                    <TrendsBadge value={diffPercentage} type={TRENDS_BADGE_TYPES.UPWARD_TREND} />
                )}
            </div>
        );
    };

    const renderSquareFootage = (row) => {
        return <div>{formatConsumptionValue(row.square_footage)}</div>;
    };

    const headerProps = [
        {
            name: 'Name',
            accessor: 'building_name',
            callbackValue: renderName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Average Consumption / sq. ft.',
            accessor: 'energy_density',
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
            accessor: 'energy_consumption',
            callbackValue: renderChangeEnergy,
        },
        {
            name: 'Sq. Ft.',
            accessor: 'square_footage',
            callbackValue: renderSquareFootage,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    const handleDownloadCsv = async () => {
        download('Compare_Buildings', getCompareBuildingTableCSVExport(buildingsData, headerProps, topEnergyDensity));
    };

    useEffect(() => {
        fetchcompareBuildingsData();
    }, [search, sortBy, daysCount]);

    return (
        <React.Fragment>
            <Header title="Compare Buildings" type="page" />
            <Row className="mt-4">
                <Col lg={12}>
                    <DataTableWidget
                        isLoading={isLoadingBuildingData}
                        isLoadingComponent={<SkeletonLoading />}
                        id="compare-building"
                        onSearch={(query) => {
                            setSearch(query);
                        }}
                        rows={buildingsData}
                        searchResultRows={buildingsData}
                        onDownload={() => handleDownloadCsv()}
                        headers={headerProps}
                        disableColumnDragging={true}
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
        </React.Fragment>
    );
};

export default CompareBuildings;
