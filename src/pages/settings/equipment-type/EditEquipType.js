import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { getEndUseData, updateEquipTypeData } from './services';
import Select from '../../../sharedComponents/form/select';
import { UserStore } from '../../../store/UserStore';

const EditEquipType = ({
    isEditEquipTypeModalOpen,
    closeEditEquipTypeModal,
    fetchEquipTypeData,
    selectedEquipType,
}) => {
    const defaultEquipTypeObj = {
        equipment_type: '',
        end_use_id: '',
    };

    const [equipTypeData, setEquipTypeData] = useState(defaultEquipTypeObj);
    const [isProcessing, setIsProcessing] = useState(false);
    const [formValidation, setFormValidation] = useState(false);
    const [endUseData, setEndUseData] = useState([]);
    const [equipTypeNameError, setEquipTypeNameError] = useState(null);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, equipTypeData);
        obj[key] = value;
        setEquipTypeData(obj);
    };

    const updateEquipTypeDetails = async () => {
        if ((equipTypeData?.equipment_type.trim()).length === 0) {
            setEquipTypeNameError('Equipment Type cannot be empty');
            return;
        }

        setIsProcessing(true);
        const obj = {
            eqt_id: equipTypeData?.equipment_id,
            name: equipTypeData?.equipment_type.trim(),
            end_use: equipTypeData?.end_use_id,
        };
        await updateEquipTypeData(obj)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message;
                        s.notificationType = 'success';
                    });
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message
                            ? response?.message
                            : 'Unable to Create Equipment Type.';
                        s.notificationType = 'error';
                    });
                }
                setIsProcessing(false);
                closeEditEquipTypeModal();
                setEquipTypeData(defaultEquipTypeObj);
                fetchEquipTypeData();
            })
            .catch(() => {
                setIsProcessing(false);
            });
    };

    const fetchEndUseData = async () => {
        let response = await getEndUseData();
        if (response?.data.length === 0) {
            setEndUseData([]);
            return;
        }
        let data = [];
        response.data.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        response.data.forEach((record) => {
            data.push({
                label: record?.name,
                value: record?.end_user_id,
            });
        });
        setEndUseData(data);
    };

    useEffect(() => {
        if (
            (selectedEquipType?.equipment_type !== equipTypeData?.equipment_type ||
                selectedEquipType?.end_use_id !== equipTypeData?.end_use_id) &&
            equipTypeData?.end_use_id.length > 0 &&
            equipTypeData?.equipment_type.length > 0 &&
            selectedEquipType?.status.toLowerCase() !== 'system'
        ) {
            setFormValidation(true);
        } else {
            setFormValidation(false);
        }
    }, [equipTypeData]);

    useEffect(() => {
        if (isEditEquipTypeModalOpen) fetchEndUseData();
    }, [isEditEquipTypeModalOpen]);

    useEffect(() => {
        if (!isEditEquipTypeModalOpen) {
            return;
        }
        setEquipTypeData(selectedEquipType);
    }, [isEditEquipTypeModalOpen]);

    return (
        <Modal
            show={isEditEquipTypeModalOpen}
            onHide={closeEditEquipTypeModal}
            backdrop="static"
            keyboard={false}
            centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Edit Equipment Type</Typography.Header>

                <Brick sizeInRem={2} />

                <InputTooltip
                    label="Name"
                    placeholder="Enter Name"
                    onChange={(e) => {
                        handleChange('equipment_type', e.target.value.trim());
                        setEquipTypeNameError(null);
                    }}
                    labelSize={Typography.Sizes.md}
                    value={equipTypeData?.equipment_type}
                    error={equipTypeNameError}
                />

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>End Use</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select End Use"
                        options={endUseData}
                        defaultValue={equipTypeData?.end_use_id}
                        onChange={(e) => {
                            handleChange('end_use_id', e.value);
                        }}
                        isSearchable={true}
                    />
                </div>

                {equipTypeData?.status && equipTypeData?.status.toLowerCase() === 'custom' && (
                    <div>
                        <Brick sizeInRem={1.5} />
                        <Button
                            label={'Delete Equipment Type'}
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryDistructive}
                            disabled={false}
                            onClick={() => {
                                // deleteEquipTypeRecord(); --- Function call will be enable once API is on! ---
                            }}
                        />
                    </div>
                )}

                <Brick sizeInRem={2} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={() => {
                            setEquipTypeData(defaultEquipTypeObj);
                            closeEditEquipTypeModal();
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Updating...' : 'Update Equipment Type'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={!formValidation || isProcessing}
                        onClick={updateEquipTypeDetails}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default EditEquipType;
