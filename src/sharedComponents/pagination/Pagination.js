import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { usePagination, DOTS } from './usePagination';
import './Pagination.scss';
import Select from '../form/select';
import { ReactComponent as ArrowRight } from '../assets/icons/arrow-right.svg';
import { generateID, stringOrNumberPropTypes } from '../helpers/helper';

const DEFAULT_LIST_PAGE_SIZES = [
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
];

const Pagination = (props) => {
    const {
        onPageChange,
        totalCount,
        siblingCount = 1,
        currentPage,
        pageSize = DEFAULT_LIST_PAGE_SIZES[0],
        className,
        setPageSize,
        pageListSizes = DEFAULT_LIST_PAGE_SIZES,
    } = props;

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
                defaultValue={pageListSizes.find(({ value }) => +value === pageSize) || pageListSizes[0]}
                label="Select"
                menuPlacement="auto"
                onChange={({ value }) => {
                    if (value === -1) {
                        return;
                    }
                    setPageSize(value);
                }}
                options={pageListSizes}
            />
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
                {paginationRange.map((pageNumber) => {
                    if (pageNumber === DOTS) {
                        return (
                            <li className="pagination-item dots" key={generateID()}>
                                &#8230;
                            </li>
                        );
                    }

                    return (
                        <li
                            key={generateID()}
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

Pagination.propTypes = {
    siblingCount: PropTypes.number,
    onPageChange: PropTypes.func.isRequired,
    totalCount: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,
    pageSize: stringOrNumberPropTypes,
    setPageSize: PropTypes.func.isRequired,
    pageListSizes: PropTypes.arrayOf(
        PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: stringOrNumberPropTypes.isRequired,
        })
    ),
};

export default Pagination;
