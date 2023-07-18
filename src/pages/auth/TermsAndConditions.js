import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { TermsAndConditionDescription } from './utils';
import Typography from '../../sharedComponents/typography';
import Button from '../../sharedComponents/button/Button';

const TermsAndConditions = (props) => {
    const { showModal, closeModal, handleAcceptClick } = props;

    return (
        <React.Fragment>
            <Modal show={showModal} onHide={closeModal} size="lg" centered backdrop="static" keyboard={false}>
                <Modal.Header style={{ padding: '1.5rem' }}>
                    <Typography.Header size={Typography.Sizes.lg}>Accept Terms and Condition</Typography.Header>
                </Modal.Header>
                <Modal.Body style={{ padding: '1.5rem' }}>
                    <Typography.Body size={Typography.Sizes.md}>{`${TermsAndConditionDescription}`}</Typography.Body>
                </Modal.Body>
                <Modal.Footer style={{ display: 'flex', justifyContent: 'center', padding: '1.5rem' }}>
                    <Button
                        label="Accept"
                        size={Button.Sizes.md}
                        type={Button.Type.primary}
                        className="btn-width"
                        onClick={handleAcceptClick}
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
