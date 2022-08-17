import moment from 'moment';
import {kFormatter} from "../helpers/helper";

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
            enabled: false,
        },
        // offsetX: -10,
        offsetY: 0,
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
            format: 'dd MMM',
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
            const { labels } = w.globals;
            const timestamp = labels[dataPointIndex];

            return `<div class="line-chart-widget-tooltip">
                    <h6 class="line-chart-widget-tooltip-title">Peak for Time Period</h6>
                    <div class="line-chart-widget-tooltip-value">${series[seriesIndex][dataPointIndex]} kW</div>
                    <div class="line-chart-widget-tooltip-time-period">${moment(timestamp).format(
                        'D/M/YY @ hh:mm A'
                    )}</div>
                </div>`;
        },
    },
    xaxis: {
        type: 'datetime',
        //@TODO NEED?
        // labels: {
        //     format: 'dd/MMM - hh:mm TT',
        // },
        labels: {
            formatter: function (val, timestamp) {
                // return moment(timestamp).format('MMM DD');
                // //@TODO NEED?
                // return moment(timestamp).format('D/M/YY @ hh:mm A');
                return moment(timestamp).format('DD/MMM - HH:mm');
            },
            offsetX: 5,
            trim: true,
        },
        style: {
            fontSize: '12px',
            fontWeight: 600,
            cssClass: 'apexcharts-xaxis-label',
        },

        crosshairs: {
            show: true,
            position: 'front',
            stroke: {
                color: '#F04438',
                width: 2,
                dashArray: 0,
            },
        },
    },
    yaxis: {
        labels: {
            formatter: function (value) {
                var val = Math.abs(value);
                // if (val >= 1000) {
                //     val = (val / 1000).toFixed(0) + ' K';
                // }
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
