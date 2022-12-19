import { useContext } from 'react';
import { NotificationContext } from './NotificationProvider';

import { TYPES } from './constants';

// Custom hook to trigger the snackbar on function components
export const useNotification = () => {
    const { openSnackbar, closeSnackbar = () => null } = useContext(NotificationContext);

    const open = ({ type = TYPES.info, ...props }) => {
        openSnackbar && openSnackbar({ type, ...props });
    };

    // Returns methods in hooks array way
    return [open, closeSnackbar];
};
