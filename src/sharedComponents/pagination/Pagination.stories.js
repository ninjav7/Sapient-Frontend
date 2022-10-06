import React, { useState } from 'react';

import Pagination from './Pagination';

import '../assets/scss/stories.scss';

export default {
    title: 'Components/Pagination',
    component: Pagination,
};
export const Default = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    return (
        <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={90}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
            setPageSize={(pageSize) => setPageSize(pageSize)}
        />
    );
};
