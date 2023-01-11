import React from 'react';
import { hexToRgb } from '../../utils/helper';
import { DATAVIZ_COLORS } from '../../constants/colors';
import { renderComponents } from '../columnChart/helper';
import Typography from '../../sharedComponents/typography';
import colors from '../../assets/scss/_colors.scss';

export const PLOT_BANDS_TYPE = Object.freeze({
    off_hours: 'off_hours',
    after_hours: 'after_hours'
});

const preparedData = (data) => {
    return data.map((el, index) => {
        return {
            type: 'area',
            color: DATAVIZ_COLORS[`datavizMain${index + 1}`],
            data: el.data,
            name: el.name,
            lineWidth: 2,
            showInLegend: true,
            panning: true,
            panKey: 'shift',
            fillColor: el.fillColor
                ? el.fillColor
                : {
                      linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                      stops: [
                          [0, DATAVIZ_COLORS[`datavizMain${index + 1}`]],
                          [1, 'rgba(255,255,255,.01)'],
                      ],
                  },
        };
    });
};

export const options = ({ data, dateRange, Highcharts, tooltipUnit, tooltipLabel, widthOfWrapper, plotBands }) => {
    const plotBandsData = plotBands
        ?.map(({ background, from, to, borderBottomColor, type }) => {
            switch (type) {
                case PLOT_BANDS_TYPE.off_hours: {
                    return {
                        from,
                        to,
                        color: 'rgb(16 24 40 / 25%)',
                    }
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

    return {
        chart: {
            type: 'line',
            zoomType: 'x',
            marginBottom: 100,
            animation: {
                duration: 1000,
            },
        },
        navigator: {
            enabled: false,
        },
        legend: {
            enabled: true,
            align: 'left',
            bottom: 0,
            width: widthOfWrapper,
            itemMarginTop: 8,
            itemDistance: 0,
            useHTML: true,
            labelFormatter: function () {
                let color = hexToRgb(this.color);
                if (!this.visible) {
                    color = { r: 204, g: 204, b: 204 };
                }
                var symbol = `<span class="chart-legend-symbol" style="background: rgba(${color.r},${color.g},${color.b},1) 0% 0% no-repeat padding-box;"></span>`;
                return `<span class="chart-legend-wrapper">${symbol} ${this.name}</span>`;
            },
            borderWidth: 0,
            className: 'legend-text',
        },

        tooltip: {
            headerFormat: `<div class="chart-tooltip">${renderComponents(
                <>
                    <Typography.Subheader size={Typography.Sizes.md} className="gray-550">
                        {tooltipLabel && tooltipLabel}
                    </Typography.Subheader>
                    <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                        {'{point.key}'}
                    </Typography.Subheader>
                </>
            )} <table>`,
            pointFormat: `<tr> <td style="color:{series.color};padding:0">
                ${renderComponents(
                    <Typography.Header className="gray-900" size={Typography.Sizes.xs}>
                        content
                    </Typography.Header>
                ).replace('content', '<span style="color:{series.color};">{series.name}:</span>')}
                </td><td class="d-flex align-items-center justify-content-end" style="padding:0; gap: 0.25rem;">${renderComponents(
                    <Typography.Header size={Typography.Sizes.xs}>{'{point.y:.2f}'}</Typography.Header>
                )}${renderComponents(
                <Typography.Subheader className="gray-550 mt-1" size={Typography.Sizes.sm}>
                    {tooltipUnit}
                </Typography.Subheader>
            )}</td></tr>`,
            footerFormat: '</table></div>',
            split: false,
            shared: true,
            useHTML: true,
            snap: 0,
            shape: 'div',
            padding: 0,
            borderWidth: 0,
            shadow: 0,
            borderRadius: '0.25rem',
        },
        rangeSelector: {
            enabled: false,
        },
        plotOptions: {
            area: {
                fillColor: {
                    linearGradient: {
                        x1: 0,
                        y1: 0,
                        x2: 0,
                        y2: 1,
                    },
                    stops: [
                        [0, Highcharts.getOptions().colors[0]],
                        [1, Highcharts.color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')],
                    ],
                },
                marker: {
                    radius: 2,
                },
                lineWidth: 1,
                states: {
                    hover: {
                        lineWidth: 1,
                    },
                },
                turboThreshold: 0,
            },
        },
        credits: {
            enabled: false,
        },
        scrollbar: {
            enabled: false,
        },
        xAxis: {
            lineWidth: 1,
            ordinal: false,
            gridLineWidth: plotBands ? 0 : 1,
            alternateGridColor: plotBands ? undefined : colors.primaryGray100,
            max: dateRange.maxDate,
            min: dateRange.minDate,
            type: 'datetime',
            labels: {
                format: '{value: %e %b `%y}',
            },
            zoomEnabled: true,
            plotBands: plotBandsData,
        },
        yAxis: {
            gridLineWidth: 1,
            lineWidth: 1,
            opposite: false,
            accessibility: {
                enabled: true,
            },
        },

        time: {
            useUTC: true,
        },
        series: preparedData(data),
        exporting: {
            enabled: false,
        },
    };
};
