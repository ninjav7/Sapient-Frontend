import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { TrendsBadge } from '../trendsBadge';
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
        {labels.map(({ label, color, value, unit, trendValue, trendType, link = null, isHovered }, index) => {
            return (
                <div
                    key={index}
                    className={cx('donut-chart-labels', { 'is-hovered': isHovered })}
                    onMouseLeave={(event) => onMouseLeave(event, index)}
                    onMouseOver={(event) => onHover(event, index)}>
                    <div className="donut-chart-labels-dot" style={{ background: color }}></div>

                    {link ? (
                        <Link className="donut-chart-labels-link" to={link}>
                            {label}
                        </Link>
                    ) : (
                        <div className="donut-chart-labels-no-link">{label}</div>
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
