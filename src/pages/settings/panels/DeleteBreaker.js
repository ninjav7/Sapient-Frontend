import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';

const DeleteBreaker = ({
    showDeleteAlert,
    handleDeleteAlertClose,
    handleEditBreakerShow,
    isDeleting,
    deleteCurrentBreaker,
    breakersId,
    setBreakerUpdateId,
}) => {
    return (
        <Modal show={showDeleteAlert} onHide={handleDeleteAlertClose} centered backdrop="static" keyboard={false}>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Delete Breaker</Typography.Header>
                <Brick sizeInRem={1.5} />
                <Typography.Body size={Typography.Sizes.lg}>
                    Are you sure you want to delete the Breaker?
                </Typography.Body>
                <Typography.Body size={Typography.Sizes.lg}>
                    This will remove the breaker from the panel and is not recoverable.
                </Typography.Body>
            </Modal.Body>
            <Modal.Footer className="pb-4 pr-4">
                <Button
                    label="Cancel"
                    size={Button.Sizes.lg}
                    type={Button.Type.secondaryGrey}
                    onClick={() => {
                        handleDeleteAlertClose();
                        handleEditBreakerShow();
                    }}
                />
                <Button
                    label={isDeleting ? 'Deleting...' : 'Delete'}
                    size={Button.Sizes.lg}
                    type={Button.Type.primaryDistructive}
                    disabled={isDeleting}
                    onClick={() => {
                        if (breakersId.length !== 0) setBreakerUpdateId(breakersId[0]);
                        deleteCurrentBreaker(breakersId);
                    }}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteBreaker;
