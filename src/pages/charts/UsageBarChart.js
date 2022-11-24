/* As part of @PLT-482: Removed Usage by Equipment Type Chart  */

import React from 'react';
import Chart from 'react-apexcharts';

const BarChart = ({ equipTypeChartOptions, equipTypeChartData }) => {
    return <Chart options={equipTypeChartOptions} series={equipTypeChartData} type="bar" className="apex-charts" />;
};

export default BarChart;
