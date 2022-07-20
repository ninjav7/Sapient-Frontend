import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { useAtom } from 'jotai';

import { Button, Input, Label } from 'reactstrap';
import { areaList, iterationDataList, iterationNumber } from '../../store/globalState';

const EditInfiniteModal = (props) => {
    const area1 = [
        {
            id: 1,
            name: 'Room',
        },
        {
            id: 2,
            name: 'Area',
        },
    ];
    const [areaName, setAreaName] = useState('');

    const [typeName, setTypeName] = useState('Room');
    const [iterationData, setIterationData] = useAtom(iterationDataList);

    const [iterations] = useAtom(iterationNumber);
    console.log('iterations', iterations);
    console.log('iterationData', iterationData);

    return (
        <>
            <Modal {...props} centered>
                <Modal.Header>
                    <Modal.Title id="">Edit Room</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Label>Name</Label>
                    <Input
                        className="mb-3 font-weight-bold"
                        onChange={(e) => {
                            setAreaName(e.target.value);
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
                        {area1?.map((item) => {
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
                            setIterationData((el) => [
                                ...el,
                                {
                                    iterationIndex: props.iterationValue,
                                    spaceIndex: props.spaceIndex,
                                    areaName,
                                    typeName,
                                },
                            ]);
                            props.onHide();
                        }}>
                        Save
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default EditInfiniteModal;
