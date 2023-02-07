import { groupEdgesToColumns, mergePropsByAccessors } from '../helper';
import { edges, groupedEdges } from '../mock';

describe('groupEdgesToColumns()', () => {
    it('allow -1', () => {
        expect(groupEdgesToColumns(edges)).toEqual(groupedEdges);
    });
});

describe('mergePropsByAccessors()', () => {
    it('merge props correctly', () => {
        expect(
            mergePropsByAccessors(
                [
                    ['id', 'breaker_number'],
                    ['status', 'status'],
                    ['deviceId', 'device_id'],
                    ['sensorId', 'sensor_id'],
                    ['ratedAmps', 'rated_amps'],
                    ['ratedVolts', 'voltage'],
                    ['equipmentName', 'equipment_name'],
                ],
                {
                    breaker_number: 1,
                    rated_amps: 20,
                    voltage: 120,
                    device_id: 'E3-A7-72-4D-85-B3',
                }
            )
        ).toEqual({
            items: [
                {
                    deviceId: 'E3-A7-72-4D-85-B3',
                    id: 1,
                },
            ],
            ratedAmps: '20 A',
            ratedVolts: '120 V',
        });
    });
});
