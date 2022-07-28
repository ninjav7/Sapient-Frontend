import React from 'react';
import Typography from './Typography';

const TypographySubheader = ({ children, size, ...props }) => (
    <Typography {...props} variant="subheader" size={size}>
        {children}
    </Typography>
);

export default TypographySubheader;
