import React from 'react';
import Typography from '../typography';
import Brick from '../brick';
import Chart from 'react-apexcharts';
import PropTypes from 'prop-types';

import { configLineChartWidget } from './config';

import './style.scss';

const LineChartWidget = ({ className = '', series, title, subtitle, height = 228, width }) => {
    return (
        <div className={`line-chart-widget-wrapper ${className}`}>
            <div className="line-chart-widget-titles">
                <Typography.Subheader size={Typography.Sizes.md} as="h5" fontWeight={Typography.Types.Medium}>
                    {title}
                </Typography.Subheader>
                <Typography.Body size={Typography.Sizes.xs} as="h6">
                    {subtitle}
                </Typography.Body>
            </div>

            <Brick sizeInRem={1} />

            <Chart
                className="line-chart-widget"
                options={configLineChartWidget}
                series={series}
                {...{ height, width }}
                type="line"
            />
        </div>
    );
};

LineChartWidget.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    height: PropTypes.number,
    width: PropTypes.string,
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
