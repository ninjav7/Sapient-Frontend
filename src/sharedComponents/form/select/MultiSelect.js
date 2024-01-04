import React, { useEffect, useRef, useState } from 'react';
import ReactSelect from 'react-select';
import cx from 'classnames';
import _ from 'lodash';
import PropTypes from 'prop-types';
import colorPalette from '../../../assets/scss/_colors.scss';

import Brick from '../../brick';
import Typography from '../../typography';
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
import { filterOutSelectAllOption } from './helpers';

import { ReactComponent as ErrorSVG } from '../../assets/icons/errorInfo.svg';

import './style.scss';

const MultiSelect = ({
    selectClassName = '',
    className = '',
    type = DROPDOWN_INPUT_TYPES.Default,
    closeOnBlur = false,
    error,
    info,
    label,
    ...props
}) => {
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

    const handleBlur = (event) => {
        if (!closeOnBlur) {
            return;
        }

        setIsOpen(false);
        props.onMenuClose && props.onMenuClose(event, props);
    };

    useEffect(() => {
        // Added Select type condition for Multi-select used in Explore Building & Equipment page
        if (props?.selectType) {
            setValue(props.value);
            return;
        }

        if (!props.value || props.value.length === 0) {
            setValue([]);
        } else if (props.isSelectAll) {
            const filteredOptions = filterOutSelectAllOption(props.value);
            setValue([selectAllOption, ...filteredOptions]);
        } else {
            setValue(props.value);
        }
    }, [props.value, props.isSelectAll]);

    return (
        <div
            className={cx(`react-select-wrapper`, className, { 'is-error': !!error })}
            ref={ref}
            onClick={handleClick}
            onBlur={handleBlur}>
            {label && (
                <>
                    <Typography.Body size={Typography.Sizes.sm} className="gray-550">
                        {label}
                        {props?.required && (
                            <span style={{ color: colorPalette.error700 }} className="font-weight-bold ml-1">
                                *
                            </span>
                        )}
                    </Typography.Body>
                    <Brick sizeInRem={0.25} />
                </>
            )}
            <ReactSelect
                {...props}
                onMenuClose={null}
                type={type}
                options={options}
                value={value}
                styles={{ menu: (base) => ({ ...base, zIndex: 2 }) }}
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
                    props.onChange && props.onChange(props.isSelectAll ? options : props.options);
                    setValue(options);
                }}
                isMulti={true}
                hideSelectedOptions={false}
                isClearable={false}
                hideTick={true}
                isSearchable={false}
                backspaceRemovesValue={false}
            />
            {!!error && (!!error.text || !!error.icon) && (
                <div>
                    <Brick sizeInRem={0.375} />

                    <div className="d-flex align-items-center">
                        {error.icon &&
                            React.cloneElement(error.icon, {
                                className: 'element-end-node mr-1',
                            })}

                        {error.icon === undefined && <ErrorSVG className="mr-1" width="12" />}

                        <Typography.Body size={Typography.Sizes.xs} className="error-700">
                            {error.text}
                        </Typography.Body>
                    </div>
                </div>
            )}
            {!!info && (!!info.text || !!info.icon) && (
                <div>
                    <Brick sizeInRem={0.375} />

                    <div className="d-flex align-items-center">
                        {info.icon &&
                            React.cloneElement(info.icon, {
                                className: 'element-end-node mr-1',
                            })}

                        <Typography.Body size={Typography.Sizes.xs}>{info.text}</Typography.Body>
                    </div>
                </div>
            )}
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
    required: PropTypes.bool,
    customOption: PropTypes.node,
    type: PropTypes.string,
    icon: PropTypes.node,
    hideTick: PropTypes.bool,
    isSelectAll: PropTypes.bool,
    isSearchable: PropTypes.bool,
    withSelectAllOption: PropTypes.bool,
    closeOnBlur: PropTypes.bool,
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

export default MultiSelect;
