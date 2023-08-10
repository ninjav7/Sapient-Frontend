import React from 'react';
import { percentageHandler } from '../../utils/helper';

import { KPIBasic, KPILabeled, KPI_UNITS } from '../../sharedComponents/KPIs';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../helpers/helpers';
import { UNITS } from '../../constants/units';

import './PortfolioKPIs.scss';

const PortfolioKPIs = ({ totalBuilding = 0, overalldata = {}, daysCount = 0, userPrefUnits }) => {
    console.log("totalBuilding",totalBuilding);
    console.log("overalldata",overalldata);
    console.log("userPrefUnits",userPrefUnits);
    return (
        <>
            <div className="portfolioKPIs-wrapper ml-2">
                <KPIBasic title="Total Buildings" value={totalBuilding} />

                <KPILabeled
                    title={`Total Carbon Emissions`}
                    value={formatConsumptionValue(overalldata?.total_carbon_emissions?.now / 1000, 2)}
                    badgePrecentage={percentageHandler(
                        overalldata.total_carbon_emissions.now,
                        overalldata.total_carbon_emissions.old
                    )}
                    unit={`${UNITS.ibs}/${UNITS.mwh}`}
                    tooltipText={
                        daysCount > 1
                            ? `Energy density (kWh / ${
                                  userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`
                              }) across all your buildings for the past ${daysCount} days.`
                            : `Energy density (kWh / ${
                                  userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`
                              }) across all your buildings for the past ${daysCount} day.`
                    }
                    tooltipId="total-carbon-emissions"
                    type={
                        overalldata.total_carbon_emissions.now >= overalldata.total_carbon_emissions.old
                            ? TRENDS_BADGE_TYPES.UPWARD_TREND
                            : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                    }
                />
            </div>
        </>
    );
};

export default PortfolioKPIs;
