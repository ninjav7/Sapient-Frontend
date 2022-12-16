import React, { useCallback, useEffect, useRef, useState } from 'react';
import { getTrackBackground, Range } from 'react-range';
import PropTypes from 'prop-types';

import Typography from '../typography';
import Brick from '../brick';
import Input from '../form/input/Input';
import { ButtonGroup } from '../buttonGroup';

import { sanitizeNumbers } from './helper';
import { ReactComponent as TrendUpSVG } from '../assets/icons/arrow-trend-up.svg';
import { ReactComponent as TrendDownSVG } from '../assets/icons/arrow-trend-down.svg';

import './RangeSlider.scss';

const DEFAULT_STEP = 1;
const COLORS = ['#EAECF0', '#2955E7', '#EAECF0'];

const Thumb = React.forwardRef((props, ref) => {
    return (
        <div {...props} ref={ref} className="range-slider-thumb-wrapper">
            <div className="range-slider-thumb-value">
                <Typography.Body size={Typography.Sizes.lg}>
                    {props.value}
                    {props.prefix}
                </Typography.Body>
            </div>
        </div>
    );
});

const Track = ({ props, children, min, max, values }) => (
    <div
        onMouseDown={props.onMouseDown}
        onTouchStart={props.onTouchStart}
        style={props.style}
        className="range-slider-track-wrapper">
        <div
            ref={props.ref}
            className="range-slider-track-line"
            style={{
                background: getTrackBackground({
                    values: values,
                    colors: COLORS,
                    min,
                    max,
                }),
            }}>
            {children}
        </div>
    </div>
);

const RangeSlider = ({
    min: minProp,
    max: maxProp,
    prefix,
    onSelectionChange: onSelectionChangeProp = () => {},
    buttonGroup,
    withTrendsFilter,
    handleButtonClick,
    currentButtonId,
    returnLastValueIfEmpty = true,
    title = 'Threshold',
    ...props
}) => {
    const [values, setValues] = useState(props.range || []);
    const [from, setFrom] = useState(values[0] || 0);
    const [to, setTo] = useState(values[1] || 0);
    const [[min, max], setMinMax] = useState([minProp, maxProp]);

    const lastInputValue = useRef(null);

    const getValueInRange = (val) => {
        if (val < min) {
            return min;
        }
        if (val > max) {
            return max;
        }

        return val;
    };

    const correctRange = (arr) => (arr[0] > arr[1] ? [arr[1], arr[1]] : arr);

    const getRangedValuesFromArray = (array) => {
        return array.map((value) => getValueInRange(value));
    };

    const onSelectionChange = (arr) => onSelectionChangeProp(correctRange(getRangedValuesFromArray(arr)));

    useEffect(() => {
        setMinMax([minProp, maxProp]);
        setValues(props.range);
        setFrom(props.range[0]);
        setTo(props.range[1]);
    }, [props.range, minProp, maxProp]);

    const handleSelection = (values) => {
        setValues(values);
        onSelectionChange(values);
        setFrom(values[0]);
        setTo(values[1]);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        const valueParsed = sanitizeNumbers(value);

        if (name === 'from') {
            const newState = [valueParsed, values[1]];
            setFrom(valueParsed);
            onSelectionChange(newState);

            let valueOut = value > values[1] && value > max ? values[1] : value;

            if (valueOut < min) {
                valueOut = min;
            }
            setValues([sanitizeNumbers(valueOut), values[1]]);
        }

        if (name === 'to') {
            const newState = [values[0], valueParsed];

            setTo(valueParsed);
            onSelectionChange(newState);

            let valueOut = value < values[0] && value < min ? values[0] : value;

            if (valueOut > max) {
                valueOut = max;
            }

            setValues([values[0], sanitizeNumbers(valueOut)]);
            return;
        }
    };

    const handleInputBlur = (event) => {
        const { name, value } = event.target;

        if (returnLastValueIfEmpty) {
            if (value === '' || /[+-]$/g.test(value)) {
                if (name === 'from') {
                    const newState = [getValueInRange(lastInputValue.current), to];

                    setValues(newState);
                    onSelectionChange(newState);

                    setFrom(getValueInRange(lastInputValue.current));
                    return;
                }
                if (name === 'to') {
                    const newState = [from, getValueInRange(lastInputValue.current)];

                    setValues(newState);
                    onSelectionChange(newState);

                    setTo(getValueInRange(lastInputValue.current));
                    return;
                }
            }
        }

        if (value < values[1]) {
            if (name === 'to') {
                setTo(values[0]);
                setValues([values[0], values[0]]);
                onSelectionChange([values[0], values[0]]);
            }
        }
    };

    const handleKeyDown = (event) => {
        if (event.key !== 'Enter') {
            return;
        }

        const { name, value: valueRaw } = event.target;

        if (name === 'to') {
            let value = valueRaw < values[0] && valueRaw < min ? values[0] : valueRaw;

            if (value > max) {
                value = max;
            }

            setTo(value);
            setValues([values[0], value]);
            onSelectionChange([values[0], value]);
        }

        if (name === 'from') {
            let value = valueRaw > values[1] ? values[1] : valueRaw;

            if (value < min) {
                value = min;
            }

            setFrom(value);
            setValues([value, values[1]]);
            onSelectionChange([value, values[1]]);
        }
    };

    const handleMouseDown = (event) => {
        const { name } = event.target;

        if (name === 'from') {
            lastInputValue.current = getValueInRange(from);
        }

        if (name === 'to') {
            lastInputValue.current = getValueInRange(to);
        }
    };

    return (
        <div className="range-slider-wrapper">
            <Typography.Body size={Typography.Sizes.lg}>{title}</Typography.Body>
            <Brick />
            {buttonGroup && withTrendsFilter && (
                <>
                    <ButtonGroup
                        handleButtonClick={handleButtonClick}
                        buttons={buttonGroup}
                        currentButtonId={currentButtonId || buttonGroup.findIndex(({ isActive }) => isActive)}
                    />
                    <Brick />
                </>
            )}
            <div className="range-slider-controls">
                <Input
                    value={from}
                    onChange={handleInputChange}
                    name="from"
                    min={min}
                    className="range-slider-controls-input"
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    onMouseDown={handleMouseDown}
                />
                <div className="range-slider-controls-separator" />
                <Input
                    value={to}
                    onChange={handleInputChange}
                    name="to"
                    max={max}
                    className="range-slider-controls-input"
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    onMouseDown={handleMouseDown}
                />
            </div>
            <Range
                values={values}
                step={props.step || DEFAULT_STEP}
                min={min}
                max={max}
                onChange={(values) => handleSelection(values)}
                renderTrack={(props) => <Track {...props} {...{ min, max, values }} />}
                renderThumb={({ props, index, isDragged }) => (
                    <Thumb {...props} prefix={prefix} index={index} value={values[index]} />
                )}
            />
            <Brick sizeInRem={2} />
        </div>
    );
};

RangeSlider.defaultProps = {
    buttonGroup: [{ label: 'All' }, { icon: <TrendDownSVG /> }, { icon: <TrendUpSVG /> }],
};

RangeSlider.propTypes = {
    step: PropTypes.number,
    min: PropTypes.number.isRequired,
    range: PropTypes.arrayOf(PropTypes.number).isRequired,
    max: PropTypes.number.isRequired,
    prefix: PropTypes.string,
    buttonGroup: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string,
            icon: PropTypes.node,
            disabled: PropTypes.bool,
            isActive: PropTypes.bool,
        })
    ),
    //The same as is Active but the most prioritized
    currentButtonId: PropTypes.number,
    handleButtonClick: PropTypes.func,
    withTrendsFilter: PropTypes.bool,
    title: PropTypes.string,
    isDisabledValidation: PropTypes.bool,
    returnLastValueIfEmpty: PropTypes.bool,
};

export default RangeSlider;
