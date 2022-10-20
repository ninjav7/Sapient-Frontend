// @flow
import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple donut chart
const DonutChart = ({ donutChartOpts, donutChartData, height, title }) => {
    return (
        <Card>
            <CardBody style={{padding: "0rem"}}>
                {title && <h4 className="header-title" >{title}</h4>}
                <Chart
                    options={donutChartOpts}
                    series={donutChartData}
                    type="donut"
                    height={height}
                    className="apex-charts"
                />
            </CardBody>
        </Card>
    );
};

export default DonutChart;
