import React from 'react';
import Modal from 'react-bootstrap/Modal';

import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';

const DeleteBldg = (props) => {
    const { isModalOpen = false, onCancel, onSave } = props;

    return (
        <Modal show={isModalOpen} onHide={onCancel} centered backdrop="static" keyboard={false}>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{`Delete Building`}</Typography.Header>
                <Brick sizeInRem={1.5} />
                <Typography.Body size={Typography.Sizes.lg}>
                    {`Are you sure you want to delete this Building?`}
                </Typography.Body>
            </Modal.Body>
            <Modal.Footer className="pb-4 pr-4">
                <Button label="Cancel" size={Button.Sizes.lg} type={Button.Type.secondaryGrey} onClick={onCancel} />
                <Button
                    label={'Delete'}
                    size={Button.Sizes.lg}
                    type={Button.Type.primaryDistructive}
                    onClick={onSave}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteBldg;
