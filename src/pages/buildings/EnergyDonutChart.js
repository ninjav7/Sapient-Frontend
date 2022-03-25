import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { Card, CardBody } from 'reactstrap';
import './style.css';

const EnergyDonutChart = () => {
    const [series, setSeries] = useState([44, 55, 41, 17, 15]);
    const [options, setOptions] = useState({
        chart: {
            type: 'donut',
        },
        responsive: [
            {
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200,
                    },
                    legend: {
                        position: 'bottom',
                    },
                },
            },
        ],
    });

    return (
        <>
            <Card>
                <CardBody>
                    <Chart
                        options={options}
                        series={series}
                        type="donut"
                        width={425}
                        height={350}
                        className="apex-charts"
                    />
                </CardBody>
            </Card>
        </>
    );
};

export default EnergyDonutChart;
