import React from 'react';
import PropTypes from 'prop-types';

import Typography from '../typography';
import Brick from '../brick';
import { Link } from 'react-router-dom';
import { TRENDS_BADGE_TYPES, TrendsBadge } from '../trendsBadge';
import { UNITS } from '../../constants/units';

import './TopConsumptionWidget.scss';
import { Button } from '../button';
import { ReactComponent as TelescopeSVG } from '../assets/icons/telescope.svg';

const TopConsumptionWidget = ({ subtitle, title, heads = [], rows = [], className = '', handleClick }) => {
    return (
        <div className={`TopConsumptionWidget-wrapper ${className}`}>
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
            <div className="TopConsumptionWidget-table">
                <div className="TopConsumptionWidget-table-row">
                    {heads.map((head, index) => (
                        <div className="TopConsumptionWidget-table-head-cell" key={index}>
                            <Typography.Body size={Typography.Sizes.sm}>{head}</Typography.Body>
                        </div>
                    ))}
                </div>

                {rows.map(({ link, label, value, unit, badgePercentage, badgeType }, index) => (
                    <div className="TopConsumptionWidget-table-row" key={index}>
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
                                {value}
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

TopConsumptionWidget.propTypes = {
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

export default TopConsumptionWidget;
