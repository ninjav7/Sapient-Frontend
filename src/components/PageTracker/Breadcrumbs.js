import React from 'react';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import SubNavBreadCrumbs from "../../sharedComponents/subNavBreadcrumbs";

const Breadcrumbs = () => {
    const breadcrumList = BreadcrumbStore.useState((bs) => bs.items);
    const items = breadcrumList || [];

    return (
        <SubNavBreadCrumbs items={items} />
    );
};

export default Breadcrumbs;
