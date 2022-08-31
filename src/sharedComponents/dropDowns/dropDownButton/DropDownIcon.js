import React, { forwardRef } from 'react';

import { Button } from '../../button';
import DropDownBase from './DropDownBase';

import { ReactComponent as MoreVerticalSVG } from '../../assets/icons/more-vertical.svg';

const TriggerButton = forwardRef((props, ref) => (
    <Button
        iconAlignment={Button.IconAlignment.right}
        type={Button.Type.SecondaryGrey}
        size={Button.Sizes.md}
        icon={<MoreVerticalSVG className="more-vertical" />}
        buttonRef={ref}
        {...props}
    />
));

TriggerButton.displayName = 'TriggerButton';

const DropDownIcon = props => {
    return <DropDownBase triggerButton={<TriggerButton label={props.label} />} {...props} />;
};

export default DropDownIcon;
