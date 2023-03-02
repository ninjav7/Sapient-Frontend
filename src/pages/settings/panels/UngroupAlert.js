import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';
import { Notification } from '../../../sharedComponents/notification/Notification';

const UngroupAlert = ({
    showUngroupAlert,
    handleUngroupAlertClose,
    alertMessage = 'Unable to group Breakers.',
    setAlertMessage,
    additionalMessage,
    setAdditionalMessage,
}) => {
    return (
        <Modal show={showUngroupAlert} onHide={handleUngroupAlertClose} centered backdrop="static" keyboard={false}>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Unable to Group</Typography.Header>
                <Brick sizeInRem={2} />
                <Notification
                    type={Notification.Types.error}
                    component={Notification.ComponentTypes.alert}
                    title={alertMessage}
                    isShownCloseBtn={false}
                />

                {additionalMessage && (
                    <>
                        <Brick sizeInRem={1.5} />
                        <Typography.Body size={Typography.Sizes.lg}>
                            Please reset the configuration of at least one of the breakers to group these two breakers
                            together.
                        </Typography.Body>
                    </>
                )}

                <Brick sizeInRem={additionalMessage ? 2 : 2.5} />
                <Button
                    label="OK"
                    size={Button.Sizes.lg}
                    type={Button.Type.primary}
                    onClick={() => {
                        handleUngroupAlertClose();
                        setAlertMessage('');
                        setAdditionalMessage(false);
                    }}
                    className="w-100 justify-content-center align-items-center"
                />
            </Modal.Body>
        </Modal>
    );
};

export default UngroupAlert;
