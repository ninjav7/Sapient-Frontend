import moment from 'moment';
import 'moment-timezone';

export const options = {
    chart: {
        id: 'chart2',
        type: 'line',
        height: '1000px',
        toolbar: {
            show: true,
            offsetX: 0,
            offsetY: 0,
            tools: {
                download: true,
                selection: false,
                zoom: false,
                zoomin: false,
                zoomout: false,
                pan: false,
                reset: false,
            },
            export: {
                csv: {
                    filename: "Explore_Portfolio_View" + new Date(),
                    columnDelimiter: ',',
                    headerCategory: 'Timestamp',
                    headerValue: 'value',
                    dateFormatter(timestamp) {
                        return moment
                            .utc(timestamp)
                            .format(`MMM D 'YY @ hh:mm A`)
                    }
                },
                svg: {
                    filename: "Explore_Portfolio_View" + new Date(),
                },
                png: {
                    filename: "Explore_Portfolio_View" + new Date(),
                }
            },
            autoSelected: 'zoom'
        },
        animations: {
            enabled: false,
        },
        zoom: {
            type: 'x',
            enabled: true,
            autoScaleYaxis: true,
        },
    },
    dataLabels: {
        enabled: true,
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        showForSingleSeries: true,
        showForNullSeries: false,
        showForZeroSeries: true,
        fontSize: '18px',
        fontFamily: 'Helvetica, Arial',
        fontWeight: 600,
        itemMargin: {
            horizontal: 30,
            vertical: 20,
        },
    },
    colors: ['#546E7A'],
    stroke: {
        width: 3,
    },
    dataLabels: {
        enabled: false,
    },
    colors: [
        '#3C6DF5',
        '#12B76A',
        '#DC6803',
        '#088AB2',
        '#EF4444',
        '#800000',
        '#FFA500',
        '#0AFFFF',
        '#033E3E',
        '#E2F516',
    ],
    fill: {
        opacity: 1,
        colors: [
            '#3C6DF5',
            '#12B76A',
            '#DC6803',
            '#088AB2',
            '#EF4444',
            '#800000',
            '#FFA500',
            '#0AFFFF',
            '#033E3E',
            '#E2F516',
        ],
    },
    markers: {
        size: 0,

    },
    tooltip: {
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
            const { colors } = w.globals;
            const { seriesX } = w.globals;
            const { seriesNames } = w.globals;
            const timestamp = seriesX[seriesIndex][dataPointIndex];
            let ch = '';
            ch =
                ch +
                `<div class="line-chart-widget-tooltip-time-period" style="margin-bottom:10px;">${moment
                    (seriesX[0][dataPointIndex])
                    .format(`MMM D 'YY @ hh:mm A`)}</div><table style="border:none;">`;
            for (let i = 0; i < series.length; i++) {
                if (isNaN(parseInt(series[i][dataPointIndex])) === false)
                    ch =
                        ch +
                        `<tr style="style="border:none;"><td><span class="tooltipclass" style="background-color:${colors[i]
                        };"></span> &nbsp;${seriesNames[i]} </td><td> &nbsp;${parseInt(
                            series[i][dataPointIndex]
                        )} kWh </td></tr>`;
            }
            return `<div class="line-chart-widget-tooltip">
                    <h6 class="line-chart-widget-tooltip-title" style="font-weight:bold;">Energy Consumption</h6>
                    ${ch}
                </table></div>`;
        },
    },
    xaxis: {
        type: 'datetime',
        labels: {
            formatter: function (val, timestamp) {
                return moment(timestamp).format('DD/MM HH:00');
            },
        },
    },
    yaxis: {
        labels: {
            formatter: function (value) {
                return parseInt(value);
            },
        },
    },
}

export const optionsLines = {
    chart: {
        id: 'chart1',
        height: '500px',
        toolbar: {
            show: false,
        },

        animations: {
            enabled: false,
        },
        type: 'area',
        brush: {
            target: 'chart2',
            enabled: true,
        },
        selection: {
            enabled: true,
        },
    },
    legend: {
        show: false,
    },
    colors: [
        '#3C6DF5',
        '#12B76A',
        '#DC6803',
        '#088AB2',
        '#EF4444',
        '#800000',
        '#FFA500',
        '#0AFFFF',
        '#033E3E',
        '#E2F516',
    ],
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.91,
            opacityTo: 0.1,
        },
    },
    xaxis: {
        type: 'datetime',
        labels: {
            formatter: function (val, timestamp) {
                return moment(timestamp).format('DD/MM');
            },
        },
    },
    yaxis: {
        labels: {
            formatter: function (value) {
                return parseInt(value);
            },
        },
    },
    legend: {
        show: false,
    },
}

export const equipOptions ={
    chart: {
            id: 'chart2',
            type: 'line',
            height: 180,
            toolbar: {
                show: true,
                offsetX: 0,
                offsetY: 0,
                tools: {
                  download: true,
                  selection: false,
                  zoom: false,
                  zoomin: false,
                  zoomout: false,
                  pan: false,
                  reset: false ,
                },
                export: {
                  csv: {
                    filename: "Explore_Building_View"+new Date(),
                    columnDelimiter: ',',
                    headerCategory: 'Timestamp',
                    headerValue: 'value',
                    dateFormatter(timestamp) {
                      return moment
                      .utc(timestamp)
                      .format(`MMM D 'YY @ hh:mm A`)
                    }
                  },
                  svg: {
                    filename: "Explore_Building_View"+new Date(),
                  },
                  png: {
                    filename: "Explore_Building_View"+new Date(),
                  }
                },
                autoSelected: 'pan',
            },

            animations: {
                enabled: false,
            },
        },
        colors: ['#546E7A'],
        stroke: {
            width: 3,
        },
        dataLabels: {
            enabled: false,
        },
        colors: ['#10B981', '#2955E7'],
        fill: {
            opacity: 1,
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return moment.utc(timestamp).format('DD/MMM - HH:mm');
                },
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
                    width: 1,
                    dashArray: 0,
                },
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    return val.toFixed(0);
                },
            },
        },
        tooltip: {
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
                const timestamp = new Date(seriesX[seriesIndex][dataPointIndex]);

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="line-chart-widget-tooltip-value">${w.config.series[0].unit === 'kWh'
                        ? series[seriesIndex][dataPointIndex].toFixed(0)
                        : series[seriesIndex][dataPointIndex].toFixed(0)
                    } 
                         ${w.config.series[0].unit}</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment
                        .utc(timestamp)
                        .format(`MMM D 'YY @ hh:mm A`)}</div>
                    </div>`;
            },
        },
    }

export const equipOptionsLines = {
    chart: {
        id: 'chart1',
        height: 90,
        type: 'area',
        brush: {
            target: 'chart2',
            enabled: true,
        },
        toolbar: {
            show: false, 
          },

        selection: {
            enabled: true,
        },
        animations: {
            enabled: false,
        },
    },
    colors: ['#008FFB'],
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.91,
            opacityTo: 0.1,
        },
    },
    xaxis: {
        type: 'datetime',
        tooltip: {
            enabled: false,
        },
        labels: {
            formatter: function (val, timestamp) {
                return moment.utc(timestamp).format('DD/MMM');
            },
        },
    },
    yaxis: {
        tickAmount: 2,
        labels: {
            formatter: function (val) {
                return parseInt(val);
            },
        },
    },
}