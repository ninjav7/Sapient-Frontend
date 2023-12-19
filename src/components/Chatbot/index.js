import React from 'react';
import Modal from 'react-bootstrap/Modal';

import Typography from '../../sharedComponents/typography';
import { Button } from '../../sharedComponents/button';

const ChatBotModal = ({ isModalOpen, closeModal }) => {
    return (
        <Modal show={isModalOpen} onHide={closeModal} backdrop="static" keyboard={false} centered>
            <Modal.Header className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Chatbot Modal</Typography.Header>
            </Modal.Header>

            <Modal.Body className="p-4" style={{ height: '30vh' }}>
                {/* Chatbot Modal Body */}
                <div>Chatbot Body</div>
            </Modal.Body>

            <Modal.Footer className="p-4">
                <Button
                    label="Close"
                    size={Button.Sizes.lg}
                    type={Button.Type.secondaryGrey}
                    className="w-100"
                    onClick={closeModal}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default ChatBotModal;
