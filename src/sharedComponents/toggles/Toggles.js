import React, { useCallback, useMemo } from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import { TEXT_ALIGN, TOGGLES_SIZES } from './constants';

import './Toggles.scss';
import Typography from '../typography';
import Brick from '../brick';

const Toggles = (props) => {
    const { size = TOGGLES_SIZES.sm, onChange, label, description, textAlignment = TEXT_ALIGN.right } = props;

    const classNameWrapper = cx('toggles-wrapper', {
        [size]: !!size,
        [`text-alignment-${textAlignment}`]: !!textAlignment,
    });

    const mapLabelsSizes = useMemo(() => {
        const map = {
            [TOGGLES_SIZES.sm]: {
                label: 'sm',
                description: 'xs',
            },
        };

        return map[size];
    }, []);

    return (
        <div className={classNameWrapper}>
            <label className="switch m-0">
                <input type="checkbox" onChange={onChange} />
                <span className="slider round" tabIndex={0}></span>
            </label>

            {(!!label || !!description) && (
                    <div className="toggle-label">
                        <Brick sizeInRem={0.0625} />
                        {label && <Typography.Body size={mapLabelsSizes.label}>{label}</Typography.Body>}
                        {description && (
                            <Typography.Body size={mapLabelsSizes.description}>{description}</Typography.Body>
                        )}
                    </div>
                )}
        </div>
    );
};

Toggles.Sizes = TOGGLES_SIZES;
Toggles.TextAlignment = TEXT_ALIGN;

Toggles.propTypes = {
    label: PropTypes.node,
    description: PropTypes.node,
    textAlignment: PropTypes.oneOf(Object.values(TEXT_ALIGN)),
    size: PropTypes.oneOf(Object.values(TOGGLES_SIZES)),
    onChange: PropTypes.func.isRequired,
};

export default Toggles;
