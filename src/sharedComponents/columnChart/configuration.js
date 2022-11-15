import React from 'react';

import Typography from '../typography';

import { assignMeasureUnit, renderComponents } from './helper';
import { chartsBaseConfig } from '../configs/chartsBaseConfig';

export const options = (props) => ({
    ...chartsBaseConfig({
        columnType: 'column',
        chartHeight: props.chartHeight || 341,
        colors: props.colors,
        series: props.series,
        categories: props.categories,
        onMoreDetail: props.onMoreDetail,
        tooltipUnit: props.tooltipUnit,
    }),
});
