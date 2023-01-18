import React, { useState } from 'react';

import Pagination from './Pagination';

import '../assets/scss/stories.scss';
import Brick from '../brick';

export default {
    title: 'Components/Pagination',
    component: Pagination,
};
export const Default = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [currentPage2, setCurrentPage2] = useState(1);
    const [pageSize2, setPageSize2] = useState(5);

    return (
        <>
            <h5>With Default List of Page Sizes</h5>
            <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={90}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
                setPageSize={(pageSize) => setPageSize(pageSize)}
            />

            <Brick sizeInRem={2} />

            <h5>With Custom List of Page Sizes</h5>
            <Pagination
                pageListSizes={[
                    {
                        label: '5 Rows',
                        value: '5',
                    },
                    {
                        label: '17 Rows',
                        value: '17',
                    },
                    {
                        label: '35 Rows',
                        value: '35',
                    },
                ]}
                className="pagination-bar"
                currentPage={currentPage2}
                totalCount={4}
                isAlwaysShown={true}
                pageSize={pageSize2}
                onPageChange={(page) => setCurrentPage2(page)}
                setPageSize={(pageSize) => setPageSize2(pageSize)}
            />
        </>
    );
};
