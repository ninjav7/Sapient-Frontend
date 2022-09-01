import React from 'react';
import PropTypes from 'prop-types';

import { mixColors } from '../helpers/helper';

import './TinyBarChart.scss';

const cleanPercentage = (percent) => {
    if (Number.isNaN(percent) || percent === 'NaN') {
        return 0;
    }

    return percent > 100 ? 100 : percent || 0;
};

const TinyBarChart = ({ percent, ...props }) => {
    const stylesLine = {
        width: `${cleanPercentage(percent)}%`,
        backgroundColor: mixColors('F63D68', '5F8EFC', cleanPercentage(percent)),
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
