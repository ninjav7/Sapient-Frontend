import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { fetchMemberUserList, fetchUserFilters } from './service';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import { UserStore } from '../../../store/UserStore';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { FILTER_TYPES } from '../../../sharedComponents/dataTableWidget/constants';
import 'moment-timezone';
import moment from 'moment';
import { timeZone } from '../../../utils/helper';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { ReactComponent as InactiveSVG } from '../../../assets/icon/ban.svg';
import { ReactComponent as ActiveSVG } from '../../../assets/icon/circle-check.svg';
import { ReactComponent as PendingSVG } from '../../../assets/icon/clock.svg';
import { pageListSizes } from '../../../helpers/helpers';
import { getUsersTableCSVExport } from '../../../utils/tablesExport';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import Brick from '../../../sharedComponents/brick';
import AddUser from './AddUser';
import '../style.css';
import SkeletonLoader from '../../../components/SkeletonLoader';

const Users = () => {
    const [userPermission] = useAtom(userPermissionData);
    const { download } = useCSVDownload();

    const userPrefDateFormat = UserStore.useState((s) => s.dateFormat);
    const userPrefTimeFormat = UserStore.useState((s) => s.timeFormat);

    // Add User Modal
    const [addUserModal, setAddUserModal] = useState(false);
    const handleAddModalClose = () => setAddUserModal(false);
    const handleAddModalOpen = () => setAddUserModal(true);

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
    const [isCSVDownloading, setDownloadingCSVData] = useState(false);

    const handleStatusCheck = (record) => {
        return (record.status = record?.is_verified ? (record?.is_active ? 'Active' : 'Inactive') : 'Pending');
    };

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

        setUserData([]);

        await fetchMemberUserList(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (response?.data?.data.length > 0) {
                        const data = response?.data?.data;
                        const updatedUsersList = data.map((record) => {
                            record.status = handleStatusCheck(record);
                            return record;
                        });
                        setUserData(updatedUsersList);
                    }
                    if (response?.data?.total_users) setTotalItems(response?.data?.total_users);
                }
                setIsUserDataFetched(false);
            })
            .catch((error) => {
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

    const currentRow = () => {
        return userData;
    };

    const renderName = (row) => {
        return (
            <Link
                className="typography-wrapper link"
                to={{
                    pathname: `/settings/users/user-profile/single/${row?._id}`,
                }}>
                <div className="typography-wrapper link mouse-pointer">{row?.name ? `${row?.name}` : '-'}</div>
            </Link>
        );
    };

    const renderRole = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.role === '' || row?.permissions.length === 0 ? '-' : row?.permissions[0]?.permission_name}
            </Typography.Body>
        );
    };

    const renderStatus = (row) => {
        return (
            <Button
                label={row?.status}
                size={Button.Sizes.lg}
                type={Button.Type.secondary}
                icon={
                    (row?.status === 'Active' && <ActiveSVG />) ||
                    (row?.status === 'Inactive' && <InactiveSVG />) ||
                    (row?.status === 'Pending' && <PendingSVG />)
                }
                iconAlignment={Button.IconAlignment.left}
                className={`status-container ${row?.status.toLowerCase()}-btn`}
                disabled
            />
        );
    };

    const renderEmail = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row?.email ? row?.email : '-'}</Typography.Body>;
    };

    function isValidDate(d) {
        return d instanceof Date && !isNaN(d);
    }

    const handleLastActiveDate = (last_login) => {
        let dt = '';
        if (isValidDate(new Date(last_login)) && last_login != null) {
            const last_dt = new Date(last_login);
            const dateFormat = userPrefDateFormat === `DD-MM-YYYY` ? `D MMM` : `MMM D`;
            const timeFormat = userPrefTimeFormat === `12h` ? `hh:mm A` : `HH:mm`;
            dt = moment.utc(last_dt).format(`${dateFormat} 'YY @ ${timeFormat}`);
        } else {
            dt = 'Never';
        }
        return dt;
    };

    const renderLastActive = (row) => {
        const data = handleLastActiveDate(row?.last_login);
        return <Typography.Body size={Typography.Sizes.md}>{data}</Typography.Body>;
    };

    const tableHeader = [
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
            name: 'Status',
            accessor: 'status',
            callbackValue: renderStatus,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Last Active',
            accessor: 'last_login',
            callbackValue: renderLastActive,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    const handleDownloadCsv = async () => {
        setDownloadingCSVData(true);
        const params = `?timezone=${timeZone}`;

        await fetchMemberUserList(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (response?.data?.data.length > 0) {
                        const data = response?.data?.data;
                        const updatedUsersList = data.map((record) => {
                            record.status = handleStatusCheck(record);
                            return record;
                        });
                        download(
                            `Users_List_${new Date().toISOString().split('T')[0]}`,
                            getUsersTableCSVExport(updatedUsersList, tableHeader, handleLastActiveDate)
                        );
                    }
                }
            })
            .catch((e) => {})
            .finally(() => {
                setDownloadingCSVData(false);
            });
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
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

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
                        isLoadingComponent={<SkeletonLoader noOfColumns={tableHeader.length} noOfRows={15} />}
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
                        headers={tableHeader}
                        currentPage={pageNo}
                        onChangePage={setPageNo}
                        pageSize={pageSize}
                        onPageSize={(currentPageSize) => {
                            setPageNo(1);
                            setPageSize(currentPageSize);
                        }}
                        onDownload={() => handleDownloadCsv()}
                        isCSVDownloading={isCSVDownloading}
                        pageListSizes={pageListSizes}
                        totalCount={(() => {
                            return totalItems;
                        })()}
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
