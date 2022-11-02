import React from 'react';
import Chart from 'react-apexcharts';
import Brick from '../../sharedComponents/brick';
import '../../sharedComponents/barChartWidget/style.scss';

const BarChart = ({ options, series, className = '' }) => {
    return (
        <div className={`${className}`}>
            <Chart options={options} series={series} type="bar" height={350} className="bar-chart-widget" />
        </div>
    );
};

export default BarChart;
