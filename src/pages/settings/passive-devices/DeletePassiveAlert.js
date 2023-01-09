import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import { deletePassiveDeviceData } from './services';

const DeletePassiveAlert = ({
    isDeleteDeviceModalOpen,
    closeDeleteDeviceModal,
    selectedPassiveDevice,
    nextActionAfterDeletion,
}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [deviceId, setDeviceId] = useState('');

    const deletePassiveDevice = async () => {
        setIsProcessing(true);
        let params = `?device_id=${deviceId}`;
        await deletePassiveDeviceData(params)
            .then((res) => {
                closeDeleteDeviceModal();
                setDeviceId('');
                console.log('SSR Deletion Successful!');
                nextActionAfterDeletion();
                setIsProcessing(false);
            })
            .catch(() => {
                setIsProcessing(false);
            });
    };

    useEffect(() => {
        if (isDeleteDeviceModalOpen) setDeviceId(selectedPassiveDevice?.equipments_id);
    }, [isDeleteDeviceModalOpen]);

    return (
        <Modal
            show={isDeleteDeviceModalOpen}
            onHide={closeDeleteDeviceModal}
            centered
            backdrop="static"
            keyboard={false}>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Delete Passive Device</Typography.Header>
                <Brick sizeInRem={1.5} />
                <Typography.Body size={Typography.Sizes.lg}>
                    Are you sure you want to delete the Passive Device?
                </Typography.Body>
            </Modal.Body>
            <Modal.Footer className="pb-4 pr-4">
                <Button
                    label="Cancel"
                    size={Button.Sizes.lg}
                    type={Button.Type.secondaryGrey}
                    onClick={closeDeleteDeviceModal}
                />
                <Button
                    label={isProcessing ? 'Deleting' : 'Delete'}
                    size={Button.Sizes.lg}
                    type={Button.Type.primaryDistructive}
                    disabled={isProcessing}
                    onClick={() => {
                        deletePassiveDevice();
                    }}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default DeletePassiveAlert;
