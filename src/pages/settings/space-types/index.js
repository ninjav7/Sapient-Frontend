import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useAtom } from 'jotai';
import _ from 'lodash';
import { userPermissionData } from '../../../store/globalState';
import CreateSpaceType from './CreateSpaceType';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { getSpaceTypesList } from './services';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { getEquipTypeTableCSVExport } from '../../../utils/tablesExport';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { pageListSizes } from '../../../helpers/helpers';
import EditEquipType from './EditEquipType';
import DeleteSpaceType from './DeleteSpaceType';
import { formatConsumptionValue } from '../../../sharedComponents/helpers/helper';

const SkeletonLoading = () => (
    <SkeletonTheme color="$primary-gray-1000" height={35}>
        <tr>
            <th>
                <Skeleton count={10} />
            </th>

            <th>
                <Skeleton count={10} />
            </th>

            <th>
                <Skeleton count={10} />
            </th>

            <th>
                <Skeleton count={10} />
            </th>
        </tr>
    </SkeletonTheme>
);

const SpaceTypes = () => {
    const [userPermission] = useAtom(userPermissionData);

    // Add SpaceType Modal states
    const [isAddSpaceTypeModalOpen, setSpaceTypeModal] = useState(false);
    const closeAddSpaceTypeModal = () => setSpaceTypeModal(false);
    const openAddSpaceTypeModal = () => setSpaceTypeModal(true);

    // Edit SpaceType Modal states
    const [isEditSpaceTypeModalOpen, setEditSpaceTypeModal] = useState(false);
    const closeEditSpaceTypeModal = () => setEditSpaceTypeModal(false);
    const openEditSpaceTypeModal = () => setEditSpaceTypeModal(true);

    // Delete SpaceType Modal states
    const [isDeleteSpaceTypeModalOpen, setDeleteSpaceTypeModal] = useState(false);
    const closeDeleteSpaceTypeModal = () => setDeleteSpaceTypeModal(false);
    const openDeleteSpaceTypeModal = () => setDeleteSpaceTypeModal(true);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});

    const [selectedSpaceType, setSelectedSpaceType] = useState({});

    const { download } = useCSVDownload();

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [spaceTypesData, setSpaceTypesData] = useState([]);
    const [customSpaceTypes, setCustomSpaceTypes] = useState([]);
    const [systemSpaceTypes, setSystemSpaceTypes] = useState([]);

    const [isDataFetching, setDataFetching] = useState(false);

    const [totalItems, setTotalItems] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [EndUseString, SetEndUseString] = useState([]);

    const [selectedStatus, setSelectedStatus] = useState(0);

    const handleEdit = (record) => {
        setSelectedSpaceType(record);
        openEditSpaceTypeModal();
    };

    const handleDelete = (record) => {
        setSelectedSpaceType(record);
        openDeleteSpaceTypeModal();
    };

    const handleAbleToDeleteRow = (row) => {
        return row?.is_custom ? true : false;
    };

    const handleAbleToEditRow = (row) => {
        return row?.is_custom ? true : false;
    };

    const fetchSpaceTypeData = async (searchTxt, page_no = 1, page_size = 20, ordered_by = 'name', sort_by) => {
        setDataFetching(true);

        const params = `?page_size=${page_size}&page_no=${page_no}&ordered_by=${ordered_by}&sort_by=${sort_by}`;

        await getSpaceTypesList(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (response?.data[0]) {
                        const sortedSystemTypes = _.sortBy(response?.data[0]?.generic_spacetypes, 'name');
                        const sortedCustomTypes = _.sortBy(response?.data[0]?.user_defined_spacetypes, 'name');
                        let mergeResult = [
                            ...response?.data[0]?.generic_spacetypes,
                            ...response?.data[0]?.user_defined_spacetypes,
                        ];
                        mergeResult = _.sortBy(mergeResult, 'name');
                        setSpaceTypesData(mergeResult);
                        setSystemSpaceTypes(sortedSystemTypes);
                        setCustomSpaceTypes(sortedCustomTypes);
                    }
                }
                setDataFetching(false);
            })
            .catch(() => {
                setDataFetching(false);
            });
    };

    const handleDownloadCsv = async () => {
        await getSpaceTypesList()
            .then((res) => {
                const responseData = res?.data?.data;
                download(
                    `Space_Types_${new Date().toISOString().split('T')[0]}`,
                    getEquipTypeTableCSVExport(responseData, headerProps)
                );
            })
            .catch(() => {});
    };

    const currentRow = () => {
        let showData = [];
        if (selectedStatus === 0) showData = spaceTypesData;
        if (selectedStatus === 1) showData = systemSpaceTypes;
        if (selectedStatus === 2) showData = customSpaceTypes;
        return showData;
    };

    const renderSpaceTypeName = (row) => {
        return <div className="typography-wrapper link mouse-pointer">{row?.name === '' ? '-' : row?.name}</div>;
    };

    const renderSpaceTypeClass = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md} className="gray-950">
                {row?.is_custom ? `Custom` : `System`}
            </Typography.Body>
        );
    };

    const renderSpaceCount = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.space_count ? formatConsumptionValue(row?.space_count, 0) : 0}
            </Typography.Body>
        );
    };

    const headerProps = [
        {
            name: 'Name',
            accessor: 'name',
            callbackValue: renderSpaceTypeName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Class',
            accessor: 'is_custom',
            callbackValue: renderSpaceTypeClass,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Space Count',
            accessor: 'space_count',
            callbackValue: renderSpaceCount,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Space Types',
                    path: '/settings/space-types',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'account';
        });
    };

    useEffect(() => {
        const ordered_by = sortBy.name === undefined ? 'name' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'ace' : sortBy.method;

        fetchSpaceTypeData(search, pageNo, pageSize, ordered_by, sort_by);
    }, [search, pageNo, pageSize, sortBy]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pageNo, pageSize]);

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>Space Types</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.account_buildings_permission?.edit ? (
                            <div className="d-flex">
                                <Button
                                    label={'Add Space Type'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => {
                                        openAddSpaceTypeModal();
                                    }}
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
                        isLoading={isDataFetching}
                        isLoadingComponent={<SkeletonLoading />}
                        id="spaceTypes_list"
                        onSearch={(query) => {
                            setPageNo(1);
                            setSearch(query);
                        }}
                        buttonGroupFilterOptions={[{ label: 'All' }, { label: 'System' }, { label: 'Custom' }]}
                        onStatus={(query) => {
                            setPageNo(1);
                            setPageSize(20);
                            setSelectedStatus(query);
                        }}
                        rows={currentRow()}
                        searchResultRows={currentRow()}
                        onDownload={() => handleDownloadCsv()}
                        headers={headerProps}
                        currentPage={pageNo}
                        onChangePage={setPageNo}
                        pageSize={pageSize}
                        onPageSize={setPageSize}
                        pageListSizes={pageListSizes}
                        onEditRow={
                            userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.account_buildings_permission?.edit
                                ? (record, id, row) => (row?.status.toLowerCase() === 'system' ? null : handleEdit(row))
                                : null
                        }
                        onDeleteRow={
                            userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.account_buildings_permission?.edit
                                ? (record, id, row) => handleDelete(row)
                                : null
                        }
                        isDeletable={(row) => handleAbleToDeleteRow(row)}
                        isEditable={(row) => handleAbleToEditRow(row)}
                        totalCount={(() => {
                            if (selectedFilter === 0) {
                                return totalItems;
                            }
                            return 0;
                        })()}
                    />
                </Col>
            </Row>

            <CreateSpaceType
                isAddSpaceTypeModalOpen={isAddSpaceTypeModalOpen}
                closeAddSpaceTypeModal={closeAddSpaceTypeModal}
                fetchSpaceTypeData={fetchSpaceTypeData}
                search={search}
            />

            <EditEquipType
                isEditEquipTypeModalOpen={isEditSpaceTypeModalOpen}
                closeEditEquipTypeModal={closeEditSpaceTypeModal}
                fetchSpaceTypeData={fetchSpaceTypeData}
                selectedEquipType={selectedSpaceType}
                search={search}
                openEditEquipTypeModal={openEditSpaceTypeModal}
            />

            <DeleteSpaceType
                isDeleteSpaceTypeModalOpen={isDeleteSpaceTypeModalOpen}
                closeDeleteSpaceTypeModal={closeDeleteSpaceTypeModal}
                fetchSpaceTypeData={fetchSpaceTypeData}
                selectedSpaceType={selectedSpaceType}
                search={search}
            />
        </React.Fragment>
    );
};

export default SpaceTypes;
