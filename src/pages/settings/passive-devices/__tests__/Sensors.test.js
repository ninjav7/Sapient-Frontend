import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Sensors from '../Sensors';

// Mock for sensors list
const mockData = [
    {
        index: '1',
        id: '63091012c5d9be0818f0fe95',
        name: '1-1',
        is_custom_model: false,
        sensor_model_id: '649e8802333b504f0970494c',
        sensor_model: 'Sapient 80A',
        rated_amps: 80,
        amp_multiplier: 7.17,
        device_linked: '0013A20041D737C5',
        device_linked_id: '63091012c5d9be0818f0fe94',
        sensor_type: 'manual',
        breaker_link: 'RP-G, Breaker 1',
        breaker_id: '6317e6af7d55c5f03a246568',
        breaker_rated_amps: 30,
        panel_id: '6317e6af148bfcd6feff8e43',
        equipment: 'Concession Equipment',
        equipment_id: '632143045f80c918e064611d',
        sapient_id: '',
        equipment_type_id: '',
        equipment_type_name: '',
        status: false,
    },
];

// Mock the userPermission object
const userPermission = {
    user_role: 'admin',
    permissions: {
        permissions: {
            advanced_passive_device_permission: {
                edit: true,
            },
        },
    },
};

describe('Test Smart Meter Sensors Component', () => {
    test('renders with correct sensor data', () => {
        render(<Sensors data={mockData} userPermission={userPermission} />);

        // Assert the presence and correctness of rendered elements based on the mock data
        const indexElement = screen.getByTestId('1-1');
        expect(indexElement).toBeInTheDocument();
    });

    test('renders sensor with amps configured for with breaker', () => {
        render(<Sensors data={mockData} userPermission={userPermission} />);

        // Find the div element with data-testid="breaker-amps"
        const breakerAmpsElement = screen.getByTestId('breaker-amps');
        const breakerAmpsValue = breakerAmpsElement.textContent; // Get the value of the element
        expect(breakerAmpsValue).toBe('30A'); // checks on the value
    });
});
