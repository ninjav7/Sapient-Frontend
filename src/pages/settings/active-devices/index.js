import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { getActiveDeviceData } from './services';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { BuildingStore } from '../../../store/BuildingStore';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import { ComponentStore } from '../../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import './style.css';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import Brick from '../../../sharedComponents/brick';
import Typography from '../../../sharedComponents/typography';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { StatusBadge } from '../../../sharedComponents/statusBadge';
import { ReactComponent as WifiSlashSVG } from '../../../sharedComponents/assets/icons/wifislash.svg';
import { ReactComponent as WifiSVG } from '../../../sharedComponents/assets/icons/wifi.svg';
import { Button } from '../../../sharedComponents/button';
import { Badge } from '../../../sharedComponents/badge';
import { pageListSizes } from '../../../helpers/helpers';
import { getActiveDeviceTableCSVExport } from '../../../utils/tablesExport';

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

const ActiveDevices = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    // Modal states
    const [show, setShow] = useState(false);
    const handleShow = () => setShow(true);

    const { download } = useCSVDownload();
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [activeDeviceData, setActiveDeviceData] = useState([]);
    const [totalItems, setTotalItems] = useState(0);
    const [onlineDeviceData, setOnlineDeviceData] = useState([]);
    const [offlineDeviceData, setOfflineDeviceData] = useState([]);
    const [isDeviceProcessing, setIsDeviceProcessing] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [userPermission] = useAtom(userPermissionData);

    useEffect(() => {
        const fetchActiveDeviceData = async () => {
            const ordered_by = sortBy.name === undefined ? 'identifier' : sortBy.name;
            const sort_by = sortBy.method === undefined ? 'ace' : sortBy.method;
            setIsDeviceProcessing(true);
            setOnlineDeviceData([]);
            setOfflineDeviceData([]);
            setActiveDeviceData([]);
            let params = `?page_size=${pageSize}&page_no=${pageNo}&building_id=${bldgId}&sort_by=${sort_by}&ordered_by=${ordered_by}&device_search=${search}`;
            await getActiveDeviceData(params)
                .then((res) => {
                    let response = res.data;
                    setActiveDeviceData(response.data);
                    const sampleData = response.data;
                    setTotalItems(response?.total_data);

                    let onlineData = [];
                    let offlineData = [];

                    response.data.forEach((record) => {
                        record.status ? onlineData.push(record) : offlineData.push(record);
                    });

                    setOnlineDeviceData(onlineData);
                    setOfflineDeviceData(offlineData);
                    setIsDeviceProcessing(false);
                })
                .catch(() => {
                    setIsDeviceProcessing(false);
                });
        };

        fetchActiveDeviceData();
    }, [search, sortBy, pageNo, pageSize, bldgId]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Active Devices',
                        path: '/settings/active-devices',
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

    const currentRow = () => {
        // if (selectedFilter === 0) {
        return activeDeviceData;
    };

    const handleDownloadCsv = async () => {
        let params = `?building_id=${bldgId}`;
        await getActiveDeviceData(params)
            .then((res) => {
                const responseData = res?.data?.data;
                let csvData = getActiveDeviceTableCSVExport(responseData, headerProps);
                download('Active_Device_List', csvData);
            })
            .catch(() => {});
    };

    const renderDeviceStatus = (row) => {
        return (
            <StatusBadge
                text={row?.status ? 'Online' : 'Office'}
                type={row?.status ? StatusBadge.Type.success : StatusBadge.Type.error}
                icon={row?.status ? <WifiSVG /> : <WifiSlashSVG />}
            />
        );
    };

    const renderIdentifierName = (row) => {
        return (
            <Link
                className="typography-wrapper link"
                to={{
                    pathname: `/settings/active-devices/single/${row.equipments_id}`,
                }}>
                <a>{row.identifier}</a>
            </Link>
        );
    };

    const renderModelType = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.model === '' ? '-' : row?.model.charAt(0).toUpperCase() + row.model.slice(1)}
            </Typography.Body>
        );
    };

    const renderDeviceLocation = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>{row?.location === '' ? '-' : row?.location}</Typography.Body>
        );
    };

    const renderDeviceSensors = (row) => {
        return (
            <Badge
                text={
                    <Typography.Body size={Typography.Sizes.md}>
                        {row?.sensor_number === '' ? '-' : row?.sensor_number}
                    </Typography.Body>
                }
            />
        );
    };

    const renderFirmwareVersion = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.firmware_version === '' ? '-' : row?.firmware_version}
            </Typography.Body>
        );
    };

    const renderHardwareVersion = (row) => {
        return (
            <Badge
                text={
                    <Typography.Body size={Typography.Sizes.md}>
                        {row?.hardware_version === '' ? '-' : row?.hardware_version}
                    </Typography.Body>
                }
            />
        );
    };

    const headerProps = [
        {
            name: 'Status',
            accessor: 'status',
            callbackValue: renderDeviceStatus,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Identifier (MAC)',
            accessor: 'identifier',
            callbackValue: renderIdentifierName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Model',
            accessor: 'model',
            callbackValue: renderModelType,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Location',
            accessor: 'location',
            callbackValue: renderDeviceLocation,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Sensors',
            accessor: 'sensor_count',
            callbackValue: renderDeviceSensors,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Firmware Version',
            accessor: 'firmware_version',
            callbackValue: renderFirmwareVersion,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Hardware Version',
            accessor: 'hardware_version',
            callbackValue: renderHardwareVersion,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    return (
        <React.Fragment>
            <Row className="page-title">
                <Col className="header-container">
                    <Typography.Header size={Typography.Sizes.lg}>Active Devices</Typography.Header>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        <div>
                            <Link
                                to={{
                                    pathname: `/settings/active-devices/provision`,
                                }}>
                                {userPermission?.user_role === 'admin' ||
                                userPermission?.permissions?.permissions?.advanced_active_device_permission?.create ? (
                                    <Button
                                        label={'Add Active Device'}
                                        size={Button.Sizes.md}
                                        type={Button.Type.primary}
                                        icon={<PlusSVG />}
                                    />
                                ) : null}
                            </Link>
                        </div>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={12}>
                    <DataTableWidget
                        isLoading={isDeviceProcessing}
                        isLoadingComponent={<SkeletonLoading />}
                        id="active_devices_list"
                        onSearch={(query) => {
                            setPageNo(1);
                            setSearch(query);
                        }}
                        rows={currentRow()}
                        searchResultRows={currentRow()}
                        onDownload={() => handleDownloadCsv()}
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

export default ActiveDevices;
