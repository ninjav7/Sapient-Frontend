import React, { useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import './style.css';

const DoughnutChart = () => {
    const [data, setData] = useState({
        labels: ['HVAC', 'Lightning', 'Plug', 'Process'],
        datasets: [
            {
                label: 'Energy Consumption Total',
                data: [12553, 11553, 6503, 2333],
                backgroundColor: [
                    'rgba(48, 148, 185, 1)',
                    'rgba(44, 74, 94, 1)',
                    'rgba(102, 214, 188, 1)',
                    'rgba(59, 133, 84, 1)',
                ],
                borderWidth: 0.1,
                cutout: '80%',
                pointBackgroundColor: 'rgba(255,206,86,0.2)',
            },
        ],
    });
    return (
        <>
            <div className="">
                <div className="">
                    <Doughnut data={data} height={400} width={400} />
                    <div className="">
                        <div className="">Achieved</div>
                        <div className="">$100,000</div>
                        <div className="">Target: $120,000</div>
                        <div className="">120</div>
                        <div className="">Days left</div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoughnutChart;
