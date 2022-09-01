import React from 'react';
import { KPIBasic, KPILabeled, KPIPercentage, KPIRank, KPIWithDate, KPIButton } from './index';
import { TRENDS_BADGE_TYPES } from '../trendsBadge';
import { BrowserRouter } from 'react-router-dom';

export default {
    title: 'Components/KPIs',
    component: KPIBasic,
    argTypes: {
        className: {
            control: false,
        },
        classNameBody: {
            control: false,
        },
        type: {
            options: Object.values(TRENDS_BADGE_TYPES),
            control: { type: 'select' },
        },
    },
};

const mockKPI = {
    title: 'Consume Energy',
    value: 10,
};

export const Default = (props) => <KPIBasic {...props} />;

Default.args = mockKPI;
Default.storyName = 'Basic';

export const WithButton = (props) => (
    <BrowserRouter>
        <KPIButton {...props} />
    </BrowserRouter>
);
WithButton.args = {
    ...mockKPI,
    tooltipText: 'Tooltip text',
    labelButton: 'Text',
    linkButton: '#',
};

export const Labeled = (props) => <KPILabeled {...props} />;
Labeled.args = {
    ...mockKPI,
    badgePrecentage: 5,
    tooltipText: 'Tooltip text',
    unit: 'kWh/sq.ft.',
    type: TRENDS_BADGE_TYPES.DOWNWARD_TREND,
};

export const Percentage = (props) => <KPIPercentage {...props} />;
Percentage.args = {
    title: 'Percent of usage',
    value: 56,
    tooltipText: 'Tooltip text',
};

export const Rank = (props) => <KPIRank {...props} />;
Rank.args = {
    ...mockKPI,
    title: 'Ranked values',
    rank: 2,
    value: 1,
    tooltipText: 'Rank text',
};

export const WithDate = (props) => <KPIWithDate {...props} />;
WithDate.args = {
    ...mockKPI,
    value: 20,
    date: '20/12/2000',
    time: '12:00 PM',
    tooltipText: 'Rank text',
    badgePrecentage: 23,
};
