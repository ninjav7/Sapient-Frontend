import React from 'react';
import classnames from 'classnames';
import { usePagination, DOTS } from './usePagination';
import './Pagination.scss';
import Select from '../form/select';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';

const Pagination = (props) => {
    const { onPageChange, totalCount, siblingCount = 1, currentPage, pageSize, className, setPageSize } = props;

    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
    });

    if (currentPage === 0 || paginationRange.length < 2) {
        return null;
    }

    const onNext = () => {
        onPageChange(currentPage + 1);
    };

    const onPrevious = () => {
        onPageChange(currentPage - 1);
    };

    let lastPage = paginationRange[paginationRange.length - 1];
    return (
        <div className="pagination-wrapper">
            <Select
                defaultValue={pageSize}
                label="Select"
                onChange={({ value }) => {
                    if (value === -1) {
                        return;
                    }
                    setPageSize(value);
                }}
                options={[
                    {
                        label: '10 Rows',
                        value: '10',
                    },
                    {
                        label: '15 Rows',
                        value: '15',
                    },
                    {
                        label: '20 Rows',
                        value: '20',
                    },
                ]}></Select>
            <ul className={classnames('pagination-container', { [className]: className })}>
                <li
                    className={classnames('pagination-item', {
                        disabled: currentPage === 1,
                    })}
                    onClick={onPrevious}>
                    <div className="arrow left">
                        <ArrowRight />
                    </div>
                </li>
                {paginationRange.map((pageNumber, index) => {
                    if (pageNumber === DOTS) {
                        return <li className="pagination-item dots">&#8230;</li>;
                    }

                    return (
                        <li
                            key={index}
                            className={classnames('pagination-item', {
                                selected: pageNumber === currentPage,
                            })}
                            onClick={() => onPageChange(pageNumber)}>
                            {pageNumber}
                        </li>
                    );
                })}
                <li
                    className={classnames('pagination-item', {
                        disabled: currentPage === lastPage,
                    })}
                    onClick={onNext}>
                    <div className="arrow right">
                        <ArrowRight />
                    </div>
                </li>
            </ul>
        </div>
    );
};

export default Pagination;
