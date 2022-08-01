import React from 'react';
import { Link } from 'react-router-dom';
import cx from 'classnames';
import { TrendsBadge } from '../trendsBadge';

import './Labels.scss';

const DonutChartLabels = ({ labels = [], isShowValue = true, isShowTrend, className = '' }) => (
    <div
        className={cx(
            'donut-chart-labels-wrapper',
            {
                withTrend: isShowTrend,
                withValue: isShowValue,
            },
            className
        )}>
        {labels.map(({ label, color, value, unit, trendValue, trendType, link = null }, index) => {
            return (
                <div key={index} className="donut-chart-labels">
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
                            {value} {unit}
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
