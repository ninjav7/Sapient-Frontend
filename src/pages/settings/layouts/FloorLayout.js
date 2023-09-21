import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';

import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import { Notification } from '../../../sharedComponents/notification';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';

import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';

import { addFloorService, deleteFloorService, updateFloorService } from './services';
import DeleteLayout from './DeleteLayout';

const FloorLayout = (props) => {
    const {
        isModalOpen = false,
        openModal,
        closeModal,
        operationType,
        bldgId,
        fetchAllFloorData,
        notifyUser,
        selectedFloorObj = {},
        setSelectedFloorObj,
    } = props;

    const [floorName, setFloorName] = useState('');
    const [floorNameError, setFloorNameError] = useState(null);
    const [isProcessing, setProcessing] = useState(false);

    // Delete Floor
    const [showDeleteFloor, setShowDeleteFloor] = useState(false);
    const closeDeleteFloorPopup = () => setShowDeleteFloor(false);
    const openDeleteFloorPopup = () => setShowDeleteFloor(true);

    const handleCreateFloor = async (floor_name, bldg_id) => {
        if (!bldg_id) return;

        if (floor_name === '') setFloorNameError(`Please enter Floor name. It cannot be empty.`);

        if (floor_name !== '') {
            setProcessing(true);

            const params = `?building_id=${bldg_id}`;
            const payload = {
                parent_building: bldg_id,
                name: floor_name.trim(),
            };

            await addFloorService(params, payload)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        notifyUser(Notification.Types.success, response?.message);
                        fetchAllFloorData(bldg_id);
                    } else {
                        notifyUser(Notification.Types.error, response?.message);
                    }
                })
                .catch((err) => {
                    notifyUser(Notification.Types.error, 'Failed to add Floor.');
                })
                .finally(() => {
                    setProcessing(false);
                    closeModal();
                    setFloorName('');
                    setFloorNameError(null);
                });
        }
    };

    const handleEditFloor = async (floor_name, bldg_id, floorObj) => {
        if (!bldg_id || !floorObj?.floor_id) return;

        if (floor_name === '') setFloorNameError(`Please enter Floor Name. It cannot be empty.`);

        if (floor_name !== '') {
            setProcessing(true);

            const params = `?floor_id=${floorObj?.floor_id}`;
            const payload = {
                name: floor_name.trim(),
            };

            await updateFloorService(params, payload)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        notifyUser(Notification.Types.success, response?.message);
                        fetchAllFloorData(bldg_id);
                    } else {
                        notifyUser(Notification.Types.error, response?.message);
                    }
                })
                .catch((err) => {
                    notifyUser(Notification.Types.error, 'Failed to update Floor.');
                })
                .finally(() => {
                    setProcessing(false);
                    closeModal();
                    setFloorName('');
                    setFloorNameError(null);
                    setSelectedFloorObj({});
                });
        }
    };

    const handleDeleteFloor = async () => {
        if (!selectedFloorObj?.floor_id) return;

        setProcessing(true);
        const params = `/${selectedFloorObj?.floor_id}/`;

        await deleteFloorService(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    notifyUser(Notification.Types.success, response?.message);
                    fetchAllFloorData(bldgId);
                } else {
                    notifyUser(Notification.Types.error, response?.message);
                }
            })
            .catch((err) => {
                notifyUser(Notification.Types.error, 'Failed to delete Floor.');
            })
            .finally(() => {
                setProcessing(false);
                closeModal();
                setFloorName('');
                setFloorNameError(null);
                setSelectedFloorObj({});
                closeDeleteFloorPopup();
                window.scroll(0, 0);
            });
    };

    const handleDeleteModalClose = () => {
        closeDeleteFloorPopup();
        openModal();
    };

    useEffect(() => {
        if (selectedFloorObj?.floor_id) setFloorName(selectedFloorObj?.floor_name);
    }, [selectedFloorObj]);

    return (
        <>
            <Modal show={isModalOpen} backdrop="static" keyboard={false} size="md" centered>
                <div className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>
                        {operationType === `ADD` ? `Add Floor` : `Edit Floor`}
                    </Typography.Header>

                    <Brick sizeInRem={2} />

                    <div>
                        <Typography.Body size={Typography.Sizes.md}>{`Name`}</Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <InputTooltip
                            placeholder="Enter Name"
                            labelSize={Typography.Sizes.md}
                            value={floorName}
                            onChange={(e) => {
                                setFloorName(e.target.value);
                                setFloorNameError(null);
                            }}
                            error={floorNameError}
                        />
                    </div>

                    <Brick sizeInRem={1.25} />

                    <div>
                        <Typography.Body size={Typography.Sizes.md}>{`Type`}</Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <InputTooltip
                            placeholder="Enter Name"
                            labelSize={Typography.Sizes.md}
                            disabled={true}
                            value={`Floor`}
                        />
                        <Brick sizeInRem={0.25} />
                        <Typography.Body size={Typography.Sizes.sm}>
                            {`Only floors can be at the building root`}
                        </Typography.Body>
                    </div>

                    {operationType === 'ADD' && <Brick sizeInRem={1.5} />}

                    {operationType === 'EDIT' && (
                        <>
                            <Brick sizeInRem={1.25} />
                            <Button
                                label="Delete Floor"
                                size={Button.Sizes.md}
                                type={Button.Type.secondaryDistructive}
                                icon={<DeleteSVG />}
                                onClick={() => {
                                    closeModal();
                                    openDeleteFloorPopup();
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
                                setFloorName('');
                                setFloorNameError(null);
                            }}
                        />
                        {operationType === 'ADD' ? (
                            <Button
                                label={isProcessing ? `Saving...` : `Save`}
                                size={Button.Sizes.lg}
                                type={Button.Type.primary}
                                className="w-100"
                                onClick={() => {
                                    handleCreateFloor(floorName, bldgId);
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
                                    handleEditFloor(floorName, bldgId, selectedFloorObj);
                                }}
                                disabled={isProcessing || selectedFloorObj?.floor_name === floorName}
                            />
                        )}
                    </div>
                    <Brick sizeInRem={0.25} />
                </div>
            </Modal>

            <DeleteLayout
                isModalOpen={showDeleteFloor}
                onCancel={handleDeleteModalClose}
                onSave={handleDeleteFloor}
                deleteType="FLOOR"
                isDeleting={isProcessing}
            />
        </>
    );
};

export default FloorLayout;
