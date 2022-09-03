// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// line column chart
const LineColumnChart = ({ options, series }) => {
    return (
        <Card>
            <CardBody>
                <Chart options={options} series={series} type="bar" className="apex-charts" />
            </CardBody>
        </Card>
    );
};

export default LineColumnChart;
