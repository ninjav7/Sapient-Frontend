import React from 'react';
import { percentageHandler } from '../../utils/helper';

import { KPIBasic, KPILabeled, KPI_UNITS } from '../../sharedComponents/KPIs';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';
import { formatConsumptionValue } from '../../helpers/helpers';
import Skeleton from 'react-loading-skeleton';

import './PortfolioKPIs.scss';

const PortfolioKPIs = ({ totalBuilding = 0, overalldata = {}, daysCount = 0 }, isKPIsLoading) => {
    return (
        <>
            {/* {isKPIsLoading ? (
                <div>
                    <Skeleton count={1} color="#f9fafb" height={80} width={500} />
                </div>
            ) : ( */}
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
                    value={formatConsumptionValue(overalldata.average_energy_density.now / 1000, 2)}
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

                {/* <KPILabeled
                title="12 Mo. Electric EUI"
                value={formatConsumptionValue(overalldata.yearly_electric_eui.now / 1000)}
                badgePrecentage={percentageHandler(
                    overalldata.yearly_electric_eui.now,
                    overalldata.yearly_electric_eui.old
                )}
                unit={KPI_UNITS.KBTU_FT_YR}
                tooltipText={`The Electric Energy Use Intensity across all of your buildings in the last calendar year.`}
                tooltipId="total-eui"
                type={
                    overalldata.yearly_electric_eui.now >= overalldata.yearly_electric_eui.old
                        ? TRENDS_BADGE_TYPES.UPWARD_TREND
                        : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                }
            /> */}
            </div>
            {/* )} */}
        </>
    );
};

export default PortfolioKPIs;
