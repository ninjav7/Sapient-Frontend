import React, { useState, useEffect } from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';

import MultiSelect from './MultiSelect';
import { Control, DropdownIndicator, MenuList, Option, SingleValue } from './customComponents';

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

    useEffect(() => {
        console.log('SSR options => ', options);
        console.log('SSR selectedOption => ', selectedOption);
    });

    return (
        <div className={`react-select-wrapper ${className}`}>
            <ReactSelect
                {...props}
                type={type}
                options={options}
                defaultValue={selectedOption}
                value={selectedOption}
                components={{
                    ...Object.assign(
                        { DropdownIndicator, Control, Option, SingleValue },
                        props.isSearchable ? { MenuList } : null
                    ),
                    ...props.components,
                }}
                className={selectClassName}
                isSearchable={false}
                backspaceRemovesValue={false}
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
    isSearchable: PropTypes.bool,
    defaultMenuIsOpen: PropTypes.bool,
    menuIsOpen: PropTypes.bool,
};

export default Select;
