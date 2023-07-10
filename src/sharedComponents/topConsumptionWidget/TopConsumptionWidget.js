import React from 'react';
import PropTypes from 'prop-types';

import Typography from '../typography';
import Brick from '../brick';
import { Button } from '../button';

import { TRENDS_BADGE_TYPES, TrendsBadge } from '../trendsBadge';
import { formatConsumptionValue } from '../../helpers/helpers';
import { UNITS } from '../../constants/units';

import { ReactComponent as TelescopeSVG } from '../assets/icons/telescope.svg';
import './TopConsumptionWidget.scss';

const TopConsumptionWidget = ({
    subtitle,
    title,
    heads = [],
    rows = [],
    className = '',
    handleClick,
    widgetType = 'TopConsumptionWidget',
    exploreBtn,
    style,
}) => {
    return (
        <div className={`${widgetType}-wrapper ${className}`} style={style}>
            <div className="d-flex align-items-center justify-content-between">
                <div>
                    {title && <Typography.Subheader size={Typography.Sizes.md}>{title}</Typography.Subheader>}
                    <Brick sizeInRem={0.125} />
                    {subtitle && <Typography.Body size={Typography.Sizes.xs}>{subtitle}</Typography.Body>}
                </div>

                {exploreBtn && (
                    <Button size={Button.Sizes.md} icon={<TelescopeSVG />} label="Explore" {...exploreBtn} />
                )}
            </div>

            <Brick sizeInRem={0.6875} />

            <div className="horizontal-line"></div>

            <Brick sizeInRem={0.6875} />

            <div className={`${widgetType}-table d-block`}>
                <table className="w-100 top-consumption-widget-table-content">
                    <tr>
                        {heads.map((head, index) => (
                            <td className={`${widgetType}-table-head-cell`} key={index}>
                                <Typography.Subheader size={Typography.Sizes.sm}>{head}</Typography.Subheader>
                            </td>
                        ))}
                    </tr>

                    {rows.map(({ link, label, value, unit, badgePercentage, badgeType, id }) => (
                        <tr key={id}>
                            <td>
                                <Button
                                    label={label}
                                    size={Button.Sizes.md}
                                    type={Button.Type.link}
                                    className="typography-wrapper link mouse-pointer text-left p-0"
                                    onClick={() => {
                                        handleClick(label);
                                    }}
                                />
                            </td>
                            <td>
                                <Typography.Body
                                    className="d-inline top-consumption-item-value"
                                    size={Typography.Sizes.md}
                                    fontWeight={Typography.Types.SemiBold}>
                                    {formatConsumptionValue(value, 0)}
                                </Typography.Body>
                                <Typography.Body className="d-inline gray-550" size={Typography.Sizes.xxs}>
                                    {unit}
                                </Typography.Body>
                            </td>
                            <td width={40}>
                                <TrendsBadge type={badgeType} value={badgePercentage} />
                            </td>
                        </tr>
                    ))}
                </table>
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
            id: PropTypes.string,
            unit: PropTypes.oneOf(Object.values(UNITS)),
            badgePercentage: PropTypes.number,
            badgeType: PropTypes.oneOf(Object.values(TRENDS_BADGE_TYPES)),
        })
    ).isRequired,
    exploreBtn: PropTypes.shape({
        label: PropTypes.string,
        onClick: PropTypes.func,
    }),
};

export default TopConsumptionWidget;