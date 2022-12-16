import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { saveBuildingData } from './services';
import { BuildingListStore } from '../../../store/BuildingStore';
import Select from '../../../sharedComponents/form/select';

const CreateBuilding = ({ isAddBuildingModalOpen, closeAddBuildingModal, fetchBuildingData }) => {
    const defaultBuildingObj = {
        building_name: '',
        building_type: '',
    };

    const [buildingData, setBuildingData] = useState(defaultBuildingObj);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formValidation, setFormValidation] = useState(false);

    const buildingType = [
        { value: 'Office Building', label: 'Office Building' },
        { value: 'Residential Building', label: 'Residential Building' },
    ];

    const handleChange = (key, value) => {
        let obj = Object.assign({}, buildingData);
        obj[key] = value;
        setBuildingData(obj);
    };

    const saveBuildingDetails = async () => {
        try {
            setIsProcessing(true);
            await saveBuildingData(buildingData).then((res) => {
                closeAddBuildingModal();
                fetchBuildingData();
                BuildingListStore.update((s) => {
                    s.fetchBuildingList = true;
                });
            });
            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (buildingData.building_name.length > 3 && buildingData?.building_type.length > 0) {
            setFormValidation(true);
        } else {
            setFormValidation(false);
        }
    }, [buildingData]);

    return (
        <Modal show={isAddBuildingModalOpen} onHide={closeAddBuildingModal} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Add Building</Typography.Header>

                <Brick sizeInRem={2} />

                <InputTooltip
                    label="Building Name"
                    placeholder="Enter Building Name"
                    onChange={(e) => {
                        handleChange('building_name', e.target.value.trim());
                    }}
                    error={null}
                    labelSize={Typography.Sizes.md}
                />

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Building Type</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Building Type"
                        options={buildingType}
                        defaultValue={buildingType.filter((option) => option.value === buildingData?.type)}
                        onChange={(e) => {
                            handleChange('building_type', e.value);
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
                            setBuildingData(defaultBuildingObj);
                            closeAddBuildingModal();
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Creating...' : 'Create'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={!formValidation || isProcessing}
                        onClick={() => {
                            saveBuildingDetails();
                        }}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default CreateBuilding;
