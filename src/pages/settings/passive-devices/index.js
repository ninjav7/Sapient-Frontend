import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useAtom } from 'jotai';
import { useHistory } from 'react-router-dom';
import { userPermissionData } from '../../../store/globalState';
import Typography from '../../../sharedComponents/typography';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';
import CreatePassiveDevice from './CreatePassiveDevice';
import { pageListSizes } from '../../../helpers/helpers';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { StatusBadge } from '../../../sharedComponents/statusBadge';
import { ReactComponent as WifiSlashSVG } from '../../../sharedComponents/assets/icons/wifislash.svg';
import { ReactComponent as WifiSVG } from '../../../sharedComponents/assets/icons/wifi.svg';
import { Badge } from '../../../sharedComponents/badge';
import { getPassiveDeviceData } from './services';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import { getPassiveDeviceTableCSVExport } from '../../../utils/tablesExport';
import 'react-loading-skeleton/dist/skeleton.css';
import './style.css';

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
        </tr>
    </SkeletonTheme>
);

const PassiveDevices = () => {
    const [userPermission] = useAtom(userPermissionData);
    const { download } = useCSVDownload();

    const history = useHistory();
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});

    const [deviceStatus, setDeviceStatus] = useState(0);

    // Add Device Modal states
    const [isAddDeviceModalOpen, setAddDeviceDeviceModal] = useState(false);
    const closeAddDeviceModal = () => setAddDeviceDeviceModal(false);
    const openAddDeviceModal = () => setAddDeviceDeviceModal(true);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [totalItems, setTotalItems] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState(0);

    const [isDataFetching, setIsDataFetching] = useState(false);
    const [passiveDeviceData, setPassiveDeviceData] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    const handleEditClose = () => setIsEdit(false);

    const [isDelete, setIsDelete] = useState(false);
    const handleDeleteClose = () => setIsDelete(false);

    const fetchDefaultPassiveDeviceData = async () => {
        setIsDataFetching(true);
        let params = `?building_id=${bldgId}&page_size=${pageSize}&page_no=${pageNo}`;
        await getPassiveDeviceData(params)
            .then((res) => {
                const responseData = res?.data;
                setPassiveDeviceData(responseData?.data);
                setTotalItems(responseData?.total_data);
                setIsDataFetching(false);
            })
            .catch(() => {
                setIsDataFetching(false);
            });
    };

    const fetchPassiveDeviceDataWithFilter = async (
        bldg_id,
        search_txt,
        page_no = 1,
        page_size = 20,
        ordered_by,
        sort_by,
        device_status
    ) => {
        setIsDataFetching(true);

        if (ordered_by === 'status') {
            ordered_by = 'stat';
        }
        if (ordered_by === 'sensor_number') {
            ordered_by = 'sensor_count';
        }

        let params = `?building_id=${bldg_id}&page_no=${page_no}&page_size=${page_size}&ordered_by=${ordered_by}`;

        if (search_txt) {
            params = params.concat(`&device_search=${encodeURIComponent(search_txt)}`);
        }
        if (sort_by) {
            params = params.concat(`&sort_by=${sort_by}`);
        }

        if (device_status !== 0) {
            params = params.concat(`&stat=${device_status === 1 ? 'true' : 'false'}`);
        }

        await getPassiveDeviceData(params)
            .then((res) => {
                const responseData = res?.data;
                setPassiveDeviceData(responseData?.data);
                setTotalItems(responseData?.total_data);
                setIsDataFetching(false);
            })
            .catch(() => {
                setIsDataFetching(false);
            });
    };

    const currentRow = () => {
        if (selectedFilter === 0) {
            return passiveDeviceData;
        }
    };

    const handleClick = (el) => {
        history.push({
            pathname: `/settings/passive-devices/single/${el.equipments_id}`,
        });
    };

    const handleDownloadCsv = async () => {
        let params = `?building_id=${bldgId}`;
        await getPassiveDeviceData(params)
            .then((res) => {
                const responseData = res?.data?.data;
                let csvData = getPassiveDeviceTableCSVExport(responseData, headerProps);
                download('Passive_Device_List', csvData);
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
            <div
                size={Typography.Sizes.md}
                className="typography-wrapper link mouse-pointer"
                onClick={() => {
                    handleClick(row);
                }}>
                {row?.identifier === '' ? '-' : row?.identifier}
            </div>
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
            accessor: 'sensor_number',
            callbackValue: renderDeviceSensors,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    useEffect(() => {
        const ordered_by = sortBy.name === undefined ? 'identifier' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'ace' : sortBy.method;
        fetchPassiveDeviceDataWithFilter(bldgId, search, pageNo, pageSize, ordered_by, sort_by, deviceStatus);
    }, [search, pageNo, pageSize, sortBy, deviceStatus, bldgId]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Passive Devices',
                        path: '/settings/passive-devices',
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
                            <Typography.Header size={Typography.Sizes.lg}>Passive Devices</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.advanced_passive_device_permission?.create ? (
                            <div className="d-flex">
                                <Button
                                    label={'Add Passive Device'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => {
                                        openAddDeviceModal();
                                    }}
                                    icon={<PlusSVG />}
                                />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={1.5} />

            <Row>
                <Col lg={12}>
                    <DataTableWidget
                        isLoading={isDataFetching}
                        isLoadingComponent={<SkeletonLoading />}
                        id="passive_devices_list"
                        onSearch={setSearch}
                        onStatus={setDeviceStatus}
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
                            if (selectedFilter === 0) {
                                return totalItems;
                            }
                            return 0;
                        })()}
                    />
                </Col>
            </Row>

            <CreatePassiveDevice
                isAddDeviceModalOpen={isAddDeviceModalOpen}
                closeAddDeviceModal={closeAddDeviceModal}
                fetchPassiveDeviceData={fetchDefaultPassiveDeviceData}
            />
        </React.Fragment>
    );
};

export default PassiveDevices;
