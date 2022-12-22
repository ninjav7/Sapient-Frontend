import _ from 'lodash';
import { chartsBaseConfig } from '../configs/chartsBaseConfig';

const options = (props) => (_.merge({
    ...chartsBaseConfig({
        columnType: 'column',
        chartHeight: props.chartHeight || 341,
        colors: props.colors,
        series: props.series,
        categories: props.categories,
        onMoreDetail: props.onMoreDetail,
        tooltipUnit: props.tooltipUnit,
    }),

    plotOptions: {
        column: {
            stacking: 'normal',
        },
    },
}, props.restChartProps));

export { options };
