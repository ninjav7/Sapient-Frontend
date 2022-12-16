import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Select from 'react-select';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { saveEquipTypeData } from './services';

const CreateEquipType = ({ isAddEquipTypeModalOpen, closeAddEquipTypeModal, fetchEquipTypeData }) => {
    const defaultEquipTypeObj = {
        name: '',
        end_use: '',
    };

    const [equipTypeData, setEquipTypeData] = useState(defaultEquipTypeObj);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formValidation, setFormValidation] = useState(false);

    const buildingType = [
        { value: 'Office Building', label: 'Office Building' },
        { value: 'Residential Building', label: 'Residential Building' },
    ];

    const handleChange = (key, value) => {
        let obj = Object.assign({}, equipTypeData);
        obj[key] = value;
        setEquipTypeData(obj);
    };

    const saveEquipTypeDetails = async () => {
        try {
            setIsProcessing(true);
            await saveEquipTypeData(equipTypeData).then((res) => {
                closeAddEquipTypeModal();
                fetchEquipTypeData();
            });
            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (equipTypeData.name.length > 0 && equipTypeData.end_use.length > 0) {
            setFormValidation(true);
        } else {
            setFormValidation(false);
        }
    }, [equipTypeData]);

    return (
        <Modal show={isAddEquipTypeModalOpen} onHide={closeAddEquipTypeModal} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Add Equipment Type</Typography.Header>

                <Brick sizeInRem={2} />

                <InputTooltip
                    label="Name"
                    placeholder="Enter Name"
                    onChange={(e) => {
                        handleChange('name', e.target.value.trim());
                    }}
                    error={null}
                    labelSize={Typography.Sizes.md}
                />

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>End Use</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select End Use"
                        options={buildingType}
                        defaultValue={buildingType.filter((option) => option.value === equipTypeData?.end_use)}
                        onChange={(e) => {
                            handleChange('end_use', e.value);
                        }}
                        isSearchable={true}
                    />
                </div>

                <Brick sizeInRem={2.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={() => {
                            setEquipTypeData(defaultEquipTypeObj);
                            closeAddEquipTypeModal();
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Adding...' : 'Add Equipment Type'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={!formValidation || isProcessing}
                        onClick={() => {
                            saveEquipTypeDetails();
                        }}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default CreateEquipType;
