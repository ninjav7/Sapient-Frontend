import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { useParams } from 'react-router-dom';

import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';

import Typography from '../../../sharedComponents/typography';
import { updateBuildingStore } from '../../../helpers/updateBuildingStore';
import { buildingData } from '../../../store/globalState';
import { getAllFloorsList, getAllSpacesList } from './services';
import { Notification } from '../../../sharedComponents/notification';
import { UserStore } from '../../../store/UserStore';
import Brick from '../../../sharedComponents/brick';
import LayoutElements from '../../../sharedComponents/layoutElements/LayoutElements';
import AddFloor from './floors/AddFloor';

const LayoutPage = () => {
    const { bldgId } = useParams();
    const [buildingListData] = useAtom(buildingData);

    const [rootObj, setRootObj] = useState({
        type: 'root',
        bldg_id: bldgId,
    });

    const [floorsList, setFloorsList] = useState([]);
    const [isFetchingFloor, setFetchingFloor] = useState(false);

    const [spacesList, setSpacesList] = useState([]);
    const [isFetchingSpace, setFetchingSpace] = useState(false);

    // Add Floor States
    const [showAddFloor, setShowAddFloor] = useState(false);
    const closeAddFloorPopup = () => setShowAddFloor(false);
    const openAddFloorPopup = () => setShowAddFloor(true);

    const notifyUser = (notifyType, notifyMessage) => {
        UserStore.update((s) => {
            s.showNotification = true;
            s.notificationMessage = notifyMessage;
            s.notificationType = notifyType;
        });
    };

    const fetchAllFloorData = async (bldg_id) => {
        console.log('SSR fetchAllFloorData API executed!');
        console.log('SSR bldg_id => ', bldg_id);
        const params = `?building_id=${bldg_id}`;
        setFetchingFloor(true);

        await getAllFloorsList(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (response?.data.length !== 0) setFloorsList(response?.data);
                } else {
                    notifyUser(Notification.Types.success, 'Failed to fetch Floors.');
                }
            })
            .catch((error) => {
                notifyUser(Notification.Types.success, 'Failed to fetch Floors.');
            })
            .finally(() => {
                setFetchingFloor(false);
            });
    };

    const fetchAllSpaceData = async (floor_id, bldg_id) => {
        const params = `?floor_id=${floor_id}&building_id=${bldg_id}`;
        setFetchingSpace(true);
        setSpacesList([]);

        await getAllSpacesList(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (response?.data.length !== 0) setSpacesList(response?.data);
                } else {
                    notifyUser(Notification.Types.error, 'Failed to fetch Spaces.');
                }
            })
            .catch((error) => {
                notifyUser(Notification.Types.error, 'Failed to fetch Spaces.');
            })
            .finally(() => {
                setFetchingSpace(false);
            });
    };

    const onClickForAllItems = async ({ nativeHandler, data }) => {
        nativeHandler();
        if (data?.parent_building && data?.floor_id) {
            fetchAllSpaceData(data?.floor_id, data?.parent_building);
        }
    };

    useEffect(() => {
        if (bldgId) {
            fetchAllFloorData(bldgId);
            setRootObj((prevStateObj) => {
                return { ...prevStateObj, bldg_id: bldgId };
            });
        }
    }, [bldgId]);

    const updateBreadcrumbStore = () => {
        window.scrollTo(0, 0);
        BreadcrumbStore.update((bs) => {
            bs.items = [
                {
                    label: 'Layout',
                    path: '/settings/layout',
                    active: true,
                },
            ];
        });
        ComponentStore.update((s) => {
            s.parent = 'building-settings';
        });
    };

    useEffect(() => {
        if (bldgId && buildingListData.length !== 0) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id)
                updateBuildingStore(
                    bldgObj?.building_id,
                    bldgObj?.building_name,
                    bldgObj?.timezone,
                    bldgObj?.plug_only
                );
        }
    }, [buildingListData, bldgId]);

    useEffect(() => {
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Typography.Header size={Typography.Sizes.lg}>{`Layout`}</Typography.Header>

            <Brick sizeInRem={1.5} />

            <LayoutElements
                spaces={spacesList}
                floors={floorsList}
                buildingData={rootObj}
                isLoadingLastColumn={isFetchingFloor || isFetchingSpace}
                onClickEachChild={[onClickForAllItems]}
                onColumnAdd={(args) => {
                    // console.log('SSR args => ', args);
                    // When Plus Icon clicked from Building Root
                    if (args?.type === 'root' && args?.bldg_id) {
                        openAddFloorPopup();
                    } else if (args?.parent_building && args?.floor_id) {
                        alert(`Add Space Modal will popup.`);
                    }
                }}
            />

            <AddFloor
                isModalOpen={showAddFloor}
                closeModal={closeAddFloorPopup}
                bldgId={bldgId}
                fetchAllFloorData={fetchAllFloorData}
                notifyUser={notifyUser}
            />
        </React.Fragment>
    );
};

export default LayoutPage;
