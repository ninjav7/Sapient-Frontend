import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from '../../../sharedComponents/button/Button';
import TermsAndConditionContent from './TermsAndConditionContent';
import Tooltip from 'react-bootstrap/Tooltip';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';

import { ReactComponent as DownArrowSVG } from '../../../assets/icon/terms-service/down-arrow.svg';
import './styles.scss';

const TermsAndConditions = (props) => {
    const { showModal, closeModal, handleAccept, handleDecline } = props;

    const modalBodyRef = useRef(null);
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const acceptButtonDisabled = !isScrolledToBottom;

    const handleScroll = () => {
        const modalBody = modalBodyRef.current;

        const scrollPosition = Math.round(modalBody?.scrollTop);
        const contentHeight = Math.round(modalBody?.scrollHeight);
        const clientHeight = Math.round(modalBody?.clientHeight);

        const isBottom = scrollPosition + clientHeight >= contentHeight;
        setIsScrolledToBottom(isBottom);
    };

    const scrollToBottom = () => {
        const modalBody = modalBodyRef.current;
        if (modalBody) {
            modalBody.scrollTop = modalBody.scrollHeight;
        }
    };

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
                <div className="modal-content-container">
                    <Modal.Body className="terms-service-modal" ref={modalBodyRef} onScroll={handleScroll}>
                        <TermsAndConditionContent />
                    </Modal.Body>

                    {!isScrolledToBottom && (
                        <OverlayTrigger
                            placement="left"
                            overlay={
                                <Tooltip id="scrollToBottomTooltip">{`Scroll down to bottom of terms of service.`}</Tooltip>
                            }>
                            <div className="circle-container mouse-pointer" onClick={scrollToBottom}>
                                <DownArrowSVG className="circle-icon" />
                            </div>
                        </OverlayTrigger>
                    )}
                </div>

                <Modal.Footer className="terms-service-footer">
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
