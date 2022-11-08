import React from 'react';
import BarChartWidget from './index';

export default {
    title: 'Widgets/BarChartWidget',
    component: BarChartWidget,
};

const barChartMock = [
    {
        name: 'Test',
        data: [
            {
                x: new Date('2022-10-1').getTime(),
                y: 22000,
            },
            {
                x: new Date('2022-10-2').getTime(),
                y: 25000,
            },
            {
                x: new Date('2022-10-3').getTime(),
                y: 21500,
            },
            {
                x: new Date('2022-10-4').getTime(),
                y: 23000,
            },
            {
                x: new Date('2022-10-5').getTime(),
                y: 20000,
            },
        ],
    },
];

export const Default = () => {
    return <BarChartWidget subtitle="Subtitle" series={barChartMock} title="Title" />;
};
