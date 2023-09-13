import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import './styles.scss';

const DeleteModal = (props) => {
    const { showModal, closeModal, onDeleteClick, onDeleting } = props;

    return (
        <Modal show={showModal} onHide={closeModal} centered backdrop="static" keyboard={false}>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Delete Utility Monitor</Typography.Header>
                <Brick sizeInRem={1.5} />
                <Typography.Body size={Typography.Sizes.lg}>
                    Are you sure you want to delete the Utility Monitor?
                </Typography.Body>
            </Modal.Body>
            <Modal.Footer className="pb-4 pr-4">
                <Button label="Cancel" size={Button.Sizes.lg} type={Button.Type.secondaryGrey} onClick={closeModal} />
                <Button
                    label={onDeleting ? 'Deleting' : 'Delete'}
                    size={Button.Sizes.lg}
                    type={Button.Type.primaryDistructive}
                    disabled={onDeleting}
                    onClick={onDeleteClick}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;
