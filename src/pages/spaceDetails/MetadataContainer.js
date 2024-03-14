import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import Typography from '../../sharedComponents/typography';
import colorPalette from '../../assets/scss/_colors.scss';
import { formatConsumptionValue } from '../../helpers/explorehelpers';

const MetadataContainer = ({ metadata = {}, isFetching = false }) => {
    return (
        <>
            <div className="d-flex flex-column w-auto h-auto metadata-container">
                {isFetching ? (
                    <SkeletonTheme
                        baseColor={colorPalette.primaryGray150}
                        highlightColor={colorPalette.baseBackground}
                        borderRadius={10}
                        height={15}>
                        <Skeleton count={10} className="mb-2" />
                    </SkeletonTheme>
                ) : (
                    <div>
                        <div style={{ gap: '0.5rem' }}>
                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Typography.Subheader size={Typography.Sizes.md}>Space Type:</Typography.Subheader>
                                <Typography.Subheader size={Typography.Sizes.lg}>
                                    {metadata?.space_type_name
                                        ? formatConsumptionValue(metadata?.space_type_name)
                                        : '-'}
                                </Typography.Subheader>
                            </div>

                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Typography.Subheader size={Typography.Sizes.md}>
                                    Equipment Service Space:
                                </Typography.Subheader>
                                <Typography.Subheader size={Typography.Sizes.lg}>
                                    {metadata?.equipment_count
                                        ? formatConsumptionValue(Math.round(metadata?.equipment_count))
                                        : '-'}
                                </Typography.Subheader>
                            </div>

                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Typography.Subheader size={Typography.Sizes.md}>Tags:</Typography.Subheader>
                                <Typography.Subheader size={Typography.Sizes.lg}>
                                    {Array.isArray(metadata?.tag) && metadata.tag.length > 0
                                        ? formatConsumptionValue(metadata.tag.join(', '))
                                        : 'None'}
                                </Typography.Subheader>
                            </div>

                            <div className="d-flex" style={{ gap: '0.5rem' }}>
                                <Typography.Subheader size={Typography.Sizes.md}>Square Footage:</Typography.Subheader>
                                <Typography.Subheader size={Typography.Sizes.lg}>
                                    {metadata?.square_footage
                                        ? formatConsumptionValue(metadata.square_footage) + ' m^2'
                                        : '0 m^2'}
                                </Typography.Subheader>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default MetadataContainer;
