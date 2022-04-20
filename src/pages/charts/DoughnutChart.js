import React, { useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

// Chart.Chart.pluginService.register({
//     beforeDraw: function (chart) {
//         if (
//             chart.config.centerText.display !== null &&
//             typeof chart.config.centerText.display !== 'undefined' &&
//             chart.config.centerText.display
//         ) {
//             drawTotals(chart);
//         }
//     },
// });

// function drawTotals(chart) {
//     var width = chart.chart.width,
//         height = chart.chart.height,
//         ctx = chart.chart.ctx;

//     ctx.restore();
//     var fontSize = (height / 114).toFixed(2);
//     ctx.font = fontSize + 'em sans-serif';
//     ctx.textBaseline = 'middle';

//     var text = chart.config.centerText.text,
//         textX = Math.round((width - ctx.measureText(text).width) / 2),
//         textY = height / 2;

//     ctx.fillText(text, textX, textY);
//     ctx.save();
// }

// window.onload = function () {
//     var ctx = document.getElementById('chart-area').getContext('2d');
//     window.myDoughnut = new Chart(ctx, config);
// };

const DoughnutChart = () => {
    const [data, setData] = useState({
        labels: ['HVAC', 'Lightning', 'Plug', 'Process'],
        datasets: [
            {
                data: [12553, 11553, 6503, 2333],
                backgroundColor: [
                    'rgba(48, 148, 185, 1)',
                    'rgba(44, 74, 94, 1)',
                    'rgba(102, 214, 188, 1)',
                    'rgba(59, 133, 84, 1)',
                ],
                borderWidth: 0.1,
                cutout: '90%',
                borderRadius: 20,
            },
        ],
        options: {
            plugins: {
                datalabels: {
                    display: true,
                    backgroundColor: '#ccc',
                    borderRadius: 3,
                    font: {
                        color: 'red',
                        weight: 'bold',
                    },
                },
                doughnutlabel: {
                    labels: [
                        {
                            text: '550',
                            font: {
                                size: 20,
                                weight: 'bold',
                            },
                        },
                        {
                            text: 'total',
                        },
                    ],
                },
            },
        },
        // options: {
        //     responsive: true,
        //     legend: {
        //         display: false,
        //     },
        // },
        // centerText: {
        //     display: true,
        //     text: '280',
        // },
    });

    return (
        <>
            <Doughnut type="doughnut" data={data} />
        </>
    );
};

export default DoughnutChart;
