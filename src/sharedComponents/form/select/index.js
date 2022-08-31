import React from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';

import MultiSelect from './MultiSelect';
import { Control, DropdownIndicator, Option, SingleValue } from './customComponents';

import { stringOrNumberPropTypes } from '../../helpers/helper';

import './style.scss';

export const DROPDOWN_INPUT_TYPES = Object.freeze({
    Default: 'Default',
    Icon: 'Icon',
    Chart: 'Chart',
});

const Select = ({
    selectClassName = '',
    className = '',
    options = [],
    type = DROPDOWN_INPUT_TYPES.Default,
    defaultValue,
    ...props
}) => {
    const selectedOption = options.find(({ value }) => value === defaultValue);

    return (
        <div className={`react-select-wrapper ${className}`}>
            <ReactSelect
                {...props}
                type={type}
                options={options}
                defaultValue={selectedOption}
                components={{ DropdownIndicator, Control, Option, SingleValue }}
                className={selectClassName}
                isSearchable={false}
            />
        </div>
    );
};

Select.Types = DROPDOWN_INPUT_TYPES;
MultiSelect.Types = DROPDOWN_INPUT_TYPES;

Select.Multi = MultiSelect;

Select.propTypes = {
    selectClassName: PropTypes.string,
    defaultValue: stringOrNumberPropTypes,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: stringOrNumberPropTypes.isRequired,
            supportText: PropTypes.string,
            img: PropTypes.node,
            labelChart: PropTypes.string,
            percentLabel: stringOrNumberPropTypes,
            isSelected: PropTypes.bool,
            isDisabled: PropTypes.bool,
            isFocused: PropTypes.bool,
        })
    ).isRequired,
    customOption: PropTypes.node,
    type: PropTypes.oneOf(Object.values(DROPDOWN_INPUT_TYPES)),
    icon: PropTypes.node,
    hideTick: PropTypes.bool,
};

export default Select;
