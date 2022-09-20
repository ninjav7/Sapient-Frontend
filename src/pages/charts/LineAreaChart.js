// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import Brick from '../../sharedComponents/brick';
import '../../sharedComponents/lineChartWidget/style.scss';

const LineAreaChart = ({ options, series, height, className = '' }) => {
    return (
        <div className={`line-chart-widget-wrapper ${className}`}>
            <Brick sizeInRem={1} />
            <Chart options={options} series={series} type="area" className="line-chart-widget" height={height} />
        </div>
    );
};

export default LineAreaChart;
