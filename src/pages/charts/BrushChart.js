import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';
import Brick from '../../sharedComponents/brick';
import '../../sharedComponents/lineChartWidget/style.scss';

// stacked bar chart
const BrushChart = ({
    optionsData = {},
    seriesData = [],
    optionsLineData = {},
    seriesLineData = [],
    className = '',
}) => {
    return (
        <Card style={{ marginBottom:"0px" }}>
            <CardBody>
                <div id="wrapper">
                    <div id="chart-line2" className={`line-chart-widget-wrapper ${className} mb-2`}>
                        <Brick sizeInRem={1} />
                        <ReactApexChart options={optionsData} series={seriesData} type="line" height={350} />
                    </div>
                    <div id="chart-line" className={`line-chart-widget-wrapper`} >
                        <ReactApexChart options={optionsLineData} series={seriesLineData} type="area" height={90} />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default BrushChart;
