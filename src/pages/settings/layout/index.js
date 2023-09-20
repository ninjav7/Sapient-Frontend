import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useAtom } from 'jotai';
import { useParams } from 'react-router-dom';
import '../style.css';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import EditFloorModal from './EditFloorModal';
import DeleteModal from './DeleteModal';
import { buildingData, deleteFloor, getFloorsData } from '../../../store/globalState';
import { userPermissionData } from '../../../store/globalState';
import LayoutElements from '../../../sharedComponents/layoutElements/LayoutElements';
import Brick from '../../../sharedComponents/brick';
import { fetchFloors, fetchSpaces, addSpace, removeFloor } from './services';
import { updateBuildingStore } from '../../../helpers/updateBuildingStore';

const Layout = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const [userPermission] = useAtom(userPermissionData);

    const { bldgId } = useParams();
    const [buildingListData] = useAtom(buildingData);

    const [editFloor, setEditFloor] = useState(false);
    // Saving API data
    const [isLoadingLastColumn, setIsLoadingLastColumn] = useState(false);
    const [spaces, setSpaces] = useState([]);
    const [floor, setFloor] = useState([]);
    const [floorid, setFloorid] = useState('');
    const [currentFloorId, setCurrentFloorId] = useState('');
    const [currentSpaceId, setCurrentSpaceId] = useState('');
    const [parentSpace, setParentSpace] = useState('');
    const [typeName, setTypeName] = useState('');
    const [typeId, setTypeId] = useState('');
    const [modalType, setModalType] = useState('');

    const [modalShow, setModalShow] = useState(false);
    const handleModalOpen = () => setModalShow(true);

    const [spaceBody, setSpaceBody] = useState({
        floor_id: currentFloorId,
        building_id: bldgId,
    });
    const [selectedData, setSelectedData] = useState({});
    const getFloorsFunc = async () => {
        const params = `?building_id=${bldgId}`;
        await fetchFloors(params)
            .then((res) => {
                const responseData = res?.data;
                setFloorData(responseData?.data);
            })
            .catch(() => {});
    };

    useEffect(() => {
        getFloorsFunc();
    }, [bldgId]);
    const building = {
        bdId: bldgId,
    };
    const [floorData, setFloorData] = useAtom(getFloorsData);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            window.scrollTo(0, 0);
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Layout',
                        path: '/settings/layout',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

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

    const createSpacesAPI = async () => {
        let params = `?building_id=${bldgId}`;
        await addSpace(params, spaceBody)
            .then((res) => {
                const responseData = res?.data;
            })
            .catch(() => {});
    };

    const [deletingFloor, setDeletingFloorModal] = useAtom(deleteFloor);
    const handleDeleteClose = () => {
        setDeletingFloorModal(false);
    };

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const handleDeleteAlertClose = () => setShowDeleteAlert(false);
    const handleDeleteAlertShow = () => setShowDeleteAlert(true);

    const [floorName, setFloorName] = useState('');
    const [spaceName, setSpaceName] = useState('');

    useEffect(() => {
        if (!modalShow) {
            setFloorName('');
            setSpaceName('');
        }
    }, modalShow);

    const onClickForAllItems = async ({ nativeHandler, data }) => {
        setSelectedData({ nativeHandler, data });
        nativeHandler();
        if (!data.floor_id) {
            return;
        }

        setIsLoadingLastColumn(true);
        const params = `?floor_id=${data.floor_id}&building_id=${bldgId}`;
        await fetchSpaces(params)
            .then((res) => {
                const responseData = res?.data;
                setSpaces(responseData.data);
                setIsLoadingLastColumn(false);
            })
            .catch(() => {
                setIsLoadingLastColumn(false);
            });
    };

    const handleModalClose = () => {
        setModalShow(false);
        setEditFloor(false);
        setTypeId('');
        setModalType('');
        setFloorName('');
        setSpaceName('');
        setCurrentFloorId('');
        setCurrentSpaceId('');
    };

    return (
        <React.Fragment>
            <EditFloorModal
                show={modalShow}
                typeId={typeId}
                editFloor={editFloor}
                modalType={modalType}
                floorName={floorName}
                spaceName={spaceName}
                parentSpace={parentSpace}
                currentFloorId={currentFloorId}
                currentSpaceId={currentSpaceId}
                selectedData={selectedData}
                getFloorsFunc={getFloorsFunc}
                handleModalClose={handleModalClose}
                handleDeleteAlertShow={handleDeleteAlertShow}
                onClickForAllItems={onClickForAllItems}
                setModalShow={setModalShow}
            />

            <DeleteModal
                show={showDeleteAlert}
                modalType={modalType}
                currentFloorId={currentFloorId}
                currentSpaceId={currentSpaceId}
                getFloorsFunc={getFloorsFunc}
                onClickForAllItems={onClickForAllItems}
                selectedData={selectedData}
                onHide={() => handleDeleteAlertClose()}
            />

            <Row className="page-title">
                <Col className="header-container">
                    <span className="heading-style">Layout</span>
                </Col>
            </Row>
            <Brick sizeInRem={1.5} />

            <Row>
                <Col lg={12}>
                    <LayoutElements
                        isLoadingLastColumn={isLoadingLastColumn}
                        spaces={spaces}
                        floors={floorData}
                        buildingData={building}
                        onColumnAdd={(args) => {
                            if (args?.bdId !== undefined && args?.bdId !== '') {
                                handleModalOpen();
                                setEditFloor(false);
                                setModalType('floor');
                                setCurrentFloorId('');
                                setSpaceName('');
                                setFloorName('');
                                setCurrentSpaceId('');
                                setParentSpace('');
                                setTypeId('');
                            } else if (args?.floor_id !== undefined && args?.floor_id !== '') {
                                handleModalOpen();
                                setEditFloor(false);
                                setModalType('spaces');
                                setCurrentFloorId(args?.floor_id);
                                setSpaceName('');
                                setFloorName('');
                                setCurrentSpaceId('');
                                setParentSpace('');
                                setTypeId('');
                            } else {
                                handleModalOpen();
                                setEditFloor(false);
                                setModalType('spaces');
                                setCurrentFloorId(args?.parents);
                                setCurrentSpaceId(args?._id);
                                setSpaceName('');
                                setFloorName('');
                                setParentSpace(args?._id);
                                setTypeId('');
                            }
                        }}
                        onColumnNameEdit={
                            userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.account_buildings_permission?.edit
                                ? (args) => {
                                      if (args?.bdId === undefined)
                                          if (args?.floor_id !== undefined && args?.floor_id !== '') {
                                              handleModalOpen();
                                              setEditFloor(true);
                                              setModalType('floor');
                                              setCurrentFloorId(args?.floor_id);
                                              setFloorName(args?.name);
                                              setSpaceName('');
                                              setCurrentSpaceId('');
                                              setParentSpace('');
                                              setTypeId('');
                                          } else {
                                              handleModalOpen();
                                              setEditFloor(true);
                                              setModalType('spaces');
                                              setCurrentFloorId(args?.parents);
                                              setFloorName('');
                                              setSpaceName(args?.name);
                                              setCurrentSpaceId(args?._id);
                                              setParentSpace(args?.parent_space);
                                              setTypeId(args?.type_id);
                                          }
                                  }
                                : null
                        }
                        onItemEdit={
                            userPermission?.user_role === 'admin' ||
                            userPermission?.permissions?.permissions?.account_buildings_permission?.edit
                                ? (args) => {
                                      if (args?.floor_id !== undefined && args?.floor_id !== '') {
                                          handleModalOpen();
                                          setEditFloor(true);
                                          setModalType('floor');
                                          setCurrentFloorId(args?.floor_id);
                                          setFloorName(args?.name);
                                          setSpaceName('');
                                          setCurrentSpaceId('');
                                          setParentSpace('');
                                          setTypeId('');
                                      } else {
                                          handleModalOpen();
                                          setEditFloor(true);
                                          setModalType('spaces');
                                          setFloorName('');
                                          setCurrentFloorId(args?.parents);
                                          setSpaceName(args?.name);
                                          setCurrentSpaceId(args?._id);
                                          setParentSpace(args?.parent_space);
                                          setTypeId(args?.type_id);
                                      }
                                  }
                                : null
                        }
                        onClickEachChild={[onClickForAllItems]}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Layout;
