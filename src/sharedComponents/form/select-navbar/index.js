import React, { useState, useRef, useCallback } from 'react';
import ReactSelect from 'react-select';
import _ from 'lodash';
import cx from 'classnames';
import PropTypes from 'prop-types';
import colorPalette from '../../../assets/scss/_colors.scss';

import MultiSelect from './MultiSelect';
import {
    Control,
    DropdownIndicator,
    MenuList,
    Option,
    SingleValue,
    ValueContainerSingle as ValueContainer,
    GroupHeading,
} from './customComponents';

import useClickOutside from '../../hooks/useClickOutside';
import { stringOrNumberPropTypes } from '../../helpers/helper';

import './style.scss';

export const DROPDOWN_INPUT_TYPES = Object.freeze({
    Default: 'Default',
    Icon: 'Icon',
    Chart: 'Chart',
});

const SelectNavBar = ({
    selectClassName = '',
    className = '',
    options = [],
    type = DROPDOWN_INPUT_TYPES.Default,
    defaultValue,
    currentValue,
    error,
    info,
    label,
    ...props
}) => {
    const selectedOption = options.find(({ value }) => value === defaultValue);
    const containerRef = useRef(null);
    const lastValueRef = useRef(null);

    const [isFocused, setIsFocused] = useState(false);
    const [inputValue, setInputValue] = useState('');

    const events = props.isSearchable ? ['mousedown'] : [];

    const closeMenu = useCallback(() => {
        setIsFocused(false);
        setInputValue('');
    }, []);

    const clickOutsideHandler = useCallback((event) => {
        let menu = containerRef.current.querySelector('.select__menu');

        if (!containerRef.current.contains(event.target) || !menu || !menu.contains(event.target)) {
            closeMenu();
        }
    }, []);

    useClickOutside(containerRef, events, clickOutsideHandler);

    const propsForSearchable = {
        ...(props.isSearchable
            ? {
                  closeMenu,
                  inputValue,
                  onMenuInputFocus: (event) => {
                      props.onMenuInputFocus && props.onMenuInputFocus(event);
                      setIsFocused(true);
                  },
                  onMenuInputBlur: (event) => {
                      props.onMenuInputBlur && props.onMenuInputBlur(event);
                      setIsFocused(false);
                  },
                  onChange: (event) => {
                      //@TODO Temporary, need to prevent selection by space on the keyboard
                      if (lastValueRef.current !== 32) {
                          props.onChange && props.onChange(event);
                          setIsFocused(false);
                      }
                  },
                  onInputChange: (val) => {
                      props.onInputChange && props.onInputChange(val);
                      setInputValue(val);
                  },
                  onValueChange: (val) => {
                      setInputValue(val);
                  },
                  onKeyDown: (event) => {
                      props.onKeyDown && props.onKeyDown(event);
                      //@TODO Not clear, why it is working.
                      if (!!props.customSearchCallback) {
                          setInputValue((prevState) => prevState + ' ');
                      }
                      lastValueRef.current = event.keyCode;
                  },
                  customOptionOnClick: () => {
                      lastValueRef.current = null;
                  },
                  menuIsOpen: isFocused || undefined,
                  isFocused: isFocused || undefined,
              }
            : {}),
    };

    return (
        <div className={cx(`react-select-topnav-wrapper`, className, { 'is-error': !!error })} ref={containerRef}>
            <ReactSelect
                {...props}
                type={type}
                options={options}
                defaultValue={!_.isObject(defaultValue) ? selectedOption : defaultValue}
                value={currentValue || selectedOption}
                components={{
                    ...Object.assign(
                        { DropdownIndicator, Control, Option, SingleValue, ValueContainer },
                        props.isSearchable ? { MenuList, ValueContainer, GroupHeading } : null
                    ),
                    ...props.components,
                }}
                className={selectClassName}
                isSearchable={false}
                backspaceRemovesValue={false}
                classNamePrefix="select"
                {...propsForSearchable}
            />
        </div>
    );
};

SelectNavBar.Types = DROPDOWN_INPUT_TYPES;
MultiSelect.Types = DROPDOWN_INPUT_TYPES;

SelectNavBar.Multi = MultiSelect;

SelectNavBar.propTypes = {
    selectClassName: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.object]),

    // The difference between default and current values, is currentValue allows to change current value dynamically
    currentValue: PropTypes.object,
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
            value: stringOrNumberPropTypes.isRequired,
            supportText: PropTypes.string,
            img: PropTypes.node,
            icon: PropTypes.node,
            iconForSelected: PropTypes.node,
            labelChart: PropTypes.string,
            percentLabel: stringOrNumberPropTypes,
            isSelected: PropTypes.bool,
            isDisabled: PropTypes.bool,
            isFocused: PropTypes.bool,
            hasValue: PropTypes.bool,
        })
    ).isRequired,
    required: PropTypes.bool,
    customOption: PropTypes.node,
    type: PropTypes.oneOf(Object.values(DROPDOWN_INPUT_TYPES)),
    icon: PropTypes.node,
    hideTick: PropTypes.bool,
    isSearchable: PropTypes.bool,
    defaultMenuIsOpen: PropTypes.bool,
    menuIsOpen: PropTypes.bool,
    customSearchCallback: PropTypes.func,
    searchFieldsProps: PropTypes.shape({
        wrapper: PropTypes.any,
    }),
    searchNoResults: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    error: PropTypes.shape({
        text: PropTypes.string,
        icon: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    }),
    info: PropTypes.shape({
        text: PropTypes.string,
        icon: PropTypes.oneOfType([PropTypes.node, PropTypes.bool]),
    }),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default SelectNavBar;
