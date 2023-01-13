import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { getLocationData, savePassiveDeviceData } from './services';
import { BuildingStore } from '../../../store/BuildingStore';
import Select from '../../../sharedComponents/form/select';
import { useHistory } from 'react-router-dom';
import { isInputLetterOrNumber } from '../../../helpers/helpers';
import colorPalette from '../../../assets/scss/_colors.scss';
import { UserStore } from '../../../store/UserStore';

const CreatePassiveDevice = ({ isAddDeviceModalOpen, closeAddDeviceModal, fetchPassiveDeviceData }) => {
    const history = useHistory();

    const defaultDeviceObj = {
        device_type: 'passive',
        mac_address: '',
        model: '',
        space_id: '',
    };

    const defaultErrors = {
        mac_address: null,
        model: null,
    };

    const passiveDeviceModel = [
        {
            value: 'hydra',
            label: 'Hydra',
        },
        {
            value: 'trident',
            label: 'Trident',
        },
    ];

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [deviceData, setDeviceData] = useState(defaultDeviceObj);
    const [deviceErrors, setDeviceErrors] = useState(defaultErrors);
    const [locationData, setLocationData] = useState([]);

    const [isProcessing, setIsProcessing] = useState(false);

    const handleChange = (key, value) => {
        if (key === 'mac_address' && value.length > 16) return;
        let obj = Object.assign({}, deviceData);
        obj[key] = value;
        setDeviceData(obj);
    };

    const saveDeviceDetails = async () => {
        let alertObj = Object.assign({}, deviceErrors);

        if (!isInputLetterOrNumber(deviceData.mac_address) || deviceData.mac_address === '')
            alertObj.mac_address = 'Please enter only Letters and Numbers. 16 digit serial number.';
        if (deviceData.model.length === 0) alertObj.model = { text: 'Please select Model Type.' };

        setDeviceErrors(alertObj);

        if (!alertObj.mac_address && !alertObj.model) {
            setIsProcessing(true);
            const params = `?building_id=${bldgId}`;
            await savePassiveDeviceData(params, deviceData)
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
                            s.notificationMessage = response?.message ? response?.message : 'Unable to Save.';
                            s.notificationType = 'error';
                        });
                    }
                    if (response?.success) {
                        closeAddDeviceModal();
                        setDeviceData(defaultDeviceObj);
                        setDeviceErrors(defaultErrors);
                    }

                    setIsProcessing(false);
                    if (response?.data?.device_id) redirectUserToPassivePage(response?.data?.device_id);
                })
                .catch((e) => {
                    setDeviceErrors(defaultErrors);
                    setIsProcessing(false);
                });
        }
    };

    const fetchLocationData = async () => {
        const response = await getLocationData(`/${bldgId}`);
        if (response?.data.length === 0) {
            setLocationData([]);
            return;
        }
        let data = [];
        response.data.sort((a, b) => {
            return a.location_name.localeCompare(b.location_name);
        });
        response.data.forEach((record) => {
            data.push({
                label: record?.location_name,
                value: record?.location_id,
            });
        });
        setLocationData(data);
    };

    const redirectUserToPassivePage = (deviceId) => {
        history.push({
            pathname: `/settings/smart-meters/single/${deviceId}`,
        });
    };

    useEffect(() => {
        if (isAddDeviceModalOpen) fetchLocationData();
    }, [isAddDeviceModalOpen]);

    return (
        <Modal show={isAddDeviceModalOpen} onHide={closeAddDeviceModal} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Add Smart Meter</Typography.Header>

                <Brick sizeInRem={2} />

                <Typography.Body size={Typography.Sizes.md}>
                    Enter Identifier
                    <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                        *
                    </span>
                </Typography.Body>
                <Brick sizeInRem={0.25} />
                <InputTooltip
                    placeholder="Enter Identifier"
                    onChange={(e) => {
                        handleChange('mac_address', e.target.value.trim().toUpperCase());
                        setDeviceErrors({ ...deviceErrors, mac_address: null });
                    }}
                    error={deviceErrors?.mac_address}
                    labelSize={Typography.Sizes.md}
                    value={deviceData?.mac_address}
                />
                <Brick sizeInRem={0.25} />
                {!deviceErrors.mac_address && (
                    <Typography.Body size={Typography.Sizes.sm}>16 digit serial number</Typography.Body>
                )}

                <Brick sizeInRem={1.25} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>
                        Model
                        <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                            *
                        </span>
                    </Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Model"
                        options={passiveDeviceModel}
                        defaultValue={passiveDeviceModel.filter((option) => option.value === deviceData?.model)}
                        onChange={(e) => {
                            handleChange('model', e.value);
                            setDeviceErrors({ ...deviceErrors, model: null });
                        }}
                        error={deviceErrors?.model}
                        isSearchable={true}
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Location</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Location"
                        options={locationData}
                        defaultValue={locationData.filter((option) => option.value === deviceData?.space_id)}
                        onChange={(e) => {
                            handleChange('space_id', e.value);
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
                            setDeviceData(defaultDeviceObj);
                            setDeviceErrors(defaultErrors);
                            closeAddDeviceModal();
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Creating...' : 'Create'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={isProcessing}
                        onClick={saveDeviceDetails}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default CreatePassiveDevice;
