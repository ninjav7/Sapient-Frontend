import React from 'react';
import { percentageHandler } from '../../utils/helper';

import { KPIBasic, KPILabeled, KPI_UNITS } from '../../sharedComponents/KPIs';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../helpers/helpers';

import './PortfolioKPIs.scss';

const PortfolioKPIs = ({ totalBuilding = 0, overalldata = {}, daysCount = 0 }, isKPIsLoading) => {
    return (
        <>
            <div className="portfolioKPIs-wrapper ml-2">
                <KPIBasic title="Total Buildings" value={totalBuilding} />

                <KPILabeled
                    title="Total Consumption"
                    value={formatConsumptionValue(overalldata.total_consumption.now / 1000, 0)}
                    badgePrecentage={percentageHandler(
                        overalldata.total_consumption.now,
                        overalldata.total_consumption.old
                    )}
                    unit={KPI_UNITS.KWH}
                    tooltipText={
                        daysCount > 1
                            ? `Total energy consumption across all your buildings for the past ${daysCount} days.`
                            : `Total energy consumption across all your buildings for the past ${daysCount} day.`
                    }
                    tooltipId="total-eng-cnsmp"
                    type={
                        overalldata.total_consumption.now >= overalldata.total_consumption.old
                            ? TRENDS_BADGE_TYPES.UPWARD_TREND
                            : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                    }
                />

                <KPILabeled
                    title="Average Consumption / sq. ft."
                    value={formatConsumptionValue(overalldata.average_energy_density.now / 1000, 2)}
                    badgePrecentage={percentageHandler(
                        overalldata.average_energy_density.now,
                        overalldata.average_energy_density.old
                    )}
                    unit={KPI_UNITS.KWH_SQ_FT}
                    tooltipText={
                        daysCount > 1
                            ? `Energy density (kWh / sq. ft) across all your buildings for the past ${daysCount} days.`
                            : `Energy density (kWh / sq. ft) across all your buildings for the past ${daysCount} day.`
                    }
                    tooltipId="avg-eng-dnty"
                    type={
                        overalldata.average_energy_density.now >= overalldata.average_energy_density.old
                            ? TRENDS_BADGE_TYPES.UPWARD_TREND
                            : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                    }
                />
            </div>
        </>
    );
};

export default PortfolioKPIs;
