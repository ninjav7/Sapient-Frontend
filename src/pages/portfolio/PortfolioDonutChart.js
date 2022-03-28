// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// simple donut chart
const DonutChart = () => {
    const apexDonutOpts = {
        chart: {
            height: 320,
            type: 'pie',
        },
        labels: ['HVAC', 'Lightning', 'Plug', 'Process'],
        colors: ['#3094B9', '#2C4A5E', '#66D6BC', '#3B8554'],
        tooltip: {
            theme: 'dark',
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

    const apexDonutData = [12553, 11553, 6503, 2333];

    return (
        <Card>
            <CardBody>
                <Chart
                    options={apexDonutOpts}
                    series={apexDonutData}
                    type="donut"
                    height={300}
                    className="apex-charts"
                />
            </CardBody>
        </Card>
    );
};

export default DonutChart;
