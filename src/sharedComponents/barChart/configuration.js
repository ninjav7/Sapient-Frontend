import React from 'react';
import _ from 'lodash';

import Typography from '../typography';

import { chartsBaseConfig } from '../configs/chartsBaseConfig';
import { renderComponents } from '../columnChart/helper';

import colors from '../../assets/scss/_colors.scss';

export const options = (props) => {
    const baseConfig = chartsBaseConfig({
        columnType: 'bar',
        chartHeight: props.chartHeight || 240,
        colors: props.colors || [colors.datavizMain2],
        series: props.series,
        categories: props.categories,
        onMoreDetail: props.onMoreDetail,
        tooltipUnit: props.tooltipUnit,
        yAxisWithAssignMeasure: false,
    });

    return _.merge(baseConfig, {
        chart: {
            animation: false,
            marginLeft: 148,
            marginBottom: 20,
            spacing: [0, 5, 30, 5],
            events: {
                load: function () {
                    props.seriesRenderedData(this.series[0]);
                },
            },
        },
        xAxis: [
            {
                ...baseConfig.xAxis,
                type: 'category',
                title: {
                    text: null,
                },
                min: 0,
                offset: 10,
                lineWidth: 0,
                labels: {
                    align: 'left',
                    reserveSpace: true,
                    format: renderComponents(
                        <Typography.Subheader
                            size={Typography.Sizes.md}
                            className="gray-800"
                            style={{ fill: colors.primaryGray800 }}>
                            {'{text}'}
                        </Typography.Subheader>
                    ),
                },
            },
        ],
        plotOptions: {
            bar: {
                groupPadding: 0.1,
                pointPadding: 0,
                series: {
                    pointWidth: 30,
                },
                states: {
                    hover: {
                        halo: {
                            opacity: 1,
                        },
                    },
                },
            },

            series: {
                point: {
                    events: {
                        mouseOver: function () {
                            let hoveredPointIndex = this.index;

                            this.series.data.forEach(function (point) {
                                if (point.index !== hoveredPointIndex)
                                    point.update({
                                        opacity: 0.5,
                                    });
                            });
                        },
                        mouseOut: function () {
                            let hoveredPointIndex = this.index;

                            this.series.data.forEach(function (point) {
                                if (point.index !== hoveredPointIndex)
                                    point.update({
                                        opacity: 1,
                                    });
                            });
                        },
                    },
                },
            },
        },
        legend: {
            enabled: false,
        },
    });
};
