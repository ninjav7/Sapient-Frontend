import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import Modal from 'react-bootstrap/Modal';

import Typography from '../../../../sharedComponents/typography';
import { Button } from '../../../../sharedComponents/button';
import { DataTableWidget } from '../../../../sharedComponents/dataTableWidget';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import { Badge } from '../../../../sharedComponents/badge';
import { Checkbox } from '../../../../sharedComponents/form/checkbox';

import { UserStore } from '../../../../store/UserStore';

import { formatConsumptionValue } from '../../../../helpers/helpers';
import { handleUnitConverstion } from '../../../settings/general-settings/utils';
import { FILTER_TYPES } from '../../../../sharedComponents/dataTableWidget/constants';

import { fetchBuildingList, getFiltersForBuildingsRequest } from '../../../settings/buildings/services';

import '../styles.scss';

const BuildingConfig = (props) => {
    const { isModalOpen = false, handleModalClose, alertObj = {}, handleTargetChange, setOriginalBldgsList } = props;

    const userPrefUnits = UserStore.useState((s) => s.unit);

    const [targetObj, setTargetObj] = useState({});
    const [originalTargetObj, setOriginalTargetObj] = useState({});

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});

    const [checkedAll, setCheckedAll] = useState(false);
    const [userSelectedBldgs, setUserSelectedBldgs] = useState([]);

    const [buildingsList, setBuildingsList] = useState([]);
    const [buildingTypes, setBuildingTypes] = useState([]);
    const [selectedBuildingType, setSelectedBuildingType] = useState([]);

    const [isFetchingData, setDataFetching] = useState(false);
    const [isFetchingFilterData, setFetchingFilterData] = useState(false);

    const [filterOptions, setFilterOptions] = useState([]);

    const customModalStyle = {
        modalContent: {
            height: '90vh',
            overflowY: 'auto', // Enable vertical scrolling when content exceeds the height
        },
    };

    const renderBldgName = (row) => {
        return <div className="typography-wrapper link">{row?.building_name === '' ? '-' : row?.building_name}</div>;
    };

    const renderBldgType = (row) => {
        return (
            <Badge
                text={
                    <Typography.Body size={Typography.Sizes.md} className="gray-950">
                        {row?.building_type === '' ? '-' : row?.building_type}
                    </Typography.Body>
                }
            />
        );
    };

    const renderDeviceCount = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.num_of_devices === '' ? '-' : formatConsumptionValue(row?.num_of_devices, 0)}
            </Typography.Body>
        );
    };

    const renderBldgSqft = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.building_size === '' ? '-' : formatConsumptionValue(row?.building_size, 0)}
            </Typography.Body>
        );
    };

    const tableHeader = [
        {
            name: 'Building Name',
            accessor: 'building_name',
            callbackValue: renderBldgName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Building Type',
            accessor: 'building_type',
            callbackValue: renderBldgType,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: `${userPrefUnits === 'si' ? `Sq. M.` : `Sq. Ft.`}`,
            accessor: 'building_size',
            callbackValue: renderBldgSqft,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Devices',
            accessor: 'num_of_devices',
            callbackValue: renderDeviceCount,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    const closeModalAction = () => {
        setSearch('');
        setSortBy({});
        setCheckedAll(false);
        setUserSelectedBldgs([]);
        setBuildingsList([]);
        setBuildingTypes([]);
        setSelectedBuildingType([]);
        setDataFetching(false);
        setFetchingFilterData(false);
        setFilterOptions([]);
    };

    const currentRow = () => {
        return buildingsList;
    };

    const handleRowCheck = (value, selectedBldgObj) => {
        if (value === 'true') {
            const updatedBldgs = userSelectedBldgs.filter((el) => el?.value !== selectedBldgObj?.value);
            setUserSelectedBldgs(updatedBldgs);
        } else if (value === 'false') {
            setUserSelectedBldgs((prevBldgs) => [
                ...prevBldgs,
                {
                    value: selectedBldgObj?.value,
                    label: selectedBldgObj?.label,
                },
            ]);
        }
    };

    const handleAddTarget = (selected_bldgs) => {
        if (selected_bldgs.length !== 0) {
            handleTargetChange('lists', selected_bldgs);
        }
        handleModalClose();
        closeModalAction();
    };

    const handleCancelClick = () => {
        if (originalTargetObj?.lists.length === 0) {
            handleTargetChange('type', '');
        }
        handleModalClose();
        closeModalAction();
    };

    const handleCheckAllClick = (is_checked, buildings_list) => {
        if (is_checked) {
            setUserSelectedBldgs([]);
        } else if (!is_checked && buildings_list && buildings_list.length !== 0) {
            const allBldgs = buildings_list.map((el) => {
                return {
                    label: el?.label,
                    value: el?.value,
                };
            });
            setUserSelectedBldgs(allBldgs);
        }
        setCheckedAll(!is_checked);
    };

    const getBuildingsList = async (user_pref_units, selected_bldg_type = []) => {
        setDataFetching(true);

        const ordered_by = sortBy.name === undefined || sortBy.method === null ? 'building_name' : sortBy?.name;
        const sort_by = sortBy.method === undefined || sortBy.method === null ? 'ace' : sortBy?.method;
        const formattedBldgTypeSelected = encodeURIComponent(selected_bldg_type.join('+'));

        await fetchBuildingList(search, sort_by, ordered_by, '', formattedBldgTypeSelected)
            .then((res) => {
                const data = res?.data;

                if (data && data.length !== 0) {
                    data.forEach((el) => {
                        el.building_size = Math.round(handleUnitConverstion(el?.building_size, user_pref_units));
                        el.label = el?.building_name;
                        el.value = el?.building_id;
                    });
                    setBuildingsList(data);
                    setOriginalBldgsList(data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setDataFetching(false);
            });
    };

    const getBuildingsFilters = async () => {
        setFetchingFilterData(true);

        await getFiltersForBuildingsRequest()
            .then((res) => {
                if (res?.success && res?.data && res?.data.length !== 0) {
                    const filterObj = res.data[0];

                    if (filterObj?.building_type && filterObj?.building_type.length !== 0) {
                        setBuildingTypes(filterObj?.building_type);
                    }
                }
            })
            .catch(() => {
                setFetchingFilterData(false);
            });
    };

    useEffect(() => {
        if (userSelectedBldgs && buildingsList) {
            setCheckedAll(userSelectedBldgs.length === buildingsList.length && buildingsList.length > 0);
        }
    }, [userSelectedBldgs, buildingsList]);

    useEffect(() => {
        if (isModalOpen) {
            getBuildingsFilters();
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (isModalOpen) {
            getBuildingsList(userPrefUnits, selectedBuildingType);
        }
    }, [isModalOpen, sortBy, search, selectedBuildingType, userPrefUnits]);

    useEffect(() => {
        if (buildingTypes.length !== 0) {
            const filterOptionsFetched = [
                {
                    label: 'Building Type',
                    value: 'building_type',
                    placeholder: 'All Building Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: buildingTypes?.map((el) => ({
                        value: el?.building_type_id,
                        label: el?.building_type,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let buildingType = [];
                            for (let i = 0; i < opt.length; i++) {
                                buildingType.push(opt[i].value);
                            }
                            setSelectedBuildingType(buildingType);
                        }
                    },
                    onDelete: () => {
                        setSelectedBuildingType([]);
                    },
                },
            ];
            setFilterOptions(filterOptionsFetched);
        }
    }, [buildingTypes]);

    useEffect(() => {
        if (isModalOpen) {
            const { target } = alertObj || {};
            const { lists } = target || {};

            const copyTargetObj = _.cloneDeep(target);
            setTargetObj(copyTargetObj);
            setOriginalTargetObj(copyTargetObj);

            if (lists && lists.length !== 0) {
                setUserSelectedBldgs([...lists]);
            }
        }
    }, [alertObj, isModalOpen]);

    return (
        <React.Fragment>
            <Modal show={isModalOpen} onHide={handleModalClose} size="xl" centered backdrop="static" keyboard={false}>
                <div className="custom-modal-body targettype-modal-container" style={customModalStyle.modalContent}>
                    {/* Modal Header  */}
                    <div className="alert-config-header-wrapper d-flex justify-content-between align-items-start">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>Select a Target</Typography.Header>
                        </div>
                        <div className="d-flex align-items-center">
                            {userSelectedBldgs && userSelectedBldgs.length > 0 && (
                                <div className="mr-4">
                                    <Typography.Subheader
                                        size={Typography.Sizes.lg}
                                        className="selected-target-label">{`${userSelectedBldgs.length} Building selected`}</Typography.Subheader>
                                </div>
                            )}
                            <div>
                                <Button
                                    label="Cancel"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryGrey}
                                    onClick={() => handleCancelClick()}
                                />
                            </div>
                            <div>
                                <Button
                                    label={'Add Target'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => handleAddTarget(userSelectedBldgs)}
                                    className="ml-2"
                                    disabled={userSelectedBldgs.length === 0}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Modal Body */}
                    <div style={{ padding: '2rem' }}>
                        <DataTableWidget
                            id="building_target_type"
                            isLoading={isFetchingData}
                            isFilterLoading={isFetchingFilterData}
                            isLoadingComponent={<SkeletonLoader noOfColumns={tableHeader.length} noOfRows={12} />}
                            customCheckAll={() => (
                                <Checkbox
                                    label=""
                                    type="checkbox"
                                    id="building_check_all"
                                    name="building_check_all"
                                    checked={checkedAll}
                                    onChange={() => handleCheckAllClick(checkedAll, buildingsList)}
                                />
                            )}
                            customCheckboxForCell={(record) => {
                                const isRecordSelected = userSelectedBldgs.some((el) => el?.value === record?.value);

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
                            buttonGroupFilterOptions={[]}
                            onSearch={setSearch}
                            onStatus={[]}
                            rows={currentRow()}
                            searchResultRows={currentRow()}
                            disableColumnDragging={true}
                            filterOptions={filterOptions}
                            headers={tableHeader}
                            totalCount={(() => {
                                return 0;
                            })()}
                        />
                    </div>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default BuildingConfig;
