import React from 'react';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import './style.scss';

const HeatMapChart = ({ options, series = [], height = 150, className = '' }) => {
    return (
        <div className={`${className}`}>
            <Chart series={series} options={options} type="heatmap" height={height} className="heatmap-chart-widget" />
        </div>
    );
};

HeatMapChart.propTypes = {
    options: PropTypes.object.isRequired,
    series: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
                    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    z: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                }).isRequired
            ),
        })
    ).isRequired,
    height: PropTypes.number,
    className: PropTypes.string,
};

export default HeatMapChart;
