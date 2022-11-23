import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Row, Col } from 'reactstrap';
import axios from 'axios';
import { BaseUrl, generalEquipments, getLocation, equipmentType, getEndUseId } from '../../services/Network';

import { ReactComponent as WifiSVG } from '../../sharedComponents/assets/icons/wifi.svg';
import { ReactComponent as WifiSlashSVG } from '../../sharedComponents/assets/icons/wifislash.svg';

import moment from 'moment';
import Modal from 'react-bootstrap/Modal';
import { ComponentStore } from '../../store/ComponentStore';
import Form from 'react-bootstrap/Form';
import { BuildingStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import Button from '../../sharedComponents/button/Button';
import { getTableCSVExport } from '../../sharedComponents/helpers/tablesExport';

import 'react-datepicker/dist/react-datepicker.css';
import Select from '../../sharedComponents/form/select';

import _ from 'lodash';

import { Badge } from '../../sharedComponents/badge';
import { FILTER_TYPES } from '../../sharedComponents/dataTableWidget/constants';
import { Cookies } from 'react-cookie';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { DataTableWidget } from '../../sharedComponents/dataTableWidget';

import { allEquipmentDataGlobal, equipmentDataGlobal } from '../../store/globalState';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../store/globalState';
import EquipChartModal from '../../pages/chartModal/EquipChartModal';
import { timeZone } from '../../utils/helper';
import './style.css';
import {
    getEqupmentDataRequest,
    deleteEquipmentRequest,
    addNewEquipment,
    getFiltersForEquipmentRequest,
    getEndUseDataRequest,
    getLocationDataRequest,
} from '../../services/equipment';

const SkeletonLoading = () => (
    <SkeletonTheme color="#202020" height={35}>
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

    const [createEqipmentData, setCreateEqipmentData] = useState({
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

    const [allSearchData, setAllSearchData] = useState([]);
    const [selectedOption, setSelectedOption] = useState([]);
    const [sortBy, setSortBy] = useState({});

    const [search, setSearch] = useState('');

    const [equipmentTypeDataNow, setEquipmentTypeDataNow] = useState([]);
    const [endUseDataNow, setEndUseDataNow] = useState([]);
    const [locationDataNow, setLocationDataNow] = useState([]);

    const addEquimentType = () => {
        equipmentTypeData.map((item) => {
            setEquipmentTypeDataNow((el) => [
                ...el,
                { value: `${item?.equipment_id}`, label: `${item?.equipment_type}` },
            ]);
        });
    };

    const addEndUseType = () => {
        endUseData.map((item) => {
            setEndUseDataNow((el) => [...el, { value: `${item?.end_user_id}`, label: `${item?.name}` }]);
        });
    };

    const addLocationType = () => {
        locationData.map((item) => {
            setLocationDataNow((el) => [...el, { value: `${item?.location_id}`, label: `${item?.location_name}` }]);
        });
    };

    useEffect(() => {
        if (equipmentTypeData) {
            setEquipmentTypeDataNow([]);
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

    const handleSearch = async () => {
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
            macTypeFilterString,
            locationTypeFilterString,
            floorTypeFilterString,
            spaceFilterString,
            spaceTypeFilterString,
            {
                ...sorting,
            },
            true
        )
            .then((res) => {
                let response = res.data;
                setGeneralEquipmentData(response.data);
                setIsEquipDataFetched(false);
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };

    useEffect(() => {
        handleSearch();
    }, [search]);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, createEqipmentData);
        if (key === 'equipment_type') {
            let endUseObj = equipmentTypeData.find((record) => record?.equipment_id === value);
            obj['end_use'] = endUseObj.end_use_id;
        }
        obj[key] = value;
        setCreateEqipmentData(obj);
    };

    const saveDeviceData = async () => {
        setIsProcessing(true);
        await addNewEquipment(bldgId, createEqipmentData)
            .then((res) => {
                fetchEquipmentData();
                handleClose();
                setIsProcessing(false);
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };

    const [selectedIds, setSelectedIds] = useState([]);

    const renderLocation = useCallback((row, childrenTemplate) => {
        const location = [row.installed_floor, row.installed_space];

        return childrenTemplate(location.join(' - '));
    }, []);
    const [totalItems, setTotalItems] = useState(0);
    const [totalItemsSearched, setTotalItemsSearched] = useState(0);
    const [filterOptions, setFilterOptions] = useState([]);

    const [equipmentTypeFilterString, setEquipmentTypeFilterString] = useState('');

    const [macTypeFilterString, setMacTypeFilterString] = useState('');

    const [locationTypeFilterString, setLocationTypeFilterString] = useState('');
    const [selectedOptionMac, setSelectedOptionMac] = useState([]);
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
            </div>
        );
    });
    const renderTags = useCallback((row) => {
        return (
            <div className="sensors-row-content">
                {row.tags.map((el) => {
                    return <Badge text={<span className="gray-950">{el}</span>} />;
                })}
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
            macTypeFilterString,
            locationTypeFilterString,
            floorTypeFilterString,
            spaceFilterString,
            spaceTypeFilterString,
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
    }, [generalEquipmentData]);

    useEffect(() => {
        fetchEndUseData();
        fetchLocationData();
    }, [bldgId, pageSize]);

    const fetchEndUseData = async () => {
        setIsLoadingEndUseData(true);
        await getEndUseDataRequest()
            .then((res) => {
                const prepareEndUseType = res.reduce((acc, el) => {
                    acc[`${el.end_user_id}`] = el.name;
                    return acc;
                }, {});
                setEndUseData(res);
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

    const [processdelete, setProcessdelete] = useState(false);

    const filterHandler = (setter, options) => {
        setter(options.map(({ value }) => value));
        setPageNo(1);
    };

    const renderEndUseCategory = (row) => {
        return <div>{preparedEndUseData[row.end_use_id]}</div>;
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
            <div onClick={() => handleOpenEditEquipment(row)} className="equipment-name-cell">
                {row.equipments_name}
            </div>
        );
    };

    const getFilters = async () => {
        const filters = await getFiltersForEquipmentRequest({
            bldgId,
            macTypeFilterString,
            equipmentTypeFilterString,
            floorTypeFilterString,
            spaceTypeFilterString,
            spaceTypeFilterString,
        });

        filters.data.forEach((filterOptions) => {
            const filterOptionsFetched = [
                {
                    label: 'MAC Address',
                    value: 'macAddresses',
                    placeholder: 'All Mac addresses',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.mac_address.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => filterHandler(setMacTypeFilterString, options),
                    onDelete: () => {
                        setSelectedOptionMac([]);
                        setMacTypeFilterString('');
                    },
                },
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
                    label: 'Floor',
                    value: 'floor',
                    placeholder: 'All Floors',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.installed_floor.map((filterItem) => ({
                        value: filterItem.floor_id,
                        label: filterItem.floor_name,
                    })),
                    onClose: (options) => filterHandler(setFloorTypeFilterString, options),
                    onDelete: () => setFloorTypeFilterString(''),
                },
                {
                    label: 'Space',
                    value: 'space',
                    placeholder: 'All Spaces',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.installed_space.map((filterItem) => ({
                        value: filterItem.space_id,
                        label: filterItem.space_name,
                    })),
                    onClose: (options) => filterHandler(setSpaceFilterString, options),
                    onDelete: () => setSpaceFilterString(''),
                },
                {
                    label: 'Space Type',
                    value: 'spaceType',
                    placeholder: 'All Space Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.installed_space_type.map((filterItem) => ({
                        value: filterItem.space_type_id,
                        label: filterItem.space_type_name,
                    })),
                    onClose: (options) => filterHandler(setSpaceTypeFilterString, options),
                    onDelete: () => setSpaceTypeFilterString(''),
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
        macTypeFilterString,
        equipmentTypeFilterString,
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
    const deleteEquipmentFunc = async (event, equipmentIdData, row) => {
        setProcessdelete(true);
        await deleteEquipmentRequest(bldgId, row.equipments_id)
            .then((res) => {
                setProcessdelete(false);
                fetchEquipmentData();
                setIsDelete(false);
            })
            .catch((error) => {
                setIsProcessing(false);
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
        },
        {
            name: 'End Use Category',
            accessor: 'end_use_id',
            callbackValue: renderEndUseCategory,
        },
        {
            name: 'Location',
            accessor: 'location',
        },
        {
            name: 'Tags',
            accessor: 'tags',
            callbackValue: renderTags,
        },
        {
            name: 'Sensors',
            accessor: 'sensor_number',
            callbackValue: renderSensors,
        },
        {
            name: 'Device ID',
            accessor: 'device_mac',
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
            macTypeFilterString,
            locationTypeFilterString,
            floorTypeFilterString,
            spaceFilterString,
            spaceTypeFilterString,
            {
                ...sorting,
            },
            false
        )
            .then((res) => {
                let response = res.data;
                getTableCSVExport(buildingName, response.data, headerProps, preparedEndUseData);

                setIsEquipDataFetched(false);
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };

    return (
        <React.Fragment>
            <Row className="page-title equipment-page">
                <Col className="header-container">
                    <span className="heading-style">Equipment</span>

                    <div className="btn-group custom-button-group float-right" role="group" aria-label="Basic example">
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.building_equipment_permission?.create ? (
                            <button
                                type="button"
                                className="btn btn-md btn-primary font-weight-bold"
                                onClick={() => {
                                    handleShow();
                                    setCreateEqipmentData({
                                        name: '',
                                        equipment_type: '',
                                        end_use: '',
                                        space_id: '',
                                    });
                                }}>
                                <i className="uil uil-plus mr-1"></i>Add Equipment
                            </button>
                        ) : (
                            <></>
                        )}
                    </div>
                </Col>
            </Row>
            <Row>
                <Col lg={12}>
                    {isLoadingEndUseData ? (
                        <SkeletonLoading />
                    ) : (
                        <DataTableWidget
                            isLoading={isEquipDataFetched || isLoadingEndUseData}
                            isLoadingComponent={<SkeletonLoading />}
                            id="equipment"
                            onSearch={(query) => {
                                setPageNo(1);
                                setSearch(query);
                            }}
                            buttonGroupFilterOptions={[
                                { label: 'All Statuses' },
                                { label: 'Online', icon: <WifiSVG /> },
                                { label: 'Offline', icon: <WifiSlashSVG /> },
                            ]}
                            onStatus={(value) => setSelectedTab(value)}
                            rows={currentRow()}
                            searchResultRows={generalEquipmentData}
                            filterOptions={filterOptions}
                            onDeleteRow={(event, id, row) => deleteEquipmentFunc(event, id, row)}
                            onEditRow={(record, id) => {
                                setEquipmentFilter({
                                    equipment_id: record?.equipments_id,
                                    equipment_name: record?.equipments_name,
                                });
                                handleChartOpen();
                            }}
                            onDownload={() => handleDownloadCsv()}
                            headers={headerProps}
                            onPageSize={setPageSize}
                            onChangePage={setPageNo}
                            pageSize={pageSize}
                            currentPage={pageNo}
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
                    )}
                </Col>
            </Row>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header>
                    <Modal.Title>Add Equipment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Name</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Enter Equipment Name"
                                className="font-weight-bold"
                                onChange={(e) => {
                                    handleChange('name', e.target.value);
                                }}
                                value={createEqipmentData?.name}
                                autoFocus
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Type</Form.Label>
                            <Select
                                id="exampleSelect"
                                placeholder="Select Equipment Type"
                                name="select"
                                isSearchable={true}
                                defaultValue={'Select Equipment Type'}
                                options={equipmentTypeDataNow}
                                value={equipmentTypeDataNow.filter(
                                    (option) => option.value === createEqipmentData?.equipment_type
                                )}
                                onChange={(e) => {
                                    handleChange('equipment_type', e.value);
                                }}
                                className="basic-single font-weight-bold"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>End Use Category</Form.Label>
                            <Select
                                id="endUseSelect"
                                placeholder="Selected End Use"
                                name="select"
                                isSearchable={true}
                                defaultValue={'Selected End Use'}
                                options={endUseDataNow}
                                value={endUseDataNow.filter((option) => option.value === createEqipmentData?.end_use)}
                                onChange={(e) => {
                                    handleChange('end_use', e.value);
                                }}
                                className="basic-single font-weight-bold"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label>Equipment Location</Form.Label>
                            <Select
                                id="exampleSelect"
                                placeholder="Select Equipment Location"
                                name="select"
                                isSearchable={true}
                                defaultValue={'Select Equipment Location'}
                                options={locationDataNow}
                                value={locationDataNow.filter(
                                    (option) => option.value === createEqipmentData?.space_id
                                )}
                                onChange={(e) => {
                                    handleChange('space_id', e.value);
                                }}
                                className="basic-single font-weight-bold"
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <div className="add-equipment-footer">
                        <Button
                            label="Cancel"
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryGrey}
                            onClick={() => handleClose()}
                        />
                        <Button
                            label={isProcessing ? 'Creating...' : 'Create'}
                            size={Button.Sizes.lg}
                            type={Button.Type.primary}
                            onClick={() => {
                                saveDeviceData();
                            }}
                        />
                    </div>
                </Modal.Footer>
            </Modal>

            <Modal size="sm" show={isDelete} onHide={handleDeleteClose} centered>
                <Modal.Header>
                    <Modal.Title>Delete Equpiment</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <span style={{ fontSize: '15px' }}>Are you sure you want to delete the Equipment?</span>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer
                    style={{
                        width: '100%',
                        display: 'flex',
                        flexWrap: 'nowrap',
                    }}>
                    <Button
                        style={{ width: '50%', backgroundColor: '#ffffff', borderColor: '#000000', color: '#000000' }}
                        onClick={handleDeleteClose}
                        type={Button.Type.secondaryGrey}
                        size={Button.Sizes.lg}
                        label="Cancel"
                    />
                    <Button
                        disabled={processdelete}
                        style={{ width: '50%', backgroundColor: '#b42318', borderColor: '#b42318' }}
                        onClick={() => {
                            deleteEquipmentFunc();
                        }}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        label={processdelete ? 'Deleting...' : 'Delete'}
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
        </React.Fragment>
    );
};

export default Equipment;
