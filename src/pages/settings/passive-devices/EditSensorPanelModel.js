import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Brick from '../../../sharedComponents/brick';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Typography from '../../../sharedComponents/typography';
import colorPalette from '../../../assets/scss/_colors.scss';
import Select from '../../../sharedComponents/form/select';
import { Button } from '../../../sharedComponents/button';
import { getSensorsCts } from './services';
import './style.css';

const EditSensorModal = ({ showModal, closeModal, currentSensorObj, setCurrentSensorObj, sensors, setSensors }) => {
    const [sensorObj, setSensorObj] = useState(null);
    const [errorObj, setErrorObj] = useState(null);
    const [isProcessing, setProcessing] = useState(false);

    const [ctSensorObj, setCTSensorObj] = useState(null);
    const [ctSensorsList, setCTSensorsList] = useState([]);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, ctSensorObj);
        let errorObj = Object.assign({}, errorObj);

        if (key === '_id') {
            let newObj = ctSensorsList.find((el) => el?._id === value);
            obj = newObj;
            if (newObj?.model === 'Custom') {
                obj.rated_amps = 0;
                obj.amp_multiplier = 0;
            }
        }

        obj[key] = value;
        setCTSensorObj(obj);
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

    const handleCustomValueChange = (ct_sensors) => {
        const customObj = ct_sensors.find((el) => el?.model === 'Custom');
        handleChange('_id', customObj?._id);
    };

    const fetchCTSList = async () => {
        await getSensorsCts()
            .then((res) => {
                const response = res?.data;
                if (response?.success && response?.data.length !== 0) {
                    let data = response?.data;
                    data.forEach((el) => {
                        el.label = el?.model;
                        el.value = el?._id;
                    });
                    setCTSensorsList(data);
                }
            })
            .catch(() => {});
    };

    useEffect(() => {
        if (showModal) fetchCTSList();
    }, [showModal]);

    useEffect(() => {
        if (currentSensorObj?.id) setSensorObj(currentSensorObj);
    }, [currentSensorObj]);

    useEffect(() => {
        if (currentSensorObj?.sensor_model_id && ctSensorsList.length !== 0) {
            const obj = ctSensorsList.find((el) => el?.value === currentSensorObj?.sensor_model_id);
            setCTSensorObj(obj);
        }
    }, [ctSensorsList, currentSensorObj]);

    return (
        <Modal show={showModal} onHide={closeModal} backdrop="static" size={'md'} keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>Edit Sensor Modal</Typography.Header>

                <Brick sizeInRem={2} />

                <div className="w-100 mr-2">
                    <Typography.Body size={Typography.Sizes.md}>Sensor Model</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Sensor Model"
                        options={ctSensorsList}
                        currentValue={ctSensorsList.filter((option) => option?.value === ctSensorObj?._id)}
                        onChange={(e) => handleChange('_id', e.value)}
                        isSearchable={true}
                    />
                </div>

                {ctSensorObj?.model === 'Custom' ? (
                    <Brick sizeInRem={1.5} />
                ) : (
                    <>
                        <Brick sizeInRem={0.25} />
                        <div
                            className="mouse-pointer float-right mr-1"
                            onClick={() => handleCustomValueChange(ctSensorsList)}>
                            {!(ctSensorObj?.model === 'Custom') && (
                                <Typography.Body
                                    size={Typography.Sizes.xs}
                                    className="input-error-label text-primary font-bold">
                                    {`Set Custom Value`}
                                </Typography.Body>
                            )}
                        </div>
                        <Brick sizeInRem={1.25} />
                    </>
                )}

                <div className="w-100 mr-2">
                    <Typography.Body size={Typography.Sizes.md}>
                        {`Amp Rating`}
                        {ctSensorObj?.model === 'Custom' && (
                            <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                                *
                            </span>
                        )}
                    </Typography.Body>

                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        type="number"
                        placeholder={'Enter Amp Rating'}
                        onChange={(e) => {
                            if (e.target.value < 0) return;
                            handleChange('rated_amps', e.target.value);
                        }}
                        labelSize={Typography.Sizes.md}
                        value={ctSensorObj?.rated_amps}
                        disabled={!(ctSensorObj?.model === 'Custom')}
                        error={errorObj?.rated_amps}
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div className="w-100">
                    <div>
                        <Typography.Body size={Typography.Sizes.md}>
                            {`Multiplier`}
                            {ctSensorObj?.model === 'Custom' && (
                                <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                                    *
                                </span>
                            )}
                        </Typography.Body>

                        <Brick sizeInRem={0.25} />
                        <InputTooltip
                            type="number"
                            placeholder={'Enter Multiplier'}
                            onChange={(e) => {
                                if (e.target.value < 0) return;
                                handleChange('amp_multiplier', e.target.value);
                            }}
                            labelSize={Typography.Sizes.md}
                            value={ctSensorObj?.amp_multiplier}
                            disabled={!(ctSensorObj?.model === 'Custom')}
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
