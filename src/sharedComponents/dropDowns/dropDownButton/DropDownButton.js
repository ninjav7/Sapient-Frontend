import React, { forwardRef } from 'react';

import { Button } from '../../button';
import DropDownBase from './DropDownBase';

import { ReactComponent as CaretDownIcon } from '../../assets/icons/caretDown.svg';
import PropTypes from 'prop-types';

const TriggerButton = forwardRef((props, ref) => (
    <Button
        iconAlignment={Button.IconAlignment.right}
        label={props.label}
        type={Button.Type.secondaryGrey}
        size={Button.Sizes.md}
        icon={<CaretDownIcon className="caret-down" />}
        buttonRef={ref}
        {...props}
    />
));

TriggerButton.displayName = 'TriggerButton';

const DropDownButton = (props) => {
    return <DropDownBase triggerButton={<TriggerButton label={props.label} icon={props.icon}/>} {...props} />;
};

DropDownButton.propTypes = {
    isOpened: PropTypes.bool,
}

export default DropDownButton;
