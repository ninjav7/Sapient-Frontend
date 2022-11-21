import React from 'react';
import EndUsesTypeWidget from './index';
import { endUsesKPIsData, options, chartSeries } from './mock';

export default {
    title: 'Widgets/EndUsesType Widget',
    component: EndUsesTypeWidget,
};
export const Default = () => {
    return <EndUsesTypeWidget endUsesData={endUsesKPIsData} barChartOptions={options} barChartData={chartSeries} />;
};
