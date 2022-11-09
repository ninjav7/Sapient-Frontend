import React from 'react';
import Typography from './Typography';
import '../assets/scss/stories.scss';
import Brick from '../brick';

export default {
    title: 'Components/Typography',
    component: Typography,
};

export const Default = () => {
    return (
        <div>
            <div style={{ padding: '16px' }}>
                <h2>Header</h2>
                <Typography.Header size={Typography.Sizes.xxl}>
                    The quick fox jumps over the dog. Size: XXL
                </Typography.Header>
                <Typography.Header size={Typography.Sizes.xl}>
                    The quick fox jumps over the dog. Size: XL
                </Typography.Header>
                <Typography.Header size={Typography.Sizes.lg}>
                    The quick fox jumps over the dog. Size: LG
                </Typography.Header>
                <Typography.Header size={Typography.Sizes.md}>
                    The quick fox jumps over the dog. Size: MD
                </Typography.Header>
                <Typography.Header size={Typography.Sizes.sm}>
                    The quick fox jumps over the dog. Size: SM
                </Typography.Header>
                <Typography.Header size={Typography.Sizes.xs}>
                    The quick fox jumps over the dog. Size: XS
                </Typography.Header>
                <Brick />
                <h2>SubHeader</h2>
                <Typography.Subheader size={Typography.Sizes.md}>
                    The quick fox jumps over the dog. Size: MD
                </Typography.Subheader>
                <Typography.Subheader size={Typography.Sizes.sm}>
                    The quick fox jumps over the dog. Size: SM
                </Typography.Subheader>
                <Brick />
                <h2>Body</h2>
                <Typography.Link size={Typography.Sizes.md} href="http://google.com" as="a" target="_blank">Custom link</Typography.Link>
                <Typography.Body size={Typography.Sizes.md}>The quick fox jumps over the dog. Size: MD</Typography.Body>
                <Typography.Body size={Typography.Sizes.sm}>The quick fox jumps over the dog. Size: SM</Typography.Body>
                <Typography.Body size={Typography.Sizes.xs}>The quick fox jumps over the dog. Size: XS</Typography.Body>
                <Typography.Body size={Typography.Sizes.xxs}>The quick fox jumps over the dog. Size: XS</Typography.Body>
            </div>
        </div>
    );
};
