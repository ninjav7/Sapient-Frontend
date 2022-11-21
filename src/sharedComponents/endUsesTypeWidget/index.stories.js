import React from 'react';
import EndUsesTypeWidget from './index';

export default {
    title: 'Components/EndUsesType Widget',
    component: EndUsesTypeWidget,
};

const lineChartMock = [
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
    return <EndUsesTypeWidget subtitle="Subtitle" series={lineChartMock} title="Title" />;
};
