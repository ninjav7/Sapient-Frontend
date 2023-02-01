import React from 'react';
import Typography from '../typography';
import PropTypes from 'prop-types';
import Button from '../button/Button';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { ReactComponent as Download } from '../assets/icons/download.svg';
import HeatMapChart from './HeatMapChart';
import { getHeatMapCSVExport } from '../helpers/chartsExport';
import Brick from '../brick';
import './style.scss';

const ICON_SIZES = {
    [Button.Sizes.lg]: 11,
};

const Titles = ({ title, subtitle, pageType }) => {
    return (
        <>
            <div className="ml-3 mt-2">
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    as="h5"
                    fontWeight={Typography.Types.SemiBold}
                    className="mb-1">
                    {title}
                </Typography.Subheader>
                <Typography.Body size={Typography.Sizes.xs} as="h6">
                    {subtitle}
                </Typography.Body>
            </div>
        </>
    );
};

const HeatMapWidget = ({
    title,
    subtitle,
    series,
    height = 125,
    pageType = '',
    handleRouteChange,
    showRouteBtn = false,
    className = '',
    labelsPosition = 'bottom',
    toolTipUnit = 'kWh',
    toolTipTitle = 'Energy Usage by Hour',
}) => {
    const options = {
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
        },
        xaxis: {
            labels: {
                show: true,
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
            position: `${labelsPosition}`,
        },
        tooltip: {
            //@TODO NEED?
            // enabled: false,
            shared: false,
            intersect: false,
            style: {
                fontSize: '0.75rem',
                fontFamily: 'Inter, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
            marker: {
                show: false,
            },
            custom: function ({ seriesIndex, dataPointIndex, w }) {
                const { seriesNames } = w.globals;
                const day = seriesNames[seriesIndex];
                const energyVal = w.config.series[seriesIndex].data[dataPointIndex].z;

                return `<div class="line-chart-widget-tooltip">
                            <h6 class="line-chart-widget-tooltip-title">${toolTipTitle}</h6>
                            <div class="line-chart-widget-tooltip-value">${energyVal} ${toolTipUnit}</div>
                            <div class="line-chart-widget-tooltip-time-period">
                            ${day}, ${w.globals.labels[dataPointIndex]}
                            </div>
                        </div>`;
            },
        },
    };

    return (
        <div className={`heatmap-chart-widget-wrapper ${className}`}>
            <>
                {showRouteBtn ? (
                    <div className="container-header">
                        <Titles {...{ title, subtitle, pageType }} />

                        <div className="mr-2">
                            {showRouteBtn ? (
                                <div className="d-flex justify-content-between mr-1">
                                    <Button
                                        size={Button.Sizes.sm}
                                        icon={<Download />}
                                        type={Button.Type.secondaryGrey}
                                        onClick={() => getHeatMapCSVExport(series, options?.xaxis?.categories)}
                                        className="mr-4"
                                    />
                                    <Button
                                        label="More Details"
                                        size={Button.Sizes.lg}
                                        icon={<ArrowRight style={{ height: ICON_SIZES[Button.Sizes.lg] }} />}
                                        type={Button.Type.tertiary}
                                        iconAlignment={Button.IconAlignment.right}
                                        onClick={handleRouteChange}
                                    />
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="d-flex justify-content-between">
                        <Titles {...{ title, subtitle, pageType }} />
                        <Download
                            className="download-chart-btn mouse-pointer mr-3 mt-3"
                            onClick={() => getHeatMapCSVExport(series.reverse(), options?.xaxis?.categories)}
                        />
                    </div>
                )}
            </>
            <Brick sizeInRem={1} />

            <div>
                <HeatMapChart options={options} series={series} height={height} />
            </div>
        </div>
    );
};

HeatMapWidget.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    series: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.oneOfType([PropTypes.string, PropTypes.string]),
                    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    z: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                }).isRequired
            ),
        })
    ).isRequired,
    height: PropTypes.number,
    pageType: PropTypes.string,
    handleRouteChange: PropTypes.func,
    showRouteBtn: PropTypes.bool,
    className: PropTypes.string,
    labelsPostion: PropTypes.string,
    toolTipUnit: PropTypes.string,
    toolTipTitle: PropTypes.string,
};

export default HeatMapWidget;
