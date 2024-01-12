import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Select from '../../../sharedComponents/form/select';
import Typography from '../../../sharedComponents/typography';
import { Notification } from '../../../sharedComponents/notification';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';

import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';

import { compareObjData } from '../../../helpers/helpers';
import { addSpaceService, updateSpaceService, deleteSpaceService, getAllSpaceTypes } from './services';

import DeleteLayout from './DeleteLayout';
import { defaultDropdownSearch } from '../../../sharedComponents/form/select/helpers';

const SpaceLayout = (props) => {
    const {
        isModalOpen = false,
        openModal,
        closeModal,
        operationType,
        bldgId,
        fetchAllFloorData,
        fetchAllSpaceData,
        notifyUser,
        spaceObj = {},
        setSpaceObj,
        defaultObjVal = {},
        isSuperAdmin = false,
        canUserDelete = false,
        floorsList,
        spacesList,
        openMoveSpacePopup,
        selectedFloorId,
        spaceObjParent,
        setNewStack,
        setSpaceObjParent,
        allParentSpaces,
    } = props;

    const defaultErrorObj = {
        name: null,
        type_id: null,
    };

    const [errorObj, setErrorObj] = useState(defaultErrorObj);

    const [spaceTypes, setSpaceTypes] = useState([]);
    const [isProcessing, setProcessing] = useState(false);
    const [currentParent, setCurrentParent] = useState('');

    // Delete Space
    const [showDeleteSpace, setShowDeleteSpace] = useState(false);
    const closeDeleteSpacePopup = () => setShowDeleteSpace(false);
    const openDeleteSpacePopup = () => setShowDeleteSpace(true);

    const handleCreateSpace = async (space_obj, bldg_id) => {
        if (!bldg_id || !space_obj?.parents) return;

        let alertObj = Object.assign({}, errorObj);

        if (!space_obj?.name || space_obj?.name === '') alertObj.name = `Please enter Space name. It cannot be empty.`;
        if (!space_obj?.type_id || space_obj?.type_id === '') alertObj.type_id = { text: `Please select Type.` };

        setErrorObj(alertObj);

        if (!alertObj.name && !alertObj.type_id) {
            setProcessing(true);

            const params = `?building_id=${bldg_id}`;

            await addSpaceService(params, space_obj)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        notifyUser(Notification.Types.success, `Space created successfully.`);
                        fetchAllFloorData(bldg_id);
                        fetchAllSpaceData(space_obj?.parents, bldg_id);
                    } else {
                        notifyUser(Notification.Types.error, response?.message);
                    }
                })
                .catch((err) => {
                    notifyUser(Notification.Types.error, `Failed to add Space.`);
                })
                .finally(() => {
                    setProcessing(false);
                    closeModal();
                    setSpaceObj({});
                    setNewStack({});
                    setSpaceObjParent({});
                    setSpaceObj((spaceObj) => {
                        const newSpaceObj = { ...spaceObj };
                        delete newSpaceObj.new_parents;
                        delete newSpaceObj.new_parent_space;
                        return newSpaceObj;
                    });
                    allParentSpaces.current = [];
                    window.scroll(0, 0);
                });
        }
    };

    const fetchEditSpace = async () => {
        setProcessing(true);

        const params = `?space_id=${spaceObj?._id}`;

        const payload = {
            building_id: bldgId,
            name: spaceObj?.name,
            type_id: spaceObj?.type_id,
            parents: spaceObj?.new_parents ? spaceObj?.new_parents : spaceObj?.parents,
            parent_space:
                spaceObj?.new_parent_space || spaceObj?.new_parent_space === null
                    ? spaceObj?.new_parent_space
                    : spaceObj?.parent_space,
        };

        updateSpaceService(params, payload)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    notifyUser(Notification.Types.success, `Space updated successfully.`);
                    fetchAllFloorData(bldgId);
                    // here
                    fetchAllSpaceData(selectedFloorId, bldgId);
                } else {
                    notifyUser(Notification.Types.error, response?.message);
                }
            })
            .catch((err) => {
                notifyUser(Notification.Types.error, `Failed to update Space.`);
            })
            .finally(() => {
                setProcessing(false);
                closeModal();
                setSpaceObj({});
                setNewStack({});
                setSpaceObjParent({});
                setSpaceObj((spaceObj) => {
                    const newSpaceObj = { ...spaceObj };
                    delete newSpaceObj.new_parents;
                    delete newSpaceObj.new_parent_space;
                    return newSpaceObj;
                });
                allParentSpaces.current = [];
                window.scroll(0, 0);
            });
    };

    const handleEditSpace = () => {
        if (!bldgId || !spaceObj?._id) return;

        let alertObj = Object.assign({}, errorObj);

        if (!spaceObj?.name || spaceObj?.name === '') alertObj.name = `Please enter Space name. It cannot be empty.`;
        if (!spaceObj?.type_id || spaceObj?.type_id === '') alertObj.type_id = { text: `Please select Type.` };

        setErrorObj(alertObj);

        if (!alertObj.name && !alertObj.type) fetchEditSpace();
    };

    const handleDeleteSpace = async () => {
        if (!spaceObj?._id) return;

        setProcessing(true);
        const params = `?space_id=${spaceObj?._id}`;

        await deleteSpaceService(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    notifyUser(Notification.Types.success, `Space deleted successfully.`);
                    fetchAllFloorData(bldgId);
                    fetchAllSpaceData(spaceObj?.parents, bldgId);
                } else {
                    notifyUser(Notification.Types.error, response?.message);
                }
            })
            .catch((err) => {
                notifyUser(Notification.Types.error, `Failed to delete Space.`);
            })
            .finally(() => {
                setProcessing(false);
                closeModal();
                closeDeleteSpacePopup();
                setSpaceObj({});
                setNewStack({});
                setSpaceObjParent({});
                setSpaceObj((spaceObj) => {
                    const newSpaceObj = { ...spaceObj };
                    delete newSpaceObj.new_parents;
                    delete newSpaceObj.new_parent_space;
                    return newSpaceObj;
                });
                allParentSpaces.current = [];
                window.scroll(0, 0);
            });
    };

    const fetchSpaceTypes = async () => {
        const params = `?ordered_by=name&sort_by=ace`;

        await getAllSpaceTypes(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (response?.data.length !== 0) {
                        const mappedSpaceTypes = response?.data.map((el) => {
                            return {
                                label: el?.name,
                                value: el?.id,
                            };
                        });
                        setSpaceTypes(mappedSpaceTypes);
                    }
                }
            })
            .catch(() => {});
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, spaceObj);
        setErrorObj({ ...errorObj, [key]: null });
        obj[key] = value;
        setSpaceObj(obj);
    };

    const handleDeleteModalClose = () => {
        closeDeleteSpacePopup();
        openModal();
    };

    const getCurrentParent = () => {
        if (spaceObjParent?._id) {
            setCurrentParent(spaceObjParent?.name);
            return;
        }

        if (spaceObjParent?.floor_id) {
            setCurrentParent(spaceObjParent?.name);
            return;
        }

        if (spaceObj?.parent_space) {
            const parent = spacesList.find((space) => space._id === spaceObj.parent_space);
            setCurrentParent(parent?.name);
            return;
        } else if (spaceObj?.parents) {
            const parent = floorsList.find((space) => space.floor_id === spaceObj.parents);
            setCurrentParent(parent?.name);
            return;
        }

        setCurrentParent('');
    };

    useEffect(() => {
        getCurrentParent();
    }, [spaceObjParent, spaceObj, spacesList, floorsList]);

    useEffect(() => {
        if (isModalOpen) fetchSpaceTypes();
        if (!isModalOpen) setErrorObj(defaultErrorObj);
    }, [isModalOpen]);

    return (
        <>
            <Modal show={isModalOpen} backdrop="static" keyboard={false} size="md" centered>
                <div className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>
                        {operationType === `ADD` ? `Add Space` : `Edit Space`}
                    </Typography.Header>
                    <Brick sizeInRem={2} />
                    <div>
                        <Typography.Body size={Typography.Sizes.md}>{`Name`}</Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <InputTooltip
                            placeholder="Enter Name"
                            labelSize={Typography.Sizes.md}
                            value={spaceObj?.name}
                            error={errorObj?.name}
                            onChange={(e) => {
                                handleChange('name', e.target.value);
                            }}
                        />
                    </div>
                    <Brick sizeInRem={1.25} />
                    <div>
                        <Typography.Body size={Typography.Sizes.md}>{`Type`}</Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <Select
                            name="select"
                            placeholder="Select Type"
                            options={spaceTypes}
                            currentValue={spaceTypes.filter((option) => option.value === spaceObj?.type_id)}
                            isSearchable={true}
                            error={errorObj?.type_id}
                            onChange={(e) => {
                                handleChange('type_id', e.value);
                            }}
                            customSearchCallback={({ data, query }) => defaultDropdownSearch(data, query?.value)}
                            menuPlacement="top"
                        />
                    </div>
                    <Brick sizeInRem={1.25} />
                    {operationType === 'EDIT' && (
                        <>
                            <Typography.Body size={Typography.Sizes.md}>{`Parent`}</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            <div className="d-flex w-100">
                                <InputTooltip
                                    labelSize={Typography.Sizes.md}
                                    value={currentParent}
                                    disabled={true}
                                    className="w-100"
                                />
                                <Button
                                    label={'Move'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => {
                                        closeModal();
                                        openMoveSpacePopup();
                                    }}
                                    className="ml-2"
                                />
                            </div>
                            <Brick sizeInRem={0.25} />
                        </>
                    )}
                    {operationType === 'EDIT' && (canUserDelete || isSuperAdmin) && (
                        <>
                            <Brick sizeInRem={1.25} />
                            <Button
                                label="Delete Space"
                                size={Button.Sizes.md}
                                type={Button.Type.secondaryDistructive}
                                icon={<DeleteSVG />}
                                onClick={() => {
                                    closeModal();
                                    openDeleteSpacePopup();
                                }}
                            />
                        </>
                    )}
                    <Brick sizeInRem={canUserDelete || isSuperAdmin ? 1.5 : 2} />
                    <div className="d-flex justify-content-between w-100">
                        <Button
                            label={`Cancel`}
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryGrey}
                            className="w-100"
                            onClick={() => {
                                closeModal();
                                setSpaceObj({});
                                setNewStack({});
                                setSpaceObjParent({});
                                setSpaceObj((spaceObj) => {
                                    const newSpaceObj = { ...spaceObj };
                                    delete newSpaceObj.new_parents;
                                    delete newSpaceObj.new_parent_space;
                                    return newSpaceObj;
                                });
                                allParentSpaces.current = [];
                                setErrorObj(defaultErrorObj);
                            }}
                        />
                        {operationType === 'ADD' ? (
                            <Button
                                label={isProcessing ? `Saving...` : `Save`}
                                size={Button.Sizes.lg}
                                type={Button.Type.primary}
                                className="w-100"
                                onClick={() => {
                                    handleCreateSpace(spaceObj, bldgId);
                                }}
                                disabled={isProcessing}
                            />
                        ) : (
                            <Button
                                label={isProcessing ? `Updating...` : `Update`}
                                size={Button.Sizes.lg}
                                type={Button.Type.primary}
                                className="w-100"
                                onClick={() => {
                                    handleEditSpace();
                                }}
                                disabled={isProcessing || compareObjData(defaultObjVal, spaceObj)}
                            />
                        )}
                    </div>
                    <Brick sizeInRem={0.25} />
                </div>
            </Modal>

            <DeleteLayout
                isModalOpen={showDeleteSpace}
                onCancel={handleDeleteModalClose}
                onSave={handleDeleteSpace}
                deleteType="SPACE"
                isDeleting={isProcessing}
            />
        </>
    );
};

export default SpaceLayout;
