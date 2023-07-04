import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Row, Col } from 'reactstrap';
import { useParams } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Brick from '../../../sharedComponents/brick';
import { pageListSizes } from '../../../helpers/helpers';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { ReactComponent as WifiSlashSVG } from '../../../sharedComponents/assets/icons/wifislash.svg';
import { ReactComponent as WifiSVG } from '../../../sharedComponents/assets/icons/wifi.svg';
import { buildingData, userPermissionData } from '../../../store/globalState';
import { BuildingStore } from '../../../store/BuildingStore';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { StatusBadge } from '../../../sharedComponents/statusBadge';

const SkeletonLoading = () => (
    <SkeletonTheme color="$primary-gray-1000" height={35}>
        <tr>
            <th>
                <Skeleton count={10} />
            </th>

            <th>
                <Skeleton count={10} />
            </th>

            <th>
                <Skeleton count={10} />
            </th>

            <th>
                <Skeleton count={10} />
            </th>
        </tr>
    </SkeletonTheme>
);

const UtilityMeters = () => {
    const { bldgId } = useParams();
    const bldgName = BuildingStore.useState((s) => s.BldgName);
    const [buildingListData] = useAtom(buildingData);
    const [userPermission] = useAtom(userPermissionData);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [isDataFetching, setIsDataFetching] = useState(false);

    const [utilityMetersData, setUtilityMetersData] = useState([
        {
            status: true,
            device_id: '00:B0:D0:63:C2:26',
            modbus: '1',
            model: 'Sapient Pulse',
        },
        {
            status: false,
            device_id: '00:B0:D0:63:C2:26',
            modbus: '2',
            model: 'Sapient Pulse',
        },
    ]);

    const renderDeviceStatus = (row) => {
        return (
            <StatusBadge
                text={row?.status ? 'Online' : 'Offline'}
                type={row?.status ? StatusBadge.Type.success : StatusBadge.Type.error}
                icon={row?.status ? <WifiSVG /> : <WifiSlashSVG />}
            />
        );
    };

    const renderDeviceId = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row?.device_id}</Typography.Body>;
    };

    const renderModbus = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row?.modbus}</Typography.Body>;
    };

    const renderModel = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row?.model}</Typography.Body>;
    };

    const headerProps = [
        {
            name: 'Status',
            accessor: 'status',
            callbackValue: renderDeviceStatus,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Device ID',
            accessor: 'device_id',
            callbackValue: renderDeviceId,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Modbus',
            accessor: 'modbus',
            callbackValue: renderModbus,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Model',
            accessor: 'model',
            callbackValue: renderModel,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    const currentRow = () => {
        return utilityMetersData;
    };

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Utility Meters',
                        path: '/settings/utility-meters',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>Smart Meters</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.advanced_passive_device_permission?.create ? (
                            <div className="d-flex">
                                <Button
                                    label={'Add Utility Meter'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    icon={<PlusSVG />}
                                />
                            </div>
                        ) : null}
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={1.5} />

            <Row>
                <Col lg={12}>
                    <DataTableWidget
                        isLoading={isDataFetching}
                        isLoadingComponent={<SkeletonLoading />}
                        id="utility_meters_list"
                        onSearch={(query) => {
                            setPageNo(1);
                            setSearch(query);
                        }}
                        onStatus={(query) => {
                            setPageNo(1);
                            setPageSize(20);
                        }}
                        rows={currentRow()}
                        searchResultRows={currentRow()}
                        headers={headerProps}
                        currentPage={pageNo}
                        onChangePage={setPageNo}
                        pageSize={pageSize}
                        onPageSize={setPageSize}
                        pageListSizes={pageListSizes}
                        totalCount={(() => {
                            return totalItems;
                        })()}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default UtilityMeters;
