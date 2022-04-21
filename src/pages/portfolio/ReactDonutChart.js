import React, { useState } from 'react';
import DonutChart from 'react-donut-chart';

const ReactDonutChart = () => {
    const [data, setData] = useState([
        {
            label: 'A',
            value: 25,
        },
        {
            label: 'B',
            value: 75,
        },
    ]);

    return (
        <>
            <DonutChart data={data} height={350} width={350} />;
        </>
    );
};

export default ReactDonutChart;
