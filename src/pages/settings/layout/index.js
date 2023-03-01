import React, { useEffect, useState } from 'react';
import { Row, Col } from 'reactstrap';
import { useAtom } from 'jotai';
import '../style.css';
import axios from 'axios';
import { BaseUrl, createSpace, getFloors, getSpaces } from '../../../services/Network';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import EditFloorModal from './EditFloorModal';
import EditSpace from './EditSpace';
import { deleteFloor, getFloorsData } from '../../../store/globalState';
import { userPermissionData } from '../../../store/globalState';
import LayoutElements from '../../../sharedComponents/layoutElements/LayoutElements';
import Brick from '../../../sharedComponents/brick';

const Layout = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [editFloor, setEditFloor] = useState(false);
    // Saving API data
    const [isLoadingLastColumn, setIsLoadingLastColumn] = useState(false);
    const [spaces, setSpaces] = useState([]);
    const [floor, setFloor] = useState([]);
    const [floorid, setFloorid] = useState('');
    const [currentFloorId, setCurrentFloorId] = useState('');
    const [modalType, setModalType] = useState('');

    const [modalShow, setModalShow] = useState(false);
    const [modelToShow, setModelToShow] = useState(1);
    const [modalSpaceShow, setModalSpaceShow] = useState(false);
    const [spaceBody, setSpaceBody] = useState({
        floor_id: currentFloorId,
        building_id: bldgId,
    });

    const getFloorsFunc = () => {
        try {
            const headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            const params = `?building_id=${bldgId}`;
            axios.get(`${BaseUrl}${getFloors}${params}`, { headers }).then((res) => {
                setFloorData(res.data.data);
            });
        } catch (err) {}
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
        updateBreadcrumbStore();
    }, []);

    const createSpacesAPI = () => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        let params = `?building_id=${bldgId}`;
        axios.post(`${BaseUrl}${createSpace}${params}`, spaceBody, { headers }).then((res) => {});
    };

    const [userPermission] = useAtom(userPermissionData);

    const [deletingFloor, setDeletingFloorModal] = useAtom(deleteFloor);
    const handleDeleteClose = () => {
        setDeletingFloorModal(false);
    };

    const DeleteFloorsFunc = () => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        axios.delete(`${BaseUrl}${deleteFloor}/${floorid}`, { headers }).then((res) => {});
    };

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const handleDeleteAlertClose = () => setShowDeleteAlert(false);
    const handleDeleteAlertShow = () => setShowDeleteAlert(true);

    const [floorName, setFloorName] = useState('');

    const onClickForAllItems = async ({ nativeHandler, data }) => {
        nativeHandler();
        if (!data.floor_id) {
            return;
        }

        setIsLoadingLastColumn(true);
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        const params = `?floor_id=${data.floor_id}&building_id=${bldgId}`;
        axios.get(`${BaseUrl}${getSpaces}${params}`, { headers }).then((res) => {
            setSpaces(res.data.data);

            setIsLoadingLastColumn(false);
        });
    };

    return (
        <React.Fragment>
            <EditFloorModal
                editFloor={editFloor}
                show={modalShow}
                floorName={floorName}
                setModalShow={setModalShow}
                handleDeleteAlertShow={handleDeleteAlertShow}
                modalType={modalType}
                currentFloorId={currentFloorId}
                onHide={() => setModalShow(false)}
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
                                setModalShow(true);
                                setEditFloor(false);
                                setModalType('floor');
                                setCurrentFloorId('');
                            } else if (args?.floor_id !== undefined && args?.floor_id !== '') {
                                setModalShow(true);
                                setEditFloor(false);
                                setModalType('spaces');
                                setCurrentFloorId(args?.floor_id);
                            }
                        }}
                        onColumnNameEdit={(args) => {
                            if (args?.floor_id !== undefined && args?.floor_id !== '') {
                                setModalShow(true);
                                setEditFloor(true);
                                setModalType('floor');
                                setCurrentFloorId('');
                            }
                        }}
                        onItemEdit={(args) => {
                            if (args?.floor_id !== undefined && args?.floor_id !== '') {
                                setModalShow(true);
                                setEditFloor(true);
                                setModalType('floor');
                                setCurrentFloorId('');
                            }
                        }}
                        onClickEachChild={[onClickForAllItems]}
                    />
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default Layout;
