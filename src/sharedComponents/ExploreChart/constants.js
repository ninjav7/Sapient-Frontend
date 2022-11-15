import { hexToRgb } from '../../utils/helper';
import { DATAVIZ_COLORS } from '../../constants/colors';

const preparedData = (data) =>
    data.map((el, index) => {
        return {
            type: 'line',
            color: DATAVIZ_COLORS[`datavizMain${index + 1}`],
            data: el,
            lineWidth: 2,
            showInLegend: true,
        };
    });

export const options = ({ data, dateRange }) => {
    return {
        chart: {
            type: 'line',
            alignTicks: false,
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
        rangeSelector: {
            enabled: false,
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
            },
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

        scrollbar: {
            enabled: false,
        },

        xAxis: {
            lineWidth: 1,
            ordinal: false,
            gridLineWidth: 1,
            max: dateRange.maxDate,
            min: dateRange.minDate,
            alternateGridColor: '#F2F4F7',
            type: 'datetime',
            labels: {
                format: '{value: %e %b %Y}',
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
            useUTC: false,
        },
        series: preparedData(data),
    };
};
