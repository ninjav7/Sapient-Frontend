import React from 'react';
import Typography from '../typography';
import Brick from '../brick';
import Chart from 'react-apexcharts';

import { configLineChartWidget } from './config';

import './style.scss';

const LineChartWidget = ({ className = '', series, title, subtitle, height, width }) => {
    return (
        <div className={`line-chart-widget-wrapper ${className}`}>
            <Typography.Subheader size={Typography.Sizes.md} as="h5" fontWeight={Typography.Types.Medium}>
                {title}
            </Typography.Subheader>
            <Typography.Body size={Typography.Sizes.xs} as="h6">
                {subtitle}
            </Typography.Body>
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

export default LineChartWidget;
