import React from 'react';
import Typography from './Typography';

export const TypographyLink = ({ children, size,target, href, ...props }) => {
    return (
        <Typography {...props} variant="link" as='a' target={target} size={size} href={href}>
            {children}
        </Typography>
    );
};
