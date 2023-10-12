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
                value={overalldata.total.now.toFixed(2)}
                badgePrecentage={percentageHandler(overalldata?.total?.now, overalldata?.total?.old)}
                unit={userPrefUnits === 'si' ? UNITS.kg : KPI_UNITS.lbs}
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
                    userPrefUnits === 'si' ? `${UNITS.kg}/${UNITS.SQ_M}` : `${UNITS.ibs}/${UNITS.SQ_FT}`
                }`}
                value={overalldata?.average?.now.toFixed(2)}
                badgePrecentage={percentageHandler(overalldata?.average?.now, overalldata?.average?.old)}
                unit={`${userPrefUnits === 'si' ? `${UNITS.kg}/${UNITS.SQ_M}` : `${UNITS.ibs}/${UNITS.SQ_FT}`}`}
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
                title={`Current Carbon Intensity ${
                    userPrefUnits === 'si' ? `${UNITS.kg}` : `${UNITS.ibs}`
                } / ${`${UNITS.mwh}`}`}
                value={overalldata?.current_carbon_intensity?.now.toFixed(2)}
                badgePrecentage={percentageHandler(
                    overalldata?.current_carbon_intensity?.now,
                    overalldata?.current_carbon_intensity?.old
                )}
                unit={`${userPrefUnits === 'si' ? `${UNITS.kg}` : `${UNITS.ibs}`} / ${`${UNITS.mwh}`}`}
                tooltipText={`Current Carbon Emissions Rate for the selected building’s region.`}
                tooltipId="cur-carb-intens"
                type={
                    overalldata?.current_carbon_intensity?.now >= overalldata?.current_carbon_intensity?.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />
            <KPILabeled
                title={`eGrid Emissions Factor ${
                    userPrefUnits === 'si' ? `${UNITS.kg}` : `${UNITS.ibs}`
                } / ${`${UNITS.mwh}`}`}
                value={overalldata?.egrid_emission_factor && (overalldata?.egrid_emission_factor).toFixed(2)}
                unit={`${userPrefUnits === 'si' ? `${UNITS.kg}` : `${UNITS.ibs}`} / ${`${UNITS.mwh}`}`}
                tooltipText={`The annual average emissions factor for this building's postal code using eGRID2021 standards.`}
                tooltipId="egrid-emission-factor"
            />
            <KPILabeled
                title={`Average Carbon Intensity ${
                    userPrefUnits === 'si' ? `${UNITS.kg}` : `${UNITS.ibs}`
                } / ${`${UNITS.mwh}`}`}
                value={overalldata?.average_carbon_intensity.now.toFixed(2)}
                badgePrecentage={percentageHandler(
                    overalldata?.average_carbon_intensity?.now,
                    overalldata?.average_carbon_intensity?.old
                )}
                unit={`${userPrefUnits === 'si' ? `${UNITS.kg}` : `${UNITS.ibs}`} / ${`${UNITS.mwh}`}`}
                tooltipText={`Average real-time carbon intensity over the past ${daysCount} ${
                    daysCount > 1 ? 'days' : 'day'
                }.`}
                tooltipId="average-carbon-intensity"
                type={
                    overalldata?.average_carbon_intensity?.now >= overalldata?.average_carbon_intensity?.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />
            <KPILabeled
                title={`Difference in Emissions Reporting Factor`}
                value={(overalldata?.egrid_emission_factor - overalldata.average_carbon_intensity.now).toFixed(2)}
                badgePrecentage={percentageHandler(
                    overalldata?.egrid_emission_factor - overalldata.average_carbon_intensity.now,
                    overalldata?.egrid_emission_factor
                )}
                unit={`${userPrefUnits === 'si' ? `${UNITS.kg}` : `${UNITS.ibs}`} / ${`${UNITS.mwh}`}`}
                tooltipText={`The difference in carbon emissions factor between eGrid annual averages and real-time carbon intensity.`}
                tooltipId="change-in-emissions"
                type={
                    overalldata?.total?.now >= overalldata?.total?.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />
        </div>
    );
};

export default BuildingKPIs;
