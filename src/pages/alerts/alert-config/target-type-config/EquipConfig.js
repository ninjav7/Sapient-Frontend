import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Typography from '../../../../sharedComponents/typography';
import { Button } from '../../../../sharedComponents/button';
import '../styles.scss';

const EquipConfig = (props) => {
    const { isModalOpen, handleModalClose } = props;

    return (
        <React.Fragment>
            <Modal show={isModalOpen} onHide={handleModalClose} size="xl" centered backdrop="static" keyboard={false}>
                {/* Modal Header  */}
                <div className="alert-config-header-wrapper d-flex justify-content-between">
                    <div>
                        <Typography.Header size={Typography.Sizes.lg}>Equipment Configuration</Typography.Header>
                    </div>
                    <div className="d-flex">
                        <div>
                            <Button
                                label="Cancel"
                                size={Button.Sizes.md}
                                type={Button.Type.secondaryGrey}
                                onClick={handleModalClose}
                            />
                        </div>
                        <div>
                            <Button
                                label={'Add Target'}
                                size={Button.Sizes.md}
                                type={Button.Type.primary}
                                onClick={handleModalClose}
                                className="ml-2"
                            />
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
            </Modal>
        </React.Fragment>
    );
};

export default EquipConfig;
