import moment from 'moment';
import { kFormatter } from '../helpers/helper';
import { formatConsumptionValue } from '../../helpers/helpers';

export const configLineChartWidget = {
    markers: {
        size: -10,
    },
    chart: {
        toolbar: {
            show: false,
        },
        type: 'line',
        zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true,
        },
    },
    animations: {
        enabled: false,
    },
    dataLabels: {
        enabled: false,
    },
    toolbar: {
        show: true,
    },

    colors: ['#5E94E4'],
    stroke: {
        width: [2, 2],
    },
    //@TODO NEED?
    // plotOptions: {
    //     bar: {
    //         columnWidth: '20%',
    //     },
    // },
    tooltip: {
        //@TODO NEED?
        // enabled: false,
        shared: false,
        intersect: false,
        style: {
            fontSize: '12px',
            fontFamily: 'Inter, Arial, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-label',
        },
        x: {
            show: true,
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return moment(timestamp).format('DD/MMM - HH:mm');
                },
            },
        },
        y: {
            formatter: function (value, { series, seriesIndex, dataPointIndex, w }) {
                return value + ' K';
            },
        },
        marker: {
            show: false,
        },
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const { seriesX } = w.globals;
            const timestamp = new Date(seriesX[seriesIndex][dataPointIndex]);

            return `<div class="line-chart-widget-tooltip">
                    <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                    <div class="line-chart-widget-tooltip-value">${formatConsumptionValue(
                        series[seriesIndex][dataPointIndex],
                        0
                    )} kWh</div>
                    <div class="line-chart-widget-tooltip-time-period">${moment(timestamp).format(
                        'D/M/YY @ hh:mm A'
                    )}</div>
                </div>`;
        },
    },
    xaxis: {
        type: 'datetime',
        labels: {
            formatter: function (val, timestamp) {
                return `${moment(timestamp).format('HH:00')}`;
            },
        },
        tickAmount: 9,
        style: {
            fontSize: '12px',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-label',
        },
        crosshairs: {
            show: true,
            position: 'front',
            stroke: {
                color: '#7C879C',
                width: 2,
                dashArray: 0,
            },
        },
        offsetX: 0,
    },
    yaxis: {
        labels: {
            formatter: function (value) {
                var val = Math.abs(value);
                return kFormatter(val);
            },
        },
        style: {
            fontSize: '12px',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-label',
        },
    },
    grid: {
        padding: {
            top: 0,
            right: 10,
            bottom: 0,
            left: 10,
        },
    },
};
