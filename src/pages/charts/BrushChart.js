import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// stacked bar chart
const BrushChart = ({ optionsData = {}, seriesData = [], optionsLineData = {}, seriesLineData = [] }) => {
    const generateDayWiseTimeSeries = (baseval, count, yrange) => {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = baseval;
            var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

            series.push([x, y]);
            baseval += 86400000;
            i++;
        }
        return series;
    };

    const generateDayWiseTimeSeries1 = (baseval, count, yrange) => {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = baseval;
            var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

            series.push([x, y]);
            baseval += 86400000;
            i++;
        }
        return series;
    };

    const data = generateDayWiseTimeSeries(new Date('11 Feb 2022').getTime(), 185, {
        min: 30,
        max: 90,
    });

    const data1 = generateDayWiseTimeSeries1(new Date('11 Feb 2022').getTime(), 190, {
        min: 30,
        max: 90,
    });

    const [series, setSeries] = useState([
        {
            name: 'Boiler 1',
            data: data,
        },
        {
            name: 'Boiler 2',
            data: data1,
        },
    ]);

    const [options, setOptions] = useState({
        chart: {
            id: 'chart2',
            type: 'line',
            height: 230,
            toolbar: {
                autoSelected: 'pan',
                show: false,
            },
        },
        colors: ['#546E7A'],
        stroke: {
            width: 3,
        },
        dataLabels: {
            enabled: false,
        },
        colors: ['#10B981', '#2955E7'],
        fill: {
            opacity: 1,
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime',
        },
    });

    const [seriesLine, setSeriesLine] = useState([
        {
            data: data,
        },
    ]);

    const [optionsLine, setOptionsLine] = useState({
        chart: {
            id: 'chart1',
            height: 130,
            type: 'area',
            brush: {
                target: 'chart2',
                enabled: true,
            },
            selection: {
                enabled: true,
                xaxis: {
                    min: new Date('1 May 2022').getTime(),
                    max: new Date('1 June 2022').getTime(),
                },
            },
        },
        colors: ['#008FFB'],
        fill: {
            type: 'gradient',
            gradient: {
                opacityFrom: 0.91,
                opacityTo: 0.1,
            },
        },
        xaxis: {
            type: 'datetime',
            tooltip: {
                enabled: false,
            },
        },
        yaxis: {
            tickAmount: 2,
        },
    });

    useEffect(() => {
        console.log('series Data 1 => ', data);
        console.log('series Data 2 => ', data1);
    });

    return (
        <Card>
            <CardBody>
                <div id="wrapper">
                    <div id="chart-line2">
                        <ReactApexChart options={options} series={series} type="line" height={230} />
                        {/* <ReactApexChart options={optionsData} series={seriesData} type="line" height={230} /> */}
                    </div>
                    <div id="chart-line">
                        <ReactApexChart options={optionsLine} series={seriesLine} type="area" height={130} />
                        {/* <ReactApexChart options={optionsLineData} series={seriesLineData} type="area" height={130} /> */}
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default BrushChart;
