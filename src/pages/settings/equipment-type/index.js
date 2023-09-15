import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import CreateEquipType from './CreateEquipType';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import { getEquipTypeData, fetchEquipmentTypeFilter } from './services';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { getEquipTypeTableCSVExport } from '../../../utils/tablesExport';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { pageListSizes } from '../../../helpers/helpers';
import EditEquipType from './EditEquipType';
import DeleteEquipType from './DeleteEquipType';
import { FILTER_TYPES } from '../../../sharedComponents/dataTableWidget/constants';
import { formatConsumptionValue } from '../../../sharedComponents/helpers/helper';
import colorPalette from '../../../assets/scss/_colors.scss';

const SkeletonLoading = ({ noofRows }) => {
    const rowArray = Array.from({ length: noofRows });

    return (
        <SkeletonTheme
            baseColor={colorPalette.primaryGray150}
            highlightColor={colorPalette.baseBackground}
            borderRadius={10}
            height={30}>
            <tr>
                {rowArray.map((_, index) => (
                    <th key={index}>
                        <Skeleton count={15} />
                    </th>
                ))}
            </tr>
        </SkeletonTheme>
    );
};

const EquipmentType = () => {
    const [userPermission] = useAtom(userPermissionData);

    // Add EquipType Modal states
    const [isAddEquipTypeModalOpen, setEquipTypeModal] = useState(false);
    const closeAddEquipTypeModal = () => setEquipTypeModal(false);
    const openAddEquipTypeModal = () => setEquipTypeModal(true);

    // Edit EquipType Modal states
    const [isEditEquipTypeModalOpen, setEditEquipTypeModal] = useState(false);
    const closeEditEquipTypeModal = () => setEditEquipTypeModal(false);
    const openEditEquipTypeModal = () => setEditEquipTypeModal(true);

    // Delete EquipType Modal states
    const [isDeleteEquipTypeModalOpen, setDeleteEquipTypeModal] = useState(false);
    const closeDeleteEquipTypeModal = () => setDeleteEquipTypeModal(false);
    const openDeleteEquipTypeModal = () => setDeleteEquipTypeModal(true);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});

    const [selectedEquipType, setSelectedEquipType] = useState({});
    const [filterOptions, setFilterOptions] = useState([]);

    const { download } = useCSVDownload();

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [equipTypeData, setEquipTypeData] = useState([]);
    const [isDataFetching, setDataFetching] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState(0);
    const [EndUseString, SetEndUseString] = useState([]);

    const [equipCountAPIFlag, setEquipCountAPIFlag] = useState('');
    const [minVal, setMinVal] = useState(0);
    const [maxVal, setMaxVal] = useState(0);
    const [minEquipCount, setMinEquipCount] = useState(0);
    const [maxEquipCount, setMaxEquipCount] = useState(0);
    const [filterData, setFilterData] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(0);

    const handleEdit = (record) => {
        setSelectedEquipType(record);
        openEditEquipTypeModal();
    };

    const handleDelete = (record) => {
        setSelectedEquipType(record);
        openDeleteEquipTypeModal();
    };

    const handleAbleToDeleteRow = (row) => {
        return row?.status.toLowerCase() === 'system' ? false : true;
    };

    const handleAbleToEditRow = (row) => {
        return row?.status.toLowerCase() === 'system' ? false : true;
    };

    const fetchEquipTypeData = async (searchTxt, ordered_by = 'equipment_type', sort_by) => {
        let endUseIds = encodeURIComponent(EndUseString.join('+'));
        setDataFetching(true);
        let params = `?page_size=${pageSize}&page_no=${pageNo}&ordered_by=${ordered_by}`;
        if (searchTxt) params = params.concat(`&equipment_search=${encodeURIComponent(searchTxt)}`);
        if (sort_by) params = params.concat(`&sort_by=${sort_by}`);
        if (endUseIds.length) {
            params += `&end_use_id=${endUseIds}`;
        }
        if (equipCountAPIFlag !== '') {
            params += `&equipment_count_min=${minEquipCount}&equipment_count_max=${maxEquipCount}`;
        }
        if (selectedStatus == 2) {
            params += `&status=Custom`;
        }
        if (selectedStatus == 1) {
            params += `&status=System`;
        }

        await getEquipTypeData(params)
            .then((res) => {
                const response = res?.data;
                setTotalItems(response?.total_data);
                setEquipTypeData(response?.data);
                setDataFetching(false);
            })
            .catch(() => {
                setDataFetching(false);
            });
    };

    const getFilters = async () => {
        let EndUseSelected = encodeURIComponent(EndUseString.join('+'));
        const filters = await fetchEquipmentTypeFilter({
            EndUseSelected,
        });
        setFilterData(filters.data);
        setMinVal(filters?.data[0]?.equipment_linked_min);
        setMaxVal(filters?.data[0]?.equipment_linked_max);
        setMinEquipCount(filters?.data[0]?.equipment_linked_min);
        setMaxEquipCount(filters?.data[0]?.equipment_linked_max);
    };

    useEffect(() => {
        if (minEquipCount !== maxEquipCount && maxEquipCount !== 0) {
            if (Object.keys(filterData).length !== 0) {
                filterData.forEach((filterOptions) => {
                    const filterOptionsFetched = [
                        {
                            label: 'End Use',
                            value: 'identifier',
                            placeholder: 'All End Uses',
                            filterType: FILTER_TYPES.MULTISELECT,
                            filterOptions: filterOptions.end_use.map((filterItem) => ({
                                value: filterItem?.end_use_id,
                                label: filterItem?.end_use_name,
                            })),
                            onClose: (options) => {
                                let opt = options;
                                if (opt.length !== 0) {
                                    let endUses = [];
                                    for (let i = 0; i < opt.length; i++) {
                                        endUses.push(opt[i].value);
                                    }
                                    SetEndUseString(endUses);
                                }
                            },
                            onDelete: () => {
                                SetEndUseString([]);
                            },
                        },
                        {
                            label: 'Equipment Count',
                            value: 'equipment_count',
                            placeholder: 'All Equipment Count',
                            filterType: FILTER_TYPES.RANGE_SELECTOR,
                            filterOptions: [minEquipCount, maxEquipCount],
                            componentProps: {
                                prefix: '',
                                title: 'Equipment Count',
                                min: minVal,
                                max: maxVal,
                                range: [minEquipCount, maxEquipCount],
                                withTrendsFilter: false,
                            },
                            onClose: function onClose(options) {
                                setMinEquipCount(options[0]);
                                setMaxEquipCount(options[1]);
                                setEquipCountAPIFlag(options[0] + options[1]);
                            },
                            onDelete: () => {
                                setMinEquipCount(0);
                                setMaxEquipCount(maxVal);
                                setEquipCountAPIFlag('');
                            },
                        },
                    ];
                    setFilterOptions(filterOptionsFetched);
                });
            }
        }
    }, [minEquipCount, maxEquipCount]);

    useEffect(() => {
        getFilters();
    }, [search]);

    const handleDownloadCsv = async () => {
        await getEquipTypeData()
            .then((res) => {
                const responseData = res?.data?.data;
                download(
                    `Equipment_Types_${new Date().toISOString().split('T')[0]}`,
                    getEquipTypeTableCSVExport(responseData, headerProps)
                );
            })
            .catch(() => {});
    };

    const currentRow = () => {
        if (selectedFilter === 0) {
            return equipTypeData;
        }
    };

    const renderEquipTypeName = (row) => {
        return (
            <div className="typography-wrapper link mouse-pointer">
                {row?.equipment_type === '' ? '-' : row?.equipment_type}
            </div>
        );
    };

    const renderEquipTypeClass = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md} className="gray-950">
                {row?.status === '' ? '-' : row?.status}
            </Typography.Body>
        );
    };

    const renderEndUse = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.end_use_name === '' ? '-' : row?.end_use_name}
            </Typography.Body>
        );
    };

    const renderEquipCount = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.equipment_count ? formatConsumptionValue(row?.equipment_count, 0) : 0}
            </Typography.Body>
        );
    };

    const headerProps = [
        {
            name: 'Name',
            accessor: 'equipment_type',
            callbackValue: renderEquipTypeName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Class',
            accessor: 'status',
            callbackValue: renderEquipTypeClass,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'End Use',
            accessor: 'end_use_name',
            callbackValue: renderEndUse,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Equipment Count',
            accessor: 'equipment_count',
            callbackValue: renderEquipCount,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    useEffect(() => {
        const ordered_by = sortBy.name === undefined ? 'equipment_type' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'ace' : sortBy.method;

        fetchEquipTypeData(search, ordered_by, sort_by);
    }, [search, pageNo, pageSize, sortBy, EndUseString, equipCountAPIFlag, selectedStatus]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pageNo, pageSize]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Equipment Types',
                        path: '/settings/equipment-types',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'account';
            });
        };
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>Equipment Types</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.account_buildings_permission?.edit ? (
                            <div className="d-flex">
                                <Button
                                    label={'Add Equipment Type'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => {
                                        openAddEquipTypeModal();
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
                        isLoadingComponent={<SkeletonLoading noofRows={headerProps.length + 1} />}
                        id="equipmentType_list"
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
                        filterOptions={filterOptions}
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
                                ? (record, id, row) =>
                                      row?.status.toLowerCase() === 'system' ? null : handleDelete(row)
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

            <CreateEquipType
                isAddEquipTypeModalOpen={isAddEquipTypeModalOpen}
                closeAddEquipTypeModal={closeAddEquipTypeModal}
                fetchEquipTypeData={fetchEquipTypeData}
                search={search}
            />

            <EditEquipType
                isEditEquipTypeModalOpen={isEditEquipTypeModalOpen}
                closeEditEquipTypeModal={closeEditEquipTypeModal}
                fetchEquipTypeData={fetchEquipTypeData}
                selectedEquipType={selectedEquipType}
                search={search}
                openEditEquipTypeModal={openEditEquipTypeModal}
            />

            <DeleteEquipType
                isDeleteEquipTypeModalOpen={isDeleteEquipTypeModalOpen}
                closeDeleteEquipTypeModal={closeDeleteEquipTypeModal}
                fetchEquipTypeData={fetchEquipTypeData}
                selectedEquipType={selectedEquipType}
                search={search}
            />
        </React.Fragment>
    );
};

export default EquipmentType;
