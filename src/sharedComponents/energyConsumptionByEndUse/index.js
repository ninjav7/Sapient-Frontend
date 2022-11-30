import React from 'react';
import { percentageHandler } from '../../utils/helper';
import DonutChartWidget from '../donutChartWidget';
import { COLOR_SCHEME_BY_DEVICE } from '../../constants/colors';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../trendsBadge';

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

const EnergyConsumptionByEndUse = ({
    title,
    subtitle,
    energyConsumption,
    isEnergyConsumptionChartLoading,
    pageType,
    bldgId,
    ...props
}) => {
    const donutChartData = energyConsumption.map(({ device: label, energy_consumption }) => {
        let val = (energy_consumption.now / 1000).toFixed(0);
        let value = parseFloat(val);
        const trendValue = percentageHandler(energy_consumption.now, energy_consumption.old);
        const trendType =
            energy_consumption.now <= energy_consumption.old
                ? TRENDS_BADGE_TYPES.DOWNWARD_TREND
                : TRENDS_BADGE_TYPES.UPWARD_TREND;

        return { unit: UNITS.KWH, color: COLOR_SCHEME_BY_DEVICE[label], label, value, trendValue, trendType };
    });

    return (
            <DonutChartWidget
                id="consumptionEnergyDonut"
                title={title}
                subtitle={subtitle}
                items={donutChartData}
                isEnergyConsumptionChartLoading={isEnergyConsumptionChartLoading}
                pageType={pageType}
                bldgId={bldgId}
                onMoreDetail={props.showRouteBtn ? props.handleRouteChange : null}
                {...props}
            />
    );
};

export default EnergyConsumptionByEndUse;
