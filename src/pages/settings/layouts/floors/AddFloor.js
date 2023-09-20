import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import Brick from '../../../../sharedComponents/brick';
import { Button } from '../../../../sharedComponents/button';
import Typography from '../../../../sharedComponents/typography';
import { Notification } from '../../../../sharedComponents/notification';
import InputTooltip from '../../../../sharedComponents/form/input/InputTooltip';

import { addFloor } from '../services';

const AddFloor = (props) => {
    const { isModalOpen = false, closeModal, bldgId, fetchAllFloorData, notifyUser } = props;

    const [floorName, setFloorName] = useState('');
    const [floorNameError, setFloorNameError] = useState(null);
    const [isAddingFloor, setAddingFloor] = useState(false);

    const handleCreateFloor = async (floor_name, bldg_id) => {
        if (!bldg_id) return;

        if (floor_name === '') setFloorNameError(`Please enter Floor Name. It cannot be empty.`);

        if (floor_name !== '') {
            setAddingFloor(true);

            const params = `?building_id=${bldg_id}`;
            const payload = {
                parent_building: bldg_id,
                name: floor_name.trim(),
            };

            await addFloor(params, payload)
                .then((res) => {
                    const response = res?.data;
                    if (response?.success) {
                        notifyUser(Notification.Types.success, 'Floor created.');
                        fetchAllFloorData(bldg_id);
                    } else {
                        notifyUser(Notification.Types.error, 'Failed to insert Floor.');
                    }
                })
                .catch((err) => {
                    notifyUser(Notification.Types.error, 'Failed to insert Floor.');
                })
                .finally(() => {
                    setAddingFloor(false);
                    closeModal();
                    setFloorName('');
                    setFloorNameError(null);
                });
        }
    };

    return (
        <Modal show={isModalOpen} backdrop="static" keyboard={false} size="md" centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{`Add Floor`}</Typography.Header>

                <Brick sizeInRem={2} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>{`Name`}</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        placeholder="Enter Name"
                        labelSize={Typography.Sizes.md}
                        value={floorName}
                        onChange={(e) => {
                            setFloorName(e.target.value);
                            setFloorNameError(null);
                        }}
                        error={floorNameError}
                    />
                </div>

                <Brick sizeInRem={1.25} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>{`Type`}</Typography.Body>
                    <Brick sizeInRem={0.25} />
                    <InputTooltip
                        placeholder="Enter Name"
                        labelSize={Typography.Sizes.md}
                        disabled={true}
                        value={'Floor'}
                    />
                    <Brick sizeInRem={0.25} />
                    <Typography.Body size={Typography.Sizes.sm}>
                        {`Only floors can be at the building root`}
                    </Typography.Body>
                </div>

                <Brick sizeInRem={1.5} />

                <div className="d-flex justify-content-between w-100">
                    <Button
                        label={`Cancel`}
                        size={Button.Sizes.lg}
                        type={Button.Type.secondaryGrey}
                        className="w-100"
                        onClick={() => {
                            closeModal();
                            setFloorName('');
                            setFloorNameError(null);
                        }}
                    />
                    <Button
                        label={isAddingFloor ? `Saving...` : `Save`}
                        size={Button.Sizes.lg}
                        type={Button.Type.primary}
                        className="w-100"
                        onClick={() => {
                            handleCreateFloor(floorName, bldgId);
                        }}
                        disabled={isAddingFloor}
                    />
                </div>

                <Brick sizeInRem={0.25} />
            </div>
        </Modal>
    );
};

export default AddFloor;
