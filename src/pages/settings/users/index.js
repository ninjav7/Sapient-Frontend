import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { fetchMemberUserList, fetchUserFilters } from './service';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { FILTER_TYPES } from '../../../sharedComponents/dataTableWidget/constants';
import 'moment-timezone';
import moment from 'moment';
import { timeZone } from '../../../utils/helper';
import colorPalette from '../../../assets/scss/_colors.scss';
import { faCircleCheck, faClockFour, faBan } from '@fortawesome/pro-thin-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { pageListSizes } from '../../../helpers/helpers';
import Brick from '../../../sharedComponents/brick';
import AddUser from './AddUser';
import '../style.css';

const SkeletonLoading = () => (
    <SkeletonTheme color="$primary-gray-1000" height={35}>
        <tr>
            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>

            <th>
                <Skeleton count={5} />
            </th>
        </tr>
    </SkeletonTheme>
);

const Users = () => {
    // Add User Modal
    const [addUserModal, setAddUserModal] = useState(false);
    const handleAddModalClose = () => setAddUserModal(false);
    const handleAddModalOpen = () => setAddUserModal(true);

    const [userPermission] = useAtom(userPermissionData);

    const [isUserDataFetched, setIsUserDataFetched] = useState(false);

    const [userData, setUserData] = useState([]);

    const [userSearchInfo, setUserSearchInfo] = useState('');
    const [sortBy, setSortBy] = useState({});
    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedStatus, setSelectedStatus] = useState(0);
    const [filterOptions, setFilterOptions] = useState([]);
    const [permissionRoleIds, setPermissionRoleIds] = useState([]);

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Users',
                    path: '/settings/users',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'account';
        });
    };

    const getUsersList = async () => {
        const ordered_by = sortBy.name === undefined || sortBy.method === null ? 'name' : sortBy.name;
        const sort_by = sortBy.method === undefined || sortBy.method === null ? 'ace' : sortBy.method;
        setIsUserDataFetched(true);
        let roleIds = encodeURIComponent(permissionRoleIds.join('+'));

        let params = `?user_info=${userSearchInfo}&page_size=${pageSize}&page_no=${pageNo}&sort_by=${sort_by}&ordered_by=${ordered_by}&timezone=${timeZone}`;
        if (selectedStatus == 3) {
            params += `&is_verified=false`;
        }
        if (selectedStatus == 2) {
            params += `&user_state=false&is_verified=true`;
        }
        if (selectedStatus == 1) {
            params += `&user_state=true&is_verified=true`;
        }
        if (roleIds.length) {
            params += `&permission_role_id=${roleIds}`;
        }

        await fetchMemberUserList(params)
            .then((res) => {
                let response = res?.data;
                setUserData(response?.data?.data);
                setTotalItems(response?.data?.total_users);
                setIsUserDataFetched(false);
            })
            .catch((error) => {
                setUserData([]);
                setIsUserDataFetched(false);
            });
    };

    const getUserFilterData = async () => {
        let params = `?user_info=${userSearchInfo}`;
        await fetchUserFilters(params)
            .then((res) => {
                let response = res.data;
                response.data.forEach((filterOptions) => {
                    const filterOptionsFetched = [
                        {
                            label: 'Roles',
                            value: 'role',
                            placeholder: 'All Roles',
                            filterType: FILTER_TYPES.MULTISELECT,
                            filterOptions: filterOptions.permission_roles.map((filterItem) => ({
                                value: filterItem?.permission_id,
                                label: filterItem?.permission_name,
                            })),
                            onClose: (options) => {
                                let opt = options;
                                if (opt.length !== 0) {
                                    let perIds = [];
                                    for (let i = 0; i < opt.length; i++) {
                                        perIds.push(opt[i].value);
                                    }
                                    setPermissionRoleIds(perIds);
                                }
                            },
                            onDelete: () => {
                                setPermissionRoleIds([]);
                            },
                        },
                    ];
                    setFilterOptions(filterOptionsFetched);
                });
            })
            .catch((error) => {});
    };

    useEffect(() => {
        getUsersList();
    }, [userSearchInfo, sortBy, pageNo, pageSize, permissionRoleIds, selectedStatus]);

    useEffect(() => {
        getUserFilterData();
    }, [userSearchInfo]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pageNo, pageSize]);

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    const currentRow = () => {
        return userData;
    };

    const renderName = (row) => {
        return (
            <>
                {userPermission?.user_role === 'admin' ||
                userPermission?.permissions?.permissions?.account_user_permission?.edit ? (
                    <Link className="typography-wrapper link" to={`/settings/users/user-profile/single/${row?._id}`}>
                        <a>{row?.first_name ? row?.first_name + ' ' + row?.last_name : row?.name}</a>
                    </Link>
                ) : (
                    <Link className="typography-wrapper link" to={`/settings/users/user-profile/single/${row?._id}`}>
                        <a>{row?.first_name ? row?.first_name + ' ' + row?.last_name : row?.name}</a>
                    </Link>
                )}
            </>
        );
    };

    const renderRole = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.sm}>
                {row?.role === '' || row?.permissions.length === 0 ? '-' : row?.permissions[0]?.permission_name}
            </Typography.Body>
        );
    };

    const renderStatus = (row) => {
        if (row?.is_verified === false) {
            return (
                <Typography.Subheader
                    size={Typography.Sizes.sm}
                    className="d-flex pending-container justify-content-center"
                    style={{ color: colorPalette.warning700 }}>
                    <FontAwesomeIcon icon={faClockFour} size="lg" style={{ color: colorPalette.warning700 }} />
                    Pending
                </Typography.Subheader>
            );
        } else {
            if (row?.is_active === false) {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="d-flex inactive-container justify-content-center"
                        style={{ color: colorPalette.primaryGray800 }}>
                        <FontAwesomeIcon icon={faBan} size="lg" style={{ color: colorPalette.primaryGray800 }} />
                        Inactive
                    </Typography.Subheader>
                );
            } else if (row?.is_active === true) {
                return (
                    <Typography.Subheader
                        size={Typography.Sizes.sm}
                        className="d-flex active-container justify-content-center"
                        style={{ color: colorPalette.success700 }}>
                        <FontAwesomeIcon icon={faCircleCheck} size="lg" style={{ color: colorPalette.success700 }} />
                        Active
                    </Typography.Subheader>
                );
            }
        }
    };

    const renderEmail = (row) => {
        return <Typography.Body size={Typography.Sizes.sm}>{row?.email === '' ? '-' : row?.email}</Typography.Body>;
    };

    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    const renderLastActive = (row) => {
        let dt = '';
        if (isValidDate(new Date(row?.last_login)) && row?.last_login != null) {
            let last_dt = new Date(row?.last_login);
            dt = moment.utc(last_dt).format(`MMM D 'YY @ hh:mm A`);
        } else {
            dt = 'Never';
        }
        return <Typography.Body size={Typography.Sizes.sm}>{dt}</Typography.Body>;
    };

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>Users</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.account_user_permission?.create ? (
                            <div className="d-flex">
                                <Button
                                    label="Add User"
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={handleAddModalOpen}
                                    icon={<PlusSVG />}
                                />
                            </div>
                        ) : null}
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={1.5} />

            <Row>
                <Col lg={12}>
                    <DataTableWidget
                        isLoading={isUserDataFetched}
                        isLoadingComponent={<SkeletonLoading />}
                        id="users"
                        onSearch={(query) => {
                            setPageNo(1);
                            setUserSearchInfo(query);
                        }}
                        buttonGroupFilterOptions={[
                            { label: 'All' },
                            { label: 'Active' },
                            { label: 'Inactive' },
                            { label: 'Pending' },
                        ]}
                        filterOptions={filterOptions}
                        onStatus={(query) => {
                            setPageNo(1);
                            setPageSize(20);
                            setSelectedStatus(query);
                        }}
                        rows={currentRow()}
                        searchResultRows={currentRow()}
                        headers={[
                            {
                                name: 'Name',
                                accessor: 'name',
                                callbackValue: renderName,
                                onSort: (method, name) => setSortBy({ method, name }),
                            },
                            {
                                name: 'Email',
                                accessor: 'email',
                                callbackValue: renderEmail,
                                onSort: (method, name) => setSortBy({ method, name }),
                            },
                            {
                                name: 'Role',
                                accessor: 'role',
                                callbackValue: renderRole,
                                onSort: (method, name) => setSortBy({ method, name }),
                            },
                            {
                                name: 'status',
                                accessor: 'status',
                                callbackValue: renderStatus,
                                onSort: (method, name) => setSortBy({ method, name }),
                            },
                            {
                                name: 'Last Active',
                                accessor: 'last_active',
                                callbackValue: renderLastActive,
                                onSort: (method, name) => setSortBy({ method, name }),
                            },
                        ]}
                        currentPage={pageNo}
                        onChangePage={setPageNo}
                        pageSize={pageSize}
                        onPageSize={(currentPageSize) => {
                            setPageNo(1);
                            setPageSize(currentPageSize);
                        }}
                        pageListSizes={pageListSizes}
                        totalCount={(() => {
                            return totalItems;
                        })()}
                        isPaginationAlwaysShown={true}
                    />
                </Col>
            </Row>

            <AddUser
                addUserModal={addUserModal}
                handleAddModalClose={handleAddModalClose}
                getUsersList={getUsersList}
            />
        </React.Fragment>
    );
};

export default Users;
