import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Row, Col } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Brick from '../../../sharedComponents/brick';
import { pageListSizes } from '../../../helpers/helpers';
import Typography from '../../../sharedComponents/typography';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { ReactComponent as WifiSlashSVG } from '../../../sharedComponents/assets/icons/wifislash.svg';
import { ReactComponent as WifiSVG } from '../../../sharedComponents/assets/icons/wifi.svg';
import { userPermissionData } from '../../../store/globalState';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { StatusBadge } from '../../../sharedComponents/statusBadge';
import CreateUtilityMeters from './CreateUtilityMeters';
import { Link, useParams } from 'react-router-dom';
import { UtilityMetersStore } from '../../../store/UtilityMetersStore';

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
    const [userPermission] = useAtom(userPermissionData);
    const { bldgId } = useParams();
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [deviceStatus, setDeviceStatus] = useState(0);
    const [totalItems, setTotalItems] = useState(0);
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [isDataFetching, setIsDataFetching] = useState(false);
    const [renderList, setRenderList] = useState([]);
    const utilityMetersDataList = UtilityMetersStore.useState((s) => s.utilityMetersList);

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
        return (
            <Link
                className="typography-wrapper link"
                to={{
                    pathname: `/settings/utility-meters/single/${bldgId}/${row?.id}`,
                }}>
                <div size={Typography.Sizes.md} className="typography-wrapper link mouse-pointer">
                    {row?.device_id}
                </div>
            </Link>
        );
    };

    const renderModbus = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row?.modbus}</Typography.Body>;
    };

    const renderModel = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row?.model_name}</Typography.Body>;
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
        return renderList;
    };

    const updateUtilityMetersList = (value) => {
        UtilityMetersStore.update((s) => {
            s.utilityMetersList = value;
        });
    };

    useEffect(() => {
        if (utilityMetersDataList.length === 0) return;

        if (deviceStatus === 0) setRenderList([...utilityMetersDataList]);
        if (deviceStatus === 1) {
            let newArray = [];
            utilityMetersDataList.forEach((el) => (el?.status ? newArray.push(el) : null));
            setRenderList(newArray);
        }
        if (deviceStatus === 2) {
            let newArray = [];
            utilityMetersDataList.forEach((el) => (el?.status ? null : newArray.push(el)));
            setRenderList(newArray);
        }
    }, [deviceStatus, utilityMetersDataList]);

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
                            <Typography.Header size={Typography.Sizes.lg}>Utility Meters</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.advanced_passive_device_permission?.create ? (
                            <CreateUtilityMeters
                                bldgId={bldgId}
                                utilityMetersDataList={utilityMetersDataList}
                                updateUtilityMetersList={updateUtilityMetersList}
                            />
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
                            setDeviceStatus(query);
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
