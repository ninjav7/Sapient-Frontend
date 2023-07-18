import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../sharedComponents/typography';
import Button from '../../sharedComponents/button/Button';
import {
    TermsAndConditionDescription1,
    TermsAndConditionDescription2,
    TermsAndConditionDescription3,
    TermsAndConditionDescription4,
    TermsAndConditionDescription5,
} from './utils';
import Brick from '../../sharedComponents/brick';

const TermsAndConditions = (props) => {
    const { showModal, closeModal, handleAcceptClick } = props;
    const [isScrolledToBottom, setIsScrolledToBottom] = useState(false);
    const modalBodyRef = useRef(null);

    const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = modalBodyRef.current;
        const isBottom = scrollTop + clientHeight >= scrollHeight;
        setIsScrolledToBottom(isBottom);
    };

    const acceptButtonDisabled = !isScrolledToBottom;

    useEffect(() => {
        if (!showModal) setIsScrolledToBottom(false);
    }, [showModal]);

    return (
        <React.Fragment>
            <Modal show={showModal} onHide={closeModal} size="lg" centered backdrop="static" keyboard={false}>
                <Modal.Header style={{ padding: '1.5rem' }}>
                    <Typography.Header size={Typography.Sizes.lg}>Accept Terms and Conditions</Typography.Header>
                </Modal.Header>
                <Modal.Body
                    style={{ padding: '1.5rem', maxHeight: '20rem', overflowY: 'auto' }}
                    ref={modalBodyRef}
                    onScroll={handleScroll}>
                    <Typography.Body size={Typography.Sizes.md}>{`${TermsAndConditionDescription1}`}</Typography.Body>
                    <Brick sizeInRem={1} />
                    <Typography.Body size={Typography.Sizes.md}>{`${TermsAndConditionDescription2}`}</Typography.Body>
                    <Brick sizeInRem={1} />
                    <Typography.Body size={Typography.Sizes.md}>{`${TermsAndConditionDescription3}`}</Typography.Body>
                    <Brick sizeInRem={1} />
                    <Typography.Body size={Typography.Sizes.md}>{`${TermsAndConditionDescription4}`}</Typography.Body>
                    <Brick sizeInRem={1} />
                    <Typography.Body size={Typography.Sizes.md}>{`${TermsAndConditionDescription5}`}</Typography.Body>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem' }}>
                    <Button
                        label="Accept"
                        size={Button.Sizes.md}
                        type={Button.Type.primary}
                        className="btn-width"
                        onClick={handleAcceptClick}
                        disabled={acceptButtonDisabled}
                    />
                    <Button
                        label="Decline"
                        size={Button.Sizes.md}
                        type={Button.Type.light}
                        className="btn-width"
                        onClick={closeModal}
                    />
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
};

export default TermsAndConditions;
