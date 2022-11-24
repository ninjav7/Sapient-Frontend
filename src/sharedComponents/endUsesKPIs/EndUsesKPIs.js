import React from 'react';
import PropTypes from 'prop-types';

import './EndUsesKPIs.scss';
import Typography from '../typography';
import Brick from '../brick';
import { TrendsBadge } from '../trendsBadge';
import { UNITS } from '../../constants/units';
import { generateID, stringOrNumberPropTypes } from '../helpers/helper';

const EndUsesKPIsContent = ({ title, value, unit, trends }) => {
    return (
        <div className="end-uses-kpi-widget-content">
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
            <div className="end-uses-kpi-trends-badge-wrapper">
                {trends &&
                    trends.map(({ trendValue, trendType, text }) => {
                        return (
                            <div className="d-flex end-uses-kpi-trend-badge" key={generateID()}>
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

const EndUsesKPIs = ({ data }) => {
    return (
        <div className="end-uses-kpi-wrapper">
            <div className="end-uses-kpi d-flex justify-content-start">
                {data.items && data.items.map((item, index) => <EndUsesKPIsContent {...item} key={index} />)}
            </div>
        </div>
    );
};

EndUsesKPIsContent.propTypes = {
    title: PropTypes.string.isRequired,
    value: PropTypes.number,
    unit: PropTypes.string.isRequired,
    trends: PropTypes.arrayOf(
        PropTypes.shape({
            trendValue: PropTypes.number.isRequired,
            trendType: PropTypes.oneOf(Object.values(TrendsBadge.Type)).isRequired,
            text: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
};

EndUsesKPIs.propTypes = {
    data: PropTypes.shape({
        title: PropTypes.string.isRequired,
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
    }),
};

export default EndUsesKPIs;
