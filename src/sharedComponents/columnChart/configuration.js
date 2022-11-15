import React from 'react';

import Typography from '../typography';

import { assignMeasureUnit, renderComponents } from './helper';

export const options = ({ props }) => ({
    chart: {
        type: 'column',
        height: props.chartHeight || 341,
        spacing: [10, 5, 15, 5],
        components: {
            chartMenu: null,
        },
    },

    navigation: {
        buttonOptions: {
            enabled: false,
        },
    },

    legend: {
        align: props.onMoreDetail ? 'left' : 'center',
        useHTML: true,
        labelFormat: renderComponents(
            <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                {'{name}'}
            </Typography.Subheader>
        ),
        itemMarginTop: 22,
        x: -5,
        symbolWidth: 10,
    },

    xAxis: {
        categories: props.categories,
        crosshair: true,
        labels: {
            format: renderComponents(
                <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                    {'{text}'}
                </Typography.Subheader>
            ),
        },
    },
    title: {
        text: '',
    },
    yAxis: {
        title: null,
        labels: {
            format: renderComponents(
                <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                    {'{text}'}
                </Typography.Subheader>
            ),
            formatter: function (args) {
                const { axis, value } = args;

                const { numberFormatter } = axis.chart;

                return renderComponents(
                    <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                        {assignMeasureUnit(numberFormatter(value || 0, -1))}
                    </Typography.Subheader>
                );
            },
        },
    },
    tooltip: {
        headerFormat: `<div class="chart-tooltip">${renderComponents(
            <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                {'{point.key}'}
            </Typography.Subheader>
        )} <table>`,
        pointFormat: `<tr> <td style="color:{series.color};padding:0">
            ${renderComponents(
                <Typography.Header className="gray-900" size={Typography.Sizes.xs}>
                    content
                </Typography.Header>
            ).replace('content', '<span style="color:{series.color};">{series.name}:</span>')}
            </td><td class="d-flex align-items-center justify-content-end" style="padding:0; gap: 0.25rem;">${renderComponents(
                <Typography.Header size={Typography.Sizes.xs}>{'{point.y:.1f}'}</Typography.Header>
            )}${renderComponents(
            <Typography.Subheader className="gray-550 mt-1" size={Typography.Sizes.sm}>
                {props.tooltipUnit}
            </Typography.Subheader>
        )}</td></tr>`,
        footerFormat: '</table></div>',
        shared: true,
        useHTML: true,
        shape: 'div',
        padding: 0,
        borderWidth: 0,
        shadow: 0,
        borderRadius: '0.25rem',
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0,
        },
    },
    credits: {
        enabled: false,
    },
    colors: props.colors,
    series: props.series,
});
