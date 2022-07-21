import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// stacked bar chart
const BrushChart = ({ optionsData = {}, seriesData = [], optionsLineData = {}, seriesLineData = [] }) => {
    
    return (
        <Card style={{width:"95%"}}>
            <CardBody>
                <div id="wrapper">
                    <div id="chart-line2">
                        {/* <ReactApexChart options={options} series={series} type="line" height={230} /> */}
                        <ReactApexChart options={optionsData} series={seriesData} type="line" height={230} />
                    </div>
                    <div id="chart-line">
                        {/* <ReactApexChart options={optionsLine} series={seriesLine} type="area" height={130} /> */}
                        <ReactApexChart options={optionsLineData} series={seriesLineData} type="area" height={130} />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default BrushChart;
