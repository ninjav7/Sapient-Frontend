import React from 'react';
import PropTypes from 'prop-types';

import Typography from '../typography';
import { Tabs } from '../tabs';
import { TRENDS_BADGE_TYPES, TrendsBadge } from '../trendsBadge';
import { TopConsumptionWidget } from '../topConsumptionWidget';

import { UNITS } from '../../constants/units';
import { generateID, stringOrNumberPropTypes } from '../helpers/helper';

import './BuildingsPeaksWidget.scss';

const TabTitle = ({ dateText, value, unit, trendValue, trendType }) => {
    return (
        <div className="buildings-peaks-widget-titles-wrapper">
            <Typography.Subheader size={Typography.Sizes.sm}>{dateText}</Typography.Subheader>
            <div className="d-flex">
                <div className="buildings-peaks-widget-values">
                    <Typography.Header size={Typography.Sizes.md} className="d-inline-block mr-1">
                        {value}
                    </Typography.Header>
                    <Typography.Subheader size={Typography.Sizes.md} className="d-inline-block">
                        {unit}
                    </Typography.Subheader>
                </div>
                <TrendsBadge type={trendType} value={trendValue} className="m-auto" />
            </div>
        </div>
    );
};

const BuildingsPeaksWidget = ({ tabs, ...props }) => {
    return (
        <div className="buildings-peaks-widget-wrapper" {...props}>
            <Tabs>
                {tabs.map(({ tabTitle, tabid, topConsumptionData }) => {
                    const key = tabid || generateID();
                    return (
                        <Tabs.Item key={key} eventKey={key} title={tabTitle}>
                            <div className="buildings-peaks-widget-content">
                                <TopConsumptionWidget {...topConsumptionData} />
                                <div className="vertical-line" />
                                <TopConsumptionWidget {...topConsumptionData} />
                            </div>
                        </Tabs.Item>
                    );
                })}
            </Tabs>
        </div>
    );
};

BuildingsPeaksWidget.TabTitle = TabTitle;

BuildingsPeaksWidget.propTypes = {
    tabs: PropTypes.arrayOf(
        PropTypes.shape({
            tabid: stringOrNumberPropTypes,
            tabTitle: PropTypes.node.isRequired,
            topConsumptionData: PropTypes.shape({
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
            }),
        })
    ),
};

TabTitle.propTypes = {
    dateText: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    unit: PropTypes.oneOf(UNITS).isRequired,
    trendType: PropTypes.oneOf(Object.values(TrendsBadge.Type)).isRequired,
    trendValue: stringOrNumberPropTypes.isRequired,
};

export default BuildingsPeaksWidget;
