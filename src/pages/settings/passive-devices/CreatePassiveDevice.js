import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { getLocationData, savePassiveDeviceData } from './services';
import { BuildingStore } from '../../../store/BuildingStore';
import Select from '../../../sharedComponents/form/select';
import { isInputLetterOrNumber } from '../../../helpers/helpers';

const CreatePassiveDevice = ({ isAddDeviceModalOpen, closeAddDeviceModal, fetchPassiveDeviceData }) => {
    const defaultDeviceObj = {
        device_type: 'passive',
        mac_address: '',
        model: '',
        space_id: '',
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
    const [locationData, setLocationData] = useState([]);

    const [isProcessing, setIsProcessing] = useState(false);
    const [formValidation, setFormValidation] = useState(false);
    const [identifierAlert, setIdentifierAlert] = useState(null);

    const handleChange = (key, value) => {
        if (key === 'mac_address' && value.length > 16) {
            return;
        }
        let obj = Object.assign({}, deviceData);
        obj[key] = value;
        setDeviceData(obj);
    };

    const saveDeviceDetails = async () => {
        try {
            setIsProcessing(true);
            let params = `?building_id=${bldgId}`;
            await savePassiveDeviceData(params, deviceData).then((res) => {
                closeAddDeviceModal();
                setDeviceData(defaultDeviceObj);
                fetchPassiveDeviceData();
            });
            setIsProcessing(false);
        } catch (error) {
            setIsProcessing(false);
        }
    };

    const fetchLocationData = async () => {
        let response = await getLocationData(`/${bldgId}`);
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

    useEffect(() => {
        if (deviceData?.mac_address.length === 16 && deviceData?.model.length > 0) {
            setFormValidation(true);
        } else {
            setFormValidation(false);
        }
        if (isInputLetterOrNumber(deviceData.mac_address) || deviceData.mac_address === '') {
            setIdentifierAlert(null);
        } else {
            setIdentifierAlert('Please Enter only Letters and Numbers.');
        }
    }, [deviceData]);

    useEffect(() => {
        if (isAddDeviceModalOpen) {
            fetchLocationData();
        }
    }, [isAddDeviceModalOpen]);

    return (
        <Modal show={isAddDeviceModalOpen} onHide={closeAddDeviceModal} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Create Passive Device</Typography.Header>

                <Brick sizeInRem={2} />

                <InputTooltip
                    label="Identifier"
                    placeholder="Enter Identifier"
                    onChange={(e) => {
                        handleChange('mac_address', e.target.value.trim().toUpperCase());
                    }}
                    error={identifierAlert}
                    labelSize={Typography.Sizes.md}
                    value={deviceData?.mac_address}
                />

                <Brick sizeInRem={1.5} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>Model</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Model"
                        options={passiveDeviceModel}
                        defaultValue={passiveDeviceModel.filter((option) => option.value === deviceData?.model)}
                        onChange={(e) => {
                            handleChange('model', e.value);
                        }}
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
                            closeAddDeviceModal();
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Creating...' : 'Create'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={!formValidation || isProcessing || identifierAlert !== null}
                        onClick={() => {
                            saveDeviceDetails();
                        }}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default CreatePassiveDevice;
