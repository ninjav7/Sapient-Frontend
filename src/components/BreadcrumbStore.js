import { Store } from 'pullstate';

export const BreadcrumbStore = new Store({
    items: [
        {
            label: 'Portfolio Overview',
            path: '/energy/portfolio/overview',
            active: true,
        },
    ],
});
