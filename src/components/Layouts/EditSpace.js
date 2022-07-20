import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAtom } from 'jotai';

import { Button, Input, Label } from 'reactstrap';
import { spacesList } from '../../store/globalState';

const EditSpace = (props) => {
    const floor1 = [
        {
            id: 1,
            name: 'Room',
        },
        {
            id: 2,
            name: 'Area',
        },
    ];
    const [spaceName, setSpaceName] = useState('');
    const [space, setSpace] = useAtom(spacesList);
    const [typeName, setTypeName] = useState('Room');
    console.log('spaceName', spaceName);
    console.log('space', space);
    console.log('props.floorIndex', props.floorIndex);
    console.log('typeName', typeName);

    return (
        <>
            <Modal {...props} centered>
                <Modal.Header>
                    <Modal.Title id="">Edit Area</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Label>Name</Label>
                    <Input
                        className="mb-3 font-weight-bold"
                        onChange={(e) => {
                            setSpaceName(e.target.value);
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
                        }}>
                        {floor1?.map((item) => {
                            return (
                                <option key={item.id} value={item.name}>
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
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditSpace;
