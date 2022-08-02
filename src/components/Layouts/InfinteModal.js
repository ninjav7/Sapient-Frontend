import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAtom } from 'jotai';

import { Button, Input, Label } from 'reactstrap';
import { closedEditFloorModal, floorList } from '../../store/globalState';
import { BuildingStore } from '../../store/BuildingStore';
import { Cookies } from 'react-cookie';
import axios from 'axios';
import { BaseUrl, createFloors, getFloors } from '../../services/Network';

const EditFloorModal = (props) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    // API Body
    const [apiBody, setApiBody] = useState({ parent_building: bldgId });

    console.log('apiBody', apiBody);

    const [floorName, setFloorName] = useState('');
    const [floors, setFloors] = useAtom(floorList);
    const [floorModal, setFloorModal] = useAtom(closedEditFloorModal);

    const createFloorsFunc = () => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.post(`${BaseUrl}${createFloors}`, apiBody, { headers }).then((res) => {
            console.log('res', res);
        });
    };

    return (
        <>
            <Modal {...props} centered>
                <Modal.Header>
                    <Modal.Title id="">Add Floor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Label>Name</Label>
                    <Input
                        className="mb-3 font-weight-bold"
                        onChange={(e) => {
                            setApiBody({ ...apiBody, name: e.target.value });
                            setFloorName(e.target.value);
                        }}
                        autoFocus
                    />
                    {/* <Label>Type</Label>
                    <Input id="font-weight-bold mb-3" name="select" type="select" disabled>
                        <option>Floors</option>
                    </Input>
                    <span>Only floors can be at the building root</span> */}
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={props.onHide}>Cancel</Button>
                    <Button
                        onClick={() => {
                            // setFloors((el) => [...el, floorName]);
                            // createFloorsFunc();
                            props.onHide();
                            // setFloorModal(true);
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditFloorModal;
