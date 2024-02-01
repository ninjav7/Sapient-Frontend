import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from 'reactstrap';
import Skeleton from 'react-loading-skeleton';
import { UncontrolledTooltip } from 'reactstrap';

import Brick from '../../../../sharedComponents/brick';
import { Badge } from '../../../../sharedComponents/badge';
import Typography from '../../../../sharedComponents/typography';
import { Button } from '../../../../sharedComponents/button';
import Select from '../../../../sharedComponents/form/select';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import { Checkbox } from '../../../../sharedComponents/form/checkbox';
import { DataTableWidget } from '../../../../sharedComponents/dataTableWidget';
import { FILTER_TYPES } from '../../../../sharedComponents/dataTableWidget/constants';

import { fetchBuildingList } from '../../../settings/buildings/services';
import { getEqupmentDataRequest, getFiltersForEquipmentRequest } from '../../../../services/equipment';

import '../styles.scss';
import { pageListSizes } from '../../../../helpers/helpers';

const EquipConfig = (props) => {
    const { isModalOpen = false, handleModalClose, alertObj = {}, handleTargetChange } = props;

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});

    const [isBldgFetching, setBldgFetching] = useState(false);
    const [isEquipFetching, setEquipFetching] = useState(false);
    const [isFilterFetching, setFetchingFilters] = useState(false);

    const [buildingsList, setBuildingsList] = useState([]);
    const [equipmentsList, setEquipmentsList] = useState([]);
    const [filterOptions, setFilterOptions] = useState([]);

    const [userSelectedBldgId, setUserSelectedBldgId] = useState('');
    const [userSelectedEquips, setUserSelectedEquips] = useState([]);

    const [checkedAll, setCheckedAll] = useState(false);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);

    const [floorString, setFloorString] = useState([]);
    const [spaceString, setSpaceString] = useState([]);
    const [deviceMacAddress, setDeviceMacAddress] = useState('');
    const [deviceIdFilterString, setDeviceIdFilterString] = useState('');
    const [equipmentTypeFilterString, setEquipmentTypeFilterString] = useState('');
    const [panelNameFilterString, setPanelNameFilterString] = useState('');
    const [cdModelInstalledNameString, setCdModelInstalledNameString] = useState('');
    const [breakerNumberString, setBreakerNumberString] = useState('');
    const [breakerRatedAmpsString, setBreakerRatedAmpsString] = useState('');
    const [endUseFilterString, setEndUseFilterString] = useState('');
    const [tagsFilterString, setTagsTypeFilterString] = useState('');

    const customModalStyle = {
        modalContent: {
            height: '90vh',
            overflowY: 'auto', // Enable vertical scrolling when content exceeds the height
        },
    };

    const filterHandler = (setter, options) => {
        setter(options.map(({ value }) => value));
        setPageNo(1);
    };

    const filterLabelHandler = (setter, options) => {
        setter(options.map(({ label }) => label));
        setPageNo(1);
    };

    const handleCancelClick = (selected_bldg = '', selected_equips = []) => {
        if (selected_bldg === '' || selected_equips.length === 0) {
            handleTargetChange('type', '');
        }
        handleModalClose();
    };

    const handleAddTarget = (selected_bldg_id, selected_equips) => {
        if (selected_bldg_id && selected_equips.length !== 0) {
            handleTargetChange('buildingIDs', selected_bldg_id);
            handleTargetChange('lists', selected_equips);
        }
        handleModalClose();
    };

    const handleCheckAllClick = (is_checked, equipments_list) => {
        if (is_checked) {
            setUserSelectedEquips([]);
        } else if (!is_checked && equipments_list && equipments_list.length !== 0) {
            const allBldgs = equipments_list.map((el) => {
                return {
                    label: el?.label,
                    value: el?.value,
                };
            });
            setUserSelectedEquips(allBldgs);
        }
        setCheckedAll(!is_checked);
    };

    const handleRowCheck = (value, selectedEquipObj) => {
        if (value === 'true') {
            const updatedBldgs = userSelectedEquips.filter((el) => el?.value !== selectedEquipObj?.value);
            setUserSelectedEquips(updatedBldgs);
        } else if (value === 'false') {
            setUserSelectedEquips((prevEquips) => [
                ...prevEquips,
                {
                    value: selectedEquipObj?.value,
                    label: selectedEquipObj?.label,
                },
            ]);
        }
    };

    const getBuildingsList = async () => {
        setBldgFetching(true);

        await fetchBuildingList()
            .then((res) => {
                const data = res?.data;

                if (data && data.length !== 0) {
                    data.forEach((el) => {
                        el.label = el?.building_name;
                        el.value = el?.building_id;
                    });
                    setBuildingsList(data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setBldgFetching(false);
            });
    };

    const fetchEquipmentData = async () => {
        setEquipFetching(true);
        setEquipmentsList([]);

        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name,
                sort_by: sortBy.method,
            };

        await getEqupmentDataRequest(
            panelNameFilterString,
            cdModelInstalledNameString,
            breakerNumberString,
            breakerRatedAmpsString,
            pageSize,
            pageNo,
            userSelectedBldgId,
            search,
            equipmentTypeFilterString,
            endUseFilterString,
            deviceIdFilterString,
            '',
            floorString,
            spaceString,
            tagsFilterString,
            {
                ...sorting,
            },
            true
        )
            .then((res) => {
                const responseData = res.data;
                setTotalItems(responseData?.total_data);
                setEquipmentsList(responseData?.data);
            })
            .catch((error) => {})
            .finally(() => {
                setEquipFetching(false);
            });
    };

    const getFilters = async () => {
        setFetchingFilters(true);

        const filters = await getFiltersForEquipmentRequest({
            bldgId: userSelectedBldgId,
            deviceMacAddress,
            equipmentTypeFilterString,
            endUseFilterString,
            floorTypeFilterString: floorString,
            spaceTypeFilterString: spaceString,
            tagsFilterString,
            panelNameFilterString,
            cdModelInstalledNameString,
            breakerNumberString,
            breakerRatedAmpsString,
        });

        filters.data.forEach((filterOptions) => {
            const sortedFloors = filterOptions?.installed_floor
                .slice()
                .sort((a, b) => a.floor_name.localeCompare(b.floor_name));
            const sortedSpaces = filterOptions?.installed_space
                .slice()
                .sort((a, b) => a.space_name.localeCompare(b.space_name));

            if (filterOptions?.breaker_number.length > 1) filterOptions.breaker_number.sort((a, b) => a - b);
            if (filterOptions?.breaker_rated_amps.length > 1) filterOptions.breaker_rated_amps.sort((a, b) => a - b);
            if (filterOptions?.tags.length > 1) filterOptions.tags.sort((a, b) => b.localeCompare(a));
            if (filterOptions?.ct_model_installed_name.length > 1)
                filterOptions.ct_model_installed_name.sort((a, b) =>
                    a.ct_model_installed_name.localeCompare(b.ct_model_installed_name)
                );
            if (filterOptions?.panel_name.length > 1)
                filterOptions.panel_name.sort((a, b) => a.panel_name.localeCompare(b.panel_name));
            if (filterOptions?.mac_address.length > 1)
                filterOptions.mac_address.sort((a, b) => a.device_mac_address.localeCompare(b.device_mac_address));
            if (filterOptions?.end_use.length > 1)
                filterOptions.end_use.sort((a, b) => a.end_use_name.localeCompare(b.end_use_name));
            if (filterOptions?.equipment_type.length > 1)
                filterOptions.equipment_type.sort((a, b) => a.equipment_type_name.localeCompare(b.equipment_type_name));

            if (tagsFilterString?.length === 0 || tagsFilterString?.includes('none'))
                filterOptions.tags.unshift('none');
            if (deviceIdFilterString?.length === 0 || deviceIdFilterString?.includes('none'))
                filterOptions.mac_address.unshift({ device_id: 'none', device_mac_address: 'none' });
            if (panelNameFilterString?.length === 0 || panelNameFilterString?.includes('none'))
                filterOptions.panel_name.unshift({ panel_id: 'none', panel_name: 'none' });
            if (breakerNumberString?.length === 0 || breakerNumberString?.includes('none'))
                filterOptions.breaker_number.unshift('none');

            if ((floorString?.length === 0 && spaceString?.length === 0) || floorString?.includes('none'))
                sortedFloors.unshift({ floor_id: 'none', floor_name: 'none' });
            if ((floorString?.length === 0 && spaceString?.length === 0) || spaceString?.includes('none'))
                sortedSpaces.unshift({ space_id: 'none', space_name: 'none' });

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
                        setPageNo(1);
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
                        setPageNo(1);
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
                        setPageNo(1);
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
                    onDelete: () => {
                        setPageNo(1);
                        setTagsTypeFilterString('');
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
                        setPageNo(1);
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
                        setPageNo(1);
                        setSpaceString([]);
                    },
                },
                {
                    label: 'Panel',
                    value: 'panel_name',
                    placeholder: 'All Panels',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.panel_name.map((panel) => ({
                        value: panel.panel_id,
                        label: panel.panel_name,
                    })),
                    onClose: (options) => filterHandler(setPanelNameFilterString, options),
                    onDelete: () => {
                        setPageNo(1);
                        setPanelNameFilterString('');
                    },
                },
                {
                    label: 'CT Amp Rating',
                    value: 'ct_model_installed_name',
                    placeholder: 'All CT Amp Ratings',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.ct_model_installed_name.map((ct_model_installed_name) => ({
                        value: ct_model_installed_name.ct_model_installed_id,
                        label: ct_model_installed_name.ct_model_installed_name,
                    })),
                    onClose: (options) => filterHandler(setCdModelInstalledNameString, options),
                    onDelete: () => {
                        setPageNo(1);
                        setCdModelInstalledNameString('');
                    },
                },
                {
                    label: 'Breaker #s',
                    value: 'breaker_number',
                    placeholder: 'All Breaker #s',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.breaker_number.map((breaker_number) => ({
                        value: breaker_number,
                        label: breaker_number,
                    })),
                    onClose: (options) => filterHandler(setBreakerNumberString, options),
                    onDelete: () => {
                        setPageNo(1);
                        setBreakerNumberString('');
                    },
                },
                {
                    label: 'Rated Amps',
                    value: 'breaker_rated_amps',
                    placeholder: 'All Rated Amps',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.breaker_rated_amps.map((breaker_rated_amps) => ({
                        value: breaker_rated_amps,
                        label: breaker_rated_amps,
                    })),
                    onClose: (options) => filterHandler(setBreakerRatedAmpsString, options),
                    onDelete: () => {
                        setPageNo(1);
                        setBreakerRatedAmpsString('');
                    },
                },
            ];

            setFilterOptions(filterOptionsFetched);
        });
        setFetchingFilters(false);
    };

    const renderEquipmentsName = (row) => {
        return (
            <Typography.Link size={Typography.Sizes.md} className="mouse-pointer">
                {row.equipments_name !== '' ? row.equipments_name : '-'}
            </Typography.Link>
        );
    };

    const renderEndUseCategory = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row.end_use_name !== '' ? row.end_use_name : '-'}
            </Typography.Body>
        );
    };

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

    const renderPanel = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>{row.panel_name !== '' ? row.panel_name : '-'}</Typography.Body>
        );
    };

    const renderCTAmp = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row.ct_model_installed !== '' ? row.ct_model_installed : '-'}
            </Typography.Body>
        );
    };

    const renderRatedAmps = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row.breaker_rated_amps[0]}</Typography.Body>;
    };

    const renderBreaker = (row) => {
        const res = row.breaker_number && row.breaker_number.length ? row.breaker_number.join(', ') : '';
        return <Typography.Body size={Typography.Sizes.md}>{res !== '' ? res : '-'}</Typography.Body>;
    };

    const tableHeader = [
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
        {
            name: 'Panel',
            accessor: 'panel_name',
            callbackValue: renderPanel,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: `Breaker #s`,
            accessor: 'breaker_number',
            callbackValue: renderBreaker,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Rated Amps',
            accessor: 'breaker_rated_amps',
            callbackValue: renderRatedAmps,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'CT Amp Rating',
            accessor: 'ct_model_installed',
            callbackValue: renderCTAmp,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    const currentRow = () => {
        return equipmentsList;
    };

    useEffect(() => {
        const { target } = alertObj || {};

        if (isModalOpen && target) {
            const { buildingIDs, lists } = target;

            if (buildingIDs) {
                setUserSelectedBldgId(buildingIDs);
            }

            if (lists && lists.length !== 0) {
                setUserSelectedEquips(lists);
            }
        }
    }, [alertObj, isModalOpen]);

    useEffect(() => {
        if (userSelectedBldgId) {
            fetchEquipmentData();
            getFilters();
        }
    }, [
        userSelectedBldgId,
        search,
        pageSize,
        pageNo,
        sortBy,
        deviceMacAddress,
        deviceIdFilterString,
        equipmentTypeFilterString,
        endUseFilterString,
        floorString,
        spaceString,
        tagsFilterString,
        panelNameFilterString,
        cdModelInstalledNameString,
        breakerNumberString,
        breakerRatedAmpsString,
    ]);

    useEffect(() => {
        if (isModalOpen) {
            getBuildingsList();
        } else {
            setBuildingsList([]);
            setEquipmentsList([]);
            setUserSelectedBldgId('');
            setUserSelectedEquips([]);
        }
    }, [isModalOpen]);

    return (
        <React.Fragment>
            <Modal isOpen={isModalOpen} className="equip-config-modal-fullscreen">
                <div className="targettype-modal-container" style={customModalStyle.modalContent}>
                    {/* Modal Header  */}
                    <div className="alert-config-header-wrapper d-flex justify-content-between">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>Select a Target</Typography.Header>
                        </div>
                        <div className="d-flex align-items-center">
                            {userSelectedEquips && userSelectedEquips.length > 0 && (
                                <div className="mr-4">
                                    <Typography.Subheader
                                        size={Typography.Sizes.lg}
                                        className="selected-target-label">{`${userSelectedEquips.length} Equipment selected`}</Typography.Subheader>
                                </div>
                            )}
                            <div>
                                <Button
                                    label="Cancel"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    onClick={() => handleCancelClick(userSelectedBldgId, userSelectedEquips)}
                                />
                            </div>
                            <div>
                                <Button
                                    label={'Add Target'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => handleAddTarget(userSelectedBldgId, userSelectedEquips)}
                                    className="ml-2"
                                    disabled={userSelectedEquips && userSelectedEquips.length === 0}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div style={{ padding: '2rem' }}>
                        <div style={{ width: '25%' }}>
                            <Typography.Body size={Typography.Sizes.md}>Select Building</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            {isBldgFetching ? (
                                <Skeleton count={1} height={35} />
                            ) : (
                                <Select
                                    id="buildingSelect"
                                    placeholder="Select a Building"
                                    name="select"
                                    options={buildingsList}
                                    className="w-100"
                                    onChange={(e) => {
                                        setUserSelectedBldgId(e.value);
                                        setUserSelectedEquips([]);
                                        setCheckedAll(false);
                                    }}
                                    currentValue={buildingsList.filter((option) => option.value === userSelectedBldgId)}
                                    menuPlacement="auto"
                                />
                            )}
                        </div>

                        <Brick sizeInRem={2} />

                        <div>
                            <DataTableWidget
                                id="equipment_target_type"
                                isLoading={isEquipFetching}
                                isFilterLoading={isFilterFetching}
                                isLoadingComponent={
                                    <SkeletonLoader noOfColumns={tableHeader.length + 1} noOfRows={12} />
                                }
                                customCheckAll={() => (
                                    <Checkbox
                                        label=""
                                        type="checkbox"
                                        id="building_check_all"
                                        name="building_check_all"
                                        checked={checkedAll}
                                        onChange={() => handleCheckAllClick(checkedAll, equipmentsList)}
                                    />
                                )}
                                customCheckboxForCell={(record) => {
                                    const isRecordSelected = userSelectedEquips.some(
                                        (el) => el?.value === record?.value
                                    );
                                    return (
                                        <Checkbox
                                            label=""
                                            type="checkbox"
                                            id="building_target-type_check"
                                            name="building_target-type_check"
                                            checked={isRecordSelected}
                                            value={isRecordSelected}
                                            onChange={(e) => {
                                                handleRowCheck(e.target.value, record);
                                            }}
                                        />
                                    );
                                }}
                                onSearch={setSearch}
                                buttonGroupFilterOptions={[]}
                                onPageSize={setPageSize}
                                onChangePage={setPageNo}
                                pageSize={pageSize}
                                currentPage={pageNo}
                                pageListSizes={pageListSizes}
                                onStatus={[]}
                                rows={currentRow()}
                                searchResultRows={currentRow()}
                                disableColumnDragging={true}
                                filterOptions={filterOptions}
                                headers={tableHeader}
                                totalCount={(() => {
                                    return totalItems;
                                })()}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default EquipConfig;
