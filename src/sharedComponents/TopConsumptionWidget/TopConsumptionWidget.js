import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './TopConsumptionWidget.scss';
import Typography from '../typography';
import Brick from '../brick';
import { Link } from 'react-router-dom';
import { TRENDS_BADGE_TYPES, TrendsBadge } from '../trendsBadge';
import { UNITS } from '../../constants/units';

const TopConsumptionWidget = ({ title, heads = [], rows = [], className }) => {
    return (
        <div className={`TopConsumptionWidget-wrapper ${className}`}>
            <Typography.Subheader size={Typography.Sizes.md}>{title}</Typography.Subheader>
            <Brick sizeInRem={0.6785} />
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
                        <td>
                            <Link className="typography-wrapper link" to={link}>
                                {label}
                            </Link>
                        </td>
                        <td>
                            <Typography.Body
                                className="d-inline"
                                size={Typography.Sizes.md}
                                fontWeight={Typography.Types.SemiBold}>
                                {value}
                            </Typography.Body>{' '}
                            <Typography.Body className="d-inline" size={Typography.Sizes.xxs}>
                                {unit}
                            </Typography.Body>
                        </td>
                        <td>
                            <TrendsBadge type={badgeType} value={badgePercentage} />
                        </td>
                    </div>
                ))}
            </div>
        </div>
    );
};

TopConsumptionWidget.propTypes = {
    title: PropTypes.string.isRequired,
    heads: PropTypes.arrayOf(PropTypes.string).isRequired,
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
