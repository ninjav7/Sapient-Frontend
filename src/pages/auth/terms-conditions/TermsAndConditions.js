import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import TermsAndConditionContent from './TermsAndConditionContent';

const TermsAndConditions = (props) => {
    const { showModal, closeModal, handleAccept, handleDecline } = props;
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const modalBodyRef = useRef(null);

    const handleScroll = () => {
        const modalBody = modalBodyRef.current;

        const scrollPosition = Math.round(modalBody?.scrollTop);
        const contentHeight = Math.round(modalBody?.scrollHeight);
        const clientHeight = Math.round(modalBody?.clientHeight);

        const isBottom = scrollPosition + clientHeight >= contentHeight;
        setIsScrolledToBottom(isBottom);
    };

    const acceptButtonDisabled = !isScrolledToBottom;

    useEffect(() => {
        if (!showModal) setIsScrolledToBottom(false);
    }, [showModal]);

    useEffect(() => {
        const handleResize = () => handleScroll();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <React.Fragment>
            <Modal show={showModal} onHide={closeModal} size="xl" centered backdrop="static" keyboard={false}>
                <Modal.Header style={{ padding: '1.5rem' }}>
                    <Typography.Header size={Typography.Sizes.lg}>Accept Terms and Conditions</Typography.Header>
                </Modal.Header>
                <Modal.Body
                    style={{
                        padding: '2.5rem',
                        maxHeight: '30rem',
                        overflowY: 'auto',
                        paddingTop: '1.5rem',
                    }}
                    ref={modalBodyRef}
                    onScroll={handleScroll}>
                    <TermsAndConditionContent />
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem' }}>
                    <Button
                        label="Acknowledge"
                        size={Button.Sizes.md}
                        type={Button.Type.primary}
                        className="btn-width"
                        onClick={handleAccept}
                        disabled={acceptButtonDisabled}
                    />
                    <Button
                        label="Decline"
                        size={Button.Sizes.md}
                        type={Button.Type.light}
                        className="btn-width"
                        onClick={handleDecline}
                    />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default TermsAndConditions;
