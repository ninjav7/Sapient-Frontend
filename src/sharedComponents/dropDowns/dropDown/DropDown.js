import React, { useEffect, useState } from 'react';
import { useLayer } from 'react-laag';
import PropTypes from 'prop-types';

import { removeProps } from '../../helpers/helper';

const DropDown = ({ triggerButton, ...props }) => {
    const [isOpen, setOpen] = useState(props.isOpen);

    useEffect(() => {
        setOpen(props.isOpen);
    }, [props.isOpen]);

    // helper function to close the menu
    const close = () => {
        props.onClose && props.onClose();
        setOpen(false);
    };

    const handleClick = () => {
        props.onClose && isOpen && props.onClose();
        props.onOpen && !isOpen && props.onOpen();

        setOpen(!isOpen);
    };

    const { renderLayer, triggerProps, layerProps } = useLayer({
        isOpen,
        onOutsideClick: close, // close the menu when the user clicks outside
        onDisappear: close, // close the menu when the menu gets scrolled out of sight
        overflowContainer: false, // keep the menu positioned inside the container
        auto: true, // automatically find the best placement
        placement: props.placement || 'bottom-right', // we prefer to place the menu "top-end"
        triggerOffset: 4, // keep some distance to the trigger
        containerOffset: 4, // give the menu some room to breath relative to the container
    });

    return (
        <div className="DropDown-wrapper" {...removeProps(props, 'onOpen', 'isOpen')}>
            {React.cloneElement(triggerButton, { ...triggerProps, onClick: handleClick })}
            {renderLayer(
                <div {...layerProps}>{isOpen && React.cloneElement(props.children, { ...props.children.props })}</div>
            )}
        </div>
    );
};

DropDown.propTypes = {
    triggerButton: PropTypes.node.isRequired,
    children: PropTypes.node.isRequired,
    isOpen: PropTypes.bool,
    onClose: PropTypes.func,
    onOpen: PropTypes.func,
    placement: PropTypes.oneOf([
        'bottom-start',
        'bottom-end',
        'bottom-center',
        'top-start',
        'top-center',
        'top-end',
        'left-end',
        'left-center',
        'left-start',
        'right-end',
        'right-center',
        'right-start',
        'center',
    ]),
};

export default DropDown;
