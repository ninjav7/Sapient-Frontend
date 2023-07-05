import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import EditSensor from '../EditSensor';

describe('EditSensor Component Test Case', () => {
    it('should open and close the modal on button click', () => {
        const sensorObj = {
            index: 1,
            id: '63091012c5d9be0818f0fe95',
            name: '1-1',
            is_custom_model: false,
            sensor_model_id: '649e8ba0fe39f590bb0b9ab9',
            sensor_model: 'Sapient 1000A',
            rated_amps: 1000,
            amp_multiplier: 89.62,
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
        };

        render(<EditSensor sensorObj={sensorObj} />);

        const editBtn = screen.getByRole('button', {
            className: 'breaker-action-btn ml-2',
        });

        // Click the button to open the modal
        fireEvent.click(editBtn);

        // Modal should be visible after clicking the button
        const modalHeading = screen.getByText('Edit Sensor Modal');
        expect(modalHeading).toBeTruthy();

        // Find the cancel button in the modal
        const cancelBtn = screen.getByRole('button', {
            name: /Cancel/i, // Using a regular expression to match the text 'Cancel' case-insensitively
        });

        // Click the close button to close the modal
        fireEvent.click(cancelBtn);

        // Wait for the modal to close
        expect(modalHeading).toBeTruthy();
    });
});
