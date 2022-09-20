import React from 'react';
import { TRENDS_BADGE_TYPES, TrendsBadge } from './index';

export default {
    title: 'Components/TrendsBadge',
    component: TrendsBadge,
};

export const Default = () => {
    return (
        <div style={{ padding: 16 }}>
            <table className="table table-borderless w-auto">
                <tbody>
                    <tr>
                        <td>Upward Trend</td>
                        <td>
                            <TrendsBadge value={30} type={TRENDS_BADGE_TYPES.UPWARD_TREND} />
                        </td>
                    </tr>
                    <tr>
                        <td>Downward Trend</td>
                        <td>
                            <TrendsBadge value={2} type={TRENDS_BADGE_TYPES.DOWNWARD_TREND} />
                        </td>
                    </tr>
                    <tr>
                        <td>Neutral Trend</td>
                        <td>
                            <TrendsBadge value={1} type={TRENDS_BADGE_TYPES.NEUTRAL_TREND} />
                        </td>
                    </tr>
                    <tr>
                        <td>Neutral down Trend</td>
                        <td>
                            <TrendsBadge value={9} type={TRENDS_BADGE_TYPES.NEUTRAL_DOWN_TREND} />
                        </td>
                    </tr>
                    <tr>
                        <td>Neutral up Trend</td>
                        <td>
                            <TrendsBadge value={3} type={TRENDS_BADGE_TYPES.NEUTRAL_UP_TREND} />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};
