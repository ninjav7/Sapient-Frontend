import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { getPanelsData } from './services';
import Brick from '../../../sharedComponents/brick';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import { pageListSizes } from '../../../helpers/helpers';
import { useHistory } from 'react-router-dom';
import { getPanelsTableCSVExport } from '../../../utils/tablesExport';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import CreatePanel from './CreatePanel';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import '../style.css';

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

            <th>
                <Skeleton count={10} />
            </th>

            <th>
                <Skeleton count={10} />
            </th>
        </tr>
    </SkeletonTheme>
);

const Panels = () => {
    const history = useHistory();
    const { download } = useCSVDownload();
    const [userPermission] = useAtom(userPermissionData);

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});

    // Edit Sensor Panel model state
    const [isCreatePanelModalOpen, setShowPanelModel] = useState(false);
    const closeCreatePanelModel = () => setShowPanelModel(false);
    const openCreatePanelModel = () => setShowPanelModel(true);

    const [pageNo, setPageNo] = useState(1);
    const [pageSize, setPageSize] = useState(20);

    const [totalItems, setTotalItems] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState(0);

    const [panelsData, setPanelsData] = useState([]);
    const [isDataFetching, setDataFetching] = useState(true);

    const fetchPanelsData = async () => {
        setPanelsData([]);
        setDataFetching(true);

        let params = `?building_id=${bldgId}`;
        await getPanelsData(params)
            .then((res) => {
                const responseData = res?.data?.data?.data;
                setPanelsData(responseData);
                setDataFetching(false);
            })
            .catch(() => {
                setDataFetching(false);
            });
    };

    const fetchPanelsDataWithFilter = async (bldgId, search_txt, page_no = 1, page_size = 20, ordered_by, sort_by) => {
        setPanelsData([]);
        setDataFetching(true);

        let params = `?building_id=${bldgId}&page_no=${page_no}&page_size=${page_size}&ordered_by=${ordered_by}`;

        if (sort_by) params = params.concat(`&sort_by=${sort_by}`);
        if (search_txt) params = params.concat(`&panel_search=${encodeURIComponent(search_txt)}`);

        await getPanelsData(params)
            .then((res) => {
                const responseData = res?.data?.data;
                setPanelsData(responseData?.data);
                setTotalItems(responseData?.total_data);
                setDataFetching(false);
            })
            .catch(() => {
                setDataFetching(false);
            });
    };

    const handleClick = (el) => {
        history.push({
            pathname: `/settings/panels/edit-panel/${el.panel_id}`,
        });
    };

    const handleDownloadCsv = async () => {
        let params = `?building_id=${bldgId}`;
        await getPanelsData(params)
            .then((res) => {
                const responseData = res?.data?.data?.data;
                let csvData = getPanelsTableCSVExport(responseData, headerProps);
                download('Panels_List', csvData);
            })
            .catch(() => {});
    };

    const renderPanelName = (row) => {
        return (
            <div
                size={Typography.Sizes.md}
                className="typography-wrapper link mouse-pointer"
                onClick={() => handleClick(row)}>
                {row?.panel_name === '' ? '-' : row?.panel_name}
            </div>
        );
    };

    const renderPanelLocation = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row?.location ? row?.location : '-'} </Typography.Body>;
    };

    const renderLinkedBreakers = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.breakers_linked ? `${row?.breakers_linked} / ${row?.breakers}` : '-'}
            </Typography.Body>
        );
    };

    const renderParentPanel = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row?.parent ? row?.parent : '-'}</Typography.Body>;
    };

    const renderPanelType = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.panel_type ? row?.panel_type.charAt(0).toUpperCase() + row.panel_type.slice(1) : '-'}
            </Typography.Body>
        );
    };

    const renderPanelVoltage = (row) => {
        return <Typography.Body size={Typography.Sizes.md}>{row?.voltage ? row?.voltage : '-'}</Typography.Body>;
    };

    const headerProps = [
        {
            name: 'Name',
            accessor: 'panel_name',
            callbackValue: renderPanelName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Location',
            accessor: 'location',
            callbackValue: renderPanelLocation,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Breakers',
            accessor: 'breakers_linked',
            callbackValue: renderLinkedBreakers,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Parent',
            accessor: 'parent',
            callbackValue: renderParentPanel,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Type',
            accessor: 'panel_type',
            callbackValue: renderPanelType,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Panel Voltage',
            accessor: 'voltage',
            callbackValue: renderPanelVoltage,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    const currentRow = () => {
        if (selectedFilter === 0) {
            return panelsData;
        }
    };

    useEffect(() => {
        const ordered_by = sortBy.name === undefined ? 'panel_name' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'ace' : sortBy.method;

        fetchPanelsDataWithFilter(bldgId, search, pageNo, pageSize, ordered_by, sort_by);
    }, [bldgId, search, pageNo, pageSize, sortBy]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pageNo, pageSize]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Panels',
                        path: '/settings/panels',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
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
                            <Typography.Header size={Typography.Sizes.lg}>Panels</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.building_panels_permission?.create ? (
                            <div className="d-flex">
                                <Button
                                    label={'Add Panel'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={openCreatePanelModel}
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
                        id="panels_list"
                        isLoading={isDataFetching}
                        isLoadingComponent={<SkeletonLoading />}
                        buttonGroupFilterOptions={[]}
                        onSearch={(query) => {
                            setPageNo(1);
                            setSearch(query);
                        }}
                        rows={currentRow()}
                        searchResultRows={currentRow()}
                        onDownload={handleDownloadCsv}
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

            <CreatePanel
                isCreatePanelModalOpen={isCreatePanelModalOpen}
                closeCreatePanelModel={closeCreatePanelModel}
                fetchPanelsDataWithFilter={fetchPanelsDataWithFilter}
            />
        </React.Fragment>
    );
};

export default Panels;
