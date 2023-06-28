import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Brick from '../../../sharedComponents/brick';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Typography from '../../../sharedComponents/typography';
import colorPalette from '../../../assets/scss/_colors.scss';
import Select from '../../../sharedComponents/form/select';
import { Button } from '../../../sharedComponents/button';
import './style.css';
import { ampsRating, hydraData } from './utils';

const EditSensorPanelModel = ({
    showEditSensorPanel,
    closeEditSensorPanelModel,
    currentSensorObj,
    setCurrentSensorObj,
}) => {
    const [sensorObj, setSensorObj] = useState(null);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, sensorObj);
        obj[key] = value;
        if (key === 'rated_amps') {
            let selected = hydraData.find((el) => el?.ct_size === value);
            if (selected?.multiplier) {
                obj.amp_multiplier = selected?.multiplier;
            }
        }
        setSensorObj(obj);
    };

    useEffect(() => {
        if (currentSensorObj) setSensorObj(currentSensorObj);
    }, [currentSensorObj]);

    return (
        <Modal
            show={showEditSensorPanel}
            onHide={closeEditSensorPanelModel}
            backdrop="static"
            size={'md'}
            keyboard={false}
            centered>
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
                        placeholder="Select Panel Types"
                        options={ampsRating}
                        currentValue={ampsRating.filter((option) => option.value === sensorObj?.rated_amps)}
                        onChange={(e) => {
                            handleChange('rated_amps', e.value);
                        }}
                        isSearchable={true}
                        // error={errorObj?.panel_type}
                    />
                </div>

                <Brick sizeInRem={1.5} />

                <div className="w-100">
                    <div>
                        <Typography.Body size={Typography.Sizes.md}>
                            Select Multiplier
                            <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                                *
                            </span>
                        </Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <InputTooltip
                            type="number"
                            placeholder="Enter Breakers"
                            onChange={(e) => {
                                if (e.target.value < 0) return;
                                handleChange('amp_multiplier', e.target.value);
                            }}
                            labelSize={Typography.Sizes.md}
                            value={sensorObj?.amp_multiplier}
                            disabled={true}
                            // error={errorObj?.breaker_count}
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
                            closeEditSensorPanelModel();
                            setCurrentSensorObj(null);
                        }}
                    />

                    <Button
                        label={'Save'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        // disabled={isProcessing}
                        onClick={() => {
                            closeEditSensorPanelModel();
                            // saveToSensorArray();
                        }}
                    />
                </div>

                <Brick sizeInRem={1} />
            </div>
        </Modal>
    );
};

export default EditSensorPanelModel;
