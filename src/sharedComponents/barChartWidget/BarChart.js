import React from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import './style.scss';

const BarChart = ({ options, series, className = '', height = 285 }) => {
    return (
        <div className={`${className}`}>
            <Chart options={options} series={series} type="bar" height={height} className="bar-chart-widget" />
        </div>
    );
};

BarChart.propTypes = {
    options: PropTypes.object.isRequired,
    series: PropTypes.array.isRequired,
    className: PropTypes.string,
    height: PropTypes.number,
};

export default BarChart;
