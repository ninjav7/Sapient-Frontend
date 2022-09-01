import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import Typography from '../typography';

import './Avatar.scss';

const AVATAR_SIZES = Object.freeze({
    sm: 'sm',
    md: 'md',
    lg: 'lg',
    xl: 'xl',
});

const Avatar = (props) => {
    const classNames = cx('Avatar-wrapper', {
        [props.size]: !!props.size,
    });

    return (
        <div className={classNames}>
            <div className="Avatar-image-wrapper">
                <img src={props.avatarUrl} alt="avatar image" className="Avatar-image" />
                {/* Indicator was removed for awhile. */}
                {/*<div className="Avatar-indicator"></div>*/}
            </div>

            <div className="avatar-details">
                <Typography.Body size={Typography.Sizes.sm} className="avatar-details-username">
                    {props.userName}
                </Typography.Body>
                <Typography.Body size={Typography.Sizes.xs} className="avatar-details-useremail">
                    {props.userEmail}
                </Typography.Body>
            </div>
        </div>
    );
};

Avatar.Sizes = AVATAR_SIZES;

Avatar.propTypes = {
    avatarUrl: PropTypes.string.isRequired,
    userName: PropTypes.string.isRequired,
    userEmail: PropTypes.string.isRequired,
    size: PropTypes.oneOf(Object.values(AVATAR_SIZES)),
};

Avatar.defaultProps = {
    size: AVATAR_SIZES.sm,
};

export default Avatar;
