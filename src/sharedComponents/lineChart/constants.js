import { hexToRgb } from '../../utils/helper';
import { DATAVIZ_COLORS } from '../../constants/colors';

const preparedData = (data) =>
    data.map((el, index) => {
        return {
            type: 'area',
            color: DATAVIZ_COLORS[`datavizMain${index + 1}`],
            data: el,
            lineWidth: 2,
            showInLegend: true,
            panning: true,
            panKey: 'shift',
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, DATAVIZ_COLORS[`datavizMain${index + 1}`]],
                    [1, 'rgba(255,255,255,.01)'],
                ],
            },
        };
    });

export const options = ({ data, dateRange, Highcharts }) => {
    return {
        chart: {
            type: 'line',
            zoomType: 'x',

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
            bottom:40,
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
            style: {
                fontWeight: 'normal',
            },
            snap: 0,
            backgroundColor: 'white',
            borderRadius: 8,
            borderColor: '#8098F9',
            useHTML: true,
            padding: 10,
            border: 1,
            animation: true,
            split: false,
            shared: true,
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
                threshold: null,
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
            gridLineWidth: 1,
            alternateGridColor: '#F2F4F7',
            max: dateRange.maxDate,
            min: dateRange.minDate,
            type: 'datetime',
            labels: {
                format: '{value: %e %b %Y}',
            },
            zoomEnabled: true,
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
            useUTC: false,
        },
        series: preparedData(data),
        exporting: {
            enabled: false,
        },
    };
};
