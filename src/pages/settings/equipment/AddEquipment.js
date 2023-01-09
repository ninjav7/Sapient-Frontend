import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useHistory } from 'react-router-dom';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { BuildingStore } from '../../../store/BuildingStore';
import Select from '../../../sharedComponents/form/select';
import { addNewEquipment } from '../../../services/equipment';

const AddEquipment = ({
    isAddEquipModalOpen,
    closeModal,
    equipmentTypeDataAll,
    endUseDataNow,
    locationDataNow,
    bldgId,
    fetchEquipmentData,
    isProcessing,
    setIsProcessing,
}) => {
    const defaultEquipmentObj = {
        name: '',
        equipment_type: '',
        end_use: '',
        space_id: '',
    };

    const [equipmentObj, setEquipmentObj] = useState(defaultEquipmentObj);
    const [formValidation, setFormValidation] = useState(false);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, equipmentObj);
        obj[key] = value;
        setEquipmentObj(obj);
    };

    const saveDeviceData = async () => {
        setIsProcessing(true);
        await addNewEquipment(bldgId, equipmentObj)
            .then((res) => {
                fetchEquipmentData();
                closeModal();
                setIsProcessing(false);
            })
            .catch((error) => {
                setIsProcessing(false);
            });
    };

    useEffect(() => {
        if (
            equipmentObj?.name.length > 0 &&
            equipmentObj?.equipment_type.length > 0 &&
            equipmentObj?.end_use.length > 0
        ) {
            setFormValidation(true);
        } else {
            setFormValidation(false);
        }
    }, [equipmentObj]);

    useEffect(() => {
        if (isAddEquipModalOpen) {
            setEquipmentObj(defaultEquipmentObj);
        }
    }, [isAddEquipModalOpen]);

    return (
        <Modal show={isAddEquipModalOpen} onHide={closeModal} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Add Equipment</Typography.Header>

                <Brick sizeInRem={2} />

                <InputTooltip
                    label="Name"
                    placeholder="Enter Equipment Name"
                    onChange={(e) => {
                        handleChange('name', e.target.value);
                    }}
                    value={equipmentObj?.name}
                    labelSize={Typography.Sizes.md}
                />

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Equipment Type</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        id="exampleSelect"
                        placeholder="Select Equipment Type"
                        name="select"
                        isSearchable={true}
                        value={equipmentObj?.equipment_type}
                        options={equipmentTypeDataAll}
                        onChange={(e) => {
                            handleChange('equipment_type', e.value);
                        }}
                        className="basic-single"
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>End Use Category</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        id="endUseSelect"
                        placeholder="Selected End Use"
                        name="select"
                        isSearchable={true}
                        value={equipmentObj?.end_use}
                        options={endUseDataNow}
                        onChange={(e) => {
                            handleChange('end_use', e.value);
                        }}
                        className="basic-single"
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Equipment Location</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        id="exampleSelect"
                        placeholder="Select Equipment Location"
                        name="select"
                        isSearchable={true}
                        value={equipmentObj?.space_id}
                        options={locationDataNow}
                        onChange={(e) => {
                            handleChange('space_id', e.value);
                        }}
                        className="basic-single"
                    />
                </div>

                <Brick sizeInRem={2.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={closeModal}
                    />

                    <Button
                        label={isProcessing ? 'Creating...' : 'Create'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={!formValidation || isProcessing}
                        onClick={saveDeviceData}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default AddEquipment;
