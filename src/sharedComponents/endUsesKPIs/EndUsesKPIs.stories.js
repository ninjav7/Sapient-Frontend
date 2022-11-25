import React from 'react';
import EndUsesKPIs from './EndUsesKPIs';
import '../assets/scss/stories.scss';
import { UNITS } from '../../constants/units';
import { TrendsBadge } from '../trendsBadge';

export default {
    title: 'Widgets/EndUsesKPIs',
    component: EndUsesKPIs,
};

export const Default = (props) => <EndUsesKPIs {...props} />;

Default.args = {
    data: {
        items: [
            {
                title: 'Total Consumption',
                value: 1441,
                unit: UNITS.KWH,
                trends: [
                    { trendValue: 22, trendType: TrendsBadge.Type.DOWNWARD_TREND, text: 'since last period' },
                    { trendValue: 6, trendType: TrendsBadge.Type.UPWARD_TREND, text: 'from same period last year' },
                ],
            },
            {
                title: 'After-Hours Consumption',
                value: 221,
                unit: UNITS.KWH,
                trends: [
                    { trendValue: 33, trendType: TrendsBadge.Type.DOWNWARD_TREND, text: 'since last period' },
                    {
                        trendValue: 26,
                        trendType: TrendsBadge.Type.UPWARD_TREND,
                        text: 'from same period last year',
                    },
                ],
            },
        ],
    },
};
