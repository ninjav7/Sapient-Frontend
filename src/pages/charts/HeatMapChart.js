// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

const HeatMapChart = ({ options, series, height }) => {
    return (
        <div>
            <Chart series={series} options={options} type="heatmap" height={height} className="apex-charts" />
        </div>
    );
};

export default HeatMapChart;
