import React from 'react';
import { percentageHandler } from '../../utils/helper';

import { KPILabeled, KPI_UNITS } from '../../sharedComponents/KPIs';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../helpers/helpers';
import { UNITS } from '../../constants/units';

import '../portfolio/PortfolioKPIs.scss';

const BuildingKPIs = ({ overalldata = {}, daysCount = 0, userPrefUnits }) => {
    return (
        <div className={`portfolioKPIs-wrapper`}>
            <KPILabeled
                title="Total Carbon Emissions"
                value={formatConsumptionValue(overalldata?.total?.now / 1000, 0)}
                badgePrecentage={percentageHandler(overalldata?.total?.now, overalldata?.total?.old)}
                unit={KPI_UNITS.lbs}
                tooltipText={
                    daysCount > 1
                        ? `Total Carbon Emissions for the selected building over the past ${daysCount} days.`
                        : `Total Carbon Emissions for the selected building over the past ${daysCount} day.`
                }
                tooltipId="total-bld-cnsmp"
                type={
                    overalldata?.total?.now >= overalldata?.total?.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />
            <KPILabeled
                title={`Average Emissions ${
                    userPrefUnits === 'si' ? `${UNITS.ibs}/${UNITS.SQ_M}` : `${UNITS.ibs}/${UNITS.SQ_FT}`
                }`}
                value={formatConsumptionValue(overalldata?.average?.now / 1000, 2)}
                badgePrecentage={percentageHandler(overalldata?.average?.now, overalldata?.average?.old)}
                unit={`${userPrefUnits === 'si' ? `${UNITS.ibs}/${UNITS.SQ_M}` : `${UNITS.ibs}/${UNITS.SQ_FT}`}`}
                tooltipText={
                    daysCount > 1
                        ? `Average Emissions per ${
                              userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`
                          } for the selected building over the past ${daysCount} days.`
                        : `Average Emissions per ${
                              userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`
                          } for the selected building over the past ${daysCount} day.`
                }
                tooltipId="avg-bld-dnty"
                type={
                    overalldata?.average?.now >= overalldata?.average?.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />
            <KPILabeled
                title={`Current Carbon Intensity ${UNITS.ibs} / ${`${UNITS.mwh}`}`}
                value={formatConsumptionValue(overalldata?.current_carbon_intensity?.now / 1000, 2)}
                badgePrecentage={percentageHandler(
                    overalldata?.current_carbon_intensity?.now,
                    overalldata?.current_carbon_intensity?.old
                )}
                unit={`${UNITS.ibs} / ${`${UNITS.mwh}`}`}
                tooltipText={`Current Carbon Emissions Rate for the selected building’s region.`}
                tooltipId="cur-carb-intens"
                type={
                    overalldata?.current_carbon_intensity?.now >= overalldata?.current_carbon_intensity?.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />
        </div>
    );
};

export default BuildingKPIs;
