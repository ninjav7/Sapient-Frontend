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
    aggregationList,
    bldgAlertConditions,
    equipAlertConditions,
    operatorsList,
    thresholdConditionTimespanList,
    thresholdReferenceList,
    thresholdTypeList,
    timespanList,
} from '../constants';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const ConditionToolTip = ({ alertObj }) => {
    return (
        <div>
            <UncontrolledTooltip placement="bottom" target={'tooltip-for-condition'}>
                {`Select a Condition to setup ${alertObj?.target?.type} alert.`}
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
    const { condition } = alertObj;

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

    return (
        <div className="custom-card">
            <CardHeader>
                <div className="d-flex align-items-baseline">
                    <Typography.Subheader size={Typography.Sizes.md} style={{ color: colorPalette.primaryGray550 }}>
                        {`Condition`}
                    </Typography.Subheader>
                    <ConditionToolTip alertObj={alertObj} />
                </div>
            </CardHeader>
            <CardBody>
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>
                        {`Add a Condition`}
                        <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                            *
                        </span>
                    </Typography.Subheader>

                    <Brick sizeInRem={1.25} />

                    <div className="d-flex" style={{ gap: '0.5rem' }}>
                        <div className={targetType === '' || condition?.condition_metric === '' ? `w-25` : `w-100`}>
                            <Typography.Body size={Typography.Sizes.md}>Metric</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            <Select
                                id="metricSelect"
                                placeholder="Select a Metric"
                                name="select"
                                options={conditionsList}
                                className="w-100"
                                onChange={(e) => {
                                    handleConditionChange('condition_metric', e.value);
                                }}
                                currentValue={conditionsList.filter(
                                    (option) => option.value === condition?.condition_metric
                                )}
                                isDisabled={targetType === ''}
                                menuPlacement="auto"
                            />
                        </div>

                        {targetType !== '' && condition?.condition_metric !== '' && (
                            <>
                                <div className="w-100">
                                    <Typography.Body size={Typography.Sizes.md}>Aggregation</Typography.Body>
                                    <Brick sizeInRem={0.25} />
                                    <Select
                                        id="aggregationSelect"
                                        placeholder="Select an Aggregation"
                                        name="select"
                                        options={aggregationList}
                                        className="w-100"
                                        onChange={(e) => {
                                            handleConditionChange('condition_metric_aggregate', e.value);
                                        }}
                                        currentValue={aggregationList.filter(
                                            (option) => option.value === condition?.condition_metric_aggregate
                                        )}
                                        isDisabled={targetType === ''}
                                        menuPlacement="auto"
                                    />
                                </div>

                                <div className="w-100">
                                    <Typography.Body size={Typography.Sizes.md}>Timespan</Typography.Body>
                                    <Brick sizeInRem={0.25} />
                                    <Select
                                        id="timeSpanSelect"
                                        placeholder="Select a Timespan"
                                        name="select"
                                        options={timespanList}
                                        className="w-100"
                                        onChange={(e) => {
                                            handleConditionChange('condition_timespan', e.value);
                                        }}
                                        currentValue={timespanList.filter(
                                            (option) => option.value === condition?.condition_timespan
                                        )}
                                        isDisabled={targetType === ''}
                                        menuPlacement="auto"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    {targetType !== '' && condition?.condition_metric !== '' && (
                        <>
                            <Brick sizeInRem={1} />

                            <div className="w-25">
                                <Typography.Body size={Typography.Sizes.md}>Operator</Typography.Body>
                                <Brick sizeInRem={0.25} />
                                <Select
                                    id="operatorSelect"
                                    placeholder="Select an Operator"
                                    name="select"
                                    options={operatorsList}
                                    className="w-100"
                                    onChange={(e) => {
                                        handleConditionChange('condition_operator', e.value);
                                    }}
                                    currentValue={operatorsList.filter(
                                        (option) => option.value === condition?.condition_operator
                                    )}
                                    isDisabled={targetType === ''}
                                    menuPlacement="auto"
                                />
                            </div>

                            <Brick sizeInRem={1} />

                            <div
                                className={`d-flex ${
                                    condition?.condition_threshold_type === 'calculated' ? 'w-100' : 'w-75'
                                }`}
                                style={{ gap: '0.5rem' }}>
                                <div className="w-100">
                                    <Typography.Body size={Typography.Sizes.md}>Threshold Type</Typography.Body>
                                    <Brick sizeInRem={0.25} />
                                    <Select
                                        id="thresholdTypeSelect"
                                        placeholder="Select Threshold Type"
                                        name="select"
                                        options={thresholdTypeList}
                                        className="w-100"
                                        onChange={(e) => {
                                            handleConditionChange('condition_threshold_type', e.value);
                                        }}
                                        currentValue={thresholdTypeList.filter(
                                            (option) => option.value === condition?.condition_threshold_type
                                        )}
                                        isDisabled={targetType === ''}
                                        menuPlacement="auto"
                                    />
                                </div>

                                {condition?.condition_threshold_type === 'static_threshold_value' && (
                                    <div className="w-100">
                                        <Typography.Body size={Typography.Sizes.md}>Threshold Value</Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <Inputs
                                            type="number"
                                            placeholder="Enter value"
                                            className="custom-input-width w-100"
                                            inputClassName="custom-input-field"
                                            value={alertObj?.condition?.condition_threshold_value}
                                            onChange={(e) => {
                                                handleConditionChange('condition_threshold_value', e.target.value);
                                            }}
                                            elementEnd={<KWH_SVG />}
                                        />
                                    </div>
                                )}

                                {condition?.condition_threshold_type === 'reference' && (
                                    <div className="w-100">
                                        <Typography.Body size={Typography.Sizes.md}>
                                            Threshold Reference
                                        </Typography.Body>
                                        <Brick sizeInRem={0.25} />
                                        <Select
                                            id="thresholdTypeSelect"
                                            placeholder="Select Threshold Type"
                                            name="select"
                                            options={thresholdReferenceList}
                                            className="w-100"
                                            onChange={(e) => {
                                                handleConditionChange('condition_threshold_reference', e.value);
                                            }}
                                            currentValue={thresholdReferenceList.filter(
                                                (option) => option.value === condition?.condition_threshold_reference
                                            )}
                                            isDisabled={targetType === ''}
                                            menuPlacement="auto"
                                        />
                                    </div>
                                )}

                                {condition?.condition_threshold_type === 'calculated' && (
                                    <>
                                        <div className="w-100">
                                            <Typography.Body size={Typography.Sizes.md}>
                                                Threshold Calculated
                                            </Typography.Body>
                                            <Brick sizeInRem={0.25} />
                                            <Select
                                                id="thresholdTypeSelect"
                                                placeholder="Select Threshold Type"
                                                name="select"
                                                options={aggregationList}
                                                className="w-100"
                                                onChange={(e) => {
                                                    handleConditionChange('condition_threshold_calculated', e.value);
                                                }}
                                                currentValue={aggregationList.filter(
                                                    (option) =>
                                                        option.value === condition?.condition_threshold_calculated
                                                )}
                                                isDisabled={targetType === ''}
                                                menuPlacement="auto"
                                            />
                                        </div>

                                        <div className="w-100">
                                            <Typography.Body size={Typography.Sizes.md}>
                                                Threshold Timespan
                                            </Typography.Body>
                                            <Brick sizeInRem={0.25} />
                                            <Select
                                                id="thresholdTypeSelect"
                                                placeholder="Select Threshold Type"
                                                name="select"
                                                options={thresholdConditionTimespanList.filter(
                                                    (el) =>
                                                        el?.timespan === condition?.condition_timespan &&
                                                        el?.operationType === condition?.condition_threshold_calculated
                                                )}
                                                className="w-100"
                                                onChange={(e) => {
                                                    handleConditionChange('condition_threshold_timespan', e.value);
                                                }}
                                                currentValue={thresholdConditionTimespanList.filter(
                                                    (option) => option.value === condition?.condition_threshold_timespan
                                                )}
                                                isDisabled={targetType === ''}
                                                menuPlacement="auto"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </>
                    )}

                    <Brick sizeInRem={targetType === TARGET_TYPES.BUILDING ? 1 : 0.5} />

                    {targetType === TARGET_TYPES.BUILDING &&
                        condition?.condition_metric &&
                        condition?.condition_metric !== 'peak_demand' && (
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

                    {alertObj?.target?.type !== TARGET_TYPES.BUILDING && alertObj?.condition?.condition_metric && (
                        <>
                            <hr />
                            <Brick sizeInRem={0.5} />
                        </>
                    )}

                    {alertObj?.target?.type !== TARGET_TYPES.BUILDING && alertObj?.condition?.condition_metric && (
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
