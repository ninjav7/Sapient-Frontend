import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getTrackBackground, Range } from 'react-range';

import Typography from '../typography';
import Brick from '../brick';
import Input from '../form/input/Input';
import { ButtonGroup } from '../buttonGroup';

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
    onSelectionChange = () => {},
    buttonGroup,
    withTrendsFilter,
    handleButtonClick,
    currentButtonId,
    title = 'Threshold',
    ...props
}) => {
    const [values, setValues] = useState(props.range || []);
    const [from, setFrom] = useState(values[0] || 0);
    const [to, setTo] = useState(values[1] || 0);
    const [[min, max], setMinMax] = useState([minProp, maxProp]);

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

        if (value.match(/[^\-*]\D/)) {
            return;
        }

        const valueParsed = value;

        if (name === 'from') {
            if (valueParsed > values[1]) {
                return;
            }
            const newState = [valueParsed, values[1]];

            setFrom(valueParsed);
            setValues(newState);
            onSelectionChange(newState);
        }

        if (name === 'to') {
            const newState = [values[0], valueParsed];
            setTo(valueParsed);

            if (valueParsed < values[0]) {
                return;
            }

            setValues(newState);
            onSelectionChange(newState);
        }
    };

    const handleInputBlur = (event) => {
        const { name, value } = event.target;

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

        const { name, value } = event.target;

        if (value < values[1]) {
            if (name === 'to') {
                setTo(values[0]);
                setValues([values[0], values[0]]);
                onSelectionChange([values[0], values[0]]);
            }
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
};

export default RangeSlider;
