// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple bar chart
const BarChart = ({ equipTypeChartOptions, equipTypeChartData }) => {
    return (
        <Card>
            <CardBody>
                <Chart options={equipTypeChartOptions} series={equipTypeChartData} type="bar" className="apex-charts" />
            </CardBody>
        </Card>
    );
};

export default BarChart;
