// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple donut chart
const DonutChart = () => {
    const options = {
        chart: {
            type: 'donut',
        },
        labels: ['HVAC', 'Lightning', 'Plug', 'Process'],
        colors: ['#3094B9', '#2C4A5E', '#66D6BC', '#3B8554'],
        series: [12553, 11553, 6503, 2333],
        plotOptions: {
            pie: {
                expandOnClick: false,
                size: 200,
                donut: {
                    size: '77%',
                    labels: {
                        show: true,
                        // name: {
                        //     show: true,
                        //     fontSize: '22px',
                        //     fontFamily: undefined,
                        //     color: '#dfsda',
                        //     offsetY: -10,
                        // },
                        value: {
                            show: true,
                            fontSize: '16px',
                            color: '#d14065',
                            offsetY: 16,
                            // formatter: function (val) {
                            //     return val;
                            // },
                        },
                        total: {
                            show: true,
                            showAlways: true,
                            label: 'Total',
                            color: '#373d3f',
                            formatter: function (w) {
                                return w.globals.seriesTotals.reduce((a, b) => {
                                    return a + b;
                                }, 0);
                            },
                        },
                    },
                },
            },
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 300,
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            theme: 'dark',
            x: { show: false },
        },
        legend: {
            show: false,
        },
        stroke: {
            width: 0,
        },

        itemMargin: {
            horizontal: 10,
        },
        dataLabels: {
            enabled: false,
        },
    };

    const series = [12553, 11553, 6503, 2333];

    return (
        <Card>
            <CardBody>
                <Chart options={options} series={series} type="donut" height={200} className="apex-charts" />
            </CardBody>
        </Card>
    );
};

export default DonutChart;
