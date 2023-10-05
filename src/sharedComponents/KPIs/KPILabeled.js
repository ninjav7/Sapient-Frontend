import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

import { ReactComponent as TooltipIcon } from '../assets/icons/tooltip.svg';
import { generateID } from '../helpers/helper';
import { TRENDS_BADGE_TYPES, TrendsBadge } from '../trendsBadge';
import PropTypes from 'prop-types';

const KPILabeled = ({
    className = '',
    classNameBody = '',
    title,
    value,
    badgePrecentage,
    tooltipText,
    tooltipId = generateID(),
    unit,
    type,
}) => {
    return (
        <div className={`KPI-component-wrapper ${className}`}>
            <div className={`KPI-component-body ${classNameBody}`}>
                <div className="d-flex align-items-center">
                    <h5 className="KPI-component-title">{title}</h5>
                    {tooltipText && (
                        <>
                            <UncontrolledTooltip placement="bottom" target={'tooltip-' + tooltipId}>
                                {tooltipText}
                            </UncontrolledTooltip>

                            <button type="button" className="KPI-component-tooltip-button" id={'tooltip-' + tooltipId}>
                                <TooltipIcon className="KPI-component-tooltip-icon" />
                            </button>
                        </>
                    )}
                </div>
                <div className="d-flex">
                    <p className="KPI-component-text"> {value} </p>
                    <div className="KPI-component-unit"> {unit} </div>
                    {badgePrecentage && <TrendsBadge value={badgePrecentage} type={type} />}
                </div>
            </div>
        </div>
    );
};

KPILabeled.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    badgePrecentage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    tooltipText: PropTypes.string,
    tooltipId: PropTypes.string,
    unit: PropTypes.string.isRequired,
    type: PropTypes.oneOf(Object.values(TRENDS_BADGE_TYPES)),
};

export default KPILabeled;
