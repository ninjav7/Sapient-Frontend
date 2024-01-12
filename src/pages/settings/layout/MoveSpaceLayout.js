import React, { useState, useEffect, useRef } from 'react';
import Modal from 'react-bootstrap/Modal';

import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import Typography from '../../../sharedComponents/typography';
import LayoutElements from '../../../sharedComponents/layoutElements/LayoutElements';
import { getAllSpacesList } from './services';

import MoveLayout from './MoveLayout';

const MoveSpaceLayout = (props) => {
    const {
        isModalOpen = false,
        closeModal,
        bldgId,
        spaceObj = {},
        setSpaceObj,
        floorsList,
        oldStack,
        setSpaceObjParent,
        spaceObjParent,
        sortedLayoutData,
        notifyUser,
        openModal,
        openEditSpacePopup,
        newStack,
        setNewStack,
        allParentSpaces,
    } = props;

    const [spacesList, setSpacesList] = useState([]);
    const [isFetchingSpace, setFetchingSpace] = useState(false);
    const [showMoveSpace, setShowMoveSpace] = useState(false);

    const [formattedOldValue, setFormattedOldValue] = useState('');
    const [formattedNewValue, setFormattedNewValue] = useState('');

    const formatStack = (stack, isNew) => {
        let res = '';

        if (isNew) {
            let isFirst = true;
            let lastElementIndex;

            for (let key in stack) {
                const element = stack[key];

                const intKey = parseInt(key);
                if (!stack[intKey + 1]) lastElementIndex = intKey;

                if (isFirst) {
                    isFirst = false;
                    continue;
                } else {
                    if (res.length) {
                        res += ' > ' + element?.currentItem?.name;
                    } else {
                        res += element?.currentItem?.name;
                    }
                }
            }

            const lastElement = stack[lastElementIndex];

            if (lastElement?.currentItem?.name !== spaceObjParent?.name) {
                res += res.length ? ' > ' + spaceObjParent?.name : spaceObjParent?.name;
            }

            res += ' > ' + spaceObj?.name;
        } else {
            for (let element of stack) {
                if (res.length) {
                    res += ' > ' + element?.name;
                } else {
                    res += element?.name;
                }
            }
        }

        return res;
    };

    useEffect(() => {
        if (oldStack.length > 0) setFormattedOldValue(formatStack(oldStack, false));
        if (
            newStack &&
            Object.values(newStack).length > 0 &&
            spaceObjParent &&
            Object.values(spaceObjParent).length > 0
        )
            setFormattedNewValue(formatStack(newStack, true));
    }, [oldStack, newStack, spaceObjParent]);

    useEffect(() => {
        if (Object.values(spaceObj).length > 0) allParentSpaces.current.push(spaceObj);
    }, [spaceObj]);

    const fetchAllSpaceData = async (floor_id, bldg_id) => {
        setFetchingSpace(true);
        setSpacesList([]);

        const params = `?floor_id=${floor_id}&building_id=${bldg_id}`;

        await getAllSpacesList(params)
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    if (response?.data.length !== 0) setSpacesList(sortedLayoutData(response?.data));
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

    const handleChanges = (changes) => {
        let obj = Object.assign({}, spaceObj);

        changes.forEach(({ key, value }) => {
            obj[key] = value;
        });

        setSpaceObj(obj);
    };

    const closeMoveSpacePopup = () => {
        setSpaceObjParent(null);
        setShowMoveSpace(false);
        openModal();
    };

    const openMoveSpacePopup = (newParent, newStack) => {
        newStack && setNewStack(newStack);
        newParent && setSpaceObjParent(newParent);
        closeModal();
        setShowMoveSpace(true);
    };

    const confirmMoveSpacePopup = async () => {
        const newParent = spaceObjParent;
        const changes = [];

        if (newParent.parents) {
            if (spaceObj.parents !== newParent.parents) {
                changes.push({ key: 'new_parents', value: newParent.parents });
            }
            changes.push({ key: 'new_parent_space', value: newParent._id });
        } else {
            changes.push({ key: 'new_parents', value: newParent.floor_id });
            changes.push({ key: 'new_parent_space', value: null });
        }

        handleChanges(changes);
        setShowMoveSpace(false);
        closeModal();
        openEditSpacePopup();
    };

    const onClickForAllItems = async ({ nativeHandler, data }) => {
        nativeHandler();
        if (data?.parent_building && data?.floor_id) {
            fetchAllSpaceData(data?.floor_id, data?.parent_building);
        }
    };

    const ableToBeMoved = (space) => {
        // should not be able to be moved:
        // if it is current element
        if (space?._id === spaceObj?._id) {
            return false;
        }

        // if it is parent_space of current element
        if (space?._id === spaceObj?.parent_space) {
            return false;
        }

        // if it is parent_floor of current element
        if (space?.floor_id === spaceObj?.parents) {
            return false;
        }

        // if it is any descendant of current element
        if (allParentSpaces.current.find((parentSpace) => parentSpace?._id === space?.parent_space)) {
            allParentSpaces.current.push(space);
            return false;
        }

        return true;
    };

    const onMoveClick = (newParent, newStack) => {
        openMoveSpacePopup(newParent, newStack);
    };

    const rootObj = {
        type: 'root',
        bldg_id: bldgId,
    };

    return (
        <>
            <Modal show={isModalOpen} backdrop="static" keyboard={false} size="lg" centered>
                <div className="p-4">
                    <Typography.Header size={Typography.Sizes.lg} style={{ marginBottom: '8px' }}>
                        Move Space {spaceObj?.name}
                    </Typography.Header>
                    <Typography.Body size={Typography.Sizes.md} style={{ fontWeight: 500 }}>
                        Current Location: {formattedOldValue}
                    </Typography.Body>

                    <Brick sizeInRem={2} />

                    <LayoutElements
                        spaces={spacesList}
                        floors={floorsList}
                        buildingData={rootObj}
                        isLoadingLastColumn={isFetchingSpace}
                        onClickEachChild={[onClickForAllItems]}
                        onColumnAdd={null}
                        onColumnNameEdit={null}
                        onItemEdit={null}
                        isMoveSpace={true}
                        confirmMove={true}
                        ableToBeMoved={ableToBeMoved}
                        onMoveClick={onMoveClick}
                    />

                    <Brick sizeInRem={2} />

                    <div className="d-flex justify-content-between w-100">
                        <Button
                            label={`Cancel`}
                            size={Button.Sizes.lg}
                            type={Button.Type.secondaryGrey}
                            className="w-100"
                            onClick={() => {
                                closeModal();
                                openEditSpacePopup();
                            }}
                        />
                    </div>
                    <Brick sizeInRem={0.25} />
                </div>
            </Modal>

            <MoveLayout
                isModalOpen={showMoveSpace}
                onCancel={closeMoveSpacePopup}
                onSave={confirmMoveSpacePopup}
                oldPath={formattedOldValue}
                newPath={formattedNewValue}
                name={spaceObj?.name}
            />
        </>
    );
};

export default MoveSpaceLayout;
