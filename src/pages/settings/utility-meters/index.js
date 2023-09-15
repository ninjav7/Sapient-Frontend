import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Row, Col } from 'reactstrap';
import { Link, useParams } from 'react-router-dom';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Brick from '../../../sharedComponents/brick';
import { UserStore } from '../../../store/UserStore';
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
import { deleteUtilityMeterData, getAllUtilityMetersServices } from './services';
import colorPalette from '../../../assets/scss/_colors.scss';
import { convertToMac } from './utils';
import DeleteModal from './AlertModals';

const SkeletonLoading = ({ noofRows }) => {
    const rowArray = Array.from({ length: noofRows });

    return (
        <SkeletonTheme
            baseColor={colorPalette.primaryGray150}
            highlightColor={colorPalette.baseBackground}
            borderRadius={10}
            height={30}>
            <tr>
                {rowArray.map((_, index) => (
                    <th key={index}>
                        <Skeleton count={15} />
                    </th>
                ))}
            </tr>
        </SkeletonTheme>
    );
};

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
    const [utilityMetersData, setUtilityMetersData] = useState([]);

    // For Delete Utility Monitor
    const [deleteId, setDeleteId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDeleteModal, setShowDelete] = useState(false);
    const closeDeleteAlert = () => setShowDelete(false);
    const showDeleteAlert = () => setShowDelete(true);

    const fetchUtilityMetersWithFilter = async () => {
        setUtilityMetersData([]);
        setIsDataFetching(true);

        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name,
                sort_by: sortBy.method,
            };

        await getAllUtilityMetersServices(bldgId, search, pageNo, pageSize, deviceStatus, {
            ...sorting,
        })
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    setUtilityMetersData(response?.data);
                    if (response?.data) {
                        for (const element of response?.data) {
                            element.bldg_id = bldgId;
                        }
                        setUtilityMetersData(response?.data);
                    }
                    setTotalItems(response?.total_data);
                }
                setIsDataFetching(false);
            })
            .catch(() => {
                setIsDataFetching(false);
            });
    };

    const deleteUtilityMeter = async () => {
        if (!deleteId) return;

        setIsDeleting(true);
        const params = `?device_id=${deleteId}`;

        await deleteUtilityMeterData(params)
            .then((res) => {
                const response = res?.data;
                setIsDeleting(false);
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message;
                        s.notificationType = 'success';
                    });
                    fetchUtilityMetersWithFilter();
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message
                            ? response?.message
                            : res
                            ? 'Unable to delete Utility Monitor.'
                            : 'Unable to delete Utility Monitor due to Internal Server Error!.';
                        s.notificationType = 'error';
                    });
                }
                closeDeleteAlert();
                setDeleteId(null);
            })
            .catch(() => {
                closeDeleteAlert();
                setDeleteId(null);
                setIsDeleting(false);
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to delete Utility Monitor.';
                    s.notificationType = 'error';
                });
            });
    };

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
                    pathname: `/settings/utility-monitors/single/${row?.bldg_id}/${row?.id}`,
                }}>
                <div size={Typography.Sizes.md} className="typography-wrapper link mouse-pointer">
                    {row?.mac_address ? convertToMac(row?.mac_address) : ''}
                </div>
            </Link>
        );
    };

    const renderModbus = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row?.modbus_address}</Typography.Body>;
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
            accessor: 'mac_address',
            callbackValue: renderDeviceId,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Modbus',
            accessor: 'modbus_address',
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

    const handleDeviceDelete = (record) => {
        setDeleteId(record?.id);
        showDeleteAlert();
    };

    const handleAbleToDeleteRow = (row) => {
        return true;
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Utility Monitors',
                    path: '/settings/utility-monitors',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'building-settings';
        });
    };

    useEffect(() => {
        fetchUtilityMetersWithFilter();
    }, [bldgId, search, pageNo, pageSize, sortBy, deviceStatus]);

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>Utility Monitors</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.advanced_passive_device_permission?.create ? (
                            <CreateUtilityMeters bldgId={bldgId} />
                        ) : null}
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={1.5} />

            <Row>
                <Col lg={12}>
                    <DataTableWidget
                        id="utility_meters_list"
                        isLoading={isDataFetching}
                        isLoadingComponent={<SkeletonLoading noofRows={headerProps.length + 1} />}
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
                        onDeleteRow={
                            userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.account_buildings_permission?.edit
                                ? (record, id, row) => handleDeviceDelete(row)
                                : null
                        }
                        isDeletable={(row) => handleAbleToDeleteRow(row)}
                        totalCount={(() => {
                            return totalItems;
                        })()}
                    />
                </Col>
            </Row>

            <DeleteModal
                showModal={showDeleteModal}
                closeModal={closeDeleteAlert}
                onDeleteClick={deleteUtilityMeter}
                onDeleting={isDeleting}
            />
        </React.Fragment>
    );
};

export default UtilityMeters;
