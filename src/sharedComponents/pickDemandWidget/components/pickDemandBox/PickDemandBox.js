import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Typography from '../../../typography';
import Brick from '../../../brick';
import { Button } from '../../../button';

import { stringOrNumberPropTypes } from '../../../helpers/helper';
import { ReactComponent as TelescopeSVG } from '../../../assets/icons/telescope.svg';

import './PickDemandBox.scss';

const PickDemandBox = ({ items = [], handleClick, ...props }) => {
    return (
        <div className="pick-demand-box-wrapper" {...props}>
            <Typography.Subheader className="pick-demand-box-title" size={Typography.Sizes.md}>
                {props.dateText}
            </Typography.Subheader>
            <Typography.Header size={Typography.Sizes.lg}>
                {props.value}
                <Typography.Subheader size={Typography.Sizes.sm} className="pick-demand-box-unit">
                    {props.unit}
                </Typography.Subheader>
            </Typography.Header>
            <Brick sizeInRem={1.5} />
            <div className="position-relative pick-demand-box-widget-links">
                <Typography.Subheader className="pick-demand-box-title" size={Typography.Sizes.md}>
                    Top Contributors
                </Typography.Subheader>
                <Brick sizeInRem={0.75} />
                <nav>
                    {!!items.length &&
                        items.map(({ label, to, value, unit, ...props }, index) => (
                            <div
                                {...props}
                                key={index}
                                className="d-flex justify-content-between align-items-center pick-demand-box-list-item">
                                <Link to={to} className="typography-wrapper link">
                                    {label}
                                </Link>

                                <Typography.Subheader size={Typography.Sizes.md}>
                                    {value}
                                    <Typography.Body
                                        size={Typography.Sizes.xxs}
                                        className="pick-demand-box-list-item-unit">
                                        {unit}
                                    </Typography.Body>
                                </Typography.Subheader>
                            </div>
                        ))}
                </nav>
                <div className="pick-demand-widget-overlay">
                    {handleClick && (
                        <Button
                            onClick={handleClick}
                            label="Explore"
                            size={Button.Sizes.md}
                            type={Button.Type.SecondaryGrey}
                            icon={<TelescopeSVG />}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

PickDemandBox.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: stringOrNumberPropTypes.isRequired,
            unit: PropTypes.string.isRequired,
            to: PropTypes.string.isRequired,
        })
    ),
    dateText: PropTypes.string.isRequired,
    value: stringOrNumberPropTypes.isRequired,
    unit: PropTypes.string.isRequired,
    handleClick: PropTypes.func,
};

export default PickDemandBox;
