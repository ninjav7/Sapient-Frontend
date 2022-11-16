import { chartsBaseConfig } from '../configs/chartsBaseConfig';

const options = (props) => ({
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
});

export { options };
