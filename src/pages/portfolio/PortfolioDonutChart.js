// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple donut chart
const DonutChart = () => {
    const options = {
        chart: {
            type: 'donut',
            height: 300,
        },
        labels: ['HVAC', 'Lightning', 'Plug', 'Process'],
        colors: ['#3094B9', '#2C4A5E', '#66D6BC', '#3B8554'],
        dataLabels: {
            enabled: false,
        },
        tooltip: {
            theme: 'light',
            x: { show: false },
        },
        legend: {
            show: true,
            position: 'bottom',
            horizontalAlign: 'center',
            verticalAlign: 'middle',
            floating: false,
            fontSize: '12px',
            offsetX: 0,
            offsetY: -10,
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '78px',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            showAlways: true,
                            fontSize: '24px',
                            // color: '#2787AB',
                        },
                    },
                },
            },
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: {
                        height: 240,
                    },
                    legend: {
                        show: false,
                    },
                },
            },
        ],
    };

    const series = [12553, 11553, 6503, 2333];

    return (
        <Card>
            <CardBody>
                <Chart options={options} series={series} type="donut" height={300} className="apex-charts" />
            </CardBody>
        </Card>
    );
};

export default DonutChart;
