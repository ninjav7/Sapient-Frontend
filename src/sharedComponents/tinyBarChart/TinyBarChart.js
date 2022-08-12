import React from 'react';
import PropTypes from 'prop-types';

import { mixColors } from '../helpers/helper';

import './TinyBarChart.scss';

const TinyBarChart = ({ percent, ...props }) => {
    const stylesLine = {
        width: `${percent || 0}%`,
        backgroundColor: mixColors('F63D68', '5F8EFC', percent),
    };

    return (
        <div className="tiny-bar-chart-wrapper" {...props}>
            <div className="tiny-bar-chart-line" style={stylesLine} />
        </div>
    );
};

TinyBarChart.propTypes = {
    percent: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};

export default TinyBarChart;
