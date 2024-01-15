import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';

const MoveLayout = (props) => {
    const { isModalOpen = false, onCancel, onSave, oldPath, newPath, name } = props;

    return (
        <Modal show={isModalOpen} backdrop="static" keyboard={false} size="md" centered>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Change Location</Typography.Header>

                <Brick sizeInRem={1.5} />

                <Typography.Body size={Typography.Sizes.md}>
                    Are you sure you want to move <b style={{ fontWeight: 700 }}>{name}</b> from{' '}
                    <b style={{ fontWeight: 700 }}>{oldPath}</b> to <b style={{ fontWeight: 700 }}>{newPath}</b>?
                    <br />
                    All child spaces of <b style={{ fontWeight: 700 }}>{name}</b> will also be moved.
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
                    label="Confirm"
                    size={Button.Sizes.lg}
                    type={Button.Type.primary}
                    className="w-100"
                    onClick={onSave}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default MoveLayout;
