// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import Brick from '../../sharedComponents/brick';
import '../../sharedComponents/lineChartWidget/style.scss';

// line column chart
const LineColumnChart = ({ options, series, className = '' }) => {
    return (
        <div className={`line-chart-widget-wrapper ${className}`}>
            <Brick sizeInRem={1} />
            <Chart options={options} series={series} type="bar" className="line-chart-widget" />
        </div>
    );
};

export default LineColumnChart;
