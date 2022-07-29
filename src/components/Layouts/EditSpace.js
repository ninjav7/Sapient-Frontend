import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAtom } from 'jotai';

import { Button, Input, Label } from 'reactstrap';
import {
    closeEditSpaceModal,
    floorid,
    flooridNew,
    floorState,
    floorStaticId,
    reloadSpaces,
    spaceName2,
    spacesList,
} from '../../store/globalState';
import { Cookies } from 'react-cookie';
import { BuildingStore } from '../../store/BuildingStore';
import { BaseUrl, createSpace, getSpaceTypes } from '../../services/Network';
import axios from 'axios';

const EditSpace = (props) => {
    console.log('floorId', props.floorId);
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const bldgId = BuildingStore.useState((s) => s.BldgId);

    const [floorIdNow] = useAtom(floorStaticId);
    console.log('floorIdNow', floorIdNow);

    const [reloadSpace, setReloadSpace] = useAtom(reloadSpaces);

    const [spaceName, setSpaceName] = useState('');
    const [floor2, setFloor1] = useAtom(floorState);
    const [space, setSpace] = useAtom(spacesList);
    const [typeName, setTypeName] = useState('Room');
    const [closeModal, setCloseModal] = useAtom(closeEditSpaceModal);
    const [disableButton, setDisableButton] = useState(true);

    const [spaceBody, setSpaceBody] = useState({
        building_id: bldgId,
    });
    console.log('props.currentFloorId', props.currentFloorId);

    useEffect(() => {
        if (props.currentFloorId) {
            setSpaceBody({ ...spaceBody, parent_space: props.currentFloorId });
        }
    }, [props.currentFloorId]);

    console.log('spaceBody', spaceBody);

    console.log('floor2', floor2);

    useEffect(() => {
        if (floorIdNow) {
            setSpaceBody({ ...spaceBody, parents: floorIdNow });
        }
    }, [floorIdNow]);

    const createSpacesAPI = () => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        axios.post(`${BaseUrl}${createSpace}`, spaceBody, { headers }).then((res) => {
            setReloadSpace('true');
        });
    };

    return (
        <>
            <Modal {...props} centered>
                <Modal.Header>
                    <Modal.Title id="">Add Space</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Label>Name</Label>
                    <Input
                        className="mb-3 font-weight-bold"
                        onChange={(e) => {
                            setSpaceName(e.target.value);
                            setSpaceBody({ ...spaceBody, name: e.target.value });
                        }}
                        autoFocus
                    />
                    <Label>Type</Label>
                    <Input
                        id="font-weight-bold mb-3"
                        name="select"
                        type="select"
                        onChange={(e) => {
                            setTypeName(e.target.value);
                            setSpaceBody({ ...spaceBody, type_id: e.target.value });
                        }}>
                        <option>--Select any type--</option>
                        {floor2?.map((item) => {
                            return (
                                <option key={item.id} value={item.id}>
                                    {item.name}
                                </option>
                            );
                        })}
                    </Input>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={props.onHide}>Cancel</Button>
                    <Button
                        onClick={() => {
                            setSpace((el) => [...el, { floorIndex: props.floorIndex, spaceName, typeName }]);
                            props.onHide();
                            setCloseModal(true);
                            createSpacesAPI();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditSpace;
