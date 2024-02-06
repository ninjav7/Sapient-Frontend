import React from 'react';
import moment from 'moment';
import _ from 'lodash';
import { chartsBaseConfig } from '../configs/chartsBaseConfig';
import { PLOT_BANDS_TYPE } from '../common/charts/modules/contants';
import Typography from '../typography';
import { renderComponents } from '../columnChart/helper';
import { formatConsumptionValue } from '../helpers/helper';

import colors from '../../assets/scss/_colors.scss';

const options = (props) => {
    const { plotBands, tooltipUnit, ownTooltip } = props;
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
                    borderRadius: props?.borderRadius ?? 0,
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
                ...(ownTooltip && {
                    pointFormatter: function () {
                        const formattedValue = formatConsumptionValue(this.y, 2);

                        return `<tr> <td style="color:${this.series.color};padding:0">
                        ${renderComponents(
                            <Typography.Header className="gray-900" size={Typography.Sizes.xxs}>
                                content
                            </Typography.Header>
                        ).replace('content', `<span style="color:${this.series.color};">${this.series.name}:</span>`)}
                        </td><td class="d-flex align-items-center justify-content-end" style="padding:0; gap: 0.25rem;">${renderComponents(
                            <Typography.Header size={Typography.Sizes.xxs}>{formattedValue}</Typography.Header>
                        )}${renderComponents(
                            <Typography.Subheader className="gray-550 mt-1" size={Typography.Sizes.xxs}>
                                {tooltipUnit}
                            </Typography.Subheader>
                        )}</td></tr>`;
                    },
                }),
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
