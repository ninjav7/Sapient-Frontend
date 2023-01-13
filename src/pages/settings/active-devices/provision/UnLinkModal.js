import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-thin-svg-icons';
import { Alert, FormGroup } from 'reactstrap';
import Checkbox from '../../../../sharedComponents/form/checkbox/Checkbox';
import Button from '../../../../sharedComponents/button/Button';
import Typography from '../../../../sharedComponents/typography';
import '../style.css';

const UnLinkModal = ({ showUnlink, handleUnLinkClose, error, message, handleUnlink, linkedAccount }) => {
    const [checkedEmail, setCheckedEmail] = useState([]);
    const handleCheckedEmail = (e) => {
        checkedEmail.push(e.target.value);
    };
    return (
        <Modal
            show={showUnlink}
            onHide={handleUnLinkClose}
            centered
            dialogClassName="my-modal1"
            contentClassName="my-modal1">
            <Modal.Header className="find-header">
                <Modal.Title>
                    <Typography.Header>Unlink Account</Typography.Header>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="find-body">
                <Typography.Subheader size={Typography.Sizes.sm} style={{ textAlign: 'center' }}>
                    Choose the account that you would like to unlink from this building
                </Typography.Subheader>

                {error ? (
                    <div className="error-message">
                        <div style={{ marginRight: '1rem' }}>
                            <FontAwesomeIcon icon={faExclamationCircle} size="lg" className="ml-2 find-error-icon" />
                        </div>
                        <div>{message}</div>
                    </div>
                ) : (
                    ''
                )}
                <FormGroup className="find-box">
                    <Typography.Subheader size={Typography.Sizes.md} className="find-box-label">
                        Email
                    </Typography.Subheader>
                    <hr />
                    <FormGroup name="email">
                        {linkedAccount.map((record, index) => {
                            return (
                                <>
                                    <div className="find-row">
                                        <Checkbox
                                            label={record.email}
                                            size={Checkbox.Sizes.sm}
                                            value={record.id}
                                            required
                                            onChange={(e) => {
                                                handleCheckedEmail(e);
                                            }}
                                        />
                                    </div>
                                </>
                            );
                        })}
                    </FormGroup>
                </FormGroup>
            </Modal.Body>
            <Modal.Footer className="find-footer">
                <Button
                    label="Cancel"
                    size={Button.Sizes.lg}
                    type={Button.Type.secondaryGrey}
                    onClick={handleUnLinkClose}
                    className="btn-width"
                />

                <Button
                    label="Unlink"
                    size={Button.Sizes.lg}
                    type={Button.Type.primary}
                    onClick={() => {
                        handleUnlink(checkedEmail);
                    }}
                    className="btn-width"
                />
            </Modal.Footer>
        </Modal>
    );
};
export default UnLinkModal;
