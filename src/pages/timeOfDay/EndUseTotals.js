import React from 'react';
import { percentageHandler } from '../../utils/helper';
import DonutChartWidget, { DONUT_CHART_TYPES } from '../../sharedComponents/donutChartWidget';
import { COLOR_SCHEME_BY_DEVICE } from '../../constants/colors';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';

const EndUseTotals = ({ energyConsumption, isEndUsageChartLoading, className = '' }) => {
    const donutChartData = energyConsumption.map(({ device: label, after_hours_energy_consumption }) => {
        let val = parseInt(after_hours_energy_consumption?.now);
        let value = parseFloat(val);
        const trendValue = percentageHandler(after_hours_energy_consumption?.now, after_hours_energy_consumption?.old);
        const trendType =
            after_hours_energy_consumption?.now <= after_hours_energy_consumption?.old
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
                onMoreDetail={null}
            />
        </div>
    );
};

export default EndUseTotals;
