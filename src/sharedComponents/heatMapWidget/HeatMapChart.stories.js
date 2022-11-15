import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import HeatMapWidget from './index';
import { HeatMapSeriesData, heatMapChartHeight } from './mocks';

export default {
    title: 'Widgets/HeatMapWidget (Shoud be refactored)',
    component: HeatMapWidget,
};

export const Default = () => {
    return (
        <BrowserRouter>
            <HeatMapWidget
                title={'Chart title'}
                subtitle={'Chart subtitle'}
                series={HeatMapSeriesData}
                height={heatMapChartHeight}
                className=""
                labelsPosition={'bottom'}
                toolTipUnit={'kWh'}
                toolTipTitle={'Energy Usage by Hour'}
            />
        </BrowserRouter>
    );
};

Default.args = {
    title: 'Chart title',
    subtitle: 'Chart subtitle',
    series: HeatMapSeriesData,
    height: 125,
    labelsPosition: 'bottom',
    toolTipUnit: 'kWh',
    toolTipTitle: 'Energy Usage by Hou',
};
