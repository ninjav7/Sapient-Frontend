import React from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import Typography from '../typography';

import { stringOrNumberPropTypes } from '../helpers/helper';

import './TinyPieChart.scss';

const TinyPieChart = ({ height = 20, width = 20, percent = 0, label, ...props }) => {
    const className = cx('TinyPieChart-wrapper', 'd-flex', 'align-items-center', props.className);

    return (
        <div className={className} {...props}>
            <Typography.Body size={Typography.Sizes.md} className="TinyPieChart-label">
                {label}
            </Typography.Body>

            <svg height={height} width={width} viewBox="0 0 20 20">
                <circle r="10" cx="10" cy="10" fill="#EEF4FF" />
                <circle
                    r="5"
                    cx="10"
                    cy="10"
                    fill="transparent"
                    stroke="#8098F9"
                    strokeWidth="10"
                    strokeDasharray={`calc(${percent} * 31.4 / 100) 31.4`}
                    transform="rotate(-90) translate(-20)"
                />
            </svg>
        </div>
    );
};

TinyPieChart.propTypes = {
    height: PropTypes.number,
    width: PropTypes.number,
    percent: stringOrNumberPropTypes.isRequired,
    label: PropTypes.string.isRequired,
};

export default TinyPieChart;
