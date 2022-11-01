import moment from 'moment';
import { formatConsumptionValue } from '../../helpers/helpers';

export const configBarChartOpts = {
    chart: {
        type: 'bar',
        height: 350,
        toolbar: {
            show: true,
        },
        zoom: {
            enabled: false,
        },
        animations: {
            enabled: false,
        },
    },
    stroke: {
        width: 0.2,
        show: true,
        curve: 'straight',
    },
    dataLabels: {
        enabled: true,
        enabledOnSeries: [1],
    },
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
        marker: {
            show: false,
        },
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
            const { seriesX } = w.globals;
            const timestamp = seriesX[seriesIndex][dataPointIndex];
            let ch = '';
            if (isNaN(parseInt(series[seriesIndex][dataPointIndex])) === false) {
                ch = formatConsumptionValue(series[seriesIndex][dataPointIndex], 4);
            } else {
                ch = '-';
            }
            return `<div class="bar-chart-widget-tooltip">
                    <h6 class="bar-chart-widget-tooltip-title">Energy Consumption</h6>
                    <div class="bar-chart-widget-tooltip-value">
                
                    ${ch} kWh</div>
                    <div class="bar-chart-widget-tooltip-time-period">${moment(timestamp)
                        .tz(timeZone)
                        .format(`MMM D 'YY @ hh:mm A`)}</div>
                </div>`;
        },
    },
    xaxis: {
        labels: {
            formatter: function (val) {
                return moment(val).tz(timeZone).format('MM/DD HH:00');
            },
            hideOverlappingLabels: Boolean,
            rotate: 0,
            trim: false,
        },
        tickAmount: 12,
        axisTicks: {
            show: true,
        },
        style: {
            colors: ['#1D2939'],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
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
    },
    yaxis: {
        labels: {
            formatter: function (val) {
                let print = parseInt(val);
                return `${print}`;
            },
        },
        style: {
            colors: ['#1D2939'],
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-label',
        },
    },
};
