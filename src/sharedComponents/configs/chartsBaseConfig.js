import { assignMeasureUnit, renderComponents } from '../columnChart/helper';
import Typography from '../typography';
import colorPalette from '../../assets/scss/_colors.scss';
import React from 'react';
import { formatConsumptionValue } from '../helpers/helper';

const chartsBaseConfig = ({
    columnType,
    chartHeight,
    onMoreDetail,
    colors,
    series,
    categories,
    categoryName,
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
        pointFormatter: function () {
            const formattedValue = formatConsumptionValue(this.y, 2);

            return `<tr> <td style="color:${this.series.color};padding:0">
                ${renderComponents(
                    <Typography.Header className="gray-900" size={Typography.Sizes.xs}>
                        content
                    </Typography.Header>
                ).replace('content', `<span style="color:${this.series.color};">${this.series.name}:</span>`)}
                </td><td class="d-flex align-items-center justify-content-end" style="padding:0; gap: 0.25rem;">${renderComponents(
                    <Typography.Header size={Typography.Sizes.xs}>{formattedValue}</Typography.Header>
                )}${renderComponents(
                <Typography.Subheader className="gray-550 mt-1" size={Typography.Sizes.sm}>
                    {tooltipUnit}
                </Typography.Subheader>
            )}</td></tr>`;
        },
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
        title: {
            text: categoryName ? categoryName : 'Category',
            enabled: false,
        },
        categories: categories,
        crosshair: true,
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
        area: {
            turboThreshold: 0,
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
