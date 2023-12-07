import React from 'react';
import Modal from 'react-bootstrap/Modal';

const ViewSensorData = (props) => {
    const { isModalOpen, closeModal, selectedPassiveDevice } = props;

    return (
        <Modal show={isModalOpen} onHide={closeModal} size="md" centered>
            <div style={{ padding: '2rem' }}>
                <h2>Sensor Modal</h2>
            </div>
        </Modal>
    );
};

export default ViewSensorData;
