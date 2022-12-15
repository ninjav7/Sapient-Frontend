import React from 'react';
import LineChart from './LineChart';
import { mockedData, mockedData2, mockedData3 } from './mock';
export default {
    title: 'Charts/LineChart',
    component: LineChart,
};

const data = [
    { name: 'MockedData1', data: mockedData },
    { name: 'MockedData2', data: mockedData2 },
    { name: 'MockedData3', data: mockedData3 },
    { name: 'MockedData4', data: mockedData3 },
    { name: 'MockedData5', data: mockedData3 },
    { name: 'MockedData6', data: mockedData3 },
];
const dateRange = {
    minDate: new Date('2022-09-1').getTime(),
    maxDate: new Date('2022-11-1').getTime(),
};
export const Default = (args) => <LineChart {...args} />;

Default.args = {
    title: 'Chart title',
    subTitle: 'Chart subtitle',
    data,
    dateRange,
    handleMoreClick: () => console.log('Clicked'),
};
