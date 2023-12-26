import React from 'react';
import { percentageHandler } from '../../utils/helper';
import DonutChartWidget, { DONUT_CHART_TYPES } from '../../sharedComponents/donutChartWidget';
import { COLOR_SCHEME_BY_DEVICE } from '../../constants/colors';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import colorPalette from '../../assets/scss/_colors.scss';
import { HOURS_TYPE } from './constants';

const EndUseTotals = (props) => {
    const { energyConsumption, className = '', isPlugOnly } = props;
    let donutChartData = [];
    let computedTotal = 0;
    let afterHourVal = 0;

    if (isPlugOnly) {
        const totalConsumptionKWh = energyConsumption.reduce((acc, item) => acc + (item?.consumption?.now || 0), 0);
        computedTotal = Math.round(totalConsumptionKWh / 1000);

        donutChartData = energyConsumption.map((record) => {
            const { name, consumption } = record || {};

            const label = name;
            const value = Math.round(consumption?.now / 1000);

            if (name === HOURS_TYPE.OFF_HOURS) afterHourVal = value;

            const trendValue = percentageHandler(consumption?.now, consumption?.old);
            const color =
                name === HOURS_TYPE.OCCUPIED_HOURS ? colorPalette.sapientSpecificHvac : colorPalette.datavizRed300;
            const trendType =
                consumption?.now <= consumption?.old
                    ? TRENDS_BADGE_TYPES.DOWNWARD_TREND
                    : TRENDS_BADGE_TYPES.UPWARD_TREND;

            return { unit: UNITS.KWH, color, label, value, trendValue, trendType };
        });

        donutChartData.forEach((el) => {
            if (el?.label === HOURS_TYPE.OCCUPIED_HOURS) el.value = computedTotal - afterHourVal;
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
                convertData={isPlugOnly}
                computedTotal={computedTotal}
                {...props}
            />
        </div>
    );
};

export default EndUseTotals;
