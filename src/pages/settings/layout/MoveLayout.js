import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';

const MoveLayout = (props) => {
    const { isModalOpen = false, onCancel, onSave, oldStack, newStack } = props;
    const [formattedOldValue, setFormattedOldValue] = useState('');
    const [formattedNewValue, setFormattedNewValue] = useState('');

    const formatStack = (stack) => {
        let res = '';
        let isFirst = true;

        for (let parentKey in stack) {
            const parent = stack[parentKey];

            if (isFirst) {
                isFirst = false;
                continue;
            } else {
                if (res.length) {
                    res += '==>' + parent.currentItem.name;
                } else {
                    res += parent.currentItem.name;
                }
            }
        }

        return res;
    };

    const handleGenerateDiff = (oldStack, newStack) => {
        const formattedOldStack = formatStack(oldStack);
        const formattedNewStack = formatStack(newStack);

        setFormattedOldValue(formattedOldStack);
        setFormattedNewValue(formattedNewStack);
    };

    useEffect(() => {
        oldStack && newStack && handleGenerateDiff(oldStack, newStack);
    }, [oldStack, newStack]);

    return (
        <Modal show={isModalOpen} backdrop="static" keyboard={false} size="md" centered>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Change Parents</Typography.Header>

                <Brick sizeInRem={1.5} />

                <Typography.Body size={Typography.Sizes.md}>
                    Do you really want to move space from {formattedOldValue} to {formattedNewValue}
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
                    label="Update"
                    size={Button.Sizes.lg}
                    type={Button.Type.primaryDistructive}
                    className="w-100"
                    onClick={onSave}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default MoveLayout;
