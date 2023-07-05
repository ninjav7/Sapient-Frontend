import React, { useState } from 'react';
import { Button } from '../../../sharedComponents/button';
import { ReactComponent as PenSVG } from '../../../assets/icon/panels/pen.svg';
import EditSensorModal from './EditSensorModal';

const EditSensor = (props) => {
    const { sensorObj } = props;
    const [modal, setModal] = useState(false);
    const openModal = () => setModal(true);
    const closeModal = () => setModal(false);

    return (
        <>
            <Button
                className="breaker-action-btn ml-2"
                onClick={openModal}
                type={Button.Type.secondaryGrey}
                label=""
                icon={<PenSVG width={15} />}
            />
            <EditSensorModal showModal={modal} closeModal={closeModal} currentSensorObj={sensorObj} {...props} />
        </>
    );
};

export default EditSensor;
