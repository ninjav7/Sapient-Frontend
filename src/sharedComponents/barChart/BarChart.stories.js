import React from 'react';
import BarChart from './BarChart';
import { TrendsBadge } from '../trendsBadge';

import { UNITS } from '../../constants/units';
import '../assets/scss/stories.scss';

export default {
    title: 'Charts/BarChart',
    component: BarChart,
};

export const Default = (props) => <BarChart {...props} />;

Default.args = {
    style: { width: 800 },
    title: 'Chart title',
    subTitle: 'Sub title',
    onMoreDetail: () => alert(),
    series: [
        {
            name: 'Test',
            data: [
                [
                    'Common Space ',
                    1000,
                    {
                        value: `42,553 ${UNITS.KWH}`,
                        percent: '82%',
                        trendValue: 3,
                        trendType: TrendsBadge.Type.DOWNWARD_TREND,
                    },
                ],
                [
                    'Conference Room',
                    575,
                    {
                        value: `12,553 ${UNITS.KWH}`,
                        percent: '42%',
                        trendValue: 3,
                        trendType: TrendsBadge.Type.DOWNWARD_TREND,
                    },
                ],
                [
                    'Other',
                    523,
                    {
                        value: `12,553 ${UNITS.KWH}`,
                        percent: '42%',
                        trendValue: 3,
                        trendType: TrendsBadge.Type.UPWARD_TREND,
                    },
                ],
                [
                    'Mech. Room',
                    427,
                    {
                        value: `42,553 ${UNITS.KWH}`,
                        percent: '82%',
                        trendValue: 3,
                        trendType: TrendsBadge.Type.DOWNWARD_TREND,
                    },
                ],
                [
                    'Pantry',
                    399,
                    {
                        value: `42,553 ${UNITS.KWH}`,
                        percent: '82%',
                        trendValue: 3,
                        trendType: TrendsBadge.Type.DOWNWARD_TREND,
                    },
                ],
                [
                    'Other 2',
                    150,
                    {
                        value: `42,553 ${UNITS.KWH}`,
                        percent: '82%',
                        trendValue: 3,
                        trendType: TrendsBadge.Type.DOWNWARD_TREND,
                    },
                ],
            ],
        },
    ],
};
