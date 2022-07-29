import React from 'react';
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

export default Brick;
