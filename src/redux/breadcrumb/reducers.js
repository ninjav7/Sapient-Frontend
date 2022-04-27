const initalItemState = {
    items: [
        { label: 'Portfolio Overview', path: '/energy/portfolio/overview', active: true },
        // { label: 'Calendar', path: '/apps/calendar', active: true },
    ],
};
const breadCrumbItemsReducer = (prevState = initalItemState, action) => {
    console.log('Reducer called!');
    switch (action.type) {
        case 'BreadcrumbList':
            return { List: action.items };
        default:
            return prevState;
    }
};

export default breadCrumbItemsReducer;
