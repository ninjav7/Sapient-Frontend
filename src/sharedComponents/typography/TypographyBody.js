import React from 'react';
import Typography from './Typography';

export const TypographyBody = ({ children, size, ...props }) => {
    return (
        <Typography {...props} variant="body" size={size}>
            {children}
        </Typography>
    );
};
