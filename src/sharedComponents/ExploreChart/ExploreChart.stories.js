import React from 'react';
import ExploreChart from './ExploreChart';
import { mockedData, mockedData2, mockedData3 } from './mock';

export default {
    title: 'Charts/ExploreChart',
    component: ExploreChart,
};

export const Default = () => {
    const data = [mockedData, mockedData2, mockedData3];
    const dateRange = {
        minDate: new Date('2022-09-1').getTime(),
        maxDate: new Date('2022-11-1').getTime(),
    };

    return <ExploreChart title={'Chart title'} subTitle={'Chart subtitle'} data={data} dateRange={dateRange} />;
};
