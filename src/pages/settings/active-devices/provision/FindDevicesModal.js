import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { Alert, FormGroup } from 'reactstrap';
import Checkbox from '../../../../sharedComponents/form/checkbox/Checkbox';
import Button from '../../../../sharedComponents/button/Button';
import Typography from '../../../../sharedComponents/typography';
import './style.css';

const FindDevicesModal = ({
    showFind,
    handleFindClose,
    error,
    message,
    handleFindDevices,
    linkedAccount,
    checkedEmailFind,
}) => {
    const handleCheckedEmailFind = (e) => {
        checkedEmailFind.push(e.target.value);
    };
    return (
        <Modal
            show={showFind}
            onHide={handleFindClose}
            centered
            dialogClassName="my-modal1"
            contentClassName="my-modal1">
            <Modal.Header className="find-header">
                <Modal.Title>
                    <Typography.Header>Find Devices</Typography.Header>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Typography.Subheader size={Typography.Sizes.md}>
                    Select the account you would like to find devices from
                </Typography.Subheader>

                {error && (
                    <Alert color="danger" isOpen={error ? true : false}>
                        <Typography.Subheader size={Typography.Sizes.sm}>{message}</Typography.Subheader>
                    </Alert>
                )}
                <FormGroup className="find-box mt-2 mb-0">
                    <FormGroup name="email" className="mb-0">
                        {linkedAccount.map((record, index) => {
                            return (
                                <>
                                    <div className="find-row">
                                        <Checkbox
                                            size={Checkbox.Sizes.sm}
                                            value={record.id}
                                            required
                                            onChange={(e) => {
                                                handleCheckedEmailFind(e);
                                            }}
                                        />
                                        <Typography.Body size={Typography.Sizes.md} className="find-link-color">
                                            {record.email}
                                        </Typography.Body>
                                    </div>
                                </>
                            );
                        })}
                    </FormGroup>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer className="find-footer">
                <Button
                    label=" Cancel"
                    size={Button.Sizes.lg}
                    type={Button.Type.secondaryGrey}
                    onClick={handleFindClose}
                    className="btn-width"
                />

                <Button
                    label="Find Devices"
                    size={Button.Sizes.lg}
                    type={Button.Type.primary}
                    onClick={() => {
                        handleFindDevices(checkedEmailFind);
                    }}
                    className="btn-width"
                />
            </Modal.Footer>
        </Modal>
    );
};
export default FindDevicesModal;
