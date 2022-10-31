import React from 'react';
import ExploreChart from './ExploreChart';
import { mockedData, mockedData2, mockedData3 } from './utils';

export default {
    title: 'Charts/ExploreChart',
    component: ExploreChart,
};

export const Default = () => {
    const data = [mockedData, mockedData2, mockedData3];
    return <ExploreChart title={'Chart title'} subTitle={'Chart subtitle'} data={data} />;
};
