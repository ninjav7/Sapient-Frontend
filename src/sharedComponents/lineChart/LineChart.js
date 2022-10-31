import React from 'react';
import './LineChart.scss';
import { colorPalette } from './utils';
import Highcharts from 'highcharts/highstock';

import HighchartsReact from 'highcharts-react-official';
import Button from '../button/Button';
import Typography from '../typography';
import { ReactComponent as ArrowSVG } from '../../assets/icon/arrow.svg';

require('highcharts/modules/exporting')(Highcharts);
const LineChart = (props) => {
    const { data, title, subTitle, handleClick } = props;

    const preparedData = data.map((el, index) => {
        return {
            type: 'area',
            color: colorPalette[index],
            data: el,
            lineWidth: 2,
            showInLegend: true,
            panning: true,
            panKey: 'shift',
            fillColor: {
                linearGradient: { x1: 0, y1: 0, x2: 0, y2: 1 },
                stops: [
                    [0, colorPalette[index]],
                    [1, 'rgba(255,255,255,.25)'],
                ],
            },
        };
    });

    const options = {
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
        exporting: {
            enable: true,
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
        scrollbar: {
            enabled: false,
        },
        xAxis: {
            lineWidth: 1,
            gridLineWidth: 1,
            alternateGridColor: '#F2F4F7',
            type: 'datetime',
            labels: {
                format: '{value: %e %b %Y}',
            },
            zoomEnabled: true,
        },
        yAxis: [
            {
                gridLineWidth: 1,
                lineWidth: 1,
                opposite: false,
                accessibility: {
                    enabled: true,
                },
            },
        ],
        time: {
            useUTC: false,
        },
        series: [...preparedData],
        exporting: {
            enabled:true,
            
            // buttons: {
            //     contextButton: {
            //         menuItems: [
            //             {
            //                 textKey: 'downloadSVG',
            //                 onclick: function () {
            //                     this.exportChart({
            //                         type: 'image/svg+xml',
            //                     });
            //                 },
            //             },
            //             {
            //                 textKey: 'downloadPNG',
            //                 onclick: function () {
            //                     this.exportChart();
            //                 },
            //             },
            //             {
            //                 textKey: 'downloadCSV',
            //                 onclick: function () {
            //                     this.exportChart();
            //                 },
            //             },
            //         ],
            //     },
            // },
        },
    };

    return (
        <div className="line-chart-wrapper">
            <div className="chart-header">
                <Typography size={Typography.Sizes.sm} fontWeight={Typography.Types.SemiBold}>
                    {title}
                </Typography>
                <Typography>{subTitle}</Typography>
            </div>
            <HighchartsReact highcharts={Highcharts} constructorType={'stockChart'} options={options} />
            <div className="more-details-wrapper">
                <Button
                    onClick={handleClick}
                    className="ml-4"
                    label="More Details"
                    size={Button.Sizes.md}
                    type={Button.Type.tertiary}
                    icon={<ArrowSVG />}
                    iconAlignment="right"
                />
            </div>
        </div>
    );
};

export default LineChart;
