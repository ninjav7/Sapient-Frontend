// @flow
import React from 'react';
import Chart from 'react-apexcharts';

const LineAreaChart = ({ options, series, height }) => {
    return (
        <div>
            <Chart options={options} series={series} type="area" className="apex-charts" height={height} />
        </div>
    );
};

export default LineAreaChart;
