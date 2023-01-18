import React, { useState, useEffect } from 'react';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { BuildingStore } from '../../../store/BuildingStore';
import { ComponentStore } from '../../../store/ComponentStore';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import { DataTableWidget } from '../../../sharedComponents/dataTableWidget';
import Typography from '../../../sharedComponents/typography';
import { Badge } from '../../../sharedComponents/badge';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plus.svg';
import CreateBuilding from './CreateBuilding';
import { formatConsumptionValue } from '../../../helpers/helpers';
import { fetchBuildingList, getFiltersForBuildingsRequest } from './services';
import useCSVDownload from '../../../sharedComponents/hooks/useCSVDownload';
import { getBuildingsTableCSVExport } from '../../../utils/tablesExport';
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
        </tr>
    </SkeletonTheme>
);

const Buildings = () => {
    const [userPermission] = useAtom(userPermissionData);

    const [filtersValues, setFiltersValues] = useState({});

    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState({});

    const { download } = useCSVDownload();

    const [isAddBuildingModalOpen, setShowBuildingModal] = useState(false);
    const closeAddBuildingModal = () => setShowBuildingModal(false);
    const openAddBuildingModal = () => setShowBuildingModal(true);

    const [isDataFetching, setIsDataFetching] = useState(false);
    const [buildingsData, setBuildingsData] = useState([]);

    const [buildingTypeList, setBuildingTypeList] = useState([]);
    const [selectedBuildingType, setSelectedBuildingType] = useState([]);

    const [filterOptions, setFilterOptions] = useState([]);

    const [minVal, setMinVal] = useState(0);
    const [maxVal, setMaxVal] = useState(0);

    const [sqftAPIFlag, setSqftAPIFlag] = useState('');

    const [minSqftVal, setMinSqftVal] = useState(0);
    const [maxSqftVal, setMaxSqftVal] = useState(0);

    const [internalRoute, setInternalRoute] = useState([
        '/settings/general',
        '/settings/layout',
        '/settings/equipment',
        '/settings/panels',
        '/settings/active-devices',
    ]);

    const fetchGeneralBuildingData = async () => {
        setIsDataFetching(true);

        const ordered_by = sortBy.name === undefined ? 'building_name' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'ace' : sortBy.method;

        await fetchBuildingList(search, sort_by, ordered_by, sqftAPIFlag)
            .then((res) => {
                const data = res.data;
                setBuildingsData(data);
                setIsDataFetching(false);
            })
            .catch(() => {
                setIsDataFetching(false);
            });
    };

    const resetBuildingFilter = () => {
        setFiltersValues({
            selectedFilters: [],
        });
        setFilterOptions([]);
        setSelectedBuildingType([]);
        setMinSqftVal(0);
        setMaxSqftVal(maxVal);
        setSqftAPIFlag('');
        getFilters();
    };

    const handleBuildingClick = (record) => {
        localStorage.setItem('buildingId', record.building_id);
        localStorage.setItem('buildingName', record.building_name);
        localStorage.setItem('buildingTimeZone', record.timezone);
        BuildingStore.update((s) => {
            s.BldgId = record.building_id;
            s.BldgName = record.building_name;
            s.BldgTimeZone = record.timezone;
        });
    };

    const renderBldgName = (row) => {
        return (
            <Link
                className="typography-wrapper link"
                to={`${internalRoute[0]}`}
                onClick={() => {
                    handleBuildingClick(row);
                }}>
                {row?.building_name === '' ? '-' : row?.building_name}
            </Link>
        );
    };

    const renderBldgType = (row) => {
        return (
            <Badge
                text={
                    <Typography.Body size={Typography.Sizes.md} className="gray-950">
                        {row?.building_type === '' ? '-' : row?.building_type}
                    </Typography.Body>
                }
            />
        );
    };

    const renderDeviceCount = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.num_of_devices === '' ? '-' : formatConsumptionValue(row?.num_of_devices, 0)}
            </Typography.Body>
        );
    };

    const renderBldgSqft = (row) => {
        return (
            <Typography.Body size={Typography.Sizes.md}>
                {row?.building_size === '' ? '-' : formatConsumptionValue(row?.building_size, 0)}
            </Typography.Body>
        );
    };

    const currentRow = () => {
        return buildingsData;
    };

    const fetchUserPermission = () => {
        if (userPermission?.user_role !== 'admin') {
            if (!userPermission?.permissions?.permissions?.building_details_permission?.view) {
                setInternalRoute((el) =>
                    el.filter((current) => {
                        return current !== '/settings/general';
                    })
                );
            }
            if (!userPermission?.permissions?.permissions?.building_layout_permission?.view) {
                setInternalRoute((el) =>
                    el.filter((current) => {
                        return current !== '/settings/layout';
                    })
                );
            }
            if (!userPermission?.permissions?.permissions?.building_equipment_permission?.view) {
                setInternalRoute((el) =>
                    el.filter((current) => {
                        return current !== '/settings/equipment';
                    })
                );
            }
            if (!userPermission?.permissions?.permissions?.building_panels_permission?.view) {
                setInternalRoute((el) =>
                    el.filter((current) => {
                        return current !== '/settings/panels';
                    })
                );
                if (!internalRoute.includes('/settings/active-devices')) {
                    setInternalRoute((el) => [...el, '/settings/active-devices']);
                }
            }

            if (
                userPermission?.permissions?.permissions?.building_details_permission?.view &&
                !internalRoute.includes('/settings/general')
            ) {
                setInternalRoute((el) =>
                    el.filter((current) => {
                        return current !== '/settings/active-devices';
                    })
                );
                setInternalRoute((el) => [...el, '/settings/general']);
            }

            if (
                userPermission?.permissions?.permissions?.building_layout_permission?.view &&
                !internalRoute.includes('/settings/layout')
            ) {
                setInternalRoute((el) =>
                    el.filter((current) => {
                        return current !== '/settings/active-devices';
                    })
                );
                setInternalRoute((el) => [...el, '/settings/layout']);
            }

            if (
                userPermission?.permissions?.permissions?.building_equipment_permission?.view &&
                !internalRoute.includes('/settings/equipment')
            ) {
                setInternalRoute((el) =>
                    el.filter((current) => {
                        return current !== '/settings/active-devices';
                    })
                );
                setInternalRoute((el) => [...el, '/settings/equipment']);
            }

            if (
                userPermission?.permissions?.permissions?.building_panels_permission?.view &&
                !internalRoute.includes('/settings/panels')
            ) {
                setInternalRoute((el) =>
                    el.filter((current) => {
                        return current !== '/settings/active-devices';
                    })
                );
                setInternalRoute((el) => [...el, '/settings/panels']);
            }
        }
        if (userPermission.user_role === 'admin') {
            setInternalRoute([]);
            setInternalRoute(['/settings/general']);
        }
    };

    const getFilters = async () => {
        const responseData = await getFiltersForBuildingsRequest();
        const filterData = responseData.data[0];
        setBuildingTypeList(filterData?.building_type);
        setMinVal(filterData?.building_size_min);
        setMaxVal(filterData?.building_size_max);
        setMinSqftVal(filterData?.building_size_min);
        setMaxSqftVal(filterData?.building_size_max);
    };

    const handleDownloadCsv = async () => {
        const ordered_by = sortBy.name === undefined ? 'building_name' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'ace' : sortBy.method;
        const search = '';

        await fetchBuildingList(search, sort_by, ordered_by)
            .then((res) => {
                const responseData = res.data;
                download(
                    `Buildings_${new Date().toISOString().split('T')[0]}`,
                    getBuildingsTableCSVExport(responseData, headerProps)
                );
            })
            .catch((error) => {});
    };

    const headerProps = [
        {
            name: 'Building Name',
            accessor: 'building_name',
            callbackValue: renderBldgName,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Building Type',
            accessor: 'building_type',
            callbackValue: renderBldgType,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Sq. Ft',
            accessor: 'building_size',
            callbackValue: renderBldgSqft,
            onSort: (method, name) => setSortBy({ method, name }),
        },
        {
            name: 'Devices',
            accessor: 'num_of_devices',
            callbackValue: renderDeviceCount,
            onSort: (method, name) => setSortBy({ method, name }),
        },
    ];

    const fetchBuildingListByFilter = async (building_type, min_val, max_val) => {
        setIsDataFetching(true);
        let buildingTypeSelected = encodeURIComponent(building_type.join('+'));

        const ordered_by = sortBy.name === undefined ? 'building_name' : sortBy.name;
        const sort_by = sortBy.method === undefined ? 'ace' : sortBy.method;

        await fetchBuildingList(search, sort_by, ordered_by, sqftAPIFlag, buildingTypeSelected, min_val, max_val)
            .then((res) => {
                const data = res.data;
                setBuildingsData(data);
                setIsDataFetching(false);
            })
            .catch(() => {
                setIsDataFetching(false);
            });
    };

    useEffect(() => {
        if (sqftAPIFlag === '' && selectedBuildingType.length === 0) {
            fetchGeneralBuildingData();
        } else fetchBuildingListByFilter(selectedBuildingType, minSqftVal, maxSqftVal);
    }, [sqftAPIFlag, sortBy, search, selectedBuildingType]);

    useEffect(() => {
        if (minSqftVal !== maxSqftVal && maxSqftVal !== 0) {
            const filterOptionsFetched = [
                {
                    label: 'Building Type',
                    value: 'building_type',
                    placeholder: 'All Building Types',
                    filterType: FILTER_TYPES.MULTISELECT,
                    filterOptions: buildingTypeList.map((filterItem) => ({
                        value: filterItem.building_type_id,
                        label: filterItem.building_type,
                    })),
                    onClose: (options) => {
                        let opt = options;
                        if (opt.length !== 0) {
                            let buildingType = [];
                            for (let i = 0; i < opt.length; i++) {
                                buildingType.push(opt[i].value);
                            }
                            setSelectedBuildingType(buildingType);
                        }
                    },
                    onDelete: () => {
                        setSelectedBuildingType([]);
                    },
                },
                {
                    label: 'Square Footage',
                    value: 'square_footage',
                    placeholder: 'All Square Footage',
                    filterType: FILTER_TYPES.RANGE_SELECTOR,
                    filterOptions: [minSqftVal, maxSqftVal],
                    componentProps: {
                        prefix: ' sq.ft.',
                        title: 'Square Footage',
                        min: minVal,
                        max: maxVal,
                        range: [minSqftVal, maxSqftVal],
                        withTrendsFilter: false,
                    },
                    onClose: function onClose(options) {
                        setMinSqftVal(options[0]);
                        setMaxSqftVal(options[1]);
                        setSqftAPIFlag(options[0] + options[1]);
                    },
                    onDelete: () => {
                        setMinSqftVal(0);
                        setMaxSqftVal(maxVal);
                        setSqftAPIFlag('');
                    },
                },
            ];
            setFilterOptions(filterOptionsFetched);
        }
    }, [buildingTypeList, minSqftVal, maxSqftVal, minVal, maxVal]);

    useEffect(() => {
        getFilters();
    }, [search]);

    useEffect(() => {
        fetchUserPermission();
    }, [userPermission]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Buildings',
                        path: '/settings/buildings',
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
                            <Typography.Header size={Typography.Sizes.lg}>Buildings</Typography.Header>
                        </div>
                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.account_buildings_permission?.create ? (
                            <div className="d-flex">
                                <Button
                                    label={'Add Building'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => {
                                        openAddBuildingModal();
                                    }}
                                    icon={<PlusSVG />}
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
                        id="buildings_list"
                        buttonGroupFilterOptions={[]}
                        onSearch={setSearch}
                        onStatus={[]}
                        rows={currentRow()}
                        searchResultRows={currentRow()}
                        onDownload={() => handleDownloadCsv()}
                        filterOptions={filterOptions}
                        headers={headerProps}
                        filters={filtersValues}
                        totalCount={(() => {
                            return 0;
                        })()}
                    />
                </Col>
            </Row>

            <CreateBuilding
                isAddBuildingModalOpen={isAddBuildingModalOpen}
                closeAddBuildingModal={closeAddBuildingModal}
                resetBuildingFilter={resetBuildingFilter}
            />
        </React.Fragment>
    );
};

export default Buildings;
