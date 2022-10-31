export const customOptions = [
    { label: 'Today', value: 'Today', moment: () => [moment().subtract(0, 'd'), moment()] },
    { label: 'Last 7 Days', value: 'Last 7 Days', moment: () => [moment().subtract(6, 'd'), moment()] },
    { label: 'Last 4 Weeks', value: 'Last 4 Weeks', moment: () => [moment().subtract(4, 'week'), moment()] },
    { label: 'Last 3 Months', value: 'Last 3 Months', moment: () => [moment().subtract(3, 'month'), moment()] },
    { label: 'Last 12 Months', value: 'Last 12 Months', moment: () => [moment().subtract(12, 'month'), moment()] },
    { label: 'Month to Date', value: 'Month to Date', moment: () => [moment().startOf('month'), moment()] },
    { label: 'Quarter to Date', value: 'Quarter to Date', moment: () => [moment().startOf('quarter'), moment()] },
    { label: 'Year to Date', value: 'Year to Date', moment: () => [moment().startOf('year'), moment()] },
    { label: 'Custom', value: 'Custom' },
];
