import { assignMeasureUnit, renderComponents } from '../columnChart/helper';
import Typography from '../typography';
import colorPalette from '../../assets/scss/_colors.scss';
import React from 'react';

const chartsBaseConfig = ({
    columnType,
    chartHeight,
    onMoreDetail,
    colors,
    series,
    categories,
    tooltipUnit,
    yAxisWithAssignMeasure = true,
    isLegendsEnabled = true,
    tooltipValuesKey = '{point.y:.1f}',
}) => ({
    chart: {
        type: columnType,
        height: chartHeight || 341,
        spacing: [10, 5, 15, 5],
        components: {
            chartMenu: null,
        },
    },

    title: {
        text: '',
    },

    legend: isLegendsEnabled
        ? {
              align: onMoreDetail ? 'left' : 'center',
              useHTML: true,
              labelFormat: renderComponents(
                  <Typography.Subheader
                      size={Typography.Sizes.sm}
                      className="gray-550"
                      style={{ fill: colorPalette.primaryGray550 }}>
                      {'{name}'}
                  </Typography.Subheader>
              ),
              itemMarginTop: 22,
              x: -5,
              symbolWidth: 10,
          }
        : {
              enabled: false,
          },

    tooltip: {
        headerFormat: `<div class="chart-tooltip">${renderComponents(
            <Typography.Subheader size={Typography.Sizes.sm} className="gray-550 tooltip-header">
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
                <Typography.Header size={Typography.Sizes.xs}>{tooltipValuesKey}</Typography.Header>
            )}${renderComponents(
            <Typography.Subheader className="gray-550 mt-1" size={Typography.Sizes.sm}>
                {tooltipUnit}
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

    xAxis: {
        categories: categories,
        crosshair: true,
        tickAmount: 10,
        labels: {
            format: renderComponents(
                <Typography.Subheader
                    size={Typography.Sizes.sm}
                    className="gray-550"
                    style={{ fill: colorPalette.primaryGray550 }}>
                    {'{text}'}
                </Typography.Subheader>
            ),
        },
    },
    yAxis: {
        title: null,
        labels: {
            format: renderComponents(
                <Typography.Subheader
                    size={Typography.Sizes.sm}
                    className="gray-550"
                    style={{ fill: colorPalette.primaryGray550 }}>
                    {'{text}'}
                </Typography.Subheader>
            ),
            formatter: function (args) {
                const { axis, value } = args;

                const { numberFormatter } = axis.chart;

                const formattedValue = numberFormatter(value || 0, -1);

                return renderComponents(
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="gray-550"
                        style={{ fill: colorPalette.primaryGray550 }}>
                        {yAxisWithAssignMeasure ? assignMeasureUnit(formattedValue) : formattedValue}
                    </Typography.Subheader>
                );
            },
        },
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

    navigation: {
        buttonOptions: {
            enabled: false,
        },
    },
    colors,
    series,
});

export { chartsBaseConfig };
