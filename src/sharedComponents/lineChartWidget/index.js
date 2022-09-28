import React, { useState, useEffect } from 'react';
import Typography from '../typography';
import Brick from '../brick';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, Table, Spinner } from 'reactstrap';
// import { configLineChartWidget } from './config';
import moment from 'moment';
import { kFormatter } from '../helpers/helper';
import { formatConsumptionValue } from '../../helpers/helpers';
import './style.scss';

const LineChartWidget = ({
    className = '',
    series,
    title,
    subtitle,
    height = 259,
    width,
    isConsumpHistoryLoading,
    startEndDayCount,
}) => {
    const [configLineChartWidget, setConfigLineChartWidget] = useState({
        markers: {
            size: -10,
        },
        chart: {
            toolbar: {
                show: false,
            },
            type: 'line',
            zoom: {
                type: 'x',
                enabled: true,
                autoScaleYaxis: true,
            },
        },
        animations: {
            enabled: false,
        },
        dataLabels: {
            enabled: false,
        },
        toolbar: {
            show: true,
        },

        colors: ['#5E94E4'],
        stroke: {
            width: [2, 2],
        },
        //@TODO NEED?
        // plotOptions: {
        //     bar: {
        //         columnWidth: '20%',
        //     },
        // },
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
                        return moment(timestamp).format('DD/MMM - HH:mm');
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
                const { seriesX } = w.globals;
                const timestamp = new Date(seriesX[seriesIndex][dataPointIndex]);

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="line-chart-widget-tooltip-value">${formatConsumptionValue(
                            series[seriesIndex][dataPointIndex],
                            0
                        )} kWh</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment(timestamp).format(
                            `MMM D 'YY @ hh:mm A`
                        )}</div>
                    </div>`;
            },
        },
        xaxis: {
            type: 'datetime',
            labels: {
                formatter: function (val, timestamp) {
                    return `${moment(timestamp).format('DD/MMM')} ${moment(timestamp).format('LT')}`;
                },
            },
            style: {
                fontSize: '12px',
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
                formatter: function (value) {
                    var val = Math.abs(value);
                    return kFormatter(val);
                },
            },
            style: {
                fontSize: '12px',
                fontWeight: 600,
                cssClass: 'apexcharts-xaxis-label',
            },
        },
        grid: {
            padding: {
                top: 0,
                right: 10,
                bottom: 0,
                left: 10,
            },
        },
    });

    useEffect(() => {
        if (startEndDayCount === 1) {
            let xaxisObj = {
                type: 'datetime',
                labels: {
                    formatter: function (val, timestamp) {
                        return `${moment(timestamp).format('HH:00')}`;
                    },
                },
                tickAmount: 9,
                style: {
                    fontSize: '12px',
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
                offsetX: 0,
            };
            setConfigLineChartWidget({ ...configLineChartWidget, xaxis: xaxisObj });
        } else if (startEndDayCount >= 2 && startEndDayCount <= 3) {
            let xaxisObj = {
                type: 'datetime',
                labels: {
                    formatter: function (val, timestamp) {
                        return `${moment(timestamp).format('MM/DD HH:00')}`;
                    },
                },
                tickAmount: startEndDayCount * 6,
                style: {
                    fontSize: '12px',
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
                offsetX: 0,
            };
            setConfigLineChartWidget({ ...configLineChartWidget, xaxis: xaxisObj });
        } else {
            let xaxisObj = {
                type: 'datetime',
                labels: {
                    formatter: function (val, timestamp) {
                        return `${moment(timestamp).format('DD/MMM')} ${moment(timestamp).format('LT')}`;
                    },
                },
                style: {
                    fontSize: '12px',
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
            };
            setConfigLineChartWidget({ ...configLineChartWidget, xaxis: xaxisObj });
        }
    }, [startEndDayCount]);

    return (
        <div className={`line-chart-widget-wrapper ${className}`}>
            <Typography.Subheader
                size={Typography.Sizes.md}
                as="h5"
                fontWeight={Typography.Types.Medium}
                className="ml-3 mb-0 mt-3">
                {title}
            </Typography.Subheader>
            <Typography.Body size={Typography.Sizes.xs} as="h6" className="ml-3 mt-1">
                {subtitle}
            </Typography.Body>
            {isConsumpHistoryLoading ? (
                <div className="loader-center-style">
                    <Spinner className="m-2" color={'primary'} />
                </div>
            ) : (
                <Chart
                    className="line-chart-widget"
                    options={configLineChartWidget}
                    series={series}
                    {...{ height, width }}
                    type="line"
                />
            )}
        </div>
    );
};

LineChartWidget.propTypes = {
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

export default LineChartWidget;
