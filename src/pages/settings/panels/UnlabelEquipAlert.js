import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';

const UnlabelEquipAlert = ({
    showUnlabeledAlert,
    closeUnlabelAlertModal,
    saveBreakersDetails,
    openBreakerConfigModal,
}) => {
    return (
        <>
            <Modal
                show={showUnlabeledAlert}
                onHide={closeUnlabelAlertModal}
                centered
                backdrop="static"
                keyboard={false}>
                <Modal.Body className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>Unlabeled Breaker Alert</Typography.Header>
                    <Brick sizeInRem={1.5} />
                    <Typography.Body size={Typography.Sizes.lg}>
                        {`Equipment with Unlabeled found in Database, would you like to rename the Unlabeled equipment?`}
                    </Typography.Body>
                </Modal.Body>
                <Modal.Footer className="pb-4 pr-4">
                    <Button
                        label="Yes"
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        onClick={() => {
                            closeUnlabelAlertModal();
                            openBreakerConfigModal();
                            saveBreakersDetails('forceUpdate');
                        }}
                    />
                    <Button
                        label="No"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={() => {
                            closeUnlabelAlertModal();
                            openBreakerConfigModal();
                            saveBreakersDetails('forceUpdate');
                        }}
                    />
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default UnlabelEquipAlert;
