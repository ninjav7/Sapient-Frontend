import React from 'react';
import Modal from 'react-bootstrap/Modal';

import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';

const ExploreAlert = (props) => {
    const { isModalOpen = false, onCancel, title = '', message = '' } = props;

    return (
        <Modal show={isModalOpen} onHide={onCancel} centered backdrop="static" keyboard={false}>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{title}</Typography.Header>
                <Brick sizeInRem={1.5} />
                <Typography.Body size={Typography.Sizes.lg}>{message}</Typography.Body>
            </Modal.Body>
            <Modal.Footer className="pb-4 pr-4">
                <Button
                    label="Cancel"
                    size={Button.Sizes.lg}
                    type={Button.Type.primaryDistructive}
                    onClick={onCancel}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default ExploreAlert;
