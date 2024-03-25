import React, { useEffect, useState, useCallback } from 'react';
import Brick from '../../sharedComponents/brick';
import { Progress, UncontrolledTooltip } from 'reactstrap';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';
import SkeletonLoader from '../../components/SkeletonLoader';
import { formatConsumptionValue, pageListSizes } from '../../helpers/helpers';
import Typography from '../../sharedComponents/typography';
import { UNITS } from '../../constants/units';
import { TrendsBadge } from '../../sharedComponents/trendsBadge';
import { DateRangeStore } from '../../store/DateRangeStore';
import { BuildingStore } from '../../store/BuildingStore';
import { UserStore } from '../../store/UserStore';
import { useParams } from 'react-router-dom';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { getExploreByEquipmentTableCSVExport } from '../../utils/tablesExport';
import { fetchEquipmentBySpace } from './services';
import { Badge } from '../../sharedComponents/badge';

const EquipmentTable = ({ spaceId }) => {
    const { download } = useCSVDownload();
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const bldgName = BuildingStore.useState((s) => s.BldgName);
    const userPrefUnits = UserStore.useState((s) => s.unit);

    const { bldgId } = useParams();

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [equipments, setEquipments] = useState([]);
    const [equipmentsLoading, setEquipmentsLoading] = useState([]);
    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    // const [checkedAll, setCheckedAll] = useState(false);
    // const [equipmentFilter, setEquipmentFilter] = useState({});

    const fetchEquipDataList = async () => {
        setEquipmentsLoading(true);
        // const orderedBy = sortBy.name === undefined || sortBy.method === null ? 'consumption' : sortBy.name;
        // const sortedBy = sortBy.method === undefined || sortBy.method === null ? 'dce' : sortBy.method;

        try {
            const query = {
                bldgId,
                dateFrom: startDate,
                dateTo: endDate,
                timeZone,
                page: pageNo,
                size: pageSize,
                search,
            };
            const responseAxios = await fetchEquipmentBySpace(query, spaceId);

            const data = responseAxios;
            if (data && Array.isArray(data) && data.length !== 0) {
                // should be done on backend
                const totalConsumption = data.reduce((reducer, equipment) => {
                    return reducer + Math.round(equipment?.total_consumption?.now);
                }, 0);

                const mappedData = data.map((equipment) => {
                    equipment.total_all_consumption = totalConsumption;
                    return equipment;
                });

                setTotalItems(mappedData.length);
                setEquipments(mappedData);
            }
        } catch {
            setEquipments([]);
            setTotalItems(0);
        }

        setEquipmentsLoading(false);
    };

    useEffect(() => {
        if (!bldgId || !startDate || !endDate) return;

        fetchEquipDataList();
    }, [startDate, endDate, bldgId, search, sortBy, pageSize, pageNo, userPrefUnits]);

    const handleDownloadCSV = async () => {
        setDownloadingCSVData(true);

        try {
            if (equipments.length !== 0) {
                download(
                    `${bldgName}_Energy_Consumption_By_Space${new Date().toISOString().split('T')[0]}`,
                    getExploreByEquipmentTableCSVExport(equipments, headerProps)
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
                        max={row?.total_all_consumption}
                        barClassName="custom-on-hour"
                    />
                </Progress>
            </>
        );
    });

    const calculatePercentageChange = (oldValue, newValue) => {
        const calculatedOldValue = oldValue > 0 ? oldValue : 1;
        const calculatedNewValue = newValue > 0 ? newValue : 1;

        return ((calculatedNewValue - calculatedOldValue) / calculatedOldValue) * 100;
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
        const tag = [];
        const slicedArr = tag.slice(1);

        return (
            <div className="tag-row-content">
                <Badge text={<span className="gray-950">{tag[0] ? tag[0] : 'none'}</span>} />
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
        // setCheckedAll(false);
    };

    return (
        <DataTableWidget
            id="explore-by-equipment"
            isLoading={equipmentsLoading}
            isLoadingComponent={<SkeletonLoader noOfColumns={headerProps.length + 1} noOfRows={20} />}
            onSearch={handleSearch}
            buttonGroupFilterOptions={[]}
            rows={equipments}
            searchResultRows={equipments}
            filterOptions={[]}
            headers={headerProps}
            pageSize={pageSize}
            onPageSize={setPageSize}
            currentPage={pageNo}
            onChangePage={setPageNo}
            pageListSizes={pageListSizes}
            totalCount={totalItems}
            isCSVDownloading={isCSVDownloading}
            onDownload={handleDownloadCSV}
        />
    );
};

export default EquipmentTable;
