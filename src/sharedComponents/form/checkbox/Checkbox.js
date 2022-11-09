import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Typography from '../../typography';
import { DropDownCheckbox } from './DropDownCheckbox';

import { generateID } from '../../helpers/helper';

import './Checkbox.scss';

const CHECKBOX_SIZES = Object.freeze({
    sm: 'sm',
    md: 'md',
});

const CHECKBOX_STATES = Object.freeze({
    Checked: 'Checked',
    Indeterminate: 'Indeterminate',
    Empty: 'Empty',
});

const CHECKBOX_TYPES = Object.freeze({
    checkbox: 'checkbox',
    dropDownCheckbox: 'dropDownCheckbox',
});

const textSizesMap = Object.freeze({
    [CHECKBOX_SIZES.sm]: [Typography.Sizes.sm, Typography.Sizes.xs],
    [CHECKBOX_SIZES.md]: [Typography.Sizes.lg, Typography.Sizes.md],
});

const Checkbox = ({
    label,
    description,
    indeterminate,
    value = CHECKBOX_STATES.Indeterminate,
    size = CHECKBOX_SIZES.sm,
    id = generateID() + '_field_checkbox',
    classInput = '',
    type = CHECKBOX_TYPES.checkbox,
    autoFocused: autoFocus,
    ...props
}) => {
    const checkboxRef = useRef();

    useEffect(() => {
        checkboxRef.current.indeterminate = indeterminate;
    }, [indeterminate]);

    const classNameWrapper = cx('checkbox-wrapper', size, { [value]: !!value, [`${type}-type`]: !!type });
    const classInputInner = cx('form-check-input', 'ml-0', 'mt-0', 'position-static', 'flex-shrink-0', classInput);
    const [labelSize, descriptionSize] =
        type === CHECKBOX_TYPES.dropDownCheckbox ? [Typography.Sizes.md] : textSizesMap[size];

    return (
        <div className={classNameWrapper}>
            <div className="form-check p-0 d-flex align-items-center">
                <input
                    {...props}
                    autoFocus={autoFocus}
                    id={id}
                    className={classInputInner}
                    ref={checkboxRef}
                    type="checkbox"
                    value={value}
                />
                {label && <label className="m-0 w-100 cursor-pointer" htmlFor={id}>
                    <Typography.Body size={labelSize} {...props.typographyProps}>{label}</Typography.Body>
                    {description && type !== CHECKBOX_TYPES.dropDownCheckbox && (
                        <Typography.Body
                            className="checkbox-description"
                            size={descriptionSize}
                            fontWeight={Typography.Types.Light}
                            {...props.typographyProps}    
                        >
                            {description}
                        </Typography.Body>
                    )}
                </label>}
            </div>
        </div>
    );
};

Checkbox.Sizes = CHECKBOX_SIZES;
Checkbox.Types = CHECKBOX_TYPES;
Checkbox.DropDownCheckbox = DropDownCheckbox;

Checkbox.propTypes = {
    label: PropTypes.string.isRequired,
    description: PropTypes.string,
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
    size: PropTypes.oneOf(Object.values(CHECKBOX_SIZES)),
    indeterminate: PropTypes.bool,
    classInput: PropTypes.string,
    type: PropTypes.oneOf(Object.values(CHECKBOX_TYPES)),
    typographyProps: PropTypes.arrayOf(PropTypes.object),
};

export default Checkbox;
