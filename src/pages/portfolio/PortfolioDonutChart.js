import React, { useState } from 'react';
import ReactApexChart from 'react-apexcharts';

const PortfolioDonutChart = () => {
    const [series, setSeries] = useState([44, 55, 41, 17]);
    const [options, setOptions] = useState({
        chart: {
            type: 'donut',
        },
        series: [44, 55, 41, 17],
        labels: ['HVAC', 'Lightning', 'Plug', 'Process'],
        colors: ['#3094B9', '#2C4A5E', '#66D6BC', '#3B8554'],
        dataLabels: {
            enabled: false,
        },
        legend: {
            show: false,
        },
        plotOptions: {
            pie: {
                expandOnClick: false,
                donut: {
                    size: '77%',
                    labels: {
                        show: true,
                        showAlways: true,
                        name: {
                            show: true,
                            showAlways: true,
                            fontSize: '22px',
                            fontFamily: 'Rubik',
                            color: '#dfsda',
                            offsetY: -10,
                        },
                        value: {
                            show: true,
                            showAlways: true,
                            fontSize: '16px',
                            fontFamily: 'Helvetica, Arial, sans-serif',
                            color: undefined,
                            offsetY: 16,
                            formatter: function (val) {
                                return val;
                            },
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
            <ReactApexChart options={options} series={series} type="donut" height={150} />
        </>
    );
};

export default PortfolioDonutChart;
