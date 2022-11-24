import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';

export const fetchTrendType = (now, old) => {
    return now >= old ? TRENDS_BADGE_TYPES.UPWARD_TREND : TRENDS_BADGE_TYPES.DOWNWARD_TREND;
};
