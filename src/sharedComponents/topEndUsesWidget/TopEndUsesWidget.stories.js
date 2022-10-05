import React from 'react';
import TopEndUsesWidget from './TopEndUsesWidget';
import '../assets/scss/stories.scss';
import { UNITS } from '../../constants/units';
import { TrendsBadge } from '../trendsBadge';

export default {
    title: 'Widgets/TopEndUsesWidget',
    component: TopEndUsesWidget,
};

export const Default = (props) => <TopEndUsesWidget {...props} />;

Default.args = {
    title: 'Top Systems by Usage',
    subtitle: 'Click explore to see more energy usage details.',
    data: [
        {
            title: 'HVAC',
            viewHandler: alert,
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
        {
            title: 'Chillers',
            viewHandler: alert,
            items: [
                {
                    title: 'Total Consumption',
                    value: 1141,
                    unit: UNITS.KWH,
                    trends: [
                        { trendValue: 22, trendType: TrendsBadge.Type.DOWNWARD_TREND, text: 'since last period' },
                        { trendValue: 6, trendType: TrendsBadge.Type.UPWARD_TREND, text: 'from same period last year' },
                    ],
                },
                {
                    title: 'After-Hours Consumption',
                    value: 42,
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
        {
            title: 'CRACs',
            viewHandler: alert,
            items: [
                {
                    title: 'Total Consumption',
                    value: 112,
                    unit: UNITS.KWH,
                    trends: [
                        { trendValue: 22, trendType: TrendsBadge.Type.DOWNWARD_TREND, text: 'since last period' },
                        { trendValue: 6, trendType: TrendsBadge.Type.UPWARD_TREND, text: 'from same period last year' },
                    ],
                },
                {
                    title: 'After-Hours Consumption',
                    value: 12,
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
    ],
};
