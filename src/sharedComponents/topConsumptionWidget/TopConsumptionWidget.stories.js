import React from 'react';
import TopConsumptionWidget from './TopConsumptionWidget';
import '../assets/scss/stories.scss';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../trendsBadge';
import { BrowserRouter } from 'react-router-dom';

export default {
    title: 'Widgets/TopConsumptionWidget',
    component: TopConsumptionWidget,
};

export const Default = () => {
    return (
        <BrowserRouter>
            <TopConsumptionWidget
                title="Title"
                heads={['Equipment', 'Power', 'Change']}
                rows={[
                    {
                        link: '#',
                        label: 'AHU 1',
                        value: 25.3,
                        unit: UNITS.KWH,
                        badgePercentage: 22,
                        badgeType: TRENDS_BADGE_TYPES.UPWARD_TREND,
                    },
                    {
                        link: '#',
                        label: 'AHU 2',
                        value: 25.3,
                        unit: UNITS.KWH,
                        badgePercentage: 3,
                        badgeType: TRENDS_BADGE_TYPES.DOWNWARD_TREND,
                    },
                    {
                        link: '#',
                        label: 'RTU 1',
                        value: 2.3,
                        unit: UNITS.KWH,
                        badgePercentage: 6,
                        badgeType: TRENDS_BADGE_TYPES.UPWARD_TREND,
                    },
                    {
                        link: '#',
                        label: 'Front RTU',
                        value: 25.3,
                        unit: UNITS.KWH,
                        badgePercentage: 2,
                        badgeType: TRENDS_BADGE_TYPES.NEUTRAL_DOWN_TREND,
                    },
                    {
                        link: '#',
                        label: 'Chiller',
                        value: 16.3,
                        unit: UNITS.KWH,
                        badgePercentage: 2,
                        badgeType: TRENDS_BADGE_TYPES.NEUTRAL_DOWN_TREND,
                    },
                    {
                        link: '#',
                        label: 'Chiller',
                        value: 16.3,
                        unit: UNITS.KWH,
                        badgePercentage: 2,
                        badgeType: TRENDS_BADGE_TYPES.NEUTRAL_DOWN_TREND,
                    },
                ]}
            />
        </BrowserRouter>
    );
};
