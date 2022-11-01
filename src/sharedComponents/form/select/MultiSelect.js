import React, { useEffect, useRef, useState } from 'react';
import ReactSelect from 'react-select';
import PropTypes from 'prop-types';
import _ from 'lodash';

import {
    Control,
    DropdownIndicator,
    MenuList,
    OptionMulti as Option,
    ValueContainerMulti as ValueContainer,
} from './customComponents';

import useClickOutside from '../../hooks/useClickOutside';
import { stringOrNumberPropTypes } from '../../helpers/helper';
import { DROPDOWN_INPUT_TYPES } from './index';
import { selectAllOption } from './constants';

import './style.scss';

const MultiSelect = ({ selectClassName = '', className = '', type = DROPDOWN_INPUT_TYPES.Default, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [value, setValue] = useState(props.value);
    const ref = useRef(null);

    useClickOutside(ref, ['click'], (event) => {
        setIsOpen(false);
        isOpen && props.onMenuClose && props.onMenuClose(event, props);
    });

    const options = props.isSelectAll ? [selectAllOption, ...props.options] : props.options;

    const handleChange = (selected) => {
        if (
            _.isEqual(
                _.sortBy(selected, [
                    function (o) {
                        return o.label;
                    },
                ]),

                _.sortBy(props.options, function (o) {
                    return o.label;
                })
            )
        ) {
            setValue(options);
            props.onChange && props.onChange(props.withSelectAllOption ? options : props.options);
        } else {
            const selectedOptions = selected.filter((option) => option.value !== selectAllOption.value);
            setValue(selectedOptions);
            props.onChange && props.onChange(selectedOptions);
        }
    };

    const handleClick = () => {
        setIsOpen(true);
    };

    const handleBlur = (event,) => {
        setIsOpen(false);
        props.onMenuClose && props.onMenuClose(event, props);
    };

    useEffect(() => {
        setValue(props.value);
    }, [props.value]);

    return (
        <div className={`react-select-wrapper ${className}`} ref={ref} onClick={handleClick} onBlur={handleBlur}>
            <ReactSelect
                {...props}
                onMenuClose={null}
                type={type}
                options={options}
                value={value}
                components={{
                    ...Object.assign(
                        {
                            ValueContainer,
                            DropdownIndicator,
                            Control,
                            Option,
                        },
                        props.isSearchable ? { MenuList } : null
                    ),
                    ...props.components,
                }}
                className={selectClassName}
                menuIsOpen={isOpen}
                onChange={handleChange}
                checkAllCheckboxes={() => {
                    if ((value || []).find((option) => option.value === selectAllOption.value)) {
                        props.onChange && props.onChange([]);
                        setValue([]);
                        return;
                    }
                    props.onChange && props.onChange(props.withSelectAllOption ? options : props.options);
                    setValue(options);
                }}
                isMulti={true}
                hideSelectedOptions={false}
                isClearable={false}
                hideTick={true}
                isSearchable={false}
                backspaceRemovesValue={false}
            />
        </div>
    );
};

MultiSelect.propTypes = {
    selectClassName: PropTypes.string,
    value: PropTypes.arrayOf(stringOrNumberPropTypes),
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: stringOrNumberPropTypes,
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
    type: PropTypes.string,
    icon: PropTypes.node,
    hideTick: PropTypes.bool,
    isSelectAll: PropTypes.bool,
    isSearchable: PropTypes.bool,
    withSelectAllOption: PropTypes.bool,
};

export default MultiSelect;
