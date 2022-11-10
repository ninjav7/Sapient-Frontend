import React, { useRef } from 'react';
import './ExploreChart.scss';
import { colorPalette } from './utils';
import Highcharts from 'highcharts/highstock';

import HighchartsReact from 'highcharts-react-official';
import Typography from '../typography';
import { ReactComponent as BurgerIcon } from '../../assets/icon/burger.svg';
import DropDownIcon from '../dropDowns/dropDownButton/DropDownIcon';
require('highcharts/modules/exporting')(Highcharts);
require('highcharts/modules/export-data')(Highcharts);

const ExploreChart = (props) => {
    const chartComponentRef = useRef(null);

    const { data, title, subTitle } = props;

    const preparedData = data.map((el, index) => {
        return {
            type: 'line',
            color: colorPalette[index],
            data: el,
            lineWidth: 2,
            showInLegend: true,
        };
    });

    const options = {
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
            floating: true,
            align: 'right',
            verticalAlign: 'top',
            y: 0,
            x: 0,
            labelFormat: '<span style="color:{color}">{name}</span><br/>',
            borderWidth: 0,
            itemStyle: {
                color: '#333333',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'normal',
                textOverflow: 'ellipsis',
                textTransform: 'capitalize',
            },
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
            gridLineWidth: 1,
            alternateGridColor: '#F2F4F7',
            type: 'datetime',
            labels: {
                format: '{value: %e %b %Y}',
            },
        },
        yAxis: {
            series: [...preparedData],
            gridLineWidth: 1,
            lineWidth: 1,
            opposite: false,
            accessibility: {
                enabled: true,
            },
            labels: {
                format: '{value}',
            },
        },
        time: {
            useUTC: false,
        },
        series: [...preparedData],
    };

    const handleDropDownOptionClicked = (name) => {
        switch (name) {
            case 'downloadSVG':
                downloadSVG();
                break;
            case 'downloadPNG':
                downloadPNG();
                break;
            case 'downloadCSV':
                downloadCSV();
                break;
            default:
                break;
        }
    };

    const downloadCSV = () => {
        chartComponentRef.current.chart.downloadCSV();
    };

    const downloadPNG = () => {
        chartComponentRef.current.chart.exportChart({ type: 'image/png' });
    };

    const downloadSVG = () => {
        chartComponentRef.current.chart.exportChart({ type: 'image/svg+xml' });
    };

    return (
        <div className="explore-chart-wrapper">
            <div className="chart-header">
                <div>
                    <Typography size={Typography.Sizes.sm} fontWeight={Typography.Types.SemiBold}>
                        {title}
                    </Typography>
                    <Typography.Body size={Typography.Sizes.xs}>{subTitle}</Typography.Body>
                </div>
                <div>
                    <DropDownIcon
                        options={[
                            {
                                name: 'downloadSVG',
                                label: 'Download SVG',
                            },
                            {
                                name: 'downloadPNG',
                                label: 'Download PNG',
                            },
                            {
                                name: 'downloadCSV',
                                label: 'Download CSV',
                            },
                        ]}
                        label={null}
                        triggerButtonIcon={<BurgerIcon />}
                        handleClick={(name) => {
                            handleDropDownOptionClicked(name);
                        }}
                    />
                </div>
            </div>
            <HighchartsReact
                highcharts={Highcharts}
                constructorType={'stockChart'}
                options={options}
                ref={chartComponentRef}
            />
        </div>
    );
};

export default ExploreChart;
