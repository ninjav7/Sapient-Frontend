const initalItemState = {
    items: [
        { label: 'Portfolio Overview', path: '/energy/portfolio/overview', active: true },
        // { label: 'Calendar', path: '/apps/calendar', active: true },
    ],
};

const breadCrumbItemsReducer = (prevState = initalItemState, action) => {
    switch (action.type) {
        case 'BREADCRUMBLIST':
            return { BREADCRUMBLIST: action.data };
        default:
            return prevState;
    }
};

export default breadCrumbItemsReducer;
