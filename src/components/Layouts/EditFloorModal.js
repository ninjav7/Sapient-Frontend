import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAtom } from 'jotai';

import { Button, Input, Label } from 'reactstrap';
import { floorList } from '../../store/globalState';

const EditFloorModal = (props) => {
    const [floorName, setFloorName] = useState('');
    const [floors, setFloors] = useAtom(floorList);

    return (
        <>
            <Modal {...props} centered>
                <Modal.Header>
                    <Modal.Title id="">Edit Floor</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Label>Name</Label>
                    <Input
                        className="mb-3 font-weight-bold"
                        onChange={(e) => {
                            setFloorName(e.target.value);
                        }}
                        autoFocus
                    />
                    <Label>Type</Label>
                    <Input id="font-weight-bold mb-3" name="select" type="select" disabled>
                        <option>Floors</option>
                    </Input>
                    <span>Only floors can be at the building root</span>
                </Modal.Body>

                <Modal.Footer>
                    <Button onClick={props.onHide}>Cancel</Button>
                    <Button
                        onClick={() => {
                            setFloors((el) => [...el, floorName]);
                            props.onHide();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditFloorModal;
