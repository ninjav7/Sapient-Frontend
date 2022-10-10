import React from 'react';
import PropTypes from 'prop-types';

import { ReactComponent as IncreaseSVG } from '../assets/icons/arrow-trend-up.svg';
import { ReactComponent as DecreaseSVG } from '../assets/icons/arrow-trend-down.svg';
import { ReactComponent as NeutralSVG } from '../assets/icons/arrow-trend-neutral.svg';

import './style.scss';

const TRENDS_BADGE_TYPES = Object.freeze({
    DOWNWARD_TREND: 'downward-trend',
    UPWARD_TREND: 'upward-trend',
    NEUTRAL_TREND: 'neutral-trend',
    NEUTRAL_DOWN_TREND: 'neutral-trend neutral-down-decrease',
    NEUTRAL_UP_TREND: 'neutral-trend neutral-up-decrease',
});

const iconMap = {
    [TRENDS_BADGE_TYPES.DOWNWARD_TREND]: DecreaseSVG,
    [TRENDS_BADGE_TYPES.UPWARD_TREND]: IncreaseSVG,
    [TRENDS_BADGE_TYPES.NEUTRAL_TREND]: NeutralSVG,
    [TRENDS_BADGE_TYPES.NEUTRAL_DOWN_TREND]: DecreaseSVG,
    [TRENDS_BADGE_TYPES.NEUTRAL_UP_TREND]: IncreaseSVG,
};

const valueMap = {
    [TRENDS_BADGE_TYPES.DOWNWARD_TREND]: 5,
    [TRENDS_BADGE_TYPES.UPWARD_TREND]: 5,
    [TRENDS_BADGE_TYPES.NEUTRAL_TREND]: 0,
    [TRENDS_BADGE_TYPES.NEUTRAL_DOWN_TREND]: 1,
    [TRENDS_BADGE_TYPES.NEUTRAL_UP_TREND]: 1,
};

const TrendsBadge = ({ className = '', value = null, type = TRENDS_BADGE_TYPES.UPWARD_TREND }) => {
    const Icon = iconMap[type];
    const renderValue = value === null ? valueMap[type] : value;

    return (
        <div className={`trends-badge ${type} ${className}`}>
            <Icon className="trends-badge-badge-icon" />
            {renderValue}%
        </div>
    );
};

TrendsBadge.Type = TRENDS_BADGE_TYPES;

TrendsBadge.propTypes = {
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    type: PropTypes.oneOf(Object.values(TRENDS_BADGE_TYPES)),
};

export { TrendsBadge, TRENDS_BADGE_TYPES };
