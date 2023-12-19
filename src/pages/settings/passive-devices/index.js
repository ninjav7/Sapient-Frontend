import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { useAtom } from 'jotai';
import { useHistory, Link, useParams } from 'react-router-dom';

import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { updateBuildingStore } from '../../../helpers/updateBuildingStore';

import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';
import Typography from '../../../sharedComponents/typography';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { FILTER_TYPES } from '../../../sharedComponents/dataTableWidget/constants';
import { StatusBadge } from '../../../sharedComponents/statusBadge';
import { pageListSizes } from '../../../helpers/helpers';
import { Badge } from '../../../sharedComponents/badge';

import DeletePassiveAlert from './DeletePassiveAlert';
import EditPassiveDevice from './EditPassiveDevice';
import CreatePassiveDevice from './CreatePassiveDevice';
import SkeletonLoader from '../../../components/SkeletonLoader';
import ViewSmartMeterRawData from './ViewSmartMeterRawData';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';

import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { ReactComponent as WifiSlashSVG } from '../../../sharedComponents/assets/icons/wifislash.svg';
import { ReactComponent as WifiSVG } from '../../../sharedComponents/assets/icons/wifi.svg';

import { buildingData, userPermissionData } from '../../../store/globalState';

import { getPassiveDeviceTableCSVExport } from '../../../utils/tablesExport';
import { getPassiveDeviceData, fetchPassiveFilter, getSinglePassiveDevice } from './services';

import './style.css';

const PassiveDevices = () => {
    const history = useHistory();
    const { bldgId } = useParams();
    const bldgName = BuildingStore.useState((s) => s.BldgName);
    const bldgTimezone = BuildingStore.useState((s) => s.BldgTimeZone);
    const [buildingListData] = useAtom(buildingData);
    const [userPermission] = useAtom(userPermissionData);

    const isUserAdmin = userPermission?.is_admin ?? false;
    const isSuperUser = userPermission?.is_superuser ?? false;
    const isSuperAdmin = isUserAdmin || isSuperUser;
    const canUserView = userPermission?.permissions?.permissions?.advanced_passive_device_permission?.view ?? false;
    const canUserCreate = userPermission?.permissions?.permissions?.advanced_passive_device_permission?.create ?? false;
    const canUserEdit = userPermission?.permissions?.permissions?.advanced_passive_device_permission?.edit ?? false;
    const canUserDelete = userPermission?.permissions?.permissions?.advanced_passive_device_permission?.delete ?? false;

    const { download } = useCSVDownload();
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [deviceStatus, setDeviceStatus] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    // Add Device Modal states
    const [isAddDeviceModalOpen, setAddDeviceDeviceModal] = useState(false);
    const closeAddDeviceModal = () => setAddDeviceDeviceModal(false);
    const openAddDeviceModal = () => setAddDeviceDeviceModal(true);

    // Edit Device Modal states
    const [isEditDeviceModalOpen, setEditDeviceDeviceModal] = useState(false);
    const closeEditDeviceModal = () => setEditDeviceDeviceModal(false);
    const openEditDeviceModal = () => setEditDeviceDeviceModal(true);

    // View Device Modal states
    const [isViewDeviceModalOpen, setViewDeviceDeviceModal] = useState(false);
    const closeViewDeviceModal = () => setViewDeviceDeviceModal(false);
    const openViewDeviceModal = () => setViewDeviceDeviceModal(true);

    // Delete Device Modal states
    const [isDeleteDeviceModalOpen, setDeleteDeviceDeviceModal] = useState(false);
    const closeDeleteDeviceModal = () => setDeleteDeviceDeviceModal(false);
    const openDeleteDeviceModal = () => setDeleteDeviceDeviceModal(true);

    const [selectedPassiveDevice, setSelectedPassiveDevice] = useState({});
    const [isDataFetching, setIsDataFetching] = useState(false);
    const [isFilterFetching, setFetchingFilters] = useState(false);
    const [passiveDeviceData, setPassiveDeviceData] = useState([]);
    const [deviceIdFilterString, setDeviceIdFilterString] = useState([]);
    const [deviceModelString, setDeviceModelString] = useState([]);
    const [sensorString, setSensorString] = useState([]);
    const [floorString, setFloorString] = useState([]);
    const [spaceString, setSpaceString] = useState([]);
    const [filterOptions, setFilterOptions] = useState([]);

    const fetchPassiveDeviceData = async () => {
        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name === 'status' ? 'stat' : sortBy.name,
                sort_by: sortBy.method,
            };
        let macAddressSelected = encodeURIComponent(deviceIdFilterString.join('+'));
        let deviceModelSelected = encodeURIComponent(deviceModelString.join('+'));
        let sensorSelected = encodeURIComponent(sensorString.join('+'));
        let floorSelected = encodeURIComponent(floorString.join('+'));
        let spaceSelected = encodeURIComponent(spaceString.join('+'));
        setIsDataFetching(true);
        setPassiveDeviceData([]);
        await getPassiveDeviceData(
            pageNo,
            pageSize,
            bldgId,
            search,
            deviceStatus,
            {
                ...sorting,
            },
            macAddressSelected,
            deviceModelSelected,
            sensorSelected,
            floorSelected,
            spaceSelected
        )
            .then((res) => {
                const response = res?.data;
                if (response?.data) {
                    for (const element of response?.data) {
                        element.bldg_id = bldgId;
                    }
                    setPassiveDeviceData(response?.data);
                }
                if (response?.total_data) setTotalItems(response?.total_data);
                setIsDataFetching(false);
            })
            .catch(() => {
                setIsDataFetching(false);
            });
    };

    const getFilters = async () => {
        setFetchingFilters(true);
        let macAddressSelected = encodeURIComponent(deviceIdFilterString.join('+'));
        let deviceModelSelected = encodeURIComponent(deviceModelString.join('+'));
        let floorSelected = encodeURIComponent(floorString.join('+'));
        let spaceSelected = encodeURIComponent(spaceString.join('+'));

        const filters = await fetchPassiveFilter({
            bldgId,
            macAddressSelected,
            deviceModelSelected,
            floorSelected,
            spaceSelected,
        });
        filters.data.forEach((filterOptions) => {
            const sortedFloors = filterOptions?.installed_floor
                .slice()
                .sort((a, b) => a.floor_name.localeCompare(b.floor_name));

            const sortedSpaces = filterOptions?.installed_space
                .slice()
                .sort((a, b) => a.space_name.localeCompare(b.space_name));

            const filterOptionsFetched = [
                {
                    label: 'Device ID',
                    value: 'identifier',
                    placeholder: 'All Device IDs',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.deviceIdentifier.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let macAddress = [];
                            for (let i = 0; i < opt.length; i++) {
                                macAddress.push(opt[i].value);
                            }
                            setDeviceIdFilterString(macAddress);
                        }
                    },
                    onDelete: () => {
                        setDeviceIdFilterString([]);
                    },
                },
                {
                    label: 'Model',
                    value: 'model',
                    placeholder: 'All Models',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.model.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let deviceModel = [];
                            for (let i = 0; i < opt.length; i++) {
                                deviceModel.push(opt[i].value);
                            }
                            setDeviceModelString(deviceModel);
                        }
                    },
                    onDelete: () => {
                        setDeviceModelString([]);
                    },
                },
                {
                    label: 'Sensors',
                    value: 'sensor_number',
                    placeholder: 'ALL Sensors',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.sensor_number.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let sensors = [];
                            for (let i = 0; i < opt.length; i++) {
                                sensors.push(opt[i].value);
                            }
                            setSensorString(sensors);
                        }
                    },
                    onDelete: () => {
                        setSensorString([]);
                    },
                },
                {
                    label: 'Floors',
                    value: 'floor',
                    placeholder: 'All Floors',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: sortedFloors.map((filterItem) => ({
                        value: filterItem.floor_id,
                        label: filterItem.floor_name,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let sensors = [];
                            for (let i = 0; i < opt.length; i++) {
                                sensors.push(opt[i].value);
                            }
                            setFloorString(sensors);
                        }
                    },
                    onDelete: () => {
                        setFloorString([]);
                    },
                },
                {
                    label: 'Spaces',
                    value: 'space',
                    placeholder: 'All Spaces',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: sortedSpaces.map((filterItem) => ({
                        value: filterItem.space_id,
                        label: filterItem.space_name,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let sensors = [];
                            for (let i = 0; i < opt.length; i++) {
                                sensors.push(opt[i].value);
                            }
                            setSpaceString(sensors);
                        }
                    },
                    onDelete: () => {
                        setSpaceString([]);
                    },
                },
            ];

            setFilterOptions(filterOptionsFetched);
        });
        setFetchingFilters(false);
    };

    const currentRow = () => {
        return passiveDeviceData;
    };

    const handleDeviceView = (record) => {
        setSelectedPassiveDevice(record);
        openViewDeviceModal();
    };

    const handleDeviceEdit = (record) => {
        history.push({
            pathname: `/settings/smart-meters/single/${bldgId}/${record?.equipments_id}`,
        });
    };

    const handleDeviceDelete = (record) => {
        setSelectedPassiveDevice(record);
        openDeleteDeviceModal();
    };

    const handleDownloadCsv = async () => {
        setDownloadingCSVData(true);
        const params = `?building_id=${bldgId}`;

        await getSinglePassiveDevice(params)
            .then((res) => {
                const responseData = res?.data?.data;
                let csvData = getPassiveDeviceTableCSVExport(responseData, headerProps);
                download(`${bldgName}_Smart Meter_${new Date().toISOString().split('T')[0]}`, csvData);
            })
            .catch(() => {})
            .finally(() => {
                setDownloadingCSVData(false);
            });
    };

    const renderDeviceStatus = (row) => {
        return (
            <StatusBadge
                text={row?.status ? 'Online' : 'Offine'}
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
                    pathname: `/settings/smart-meters/single/${row?.bldg_id}/${row.equipments_id}`,
                }}>
                <div size={Typography.Sizes.md} className="typography-wrapper link mouse-pointer">
                    {row?.identifier === '' ? '-' : row?.identifier}
                </div>
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

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Smart Meters',
                    path: '/settings/smart-meters',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'building-settings';
        });
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
        if (bldgId && buildingListData && buildingListData.length !== 0) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id)
                updateBuildingStore(
                    bldgObj?.building_id,
                    bldgObj?.building_name,
                    bldgObj?.timezone,
                    bldgObj?.plug_only
                );
        }
    }, [buildingListData, bldgId]);

    useEffect(() => {
        fetchPassiveDeviceData();
        getFilters();
    }, [
        search,
        sortBy,
        pageNo,
        pageSize,
        deviceStatus,
        bldgId,
        deviceIdFilterString,
        deviceModelString,
        sensorString,
        floorString,
        spaceString,
    ]);

    useEffect(() => {
        if (!isDeleteDeviceModalOpen && !isViewDeviceModalOpen) setSelectedPassiveDevice({});
    }, [isDeleteDeviceModalOpen, isViewDeviceModalOpen]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pageNo, pageSize]);

    useEffect(() => {
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
                        {isSuperAdmin || canUserCreate ? (
                            <div className="d-flex">
                                <Button
                                    label={'Add Smart Meter'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={openAddDeviceModal}
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
                        id="smart_meter_list"
                        isLoading={isDataFetching}
                        isFilterLoading={isFilterFetching}
                        isLoadingComponent={<SkeletonLoader noOfColumns={headerProps.length + 1} noOfRows={15} />}
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
                        filterOptions={filterOptions}
                        onDownload={() => handleDownloadCsv()}
                        isCSVDownloading={isCSVDownloading}
                        headers={headerProps}
                        currentPage={pageNo}
                        onChangePage={setPageNo}
                        pageSize={pageSize}
                        onPageSize={setPageSize}
                        pageListSizes={pageListSizes}
                        isViewable={() => isSuperAdmin || canUserView}
                        isEditable={() => isSuperAdmin || canUserEdit}
                        isDeletable={() => isSuperAdmin || canUserDelete}
                        onViewRow={isSuperAdmin || canUserView ? (record, id, row) => handleDeviceView(row) : null}
                        onEditRow={isSuperAdmin || canUserEdit ? (record, id, row) => handleDeviceEdit(row) : null}
                        onDeleteRow={
                            isSuperAdmin || canUserDelete ? (record, id, row) => handleDeviceDelete(row) : null
                        }
                        totalCount={(() => {
                            return totalItems;
                        })()}
                    />
                </Col>
            </Row>

            <CreatePassiveDevice
                isAddDeviceModalOpen={isAddDeviceModalOpen}
                closeAddDeviceModal={closeAddDeviceModal}
                fetchPassiveDeviceData={fetchPassiveDeviceData}
            />

            <EditPassiveDevice
                isEditDeviceModalOpen={isEditDeviceModalOpen}
                closeEditDeviceModal={closeEditDeviceModal}
                selectedPassiveDevice={selectedPassiveDevice}
                fetchPassiveDeviceData={fetchPassiveDeviceData}
            />

            <ViewSmartMeterRawData
                isModalOpen={isViewDeviceModalOpen}
                closeModal={closeViewDeviceModal}
                bldgTimezone={bldgTimezone}
                selectedPassiveDevice={selectedPassiveDevice}
            />

            <DeletePassiveAlert
                isDeleteDeviceModalOpen={isDeleteDeviceModalOpen}
                closeDeleteDeviceModal={closeDeleteDeviceModal}
                selectedPassiveDevice={selectedPassiveDevice}
                nextActionAfterDeletion={fetchPassiveDeviceData}
            />
        </React.Fragment>
    );
};

export default PassiveDevices;
