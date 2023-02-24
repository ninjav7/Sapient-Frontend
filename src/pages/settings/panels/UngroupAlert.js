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
                <Brick sizeInRem={2.5} />
                <Button
                    label="OK"
                    size={Button.Sizes.lg}
                    type={Button.Type.primary}
                    onClick={() => {
                        handleUngroupAlertClose();
                        setAlertMessage('');
                    }}
                    className="w-100 justify-content-center align-items-center"
                />
            </Modal.Body>
        </Modal>
    );
};

export default UngroupAlert;
