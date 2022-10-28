import React from 'react';
import { Col } from 'reactstrap';
import { percentageHandler } from '../../utils/helper';
import DonutChartWidget from '../../sharedComponents/donutChartWidget';
import { COLOR_SCHEME_BY_DEVICE } from '../../constants/colors';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';

// MOCK
const donutChartDataMock = [
    {
        label: 'HVAC',
        color: '#66A4CE',
        value: '12.553',
        unit: 'kWh',
        trendValue: 22,
        link: '#',
    },
    { label: 'Lighting', color: '#FBE384', value: '11.553', unit: 'kWh', trendValue: 22, link: '#' },
    { label: 'Plug', color: '#59BAA4', value: '1.553', unit: 'kWh', trendValue: 22, link: '#' },
    { label: 'Process', color: '#82EAF0', value: '0.553', unit: 'kWh', trendValue: 22, link: '#' },
];

const EndUseTotals = ({ series, options, energyConsumption, isEndUsageChartLoading }) => {
    const donutChartData = energyConsumption.map(({ device: label, energy_consumption }) => {
        let val = (parseInt(energy_consumption.now));
        let value = parseFloat(val);
        const trendValue = percentageHandler(energy_consumption.now, energy_consumption.old);;
        const trendType =
            energy_consumption.now <= energy_consumption.old
                ? TRENDS_BADGE_TYPES.DOWNWARD_TREND
                : TRENDS_BADGE_TYPES.UPWARD_TREND;

        return { unit: UNITS.KWH, color: COLOR_SCHEME_BY_DEVICE[label], label, value, trendValue, trendType};
    });

    return (
        <div>
            <DonutChartWidget
                id="consumptionEnergyDonut"
                title="After-Hours Energy"
                subtitle="Energy Totals"
                items={donutChartData}
                isEndUsageChartLoading={isEndUsageChartLoading}
            />
        </div>
    );
};

export default EndUseTotals;
