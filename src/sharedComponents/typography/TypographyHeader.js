import React from 'react';
import Typography from './Typography';

export const TypographyHeader = ({ children, size, ...props }) => {
    return (
        <Typography {...props} variant="header" size={size}>
            {children}
        </Typography>
    );
};
