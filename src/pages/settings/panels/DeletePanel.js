import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';
import '../style.css';

const DeletePanel = ({ isDeleting, showDeletePanelAlert, handleDeletePanelAlertClose, deletePanel }) => {
    return (
        <>
            <Modal
                show={showDeletePanelAlert}
                onHide={handleDeletePanelAlertClose}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Body className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>Delete Panel</Typography.Header>
                    <Brick sizeInRem={1.5} />
                    <Typography.Body size={Typography.Sizes.lg}>
                        Are you sure you want to delete the Panel and the Panel Inputs it contains?
                    </Typography.Body>
                </Modal.Body>
                <Modal.Footer className="pb-4 pr-4">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={handleDeletePanelAlertClose}
                    />
                    <Button
                        label={isDeleting ? 'Deleting' : 'Delete'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primaryDistructive}
                        disabled={isDeleting}
                        onClick={deletePanel}
                    />
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default DeletePanel;
