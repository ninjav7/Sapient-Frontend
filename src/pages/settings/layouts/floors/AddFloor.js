import React from 'react';
import Modal from 'react-bootstrap/Modal';

import Brick from '../../../../sharedComponents/brick';
import { Button } from '../../../../sharedComponents/button';
import Typography from '../../../../sharedComponents/typography';
import InputTooltip from '../../../../sharedComponents/form/input/InputTooltip';

const AddFloor = (props) => {
    const { isModalOpen = false, closeModal } = props;

    return (
        <Modal show={isModalOpen} backdrop="static" keyboard={false} size="md" centered>
            <div className="p-4">
                <Typography.Header size={Typography.Sizes.lg}>{`Add Floor`}</Typography.Header>

                <Brick sizeInRem={2} />

                <div>
                    <Typography.Body size={Typography.Sizes.md}>{`Name`}</Typography.Body>

                    <Brick sizeInRem={0.25} />

                    <InputTooltip placeholder="Enter Name" labelSize={Typography.Sizes.md} value={''} />
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
                        onClick={closeModal}
                    />

                    <Button label={`Save`} size={Button.Sizes.lg} type={Button.Type.primary} className="w-100" />
                </div>

                <Brick sizeInRem={0.25} />
            </div>
        </Modal>
    );
};

export default AddFloor;
