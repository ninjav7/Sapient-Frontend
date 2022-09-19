import React from 'react';
import { Button } from './index';

import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';

export const ICON_SIZES = {
    [Button.Sizes.lg]: 11,
};

const ButtonTertiary = (props) => {
    return (
        <Button
            {...props}
            type={Button.Type.tertiary}
            icon={<ArrowRight style={{ height: ICON_SIZES[props.size] }} />}
            iconAlignment={Button.IconAlignment.right}
        />
    );
};

export { ButtonTertiary };
