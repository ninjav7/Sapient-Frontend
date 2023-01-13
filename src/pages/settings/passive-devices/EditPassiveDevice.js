import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { updatePassiveDeviceData } from './services';
import { isInputLetterOrNumber } from '../../../helpers/helpers';

const EditPassiveDevice = ({ isEditDeviceModalOpen, closeEditDeviceModal, passiveDeviceData, fetchPassiveDevice }) => {
    const defaultDeviceObj = {
        identifier: '',
        model: '',
    };

    const [passiveDeviceObj, setPassiveDeviceObj] = useState(defaultDeviceObj);
    const [previousIdentifier, setPreviousIdentifier] = useState('');

    const [isProcessing, setIsProcessing] = useState(false);
    const [formValidation, setFormValidation] = useState(false);
    const [identifierAlert, setIdentifierAlert] = useState(null);

    const handleChange = (key, value) => {
        if (key === 'identifier' && value.length > 16) {
            return;
        }
        let obj = Object.assign({}, passiveDeviceObj);
        obj[key] = value;
        setPassiveDeviceObj(obj);
    };

    const updateDeviceDetails = async () => {
        setIsProcessing(true);
        const params = `?device_id=${passiveDeviceObj?.equipments_id}`;
        const dataToUpdate = {
            mac_address: passiveDeviceObj?.identifier,
        };
        await updatePassiveDeviceData(params, dataToUpdate)
            .then((res) => {
                closeEditDeviceModal();
                setPassiveDeviceObj(defaultDeviceObj);
                setIsProcessing(false);
                fetchPassiveDevice();
            })
            .catch(() => {
                setIsProcessing(false);
            });
    };

    useEffect(() => {
        if (passiveDeviceObj?.identifier?.length === 16 && passiveDeviceObj?.identifier !== previousIdentifier) {
            setFormValidation(true);
        } else {
            setFormValidation(false);
        }
        if (isInputLetterOrNumber(passiveDeviceObj?.identifier) || passiveDeviceObj?.identifier === '') {
            setIdentifierAlert(null);
        } else {
            setIdentifierAlert('Please Enter only Letters and Numbers.');
        }
    }, [passiveDeviceObj, previousIdentifier]);

    useEffect(() => {
        if (!isEditDeviceModalOpen) {
            return;
        }
        let obj = {
            identifier: passiveDeviceData?.identifier,
            model: passiveDeviceData?.model,
            equipments_id: passiveDeviceData?.equipments_id,
        };
        setPassiveDeviceObj(obj);
        setPreviousIdentifier(passiveDeviceData?.identifier);
    }, [isEditDeviceModalOpen]);

    return (
        <Modal show={isEditDeviceModalOpen} onHide={closeEditDeviceModal} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Update Smart Meter</Typography.Header>

                <Brick sizeInRem={2} />

                <InputTooltip
                    label="Identifier"
                    placeholder="Enter Identifier"
                    onChange={(e) => {
                        handleChange('identifier', e.target.value.trim().toUpperCase());
                    }}
                    error={identifierAlert}
                    labelSize={Typography.Sizes.md}
                    value={passiveDeviceObj?.identifier}
                    defaultValue={passiveDeviceObj?.identifier}
                />

                <Brick sizeInRem={1.5} />

                <InputTooltip
                    label="Model"
                    labelSize={Typography.Sizes.md}
                    placeholder="Enter Identifier"
                    value={passiveDeviceObj?.model === 'hydra' ? 'Hydra' : 'Trident'}
                    disabled
                />

                <Brick sizeInRem={2.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={() => {
                            setPassiveDeviceObj(defaultDeviceObj);
                            closeEditDeviceModal();
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Updating...' : 'Update'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={!formValidation || isProcessing || identifierAlert !== null}
                        onClick={() => {
                            updateDeviceDetails();
                        }}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default EditPassiveDevice;
