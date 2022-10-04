import React, { useState, useEffect } from 'react';
import Typography from '../typography';
import Brick from '../brick';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardBody, Table, Spinner } from 'reactstrap';
// import { configLineChartWidget } from './config';
import moment from 'moment';
import 'moment-timezone';
import { timeZone } from '../../utils/helper';
import { formatConsumptionValue, xaxisFilters } from '../../helpers/helpers';
import LineColumnChart from '../../../src/pages/charts/LineColumnChart';
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
        animations: {
            enabled: false,
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

                return `<div class="line-chart-widget-tooltip">
                        <h6 class="line-chart-widget-tooltip-title">Energy Consumption</h6>
                        <div class="line-chart-widget-tooltip-value">${formatConsumptionValue(
                            series[seriesIndex][dataPointIndex],
                            4
                        )} kWh</div>
                        <div class="line-chart-widget-tooltip-time-period">${moment(timestamp)
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
                    let print = parseInt(val);
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

    useEffect(() => {
        let xaxisObj = xaxisFilters(startEndDayCount, timeZone);
        setConfigLineChartWidget({ ...configLineChartWidget, xaxis: xaxisObj });
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
                <div className="m-4">
                    <LineColumnChart series={series} options={configLineChartWidget} />
                </div>
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
