import { TARGET_TYPES } from '../constants';

export const openAlertsMockData = [
    {
        id: 1,
        target: '123 Main St. portland, OR',
        target_type: TARGET_TYPES.BUILDING,
        condition: 'Energy consumption for the month is above 10,000 kWh',
        timestamps: '2023-10-17T07:00:08.657Z',
    },
    {
        id: 2,
        target: 'Cooling - Multiple equipment',
        target_type: TARGET_TYPES.EQUIPMENT,
        condition: 'RMS Current is above 123 A',
        timestamps: '2023-10-17T08:00:08.657Z',
    },
    {
        id: 3,
        target: 'Building of any type',
        target_type: TARGET_TYPES.BUILDING,
        condition: 'Peak Demand for current month is above 1,300 kWh',
        timestamps: '2023-10-17T09:00:08.657Z',
    },
    {
        id: 4,
        target: 'Cooling AHU 1',
        target_type: TARGET_TYPES.EQUIPMENT,
        condition: 'Energy consumption for the month is above 10,000 kWh',
        timestamps: '2023-10-17T10:25:08.657Z',
    },
];

export const alertSettingsMock = [
    {
        id: 1,
        target: 'Building of any type',
        target_type: TARGET_TYPES.BUILDING,
        condition: 'Energy consumption for the month is above 400 kWh',
        sent_to: 'test.user@sapient.industries',
        created_at: '2023/10/04',
    },
    {
        id: 2,
        target: 'Cooling - Multiple equipment',
        target_type: TARGET_TYPES.EQUIPMENT,
        sent_to: 'test.user@sapient.industries',
        condition: 'RMS Current is above 123 A',
        created_at: '2023/10/05',
    },
    {
        id: 3,
        target: 'Equipment of any type',
        target_type: TARGET_TYPES.EQUIPMENT,
        condition: 'Peak Power is above 123 kW',
        sent_to: 'test.user@sapient.industries',
        created_at: '2023/10/06',
    },
    {
        id: 4,
        target: '15 University Blvd. Hartford, CT',
        target_type: TARGET_TYPES.BUILDING,
        sent_to: 'test.user@sapient.industries',
        condition: 'Peak Demand for current month is above 1300 kWh',
        created_at: '2023/10/07',
    },
    {
        id: 5,
        target: '123 Main St. Portland, OR',
        target_type: TARGET_TYPES.BUILDING,
        sent_to: 'test.user@sapient.industries',
        condition: 'Energy consumption for the month is above 400 kWh',
        created_at: '2023/10/08',
    },
    {
        id: 6,
        target: 'Cooling AHU 1',
        target_type: TARGET_TYPES.EQUIPMENT,
        sent_to: 'test.user@sapient.industries',
        condition: 'Peak Power is above 123 kWh',
        created_at: '2023/10/09',
    },
];
