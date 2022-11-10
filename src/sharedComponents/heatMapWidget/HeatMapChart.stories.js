import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import HeatMapWidget from './index';
import { HeatMapChartOpts, HeatMapSeriesData, heatMapChartHeight } from './utils';

export default {
    title: 'Widgets/HeatMapChartWidget',
    component: HeatMapWidget,
};

export const Default = () => {
    return (
        <BrowserRouter>
            <HeatMapWidget
                title={'Chart title'}
                subtitle={'Chart subtitle'}
                options={HeatMapChartOpts}
                series={HeatMapSeriesData}
                height={heatMapChartHeight}
            />
        </BrowserRouter>
    );
};

Default.args = {
    title: 'Chart title',
    subtitle: 'Chart subtitle',
    options: HeatMapChartOpts,
    series: HeatMapSeriesData,
};
