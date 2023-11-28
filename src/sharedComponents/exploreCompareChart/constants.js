import React from 'react';
import { hexToRgb } from '../../utils/helper';
import { DATAVIZ_COLORS } from '../../constants/colors';
import { renderComponents } from '../columnChart/helper';
import Typography from '../../sharedComponents/typography';
import { formatConsumptionValue } from '../helpers/helper';
import { sampleDataFour, sampleDataOne, sampleDataThree, sampleDataTwo } from './mock';

export const customPreparedData = (data = [], pastData = []) => {
    let comparedDataList = [];

    data.forEach((el, index) => {
        const presentDataObj = {
            name: el?.name,
            data: el?.data,
            xAxis: 0,
            dashStyle: 'Solid',
            color: DATAVIZ_COLORS[`datavizMain${index + 1}`],
        };
        const pastDataObj = {
            name: pastData[index]?.name,
            data: pastData[index]?.data,
            xAxis: 1,
            dashStyle: 'Dash',
            color: DATAVIZ_COLORS[`datavizMain${index + 1}`],
        };
        comparedDataList.push(presentDataObj);
        comparedDataList.push(pastDataObj);
    });

    return comparedDataList;
};

export const multipleLineChartOptions = ({ data = [], pastData = [], tooltipUnit, tooltipLabel }) => {
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
            enabled: false,
            adaptToUpdatedData: false,
            outlineWidth: 0,
            stickToMax: true,
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
            pointFormatter: function () {
                const formattedValue = formatConsumptionValue(this.y, 2);

                return `<tr> <td style='color:${this.series.color};padding:0'>
                    ${renderComponents(
                        <Typography.Header className="gray-900" size={Typography.Sizes.xs}>
                            content
                        </Typography.Header>
                    ).replace('content', `<span style="color:${this.series.color};">${this.series.name}:</span>`)}
                    </td><td class='d-flex align-items-center justify-content-end' style='padding:0; gap: 0.25rem;'>${renderComponents(
                        <Typography.Header size={Typography.Sizes.xs}>{formattedValue}</Typography.Header>
                    )}${renderComponents(
                    <Typography.Subheader className="gray-550 mt-1" size={Typography.Sizes.sm}>
                        {tooltipUnit}
                    </Typography.Subheader>
                )}</td></tr>`;
            },
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
        xAxis: [
            {
                lineWidth: 1,
                ordinal: false,
                gridLineWidth: 0,
                alternateGridColor: false,
                type: 'datetime',
                labels: {
                    format: '{value:%d/%m %I:%M %p}',
                    padding: 10,
                },
            },
            {
                lineWidth: 1,
                ordinal: false,
                gridLineWidth: 0,
                alternateGridColor: false,
                type: 'datetime',
                opposite: true,
                labels: {
                    format: '{value:%d/%m %I:%M %p}',
                    padding: 10,
                },
            },
        ],
        yAxis: [
            {
                gridLineWidth: 1,
                lineWidth: 1,
                opposite: false,
                lineColor: null,
            },
            {
                opposite: true,
                title: false,
                max: 120,
                postFix: '23',
                gridLineWidth: 0,
            },
        ],
        time: {
            useUTC: true,
        },
        series: customPreparedData(data, pastData),
    };
};

export const multipleChartMocks = {
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
        borderWidth: 0,
        className: 'legend-text',
    },
    navigator: {
        enabled: false,
        adaptToUpdatedData: false,
        outlineWidth: 0,
        stickToMax: true,
    },
    exporting: {
        enabled: false,
    },
    plotOptions: {
        series: {
            showInNavigator: true,
            gapSize: 6,
            turboThreshold: 0,
            states: {
                inactive: {
                    opacity: 1,
                },
            },
        },
    },
    tooltip: {
        headerFormat:
            '<div class=\'chart-tooltip\'><div class="typography-wrapper subheader md gray-550" data-reactroot="">Energy Consumption</div><div class="typography-wrapper subheader sm gray-550" data-reactroot="">{point.key}</div> <table>',
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
        xDateFormat: "%e %b '%y @ %I:%M %p",
    },
    rangeSelector: {
        enabled: false,
    },
    xAxis: [
        {
            lineWidth: 1,
            ordinal: false,
            gridLineWidth: 0,
            alternateGridColor: false,
            type: 'datetime',
            labels: {
                format: '{value:%d/%m %I:%M %p}',
                padding: 10,
            },
        },
        {
            lineWidth: 1,
            ordinal: false,
            gridLineWidth: 0,
            alternateGridColor: false,
            type: 'datetime',
            opposite: true,
            labels: {
                format: '{value:%d/%m %I:%M %p}',
                padding: 10,
            },
        },
    ],

    yAxis: [
        {
            gridLineWidth: 1,
            lineWidth: 1,
            opposite: false,
            lineColor: null,
        },
        {
            opposite: true,
            title: false,
            max: 120,
            postFix: '23',
            gridLineWidth: 0,
        },
    ],
    time: {
        useUTC: true,
    },
    series: [
        {
            data: sampleDataOne,
            xAxis: 0, // Assign series to the first x-axis

            name: 'RTU-3 (Sep 1 - Sep 2)',
            color: '#B863CF',
            dashStyle: 'Dash',
        },
        {
            data: sampleDataTwo,
            xAxis: 1, // Assign series to the second x-axis

            name: 'RTU-3 (Sep 3 - Sep 4)',
            color: '#B863CF',
        },
        {
            data: sampleDataThree,
            xAxis: 0, // Assign series to the first x-axis

            name: 'RTU-2 (Sep 1 - Sep 2)',
            color: '#5E94E4',
            dashStyle: 'Dash',
        },
        {
            data: sampleDataFour,
            xAxis: 1, // Assign series to the second x-axis

            name: 'RTU-2 (Sep 3 - Sep 4)',
            color: '#5E94E4',
        },
    ],
};
