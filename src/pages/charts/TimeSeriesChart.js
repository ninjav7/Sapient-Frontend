// @flow
import React from 'react';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';
import Brick from '../../sharedComponents/brick';
import '../../sharedComponents/lineChartWidget/style.scss';

const TimeSeriesChart = ({ height, options, series, className = '' }) => {
    return (
        <div className={`bar-chart-widget-wrapper ${className}`}>
            <Brick sizeInRem={1} />
            <ReactApexChart
                options={options}
                series={series}
                type="area"
                height={height}
                className="line-chart-widget"
            />
        </div>
    );
};

export default TimeSeriesChart;
