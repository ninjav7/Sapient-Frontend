import React from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import '../style.css';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import colorPalette from '../../../assets/scss/_colors.scss';
import { ReactComponent as CircleXmarkSVG } from '../../../assets/icon/circle-xmark.svg';
import { ReactComponent as Pen } from '../../../assets/icon/pen.svg';
import { ReactComponent as Eye } from '../../../assets/icon/eye.svg';
import Modal from 'react-bootstrap/Modal';
import './styles.scss';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';

const CompareRoles = ({ show, setShow }) => {
    const data = [
        {
            role: 'Portfolio Admin',
            energy: 'View',
            control: 'Edit',
            explore: 'View',
            setting: 'Edit',
            administration: 'Edit',
        },
        {
            role: 'Settings & Connfiguration Admin',
            energy: 'View',
            control: 'Edit',
            explore: 'View',
            setting: 'Edit',
            administration: 'No access',
        },
        {
            role: 'Viewer',
            energy: 'View',
            control: 'View',
            explore: 'View',
            setting: 'View',
            administration: 'No access',
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
                    <Pen style={{ color: colorPalette.success700, width: '1.25rem', height: '1.25rem' }} />
                    Edit
                </Typography.Subheader>
            );
        } else {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    className="d-flex view-container justify-content-center"
                    style={{ color: colorPalette.view700 }}>
                    <Eye style={{ color: colorPalette.primaryGray450 }} />
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
                    <Pen style={{ color: colorPalette.success700, width: '1.25rem', height: '1.25rem' }} />
                    Edit
                </Typography.Subheader>
            );
        } else {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    className="d-flex no-access-container justify-content-center"
                    style={{ color: colorPalette.error700 }}>
                    <CircleXmarkSVG style={{ color: colorPalette.error700 }} />
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
                <Eye style={{ color: colorPalette.primaryGray450 }} />
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
                <Eye style={{ color: colorPalette.primaryGray450 }} />
                View
            </Typography.Subheader>
        );
    };
    const renderControl = (row) => {
        if (row?.control === 'Edit') {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    className="d-flex edit-container justify-content-center"
                    style={{ color: colorPalette.success700 }}>
                    <Pen style={{ color: colorPalette.success700, width: '1.25rem', height: '1.25rem' }} />
                    Edit
                </Typography.Subheader>
            );
        } else {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.md}
                    className="d-flex view-container justify-content-center"
                    style={{ color: colorPalette.view700 }}>
                    <Eye style={{ color: colorPalette.primaryGray450 }} />
                    View
                </Typography.Subheader>
            );
        }
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
                            name: 'Energy Module',
                            accessor: 'energy',
                            callbackValue: renderEnergy,
                        },
                        {
                            name: 'Control Module',
                            accessor: 'control',
                            callbackValue: renderControl,
                        },
                        {
                            name: 'Explore Module',
                            accessor: 'explore',
                            callbackValue: renderExplore,
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
                    ]}
                />
            </Modal.Body>
        </Modal>
    );
};

export default CompareRoles;
