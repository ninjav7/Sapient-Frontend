// @flow
import React from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';

// line column chart
const LineColumnChart = ({ title = 'Line with Data Labels' }) => {
    const apexLineChartWithLables = {
        options: {
            chart: {
                height: 350,
                type: 'line',
            },
            stroke: {
                width: 1,
                show: true,
                curve: 'straight',
            },
            // title: {
            //     text: 'Traffic Sources',
            // },
            dataLabels: {
                enabled: true,
                enabledOnSeries: [1],
            },
            labels: [
                '01 April 2022',
                '02 April 2022',
                '03 April 2022',
                '04 April 2022',
                '05 April 2022',
                '06 April 2022',
                '07 April 2022',
                '08 April 2022',
                '09 April 2022',
                '10 April 2022',
                '11 April 2022',
                '12 April 2022',
            ],
            xaxis: {
                type: 'datetime',
            },
            yaxis: [
                {
                    title: {
                        text: 'Consumption',
                    },
                },
                {
                    opposite: true,
                    title: {
                        text: 'Occupancy',
                    },
                },
            ],
        },
    };

    const apexLineChartWithLablesData = [
        {
            name: 'CONSUMPTION',
            type: 'column',
            data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160],
        },
        {
            name: 'OCCUPANCY',
            type: 'line',
            data: [233, 422, 350, 270, 433, 622, 617, 531, 422, 422, 412, 216],
        },
    ];

    return (
        <Card>
            <CardBody>
                <h4 className="header-title mt-0 mb-3">{title}</h4>
                <Chart
                    options={apexLineChartWithLables}
                    series={apexLineChartWithLablesData}
                    type="line"
                    className="apex-charts"
                />
            </CardBody>
        </Card>
    );
};

export default LineColumnChart;
