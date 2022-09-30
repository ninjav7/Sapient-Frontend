import React from 'react';
import BuildingsPeaksWidget from './BuildingsPeaksWidget';
import '../assets/scss/stories.scss';
import { BrowserRouter } from 'react-router-dom';
import { TRENDS_BADGE_TYPES, TrendsBadge } from '../trendsBadge';
import { UNITS } from '../../constants/units';

export default {
    title: 'Widgets/BuildingsPeaksWidget',
    component: BuildingsPeaksWidget,
};

export const Default = (props) => (
    <BrowserRouter>
        <BuildingsPeaksWidget {...props} />
    </BrowserRouter>
);

const mockTotalConsumption = {
    title: 'Top Peak Catagories',
    subtitle: 'At building peak time',
    handleClick: alert,
    heads: ['Equipment', 'Power', 'Change'],
    rows: [
        {
            link: '#',
            label: 'AHU 1',
            value: 251.3,
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
    ],
};

Default.args = {
    tabs: [
        {
            tabTitle: (
                <BuildingsPeaksWidget.TabTitle
                    dateText="March 1st @ 1:20 PM"
                    value="29"
                    unit={UNITS.KWH}
                    trendValue={10}
                    trendType={TrendsBadge.Type.DOWNWARD_TREND}
                />
            ),
            topConsumptionData: mockTotalConsumption,
        },
        {
            tabTitle: (
                <BuildingsPeaksWidget.TabTitle
                    dateText="March 3rd @ 3:20 PM"
                    value="225"
                    unit={UNITS.KWH}
                    trendValue={7}
                    trendType={TrendsBadge.Type.UPWARD_TREND}
                />
            ),
            topConsumptionData: mockTotalConsumption,
        },
    ],
};
