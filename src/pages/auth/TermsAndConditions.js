import React from 'react';
import Modal from 'react-bootstrap/Modal';
import { TermsAndConditionDescription } from './utils';
import Typography from '../../sharedComponents/typography';
import Brick from '../../sharedComponents/brick';

const TermsAndConditions = (props) => {
    const { showModal, handleModalClose } = props;

    return (
        <React.Fragment>
            <Modal show={showModal} onHide={handleModalClose} size="lg" centered backdrop="static" keyboard={false}>
                <div className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>Terms and Condition</Typography.Header>
                    <Brick sizeInRem={2} />
                    <Typography.Body size={Typography.Sizes.md}>{`${TermsAndConditionDescription}`}</Typography.Body>
                </div>
            </Modal>
        </React.Fragment>
    );
};

export default TermsAndConditions;
