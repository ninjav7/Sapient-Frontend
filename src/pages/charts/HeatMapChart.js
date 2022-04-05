// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

const HeatMapChart = ({ options, series, height }) => {
    return (
        <Card>
            <CardBody>
                <Chart options={options} series={series} type="heatmap" height={height} className="apex-charts" />
            </CardBody>
        </Card>
    );
};

export default HeatMapChart;
