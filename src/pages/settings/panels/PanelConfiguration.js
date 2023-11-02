import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { Notification } from '../../../sharedComponents/notification/Notification';
import Typography from '../../../sharedComponents/typography';
import Select from '../../../sharedComponents/form/select';

import { compareObjData } from '../../../helpers/helpers';
import { voltsOption } from './utils';

export const VoltageChangeAlert = (props) => {
    const { isModalOpen = false, onCancel, handlePanelUpdate, onCancelVoltageChange, isUpdating } = props;

    return (
        <Modal show={isModalOpen} onHide={onCancel} centered backdrop="static" keyboard={false} size="md">
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{`Panel Voltage Change`}</Typography.Header>

                <Brick sizeInRem={2} />

                <Notification
                    type={Notification.Types.warning}
                    component={Notification.ComponentTypes.alert}
                    isShownCloseBtn={false}
                    actionButtons={
                        <Typography.Body size={Typography.Sizes.lg}>
                            {`Updating the panel voltage will automatically update the breaker voltages which will impact power and energy calculations.`}
                        </Typography.Body>
                    }
                />

                <Brick sizeInRem={2} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label="Cancel"
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={onCancelVoltageChange}
                    />

                    <Button
                        label={isUpdating ? 'Updating...' : 'Update'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        onClick={handlePanelUpdate}
                        disabled={isUpdating}
                    />
                </div>

                <Brick sizeInRem={0.5} />
            </div>
        </Modal>
    );
};

const PanelConfiguration = (props) => {
    const {
        showPanelConfigModal = false,
        closePanelConfigModal,
        originalPanelObj = {},
        panelData = {},
        setPanelData,
        updatePanelConfiguration,
        isUpdating = false,
        breakersList = [],
    } = props;

    const [voltageError, setVoltageError] = useState(null);
    const [tripleBreakerExist, setTripleBreakerExist] = useState(false);

    const handleVoltageChange = (original_voltage, new_selected_voltage, has_three_phase_breaker) => {
        if (original_voltage !== '120/240' && new_selected_voltage === '120/240' && has_three_phase_breaker) {
            setVoltageError({
                text: `Error: Cannot select 120/240V configuration with 3-phase breakers. Update breaker configurations to 2-pole or single phase first.`,
            });
        }
    };

    useEffect(() => {
        if (breakersList && breakersList.length !== 0) {
            const hasTripleBreaker = breakersList.some((el) => el?.breaker_type === 3);
            setTripleBreakerExist(hasTripleBreaker);
        }
    }, [breakersList]);

    return (
        <Modal show={showPanelConfigModal} onHide={closePanelConfigModal} backdrop="static" keyboard={false} centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{`Update Panel`}</Typography.Header>

                <Brick sizeInRem={2} />

                <InputTooltip
                    label="Rated Amps"
                    type="number"
                    min={0}
                    placeholder="Enter Amperage"
                    onChange={(e) => {
                        setPanelData({ ...panelData, rated_amps: +e.target.value });
                    }}
                    labelSize={Typography.Sizes.md}
                    value={panelData?.rated_amps}
                />

                <Brick sizeInRem={1.5} />

                <div className="w-100">
                    <Typography.Body size={Typography.Sizes.md}>Volts</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Select
                        placeholder="Select Volts"
                        options={voltsOption}
                        currentValue={voltsOption.filter((option) => option?.value === panelData?.voltage)}
                        onChange={(e) => {
                            setVoltageError(null);
                            setPanelData({ ...panelData, voltage: e.value });
                            handleVoltageChange(originalPanelObj?.voltage, e.value, tripleBreakerExist);
                        }}
                        isSearchable={false}
                        error={voltageError}
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
                            closePanelConfigModal();
                            setPanelData({});
                            setVoltageError(null);
                        }}
                    />

                    <Button
                        label={isUpdating ? 'Updating...' : 'Update'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={compareObjData(originalPanelObj, panelData) || voltageError}
                        onClick={updatePanelConfiguration}
                    />
                </div>

                <Brick sizeInRem={0.5} />
            </div>
        </Modal>
    );
};

export default PanelConfiguration;
