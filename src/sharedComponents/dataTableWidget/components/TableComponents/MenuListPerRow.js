import React from 'react';
import Typography from '../../../typography';

import { ReactComponent as EditSVG } from '../../../assets/icons/edit.svg';
import { ReactComponent as DeleteSVG } from '../../../assets/icons/delete.svg';
import { ReactComponent as EyeSVG } from '../../../assets/icons/eye.svg';

const MenuListPerRow = ({ onDeleteRow, onEditRow, onViewRow }) => (
    <>
        {onViewRow && (
            <button className="reset-styles d-block w-100" onClick={onViewRow}>
                <div className="dropdown-list-item d-flex align-items-center borders-bottom" style={{ gap: '0.55rem' }}>
                    <EyeSVG /> <Typography.Body size={Typography.Sizes.lg}>View</Typography.Body>
                </div>
            </button>
        )}
        {onEditRow && (
            <button className="reset-styles d-block w-100" onClick={onEditRow}>
                <div className="dropdown-list-item d-flex align-items-center borders-bottom" style={{ gap: '0.75rem' }}>
                    <EditSVG /> <Typography.Body size={Typography.Sizes.lg}>Edit</Typography.Body>
                </div>
            </button>
        )}
        {onDeleteRow && (
            <button className="reset-styles d-block w-100" onClick={onDeleteRow}>
                <div className="dropdown-list-item d-flex align-items-center" style={{ gap: '0.75rem' }}>
                    <DeleteSVG className="error-600" />
                    <Typography.Body size={Typography.Sizes.lg}>
                        <span className="error-600">Delete</span>
                    </Typography.Body>
                </div>
            </button>
        )}
    </>
);

export { MenuListPerRow };
