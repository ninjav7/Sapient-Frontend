import { ReactComponent as EditSVG } from '../../../assets/icons/edit.svg';
import Typography from '../../../typography';
import { ReactComponent as DeleteSVG } from '../../../assets/icons/delete.svg';
import React from 'react';

const MenuListPerRow = ({ onDeleteRow, onEditRow }) => (
    <>
        {onDeleteRow && (
            <button className="reset-styles d-block w-100" onClick={onEditRow}>
                <div className="dropdown-list-item d-flex align-items-center borders-bottom">
                    <EditSVG className="mr-3" /> <Typography.Body size={Typography.Sizes.lg}>Edit</Typography.Body>
                </div>
            </button>
        )}
        {onDeleteRow && (
            <button className="reset-styles d-block w-100" onClick={onDeleteRow}>
                <div className="dropdown-list-item d-flex align-items-center">
                    <DeleteSVG className="mr-3 error-600" />{' '}
                    <Typography.Body size={Typography.Sizes.lg}>
                        <span className="error-600">Delete</span>
                    </Typography.Body>
                </div>
            </button>
        )}
    </>
);

export { MenuListPerRow };
