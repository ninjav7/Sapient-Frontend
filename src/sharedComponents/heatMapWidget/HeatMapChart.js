// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import './style.scss';

const HeatMapChart = ({ options, series = [], height, className = '' }) => {
    return (
        <div className={`${className}`}>
            <Chart series={series} options={options} type="heatmap" height={height} className="heatmap-chart-widget" />
        </div>
    );
};

export default HeatMapChart;
