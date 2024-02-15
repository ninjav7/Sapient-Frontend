import React from 'react';
import _ from 'lodash';
import Modal from 'react-bootstrap/Modal';

import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import { defaultAlertObj } from '../constants';

const ResetTargetTypeAlert = ({ isModalOpen, handleModalClose, alertObj, setAlertObj }) => {
    const handleResetTargetType = () => {
        const deepCloneNewAlertObj = _.cloneDeep(defaultAlertObj);
        setAlertObj({
            ...deepCloneNewAlertObj,
            alert_name: alertObj?.alert_name,
            alert_description: alertObj?.alert_description,
        });
        handleModalClose();
    };

    return (
        <Modal show={isModalOpen} onHide={handleModalClose} centered backdrop="static" keyboard={false}>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Reset Target Type</Typography.Header>
                <Brick sizeInRem={1.5} />
                <Typography.Body size={Typography.Sizes.lg}>
                    Are you sure you want to reset Target Type?
                </Typography.Body>
            </Modal.Body>
            <Modal.Footer className="pb-4 pr-4">
                <Button
                    label="Cancel"
                    size={Button.Sizes.lg}
                    type={Button.Type.secondaryGrey}
                    onClick={handleModalClose}
                />
                <Button
                    label={'Reset'}
                    size={Button.Sizes.lg}
                    type={Button.Type.primary}
                    onClick={handleResetTargetType}
                />
            </Modal.Footer>
        </Modal>
    );
};

export default ResetTargetTypeAlert;
