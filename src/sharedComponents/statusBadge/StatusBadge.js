import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../typography';
import cx from 'classnames';

import './StatusBadge.scss';

export const STATUS_TYPES = Object.freeze({
    success: 'success',
    warning: 'warning',
    error: 'error',
});

const StatusBadge = ({ text = '', type = STATUS_TYPES.success, icon, ...props }) => {
    return (
        <div className={cx('status-badge-wrapper', props.className, type)}>
            <Typography.Body size={Typography.Sizes.sm} className={`${props.textStyle}`}>
                {icon ? icon : text}
            </Typography.Body>
        </div>
    );
};
StatusBadge.Type = STATUS_TYPES;

StatusBadge.propTypes = {
    text: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(STATUS_TYPES)).isRequired,
    icon: PropTypes.node,
};

export default StatusBadge;
