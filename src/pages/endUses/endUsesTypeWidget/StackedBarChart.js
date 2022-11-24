import React from 'react';
import Chart from 'react-apexcharts';

const StackedBarChart = ({ options, series, height, className = '' }) => {
    return (
        <div className={`enduse-stacked-chart-wrapper ${className}`}>
            <Chart options={options} series={series} type="bar" className="enduse-stacked-chart" height={height} />
        </div>
    );
};

export default StackedBarChart;
