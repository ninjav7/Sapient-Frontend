import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAtom } from 'jotai';

import { Button, Input, Label } from 'reactstrap';
import { closedEditFloorModal, deleteFloor, floorList } from '../../store/globalState';
import { BuildingStore } from '../../store/BuildingStore';
import { floorIdState } from '../../store/globalState';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { BaseUrl, createFloors, getFloors, updateSpace } from '../../services/Network';
import Delete from '../../assets/images/delete.png';

const EditFloorModal = (props) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');


    const bldgId = BuildingStore.useState((s) => s.BldgId);

    // API Body
    const [apiBody, setApiBody] = useState({ parent_building: bldgId });
    const [floorsName, setFloorName] = useState('');
    const [floors, setFloors] = useAtom(floorList);
    const [floorModal, setFloorModal] = useAtom(closedEditFloorModal);
    const [floorid] = useAtom(floorIdState);
    const [floorNameApi, setFloorNameApi] = useState();

    useEffect(() => {
        setFloorNameApi({ name: floorsName });
    }, [floorsName]);

    const createFloorsFunc = () => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        let params = `?building_id=${bldgId}`;
        axios.post(`${BaseUrl}${createFloors}${params}`, apiBody, { headers }).then((res) => {
        });
    };

    const updateFloorsFunc = () => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        const params = `${floorid}`;
        axios.patch(`${BaseUrl}${updateSpace}?floor_id=${params}`, floorNameApi, { headers }).then((res) => {
        });
    };


    const [deletingFloor, setDeletingFloor] = useAtom(deleteFloor);

    return (
        <>
            <Modal {...props} centered>
                <Modal.Header>
                    {props.editFloor ? (
                        <Modal.Title id="">Edit Floor</Modal.Title>
                    ) : (
                        <Modal.Title id="">Add Floor</Modal.Title>
                    )}
                </Modal.Header>
                <Modal.Body>
                    {props.editFloor ? (
                        <>
                            <div>
                                <Label>Name</Label>
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
                                <Label>Type</Label>
                                <Input className="mb-3 font-weight-bold" disabled value="Floor" />
                                <span>Only Floors can be at the building root</span>
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
                    ) : (
                        <>
                            <Label>Name</Label>
                            <Input
                                className="mb-3 font-weight-bold"
                                onChange={(e) => {
                                    setApiBody({ ...apiBody, name: e.target.value });
                                    setFloorName(e.target.value);
                                }}
                                autoFocus
                            />
                            <Label>Type</Label>
                            <Input
                                style={{ color: 'grey' }}
                                className="mb-3 font-weight-bold"
                                disabled={true}
                                value="Floor"
                            />
                            <span style={{ marginBottom: '10px' }}>Only Floors can be at the building root</span>
                        </>
                    )}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={props.onHide}>Cancel</Button>
                    <Button
                        onClick={() => {
                            setFloors((el) => [...el, floorsName]);
                            if (props.editFloor) {
                                updateFloorsFunc();
                            }
                            if (!props.editFloor) {
                                createFloorsFunc();
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
