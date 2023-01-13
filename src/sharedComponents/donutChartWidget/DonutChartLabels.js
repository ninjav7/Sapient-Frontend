import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';

import { TrendsBadge } from '../trendsBadge';
import Typography from '../typography';

import { formatConsumptionValue } from '../../helpers/helpers';

import './Labels.scss';

const DonutChartLabels = ({ onHover, onMouseLeave, labels = [], isShowValue = true, isShowTrend, className = '' }) => (
    <div
        className={cx(
            'donut-chart-labels-wrapper',
            {
                withTrend: isShowTrend,
                withValue: isShowValue,
            },
            className
        )}>
        {labels.map(({ label, color, value, unit, trendValue, trendType, link = null, isHovered, onClick }, index) => {
            const labelComponent = (
                <Typography.Subheader size={Typography.Sizes.md} className="gray-800 Medium m-0">
                    {label}
                </Typography.Subheader>
            );

            return (
                <div
                    key={index}
                    className={cx('donut-chart-labels', { 'is-hovered': isHovered })}
                    onMouseLeave={(event) => onMouseLeave(event, index)}
                    onMouseOver={(event) => onHover(event, index)}>
                    <div className="donut-chart-labels-dot" style={{ background: color }} />

                    {link ? (
                        <Link className="donut-chart-labels-link" to={link} onClick={onClick}>
                            {label}
                        </Link>
                    ) : !!onClick ? (
                        <button
                            type="button"
                            onClick={onClick}
                            role="button"
                            className="reset-styles text-left donut-chart-labels-no-link">
                            {labelComponent}
                        </button>
                    ) : (
                        labelComponent
                    )}

                    {isShowValue && (
                        <div className="donut-chart-labels-value">
                            {formatConsumptionValue(value, 0)} {unit}
                        </div>
                    )}

                    {isShowTrend && (
                        <div className="donut-chart-labels-trend-badge">
                            <TrendsBadge value={trendValue} type={trendType} />
                        </div>
                    )}
                </div>
            );
        })}
    </div>
);

export default DonutChartLabels;
