import React from 'react';
import _ from 'lodash';
import { CardBody, CardHeader, UncontrolledTooltip } from 'reactstrap';

import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import Select from '../../../sharedComponents/form/select';
import Inputs from '../../../sharedComponents/form/input/Input';

import { ReactComponent as KWH_SVG } from '../../../assets/icon/units/kwh.svg';
import { ReactComponent as KW_SVG } from '../../../assets/icon/units/kW.svg';
import { ReactComponent as AMP_SVG } from '../../../assets/icon/units/amp.svg';
import { ReactComponent as KG_SVG } from '../../../assets/icon/units/kg.svg';
import { ReactComponent as WATT_SVG } from '../../../assets/icon/units/watt.svg';
import { ReactComponent as PERCENT_SVG } from '../../../assets/icon/units/percent.svg';
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
            <UncontrolledTooltip placement="top" target={'tooltip-for-condition'}>
                {`Select a Condition to setup ${alertObj?.target?.type} alert.`}
            </UncontrolledTooltip>

            <button type="button" className="tooltip-button" id={'tooltip-for-condition'}>
                <TooltipIcon className="tooltip-icon" />
            </button>
        </div>
    );
};

const TriggerAlertToolTip = () => {
    return (
        <div>
            <UncontrolledTooltip placement="top" target={'tooltip-for-alert-trigger'}>
                {`This alert will trigger if any of the thresholds are reached.`}
            </UncontrolledTooltip>

            <button type="button" className="tooltip-button" id={'tooltip-for-alert-trigger'}>
                <TooltipIcon className="tooltip-icon mb-1" />
            </button>
        </div>
    );
};

const ConditionMetrics = (props) => {
    const { targetType, condition, conditionsList, handleConditionChange } = props;

    return (
        <div className="condition-metric" style={{ width: condition?.condition_metric !== '' ? '100%' : '33%' }}>
            <Typography.Subheader size={Typography.Sizes.md}>
                {`Select Metric`}
                <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                    *
                </span>
            </Typography.Subheader>

            <Brick sizeInRem={1.25} />

            <div>
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
                    currentValue={conditionsList.filter((option) => option.value === condition?.condition_metric)}
                    isDisabled={targetType === ''}
                    menuPlacement="auto"
                />
            </div>

            {targetType !== '' && condition?.condition_metric !== '' && (
                <>
                    <Brick sizeInRem={1.5} />

                    <div>
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

                    <Brick sizeInRem={1.5} />

                    <div>
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
    );
};

const MetricsComparison = (props) => {
    const { targetType, condition, handleConditionChange } = props;

    return (
        <div className="condition-metric w-100">
            <Typography.Subheader size={Typography.Sizes.md}>
                {`Comparison`}
                <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                    *
                </span>
            </Typography.Subheader>

            <Brick sizeInRem={1.25} />

            <div>
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
                    currentValue={operatorsList.filter((option) => option.value === condition?.condition_operator)}
                    isDisabled={targetType === ''}
                    menuPlacement="auto"
                />
            </div>
        </div>
    );
};

const ThresholdConfigure = (props) => {
    const { targetType, condition, handleConditionChange, alertObj, handleSVGRender } = props;

    return (
        <div className="condition-metric w-100">
            <Typography.Subheader size={Typography.Sizes.md}>
                {`Threshold`}
                <span style={{ color: colorPalette.error600 }} className="font-weight-bold ml-1">
                    *
                </span>
            </Typography.Subheader>

            <Brick sizeInRem={1.25} />

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

            <Brick sizeInRem={1.5} />

            {condition?.condition_threshold_type === 'static_threshold_value' && (
                <div className="w-100">
                    <Typography.Body size={Typography.Sizes.md}>Threshold Value</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <Inputs
                        type="number"
                        placeholder="Enter Threshold value"
                        className="custom-input-width w-100"
                        inputClassName="custom-input-field"
                        value={alertObj?.condition?.condition_threshold_value}
                        onChange={(e) => {
                            handleConditionChange('condition_threshold_value', e.target.value);
                        }}
                        elementEnd={handleSVGRender(condition?.condition_metric)}
                    />
                </div>
            )}

            {condition?.condition_threshold_type === 'reference' && (
                <div className="w-100">
                    <Typography.Body size={Typography.Sizes.md}>Threshold Reference</Typography.Body>
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
                        <Typography.Body size={Typography.Sizes.md}>Threshold Aggregation</Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <Select
                            id="thresholdTypeSelect"
                            placeholder="Select Threshold Aggregation"
                            name="select"
                            options={aggregationList}
                            className="w-100"
                            onChange={(e) => {
                                handleConditionChange('condition_threshold_calculated', e.value);
                            }}
                            currentValue={aggregationList.filter(
                                (option) => option.value === condition?.condition_threshold_calculated
                            )}
                            isDisabled={targetType === ''}
                            menuPlacement="auto"
                        />
                    </div>

                    <Brick sizeInRem={1.5} />

                    <div className="w-100">
                        <Typography.Body size={Typography.Sizes.md}>Threshold Calculation</Typography.Body>
                        <Brick sizeInRem={0.25} />
                        <Select
                            id="thresholdTypeSelect"
                            placeholder="Select Threshold Calculation"
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

    const handleSVGRender = (metricType) => {
        if (metricType === 'energy_consumption') return <KWH_SVG width={25} height={25} />;
        if (metricType === 'peak_demand') return <KW_SVG width={15} height={15} />;
        if (metricType === 'carbon') return <KG_SVG width={15} height={15} />;
        if (metricType === 'power') return <WATT_SVG width={12} height={12} />;
        if (metricType.includes('current')) return <AMP_SVG width={12} height={12} />;
        if (metricType.includes('percent')) return <PERCENT_SVG />;

        return null;
    };

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
                <div className="d-flex justify-content-between" style={{ gap: '1.5rem' }}>
                    <ConditionMetrics
                        targetType={targetType}
                        condition={condition}
                        conditionsList={conditionsList}
                        handleConditionChange={handleConditionChange}
                    />

                    {targetType !== '' && condition?.condition_metric !== '' && (
                        <MetricsComparison
                            targetType={targetType}
                            condition={condition}
                            handleConditionChange={handleConditionChange}
                        />
                    )}

                    {targetType !== '' && condition?.condition_metric !== '' && (
                        <ThresholdConfigure
                            targetType={targetType}
                            condition={condition}
                            handleConditionChange={handleConditionChange}
                            alertObj={alertObj}
                            handleSVGRender={handleSVGRender}
                        />
                    )}
                </div>

                {targetType !== '' && condition?.condition_metric !== '' && (
                    <>
                        <hr className="mt-4" />

                        <div style={{ width: '33%' }}>
                            <div className="d-flex align-items-center">
                                <Typography.Body size={Typography.Sizes.md}>Trigger Alert %</Typography.Body>
                                <TriggerAlertToolTip />
                            </div>
                            <Brick sizeInRem={0.25} />
                            <Inputs
                                type="text"
                                placeholder="Enter Trigger Alert value"
                                className="custom-input-width w-100"
                                inputClassName="custom-input-field"
                                value={alertObj?.condition?.condition_trigger_alert}
                                onChange={(e) => {
                                    const inputValue = e.target.value;
                                    const sanitizedValue = inputValue.replace(/[^0-9,]/g, '');
                                    handleConditionChange('condition_trigger_alert', sanitizedValue);
                                }}
                                elementEnd={<PERCENT_SVG />}
                            />
                            <Brick sizeInRem={0.25} />
                            <Typography.Body size={Typography.Sizes.sm}>
                                {`Enter a number or numbers, separated by a comma.`}
                            </Typography.Body>
                        </div>
                    </>
                )}
            </CardBody>
        </div>
    );
};

export default Condition;
