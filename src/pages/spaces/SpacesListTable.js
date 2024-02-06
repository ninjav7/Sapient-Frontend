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
import { fetchAllSpacesV2 } from './services';
import useCSVDownload from '../../sharedComponents/hooks/useCSVDownload';
import { getExploreByEquipmentTableCSVExport } from '../../utils/tablesExport';

const SpacesListTable = ({ colorfulSpaces }) => {
    const { download } = useCSVDownload();
    const startDate = DateRangeStore.useState((s) => s.startDate);
    const endDate = DateRangeStore.useState((s) => s.endDate);
    const timeZone = BuildingStore.useState((s) => s.BldgTimeZone);
    const bldgName = BuildingStore.useState((s) => s.BldgName);
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
        const query = { bldgId, dateFrom: startDate, dateTo: endDate, tzInfo: timeZone };

        try {
            const data = await fetchAllSpacesV2(query);

            if (data && Array.isArray(data) && data.length !== 0) {
                const updatedData = data.map((space) => {
                    const identicalColorfulSpace = colorfulSpaces.find(
                        (colorfulSpace) => colorfulSpace.space_id === space.space_id
                    );

                    const newSpaceData = {
                        ...space,
                        consumptionBarColor: identicalColorfulSpace?.color,
                    };

                    return newSpaceData;
                });

                setSpaces(updatedData);
            }
        } catch {
            setSpaces([]);
        }

        setSpacesLoading(false);
    };

    useEffect(() => {
        if (!bldgId || startDate === null || endDate === null) return;

        fetchEquipDataList();
    }, [startDate, endDate, bldgId, search, sortBy, pageSize, pageNo, colorfulSpaces]);

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

    const renderSpaceName = useCallback((row) => {
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
                    }}>
                    {row?.equipment_name !== '' ? row?.equipment_name : '-'}
                </a>
                <Brick sizeInPixels={3} />
            </div>
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
        const change = row?.consumption?.change;

        return (
            change &&
            Number.isInteger(change) && (
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

    const renderSquareFootage = useCallback((row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row?.square_footage + ' ' + 'm^2'}</Typography.Body>;
    });

    const renderTags = useCallback((row) => {
        const slicedArr = row?.tag.slice(1);

        return (
            <div className="tag-row-content">
                <Badge text={<span className="gray-950">{row?.tag[0] ? row?.tag[0] : 'none'}</span>} />
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
            name: 'Square Footage',
            accessor: 'square_footage',
            callbackValue: renderSquareFootage,
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
        <Col lg={12}>
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
        </Col>
    );
};

export default SpacesListTable;
