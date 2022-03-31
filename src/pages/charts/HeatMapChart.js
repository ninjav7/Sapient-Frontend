// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple donut chart
const HeatMapChart = () => {
    function generateData(count, yrange) {
        var i = 0;
        var series = [];
        while (i < count) {
            var x = (i + 1).toString();
            var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

            series.push({
                x: x,
                y: y,
            });
            i++;
        }
        return series;
    }

    const apexHeatMapOpts = {
        chart: {
            height: 350,
            type: 'heatmap',
        },
        dataLabels: {
            enabled: false,
        },
        colors: ['#008FFB'],
        // title: {
        //     text: 'HeatMap Chart (Single color)',
        // },
    };

    const apexHeatMapSeries = [
        {
            name: 'Metric1',
            data: generateData(18, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Metric2',
            data: generateData(18, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Metric3',
            data: generateData(18, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Metric4',
            data: generateData(18, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Metric5',
            data: generateData(18, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Metric6',
            data: generateData(18, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Metric7',
            data: generateData(18, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Metric8',
            data: generateData(18, {
                min: 0,
                max: 90,
            }),
        },
        {
            name: 'Metric9',
            data: generateData(18, {
                min: 0,
                max: 90,
            }),
        },
    ];

    return (
        <Card>
            <CardBody>
                {/* <h4 className="header-title mt-0 mb-3">HeatMap Chart</h4> */}
                <Chart
                    options={apexHeatMapOpts}
                    series={apexHeatMapSeries}
                    type="heatmap"
                    height={350}
                    className="apex-charts"
                />
            </CardBody>
        </Card>
    );
};

export default HeatMapChart;
