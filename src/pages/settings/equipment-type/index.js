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
import { getEquipTypeData } from './services';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { getEquipTypeTableCSVExport } from '../../../utils/tablesExport';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import { ComponentStore } from '../../../store/ComponentStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';

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

const EquipmentType = () => {
    const [userPermission] = useAtom(userPermissionData);

    const [isAddEquipTypeModalOpen, setEquipTypeModal] = useState(false);
    const closeAddEquipTypeModal = () => setEquipTypeModal(false);
    const openAddEquipTypeModal = () => setEquipTypeModal(true);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});

    const { download } = useCSVDownload();

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [equipTypeData, setEquipTypeData] = useState([]);
    const [isDataFetching, setDataFetching] = useState(false);
    const [totalItems, setTotalItems] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState(0);

    const pageListSizes = [
        {
            label: '20 Rows',
            value: '20',
        },
        {
            label: '50 Rows',
            value: '50',
        },
        {
            label: '100 Rows',
            value: '100',
        },
    ];

    const fetchEquipTypeData = async (searchTxt, page_no = 1, page_size = 20) => {
        setDataFetching(true);
        let params = `?page_size=${page_size}&page_no=${page_no}`;
        if (searchTxt) {
            let searchParams = `&equipment_search=${encodeURIComponent(searchTxt)}`;
            params = params.concat(searchParams);
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

    const handleDownloadCsv = async () => {
        await getEquipTypeData()
            .then((res) => {
                const responseData = res?.data?.data;
                download('Equipment_Type_List', getEquipTypeTableCSVExport(responseData, headerProps));
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
                {row?.equipment_count === '' ? '-' : row?.equipment_count}
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
        fetchEquipTypeData(search, pageNo, pageSize);
    }, [search, pageNo, pageSize]);

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
                        {userPermission?.user_role === 'admin' ? (
                            <div className="d-flex">
                                <Button
                                    label={'Add Equipment Type'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => {
                                        openAddEquipTypeModal();
                                    }}
                                    icon={<PlusSVG />}
                                    disbaled
                                />
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={1.5} />

            <Row>
                <Col lg={12}>
                    <DataTableWidget
                        isLoading={isDataFetching}
                        isLoadingComponent={<SkeletonLoading />}
                        id="equipmentType_list"
                        buttonGroupFilterOptions={[]}
                        onSearch={setSearch}
                        onStatus={setSelectedFilter}
                        rows={currentRow()}
                        searchResultRows={currentRow()}
                        onDownload={() => handleDownloadCsv()}
                        headers={headerProps}
                        currentPage={pageNo}
                        onChangePage={setPageNo}
                        pageSize={pageSize}
                        onPageSize={setPageSize}
                        pageListSizes={pageListSizes}
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
            />
        </React.Fragment>
    );
};

export default EquipmentType;
