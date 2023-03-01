import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAtom } from 'jotai';
import { Button, Input, Label } from 'reactstrap';
import { closedEditFloorModal, deleteFloor, floorList } from '../../../store/globalState';
import { BuildingStore } from '../../../store/BuildingStore';
import { floorIdState } from '../../../store/globalState';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { BaseUrl, createFloors, updateSpace, getSpaceTypes, createSpace } from '../../../services/Network';
import Delete from '../../../assets/images/delete.png';
import Typography from '../../../sharedComponents/typography';

const EditFloorModal = (props) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const [loading, setLoading] = useState(false);

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    // API Body
    const [apiBody, setApiBody] = useState({ parent_building: bldgId });
    const [floorsName, setFloorName] = useState('');
    const [floor, setFloor] = useState([]);
    const [spaceName, setSpaceName] = useState('');
    const [typeName, setTypeName] = useState('Room');
    const [floorModal, setFloorModal] = useAtom(closedEditFloorModal);
    const [floorid] = useAtom(floorIdState);
    const [floorNameApi, setFloorNameApi] = useState();
    const [spaceBody, setSpaceBody] = useState({
        building_id: bldgId,
    });

    useEffect(() => {
        if (props.currentFloorId !== '') {
            setSpaceBody({ ...spaceBody, parent_space: props.currentFloorId });
        }
    }, [props.currentFloorId]);

    useEffect(() => {
        setFloorNameApi({ name: floorsName });
    }, [floorsName]);

    useEffect(() => {
        if (props.modalType != 'spaces') return;
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        let params = `?building_id=${bldgId}`;
        axios.get(`${BaseUrl}${getSpaceTypes}${params}`, { headers }).then((res) => {
            let response = res?.data?.data?.[0]?.generic_spacetypes;
            response.sort((a, b) => {
                return a.name.localeCompare(b.name);
            });
            setFloor(response);
        });
    }, [props.modalType]);

    const createFloorsFunc = () => {
        setLoading(true);
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        let params = `?building_id=${bldgId}`;
        axios.post(`${BaseUrl}${createFloors}${params}`, apiBody, { headers }).then((res) => {
            props.onHide();
            setLoading(false);
        });
    };

    const updateFloorsFunc = () => {
        setLoading(true);
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        const params = `${floorid}`;
        axios.patch(`${BaseUrl}${updateSpace}?floor_id=${params}`, floorNameApi, { headers }).then((res) => {
            props.onHide();
            setLoading(false);
        });
    };
    const createSpacesAPI = () => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        let params = `?building_id=${bldgId}`;
        axios.post(`${BaseUrl}${createSpace}${params}`, spaceBody, { headers }).then((res) => {
            setLoading(false);
            props.onHide();
        });
    };
    const [deletingFloor, setDeletingFloor] = useAtom(deleteFloor);

    return (
        <>
            <Modal {...props} centered>
                <Modal.Header>
                    {props.editFloor && props?.modalType === 'floor' ? (
                        <Modal.Title id="">
                            <Typography.Header size={Typography.Sizes.lg}>Edit Floor</Typography.Header>
                        </Modal.Title>
                    ) : !props.editFloor && props?.modalType === 'floor' ? (
                        <Modal.Title id="">
                            <Typography.Header size={Typography.Sizes.lg}>Add Floor</Typography.Header>
                        </Modal.Title>
                    ) : props?.modalType === 'spaces' ? (
                        <Modal.Title id="">
                            <Typography.Header size={Typography.Sizes.lg}>Add Spaces</Typography.Header>
                        </Modal.Title>
                    ) : null}
                </Modal.Header>
                <Modal.Body>
                    {props.editFloor && props.modalType === 'floor' ? (
                        <>
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>Name</Typography.Body>
                                <Input
                                    className="mb-3 font-weight-bold"
                                    defaultValue={props.floorName}
                                    onChange={(e) => {
                                        setApiBody({ ...apiBody, name: e.target.value });
                                        setFloorName(e.target.value);
                                    }}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>Type</Typography.Body>
                                <Input className="mb-3 font-weight-bold" disabled value="Floor" />
                                <Typography.Body size={Typography.Sizes.md}>
                                    Only Floors can be at the building root
                                </Typography.Body>
                            </div>
                            <div
                                style={{ marginTop: '20px' }}
                                onClick={() => {
                                    props.onHide();
                                    props.handleDeleteAlertShow();
                                }}>
                                <span
                                    onClick={() => {}}
                                    style={{
                                        backgroundColor: '#fdebea',
                                        padding: '10px 15px',
                                        borderRadius: '10px',
                                        marginTop: '20px',
                                        cursor: 'pointer',
                                    }}>
                                    <img src={Delete} alt="delete" style={{ width: '20px' }} />
                                    <span style={{ color: '#df4544', marginLeft: '10px' }}>Delete Floor</span>
                                </span>
                            </div>
                        </>
                    ) : !props.editFloor && props.modalType === 'floor' ? (
                        <>
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>Name</Typography.Body>
                                <Input
                                    className="mb-3 font-weight-bold"
                                    onChange={(e) => {
                                        setApiBody({ ...apiBody, name: e.target.value });
                                        setFloorName(e.target.value);
                                    }}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>Type</Typography.Body>
                                <Input
                                    style={{ color: 'grey' }}
                                    className="mb-3 font-weight-bold"
                                    disabled={true}
                                    value="Floor"
                                />
                                <Typography.Body size={Typography.Sizes.md}>
                                    Only Floors can be at the building root
                                </Typography.Body>
                            </div>
                        </>
                    ) : props.modalType === 'spaces' ? (
                        <>
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>Name</Typography.Body>
                                <Input
                                    className="mb-3 font-weight-bold"
                                    onChange={(e) => {
                                        setSpaceName(e.target.value);
                                        setSpaceBody({ ...spaceBody, name: e.target.value });
                                    }}
                                    autoFocus
                                />
                            </div>
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>Type</Typography.Body>
                                <Input
                                    id="font-weight-bold mb-3"
                                    name="select"
                                    type="select"
                                    onChange={(e) => {
                                        setTypeName(e.target.value);
                                        setSpaceBody({ ...spaceBody, type_id: e.target.value });
                                    }}>
                                    <option>--Select any type--</option>
                                    {floor?.map((item) => {
                                        return (
                                            <option key={item.id} value={item.id}>
                                                {item.name}
                                            </option>
                                        );
                                    })}
                                </Input>
                            </div>
                        </>
                    ) : null}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={props.onHide}>Cancel</Button>
                    <Button
                        onClick={() => {
                            if (props.editFloor && props?.modalType === 'floor') {
                                updateFloorsFunc();
                            }
                            if (!props.editFloor && props?.modalType === 'floor') {
                                createFloorsFunc();
                            }
                            if (props?.modalType === 'spaces') {
                                createSpacesAPI();
                            }
                            props.onHide();
                            setFloorModal(true);
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditFloorModal;
