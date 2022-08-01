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

const Titles = ({ sizeBrick, title, subtitle }) => {
    return (
        <>
            <Typography.Subheader size={Typography.Sizes.md} as="h5" fontWeight={Typography.Types.Medium}>
                {title}
            </Typography.Subheader>
            <Typography.Body size={Typography.Sizes.xs} as="h6">
                {subtitle}
            </Typography.Body>
            <Brick sizeInRem={sizeBrick} />
        </>
    );
};

const DonutChartWidget = ({
    className = '',
    color = [],
    id,
    type = DONUT_CHART_TYPES.HORIZONTAL,
    items,
    title,
    subtitle,
    ...props
}) => {
    const labels = items.map(({ label }) => label);
    const colors = items.map(({ color }) => color);
    const series = items.map(({ value }) => Number(value));

    const options = {
        ...configDonutChartWidget(type),
        labels,
        colors,
        id,
    };

    return (
        <>
            {type === DONUT_CHART_TYPES.HORIZONTAL && <Titles sizeBrick={1} {...{ title, subtitle }} />}
            <div className={`donut-chart-widget-wrapper ${className} ${type}`}>
                {type !== DONUT_CHART_TYPES.HORIZONTAL && <Titles sizeBrick={1.5625} {...{ title, subtitle }} />}
                <div className={`chart-wrapper ${type}`}>
                    <ReactApexChart options={options} {...props} series={series} type="donut" />
                </div>
                <div className="chart-labels">
                    <DonutChartLabels
                        className={type}
                        isShowTrend={type == DONUT_CHART_TYPES.HORIZONTAL}
                        isShowValue={type != DONUT_CHART_TYPES.VERTICAL_NO_TOTAL}
                        labels={items}
                    />
                </div>
            </div>
        </>
    );
};

DonutChartWidget.propTypes = {
    color: PropTypes.arrayOf(PropTypes.string).isRequired,
    id: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(DONUT_CHART_TYPES)),
    items: PropTypes.arrayOf(
        PropTypes.shape({ 
            label: PropTypes.string.isRequired, 
            color: PropTypes.string.isRequired, 
            value: PropTypes.string.isRequired, 
            unit: PropTypes.string.isRequired, 
            trendValue: PropTypes.number, 
            link: PropTypes.string, 
        })
    )
}

export default DonutChartWidget;
