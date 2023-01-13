import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { AvForm, AvGroup, AvInput } from 'availity-reactstrap-validation';
import { InputGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/pro-thin-svg-icons';
import { Alert, FormGroup } from 'reactstrap';
import Button from '../../../../sharedComponents/button/Button';
import Typography from '../../../../sharedComponents/typography';
import { ReactComponent as EyeSVG } from '../../../../assets/icon/eye.svg';
import { ReactComponent as EyeSlashSVG } from '../../../../assets/icon/eye-slash.svg';
import Input from '../../../../sharedComponents/form/input/Input';
import InputTooltip from '../../../../sharedComponents/form/input/InputTooltip';
import '../style.css';

const LinkModal = ({ showlink, handleLinkClose, error, message, handleAuthorize }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordType, setPasswordType] = useState('password');

    const Submit = () => {
        let ct = 0;
        var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{10,11}$/;

        if (email.length > 0 && !pattern.test(email)) {
            setEmailError(true);
            ct++;
        }
        if (password.length < 4) {
            setPasswordError(true);
            ct++;
        }

        if (ct === 0) handleAuthorize(email, password);
    };

    return (
        <Modal
            show={showlink}
            onHide={handleLinkClose}
            centered
            dialogClassName="my-modal1"
            contentClassName="my-modal1">
            <Modal.Header className="find-header">
                <Modal.Title>
                    <Typography.Header>Add TP Link - Kasa Account</Typography.Header>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="find-body">
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
                <FormGroup className="">
                    <Typography.Subheader size={Typography.Sizes.sm}>Email</Typography.Subheader>

                    <InputTooltip
                        placeholder="hello@Sapient.industries"
                        error={emailError ? 'Please Enter a Valid Email' : null}
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        labelSize={Typography.Sizes.md}
                    />
                </FormGroup>
                <FormGroup className="mb-3">
                    <Typography.Subheader size={Typography.Sizes.sm}>Password</Typography.Subheader>

                    <Input
                        placeholder="Enter your password"
                        error={passwordError ? 'Password is required' : null}
                        type={passwordType}
                        elementEnd={
                            passwordType === 'password' ? (
                                <EyeSVG
                                    onClick={() => {
                                        setPasswordType('text');
                                    }}
                                />
                            ) : (
                                <EyeSlashSVG
                                    onClick={() => {
                                        setPasswordType('password');
                                    }}
                                />
                            )
                        }
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                        labelSize={Typography.Sizes.md}
                        value={password}
                    />
                </FormGroup>
            </Modal.Body>
            <Modal.Footer className="find-footer">
                <Button
                    label="Cancel"
                    size={Button.Sizes.lg}
                    type={Button.Type.secondaryGrey}
                    onClick={() => {
                        setEmail('');
                        setPassword('');
                        setEmailError(false);
                        setPasswordError(false);
                        handleLinkClose();
                    }}
                    className="btn-width"
                />

                <Button
                    label="Add"
                    size={Button.Sizes.lg}
                    type={Button.Type.primary}
                    onClick={() => {
                        Submit();
                    }}
                    className="btn-width"
                />
            </Modal.Footer>
        </Modal>
    );
};
export default LinkModal;
