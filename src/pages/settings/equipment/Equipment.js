import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col } from 'reactstrap';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import moment from 'moment';
import Typography from '../../../sharedComponents/typography';
import { UncontrolledTooltip } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';
import { ComponentStore } from '../../../store/ComponentStore';
import Form from 'react-bootstrap/Form';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import Button from '../../../sharedComponents/button/Button';
import { getEquipmentTableCSVExport } from '../../../utils/tablesExport';

import 'react-datepicker/dist/react-datepicker.css';
import Select from '../../../sharedComponents/form/select';

import _ from 'lodash';

import { Badge } from '../../../sharedComponents/badge';
import { FILTER_TYPES } from '../../../sharedComponents/dataTableWidget/constants';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';

import { allEquipmentDataGlobal, equipmentDataGlobal } from '../../../store/globalState';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import EquipChartModal from '../../chartModal/EquipChartModal';
import './style.scss';
import {
    getEqupmentDataRequest,
    deleteEquipmentRequest,
    addNewEquipment,
    getFiltersForEquipmentRequest,
    getEndUseDataRequest,
    getLocationDataRequest,
    getMetadataRequest,
} from '../../../services/equipment';
import { primaryGray100 } from '../../../assets/scss/_colors.scss';
import Input from '../../../sharedComponents/form/input/Input';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import Brick from '../../../sharedComponents/brick';
import AddEquipment from './AddEquipment';
import { UserStore } from '../../../store/UserStore';
import { pageListSizes } from '../../../helpers/helpers';

const SkeletonLoading = () => (
    <SkeletonTheme color={primaryGray100} height={35}>
        <tr>
            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>
            <th>
                <Skeleton count={5} />
            </th>
            <th>
                <Skeleton count={5} />
            </th>
        </tr>
    </SkeletonTheme>
);

const Equipment = () => {
    const buildingName = localStorage.getItem('buildingName');
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const [isDelete, setIsDelete] = useState(false);
    const handleDeleteClose = () => setIsDelete(false);

    const [equipmentFilter, setEquipmentFilter] = useState({});
    const [selectedModalTab, setSelectedModalTab] = useState(1);

    const [showEquipmentChart, setShowEquipmentChart] = useState(false);
    const handleChartOpen = () => setShowEquipmentChart(true);
    const handleChartClose = () => setShowEquipmentChart(false);

    const [isProcessing, setIsProcessing] = useState(false);
    const [isEquipDataFetched, setIsEquipDataFetched] = useState(true);

    const [selectedTab, setSelectedTab] = useState(0);
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [generalEquipmentData, setGeneralEquipmentData] = useState([]);
    const [DuplicateGeneralEquipmentData, setDuplicateGeneralEquipmentData] = useState([]);
    const [onlineEquipData, setOnlineEquipData] = useState([]);
    const [offlineEquipData, setOfflineEquipData] = useState([]);
    const [equipmentTypeData, setEquipmentTypeData] = useState([]);

    const [createEquipmentData, setCreateEquipmentData] = useState({
        name: '',
        equipment_type: '',
        end_use: '',
        space_id: '',
    });

    const [locationData, setLocationData] = useState([]);
    const [endUseData, setEndUseData] = useState([]);
    const [preparedEndUseData, setPreparedEndUseData] = useState({});
    const [pageSize, setPageSize] = useState(20);
    const [pageNo, setPageNo] = useState(1);
    const [showDeleteEquipmentModal, setShowDeleteEquipmentModal] = useState(false);
    const [rowToDelete, setRowToDelete] = useState();
    const [isDeleting, setIsDeleting] = useState(false);
    const [allSearchData, setAllSearchData] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [sortBy, setSortBy] = useState({});

    const [search, setSearch] = useState('');

    const [equipmentTypeDataAll, setEquipmentTypeDataAll] = useState([]);
    const [endUseDataNow, setEndUseDataNow] = useState([]);
    const [locationDataNow, setLocationDataNow] = useState([]);
    const addEquimentType = () => {
        const preparedData = [];
        equipmentTypeData.map((item) => {
            preparedData.push({
                value: `${item?.equipment_id}`,
                label: `${item?.equipment_type} (${item?.end_use_name})`,
                end_use_id: `${item?.end_use_id}`,
            });
        });
        setEquipmentTypeDataAll(preparedData);
    };

    const addEndUseType = () => {
        endUseData.map((item) => {
            setEndUseDataNow((el) => [...el, { value: `${item?.end_use_id}`, label: `${item?.name}` }]);
        });
    };

    const addLocationType = () => {
        const preparedData = [];

        locationData.map((item) => {
            preparedData.push({ value: `${item?.location_id}`, label: `${item?.location_name}` });
        });
        setLocationDataNow(preparedData);
    };

    useEffect(() => {
        if (equipmentTypeData) {
            addEquimentType();
        }
    }, [equipmentTypeData]);

    useEffect(() => {
        if (endUseData) {
            addEndUseType();
        }
    }, [endUseData]);

    useEffect(() => {
        if (locationData) {
            setLocationDataNow([]);
            addLocationType();
        }
    }, [locationData]);

    const isLoadingRef = useRef(false);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createEquipmentData);
        if (key === 'equipment_type') {
            let endUseObj = equipmentTypeData.find((record) => record?.equipment_id === value);
            obj['end_use'] = endUseObj.end_use_id;
        }
        obj[key] = value;
        setCreateEquipmentData(obj);
    };

    const renderLocation = useCallback((row, childrenTemplate) => {
        const location = [row.installed_floor, row.installed_space];

        return childrenTemplate(location.join(' - '));
    }, []);
    const [totalItems, setTotalItems] = useState(0);
    const [totalItemsSearched, setTotalItemsSearched] = useState(0);
    const [filterOptions, setFilterOptions] = useState([]);
    const { download } = useCSVDownload();

    const [equipmentTypeFilterString, setEquipmentTypeFilterString] = useState('');
    const [endUseFilterString, setEndUseFilterString] = useState('');

    const [deviceIdFilterString, setDeviceIdFilterString] = useState('');
    const [deviceMacAddress, setDeviceMacAddress] = useState('');
    const [locationTypeFilterString, setLocationTypeFilterString] = useState('');
    const [isLoadingEndUseData, setIsLoadingEndUseData] = useState(true);

    const [floorTypeFilterString, setFloorTypeFilterString] = useState('');
    const [spaceFilterString, setSpaceFilterString] = useState('');
    const [spaceTypeFilterString, setSpaceTypeFilterString] = useState('');
    const [tagsFilterString, setTagsTypeFilterString] = useState('');

    const [equpimentDataNow, setEqupimentDataNow] = useAtom(equipmentDataGlobal);
    const [allEqupimentDataNow, setAllEqupimentDataNow] = useAtom(allEquipmentDataGlobal);

    const currentRow = () => {
        if (selectedTab === 0) {
            return generalEquipmentData;
        } else if (selectedTab === 1) {
            return onlineEquipData;
        } else if (selectedTab === 2) {
        }
        return offlineEquipData;
    };

    const renderSensors = useCallback((row) => {
        return (
            <div className="sensors-row-content">
                {row.sensor_number.length === 0 ? (
                    <Typography.Body>-</Typography.Body>
                ) : (
                    <>
                        {row.sensor_number.map((el) => {
                            return (
                                <Badge
                                    text={
                                        <span className="gray-950">
                                            {el}/{row.total_sensor}
                                        </span>
                                    }
                                />
                            );
                        })}
                    </>
                )}
            </div>
        );
    });

    const renderTags = useCallback((row) => {
        const slicedArr = row.tags.slice(1);
        return (
            <div className="tags-row-content">
                <Badge text={<span className="gray-950">{row.tags[0] ? row.tags[0] : 'none'}</span>} />
                {slicedArr?.length > 0 ? (
                    <>
                        <Badge
                            text={
                                <span className="gray-950" id={`tags-badge-${row.equipments_id}`}>
                                    +{slicedArr.length} more
                                </span>
                            }
                        />
                        <UncontrolledTooltip
                            placement="top"
                            target={`tags-badge-${row.equipments_id}`}
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

    const fetchEquipmentData = async () => {
        isLoadingRef.current = true;
        setIsEquipDataFetched(true);
        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name,
                sort_by: sortBy.method,
            };
        await getEqupmentDataRequest(
            pageSize,
            pageNo,
            bldgId,
            search,
            equipmentTypeFilterString,
            endUseFilterString,
            deviceIdFilterString,
            locationTypeFilterString,
            floorTypeFilterString,
            spaceFilterString,
            spaceTypeFilterString,
            tagsFilterString,
            {
                ...sorting,
            },
            true
        )
            .then((res) => {
                let responseData = res.data;
                setTotalItems(responseData.total_data);

                setGeneralEquipmentData(responseData.data);
                setDuplicateGeneralEquipmentData(responseData.data);
                let onlineEquip = [];
                let offlineEquip = [];
                responseData.data.forEach((record) => {
                    if (record.status) {
                        onlineEquip.push(record);
                    }
                    if (!record.status) {
                        offlineEquip.push(record);
                    }
                });
                setOnlineEquipData(onlineEquip);
                setOfflineEquipData(offlineEquip);
                setIsEquipDataFetched(false);
                isLoadingRef.current = false;
            })
            .catch((error) => {
                setIsEquipDataFetched(false);
                isLoadingRef.current = false;
                handleChartClose();
            });
    };

    const addEquimentData = () => {
        generalEquipmentData.map((item) => {
            if (item?.device_type === 'active') {
                setEqupimentDataNow((el) => [...el, item?.equipments_id]);
            }
            setAllEqupimentDataNow((el) => [...el, item?.equipments_id]);
        });
    };

    useEffect(() => {
        addEquimentData();
        addEquimentType();
    }, [generalEquipmentData]);

    useEffect(() => {
        fetchMetadata();
        fetchLocationData();
    }, [bldgId, pageSize]);

    const fetchMetadata = async () => {
        setIsLoadingEndUseData(true);
        await getMetadataRequest(bldgId)
            .then((res) => {
                const { end_uses, equipment_type } = res.data;
                const prepareEndUseType = end_uses.reduce((acc, el) => {
                    acc[`${el.end_use_id}`] = el.name;
                    return acc;
                }, {});
                setEquipmentTypeData(equipment_type);
                setEndUseData(end_uses);
                setPreparedEndUseData(prepareEndUseType);
            })
            .finally(() => {
                setIsLoadingEndUseData(false);
            });
    };

    const fetchLocationData = async () => {
        await getLocationDataRequest(bldgId)
            .then((res) => {
                setLocationData(res);
            })
            .catch((error) => {});
    };

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Equipment',
                        path: '/settings/equipment',
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

    const [userPermission] = useAtom(userPermissionData);

    const filterHandler = (setter, options) => {
        setter(options.map(({ value }) => value));
        setPageNo(1);
    };

    const filterLabelHandler = (setter, options) => {
        setter(options.map(({ label }) => label));
        setPageNo(1);
    };

    const renderEndUseCategory = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row.end_use_name !== '' ? row.end_use_name : '-'}
            </Typography.Body>
        );
    };

    const handleOpenEditEquipment = (row) => {
        setEquipmentFilter({
            equipment_id: row?.equipments_id,
            equipment_name: row?.equipments_name,
        });
        handleChartOpen();
    };
    const renderEquipmentsName = (row) => {
        return (
            <Typography.Link
                size={Typography.Sizes.md}
                className="mouse-pointer"
                onClick={() => handleOpenEditEquipment(row)}>
                {row.equipments_name !== '' ? row.equipments_name : '-'}
            </Typography.Link>
        );
    };

    const getFilters = async () => {
        const filters = await getFiltersForEquipmentRequest({
            bldgId,
            deviceMacAddress,
            equipmentTypeFilterString,
            endUseFilterString,
            floorTypeFilterString,
            spaceTypeFilterString,
            spaceTypeFilterString,
            tagsFilterString,
        });

        filters.data.forEach((filterOptions) => {
            const filterOptionsFetched = [
                {
                    label: 'Equipment Type',
                    value: 'equipmentType',
                    placeholder: 'All Equipment Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.equipment_type.map((filterItem) => ({
                        value: filterItem.equipment_type_id,
                        label: filterItem.equipment_type_name,
                    })),
                    onClose: (options) => filterHandler(setEquipmentTypeFilterString, options),
                    onDelete: () => {
                        setSelectedOption([]);
                        setEquipmentTypeFilterString('');
                    },
                },
                {
                    label: 'End use Category',
                    value: 'end_use',
                    placeholder: 'All End use',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.end_use.map((filterItem) => ({
                        value: filterItem.end_use_id,
                        label: filterItem.end_use_name,
                    })),
                    onClose: (options) => filterHandler(setEndUseFilterString, options),
                    onDelete: () => {
                        setSelectedOption([]);
                        setEndUseFilterString('');
                    },
                },
                {
                    label: 'Device ID',
                    value: 'mac_address',
                    placeholder: 'Select device ID',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.mac_address.map((filterItem) => ({
                        value: filterItem.device_id,
                        label: filterItem.device_mac_address,
                    })),
                    onClose: (options) => {
                        filterHandler(setDeviceIdFilterString, options);
                        filterLabelHandler(setDeviceMacAddress, options);
                    },
                    onDelete: () => {
                        setSelectedOption([]);
                        setDeviceIdFilterString('');
                        setDeviceMacAddress('');
                    },
                },
                {
                    label: 'Tag',
                    value: 'tag',
                    placeholder: 'All tags',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.tags.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => filterHandler(setTagsTypeFilterString, options),
                    onDelete: () => setTagsTypeFilterString(''),
                },
            ];

            setFilterOptions(filterOptionsFetched);
        });
    };

    useEffect(() => {
        getFilters();
        fetchEquipmentData();
    }, [
        search,
        bldgId,
        pageSize,
        pageNo,
        sortBy,
        deviceMacAddress,
        deviceIdFilterString,
        equipmentTypeFilterString,
        endUseFilterString,
        locationTypeFilterString,
        floorTypeFilterString,
        spaceFilterString,
        spaceTypeFilterString,
        tagsFilterString,
    ]);

    const renderLastUsedCell = (row, childrenTemplate) => {
        const { last_used_data } = row;

        return childrenTemplate(last_used_data ? moment(last_used_data).fromNow() : '');
    };
    const deleteEquipmentFunc = async (row) => {
        setIsDeleting(true);
        await deleteEquipmentRequest(bldgId, row.equipments_id)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message;
                        s.notificationType = 'success';
                    });
                    fetchEquipmentData();
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message ? response?.message : 'Unable to delete Equipment.';
                        s.notificationType = 'error';
                    });
                }
                setIsDeleting(false);
                setShowDeleteEquipmentModal(false);
            })
            .catch((error) => {
                alert(error);
                setShowDeleteEquipmentModal(false);
                setIsDeleting(false);
            });
    };

    const headerProps = [
        {
            name: 'Name',
            accessor: 'equipments_name',
            callbackValue: renderEquipmentsName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Equipment Type',
            accessor: 'equipments_type',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'End Use Category',
            accessor: 'end_use_name',
            callbackValue: renderEndUseCategory,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Location',
            accessor: 'location',
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Tags',
            accessor: 'tags',
            callbackValue: renderTags,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Sensors',
            accessor: 'sensor_number',
            callbackValue: renderSensors,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Device ID',
            accessor: 'device_mac',
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    const handleDownloadCsv = async () => {
        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name,
                sort_by: sortBy.method,
            };
        await getEqupmentDataRequest(
            pageSize,
            pageNo,
            bldgId,
            search,
            equipmentTypeFilterString,
            deviceIdFilterString,
            locationTypeFilterString,
            floorTypeFilterString,
            spaceFilterString,
            spaceTypeFilterString,
            tagsFilterString,
            {
                ...sorting,
            },
            false
        )
            .then((res) => {
                let response = res.data;
                download(buildingName, getEquipmentTableCSVExport(response.data, headerProps, preparedEndUseData));
                setIsEquipDataFetched(false);
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };
    const handleDeleteRowClicked = (row) => {
        setShowDeleteEquipmentModal(true);
        setRowToDelete(row);
    };

    const handleAbleToDeleteRow = (row) => {
        return row.device_type !== 'active';
    };

    return (
        <div>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>Equipment</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.building_equipment_permission?.create ? (
                            <div className="d-flex">
                                <Button
                                    label={'Add Equipment'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => {
                                        handleShow();
                                        setCreateEquipmentData({
                                            name: '',
                                            equipment_type: '',
                                            end_use: '',
                                            space_id: '',
                                        });
                                    }}
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
                        isLoading={isEquipDataFetched || isLoadingEndUseData}
                        isLoadingComponent={<SkeletonLoading />}
                        id="equipment"
                        onSearch={(query) => {
                            setPageNo(1);
                            setSearch(query);
                        }}
                        rows={currentRow()}
                        isDeletable={(row) => handleAbleToDeleteRow(row)}
                        searchResultRows={generalEquipmentData}
                        filterOptions={filterOptions}
                        onDeleteRow={
                            userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.account_buildings_permission?.edit
                                ? (event, id, row) => handleDeleteRowClicked(row)
                                : null
                        }
                        onEditRow={
                            userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.account_buildings_permission?.edit
                                ? (record, id, row) => handleOpenEditEquipment(row)
                                : null
                        }
                        onDownload={() => handleDownloadCsv()}
                        headers={headerProps}
                        buttonGroupFilterOptions={[]}
                        onPageSize={setPageSize}
                        onChangePage={setPageNo}
                        pageSize={pageSize}
                        currentPage={pageNo}
                        pageListSizes={pageListSizes}
                        totalCount={(() => {
                            if (search) {
                                return totalItemsSearched;
                            }
                            if (selectedTab === 0) {
                                return totalItems;
                            }

                            return 0;
                        })()}
                    />
                </Col>
            </Row>
            <Modal
                show={showDeleteEquipmentModal}
                onHide={() => setShowDeleteEquipmentModal(false)}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Body>
                    <div className="mb-4">
                        <h5 className="unlink-heading-style ml-2 mb-0">Delete Equipment</h5>
                    </div>
                    <div className="m-2">
                        <div className="unlink-alert-styling mb-1">Are you sure you want to delete the Equipment?</div>
                    </div>
                    <div className="panel-edit-model-row-style ml-2 mr-2"></div>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={() => setShowDeleteEquipmentModal(false)}
                    />

                    <Button
                        label={isDeleting ? 'Deleting' : 'Delete'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primaryDistructive}
                        onClick={() => {
                            deleteEquipmentFunc(rowToDelete);
                        }}
                    />
                </Modal.Footer>
            </Modal>

            <EquipChartModal
                showEquipmentChart={showEquipmentChart}
                handleChartClose={handleChartClose}
                equipmentFilter={equipmentFilter}
                fetchEquipmentData={fetchEquipmentData}
                selectedTab={selectedModalTab}
                setSelectedTab={setSelectedModalTab}
                activePage="equipment"
            />

            <AddEquipment
                isAddEquipModalOpen={show}
                closeModal={handleClose}
                equipmentTypeDataAll={equipmentTypeDataAll}
                endUseDataNow={endUseDataNow}
                locationDataNow={locationDataNow}
                isProcessing={isProcessing}
                setIsProcessing={setIsProcessing}
                fetchEquipmentData={fetchEquipmentData}
                bldgId={bldgId}
            />
        </div>
    );
};

export default Equipment;
