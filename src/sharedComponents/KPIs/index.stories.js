import React from 'react';
import {KPIBasic, KPILabeled, KPIPrecentage, KPIRank, KPIWithDate} from "./index";
import {TRENDS_BADGE_TYPES} from "../trendsBadge";

export default {
    title: "Components/KPIs",
    component: KPIBasic,
    argTypes: {
        className: {
           control: false 
        },
        classNameBody: {
            control: false
        },
        type: {
            options: Object.values(TRENDS_BADGE_TYPES),
            control: { type: 'select' }
        }
    }
}

const mockKPI = {
    title: 'Consume Energy',
    value: 10
}

export const Default = args => <KPIBasic {...args} />

Default.args = mockKPI;
Default.storyName = "Basic";

export const Labeled = arg => <KPILabeled {...arg} />
Labeled.args = {
    ...mockKPI,
    badgePrecentage: 5,
    tooltipText: 'Tooltip text',
    unit: 'kWh/sq.ft.',
    type: TRENDS_BADGE_TYPES.DOWNWARD_TREND,
}

export const Percentage = arg => <KPIPrecentage {...arg} />
Percentage.args = {
    title: 'Percent of usage',
    value: 56,
    tooltipText: 'Tooltip text',
}

export const Rank = arg => <KPIRank {...arg} />
Rank.args = {
    ...mockKPI,
    title: "Ranked values",
    rank: 2,
    value: 1,
    tooltipText: 'Rank text',
}

export const WithDate = arg => <KPIWithDate {...arg} />
WithDate.args = {
    ...mockKPI,
    value: 20,
    date: "20/12/2000",
    time: '12:00 PM',
    tooltipText: 'Rank text',
    badgePrecentage: 23,
}

