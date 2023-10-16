import React, { useEffect } from 'react';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';

const Alerts = () => {
    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Alerts',
                    path: '/alerts/portfolio',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'alerts';
        });
    };

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    return <div>Alerts Page</div>;
};

export default Alerts;
