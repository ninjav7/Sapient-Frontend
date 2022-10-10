import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { DropDownListItem } from '../dropDownListItem';

import { generateID, stringOrNumberPropTypes } from '../../helpers/helper';

import './DropDownMenuBase.scss';

const DropDownMenuBase = ({ lists = [], children, ...props }) => {
    return (
        <div className="drop-down-menu-base-wrapper" {...props}>
            {lists.map((list) => (
                <DropDownListItem
                    key={list.id || generateID()}
                    {...list}
                    className={cx(
                        {
                            'border-bottom': list.border,
                        },
                        list.className
                    )}
                />
            ))}
            {children}
        </div>
    );
};

DropDownMenuBase.propTypes = {
    lists: PropTypes.arrayOf(
        PropTypes.shape({
            labelText: PropTypes.string.isRequired,
            id: stringOrNumberPropTypes,
            className: PropTypes.string,
            labelClassName: PropTypes.string,
        }).isRequired
    ),
};

export default DropDownMenuBase;
