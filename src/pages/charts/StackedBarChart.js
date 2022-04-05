// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// stacked bar chart
const StackedBarChart = ({ title, options, series, height }) => {
    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0 mb-3">{title}</h4>
                <Chart options={options} series={series} type="bar" className="apex-charts" height={height} />
            </CardBody>
        </Card>
    );
};

export default StackedBarChart;
