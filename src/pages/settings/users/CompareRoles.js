import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import '../style.css';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import colorPalette from '../../../assets/scss/_colors.scss';
import { faCircleXmark, faPen, faEye } from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Modal from 'react-bootstrap/Modal';
import './styles.scss';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';

const CompareRoles = ({ show, setShow }) => {
    const data = [
        {
            role: 'Portfolio Admin',
            setting: 'Edit',
            administration: 'Edit',
            energy: 'View',
            explore: 'View',
        },
        {
            role: 'Settings & Configuration Admin',
            setting: 'Edit',
            administration: 'No access',
            energy: 'View',
            explore: 'View',
        },
        {
            role: 'Viewer',
            setting: 'View',
            administration: 'No access',
            energy: 'View',
            explore: 'View',
        },
    ];
    const currentRow = () => {
        return data;
    };
    const renderRole = (row) => {
        return (
            <Typography.Subheader size={Typography.Sizes.md} Types={Typography.Types.Bold}>
                {row?.role === '' ? '-' : row?.role}
            </Typography.Subheader>
        );
    };
    const renderSettings = (row) => {
        if (row?.setting === 'Edit') {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    className="d-flex edit-container justify-content-center"
                    style={{ color: colorPalette.success700 }}>
                    <FontAwesomeIcon icon={faPen} size="md" style={{ color: colorPalette.success700 }} />
                    Edit
                </Typography.Subheader>
            );
        } else {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    className="d-flex view-container justify-content-center"
                    style={{ color: colorPalette.view700 }}>
                    <FontAwesomeIcon icon={faEye} size="md" style={{ color: colorPalette.primaryGray450 }} />
                    View
                </Typography.Subheader>
            );
        }
    };

    const renderAdministration = (row) => {
        if (row?.administration === 'Edit') {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    className="d-flex edit-container justify-content-center"
                    style={{ color: colorPalette.success700 }}>
                    <FontAwesomeIcon icon={faPen} size="md" style={{ color: colorPalette.success700 }} />
                    Edit
                </Typography.Subheader>
            );
        } else {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    className="d-flex no-access-container justify-content-center"
                    style={{ color: colorPalette.error700 }}>
                    <FontAwesomeIcon icon={faCircleXmark} size="md" style={{ color: colorPalette.error700 }} />
                    No Access
                </Typography.Subheader>
            );
        }
    };
    const renderEnergy = (row) => {
        return (
            <Typography.Subheader
                size={Typography.Sizes.md}
                className="d-flex view-container justify-content-center"
                style={{ color: colorPalette.view700 }}>
                <FontAwesomeIcon icon={faEye} size="md" style={{ color: colorPalette.primaryGray450 }} />
                View
            </Typography.Subheader>
        );
    };
    const renderExplore = (row) => {
        return (
            <Typography.Subheader
                size={Typography.Sizes.md}
                className="d-flex view-container justify-content-center"
                style={{ color: colorPalette.view700 }}>
                <FontAwesomeIcon icon={faEye} size="md" style={{ color: colorPalette.primaryGray450 }} />
                View
            </Typography.Subheader>
        );
    };

    return (
        <Modal
            show={show}
            onHide={() => {
                setShow(false);
            }}
            centered
            dialogClassName="modal-role-compare">
            <Modal.Header style={{ paddingLeft: '2rem', paddingRight: '2rem', paddingTop: '2rem' }}>
                <Modal.Title>
                    <div className="row" style={{ justifyContent: 'space-between' }}>
                        <Typography.Header size={Typography.Sizes.md} style={{ color: colorPalette.primary }}>
                            Roles Comparison
                        </Typography.Header>
                    </div>
                </Modal.Title>
                <Button
                    label={'Done'}
                    size={Button.Sizes.lg}
                    type={Button.Type.primary}
                    className="buttonStyle"
                    onClick={() => setShow(false)}
                />
            </Modal.Header>
            <Modal.Body style={{ paddingLeft: '1.5rem', paddingRight: '1.5rem' }}>
                <DataTableWidget
                    id="compare_roles"
                    rows={currentRow()}
                    buttonGroupFilterOptions={[]}
                    disableColumnDragging={true}
                    headers={[
                        {
                            name: 'Role',
                            accessor: 'role',
                            callbackValue: renderRole,
                        },
                        {
                            name: 'Settings Module',
                            accessor: 'settings',
                            callbackValue: renderSettings,
                        },
                        {
                            name: 'User Administration',
                            accessor: 'administration',
                            callbackValue: renderAdministration,
                        },
                        {
                            name: 'Energy Module',
                            accessor: 'energy',
                            callbackValue: renderEnergy,
                        },
                        {
                            name: 'Explore Module',
                            accessor: 'explore',
                            callbackValue: renderExplore,
                        },
                    ]}
                />
            </Modal.Body>
        </Modal>
    );
};

export default CompareRoles;
