import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import colorPalette from '../../../assets/scss/_colors.scss';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Select from '../../../sharedComponents/form/select';
import { addNewEquipment } from '../../../services/equipment';
import { UserStore } from '../../../store/UserStore';

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

    const defaultErrors = {
        name: null,
        equipment_type: null,
        end_use: null,
    };

    const [equipmentObj, setEquipmentObj] = useState(defaultEquipmentObj);
    const [equipmentErrors, setEquipmentErrors] = useState(defaultErrors);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, equipmentObj);
        if (key === 'equipment_type') {
            let equipTypeObj = equipmentTypeDataAll.find((el) => el.value === value);
            obj['end_use'] = equipTypeObj?.end_use_id;
            let errorObj = Object.assign({}, equipmentErrors);
            errorObj.equipment_type = null;
            errorObj.end_use = null;
            setEquipmentErrors(errorObj);
        }
        obj[key] = value;
        setEquipmentObj(obj);
    };

    const saveDeviceData = async () => {
        let alertObj = Object.assign({}, equipmentErrors);

        if ((equipmentObj?.name.trim()).length === 0)
            alertObj.name = 'Please enter Equipment name. It cannot be blank.';
        if (equipmentObj?.equipment_type.length === 0)
            alertObj.equipment_type = { text: 'Please select Equipment Type.' };
        if (equipmentObj?.end_use.length === 0) alertObj.end_use = { text: 'Please select End Use Category.' };

        setEquipmentErrors(alertObj);

        if (!alertObj.name && !alertObj.equipment_type && !alertObj.end_use) {
            setIsProcessing(true);
            await addNewEquipment(bldgId, equipmentObj)
                .then((res) => {
                    const response = res;
                    if (response?.status === 200) {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = 'Equipment created successfully.';
                            s.notificationType = 'success';
                        });
                        fetchEquipmentData();
                        closeModal();
                    } else {
                        UserStore.update((s) => {
                            s.showNotification = true;
                            s.notificationMessage = 'Unable to create Equipment.';
                            s.notificationType = 'error';
                        });
                    }
                    setIsProcessing(false);
                })
                .catch((e) => {
                    setIsProcessing(false);
                    setEquipmentErrors(defaultErrors);
                });
        }
    };

    useEffect(() => {
        if (isAddEquipModalOpen) setEquipmentObj(defaultEquipmentObj);
    }, [isAddEquipModalOpen]);

    return (
        <Modal show={isAddEquipModalOpen} onHide={closeModal} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Add Equipment</Typography.Header>

                <Brick sizeInRem={2} />

                <Typography.Body size={Typography.Sizes.md}>
                    Name
                    <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                        *
                    </span>
                </Typography.Body>

                <Brick sizeInRem={0.25} />

                <InputTooltip
                    placeholder="Enter Equipment Name"
                    onChange={(e) => {
                        handleChange('name', e.target.value);
                        setEquipmentErrors({ ...equipmentErrors, name: null });
                    }}
                    value={equipmentObj?.name}
                    labelSize={Typography.Sizes.md}
                    error={equipmentErrors?.name}
                />

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>
                        Equipment Type
                        <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                            *
                        </span>
                    </Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        id="exampleSelect"
                        placeholder="Select Equipment Type"
                        name="select"
                        isSearchable={true}
                        currentValue={equipmentTypeDataAll.filter(
                            (option) => option.value === equipmentObj?.equipment_type
                        )}
                        options={equipmentTypeDataAll}
                        onChange={(e) => {
                            handleChange('equipment_type', e.value);
                        }}
                        error={equipmentErrors?.equipment_type}
                        className="basic-single"
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>
                        End Use Category
                        <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                            *
                        </span>
                    </Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        id="endUseSelect"
                        placeholder="Selected End Use"
                        name="select"
                        isSearchable={true}
                        currentValue={endUseDataNow.filter((option) => option.value === equipmentObj?.end_use)}
                        options={endUseDataNow}
                        onChange={(e) => {
                            handleChange('end_use', e.value);
                            setEquipmentErrors({ ...equipmentErrors, end_use: null });
                        }}
                        error={equipmentErrors?.end_use}
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
                        currentValue={locationDataNow.filter((option) => option.value === equipmentObj?.space_id)}
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
                        onClick={() => {
                            closeModal();
                            setEquipmentErrors(defaultErrors);
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Creating...' : 'Create'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={isProcessing}
                        onClick={saveDeviceData}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default AddEquipment;
