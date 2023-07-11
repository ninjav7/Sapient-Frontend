import React from 'react';
import { percentageHandler } from '../../utils/helper';

import { KPILabeled, KPI_UNITS } from '../../sharedComponents/KPIs';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../helpers/helpers';

import '../portfolio/PortfolioKPIs.scss';

const BuildingKPIs = ({ overalldata = {}, daysCount = 0 }) => {
    return (
        <div className={`portfolioKPIs-wrapper`}>
            <KPILabeled
                title="Total Consumption"
                value={formatConsumptionValue(overalldata?.total_consumption?.now / 1000, 0)}
                badgePrecentage={percentageHandler(
                    overalldata?.total_consumption?.now,
                    overalldata?.total_consumption?.old
                )}
                unit={KPI_UNITS.KWH}
                tooltipText={
                    daysCount > 1
                        ? `Total energy consumption across the selected building for the past ${daysCount} days.`
                        : `Total energy consumption across the selected building for the past ${daysCount} day.`
                }
                tooltipId="total-bld-cnsmp"
                type={
                    overalldata?.total_consumption?.now >= overalldata?.total_consumption?.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />

            <KPILabeled
                title="Average Consumption / sq. ft."
                value={formatConsumptionValue(overalldata?.average_energy_density?.now / 1000, 2)}
                badgePrecentage={percentageHandler(
                    overalldata?.average_energy_density?.now,
                    overalldata?.average_energy_density?.old
                )}
                unit={KPI_UNITS.KWH_SQ_FT}
                tooltipText={
                    daysCount > 1
                        ? `Average Consumption / sq. ft. of this building for the past ${daysCount} days.`
                        : `Average Consumption / sq. ft. of this building for the past ${daysCount} day.`
                }
                tooltipId="avg-bld-dnty"
                type={
                    overalldata?.average_energy_density?.now >= overalldata?.average_energy_density?.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />
        </div>
    );
};

export default BuildingKPIs;
