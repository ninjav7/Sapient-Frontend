// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// line column chart
const LineColumnChart = ({ energyChartOptions, energyChartData }) => {
    return (
        <Card>
            <CardBody>
                <Chart options={energyChartOptions} series={energyChartData} type="line" className="apex-charts" />
            </CardBody>
        </Card>
    );
};

export default LineColumnChart;
