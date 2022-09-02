// @flow
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

const TimeSeriesChart = ({ height, options, series }) => {
    return (
        <Card>
            <CardBody>
                <ReactApexChart options={options} series={series} type="area" height={height} />
            </CardBody>
        </Card>
    );
};

export default TimeSeriesChart;
