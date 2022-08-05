import React from 'react';
import Typography from './Typography';
import '../assets/scss/stories.scss';
import Brick from "../brick";

export default {
    title: 'Components/Typography',
    component: Typography,
};

export const Default = () => {
    return (
        <div>
            <div style={{ padding: '16px'}}>
                <h2>SubHeader</h2>
                <Typography.Subheader size={Typography.Sizes.md}>The quick fox jumps over the dog. Size: MD</Typography.Subheader>
                <Typography.Subheader size={Typography.Sizes.sm}>The quick fox jumps over the dog. Size: SM</Typography.Subheader>
                <Brick/>
                <h2>Body</h2>
                <Typography.Body size={Typography.Sizes.md}>The quick fox jumps over the dog. Size: MD</Typography.Body>
                <Typography.Body size={Typography.Sizes.sm}>The quick fox jumps over the dog. Size: SM</Typography.Body>
                <Typography.Body size={Typography.Sizes.xs}>The quick fox jumps over the dog. Size: XS</Typography.Body>
            </div>
        </div>
    );
};