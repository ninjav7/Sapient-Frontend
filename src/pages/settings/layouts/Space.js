import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import { Notification } from '../../../sharedComponents/notification';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';

import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';

import { addSpaceService, updateSpaceService, deleteSpaceService, getAllSpaceTypes } from './services';
import DeleteModal from './DeleteModal';
import Select from '../../../sharedComponents/form/select';

const Space = (props) => {
    const {
        isModalOpen = false,
        openModal,
        closeModal,
        operationType,
        bldgId,
        fetchAllFloorData,
        fetchAllSpaceData,
        notifyUser,
        selectedSpaceObj = {},
    } = props;

    const defaultSpaceObj = {
        name: '',
        type_id: '',
    };

    const defaultErrorObj = {
        name: null,
        type_id: null,
    };

    const [spaceObj, setSpaceObj] = useState(defaultSpaceObj);
    const [errorObj, setErrorObj] = useState(defaultErrorObj);

    const [spaceTypes, setSpaceTypes] = useState([]);
    const [isProcessing, setProcessing] = useState(false);

    // Delete Space
    const [showDeleteSpace, setShowDeleteSpace] = useState(false);
    const closeDeleteSpacePopup = () => setShowDeleteSpace(false);
    const openDeleteSpacePopup = () => setShowDeleteSpace(true);

    const handleCreateSpace = async (space_obj, bldg_id) => {
        if (!bldg_id || !space_obj?.parent_id) return;

        let alertObj = Object.assign({}, errorObj);

        if (space_obj?.name === '') alertObj.name = `Please enter Space name. It cannot be empty.`;
        if (space_obj?.type_id === '') alertObj.type_id = { text: `Please select Type.` };

        setErrorObj(alertObj);

        if (!alertObj.name && !alertObj.type_id) {
            setProcessing(true);

            const params = `?building_id=${bldg_id}`;
            const payload = {
                building_id: bldg_id,
                parents: space_obj?.parent_id,
                name: space_obj?.name,
                type_id: space_obj?.type_id,
            };

            await addSpaceService(params, payload)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        notifyUser(Notification.Types.success, response?.message);
                        fetchAllFloorData(bldg_id);
                        fetchAllSpaceData(space_obj?.parent_id, bldg_id);
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
                });
        }
    };

    const handleEditSpace = async (space_obj, bldg_id) => {
        if (!bldg_id || !spaceObj?._id) return;

        let alertObj = Object.assign({}, errorObj);

        if (space_obj?.name === '') alertObj.name = `Please enter Space name. It cannot be empty.`;
        if (space_obj?.type === '') alertObj.type = `Please select Type.`;

        setErrorObj(alertObj);

        if (!alertObj.name && !alertObj.type) {
            setProcessing(true);

            const params = `?space_id=${space_obj?._id}`;
            const payload = {
                building_id: bldg_id,
                name: space_obj?.name,
                type_id: space_obj?.type_id,
                parents: space_obj?.parents,
                parent_space: space_obj?.parent_space,
            };

            await updateSpaceService(params, payload)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        notifyUser(Notification.Types.success, response?.message);
                        fetchAllFloorData(bldg_id);
                        fetchAllSpaceData(space_obj?.parents, bldg_id);
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
                });
        }
    };

    const handleDeleteSpace = async () => {
        if (!selectedSpaceObj?._id) return;

        setProcessing(true);
        const params = `?space_id=${selectedSpaceObj?._id}`;

        await deleteSpaceService(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    notifyUser(Notification.Types.success, response?.message);
                    fetchAllFloorData(bldgId);
                    fetchAllSpaceData(selectedSpaceObj?.parents, bldgId);
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

    useEffect(() => {
        if (isModalOpen) fetchSpaceTypes();
        if (!isModalOpen) {
            setSpaceObj(defaultSpaceObj);
            setErrorObj(defaultErrorObj);
        }
    }, [isModalOpen]);

    useEffect(() => {
        if (selectedSpaceObj) setSpaceObj({ ...spaceObj, ...selectedSpaceObj });
    }, [selectedSpaceObj]);

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
                        />
                    </div>

                    {operationType === 'ADD' && <Brick sizeInRem={2.5} />}

                    {operationType === 'EDIT' && (
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
                            <Brick sizeInRem={1.35} />
                        </>
                    )}

                    <div className="d-flex justify-content-between w-100">
                        <Button
                            label={`Cancel`}
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryGrey}
                            className="w-100"
                            onClick={() => {
                                closeModal();
                                setSpaceObj(defaultSpaceObj);
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
                                    handleEditSpace(spaceObj, bldgId);
                                }}
                                disabled={isProcessing}
                            />
                        )}
                    </div>
                    <Brick sizeInRem={0.25} />
                </div>
            </Modal>

            <DeleteModal
                isModalOpen={showDeleteSpace}
                onCancel={handleDeleteModalClose}
                onSave={handleDeleteSpace}
                deleteType="SPACE"
                isDeleting={isProcessing}
            />
        </>
    );
};

export default Space;
