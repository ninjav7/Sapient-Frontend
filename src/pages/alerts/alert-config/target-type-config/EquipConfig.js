import React, { useEffect, useState, useCallback } from 'react';
import { Modal } from 'reactstrap';
import Skeleton from 'react-loading-skeleton';
import { UncontrolledTooltip } from 'reactstrap';

import Typography from '../../../../sharedComponents/typography';
import { Button } from '../../../../sharedComponents/button';
import Select from '../../../../sharedComponents/form/select';
import Brick from '../../../../sharedComponents/brick';
import { Badge } from '../../../../sharedComponents/badge';
import SkeletonLoader from '../../../../components/SkeletonLoader';
import { Checkbox } from '../../../../sharedComponents/form/checkbox';
import { DataTableWidget } from '../../../../sharedComponents/dataTableWidget';

import { getEquipmentsList } from '../../../settings/panels/services';
import { fetchBuildingList } from '../../../settings/buildings/services';

import '../styles.scss';

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

    const getEquipmentsForBldg = async (selected_bldg) => {
        setEquipFetching(true);
        setEquipmentsList([]);

        const params = `?building_id=${selected_bldg}`;

        await getEquipmentsList(params)
            .then((res) => {
                const { data } = res?.data;

                if (data && data.length !== 0) {
                    data.forEach((el) => {
                        el.label = el?.equipments_name;
                        el.value = el?.equipments_id;
                    });
                    setEquipmentsList(data);
                }
            })
            .catch(() => {})
            .finally(() => {
                setEquipFetching(false);
            });
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
            getEquipmentsForBldg(userSelectedBldgId);
        }
    }, [userSelectedBldgId]);

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
                {/* Modal Header  */}
                <div className="alert-config-header-wrapper d-flex justify-content-between">
                    <div>
                        <Typography.Header size={Typography.Sizes.lg}>Select a Target</Typography.Header>
                    </div>
                    <div className="d-flex">
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
                            isLoadingComponent={<SkeletonLoader noOfColumns={tableHeader.length + 1} noOfRows={12} />}
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
                                const isRecordSelected = userSelectedEquips.some((el) => el?.value === record?.value);

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

export default EquipConfig;
