import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import colorPalette from '../assets/scss/_colors.scss';

const SkeletonLoader = ({ noOfColumns = 5, noOfRows = 10 }) => {
    const rowArray = Array.from({ length: noOfColumns });

    return (
        <SkeletonTheme
            baseColor={colorPalette.primaryGray150}
            highlightColor={colorPalette.baseBackground}
            borderRadius={10}
            height={30}>
            <tr>
                {rowArray.map((_, index) => (
                    <th key={index}>
                        <Skeleton count={noOfRows} />
                    </th>
                ))}
            </tr>
        </SkeletonTheme>
    );
};

export default SkeletonLoader;
