import React from 'react';
import { percentageHandler } from '../../utils/helper';
import DonutChartWidget, { DONUT_CHART_TYPES } from '../../sharedComponents/donutChartWidget';
import { COLOR_SCHEME_BY_DEVICE } from '../../constants/colors';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';

const EndUseTotals = ({ energyConsumption, isEndUsageChartLoading, className = '' }) => {
    const donutChartData = energyConsumption.map(({ device: label, energy_consumption }) => {
        let val = parseInt(energy_consumption.now);
        let value = parseFloat(val);
        const trendValue = percentageHandler(energy_consumption.now, energy_consumption.old);
        const trendType =
            energy_consumption.now <= energy_consumption.old
                ? TRENDS_BADGE_TYPES.DOWNWARD_TREND
                : TRENDS_BADGE_TYPES.UPWARD_TREND;

        return { unit: UNITS.KWH, color: COLOR_SCHEME_BY_DEVICE[label], label, value, trendValue, trendType };
    });

    return (
        <div>
            <DonutChartWidget
                id="consumptionEnergyDonut"
                title="After-Hours Energy"
                subtitle="Energy Total (kWh)"
                items={donutChartData}
                isEndUsageChartLoading={isEndUsageChartLoading}
                type={DONUT_CHART_TYPES.VERTICAL}
                className={className}
            />
        </div>
    );
};

export default EndUseTotals;
