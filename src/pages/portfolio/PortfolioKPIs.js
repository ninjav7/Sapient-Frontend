import React from 'react';
import { percentageHandler } from '../../utils/helper';

import { KPIBasic, KPILabeled, KPI_UNITS } from '../../sharedComponents/KPIs';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../helpers/helpers';

import './PortfolioKPIs.scss';

const PortfolioKPIs = ({ totalBuilding = 0, overalldata = {}, daysCount = 0 }) => {
    return (
        <div className="portfolioKPIs-wrapper">
            <KPIBasic title="Total Buildings" value={totalBuilding} />

            <KPILabeled
                title="Total Consumption"
                value={formatConsumptionValue(overalldata.total_consumption.now / 1000)}
                badgePrecentage={percentageHandler(
                    overalldata.total_consumption.now,
                    overalldata.total_consumption.old
                )}
                unit={KPI_UNITS.KWH}
                tooltipText={`Total energy consumption accross all your buildings for the past ${daysCount} days.`}
                tooltipId="total-eng-cnsmp"
                type={
                    overalldata.total_consumption.now >= overalldata.total_consumption.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />

            <KPILabeled
                title="Average Energy Density"
                value={formatConsumptionValue(overalldata.average_energy_density.now / 1000)}
                badgePrecentage={percentageHandler(
                    overalldata.average_energy_density.now,
                    overalldata.average_energy_density.old
                )}
                unit={KPI_UNITS.KWH_SQ_FT}
                tooltipText={`Average energy density (kWh / sq.ft.) accross all your buildings for the past ${daysCount} days.`}
                tooltipId="avg-eng-dnty"
                type={
                    overalldata.average_energy_density.now >= overalldata.average_energy_density.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />
        </div>
    );
};

export default PortfolioKPIs;
