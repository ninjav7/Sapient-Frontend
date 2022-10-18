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
    console.log(energyConsumption);
    const donutChartData = energyConsumption.map(({ eu_name: label, consumption }) => {
        let val = (consumption / 1000).toFixed(0);
        let value = parseFloat(val);
        const trendValue = 0;
        const trendType =
                TRENDS_BADGE_TYPES.NEUTRAL_TREND;

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
