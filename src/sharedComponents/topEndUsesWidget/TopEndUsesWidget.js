import React from 'react';
import PropTypes from 'prop-types';

import './TopEndUsesWidget.scss';
import Typography from '../typography';
import { Button } from '../button';
import Brick from '../brick';
import { TrendsBadge } from '../trendsBadge';
import { UNITS } from '../../constants/units';
import { generateID, stringOrNumberPropTypes } from '../helpers/helper';

const TopEndUsesWidgetContent = ({ title, value, unit, trends }) => {
    return (
        <div className="top-end-uses-widget-content">
            <Typography.Subheader className="gray-550" size={Typography.Sizes.md}>
                {title}
            </Typography.Subheader>
            <Brick sizeInRem={0.25} />
            <Typography.Header className="d-inline-block mr-1" size={Typography.Sizes.lg}>
                {value}
            </Typography.Header>
            <Typography.Subheader className="d-inline-block" size={Typography.Sizes.sm}>
                <span> {unit} </span>
            </Typography.Subheader>
            <Brick sizeInRem={0.5} />
            <div className="top-end-uses-trends-badge-wrapper">
                {trends &&
                    trends.map(({ trendValue, trendType, text }) => {
                        return (
                            <div className="d-flex top-end-uses-trend-badge">
                                <TrendsBadge type={trendType} value={trendValue} />
                                <Typography.Body className="gray-550 ml-1" size={Typography.Sizes.sm}>
                                    {text}
                                </Typography.Body>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
};

const TopEndUsesWidget = (props) => {
    return (
        <div className="top-end-uses-wrapper">
            <div className="w-100">
                <Typography.Subheader size={Typography.Sizes.md}>{props.title}</Typography.Subheader>
                <Typography.Body size={Typography.Sizes.xs}>{props.subtitle}</Typography.Body>
            </div>
            <div className="top-end-uses-container w-100">
                {props.data.map((topEndItem) => {
                    return (
                        <div className="top-end-uses">
                            <div className="d-flex align-items-center">
                                <Typography.Header size={Typography.Sizes.sm}>{topEndItem.title}</Typography.Header>
                                {topEndItem.viewHandler && (
                                    <Button
                                        onClick={topEndItem.viewHandler}
                                        label="View"
                                        size={Button.Sizes.md}
                                        type={Button.Type.secondaryGrey}
                                    />
                                )}
                            </div>

                            <Brick />

                            {topEndItem.items &&
                                topEndItem.items.map((item, index) => (
                                    <TopEndUsesWidgetContent {...item} key={index} />
                                ))}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

TopEndUsesWidgetContent.propTypes = {
    trendValue: PropTypes.number.isRequired,
    trendType: PropTypes.oneOf(Object.values(TrendsBadge.Type)).isRequired,
    text: PropTypes.string.isRequired,
};

TopEndUsesWidget.propTypes = {
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            title: PropTypes.string.isRequired,
            viewHandler: PropTypes.func,
            items: PropTypes.arrayOf(
                PropTypes.shape({
                    title: PropTypes.string.isRequired,
                    value: stringOrNumberPropTypes.isRequired,
                    unit: PropTypes.oneOf(Object.values(UNITS.KWH)),
                    trends: PropTypes.arrayOf(
                        PropTypes.shape({
                            trendValue: PropTypes.number.isRequired,
                            trendType: PropTypes.oneOf(Object.values(TrendsBadge.Type)).isRequired,
                            text: PropTypes.string.isRequired,
                        }).isRequired
                    ).isRequired,
                }).isRequired
            ).isRequired,
        })
    ),
};

export default TopEndUsesWidget;
