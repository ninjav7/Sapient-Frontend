import React from 'react';
import { percentageHandler } from '../../utils/helper';

import { KPILabeled, KPI_UNITS } from '../../sharedComponents/KPIs';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../helpers/helpers';
import { UNITS } from '../../constants/units';

import '../portfolio/PortfolioKPIs.scss';

const BuildingKPIs = ({ overallData = {}, daysCount = 0, userPrefUnits }) => {
    return (
        <div className={`portfolioKPIs-wrapper`}>
            <KPILabeled
                title="Total Consumption"
                value={formatConsumptionValue(overallData?.total?.now / 1000, 0)}
                badgePrecentage={percentageHandler(overallData?.total?.now, overallData?.total?.old)}
                unit={KPI_UNITS.KWH}
                tooltipText={
                    daysCount > 1
                        ? `Total energy consumption across the selected building for the past ${daysCount} days.`
                        : `Total energy consumption across the selected building for the past ${daysCount} day.`
                }
                tooltipId="total-bld-cnsmp"
                type={
                    overallData?.total?.now >= overallData?.total?.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />

            <KPILabeled
                title={`Average Consumption / ${userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`}`}
                value={formatConsumptionValue(overallData?.average?.now / 1000, 2)}
                badgePrecentage={percentageHandler(overallData?.average?.now, overallData?.average?.old)}
                unit={`${userPrefUnits === 'si' ? `${UNITS.KWH}/${UNITS.SQ_M}` : `${UNITS.KWH}/${UNITS.SQ_FT}`}`}
                tooltipText={
                    daysCount > 1
                        ? `Average Consumption / ${
                              userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`
                          } of this building for the past ${daysCount} days.`
                        : `Average Consumption / ${
                              userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`
                          } of this building for the past ${daysCount} day.`
                }
                tooltipId="avg-bld-dnty"
                type={
                    overallData?.average?.now >= overallData?.average?.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            />
        </div>
    );
};

export default BuildingKPIs;
