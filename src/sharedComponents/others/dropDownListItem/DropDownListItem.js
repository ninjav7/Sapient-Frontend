import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './DropDownListItem.scss';
import { Checkbox } from '../../form/checkbox';
import Typography from '../../typography';

const DropDownListItem = (props) => {
    const className = cx(
        'drop-down-list-item-wrapper justify-content-center align-items-center d-flex',
        props.className
    );

    const typoClassName = cx('flex-grow-1 gray-550', props.labelClassName);

    const keysToExclude = ['labelClassName', 'labelText', 'children', 'className', 'noDefinedContent'];
    const checkboxProps = Object.keys(props).reduce((acc, key) => {
        if (!keysToExclude.includes(key) && !!props[key]) {
            acc[key] = props[key];
        }
        return acc;
    }, {});

    console.log(props, checkboxProps);

    return (
        <div className={className}>
            {props.noDefinedContent ? (
                props.children
            ) : (
                <>
                    <Checkbox label={''} {...checkboxProps.checkboxProps} />
                    <Typography.Body
                        className={typoClassName}
                        size={Typography.Sizes.lg}
                        fontWeight={Typography.Types.Medium}>
                        {props.labelText}
                        {props.children}
                    </Typography.Body>
                </>
            )}
        </div>
    );
};

DropDownListItem.propTypes = {
    labelText: PropTypes.string.isRequired,
    withCheckbox: PropTypes.bool,
    noDefinedContent: PropTypes.bool,
    checkboxProps: PropTypes.object,
};

export default DropDownListItem;
