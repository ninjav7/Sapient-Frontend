import React from 'react';
import { UncontrolledTooltip } from 'reactstrap';

import { ReactComponent as TooltipIcon } from '../assets/icons/tooltip.svg';
import { generateID } from '../helpers/helper';
import { TrendsBadge } from '../trendsBadge';
import PropTypes from "prop-types";

const KPIWithDate = ({
    className = '',
    classNameBody = '',
    classNameDate = '',
    title,
    value,
    badgePrecentage,
    tooltipText,
    tooltipId = generateID(),
    unit,
    type,
    date,
    time,
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
                    <TrendsBadge value={badgePrecentage} type={type} />
                </div>
            </div>

            <div className={`KPI-component-date-wrapper ${classNameDate}`}>
                <div className="KPI-component-date">{date}</div>
                <div className="KPI-component-time">{time}</div>
            </div>
        </div>
    );
};

KPIWithDate.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]).isRequired,
    tooltipText: PropTypes.string,
    tooltipId: PropTypes.string,
    date: PropTypes.string.isRequired,
    time: PropTypes.string.isRequired,
    badgePrecentage: PropTypes.string.isRequired,
    unit: PropTypes.string.isRequired,
}

export default KPIWithDate;
