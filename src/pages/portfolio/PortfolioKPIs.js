import React from 'react';
import { percentageHandler } from '../../utils/helper';

import { KPIBasic, KPILabeled, KPI_UNITS } from '../../sharedComponents/KPIs';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../helpers/helpers';
import { UNITS } from '../../constants/units';

import './PortfolioKPIs.scss';

const PortfolioKPIs = ({ totalBuilding = 0, overallData = {}, daysCount = 0, userPrefUnits }) => {
    return (
        <>
            <div className="portfolioKPIs-wrapper ml-2">
                <KPIBasic title="Total Buildings" value={totalBuilding} />

                <KPILabeled
                    title="Total Consumption"
                    value={formatConsumptionValue(overallData?.total?.now, 0)}
                    badgePrecentage={percentageHandler(overallData?.total?.now, overallData?.total?.old)}
                    unit={KPI_UNITS.KWH}
                    tooltipText={
                        daysCount > 1
                            ? `Total energy consumption across all your buildings for the past ${daysCount} days.`
                            : `Total energy consumption across all your buildings for the past ${daysCount} day.`
                    }
                    tooltipId="total-eng-cnsmp"
                    type={
                        overallData?.total?.now >= overallData?.total?.old
                            ? TRENDS_BADGE_TYPES.UPWARD_TREND
                            : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                    }
                />

                <KPILabeled
                    title={`Average Consumption / ${userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`}`}
                    value={formatConsumptionValue(overallData?.average?.now, 2)}
                    badgePrecentage={percentageHandler(overallData?.average?.now, overallData?.average?.old)}
                    unit={`${userPrefUnits === 'si' ? `${UNITS.KWH}/${UNITS.SQ_M}` : `${UNITS.KWH}/${UNITS.SQ_FT}`}`}
                    tooltipText={
                        daysCount > 1
                            ? `Energy density (kWh / ${
                                  userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`
                              }) across all your buildings for the past ${daysCount} days.`
                            : `Energy density (kWh / ${
                                  userPrefUnits === 'si' ? `${UNITS.SQ_M}` : `${UNITS.SQ_FT}`
                              }) across all your buildings for the past ${daysCount} day.`
                    }
                    tooltipId="avg-eng-dnty"
                    type={
                        overallData?.average?.now >= overallData?.average?.old
                            ? TRENDS_BADGE_TYPES.UPWARD_TREND
                            : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                    }
                />
            </div>
        </>
    );
};

export default PortfolioKPIs;
