import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';

import { UserStore } from '../../../store/UserStore';
import { saveSpaceTypeData } from './services';

import colorPalette from '../../../assets/scss/_colors.scss';

const CreateSpaceType = ({ isAddSpaceTypeModalOpen, closeAddSpaceTypeModal, fetchSpaceTypeData, search }) => {
    const defaultSpaceTypeObj = {
        is_custom: true,
        name: '',
    };

    const [spaceTypeData, setSpaceTypeData] = useState(defaultSpaceTypeObj);
    const [isProcessing, setIsProcessing] = useState(false);
    const [spaceTypeNameError, setSpaceTypeNameError] = useState(null);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, spaceTypeData);
        obj[key] = value;
        setSpaceTypeData(obj);
    };

    const saveSpaceTypeDetails = async () => {
        if ((spaceTypeData?.name.trim()).length === 0) {
            setSpaceTypeNameError('Please Enter Space Type Name.');
            return;
        }

        setIsProcessing(true);
        await saveSpaceTypeData(spaceTypeData)
            .then((res) => {
                const response = res;
                if (response?.status === 406) {
                    setSpaceTypeNameError('Space Type with given name already exists.');
                    setIsProcessing(false);
                    return;
                }

                if (response?.data?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.data?.message;
                        s.notificationType = 'success';
                    });
                    closeAddSpaceTypeModal();
                    setSpaceTypeData(defaultSpaceTypeObj);
                    fetchSpaceTypeData(search);
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.data?.message
                            ? response?.data?.message
                            : 'Unable to Create Space Type.';
                        s.notificationType = 'error';
                    });
                }
                setIsProcessing(false);
            })
            .catch((e) => {
                setIsProcessing(false);
            });
    };

    return (
        <Modal
            show={isAddSpaceTypeModalOpen}
            onHide={closeAddSpaceTypeModal}
            backdrop="static"
            keyboard={false}
            centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{`Add Space Type`}</Typography.Header>

                <Brick sizeInRem={2} />

                <Typography.Body size={Typography.Sizes.md}>
                    {`Name`}
                    <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                        *
                    </span>
                </Typography.Body>
                <Brick sizeInRem={0.25} />
                <InputTooltip
                    placeholder="Enter Name"
                    onChange={(e) => {
                        handleChange('name', e.target.value.trim());
                        setSpaceTypeNameError(null);
                    }}
                    error={spaceTypeNameError}
                    labelSize={Typography.Sizes.md}
                />

                <Brick sizeInRem={2.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={() => {
                            setSpaceTypeData(defaultSpaceTypeObj);
                            closeAddSpaceTypeModal();
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Adding...' : 'Add Space Type'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={isProcessing}
                        onClick={saveSpaceTypeDetails}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default CreateSpaceType;
