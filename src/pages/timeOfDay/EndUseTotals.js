import React from 'react';
import { percentageHandler } from '../../utils/helper';
import DonutChartWidget, { DONUT_CHART_TYPES } from '../../sharedComponents/donutChartWidget';
import { COLOR_SCHEME_BY_DEVICE } from '../../constants/colors';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import colorPalette from '../../assets/scss/_colors.scss';

const EndUseTotals = ({ energyConsumption, className = '', isPlugOnly }) => {
    let donutChartData = [];

    if (isPlugOnly) {
        donutChartData = energyConsumption.map((record) => {
            const label = record?.name;
            const value = Math.round(record?.consumption?.now / 1000);
            const trendValue = percentageHandler(record?.consumption?.now, record?.consumption?.old);
            const color = record?.name === 'Occupied Hours' ? colorPalette.datavizMain1 : colorPalette.datavizMain2;
            const trendType =
                record?.consumption?.now <= record?.consumption?.old
                    ? TRENDS_BADGE_TYPES.DOWNWARD_TREND
                    : TRENDS_BADGE_TYPES.UPWARD_TREND;

            return { unit: UNITS.KWH, color, label, value, trendValue, trendType };
        });
    } else {
        donutChartData = energyConsumption.map(({ device: label, after_hours_energy_consumption }) => {
            const val = parseInt(after_hours_energy_consumption?.now);
            const value = parseFloat(val);
            const trendValue = percentageHandler(
                after_hours_energy_consumption?.now,
                after_hours_energy_consumption?.old
            );
            const trendType =
                after_hours_energy_consumption?.now <= after_hours_energy_consumption?.old
                    ? TRENDS_BADGE_TYPES.DOWNWARD_TREND
                    : TRENDS_BADGE_TYPES.UPWARD_TREND;

            return { unit: UNITS.KWH, color: COLOR_SCHEME_BY_DEVICE[label], label, value, trendValue, trendType };
        });
    }

    return (
        <div>
            <DonutChartWidget
                id="consumptionEnergyDonut"
                title={isPlugOnly ? `Occupied Hours / Off Hours Energy` : `Off Hours Energy`}
                subtitle={`Energy Total (kWh)`}
                items={donutChartData}
                type={DONUT_CHART_TYPES.VERTICAL}
                className={className}
                onMoreDetail={null}
            />
        </div>
    );
};

export default EndUseTotals;
