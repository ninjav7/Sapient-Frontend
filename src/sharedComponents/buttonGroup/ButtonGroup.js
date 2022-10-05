import React, { useState } from 'react';
import classNames from 'classnames';
import './ButtonGroup.scss';

const ButtonGroup = ({ buttons, handleButtonClick }) => {
    const [clickedId, setClickedId] = useState(-1);
    const handleClick = (event, id) => {
        setClickedId(id);
        handleButtonClick(event);
    };
    return (
        <div className="button-group-wrapper">
            <ul>
                {buttons.map((buttonItem, i) => {
                    const iconAlignment =
                        buttonItem.iconAlignment == 'right'
                            ? 'icon-right'
                            : buttonItem.iconAlignment == 'left'
                            ? 'icon-left'
                            : '';
                    const iconPlacement = iconAlignment.length && buttonItem.icon ? iconAlignment : null;
                    const disabledClass = buttonItem.disabled?'disabled':null;
                    return (
                        <li
                            onClick={(event) => !buttonItem?.disabled&&handleClick(event, i)}
                            className={classNames(iconPlacement,disabledClass, i === clickedId ? 'active' : '')}>
                            {buttonItem.icon && React.cloneElement(buttonItem.icon)}
                            {buttonItem.label}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default ButtonGroup;
