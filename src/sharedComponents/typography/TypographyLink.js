import React from 'react';
import Typography from './Typography';

export const TypographyLink = ({ children, size, href, ...props }) => {
    return (
        <Typography {...props} variant="link" size={size} href={href}>
            {children}
        </Typography>
    );
};
