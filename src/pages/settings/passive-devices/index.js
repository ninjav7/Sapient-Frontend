import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useAtom } from 'jotai';
import { useHistory, Link, useParams } from 'react-router-dom';
import { buildingData, userPermissionData } from '../../../store/globalState';
import Typography from '../../../sharedComponents/typography';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';
import CreatePassiveDevice from './CreatePassiveDevice';
import { pageListSizes } from '../../../helpers/helpers';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { FILTER_TYPES } from '../../../sharedComponents/dataTableWidget/constants';
import { StatusBadge } from '../../../sharedComponents/statusBadge';
import { ReactComponent as WifiSlashSVG } from '../../../sharedComponents/assets/icons/wifislash.svg';
import { ReactComponent as WifiSVG } from '../../../sharedComponents/assets/icons/wifi.svg';
import { Badge } from '../../../sharedComponents/badge';
import { getPassiveDeviceData, fetchPassiveFilter, getSinglePassiveDevice } from './services';
import DeletePassiveAlert from './DeletePassiveAlert';
import EditPassiveDevice from './EditPassiveDevice';
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

            <th>
                <Skeleton count={10} />
            </th>
        </tr>
    </SkeletonTheme>
);

const PassiveDevices = () => {
    const history = useHistory();
    const { bldgId } = useParams();
    const bldgName = BuildingStore.useState((s) => s.BldgName);
    const [buildingListData] = useAtom(buildingData);
    const [userPermission] = useAtom(userPermissionData);

    const { download } = useCSVDownload();
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [deviceStatus, setDeviceStatus] = useState(0);
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);

    // Add Device Modal states
    const [isAddDeviceModalOpen, setAddDeviceDeviceModal] = useState(false);
    const closeAddDeviceModal = () => setAddDeviceDeviceModal(false);
    const openAddDeviceModal = () => setAddDeviceDeviceModal(true);

    // Edit Device Modal states
    const [isEditDeviceModalOpen, setEditDeviceDeviceModal] = useState(false);
    const closeEditDeviceModal = () => setEditDeviceDeviceModal(false);
    const openEditDeviceModal = () => setEditDeviceDeviceModal(true);

    // Delete Device Modal states
    const [isDeleteDeviceModalOpen, setDeleteDeviceDeviceModal] = useState(false);
    const closeDeleteDeviceModal = () => setDeleteDeviceDeviceModal(false);
    const openDeleteDeviceModal = () => setDeleteDeviceDeviceModal(true);

    const [selectedPassiveDevice, setSelectedPassiveDevice] = useState({});
    const [isDataFetching, setIsDataFetching] = useState(false);
    const [passiveDeviceData, setPassiveDeviceData] = useState([]);
    const [deviceIdFilterString, setDeviceIdFilterString] = useState([]);
    const [deviceModelString, setDeviceModelString] = useState([]);
    const [sensorString, setSensorString] = useState([]);
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
            sensorSelected
        )
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

    useEffect(() => {
        if (bldgId && buildingListData.length !== 0) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id) {
                BuildingStore.update((s) => {
                    s.BldgId = bldgObj?.building_id;
                    s.BldgName = bldgObj?.building_name;
                    s.BldgTimeZone = bldgObj?.timezone ? bldgObj?.timezone : 'US/Eastern';
                });
            }
        }
    }, [buildingListData, bldgId]);

    useEffect(() => {
        fetchPassiveDeviceData();
    }, [search, sortBy, pageNo, pageSize, deviceStatus, bldgId, deviceIdFilterString, deviceModelString, sensorString]);

    const getFilters = async () => {
        let macAddressSelected = encodeURIComponent(deviceIdFilterString.join('+'));
        let deviceModelSelected = encodeURIComponent(deviceModelString.join('+'));
        const filters = await fetchPassiveFilter({
            bldgId,
            macAddressSelected,
            deviceModelSelected,
        });
        filters.data.forEach((filterOptions) => {
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
            ];

            setFilterOptions(filterOptionsFetched);
        });
    };

    useEffect(() => {
        getFilters();
    }, [bldgId]);

    const currentRow = () => {
        return passiveDeviceData;
    };

    const handleClick = (el) => {
        history.push({
            pathname: `/settings/smart-meters/single/${bldgId}/${el.equipments_id}`,
        });
    };

    const handleDeviceEdit = (record) => {
        handleClick(record);
    };

    const handleDeviceDelete = (record) => {
        setSelectedPassiveDevice(record);
        openDeleteDeviceModal();
    };

    const handleAbleToDeleteRow = (row) => {
        return true;
    };

    const handleDownloadCsv = async () => {
        let params = `?building_id=${bldgId}`;
        await getSinglePassiveDevice(params)
            .then((res) => {
                const responseData = res?.data?.data;
                let csvData = getPassiveDeviceTableCSVExport(responseData, headerProps);
                download(`${bldgName}_Smart Meter_${new Date().toISOString().split('T')[0]}`, csvData);
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
                    pathname: `/settings/smart-meters/single/${bldgId}/${row.equipments_id}`,
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
        window.scrollTo(0, 0);
    }, [pageNo, pageSize]);

    useEffect(() => {
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
                        isLoading={isDataFetching}
                        isLoadingComponent={<SkeletonLoading />}
                        id="smart_meter_list"
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
                        onEditRow={
                            userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.account_buildings_permission?.edit
                                ? (record, id, row) => handleDeviceEdit(row)
                                : null
                        }
                        isDeletable={(row) => handleAbleToDeleteRow(row)}
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
