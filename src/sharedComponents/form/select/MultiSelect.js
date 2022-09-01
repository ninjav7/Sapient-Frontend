import React, { useRef, useState } from 'react';
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

    useClickOutside(ref, ['click'], () => setIsOpen(false));

    const options = props.isSelectAll ? [selectAllOption, ...props.options] : props.options;

    const handleChange = (selected) => {
        props.onChange && props.onChange(selected);

        setValue(selected);

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
        } else {
            setValue(selected.filter((option) => option.value !== selectAllOption.value));
        }
    };

    const handleClick = () => {
        setIsOpen(true);
    };

    const handleBlur = () => {
        setIsOpen(false);
    };

    return (
        <div className={`react-select-wrapper ${className}`} ref={ref} onClick={handleClick} onBlur={handleBlur}>
            <ReactSelect
                {...props}
                type={type}
                options={options}
                value={value}
                components={Object.assign(
                    {
                        ValueContainer,
                        DropdownIndicator,
                        Control,
                        Option,
                    },
                    props.isSearchable ? { MenuList } : null
                )}
                className={selectClassName}
                menuIsOpen={isOpen}
                onChange={handleChange}
                checkAllCheckboxes={() => {
                    if ((value || []).find((option) => option.value === selectAllOption.value)) {
                        setValue([]);
                        return;
                    }
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
};

export default MultiSelect;
