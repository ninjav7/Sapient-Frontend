import React from 'react';
import ReactSelect, { components } from 'react-select';
import caretDownUrl from '../../assets/icons/caretDown.svg';

import './style.scss';

const DropdownIndicator = (props) => {
    return (
        <components.DropdownIndicator {...props}>
            <img src={caretDownUrl} />
        </components.DropdownIndicator>
    );
};

const Select = ({ selectClassName = '', className = '', defaultValue, ...props }) => {
    const selectedOption = props.options.find(({ value }) => value === defaultValue);

    return (
        <div className={`react-select-wrapper ${className}`}>
            <ReactSelect
                {...props}
                defaultValue={selectedOption}
                components={{ DropdownIndicator }}
                className={selectClassName}
            />
        </div>
    );
};

export default Select;
