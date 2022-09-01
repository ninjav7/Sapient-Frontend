import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '../button';
import { UncontrolledTooltip } from 'reactstrap';
import { ReactComponent as TooltipIcon } from '../assets/icons/tooltip.svg';
import { generateID } from '../helpers/helper';
import { Link } from 'react-router-dom';

const KPIButton = ({
    title,
    tooltipText,
    tooltipId = generateID(),
    labelButton,
    linkButton,
    className = '',
    classNameBody = '',
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
                <Link className="text-decoration-none" to={linkButton}>
                    <Button size={Button.Sizes.sm} label={labelButton} type={Button.Type.SecondaryGrey} />
                </Link>
            </div>
        </div>
    );
};

KPIButton.propTypes = {
    title: PropTypes.string.isRequired,
    labelButton: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    linkButton: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default KPIButton;
