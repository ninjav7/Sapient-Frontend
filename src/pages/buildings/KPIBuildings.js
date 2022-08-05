import React from 'react';
import DetailedButton from './DetailedButton';
import { percentageHandler } from '../../utils/helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleInfo } from '@fortawesome/pro-solid-svg-icons';
import { UncontrolledTooltip } from 'reactstrap';
import { Link } from 'react-router-dom';
import {KPIButton, KPILabeled} from '../../sharedComponents/KPIs';
import { UNITS } from '../../constants/units';
import { TRENDS_BADGE_TYPES } from '../../sharedComponents/trendsBadge';

const KPIBuildings = ({ overview, daysCount }) => {
    return (
        <div className="KPIBuildings-wrapper">
            <div className="energy-summary-alignment1 KPI-wrapper">
                <div className="card-box-style button-style">
                    <div className="">
                        <KPILabeled
                            unit={UNITS.KWH}
                            title="Total Consumption"
                            tooltipText={`Total energy consumption accross all your buildings for the past ${daysCount} days.`}
                            tooltipId={`total-bld-cnsmp`}
                            badgePrecentage={percentageHandler(
                                overview.total_consumption.now,
                                overview.total_consumption.old
                            )}
                            value={overview.total_consumption.now / 1000}
                        />
                    </div>
                </div>
                {/* 
                    <div className="card-box-style button-style">
                        <div >
                            <h5 className="card-title subtitle-style">
                                Portfolio Rank&nbsp;&nbsp;
                                <div>
                                    <FontAwesomeIcon icon={faCircleInfo} size="md" color="#D0D5DD" id="title" />
                                    <UncontrolledTooltip placement="bottom" target="#title">
                                        Portfolio Rank
                                    </UncontrolledTooltip>
                                </div>
                            </h5>
                            <p className="card-text card-content-style">
                                1<span className="card-unit-style">&nbsp;&nbsp;of&nbsp;{buildingsEnergyConsume.length}</span>
                            </p>
                        </div>
                    </div> 
                                */}
                <div className="card-box-style button-style">
                    <div >
                        <KPILabeled
                            unit={UNITS.KWH_SQ_FT}
                            title="Energy Density"
                            value={overview.average_energy_density.now / 1000}
                            badgePrecentage={percentageHandler(
                                overview.average_energy_density.now,
                                overview.average_energy_density.old
                            )}
                            type={
                                overview.average_energy_density.now >= overview.average_energy_density.old
                                    ? TRENDS_BADGE_TYPES.UPWARD_TREND
                                    : TRENDS_BADGE_TYPES.DOWNWARD_TREND
                            }
                            tooltipText={`Average energy density (kWh / sq.ft.) accross all your buildings for the past ${daysCount} days.`}
                            tooltipId="avg-bld-dnty"
                        />
                    </div>
                </div>
                {/*<div className="card-box-style button-style">
                        <div >
                            <DetailedButton
                                title="12 Mo. Electric EUI"
                                description={overview.yearly_electric_eui.now / 1000}
                                unit="kBtu/ft/yr"
                                value={percentageHandler(
                                    overview.yearly_electric_eui.now,
                                    overview.yearly_electric_eui.old
                                )}
                                consumptionNormal={overview.yearly_electric_eui.now >= overview.yearly_electric_eui.old}
                                infoText={`The Electric Energy Use Intensity across all of your buildings in the last calendar year.`}
                                infoType={`total-bld-eui`}
                            />
                        </div>
                    </div>
                    */}
                
                
                <div className="card-box-style button-style">
                    <div >
                        <KPIButton title='Monitored Load' tooltipText='Add Monitored Load Data' labelButton='Add Utility Bill' linkButton='/settings/utility-bills' />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default KPIBuildings;
