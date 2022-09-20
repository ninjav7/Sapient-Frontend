import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../typography';

import './Badge.scss';

export default function Badge({ text = '' }) {
    return (
        <div className="badge-wrapper">
            <Typography.Body size={Typography.Sizes.sm}>{text}</Typography.Body>
        </div>
    );
}

Badge.propTypes = {
    text: PropTypes.string.isRequired,
};
