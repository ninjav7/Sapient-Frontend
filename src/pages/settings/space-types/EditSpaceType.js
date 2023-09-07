import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { updateSpaceTypeData } from './services';
import { UserStore } from '../../../store/UserStore';

const EditSpaceType = ({
    isEditSpaceTypeModalOpen,
    closeEditSpaceTypeModal,
    fetchSpaceTypeData,
    selectedSpaceType,
    search,
}) => {
    const defaultSpaceTypeObj = {
        name: '',
    };
    const [spaceTypeData, setSpaceTypeData] = useState(defaultSpaceTypeObj);
    const [isUpdating, setUpdating] = useState(false);
    const [formValidation, setFormValidation] = useState(false);
    const [spaceTypeNameError, setSpaceTypeNameError] = useState(null);

    useEffect(() => {
        if (spaceTypeData?.name.length > 0 && spaceTypeData?.name.trim() !== selectedSpaceType?.name.trim()) {
            setFormValidation(true);
        } else {
            setFormValidation(false);
        }
    }, [spaceTypeData, selectedSpaceType]);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, spaceTypeData);
        obj[key] = value;
        setSpaceTypeData(obj);
    };

    const updateSpaceTypeDetails = async () => {
        if (!spaceTypeData?.name) return;

        setUpdating(true);

        const payload = { name: spaceTypeData?.name };
        const params = `/${spaceTypeData?.id}`;

        if (spaceTypeData?.name.trim() !== selectedSpaceType?.name.trim()) {
            payload.name = spaceTypeData?.name.trim();
        }

        await updateSpaceTypeData(params, payload)
            .then((res) => {
                const response = res;
                if (response?.status === 406) {
                    setSpaceTypeNameError('Space Type with given name already exists.');
                    setUpdating(false);
                    return;
                }
                if (response?.data?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.data?.message;
                        s.notificationType = 'success';
                    });
                    setSpaceTypeData(defaultSpaceTypeObj);
                    fetchSpaceTypeData(search);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.data?.message
                            ? response?.data?.message
                            : 'Unable to Update Space Type.';
                        s.notificationType = 'error';
                    });
                }
                setUpdating(false);
                closeEditSpaceTypeModal();
            })
            .catch(() => {
                setUpdating(false);
            });
    };

    useEffect(() => {
        if (!isEditSpaceTypeModalOpen) return;
        setSpaceTypeData(selectedSpaceType);
    }, [isEditSpaceTypeModalOpen]);

    return (
        <>
            <Modal
                show={isEditSpaceTypeModalOpen}
                onHide={closeEditSpaceTypeModal}
                backdrop="static"
                keyboard={false}
                centered>
                <div className="p-4">
                    <Typography.Header size={Typography.Sizes.lg}>{`Edit Space Type`}</Typography.Header>

                    <Brick sizeInRem={2} />

                    <InputTooltip
                        label="Name"
                        placeholder="Enter Name"
                        onChange={(e) => {
                            handleChange('name', e.target.value);
                            setSpaceTypeNameError(null);
                        }}
                        labelSize={Typography.Sizes.md}
                        value={spaceTypeData?.name}
                        error={spaceTypeNameError}
                    />

                    <Brick sizeInRem={2} />

                    <div className="d-flex justify-content-between w-100">
                        <Button
                            label="Cancel"
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryGrey}
                            className="w-100"
                            onClick={() => {
                                setSpaceTypeData(defaultSpaceTypeObj);
                                closeEditSpaceTypeModal();
                            }}
                        />

                        <Button
                            label={isUpdating ? 'Updating...' : 'Update Space Type'}
                            size={Button.Sizes.lg}
                            type={Button.Type.primary}
                            className="w-100"
                            disabled={!formValidation || isUpdating}
                            onClick={updateSpaceTypeDetails}
                        />
                    </div>

                    <Brick sizeInRem={1} />
                </div>
            </Modal>
        </>
    );
};

export default EditSpaceType;
