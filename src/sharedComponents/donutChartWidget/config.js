import { chartsBaseConfig } from '../configs/chartsBaseConfig';

import colors from '../../assets/scss/_colors.scss';

export const configDonutChartWidget = ({
    colors,
    changeItemsState,
    totalValue,
    items,
    renderCenteredItemContent,
    centeredItemContent,
    labels,
    series,
}) => ({
    ...chartsBaseConfig({}),
    chart: {
        type: 'pie',
        height: '205px',
        events: {
            load: function () {
                const unit = items[0]?.unit;

                let series = this.series[0],
                    seriesCenter = series.center,
                    x = seriesCenter[0] + this.plotLeft,
                    y = seriesCenter[1] + this.plotTop;

                let chart = this,
                    rend = chart.renderer;

                rend.text(centeredItemContent(totalValue, unit), x, y, true)
                    .attr({
                        'text-anchor': 'middle',
                        align: 'center',
                        zIndex: 10,
                    })
                    .addClass('customTitle')
                    .add();
            },
            render: function () {
                const unit = items[0]?.unit;
                centeredItemContent(88, unit);
            },
        },
    },

    tooltip: {
        enabled: false,
    },

    pane: {
        startAngle: 36,
        endAngle: 36,
        background: [
            {
                backgroundColor: colors.baseWhite,
                borderWidth: 0,
            },
        ],
    },

    yAxis: {
        min: 0,
        max: 100,
        lineWidth: 0,
        tickPositions: [],
    },

    plotOptions: {
        pie: {
            dataLabels: {
                enabled: false,
            },
            startAngle: 0,
            endAngle: 360,
            center: ['50%', '50%'],
            colors: colors,
            linecap: 'round',
        },
        solidgauge: {
            dataLabels: {
                enabled: false,
            },
            linecap: 'round',
            stickyTracking: false,
            rounded: true,
        },

        series: {
            point: {
                events: {
                    mouseOver: function () {
                        changeItemsState(this.colorIndex, true);

                        const unit = items[this.colorIndex]?.unit;

                        renderCenteredItemContent(this.y, unit);
                    },
                    mouseOut: function () {
                        changeItemsState(this.colorIndex, false);

                        const unit = items[0]?.unit;

                        renderCenteredItemContent(totalValue, unit);
                    },
                },
            },
            states: {
                hover: {
                    halo: {
                        size: 6,
                    },
                },
            },
        },
    },
    legend: false,
    series: [
        {
            type: 'pie',
            innerSize: '80%',
            data: series.map((item, index) => [labels[index], item]),
            showInLegend: true,
            dataLabels: {
                enabled: false,
            },
        },
    ],
});
