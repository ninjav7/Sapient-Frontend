import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// stacked bar chart
const StackedColumnChart = ({ options, series, height }) => {
    return (
        <Card>
            <CardBody>
                <div id="chart">
                    <ReactApexChart options={options} series={series} type="bar" height={height} />
                </div>
            </CardBody>
        </Card>
    );
};

export default StackedColumnChart;
