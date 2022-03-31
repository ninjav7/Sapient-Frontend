// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple bar chart
const BarChart = () => {
    const apexBarChartOpts = {
        chart: {
            height: 380,
            type: 'bar',
            toolbar: {
                show: false,
            },
        },
        plotOptions: {
            bar: {
                horizontal: true,
                dataLabels: {
                    position: 'top',
                },
            },
        },
        tooltip: {
            theme: 'dark',
            x: { show: false },
        },
        dataLabels: {
            enabled: false,
            offsetX: -6,
            style: {
                fontSize: '12px',
                colors: ['#fff'],
            },
        },
        // colors: ['#847CB5'],
        colors: ['#6d669b'],
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff'],
        },

        xaxis: {
            categories: ['Floor 1', 'Floor 2', 'Floor 3', 'Floor 4', 'Floor 5'],
            axisBorder: {
                color: '#d6ddea',
            },
            axisTicks: {
                color: '#d6ddea',
            },
        },
        yaxis: {
            labels: {
                offsetX: -10,
            },
        },
        legend: {
            offsetY: -10,
        },
        states: {
            hover: {
                filter: 'none',
            },
        },
        grid: {
            borderColor: '#f1f3fa',
        },
    };

    const apexBarChartData = [
        {
            name: 'Series 1',
            data: [700, 1600, 1200, 500, 800],
        },
    ];

    return (
        <Card>
            <CardBody>
                {/* <h4 className="header-title mt-0 mb-3">Bar Chart</h4> */}
                <Chart options={apexBarChartOpts} series={apexBarChartData} type="bar" className="apex-charts" />
            </CardBody>
        </Card>
    );
};

export default BarChart;
