import React from 'react';
import PropTypes from "prop-types"
import cx from 'classnames';

const defaultBrickSizeInPixels = 16;

const Brick = ({ sizeInRem = null, sizeInPixels = defaultBrickSizeInPixels, className, children }) => {
    const size = sizeInRem ? `${sizeInRem}rem` : `${sizeInPixels / 16}rem`;

    return (
        <>
            <div className={cx(className, 'brick')} style={{ height: size }}>
                {children}
            </div>
        </>
    );
};

Brick.propTypes = {
    sizeInRem: PropTypes.number,
    sizeInPixels: PropTypes.number,
}

export default Brick;
