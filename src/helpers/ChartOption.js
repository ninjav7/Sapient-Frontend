import moment from 'moment';
import 'moment-timezone';


//Explore
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
                    filename: "Explore_View" + new Date(),
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
                    filename: "Explore_View" + new Date(),
                },
                png: {
                    filename: "Explore_View" + new Date(),
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
        width: 2,
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
            let ch = '';
            ch =
                ch +
                `<div class="line-chart-widget-tooltip-time-period" style="margin-bottom:10px;">${moment
                    .utc(seriesX[0][dataPointIndex])
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
                return moment.utc(timestamp).format('DD/MM HH:00');
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
    ],
    xaxis: {
        type: 'datetime',
        labels: {
            formatter: function (val, timestamp) {
                return moment.utc(timestamp).format('DD/MM');
            },
        },
    },
    grid: {
        yaxis: {
            lines: {
                show: false
              }
        },
        xaxis: {
            lines: {
                show: false
              }
        },
    },
    yaxis: {
        show: false,
    },
    legend: {
        show: false,
    },
}

//Equip Chart Model
export const equipOptions= (selectedUnit, timeZone) =>  {
    return({
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
                reset: false,
            },
            export: {
                csv: {
                    filename: "Equipment Chart" + new Date(),
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
                    filename: "Equipment Chart" + new Date(),
                },
                png: {
                    filename: "Equipment Chart" + new Date(),
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
    colors: ['#546E7A'],
    stroke: {
        width: 2,
    },
    dataLabels: {
        enabled: false,
    },
    colors: [
        '#3C6DF5',
        '#12B76A',
        '#DC6803',
    ],
    fill: {
        opacity: 1,
        colors: [
            '#3C6DF5',
            '#12B76A',
            '#DC6803',
        ],
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
            const { colors } = w.globals;
            const { seriesX } = w.globals;
            const { seriesNames } = w.globals;
            let ch = '';
            ch =
                ch +
                `<div class="line-chart-widget-tooltip-time-period" style="margin-bottom:10px;">${moment
                    .utc(seriesX[0][dataPointIndex])
                    .format(`MMM D 'YY @ hh:mm A`)}</div><table style="border:none;">`;
            for (let i = 0; i < series.length; i++) {
                if (isNaN(parseInt(series[i][dataPointIndex])) === false)
                    ch =
                        ch +
                        `<tr style="style="border:none;"><td><span class="tooltipclass" style="background-color:${colors[i]
                        };"></span> &nbsp;${seriesNames[i]} </td><td> &nbsp;${(
                            series[i][dataPointIndex].toFixed(2)
                        )}&nbsp;${selectedUnit}</td></tr>`;
            }

            return `<div class="line-chart-widget-tooltip">
                    <h6 class="line-chart-widget-tooltip-title" style="font-weight:bold;">Energy Consumption</h6>
                    ${ch}
                </table></div>`;
        },
    },
})}

export const equipOptionsLines = {
    chart: {
        id: 'chart1',
        height: 50,
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
    legend: {
        show: false,
    },
    colors: [
        '#3C6DF5',
        '#12B76A',
        '#DC6803',
    ],
    fill: {
        type: 'gradient',
        gradient: {
            opacityFrom: 0.51,
            opacityTo: 0.1,
        },
    },
    grid: {
        yaxis: {
            lines: {
                show: false
              }
        },
        xaxis: {
            lines: {
                show: false
              }
        },
    },
    xaxis:{
        labels: {
            show: false,
        },
    },
    yaxis: {
        show: false,
    },
}

export const fetchOptions = (selectedUnit, timeZone) => {
    return ({
        chart: {
            id: 'chart-line2',
            type: 'line',
            height: 180,
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
                animations: {
                    enabled: false,
                },
                zoom: {
                    type: 'x',
                    enabled: true,
                    autoScaleYaxis: true,
                },
        },
        colors: ['#546E7A'],
        stroke: {
            width: 2,
        },
        dataLabels: {
            enabled: false,
        },
        colors: [
            '#3C6DF5',
            '#12B76A',
            '#DC6803',
        ],
        fill: {
            opacity: 1,
            colors: [
                '#3C6DF5',
                '#12B76A',
                '#DC6803',
            ],
        },
        markers: {
            size: 0,
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return `${moment(timestamp).tz(timeZone).format('DD/MM')} ${moment(timestamp)
                        .tz(timeZone)
                        .format('LT')}`;
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
                const { colors } = w.globals;
                const { seriesX } = w.globals;
                const { seriesNames } = w.globals;
                let ch = '';
                ch =
                    ch +
                    `<div class="line-chart-widget-tooltip-time-period" style="margin-bottom:10px;">${moment
                        .utc(seriesX[0][dataPointIndex])
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
    })
}

export const deviceOptionLine = {
    chart: {
        id: 'chart-line',

        height: 90,

        type: 'area',

        brush: {
            target: 'chart-line2',

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
    legend: {
        show: false,
    },
    colors: [
        '#3C6DF5',
        '#12B76A',
        '#DC6803',
    ],
    fill: {
        type: 'gradient',

        gradient: {
            opacityFrom: 0.91,

            opacityTo: 0.1,
        },
    },

    xaxis: {
        show: false,
    },

    yaxis: {
        show: false,
    },
}