// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple line chart
// const LineChart = ({ title = 'Line with Data Labels' }) => {
const LineChart = ({ title, options, series, height }) => {
    return (
        <div>
            {/* <h4 className="header-title mt-0 mb-3">{title}</h4> */}
            <Chart options={options} series={series} type="line" className="apex-charts" height={height} />
        </div>
    );
};

export default LineChart;
