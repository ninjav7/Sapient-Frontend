import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const ApexDonutChart = ({ options, series }) => {
    return (
        <div id="chart">
            <ReactApexChart options={options} series={series} type="donut" />
        </div>
    );
};

export default ApexDonutChart;
