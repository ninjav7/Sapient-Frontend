import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { saveBuildingData, updateBuildingTypes } from './services';
import Select from '../../../sharedComponents/form/select';
import { BuildingListStore } from '../../../store/BuildingStore';
import { UserStore } from '../../../store/UserStore';

const CreateBuilding = ({ isAddBuildingModalOpen, closeAddBuildingModal, resetBuildingFilter }) => {
    const defaultBuildingObj = {
        building_name: '',
        building_type: '',
        building_type_id: '',
    };

    const [buildingData, setBuildingData] = useState(defaultBuildingObj);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formValidation, setFormValidation] = useState(false);
    const [buildingType, setBuildingType] = useState([]);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, buildingData);
        if (key === 'building_type_id') {
            let arr = buildingType.filter((ele) => ele.value === value);
            obj['building_type'] = arr[0]?.label;
        }
        obj[key] = value;
        setBuildingData(obj);
    };

    const fetchBuildingType = async () => {
        await updateBuildingTypes()
            .then((res) => {
                let response = res.data.data;
                let arr = [];
                response.data.map((el) => {
                    arr.push({
                        label: el.building_type,
                        value: el.building_type_id,
                    });
                });
                setBuildingType(arr);
            })
            .catch((error) => {});
    };

    const saveBuildingDetails = async () => {
        setIsProcessing(true);
        await saveBuildingData(buildingData)
            .then((res) => {
                const response = res;
                if (response?.status === 200 || response?.status === 201) {
                    setBuildingData(defaultBuildingObj);
                    resetBuildingFilter();
                    BuildingListStore.update((s) => {
                        s.fetchBuildingList = true;
                    });
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Building created successfully.';
                        s.notificationType = 'success';
                    });
                }
            })
            .catch((e) => {
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Failed to create Building.';
                    s.notificationType = 'error';
                });
            })
            .finally(() => {
                setIsProcessing(false);
                closeAddBuildingModal();
            });
    };

    useEffect(() => {
        if (buildingData.building_name.length > 3 && buildingData?.building_type_id.length > 0) {
            setFormValidation(true);
        } else {
            setFormValidation(false);
        }
    }, [buildingData]);

    useEffect(() => {
        fetchBuildingType();
    }, []);

    return (
        <Modal show={isAddBuildingModalOpen} onHide={closeAddBuildingModal} backdrop="static" keyboard={false} centered>
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
                        onChange={(e) => {
                            handleChange('building_type_id', e.value);
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
