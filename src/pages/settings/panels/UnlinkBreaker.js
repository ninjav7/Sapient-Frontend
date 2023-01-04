import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';

const UnlinkBreaker = ({
    showUnlinkAlert,
    handleUnlinkAlertClose,
    handleEditBreakerShow,
    isResetting,
    unLinkCurrentBreaker,
}) => {
    return (
        <Modal show={showUnlinkAlert} onHide={handleUnlinkAlertClose} centered backdrop="static" keyboard={false}>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Reset Configuration</Typography.Header>
                <Brick sizeInRem={1.5} />
                <Typography.Body size={Typography.Sizes.lg}>
                    Are you sure you want to reset the configuration of this breaker?
                </Typography.Body>
                <Typography.Body size={Typography.Sizes.lg}>
                    All links to equipment and sensors will be lost.
                </Typography.Body>
            </Modal.Body>

            <Modal.Footer className="pb-4 pr-4">
                <Button
                    label="Cancel"
                    size={Button.Sizes.lg}
                    type={Button.Type.secondaryGrey}
                    onClick={() => {
                        handleUnlinkAlertClose();
                        handleEditBreakerShow();
                    }}
                />
                <Button
                    label={isResetting ? 'Resetting...' : 'Reset'}
                    size={Button.Sizes.lg}
                    type={Button.Type.primaryDistructive}
                    disabled={isResetting}
                    onClick={unLinkCurrentBreaker}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default UnlinkBreaker;
