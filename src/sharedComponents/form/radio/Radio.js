import React from 'react';
import PropTypes from 'prop-types';
import Typography from '../../typography';

import './Radio.scss';

const Radio = (props) => {
    return (
        <div className="radio-wrapper">
            <label>
                <input type="radio" className="radio" {...props} />
                <Typography.Body size={Typography.Sizes.lg}>{props.label}</Typography.Body>
            </label>
        </div>
    );
};

Radio.propTypes = {
    label: PropTypes.string.isRequired,
};

export default Radio;
