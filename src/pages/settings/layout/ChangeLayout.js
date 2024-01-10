import React from 'react';
import Modal from 'react-bootstrap/Modal';

import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';

const ChangeLayout = (props) => {
    const { isModalOpen = false, onCancel, onSave, isUpdating } = props;

    return (
        <Modal show={isModalOpen} backdrop="static" keyboard={false} size="md" centered>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Change Parents</Typography.Header>

                <Brick sizeInRem={1.5} />

                <Typography.Body size={Typography.Sizes.md}>
                    Moving this space will move all child spaces linked to this space.
                </Typography.Body>
            </Modal.Body>

            <Modal.Footer className="pb-4 pr-4">
                <Button
                    label={`Cancel`}
                    size={Button.Sizes.lg}
                    type={Button.Type.secondaryGrey}
                    className="w-100"
                    onClick={onCancel}
                />
                <Button
                    label={isUpdating ? `Updating` : `Update`}
                    size={Button.Sizes.lg}
                    type={Button.Type.primaryDistructive}
                    className="w-100"
                    onClick={onSave}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default ChangeLayout;
