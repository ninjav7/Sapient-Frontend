import React from 'react';
import { percentageHandler } from '../../utils/helper';

import { KPIBasic, KPILabeled, KPI_UNITS } from '../../sharedComponents/KPIs';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../helpers/helpers';
import { UNITS } from '../../constants/units';

import './PortfolioKPIs.scss';

const PortfolioKPIs = ({ totalBuilding = 0, overalldata = {}, daysCount = 0, userPrefUnits }) => {
    return (
        <>
            <div className="portfolioKPIs-wrapper ml-2">
                <KPIBasic title="Total Buildings" value={totalBuilding} />

                <KPILabeled
                    title={`Total Carbon Emissions`}
                    value={formatConsumptionValue(overalldata?.total?.now, 2)}
                    badgePrecentage={percentageHandler(overalldata.total.now, overalldata.total.old)}
                    unit={`${userPrefUnits === 'si' ? `${UNITS.kg}` : `${UNITS.ibs}`}`}
                    tooltipText={
                        daysCount > 1
                            ? `Total carbon emissions (${
                                  userPrefUnits === 'si' ? `${UNITS.kg}` : `${UNITS.ibs}`
                              }) across all your buildings for the past ${daysCount} days.`
                            : `Total carbon emissions (${
                                  userPrefUnits === 'si' ? `${UNITS.kg}` : `${UNITS.ibs}`
                              }) across all your buildings for the past ${daysCount} day.`
                    }
                    tooltipId="total-carbon-emissions"
                    type={
                        overalldata.total.now >= overalldata.total.old
                            ? TRENDS_BADGE_TYPES.UPWARD_TREND
                            : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                    }
                />
            </div>
        </>
    );
};

export default PortfolioKPIs;
