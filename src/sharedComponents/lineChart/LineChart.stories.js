import React from 'react';
import LineChart from './LineChart';
import { mockedData, mockedData2, mockedData3 } from './mock';
export default {
    title: 'Charts/LineChart',
    component: LineChart,
};

export const Default = () => {
    const data = [mockedData, mockedData2, mockedData3];
    const dateRange = {
        minDate: new Date('2022-09-1').getTime(),
        maxDate: new Date('2022-11-1').getTime(),
    };

    return <LineChart title={'Chart title'} subTitle={'Chart subtitle'} data={data} dateRange={dateRange} />;
};
