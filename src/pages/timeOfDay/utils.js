import moment from 'moment';

export const heatMapOptions = {
    chart: {
        type: 'heatmap',
        toolbar: {
            show: false,
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        width: 1,
    },
    legend: {
        show: false,
    },
    plotOptions: {
        heatmap: {
            shadeIntensity: 0.5,
            enableShades: true,
            distributed: true,
            radius: 1,
            useFillColorAsStroke: false,
            colorScale: {
                ranges: [
                    {
                        from: 0,
                        to: 3,
                        color: '#F5F8FF',
                    },
                    {
                        from: 4,
                        to: 8,
                        color: '#EDF3FF',
                    },
                    {
                        from: 9,
                        to: 12,
                        color: '#E5EDFF',
                    },
                    {
                        from: 13,
                        to: 16,
                        color: '#DDE8FE',
                    },
                    {
                        from: 17,
                        to: 21,
                        color: '#D6E2FE',
                    },
                    {
                        from: 22,
                        to: 25,
                        color: '#CEDDFE',
                    },
                    {
                        from: 26,
                        to: 29,
                        color: '#C6D7FE',
                    },
                    {
                        from: 30,
                        to: 33,
                        color: '#BED1FE',
                    },
                    {
                        from: 34,
                        to: 38,
                        color: '#B6CCFE',
                    },
                    {
                        from: 39,
                        to: 42,
                        color: '#AEC6FE',
                    },
                    {
                        from: 43,
                        to: 46,
                        color: '#A6C0FD',
                    },
                    {
                        from: 47,
                        to: 51,
                        color: '#9EBBFD',
                    },
                    {
                        from: 52,
                        to: 55,
                        color: '#96B5FD',
                    },
                    {
                        from: 56,
                        to: 59,
                        color: '#8EB0FD',
                    },
                    {
                        from: 60,
                        to: 64,
                        color: '#86AAFD',
                    },
                    {
                        from: 65,
                        to: 68,
                        color: '#7FA4FD',
                    },
                    {
                        from: 69,
                        to: 72,
                        color: '#F8819D',
                    },
                    {
                        from: 73,
                        to: 76,
                        color: '#F87795',
                    },
                    {
                        from: 77,
                        to: 81,
                        color: '#F86D8E',
                    },
                    {
                        from: 82,
                        to: 85,
                        color: '#F76486',
                    },
                    {
                        from: 86,
                        to: 89,
                        color: '#F75A7F',
                    },
                    {
                        from: 90,
                        to: 94,
                        color: '#F75077',
                    },
                    {
                        from: 95,
                        to: 98,
                        color: '#F64770',
                    },
                    {
                        from: 98,
                        to: 100,
                        color: '#F63D68',
                    },
                ],
            },
        },
    },
    yaxis: {
        labels: {
            show: true,
            minWidth: 40,
            maxWidth: 160,
        },
        categories: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    },
    xaxis: {
        labels: {
            show: true,
            align: 'top',
            rotate: 0,
        },
        tickAmount: 12,
        tickPlacement: 'between',
        categories: [
            '12AM',
            '1AM',
            '2AM',
            '3AM',
            '4AM',
            '5AM',
            '6AM',
            '7AM',
            '8AM',
            '9AM',
            '10AM',
            '11AM',
            '12PM',
            '1PM',
            '2PM',
            '3PM',
            '4PM',
            '5PM',
            '6PM',
            '7PM',
            '8PM',
            '9PM',
            '10PM',
            '11PM',
        ],
        position: 'top',
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
        x: {
            show: true,
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return moment(timestamp).format('DD/MM - HH:mm');
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
            const { seriesNames } = w.globals;
            const day = seriesNames[seriesIndex];
            const energyVal = w.config.series[seriesIndex].data[dataPointIndex].z;

            return `<div class="heatmap-chart-widget-tooltip">
                    <h6 class="heatmap-chart-widget-tooltip-title">Energy Usage by Hour</h6>
                    <div class="heatmap-chart-widget-tooltip-value">${energyVal} kWh</div>
                    <div class="heatmap-chart-widget-tooltip-time-period">
                    ${day}, ${w.globals.labels[dataPointIndex]}
                    </div>
                </div>`;
        },
    },
};
