export const EXPLORE_FILTER_TYPE = Object.freeze({
    NO_GROUPING: 'no-grouping',
    BY_ENDUSE: 'by-enduse',
    BY_SPACE: 'by-space',
    BY_SPACE_TYPE: 'by-spacetype',
    BY_FLOOR: 'by-floor',
    BY_EQUIPMENT_TYPE: 'by-equipmenttype',
});

export const exploreFiltersList = [
    {
        label: `No Grouping`,
        value: EXPLORE_FILTER_TYPE.NO_GROUPING,
    },
    {
        label: `By Space`,
        value: EXPLORE_FILTER_TYPE.BY_SPACE,
    },
    {
        label: `By Space Type`,
        value: EXPLORE_FILTER_TYPE.BY_SPACE_TYPE,
    },
    // PLT-2039: Planned to enable in Future
    // {
    //     label: `By End Use`,
    //     value: EXPLORE_FILTER_TYPE.BY_ENDUSE,
    // },
    // {
    //     label: `By Floor`,
    //     value: EXPLORE_FILTER_TYPE.BY_FLOOR,
    // },
    // {
    //     label: `By Equipment Type`,
    //     value: EXPLORE_FILTER_TYPE.BY_EQUIPMENT_TYPE,
    // },
];
