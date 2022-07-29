import React from 'react';
import ReactSelect, { components } from 'react-select';
import cx from 'classnames';
import { ReactComponent as CaretDownIcon } from '../../assets/icons/caretDown.svg';

import './style.scss';

const conditionalClass = (props) => (props.selectProps.menuIsOpen ? 'is-open' : 'is-closed');

const DropdownIndicator = (props) => (
    <components.DropdownIndicator {...props}>
        <CaretDownIcon className={conditionalClass(props)} />
    </components.DropdownIndicator>
);

const Control = ({ children, ...props }) => (
    <components.Control {...props} className={conditionalClass(props)}>
        {children}
    </components.Control>
);

const Option = (props) => {
    const { isDisabled, isSelected, isFocused, children } = props;

    return !isDisabled ? (
        <components.Option
            {...props}
            className={cx('react-select-option', {
                'react-select-option--is-disabled': isDisabled,
                'react-select-option--is-focused': isFocused,
                'react-select-option--is-selected': isSelected,
            })}>
            {children}
        </components.Option>
    ) : null;
};

const Select = ({ selectClassName = '', className = '', defaultValue, ...props }) => {
    const selectedOption = props.options.find(({ value }) => value === defaultValue);

    return (
        <div className={`react-select-wrapper ${className}`}>
            <ReactSelect
                {...props}
                defaultValue={selectedOption}
                components={{ DropdownIndicator, Control, Option }}
                className={selectClassName}
            />
        </div>
    );
};

export default Select;
