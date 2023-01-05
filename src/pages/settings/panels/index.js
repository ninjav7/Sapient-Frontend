import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { fetchPanelsFilter, getPanelsData, getPanelsList } from './services';
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
import { FILTER_TYPES } from '../../../sharedComponents/dataTableWidget/constants';

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

    const [filterOptions, setFilterOptions] = useState([]);
    const [panelType, setPanelType] = useState([]);
    const [parentPanel, setParentPanel] = useState([]);
    const [locationId, setLocationId] = useState([]);
    const [breakersCount, setBreakersCount] = useState([]);
    const [panelVoltages, setPanelVoltages] = useState([]);

    const fetchPanelsDataWithFilter = async () => {
        setPanelsData([]);
        setDataFetching(true);

        const sorting = sortBy.method &&
            sortBy.name && {
                order_by: sortBy.name,
                sort_by: sortBy.method,
            };

        const panelTypeSelected = encodeURIComponent(panelType.join('+'));
        const parentPanelSelected = encodeURIComponent(parentPanel.join('+'));
        const locationIdSelected = encodeURIComponent(locationId.join('+'));
        const breakerCountSelected = encodeURIComponent(breakersCount.join('+'));
        const panelVoltageSelected = encodeURIComponent(panelVoltages.join('+'));

        await getPanelsData(
            bldgId,
            search,
            pageNo,
            pageSize,
            {
                ...sorting,
            },
            panelTypeSelected,
            parentPanelSelected,
            locationIdSelected,
            breakerCountSelected,
            panelVoltageSelected
        )
            .then((res) => {
                const responseData = res?.data;
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
        await getPanelsList(params)
            .then((res) => {
                const responseData = res?.data?.data;
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

    const getFilters = async () => {
        const filters = await fetchPanelsFilter({
            bldgId,
        });
        filters.data.forEach((filterOptions) => {
            const filterOptionsFetched = [
                {
                    label: 'Type',
                    value: 'panel_type',
                    placeholder: 'All Panel Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.panel_type.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem.charAt(0).toUpperCase() + filterItem.slice(1),
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let panel_type = [];
                            for (let i = 0; i < opt.length; i++) {
                                panel_type.push(opt[i].value);
                            }
                            setPanelType(panel_type);
                        }
                    },
                    onDelete: () => {
                        setPanelType([]);
                    },
                },
                {
                    label: 'Location',
                    value: 'location',
                    placeholder: 'All Locations',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.location.map((filterItem) => ({
                        value: filterItem?.location_id,
                        label: filterItem?.location_name,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let location_name = [];
                            for (let i = 0; i < opt.length; i++) {
                                location_name.push(opt[i].value);
                            }
                            setLocationId(location_name);
                        }
                    },
                    onDelete: () => {
                        setLocationId([]);
                    },
                },
                {
                    label: 'Parent',
                    value: 'parent',
                    placeholder: 'All Parent Panels',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.parent_panel.map((filterItem) => ({
                        value: filterItem?.parent_panel_id,
                        label: filterItem?.parent_panel_name,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let parent_panel = [];
                            for (let i = 0; i < opt.length; i++) {
                                parent_panel.push(opt[i].value);
                            }
                            setParentPanel(parent_panel);
                        }
                    },
                    onDelete: () => {
                        setParentPanel([]);
                    },
                },
                {
                    label: 'Breakers',
                    value: 'breakers_linked',
                    placeholder: 'All Breakers',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.breakers_linked.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let breakers_count = [];
                            for (let i = 0; i < opt.length; i++) {
                                breakers_count.push(opt[i].value);
                            }
                            setBreakersCount(breakers_count);
                        }
                    },
                    onDelete: () => {
                        setBreakersCount([]);
                    },
                },
                {
                    label: 'Voltage',
                    value: 'voltage',
                    placeholder: 'All Voltages',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: filterOptions.voltage.map((filterItem) => ({
                        value: filterItem,
                        label: filterItem,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let panel_volts = [];
                            for (let i = 0; i < opt.length; i++) {
                                panel_volts.push(opt[i].value);
                            }
                            setPanelVoltages(panel_volts);
                        }
                    },
                    onDelete: () => {
                        setPanelVoltages([]);
                    },
                },
            ];
            setFilterOptions(filterOptionsFetched);
        });
    };

    useEffect(() => {
        fetchPanelsDataWithFilter();
    }, [bldgId, search, pageNo, pageSize, sortBy, panelType, parentPanel, locationId, breakersCount, panelVoltages]);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pageNo, pageSize]);

    useEffect(() => {
        getFilters();
    }, [bldgId]);

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
                        filterOptions={filterOptions}
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
            />
        </React.Fragment>
    );
};

export default Panels;
