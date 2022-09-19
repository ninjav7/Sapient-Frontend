// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import Brick from '../../sharedComponents/brick';
import '../../sharedComponents/lineChartWidget/style.scss';

// stacked bar chart
const StackedBarChart = ({ options, series, height, className = '' }) => {
    return (
        <div className={`line-chart-widget-wrapper ${className}`}>
            <Brick sizeInRem={1} />
            <Chart options={options} series={series} type="bar" className="line-chart-widget" height={height} />
        </div>
    );
};

export default StackedBarChart;
