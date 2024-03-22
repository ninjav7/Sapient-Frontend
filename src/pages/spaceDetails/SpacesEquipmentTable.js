import React, { useEffect, useState, useCallback } from 'react';
import Brick from '../../sharedComponents/brick';
import { Col, UncontrolledTooltip, Progress } from 'reactstrap';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import SkeletonLoader from '../../components/SkeletonLoader';
import { formatConsumptionValue, pageListSizes } from '../../helpers/helpers';
import Typography from '../../sharedComponents/typography';
import { UNITS } from '../../constants/units';
import { TrendsBadge } from '../../sharedComponents/trendsBadge';
import { Badge } from '../../sharedComponents/badge';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { UserStore } from '../../store/UserStore';
import { useParams } from 'react-router-dom';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { getExploreByEquipmentTableCSVExport } from '../../utils/tablesExport';
import { Link } from 'react-router-dom';
import { fetchEquipmentBySpace } from './services';

const SpacesEquipmentTable = ({ spaceType, spaceId }) => {
    const { download } = useCSVDownload();
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const startTime = DateRangeStore.useState((s) => s.startTime);
    const endTime = DateRangeStore.useState((s) => s.endTime);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const bldgName = BuildingStore.useState((s) => s.BldgName);
    const userPrefUnits = UserStore.useState((s) => s.unit);

    const { bldgId } = useParams();

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [checkedAll, setCheckedAll] = useState(false);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [equipmentFilter, setEquipmentFilter] = useState({});
    const [spaces, setSpaces] = useState([]);
    const [spacesLoading, setSpacesLoading] = useState([]);
    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    const fetchEquipDataList = async () => {
        setSpacesLoading(true);
        // const orderedBy = sortBy.name === undefined || sortBy.method === null ? 'consumption' : sortBy.name;
        // const sortedBy = sortBy.method === undefined || sortBy.method === null ? 'dce' : sortBy.method;

        try {
            const query = { bldgId, dateFrom: startDate, dateTo: endDate, timeZone };
            const responseAxios = await fetchEquipmentBySpace(query, spaceId);

            const data = responseAxios;
            if (data && Array.isArray(data) && data.length !== 0) {
                const mappedData = data.map((equip) => {
                    equip.space_type = spaceType;
                    return equip;
                });

                // backend should add it

                setSpaces(mappedData);
            }
        } catch {
            setSpaces([]);
        }

        setSpacesLoading(false);
    };

    useEffect(() => {
        if (!bldgId || !startDate || !endDate) return;

        fetchEquipDataList();
    }, [startDate, endDate, bldgId, search, sortBy, pageSize, pageNo, userPrefUnits]);

    const handleDownloadCSV = async () => {
        setDownloadingCSVData(true);

        try {
            if (spaces.length !== 0) {
                download(
                    `${bldgName}_Energy_Consumption_By_Space${new Date().toISOString().split('T')[0]}`,
                    getExploreByEquipmentTableCSVExport(spaces, headerProps)
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

    const renderConsumption = useCallback((row) => {
        return (
            <>
                <Typography.Body size={Typography.Sizes.sm}>
                    {`${formatConsumptionValue(Math.round(row?.total_consumption?.now / 1000))} ${UNITS.KWH}`}
                </Typography.Body>
                <Brick sizeInRem={0.375} />
                <Progress multi className="custom-progress-bar" style={{ height: '6px' }}>
                    <Progress
                        bar
                        value={row?.total_consumption?.now}
                        max={row?.total_consumption?.now}
                        barClassName="custom-on-hour"
                    />
                </Progress>
            </>
        );
    });
    const calculatePercentageChange = (oldValue, newValue) => {
        return ((newValue - oldValue) / oldValue) * 100;
    };

    const renderPerChange = useCallback((row) => {
        const change = calculatePercentageChange(row?.total_consumption?.old, row?.total_consumption?.now);

        return (
            Number.isFinite(change) && (
                <TrendsBadge
                    value={Math.abs(Math.round(change))}
                    type={
                        change === 0
                            ? TrendsBadge.Type.NEUTRAL_TREND
                            : row?.total_consumption?.now < row?.total_consumption?.old
                            ? TrendsBadge.Type.DOWNWARD_TREND
                            : TrendsBadge.Type.UPWARD_TREND
                    }
                />
            )
        );
    });

    const renderTags = useCallback((row) => {
        const slicedArr = row?.tags?.slice(1);

        return <></>;
    });

    const headerProps = [
        {
            name: 'Name',
            accessor: 'equipment_name',
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
            name: 'Space Type',
            accessor: 'space_type_name',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Equipment Type',
            accessor: 'equipment_name',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'End Use Category',
            accessor: 'end_use_name',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Tags',
            accessor: 'tag',
            callbackValue: renderTags,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    const handleSearch = (e) => {
        setSearch(e);
        setCheckedAll(false);
    };

    return (
        <DataTableWidget
            id="explore-by-equipment"
            isLoading={spacesLoading}
            isLoadingComponent={<SkeletonLoader noOfColumns={headerProps.length + 1} noOfRows={20} />}
            onSearch={handleSearch}
            buttonGroupFilterOptions={[]}
            rows={spaces}
            searchResultRows={spaces}
            filterOptions={[]}
            headers={headerProps}
            // pageSize={pageSize}
            // currentPage={pageNo}
            // onPageSize={setPageSize}
            // onChangePage={setPageNo}
            // pageListSizes={pageListSizes}
            // totalCount={totalItems}
            isCSVDownloading={isCSVDownloading}
            onDownload={handleDownloadCSV}
        />
    );
};

export default SpacesEquipmentTable;
