import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';

const ReassignAlert = ({
    showReassignAlert,
    closeReassignAlert,
    currentEquipObj,
    newEquipObj,
    saveBreakersDetails,
    openBreakerConfigModal,
}) => {
    return (
        <Modal show={showReassignAlert} onHide={closeReassignAlert} centered backdrop="static" keyboard={false}>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Re-assign Existing Data?</Typography.Header>
                <Brick sizeInRem={2} />
                <Typography.Body size={Typography.Sizes.lg}>
                    {`Would you like the data already recorded as “${currentEquipObj?.name}” associated with
                    “${newEquipObj?.name}”?`}
                </Typography.Body>
                <Brick sizeInRem={1.25} />
                <Typography.Body size={Typography.Sizes.lg}>
                    {`If you re-assign records, “${currentEquipObj?.name}” will be updated to “${newEquipObj?.name}” in all
                    historical data, and the duplicate “${currentEquipObj?.name}” will be removed.`}
                </Typography.Body>
                <Brick sizeInRem={1.25} />
                <Typography.Body size={Typography.Sizes.lg}>
                    {`If you do not re-assign records, “${currentEquipObj?.name}” will retain historical data, and “${newEquipObj?.name}” will record data from now
                    forward.`}
                </Typography.Body>
                <Brick sizeInRem={2.5} />
                <div className="d-flex justify-content-between">
                    <Button
                        label={`No - Don’t Re-assign`}
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={() => {
                            closeReassignAlert();
                            openBreakerConfigModal();
                            saveBreakersDetails();
                        }}
                        className="w-100"
                    />
                    <Button
                        label={`Yes - Re-assign`}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        onClick={() => {
                            closeReassignAlert();
                            openBreakerConfigModal();
                            saveBreakersDetails('forceSave');
                        }}
                        className="w-100"
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ReassignAlert;
