import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './DangerZone.scss';
import Typography from '../typography';
import { Button } from '../button';

const DangerZone = ({
    title,
    headerContent,
    bodyContent,
    labelButton,
    onClickButton,
    iconButton,
    classNameWrapper,
    style,
}) => {
    return (
        <div className={cx('danger-zone-wrapper', classNameWrapper)} style={style}>
            <div className="danger-zone-header">
                {title && (
                    <Typography.Subheader className="gray-550" size={Typography.Sizes.sm}>
                        {title}
                    </Typography.Subheader>
                )}
                {headerContent}
            </div>
            <div className="danger-zone-body">
                {onClickButton && (
                    <Button
                        icon={React.cloneElement(iconButton, {
                            width: 20,
                            height: 20,
                            className: cx('danger-zone-btn-icon', iconButton.className),
                        })}
                        onClick={onClickButton}
                        size={Button.Sizes.md}
                        type={Button.Type.secondaryDistructive}
                        label={labelButton}
                        className="box-shadows-xs"
                    />
                )}
                {bodyContent}
            </div>
        </div>
    );
};

DangerZone.propTypes = {
    title: PropTypes.node.isRequired,
    labelButton: PropTypes.node,
    onClickButton: PropTypes.func,
    iconButton: PropTypes.node,
    bodyContent: PropTypes.node,
    headerContent: PropTypes.node,
    classNameWrapper: PropTypes.string,
};

export default DangerZone;
