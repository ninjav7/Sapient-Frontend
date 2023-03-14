import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Typography from '../../../../typography';

import './UpperLegendComponent.scss';

const UpperLegendComponent = ({ onClick, label, styles, disabled }) => {
    const [isDisabled, setIsDisabled] = useState(!!disabled);

    const handlerClick = () => {
        const state = !isDisabled;

        setIsDisabled((state) => {
            return !state;
        });

        onClick && onClick(state);
    };

    return (
        <>
            <button
                className="d-flex align-items-center plot-bands-legends-item"
                role="btn"
                style={{
                    opacity: isDisabled ? 0.4 : 1,
                }}
                onClick={handlerClick}>
                <div className="plot-bands-legends-circle" style={styles} />
                <Typography.Subheader size={Typography.Sizes.sm} className="gray-550">
                    {label}
                </Typography.Subheader>
            </button>
        </>
    );
};

UpperLegendComponent.propTypes = {
    onClick: PropTypes.func.isRequired,
    label: PropTypes.node.isRequired,
    styles: PropTypes.object.isRequired,
    disabled: PropTypes.bool,
};

export { UpperLegendComponent };
