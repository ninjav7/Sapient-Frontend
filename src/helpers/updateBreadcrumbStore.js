import { BreadcrumbStore } from '../store/BreadcrumbStore';

const defaultValue = [
    {
        label: 'Portfolio Overview',
        path: '/energy/portfolio/overview',
        active: true,
    },
];

export const updateBreadcrumbStore = (breadcrumb_list) => {
    if (!breadcrumb_list) breadcrumb_list = defaultValue;

    const breadcrumbListString = JSON.stringify(breadcrumb_list);

    localStorage.setItem('breadcrumbList', breadcrumbListString);

    BreadcrumbStore.update((s) => {
        s.breadcrumbList = breadcrumbListString;
    });
};
