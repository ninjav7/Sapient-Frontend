import React from 'react';
import { Button } from '../button';
import Brick from '../brick';

import { useNotification } from './useNotification';
import { Notification } from './Notification';

const mockData = {
    title: 'Snack Bar title',
    description: 'Snack Bar description',
};

export const NotificationDemo = ({ actionButtons }) => {
    const [openSnackbar] = useNotification();

    return (
        <div>
            <Button onClick={() => openSnackbar(mockData)}>Click to see info snackbar</Button>
            <Brick />
            <Button
                onClick={() =>
                    openSnackbar({ ...mockData, type: Notification.Types.warning, duration: 6000, actionButtons })
                }>
                Click to see warning snackbar
            </Button>
            <Brick />
            <Button
                onClick={() =>
                    openSnackbar({
                        ...mockData,
                        title: 'with custom style',
                        description: 'with custom style',
                        type: Notification.Types.error,
                        style: {
                            width: 300,
                        },
                    })
                }>
                Click to see error snackbar (with custom style)
            </Button>
            <Brick />
            <Button onClick={() => openSnackbar({ ...mockData, type: Notification.Types.success })}>
                Click to see success snackbar
            </Button>
            <Brick />
        </div>
    );
};
