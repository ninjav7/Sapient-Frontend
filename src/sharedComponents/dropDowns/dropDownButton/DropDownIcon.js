import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';

import { Button } from '../../button';
import DropDownBase from './DropDownBase';

import { ReactComponent as MoreVerticalSVG } from '../../assets/icons/more-vertical.svg';

const TriggerButton = forwardRef((props, ref) => {
    return (
        <Button
            iconAlignment={Button.IconAlignment.right}
            type={Button.Type.secondaryGrey}
            size={Button.Sizes.md}
            buttonRef={ref}
            {...props}
            icon={props.icon ? props.icon : <MoreVerticalSVG className="more-vertical" />}
        />
    );
});

TriggerButton.displayName = 'TriggerButton';

const DropDownIcon = (props) => {
    return (
        <DropDownBase
            classNameMenu={props.classNameMenu}
            triggerButton={
                <TriggerButton label={props.label} icon={props.triggerButtonIcon} className={props.classNameButton} />
            }
            {...props}
        />
    );
};

DropDownIcon.propTypes = {
    triggerButtonIcon: PropTypes.node,
    classNameMenu: PropTypes.string,
    classNameButton: PropTypes.string,
    closeOnSelect: PropTypes.bool,
};

export default DropDownIcon;
