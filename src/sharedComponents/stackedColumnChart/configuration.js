import moment from 'moment';
import _ from 'lodash';
import { chartsBaseConfig } from '../configs/chartsBaseConfig';
import { PLOT_BANDS_TYPE } from '../common/charts/modules/contants';

import colors from '../../assets/scss/_colors.scss';

const options = (props) => {
    const { plotBands } = props;
    const plotBandsData = plotBands
        ?.map(({ background, from, to, borderBottomColor, type }) => {
            switch (type) {
                case PLOT_BANDS_TYPE.off_hours: {
                    return {
                        from,
                        to,
                        color: 'rgb(16 24 40 / 25%)',
                    };
                }
                case PLOT_BANDS_TYPE.after_hours: {
                    return [
                        {
                            from,
                            to,
                            color: {
                                linearGradient: { x1: 1, y1: 1, x2: 1, y2: 0 },
                                stops: [
                                    [0, 'rgba(240, 68, 56, 0.4)'],
                                    [0.07, 'rgba(240, 68, 56, 0.08)'],
                                    [1, 'rgba(240, 68, 56, 0.08)'],
                                ],
                            },
                        },
                        {
                            from,
                            to,
                            color: {
                                linearGradient: { x1: 1, y1: 1, x2: 1, y2: 0 },
                                stops: [
                                    [0, colors.error700],
                                    [0.007, 'rgba(0, 0, 0, 0)'],
                                ],
                            },
                        },
                    ];
                }
            }

            if (Array.isArray(background)) {
                return [
                    {
                        from,
                        to,
                        color: {
                            linearGradient: { x1: 1, y1: 1, x2: 1, y2: 0 },
                            stops: background,
                        },
                    },
                    {
                        from,
                        to,
                        color: {
                            linearGradient: { x1: 1, y1: 1, x2: 1, y2: 0 },
                            stops: [
                                [0, borderBottomColor],
                                [0.007, 'rgba(0, 0, 0, 0)'],
                            ],
                        },
                    },
                ];
            }

            if (typeof background === 'string') {
                return {
                    from,
                    to,
                    color: background,
                };
            }
        })
        .flat();

    const baseConfig = chartsBaseConfig({
        columnType: 'column',
        chartHeight: props.chartHeight || 341,
        colors: props.colors,
        series: props.series,
        categories: props.categories,
        onMoreDetail: props.onMoreDetail,
        tooltipUnit: props.tooltipUnit,
        isLegendsEnabled: props.isLegendsEnabled,
        yAxisWithAssignMeasure: false,
        tooltipValuesKey: '{point.y}',
    });

    return _.merge(
        {
            ...baseConfig,
            plotOptions: {
                column: {
                    stacking: 'normal',
                },
            },

            tooltip: {
                ...baseConfig.tooltip,
                formatter: function (tooltip) {
                    let _this = this;
                    let formatter = (args) => {
                        let momentInstance = moment(args.value);

                        if (props.timeZone) {
                            momentInstance = momentInstance.tz(props.timeZone);
                        }

                        return props.tooltipCallBackValue
                            ? props.tooltipCallBackValue(args)
                            : momentInstance.format(`MMM D 'YY @ hh:mm A`);
                    };

                    _this.points = _this.points.map((point) => ({
                        ...point,
                        key: formatter({ tooltip, _this: this, value: point.key }),
                    }));

                    return tooltip.defaultFormatter.call(_this, tooltip);
                },
            },

            xAxis: {
                ...baseConfig.xAxis,
                labels: {
                    ...baseConfig.xAxis.labels,
                    formatter: function (args) {
                        let value;

                        if (props.xAxisCallBackValue) {
                            value = props.xAxisCallBackValue({ value: this.value, _this: this, args });
                        }

                        return this.axis.defaultLabelFormatter.call(value ? { ...this, value } : this);
                    },
                },
                plotBands: plotBandsData,
            },
        },
        props.restChartProps
    );
};

export { options };
