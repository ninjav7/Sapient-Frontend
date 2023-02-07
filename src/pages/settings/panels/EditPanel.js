import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import {
    deleteCurrentPanel,
    getBreakersList,
    getEquipmentsList,
    getLocationData,
    getPanelsList,
    getPassiveDeviceList,
    resetAllBreakers,
    updatePanelDetails,
} from './services';

import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { LoadingStore } from '../../../store/LoadingStore';
import { BreakersStore } from '../../../store/BreakersStore';
import Brick from '../../../sharedComponents/brick';
import Panel from '../../../sharedComponents/widgets/panel/Panel';
import { Breaker } from '../../../sharedComponents/breaker';
import { getVoltageConfigValue, voltsOption } from './utils';
import { edges, nodes } from '../../../sharedComponents/widgets/panel/mock';

const EditPanel = () => {
    const { panelId } = useParams();
    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [panelsList, setPanelsList] = useState([]);
    const [locationsList, setLocationsList] = useState([]);
    const [passiveDevicesList, setPassiveDevicesList] = useState([]);
    const [equipmentsList, setEquipmentsList] = useState([]);

    const [breakersList, setBreakersList] = useState([]);
    const [breakerLinks, setBreakerLinks] = useState([]);
    const [isBreakersFetched, setBreakersFetching] = useState(false);

    const [panelObj, setPanelObj] = useState({});
    const [originalPanelObj, setOriginalPanelObj] = useState({});
    const [isPanelFetched, setPanelFetching] = useState(false);
    const [panelType, setPanelType] = useState('distribution');
    const [mainBreakerConfig, setMainBreakerConfig] = useState({
        items: [
            {
                id: 'M',
                status: Breaker.Status.online,
            },
        ],
        type: Breaker.Type.configured,
        ratedAmps: `0 A`,
        ratedVolts: `0 V`,
    });

    const panelTypeList = [
        { label: 'Distribution', value: 'distribution' },
        { label: 'Disconnect', value: 'disconnect' },
    ];

    const [breakerCountObj, setBreakerCountObj] = useState({
        onChange: (e) => console.log('SSR breakerCountObj => ', e),
        defaultValue: 0,
    });

    const [panelStates, setPanelStates] = useState({
        isEditingModeState: false,
        isViewDeviceIdsState: false,
    });

    const getTargetBreakerId = (targetBreakerNo) => {
        let targetObj = breakersList?.find((obj) => obj?.breaker_number === targetBreakerNo);
        return targetObj?.id;
    };

    const fetchSinglePanelData = async (panel_id, bldg_id) => {
        setPanelFetching(true);
        const params = `?building_id=${bldg_id}&panel_id=${panel_id}`;
        await getPanelsList(params)
            .then((res) => {
                const response = res?.data;

                setPanelType(response?.panel_type);
                setPanelObj(response);
                setOriginalPanelObj(response);

                if (response) {
                    setMainBreakerConfig({
                        items: [
                            {
                                id: 'M',
                                status: Breaker.Status.online,
                            },
                        ],
                        type: Breaker.Type.configured,
                        ratedAmps: `${response?.rated_amps} A`,
                        ratedVolts: `${getVoltageConfigValue(response?.voltage, 'single')} V`,
                    });
                }

                setBreakerCountObj({ ...breakerCountObj, defaultValue: response?.breakers });

                BreakersStore.update((s) => {
                    s.panelData = response;
                });

                setPanelFetching(false);
            })
            .catch(() => {
                setPanelFetching(false);
            });
    };

    const fetchBreakersData = async (panel_id, bldg_id) => {
        setBreakersFetching(true);

        LoadingStore.update((s) => {
            s.isLoading = true;
        });

        const params = `?panel_id=${panel_id}&building_id=${bldg_id}`;
        await getBreakersList(params)
            .then((res) => {
                const response = res?.data?.data;
                setBreakersList(response);
                setBreakersFetching(false);

                LoadingStore.update((s) => {
                    s.isBreakerDataFetched = false;
                    s.isLoading = false;
                });
            })
            .catch(() => {
                setBreakersFetching(false);
                LoadingStore.update((s) => {
                    s.isBreakerDataFetched = false;
                    s.isLoading = false;
                });
            });
    };

    const fetchEquipmentData = async (bldg_id) => {
        const params = `?building_id=${bldg_id}&occupancy_filter=true`;
        await getEquipmentsList(params)
            .then((res) => {
                const responseData = res?.data?.data;
                const equipArray = [];
                responseData.forEach((record) => {
                    if (record.equipments_name === '') {
                        return;
                    }
                    const obj = {
                        label: record.equipments_name,
                        value: record.equipments_id,
                        breakerId: record.breaker_id,
                    };
                    equipArray.push(obj);
                });
                setEquipmentsList(equipArray);
                BreakersStore.update((s) => {
                    s.equipmentData = equipArray;
                });
            })
            .catch(() => {});
    };

    const fetchPanelsData = async (bldg_id) => {
        const params = `?building_id=${bldg_id}`;
        await getPanelsList(params)
            .then((res) => {
                const response = res?.data?.data;
                setPanelsList(response);
            })
            .catch(() => {});
    };

    const fetchPassiveDeviceData = async (bldg_id) => {
        const params = `?building_id=${bldg_id}&page_no=1&page_size=150`;
        await getPassiveDeviceList(params)
            .then((res) => {
                const responseData = res?.data?.data;
                const newArray = [];

                responseData.forEach((record) => {
                    const obj = {
                        label: record?.identifier,
                        value: record?.equipments_id,
                    };
                    newArray.push(obj);
                });

                setPassiveDevicesList(newArray);

                BreakersStore.update((s) => {
                    s.passiveDeviceData = newArray;
                    s.totalPassiveDeviceCount = res?.data?.total_data;
                });
            })
            .catch(() => {});
    };

    const fetchLocationData = async (bldg_id) => {
        const params = `/${bldg_id}`;
        await getLocationData(params)
            .then((res) => {
                const responseData = res?.data;
                responseData.length === 0 ? setLocationsList([]) : setLocationsList(responseData);
            })
            .catch(() => {});
    };

    const pageDefaultStates = () => {
        BreadcrumbStore.update((bs) => {
            const newList = [
                {
                    label: 'Panels',
                    path: '/settings/panels',
                    active: true,
                },
            ];
            bs.items = newList;
            bs.isEditable = false;
        });
        ComponentStore.update((s) => {
            s.parent = 'building-settings';
        });
        window.scrollTo(0, 0);
    };

    useEffect(() => {
        const links = [];
        breakersList.forEach((record) => {
            if (record?.breaker_number + 2 > breakersList.length) return;

            const obj = {
                id: `breaker-${record?.breaker_number}`,
                source: record?.id,
                target: getTargetBreakerId(record?.breaker_number + 2),
                type: 'breakerLink',
            };
            links.push(obj);
        });
        console.log('SSR links => ', links);
        setBreakerLinks(links);
    }, [breakersList]);

    useEffect(() => {
        fetchSinglePanelData(panelId, bldgId);
        fetchBreakersData(panelId, bldgId);
        fetchEquipmentData(bldgId);
        fetchPanelsData(bldgId);
        fetchPassiveDeviceData(bldgId);
        fetchLocationData(bldgId);
    }, [panelId]);

    useEffect(() => {
        pageDefaultStates();
    }, []);

    console.log('SSR breakersList => ', breakersList);
    console.log('SSR breakerLinks => ', breakerLinks);

    return (
        <>
            <h2>EditPanel</h2>;
            <Brick sizeInRem={2} />
            <Panel
                typeOptions={panelTypeList}
                typeProps={{
                    onChange: null,
                    defaultValue: 'distribution',
                }}
                numberOfBreakers={breakerCountObj}
                isEditable={true}
                states={panelStates}
                mainBreaker={mainBreakerConfig}
                dangerZoneProps={{
                    onClickButton: (event) => alert('dangerZoneProps onClick'),
                }}
                onEdit={(props) => {
                    alert('OnEdit');
                    console.log('OnEdit', props);
                }}
                onShowChart={(props) => {
                    alert('onShowChart');
                    console.log('onShowChart', props);
                }}
                callBackBreakerProps={({ breakerProps, breakerData, children }) => {
                    console.log(breakerProps, breakerData, children);
                    const equipmentName = breakerData.equipment_links[0]?.name;
                    const status = Breaker.Status.online;

                    //here you can modify props for breakers
                    return {
                        ...breakerProps,
                        equipmentName,
                        items: breakerProps.items.map((breakerProp) => ({ ...breakerProp, status })),
                    };
                }}
                breakerPropsAccessor={{
                    id: 'breaker_number',
                    status: 'status',
                    deviceId: 'device_id',
                    sensorId: 'sensor_id',
                    ratedAmps: 'rated_amps',
                    ratedVolts: 'voltage',
                    equipmentName: 'equipment_name',
                    isFlagged: 'is_flagged',
                    type: 'type',
                    parentBreaker: 'parent_breaker',
                    _id: 'id',
                }}
                nodes={breakersList}
                edges={breakerLinks}
            />
        </>
    );
};

export default EditPanel;
