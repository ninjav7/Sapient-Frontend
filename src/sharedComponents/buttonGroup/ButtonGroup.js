import React, { useState } from 'react';
import classNames from 'classnames';
import './ButtonGroup.scss';
import Typography from '../typography';

const ButtonGroup = ({ buttons, handleButtonClick, currentButtonId, noPadding }) => {
    const [clickedId, setClickedId] = useState(currentButtonId);
    const handleClick = (id) => {
        setClickedId(id);
        handleButtonClick(id);
    };
    const buttonGroupWrapper = "button-group-wrapper";
    const paddingStyle =noPadding ? 'no-padding' : null;
    return (
        <div className={classNames(buttonGroupWrapper,paddingStyle)}>
            <ul>
                {buttons.map((buttonItem, i) => {
                    const iconAlignment = buttonItem.iconAlignment == 'right' ? 'icon-right' : 'icon-left';
                    const iconPlacement =
                        iconAlignment.length && buttonItem.label && buttonItem.icon ? iconAlignment : null;
                    const disabledClass = buttonItem.disabled ? 'disabled' : null;
                    return (
                        <li
                            onClick={() => !buttonItem?.disabled && handleClick(i)}
                            className={classNames(iconPlacement, disabledClass, i === clickedId ? 'active' : '')}>
                            {buttonItem.icon && React.cloneElement(buttonItem.icon)}
                            <Typography.Body size={Typography.Sizes.md}>
                                {buttonItem.label}
                            </Typography.Body>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ButtonGroup;
