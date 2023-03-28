import React from 'react';
import TopConsumptionWidget from './TopConsumptionWidget';
import '../assets/scss/stories.scss';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../trendsBadge';

export default {
    title: 'Widgets/TopConsumptionWidget',
    component: TopConsumptionWidget,
};

export const Default = () => {
    return (
        <TopConsumptionWidget
            style={{ width: 596 }}
            title="Top Energy Consumers"
            subtitle="Chart subtitle"
            heads={['Equipment', 'Power', 'Change']}
            handleClick={alert}
            rows={[
                {
                    link: '#',
                    label: 'RTU-23 (Warehouse)',
                    value: '2,225',
                    unit: UNITS.KWH,
                    badgePercentage: 22,
                    badgeType: TRENDS_BADGE_TYPES.UPWARD_TREND,
                },
                {
                    link: '#',
                    label: 'Battery Charger (HBC SEC 111 > Breakers 37, 39, 41)',
                    value: '1,791',
                    unit: UNITS.KWH,
                    badgePercentage: '41,493',
                    badgeType: TRENDS_BADGE_TYPES.DOWNWARD_TREND,
                },
                {
                    link: '#',
                    label: 'Battery Charger (HBC SEC 111 > Breakers 43, 45, 47)',
                    value: '1,072',
                    unit: UNITS.KWH,
                    badgePercentage: '26,102',
                    badgeType: TRENDS_BADGE_TYPES.UPWARD_TREND,
                },
                {
                    link: '#',
                    label: 'Lighting WH Aisle - 4',
                    value: 25.3,
                    unit: UNITS.KWH,
                    badgePercentage: 2,
                    badgeType: TRENDS_BADGE_TYPES.NEUTRAL_DOWN_TREND,
                },
                {
                    link: '#',
                    label: 'RTU-1 (North Office)',
                    value: '925',
                    unit: UNITS.KWH,
                    badgePercentage: 2,
                    badgeType: TRENDS_BADGE_TYPES.NEUTRAL_DOWN_TREND,
                },
                {
                    link: '#',
                    label: 'Lighting WH Speed Bay -1',
                    value: 16.3,
                    unit: UNITS.KWH,
                    badgePercentage: 2,
                    badgeType: TRENDS_BADGE_TYPES.NEUTRAL_DOWN_TREND,
                },
            ]}
            exploreBtn={{ onClick: () => alert('Explored was clicked') }}
        />
    );
};
