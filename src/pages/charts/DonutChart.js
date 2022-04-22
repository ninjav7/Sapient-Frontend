// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple donut chart
const DonutChart = ({ options, series, height, title }) => {
    return (
        <div>
            {/* {title && <h4 className="header-title mt-0 mb-3">{title}</h4>} */}
            <Chart options={options} series={series} type="donut" height={height} className="apex-charts" />
        </div>
    );
};

export default DonutChart;
