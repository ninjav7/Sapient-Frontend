import React from 'react';
import Typography from './Typography';
import PropTypes from 'prop-types';

export const TypographyLink = ({ children, size, target = 'null', href, ...props }) => {
    return (
        <Typography {...props} variant="link" as="a" target={target} size={size} href={href}>
            {children}
        </Typography>
    );
};

TypographyLink.propTypes = {
    target: PropTypes.oneOf(['_blank', null]),
};
