import React from 'react';
import { splat } from 'highcharts';
import _ from 'lodash';

import { tooltipLowMedHighTemplate } from './tooltipLowMedHighTemplate';

import { UNITS } from '../../../../constants/units';
import { LOW_MED_HIGH } from './contants';
import './lowmedhigh.scss';

export const HighchartsLowMedHigh = (H) => {
    const unitTemp = UNITS.F;

    H.wrap(H.Tooltip.prototype, 'defaultFormatter', function (proceed, tooltip) {
        const { items, lowhighmed } = splat(this.points).reduce(
            (acc, item) => {
                if (item.series?.userOptions?.type !== LOW_MED_HIGH) {
                    acc.items.push(item);
                }

                if (item.series?.userOptions?.type === LOW_MED_HIGH) {
                    acc.lowhighmed.push(item);
                }
                return acc;
            },
            { items: [], lowhighmed: [] }
        );

        try {
            let s;

            // Build the header
            s = [tooltip.tooltipFooterHeaderFormatter(items[0])];

            // build the values
            s = s.concat(tooltip.bodyFormatter(items));

            const lowHighMedItem = _.first(lowhighmed);

            if (lowHighMedItem) {
                const { options } = lowHighMedItem.point;
                const lomMedHighHtml = tooltipLowMedHighTemplate({ ...options, unitTemp });

                s.push(lomMedHighHtml);
            }

            // footer
            s.push(tooltip.tooltipFooterHeaderFormatter(items[0], true));

            return s;
        } catch (error) {
            // internal error inside the library
        }
    });

    // Define custom series type for displaying low/med/high values using boxplot as a base
    H.seriesType(
        LOW_MED_HIGH,
        'boxplot',
        {
            keys: ['low', 'median', 'high'],
            legendItem: null,
        },
        {
            // Change point shape to a line with three crossing lines for low/median/high
            // Stroke width is hardcoded to 1 for simplicity
            drawPoints: function () {
                const series = this;

                this.points.forEach(function (point) {
                    let graphic = point.graphic,
                        verb = graphic ? 'animate' : 'attr',
                        shapeArgs = point.shapeArgs,
                        width = shapeArgs.width,
                        left = Math.floor(shapeArgs.x) + 0.5,
                        right = left + width,
                        crispX = left + Math.round(width / 2) + 0.5,
                        highPlot = Math.floor(point.highPlot) + 0.5,
                        medianPlot = Math.floor(point.medianPlot) + 0.5,
                        // Sneakily draw low marker even if 0
                        lowPlot = Math.floor(point.lowPlot) + 0.5 - (point.low === 0 ? 1 : 0);

                    if (point.isNull) {
                        return;
                    }

                    if (!graphic) {
                        point.graphic = graphic = series.chart.renderer.path('point').add(series.group);
                    }

                    graphic.attr({
                        stroke: point.color || series.color,
                        'stroke-width': 1,
                    });

                    graphic[verb]({
                        d: [
                            'M',
                            left,
                            highPlot,
                            'H',
                            right,
                            'M',
                            left,
                            medianPlot,
                            'H',
                            right,
                            'M',
                            left,
                            lowPlot,
                            'H',
                            right,
                            'M',
                            crispX - 1.3,
                            highPlot,
                            'V',
                            lowPlot,
                        ],
                    });
                });
            },
        }
    );
};
