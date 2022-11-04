import React from 'react';
import LineChart from './LineChart';
import { mockedData, mockedData2, mockedData3 } from './utils';
export default {
    title: 'Charts/LineChart',
    component: LineChart,
};

export const Default = () => {
    const data = [mockedData, mockedData2, mockedData3];
    return <LineChart title={'Chart title'} subTitle={'Chart subtitle'} data={data} />;
};
