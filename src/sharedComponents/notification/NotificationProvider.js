import React, { createContext, memo, useCallback, useEffect, useState } from 'react';
import { CSSTransition } from 'react-transition-group';

import { Notification } from './Notification';

import { generateID } from '../helpers/helper';
import { COMPONENT_TYPES } from './constants';

export const SNACKBAR_DURATION = 4000;

// Context used by the hook useNotification() and HoC withSnackbar()
export const NotificationContext = createContext({});

const SnackBar = memo(({ duration = SNACKBAR_DURATION, id, closeSnackbar, ...props }) => {
    const [stateOpen, setStateOpen] = useState(false);

    const handleClose = useCallback(() => {
        setStateOpen(false);

        setTimeout(() => {
            closeSnackbar({ id });
        }, 400);
    }, []);

    useEffect(() => {
        setStateOpen(true);

        // Sets timeout to close the snackbar
        const timerId = +setTimeout(handleClose, duration);
        return () => clearTimeout(timerId);
    }, []);

    return (
        <CSSTransition
            in={stateOpen}
            timeout={400}
            mountOnEnter
            unmountOnExit
            classNames={{
                enter: `notification-snackbar-enter`,
                enterActive: 'notification-snackbar-enter-active',
                exitActive: 'notification-snackbar-exit-active',
            }}>
            <div className="notification-snackbar">
                <Notification
                    {...props}
                    component={COMPONENT_TYPES.snackBar}
                    onClose={handleClose}
                    closeByCloseBtn={false}
                />
            </div>
        </CSSTransition>
    );
});

export const NotificationProvider = ({ children }) => {
    const [instances, setInstances] = useState([]);

    const triggerSnackbar = ({ title, description, type, duration, id = generateID(), ...props }) => {
        setInstances((oldState) => {
            return [...oldState, { title, description, type, duration, id, ...props }];
        });
    };

    const openSnackbar = (snackbarProps) => {
        triggerSnackbar(snackbarProps);
    };

    // Closes the snackbar
    const closeSnackbar = ({ id }) => {
        setInstances((oldState) => {
            return oldState.filter((instance) => instance.id !== id);
        });
    };

    // Returns the Provider that must wrap the application
    return (
        <NotificationContext.Provider value={{ openSnackbar, closeSnackbar }}>
            {children}
            <div className="notification-snackbar-wrapper">
                {instances.map((props) => (
                    <SnackBar {...props} key={props.id} closeSnackbar={closeSnackbar} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};
