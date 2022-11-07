import React from 'react';
import PropTypes from 'prop-types';

import Typography from '../typography';
import Brick from '../brick';
import { Link } from 'react-router-dom';
import { TRENDS_BADGE_TYPES, TrendsBadge } from '../trendsBadge';
import { UNITS } from '../../constants/units';

import './TopEnergyConsumers.scss';
import { Button } from '../button';
import { ReactComponent as TelescopeSVG } from '../assets/icons/telescope.svg';
import { formatConsumptionValue } from '../../helpers/helpers';

const TopEnergyConsumers = ({ subtitle, title, heads = [], rows = [], className = '', handleClick }) => {
    return (
        <div className={`TopEnergyConsumers-wrapper ${className}`}>
            <div className="d-flex align-items-center justify-content-between mt-1">
                <div>
                    {title && <Typography.Subheader size={Typography.Sizes.md}>{title}</Typography.Subheader>}
                    {subtitle && <Typography.Body size={Typography.Sizes.xs}>{subtitle}</Typography.Body>}
                </div>

                {handleClick && (
                    <Button
                        onClick={handleClick}
                        className="ml-4"
                        label="Explore"
                        size={Button.Sizes.md}
                        type={Button.Type.secondaryGrey}
                        icon={<TelescopeSVG />}
                    />
                )}
            </div>

            <Brick sizeInRem={1.5} />
            <div className="TopEnergyConsumers-table">
                <div className="TopEnergyConsumers-table-row">
                    {heads.map((head, index) => (
                        <div className="TopEnergyConsumers-table-head-cell" key={index}>
                            <Typography.Body size={Typography.Sizes.sm}>{head}</Typography.Body>
                        </div>
                    ))}
                </div>

                {rows.map(({ link, label, value, unit, badgePercentage, badgeType }, index) => (
                    <div className="TopEnergyConsumers-table-row" key={index}>
                        <div>
                            <Link className="typography-wrapper link" to={link}>
                                {label}
                            </Link>
                        </div>
                        <div>
                            <Typography.Body
                                className="d-inline mr-1"
                                size={Typography.Sizes.md}
                                fontWeight={Typography.Types.SemiBold}>
                                {formatConsumptionValue(value, 0)}
                            </Typography.Body>
                            <Typography.Body className="d-inline" size={Typography.Sizes.xxs}>
                                {unit}
                            </Typography.Body>
                        </div>
                        <div>
                            <TrendsBadge type={badgeType} value={badgePercentage} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

TopEnergyConsumers.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    heads: PropTypes.arrayOf(PropTypes.string).isRequired,
    handleClick: PropTypes.func,
    rows: PropTypes.arrayOf(
        PropTypes.exact({
            link: PropTypes.string,
            label: PropTypes.string,
            value: PropTypes.number,
            unit: PropTypes.oneOf(Object.values(UNITS)),
            badgePercentage: PropTypes.number,
            badgeType: PropTypes.oneOf(Object.values(TRENDS_BADGE_TYPES)),
        })
    ).isRequired,
};

export default TopEnergyConsumers;
