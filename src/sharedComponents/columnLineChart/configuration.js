import React from 'react';
import _ from 'lodash';
import moment from 'moment';


import { chartsBaseConfig } from '../configs/chartsBaseConfig';
import { LOW_MED_HIGH, PLOT_BANDS_TYPE } from '../common/charts/modules/contants';

import colors from '../../assets/scss/_colors.scss';

export const options = (props) => {
    const { plotBands, carbonUnits } = props;
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

    const baseConfigEnergy = chartsBaseConfig({
        columnType: 'column',
        chartHeight: props.chartHeight || 341,
        colors: props.colors,
        series: props?.series,
        categories: props.categories,
        onMoreDetail: props.onMoreDetail,
        yAxisWithAssignMeasure: false,
        tooltipValuesKey: props.tooltipValuesKey ? props.tooltipValuesKey : '{point.y}',
    });
    return _.merge(
        baseConfigEnergy,
        _.merge(
            {
                tooltip: {
                    shared: true,
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
                        formatter: function (val) {
                            return moment.utc(val.value).format('ddd - MMM D');
                        },
                    },
                    plotBands: plotBandsData,
                },
                yAxis: [
                    {
                        title: {
                            text: '',
                        },
                        labels: {
                            format: '{value} KWh',
                        },
                    },
                    {
                        title: {
                            text: carbonUnits == 'si' ? ' kgs/MWh' : ' lbs/MWh',
                            align: 'low',
                            rotation: 0,
                            y: -10,
                            reserveSpace: false,
                        },
                        labels: {
                            format: `{value}${carbonUnits == 'si' ? ' kgs/MWh' : ' lbs/MWh'}`,
                        },
                        opposite: true,
                    },
                ],
            },
            props?.restChartProps
        )
    );
};
