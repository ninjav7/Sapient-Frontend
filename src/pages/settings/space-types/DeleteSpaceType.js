import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import { deleteSpaceTypeData } from './services';
import { UserStore } from '../../../store/UserStore';

const DeleteSpaceType = ({
    isDeleteSpaceTypeModalOpen,
    closeDeleteSpaceTypeModal,
    fetchSpaceTypeData,
    selectedSpaceType,
    search,
}) => {
    const [isDeleting, setIsDeleting] = useState(false);
    const [spaceTypeId, setSpaceTypeId] = useState('');

    const handleSpaceTypeDelete = async () => {
        setIsDeleting(true);
        const params = `/${spaceTypeId}`;

        await deleteSpaceTypeData(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message;
                        s.notificationType = 'success';
                    });
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message
                            ? response?.message
                            : res
                            ? 'Unable to Delete Space Type.'
                            : 'Unable to delete Space Type due to Internal Server Error!.';
                        s.notificationType = 'error';
                    });
                }
                setIsDeleting(false);
                closeDeleteSpaceTypeModal();
                setSpaceTypeId('');
                fetchSpaceTypeData(search);
            })
            .catch((error) => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Internal Server Error! Unable to delete record.';
                    s.notificationType = 'error';
                });
                setIsDeleting(false);
            });
    };

    const handleDeleteAlertClose = () => {
        closeDeleteSpaceTypeModal();
    };

    useEffect(() => {
        if (isDeleteSpaceTypeModalOpen) {
            setSpaceTypeId(selectedSpaceType?.id);
        } else {
            setSpaceTypeId('');
        }
    }, [isDeleteSpaceTypeModalOpen]);

    return (
        <Modal
            show={isDeleteSpaceTypeModalOpen}
            onHide={closeDeleteSpaceTypeModal}
            centered
            backdrop="static"
            keyboard={false}>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{`Delete Space Type`}</Typography.Header>
                <Brick sizeInRem={1.5} />
                <Typography.Body size={Typography.Sizes.lg}>
                    {`Are you sure you want to delete the Space Type?`}
                </Typography.Body>
            </Modal.Body>
            <Modal.Footer className="pb-4 pr-4">
                <Button
                    label="Cancel"
                    size={Button.Sizes.lg}
                    type={Button.Type.secondaryGrey}
                    onClick={handleDeleteAlertClose}
                />
                <Button
                    label={isDeleting ? 'Deleting' : 'Delete'}
                    size={Button.Sizes.lg}
                    type={Button.Type.primaryDistructive}
                    disabled={isDeleting}
                    onClick={handleSpaceTypeDelete}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteSpaceType;
