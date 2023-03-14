import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ options, series, className = '', height = 285 }) => {
    return (
        <div className={`${className}`}>
            <Chart options={options} series={series} type="bar" height={height} className="bar-chart-widget" />
        </div>
    );
};

export default BarChart;
