import React from 'react';
import { Spinner } from 'reactstrap';
import Modal from 'react-bootstrap/Modal';

const ViewSensorData = (props) => {
    const { isModalOpen, closeModal } = props;

    return (
        <Modal show={isModalOpen} onHide={closeModal} backdrop="static" keyboard={false} size="sm" centered>
            <h2>Sensor Modal</h2>
        </Modal>
    );
};

export default ViewSensorData;
