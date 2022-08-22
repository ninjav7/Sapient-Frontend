import React, { useRef, useState } from 'react';
import ReactSelect, { components } from 'react-select';
import PropTypes from 'prop-types';
import cx from 'classnames';

import { Checkbox } from '../checkbox';
import Typography from '../../typography';

import useClickOutside from '../../hooks/useClickOutside';

import { ReactComponent as CaretDownIcon } from '../../assets/icons/caretDown.svg';

import './style.scss';

const conditionalClass = props => (props.selectProps.menuIsOpen ? 'is-open' : 'is-closed');

const Option = props => {
    const { isDisabled, isSelected, isFocused, children } = props;
    const { customOption } = props.selectProps;

    const className = cx('react-select-option', {
        'react-select-option--is-disabled': isDisabled,
        'react-select-option--is-focused': isFocused,
        'react-select-option--is-selected': isSelected,
        customOption: !!customOption,
    });

    return !isDisabled ? (
        <components.Option {...props} className={className}>
            <Checkbox
                id={null}
                label={children}
                className="w-100"
                classInput="mr-3"
                checked={props.isSelected}
                readOnly
            />
        </components.Option>
    ) : null;
};

const DropdownIndicator = props => (
    <components.DropdownIndicator {...props}>
        <CaretDownIcon className={conditionalClass(props)} />
    </components.DropdownIndicator>
);

const Control = ({ children, ...props }) => (
    <components.Control {...props} className={conditionalClass(props)}>
        {children}
    </components.Control>
);

// eslint-disable-next-line no-unused-vars
const ValueContainer = ({ children, ...props }) => {
    const { label } = props.selectProps;

    //@TODO Blur when click to other element, is not working yet
    return (
        <components.ValueContainer {...props}>
            <components.Placeholder {...props} isFocused={props.isFocused}>
                <Typography.Body size={Typography.Sizes.lg}>
                    {label ? label : props.selectProps.placeholder}
                </Typography.Body>
            </components.Placeholder>
            {/*{React.Children.map(children, child => (child && child.type !== Placeholder ? child : null))}*/}
        </components.ValueContainer>
    );
};

const MultiSelect = ({ selectClassName = '', className = '', options = [], defaultValue, ...props }) => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef(null);

    const selectedOption = options.find(({ value }) => value === defaultValue);

    useClickOutside(ref, ['click'], () => setIsOpen(false));

    return (
        <div className={`react-select-wrapper ${className}`} ref={ref} onClick={() => setIsOpen(true)}>
            <ReactSelect
                {...props}
                options={options}
                defaultValue={selectedOption}
                components={{ ValueContainer, DropdownIndicator, Control, Option }}
                className={selectClassName}
                menuIsOpen={isOpen}
                isMulti={true}
                hideSelectedOptions={false}
                isClearable={false}
            />
        </div>
    );
};

MultiSelect.propTypes = {
    selectClassName: PropTypes.string,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    options: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        })
    ).isRequired,
    customOption: PropTypes.node,
    label: PropTypes.string,
};

export default MultiSelect;
