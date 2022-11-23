// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import Brick from '../../sharedComponents/brick';
import './dailyUsageByHour.scss';

const LineAreaChart = ({ options, series, height, className = '' }) => {
    return (
        <div className={`daily-usage-by-hour ${className}`}>
            <Brick sizeInRem={1} />
            <Chart options={options} series={series} type="area" className="daily-usage-by-hour" height={height} />
        </div>
    );
};

export default LineAreaChart;
