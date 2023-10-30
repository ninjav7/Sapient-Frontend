import React from 'react';
import Modal from 'react-bootstrap/Modal';

import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Select from '../../../sharedComponents/form/select';
import Typography from '../../../sharedComponents/typography';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';

import { compareObjData } from '../../../helpers/helpers';

export const VoltageChangeAlert = (props) => {
    const { isModalOpen = false, onCancel, handlePanelUpdate, onCancelVoltageChange, isUpdating } = props;

    return (
        <Modal show={isModalOpen} onHide={onCancel} centered backdrop="static" keyboard={false} size="md">
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{`Panel Voltage Change`}</Typography.Header>

                <Brick sizeInRem={2} />

                <Typography.Body size={Typography.Sizes.lg}>
                    {`Updating the panel voltage will automatically update the breaker voltages which will impact power and energy calculations.`}
                </Typography.Body>

                <Brick sizeInRem={1} />

                <Typography.Body size={Typography.Sizes.lg}>
                    {`Are you sure you want to change panel voltage ?`}
                </Typography.Body>

                <Brick sizeInRem={2.5} />

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
        allowedVoltagesList = [],
    } = props;

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
                        options={allowedVoltagesList}
                        currentValue={allowedVoltagesList.filter((option) => option?.value === panelData?.voltage)}
                        onChange={(e) => {
                            setPanelData({ ...panelData, voltage: e.value });
                        }}
                        isSearchable={false}
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
                        }}
                    />

                    <Button
                        label={isUpdating ? 'Updating...' : 'Update'}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        disabled={compareObjData(originalPanelObj, panelData) || isUpdating}
                        onClick={updatePanelConfiguration}
                    />
                </div>

                <Brick sizeInRem={0.5} />
            </div>
        </Modal>
    );
};

export default PanelConfiguration;
