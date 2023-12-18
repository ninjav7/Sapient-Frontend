import React from 'react';
import _ from 'lodash';
import moment from 'moment';

import Typography from '../typography';

import { chartsBaseConfig } from '../configs/chartsBaseConfig';
import { renderComponents } from './helper';
import { LOW_MED_HIGH, PLOT_BANDS_TYPE } from '../common/charts/modules/contants';

import colors from '../../assets/scss/_colors.scss';

// refer doc https://api.highcharts.com/highcharts/series.line
const tempSeries = (data) =>
    data.map((s) => ({
        ...s,
        type: 'line',
        //HIGH MED LOW
        typeOfValue: s.type,
        group: LOW_MED_HIGH,
        marker: false,
        lineWidth: 1,
        showInLegend: false,
        yAxis: 1,
        zIndex: -1,
        states: {
            hover: {
                enabled: false,
            },
            inactive: {
                opacity: 1,
            },
        },
    }));

export const options = (props) => {
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
        series: [...props?.series, ...tempSeries(props?.temperatureSeries || [])],
        categoryName: props.categoryName,
        categories: props.categories,
        onMoreDetail: props.onMoreDetail,
        tooltipUnit: props.tooltipUnit,
        yAxisWithAssignMeasure: false,
        tooltipValuesKey: props.tooltipValuesKey ? props.tooltipValuesKey : '{point.y}',
    });

    return _.merge(
        baseConfig,
        _.merge(
            {
                tooltip: {
                    formatter: function (tooltip) {
                        try {
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
                        } catch (e) {
                            //seems internal error in the chart itself
                        }
                    },
                },
                xAxis: {
                    labels: {
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
                yAxis: [
                    baseConfig.yAxis,
                    {
                        ...baseConfig.yAxis,
                        opposite: true,
                        labels: {
                            formatter: function (args) {
                                const { axis, value } = args;

                                const { numberFormatter } = axis.chart;

                                const formattedValue = numberFormatter(value || 0, -1);

                                return renderComponents(
                                    <Typography.Subheader
                                        size={Typography.Sizes.sm}
                                        className="gray-550"
                                        style={{ fill: colors.primaryGray550 }}>
                                        {formattedValue} {props.tempUnit}
                                    </Typography.Subheader>
                                );
                            },
                        },
                    },
                ],
            },
            props?.restChartProps
        )
    );
};
