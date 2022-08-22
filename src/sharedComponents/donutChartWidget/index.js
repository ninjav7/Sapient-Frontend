import React from 'react';
import ReactApexChart from 'react-apexcharts';
import PropTypes from 'prop-types';

import Typography from '../typography';
import Brick from '../brick';
import { configDonutChartWidget } from './config';
import DonutChartLabels from './DonutChartLabels';

import './style.scss';

export const DONUT_CHART_TYPES = Object.freeze({
    VERTICAL: 'vertical',
    HORIZONTAL: 'horizontal',
    VERTICAL_NO_TOTAL: 'vertical no-total',
});

const Titles = ({ sizeBrick, title, subtitle, className }) => {
    return (
        <div className={className}>
            <Typography.Subheader size={Typography.Sizes.md} as="h5" fontWeight={Typography.Types.Medium}>
                {title}
            </Typography.Subheader>
            <Typography.Body size={Typography.Sizes.xs} as="h6">
                {subtitle}
            </Typography.Body>
        </div>
    );
};

const DonutChartWidget = ({
    classNameContainer = '',
    className = '',
    id,
    type = DONUT_CHART_TYPES.HORIZONTAL,
    items,
    title,
    subtitle,
    series,
    ...props
}) => {
    const labels = items.map(({ label }) => label);
    const colors = items.map(({ color }) => color);

    const options = {
        ...configDonutChartWidget(type),
        labels,
        colors,
        id,
    };

    return (
        <div className={`donut-chart-widget-container ${classNameContainer}`}>
            <Titles className="donut-chart-widget-titles" sizeBrick={1.5625} {...{ title, subtitle }} />
            <div className={`donut-chart-widget-wrapper ${type} ${className}`}>
                <div className={`chart-wrapper ${type}`}>
                    <ReactApexChart options={options} {...props} series={series} type="donut" />
                </div>
                <div className="chart-labels">
                    <DonutChartLabels
                        className={type}
                        isShowTrend={type === DONUT_CHART_TYPES.HORIZONTAL}
                        isShowValue={type !== DONUT_CHART_TYPES.VERTICAL_NO_TOTAL}
                        labels={items}
                    />
                </div>
            </div>
        </div>
    );
};

DonutChartWidget.propTypes = {
    id: PropTypes.string,
    type: PropTypes.oneOf(Object.values(DONUT_CHART_TYPES)),
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            color: PropTypes.string.isRequired,
            value: PropTypes.string.isRequired,
            unit: PropTypes.string.isRequired,
            trendValue: PropTypes.number,
            link: PropTypes.string,
        }).isRequired
    ).isRequired,
    series: PropTypes.arrayOf(PropTypes.number).isRequired,
};

export default DonutChartWidget;
