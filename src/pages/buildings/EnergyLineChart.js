import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import './style.css';

const EnergyLineChart = () => {
    const [series, setSeries] = useState([
        {
            name: 'Desktops',
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148],
        },
    ]);

    const [options, setOptions] = useState({
        chart: {
            height: 350,
            type: 'line',
            zoom: {
                enabled: false,
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            curve: 'straight',
        },
        title: {
            text: 'Product Trends by Month',
            align: 'left',
        },
        grid: {
            row: {
                colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                opacity: 0.5,
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'],
        },
    });

    return (
        <>
            <div id="chart">
                <ReactApexChart options={options} series={series} type="line" height={350} className="mt-2" />
            </div>
        </>
    );
};

export default EnergyLineChart;
