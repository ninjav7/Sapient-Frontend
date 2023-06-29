import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Brick from '../../../sharedComponents/brick';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Typography from '../../../sharedComponents/typography';
import colorPalette from '../../../assets/scss/_colors.scss';
import Select from '../../../sharedComponents/form/select';
import { Button } from '../../../sharedComponents/button';
import { ampsRating, hydraData } from './utils';
import './style.css';

const EditSensorModal = ({ showModal, closeModal, currentSensorObj, setCurrentSensorObj, sensors, setSensors }) => {
    const [sensorObj, setSensorObj] = useState(null);
    const [errorObj, setErrorObj] = useState(null);
    const [isProcessing, setProcessing] = useState(false);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, sensorObj);
        let errorObj = Object.assign({}, errorObj);

        if (key === 'amp_multiplier') errorObj = null;
        if (key === 'rated_amps' && !sensorObj?.isCustomVal) {
            const selected = hydraData.find((el) => el?.ct_size === value);
            if (selected?.amp_multiplier) obj.amp_multiplier = selected?.amp_multiplier;
        }

        obj[key] = value;
        setSensorObj(obj);
        setErrorObj(errorObj);
    };

    const saveSensorData = () => {
        let alertObj = Object.assign({}, errorObj);

        if (!sensorObj?.amp_multiplier || sensorObj?.amp_multiplier === '')
            alertObj.amp_multiplier = 'Please enter multiplier value. It cannot be empty.';

        setErrorObj(alertObj);

        if (!alertObj?.amp_multiplier) {
            setProcessing(true);
            const newArray = [...sensors];
            let index = sensors.findIndex((obj) => obj.id === sensorObj?.id);
            if (index !== -1) {
                newArray[index].rated_amps = sensorObj?.rated_amps;
                newArray[index].amp_multiplier = parseFloat(sensorObj?.amp_multiplier);
                newArray[index].isCustomVal = sensorObj?.isCustomVal;
            }
            setSensors(newArray);
            setProcessing(false);
        }
        closeModal();
        setCurrentSensorObj(null);
        setErrorObj(null);
    };

    const handleCustomValueChange = (sensor_obj) => {
        if (sensor_obj) {
            let obj = Object.assign({}, sensor_obj);
            if (obj?.isCustomVal) {
                const selectedAmps = hydraData.find((el) => el?.ct_size === obj?.rated_amps);
                if (selectedAmps?.amp_multiplier) obj.amp_multiplier = selectedAmps?.amp_multiplier;
            }
            obj.isCustomVal = !obj?.isCustomVal;
            setSensorObj(obj);
        }
    };

    useEffect(() => {
        if (currentSensorObj) setSensorObj(currentSensorObj);
    }, [currentSensorObj]);

    return (
        <Modal show={showModal} onHide={closeModal} backdrop="static" size={'md'} keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Edit Sensor Modal</Typography.Header>

                <Brick sizeInRem={2} />

                <div className="w-100 mr-2">
                    <Typography.Body size={Typography.Sizes.md}>
                        Select Amps Rating
                        <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                            *
                        </span>
                    </Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Amps Rating"
                        options={ampsRating}
                        currentValue={ampsRating.filter((option) => option.value === sensorObj?.rated_amps)}
                        onChange={(e) => {
                            handleChange('rated_amps', e.value);
                        }}
                        isSearchable={true}
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div className="w-100">
                    <div>
                        <div className="d-flex justify-content-between align-items-center">
                            <Typography.Body size={Typography.Sizes.md}>
                                {sensorObj?.isCustomVal ? 'Set Custom Multiplier' : 'Selected Multiplier'}
                            </Typography.Body>
                            <div className="mouse-pointer" onClick={() => handleCustomValueChange(sensorObj)}>
                                <Typography.Body
                                    size={Typography.Sizes.xs}
                                    className="input-error-label text-primary font-bold">
                                    {sensorObj?.isCustomVal ? 'Set Default Value' : 'Set Custom Value'}
                                </Typography.Body>
                            </div>
                        </div>
                        <Brick sizeInRem={0.25} />
                        <InputTooltip
                            type="number"
                            placeholder={sensorObj?.isCustomVal ? 'Enter Multiplier Value' : 'Selected Multiplier'}
                            onChange={(e) => {
                                if (e.target.value < 0) return;
                                handleChange('amp_multiplier', e.target.value);
                            }}
                            labelSize={Typography.Sizes.md}
                            value={sensorObj?.amp_multiplier}
                            disabled={!sensorObj?.isCustomVal}
                            error={errorObj?.amp_multiplier}
                        />
                    </div>
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
                            setCurrentSensorObj(null);
                            setErrorObj(null);
                        }}
                    />

                    <Button
                        label={isProcessing ? 'Saving ...' : 'Save'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={isProcessing}
                        onClick={saveSensorData}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default EditSensorModal;
