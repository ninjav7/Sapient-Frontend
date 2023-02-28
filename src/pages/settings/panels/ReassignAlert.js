import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';

const ReassignAlert = ({
    showReassignAlert,
    closeReassignAlert,
    setForceSave,
    unlabeledEquipObj,
    setUnlabeledEquipObj,
}) => {
    return (
        <Modal show={showReassignAlert} onHide={closeReassignAlert} centered backdrop="static" keyboard={false}>
            <Modal.Body className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Re-assign Existing Data?</Typography.Header>
                <Brick sizeInRem={2} />
                <Typography.Body size={Typography.Sizes.lg}>
                    {`Would you like the data from <${unlabeledEquipObj?.name}> associated with with this equipment?`}
                </Typography.Body>
                <Brick sizeInRem={1} />
                <Typography.Body size={Typography.Sizes.lg}>
                    {`Historical data can be found under <${unlabeledEquipObj?.name}> if you choose not to reassign.`}
                </Typography.Body>
                <Brick sizeInRem={2.5} />
                <div className="d-flex justify-content-between">
                    <Button
                        label="No - Start Fresh"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        onClick={() => {
                            closeReassignAlert();
                            setUnlabeledEquipObj({});
                        }}
                        className="w-100 button-size"
                    />
                    <Button
                        label="Yes - Re-assign"
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        onClick={() => {
                            setForceSave(true);
                            closeReassignAlert();
                        }}
                        className="w-100"
                    />
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ReassignAlert;
