import React from 'react';
import _ from 'lodash';
import { CardBody, CardHeader, UncontrolledTooltip } from 'reactstrap';

import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import Select from '../../../sharedComponents/form/select';
import Inputs from '../../../sharedComponents/form/input/Input';
import { Checkbox } from '../../../sharedComponents/form/checkbox';

import { ReactComponent as KWH_SVG } from '../../../assets/icon/kwh.svg';
import { ReactComponent as PERCENT_SVG } from '../../../assets/icon/percent.svg';
import { ReactComponent as MinutesSVG } from '../../../assets/icon/minutes.svg';
import { ReactComponent as TooltipIcon } from '../../../sharedComponents/assets/icons/tooltip.svg';

import {
    TARGET_TYPES,
    bldgAlertConditions,
    conditionLevelsList,
    equipAlertConditions,
    filtersForEnergyConsumption,
} from '../constants';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const ConditionToolTip = () => {
    return (
        <div>
            <UncontrolledTooltip placement="bottom" target={'tooltip-for-condition'}>
                {`Condition Tooltip.`}
            </UncontrolledTooltip>

            <button type="button" className="tooltip-button" id={'tooltip-for-condition'}>
                <TooltipIcon className="tooltip-icon" />
            </button>
        </div>
    );
};

const Condition = (props) => {
    const { alertObj = {}, handleConditionChange, handleRecurrenceChange } = props;

    const targetType = alertObj?.target?.type;
    const conditionType = alertObj?.condition?.type;

    let conditionsList = [];
    switch (targetType) {
        case TARGET_TYPES.BUILDING:
            conditionsList = bldgAlertConditions;
            break;
        case TARGET_TYPES.EQUIPMENT:
            conditionsList = equipAlertConditions;
            break;
        default:
            conditionsList = [];
    }

    const fetchConditionStyle = (alert_obj) => {
        let label = `condition-grid-default`;

        if (alert_obj?.target?.type === TARGET_TYPES.BUILDING) {
            label = `condition-grid-for-bldg`;
            if (alert_obj?.condition?.filterType === `number`) label += `-with-value`;
        }

        if (alert_obj?.target?.type === TARGET_TYPES.EQUIPMENT) {
            label = `condition-grid-for-equip`;
            if (alert_obj?.condition?.type === 'shortcycling') {
                label += `-with-shortcycling`;
            } else {
                if (alert_obj?.condition?.type !== 'rms_current') label += `-without-threshold`;
            }
        }

        return label;
    };

    return (
        <div className="custom-card">
            <CardHeader>
                <div className="d-flex align-items-baseline">
                    <Typography.Subheader size={Typography.Sizes.md} style={{ color: colorPalette.primaryGray550 }}>
                        {`Condition`}
                    </Typography.Subheader>
                    <ConditionToolTip />
                </div>
            </CardHeader>
            <CardBody>
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{`Select a Condition`}</Typography.Subheader>

                    <Brick sizeInRem={1.25} />

                    <div className={fetchConditionStyle(alertObj)}>
                        <Select
                            id="endUseSelect"
                            placeholder="Select a Condition"
                            name="select"
                            options={conditionsList}
                            className="w-100"
                            onChange={(e) => {
                                handleConditionChange('type', e.value);
                            }}
                            currentValue={conditionsList.filter((option) => option.value === conditionType)}
                            isDisabled={targetType === ''}
                            menuPlacement="auto"
                        />

                        {/* Building conditions fields */}
                        {targetType === TARGET_TYPES.BUILDING && conditionType !== '' && (
                            <>
                                <Select
                                    id="condition_lvl"
                                    name="select"
                                    options={conditionLevelsList}
                                    className="w-100"
                                    onChange={(e) => {
                                        handleConditionChange('level', e.value);
                                    }}
                                    currentValue={conditionLevelsList.filter(
                                        (option) => option.value === alertObj?.condition?.level
                                    )}
                                    menuPlacement="auto"
                                />
                                <Select
                                    id="filter_type"
                                    name="select"
                                    options={filtersForEnergyConsumption}
                                    className="w-100"
                                    onChange={(e) => {
                                        handleConditionChange('filterType', e.value);
                                    }}
                                    currentValue={filtersForEnergyConsumption.filter(
                                        (option) => option.value === alertObj?.condition?.filterType
                                    )}
                                    menuPlacement="auto"
                                />
                                {alertObj?.condition?.filterType === 'number' && (
                                    <Inputs
                                        type="number"
                                        placeholder="Enter value"
                                        className="custom-input-width w-100"
                                        inputClassName="custom-input-field"
                                        value={alertObj?.condition?.thresholdValue}
                                        onChange={(e) => {
                                            handleConditionChange('thresholdValue', e.target.value);
                                        }}
                                        elementEnd={<KWH_SVG />}
                                    />
                                )}
                            </>
                        )}

                        {/* Equipment conditions fields */}
                        {targetType === TARGET_TYPES.EQUIPMENT && conditionType !== '' && (
                            <>
                                {conditionType === 'rms_current' && (
                                    <Select
                                        id="condition_lvl"
                                        name="select"
                                        isSearchable={false}
                                        options={conditionLevelsList}
                                        className="w-100"
                                        onChange={(e) => {
                                            handleConditionChange('level', e.value);
                                        }}
                                        currentValue={conditionLevelsList.filter(
                                            (option) => option.value === alertObj?.condition?.level
                                        )}
                                        menuPlacement="auto"
                                    />
                                )}

                                {conditionType === 'shortcycling' && (
                                    <div className="d-flex align-items-center">
                                        <Typography.Subheader
                                            size={Typography.Sizes.md}
                                            style={{ color: colorPalette.primaryGray550 }}>
                                            {`Turn On/Turn Off`}
                                        </Typography.Subheader>
                                    </div>
                                )}

                                {conditionType !== 'rms_current' && conditionType !== 'shortcycling' && (
                                    <div className="d-flex align-items-center">
                                        <Typography.Subheader
                                            size={Typography.Sizes.md}
                                            style={{ color: colorPalette.primaryGray550 }}>
                                            {`Above`}
                                        </Typography.Subheader>
                                    </div>
                                )}

                                {conditionType === 'rms_current' && (
                                    <Inputs
                                        type="text"
                                        placeholder="Enter Threshold"
                                        className="custom-input-width w-100"
                                        inputClassName="custom-input-field"
                                        value={alertObj?.condition?.thresholdName}
                                        onChange={(e) => {
                                            handleConditionChange('thresholdName', e.target.value);
                                        }}
                                    />
                                )}

                                {conditionType !== 'shortcycling' && (
                                    <Inputs
                                        type="number"
                                        className="custom-input-width w-100"
                                        inputClassName="custom-input-field"
                                        value={alertObj?.condition?.thresholdPercentage}
                                        onChange={(e) => {
                                            handleConditionChange('thresholdPercentage', e.target.value);
                                        }}
                                        elementEnd={<PERCENT_SVG />}
                                    />
                                )}

                                {conditionType === 'shortcycling' && (
                                    <Inputs
                                        type="number"
                                        className="custom-input-width w-100"
                                        inputClassName="custom-input-field"
                                        value={alertObj?.condition?.shortcyclingMinutes}
                                        onChange={(e) => {
                                            handleConditionChange('shortcyclingMinutes', e.target.value);
                                        }}
                                        elementEnd={<MinutesSVG />}
                                    />
                                )}
                            </>
                        )}
                    </div>

                    <Brick sizeInRem={targetType === TARGET_TYPES.BUILDING ? 1 : 0.5} />

                    {targetType === TARGET_TYPES.BUILDING && conditionType === 'energy_consumption_month' && (
                        <div className="d-flex" style={{ gap: '1rem' }}>
                            <Checkbox
                                label="Alert at 50%"
                                type="checkbox"
                                id="50-percent-alert"
                                name="50-percent-alert"
                                size="md"
                                checked={alertObj?.condition?.threshold50}
                                value={alertObj?.condition?.threshold50}
                                onClick={(e) => {
                                    const value = e.target.value;
                                    if (value === 'false') handleConditionChange('threshold50', true);

                                    if (value === 'true') handleConditionChange('threshold50', false);
                                }}
                            />
                            <Checkbox
                                label="Alert at 75%"
                                type="checkbox"
                                id="75-percent-alert"
                                name="75-percent-alert"
                                size="md"
                                checked={alertObj?.condition?.threshold75}
                                value={alertObj?.condition?.threshold75}
                                onClick={(e) => {
                                    const value = e.target.value;
                                    if (value === 'false') handleConditionChange('threshold75', true);
                                    if (value === 'true') handleConditionChange('threshold75', false);
                                }}
                            />
                        </div>
                    )}

                    {targetType === TARGET_TYPES.BUILDING && conditionType === 'peak_demand_month' && (
                        <Checkbox
                            label="Alert at 90%"
                            type="checkbox"
                            id="90-percent-alert"
                            name="90-percent-alert"
                            size="md"
                            checked={alertObj?.condition?.threshold90}
                            value={alertObj?.condition?.threshold90}
                            onClick={(e) => {
                                const value = e.target.value;
                                if (value === 'false') handleConditionChange('threshold90', true);
                                if (value === 'true') handleConditionChange('threshold90', false);
                            }}
                        />
                    )}

                    {alertObj?.target?.type !== TARGET_TYPES.BUILDING && alertObj?.condition?.type && (
                        <>
                            <hr />
                            <Brick sizeInRem={0.5} />
                        </>
                    )}

                    {alertObj?.target?.type !== TARGET_TYPES.BUILDING && alertObj?.condition?.type && (
                        <>
                            <Typography.Subheader size={Typography.Sizes.md}>{`Recurrence`}</Typography.Subheader>

                            <Brick sizeInRem={0.5} />

                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex align-items-center w-100" style={{ gap: '1rem' }}>
                                    <Checkbox
                                        label="Trigger if condition lasts at least"
                                        type="checkbox"
                                        id="trigger-alert"
                                        name="trigger-alert"
                                        size="md"
                                        checked={alertObj?.recurrence?.triggerAlert}
                                        value={alertObj?.recurrence?.triggerAlert}
                                        onClick={(e) => {
                                            handleRecurrenceChange(
                                                'triggerAlert',
                                                e.target.value === 'false' ? true : false
                                            );
                                        }}
                                    />
                                    <div style={{ width: '40%' }}>
                                        <Inputs
                                            type="number"
                                            className="w-50"
                                            inputClassName="custom-input-field"
                                            min={0}
                                            value={alertObj?.recurrence?.triggerAt}
                                            onChange={(e) => {
                                                handleRecurrenceChange('triggerAt', e.target.value);
                                            }}
                                            elementEnd={<MinutesSVG />}
                                            disabled={!alertObj?.recurrence?.triggerAlert}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Brick sizeInRem={0.25} />
                        </>
                    )}
                </div>
            </CardBody>
        </div>
    );
};

export default Condition;
