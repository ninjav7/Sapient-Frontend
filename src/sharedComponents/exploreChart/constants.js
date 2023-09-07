import React from 'react';
import { hexToRgb } from '../../utils/helper';
import { DATAVIZ_COLORS } from '../../constants/colors';
import { renderComponents } from '../columnChart/helper';
import Typography from '../../sharedComponents/typography';
export const preparedData = (data) => {
    const result = data.map((el, index) => {
        return {
            type: 'line',
            name: el.name,
            color: DATAVIZ_COLORS[`datavizMain${index + 1}`],
            data: el.data,
            lineWidth: 2,
            showInLegend: true,
        };
    });
    return result;
};

export const options = ({ data, series, dateRange, tooltipUnit, tooltipLabel, widgetProps }) => {
    return {
        chart: {
            type: 'line',
            animation: {
                duration: 1000,
            },
        },
        credits: {
            enabled: false,
        },
        legend: {
            enabled: true,
            align: 'left',
            useHTML: true,
            itemDistance: 0,
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
        navigator: {
            enabled: true,
            adaptToUpdatedData: true,
        },
        exporting: {
            enabled: false,
        },
        plotOptions: {
            series: {
                showInNavigator: true,
                gapSize: 6,
                turboThreshold: 0,
            },
        },
        tooltip: {
            headerFormat: `<div class='chart-tooltip'>${renderComponents(
                <>
                    <Typography.Subheader size={Typography.Sizes.md} className="gray-550">
                        {tooltipLabel && tooltipLabel}
                    </Typography.Subheader>
                    <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                        {'{point.key}'}
                    </Typography.Subheader>
                </>
            )} <table>`,
            pointFormat: `<tr> <td style='color:{series.color};padding:0'>
                ${renderComponents(
                    <Typography.Header className="gray-900" size={Typography.Sizes.xs}>
                        content
                    </Typography.Header>
                ).replace('content', '<span style="color:{series.color};">{series.name}:</span>')}
                </td><td class='d-flex align-items-center justify-content-end' style='padding:0; gap: 0.25rem;'>${renderComponents(
                    <Typography.Header size={Typography.Sizes.xs}>{'{point.y:.2f}'}</Typography.Header>
                )}${renderComponents(
                <Typography.Subheader className="gray-550 mt-1" size={Typography.Sizes.sm}>
                    {tooltipUnit}
                </Typography.Subheader>
            )}</td></tr>`,
            footerFormat: '</table></div>',
            shared: true,
            split: false,
            snap: 0,
            useHTML: true,
            shape: 'div',
            padding: 0,
            borderWidth: 0,
            shadow: 0,
            borderRadius: '0.25rem',
        },
        rangeSelector: {
            enabled: false,
        },

        scrollbar: {
            enabled: false,
        },

        xAxis: {
            lineWidth: 1,
            ordinal: false,
            gridLineWidth: 1,
            max: dateRange?.maxDate,
            min: dateRange?.minDate,
            alternateGridColor: !widgetProps.disableDefaultPlotBands && '#F2F4F7',
            type: 'datetime',
            labels: {
                format: '{value: %e %b `%y}',
                padding: 10,
            },
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
        series: series || preparedData(data),
    };
};
