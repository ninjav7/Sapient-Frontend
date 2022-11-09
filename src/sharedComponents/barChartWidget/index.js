import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment-timezone';
import Typography from '../typography';
import PropTypes from 'prop-types';
import { Spinner } from 'reactstrap';
import { formatConsumptionValue, xaxisFilters } from '../helpers/helper';
import BarChart from './BarChart';
import Button from '../button/Button';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import Brick from '../brick';
import './style.scss';

const ICON_SIZES = {
    [Button.Sizes.lg]: 11,
};

const Titles = ({ title, subtitle, pageType }) => {
    return (
        <>
            <div className={`ml-3 ${pageType === 'building' ? 'mt-2' : 'mt-3'}`}>
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    as="h5"
                    fontWeight={Typography.Types.Medium}
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

const BarChartWidget = ({
    className = '',
    series,
    title,
    subtitle,
    height = 259,
    width,
    isConsumpHistoryLoading = false,
    startEndDayCount,
    timeZone,
    pageType = '',
    handleRouteChange,
    showRouteBtn,
    ...props
}) => {
    const [configBarChartWidget, setConfigBarChartWidget] = useState({
        chart: {
            type: 'bar',
            height: 350,
            toolbar: {
                show: true,
            },
            zoom: {
                enabled: false,
            },
            animations: {
                enabled: false,
            },
        },
        stroke: {
            width: 0.2,
            show: true,
            curve: 'straight',
        },
        dataLabels: {
            enabled: true,
            enabledOnSeries: [1],
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
            marker: {
                show: false,
            },
            custom: function ({ series, seriesIndex, dataPointIndex, w }) {
                const { seriesX } = w.globals;
                const timestamp = seriesX[seriesIndex][dataPointIndex];
                let ch = '';
                if (isNaN(parseInt(series[seriesIndex][dataPointIndex])) === false) {
                    ch = formatConsumptionValue(series[seriesIndex][dataPointIndex], 4);
                } else {
                    ch = '-';
                }
                return `<div class="bar-chart-widget-tooltip">
                        <h6 class="bar-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="bar-chart-widget-tooltip-value">
                    
                        ${ch} kWh</div>
                        <div class="bar-chart-widget-tooltip-time-period">${moment(timestamp)
                            .tz(timeZone)
                            .format(`MMM D 'YY @ hh:mm A`)}</div>
                    </div>`;
            },
        },
        xaxis: {
            labels: {
                formatter: function (val) {
                    return moment(val).tz(timeZone).format('MM/DD HH:00');
                },
                hideOverlappingLabels: Boolean,
                rotate: 0,
                trim: false,
            },
            tickAmount: 12,
            axisTicks: {
                show: true,
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
                    width: 2,
                    dashArray: 0,
                },
            },
        },
        yaxis: {
            labels: {
                formatter: function (val) {
                    let print = Math.round(val);
                    return `${print}`;
                },
            },
            style: {
                colors: ['#1D2939'],
                fontSize: '12px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
    });
    console.log('DATA423',series);

    useEffect(() => {
        let xaxisObj = xaxisFilters(startEndDayCount, timeZone);
        setConfigBarChartWidget({ ...configBarChartWidget, xaxis: xaxisObj });
    }, [startEndDayCount]);

    return (
        <div className={`bar-chart-widget-wrapper ${className}`}>
            <>
                {pageType === 'building' ? (
                    <div className="container-header">
                        <Titles {...{ title, subtitle, pageType }} />
                        <div className="mr-2">
                            <Button
                                label="More Details"
                                size={Button.Sizes.lg}
                                icon={<ArrowRight style={{ height: ICON_SIZES[Button.Sizes.lg] }} />}
                                type={Button.Type.tertiary}
                                iconAlignment={Button.IconAlignment.right}
                                onClick={handleRouteChange}
                            />
                        </div>
                    </div>
                ) : (
                    <Titles {...{ title, subtitle, pageType }} />
                )}
            </>
            <Brick sizeInRem={1} />
            <div>
                {isConsumpHistoryLoading ? (
                    <div className="loader-center-style">
                        <Spinner className="m-2" color={'primary'} />
                    </div>
                ) : (
                    <div>
                        <BarChart series={series} options={configBarChartWidget} />
                    </div>
                )}
            </div>
        </div>
    );
};

BarChartWidget.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    height: PropTypes.string,
    width: PropTypes.string,
    startEndDayCount: PropTypes.number,
    series: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            data: PropTypes.arrayOf(
                PropTypes.shape({
                    x: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                    y: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
                }).isRequired
            ),
        })
    ).isRequired,
};

export default BarChartWidget;
