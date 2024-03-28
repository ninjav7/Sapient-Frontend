import React, { useState, useEffect } from 'react';
import Brick from '../../sharedComponents/brick';
import _ from 'lodash';
import { getAllFloorsList, getAllSpaceTypes, getAllSpacesList, getAllTags } from '../settings/layout/services';
import Skeleton from 'react-loading-skeleton';
import Typography from '../../sharedComponents/typography';
import { Col, Row } from 'reactstrap';
import InputTooltip from '../../sharedComponents/form/input/InputTooltip';
import Select from '../../sharedComponents/form/select';
import { Button } from '../../sharedComponents/button';
import { defaultDropdownSearch } from '../../sharedComponents/form/select/helpers';
import MoveSpaceLayout from './MoveSpaceLayout';
import { Notification } from '../../sharedComponents/notification';
import { mapSpacesList } from '../../helpers/helpers';
import { MultiSelect } from 'react-multi-select-component';
import { UserStore } from '../../store/UserStore';

const ConfigurationTab = ({
    bldgId,
    spaceId,
    selectedFloorId,
    spaceObj,
    setSpaceObj,
    notifyUser,
    allParentSpaces,
    errorObj,
    modal,
    openModal,
    closeModal,
}) => {
    const userPrefUnits = UserStore.useState((s) => s.unit);

    const [oldStack, setOldStack] = useState({});
    const [newStack, setNewStack] = useState({});

    const [floorsList, setFloorsList] = useState([]);
    const [spacesList, setSpacesList] = useState([]);
    const [spaceTypes, setSpaceTypes] = useState([]);
    const [spaceObjParent, setSpaceObjParent] = useState(null);
    const [spaceFetching, setSpaceFetching] = useState(false);

    const [tagOptions, setTagOptions] = useState([]);

    const sortedLayoutData = (dataList) => {
        const sortedList = _.sortBy(dataList, (obj) => {
            const name = obj?.name.toLowerCase();
            const match = name.match(/(\D+)(\d+)/);

            if (match) {
                const [, prefix, number] = match;
                return [prefix, _.padStart(number, 5, '0')];
            }
            return name;
        });

        return sortedList;
    };

    const fetchAllTags = async () => {
        try {
            const tags = await getAllTags();

            const mappedTags = tags.data.map((tag) => ({ label: tag.name, value: tag.id }));

            setTagOptions(mappedTags);
        } catch {
            setTagOptions([]);
        }
    };

    const fetchAllFloorData = async () => {
        setFloorsList([]);
        setSpacesList([]);
        setSpaceFetching(true);

        const params = `?building_id=${bldgId}`;

        try {
            const res = await getAllFloorsList(params);

            const response = res?.data;
            if (response?.success) {
                if (response?.data.length !== 0) setFloorsList(sortedLayoutData(response?.data));
            } else {
                notifyUser(Notification.Types.success, 'Failed to fetch Floors.');
            }
        } catch (error) {
            setFloorsList([]);
            setSpacesList([]);
            notifyUser(Notification.Types.success, 'Failed to fetch Floors.');
        }
    };

    const fetchSpaceTypes = async () => {
        setSpaceTypes([]);
        setSpaceFetching(true);

        const params = `?ordered_by=name&sort_by=ace`;

        try {
            await getAllSpaceTypes(params).then((res) => {
                const response = res?.data;

                if (response?.success) {
                    if (response?.data.length !== 0) {
                        const mappedSpaceTypes = response?.data.map((el) => {
                            return {
                                label: el?.name,
                                value: el?.id,
                            };
                        });

                        setSpaceTypes(mappedSpaceTypes);
                    }
                }
            });
        } catch {
            setSpaceTypes([]);
        }
    };

    const fetchAllSpaceData = async () => {
        setSpacesList([]);
        setSpaceFetching(true);

        const params = `?floor_id=${selectedFloorId}&building_id=${bldgId}`;

        try {
            const res = await getAllSpacesList(params);
            const response = res?.data;

            if (response?.success) {
                const spaces = response?.data;

                if (Array.isArray(spaces) && spaces.length === 0)
                    throw new Error('zero elements in response.data array');

                const sortedList = sortedLayoutData(response.data);
                const mappedSpaceList = mapSpacesList(sortedList);

                setSpacesList(mappedSpaceList);

                const spaceObjFound = spaces.find((space) => space._id === spaceId);

                if (Array.isArray(spaceObjFound?.tags) && spaceObjFound.tags.length > 0)
                    spaceObjFound.tags = extractTags(spaceObjFound);

                setSpaceObj(spaceObjFound);
            } else {
                setSpacesList([]);
                notifyUser(Notification.Types.error, 'Failed to fetch Spaces.');
            }
        } catch (error) {
            setSpacesList([]);
            notifyUser(Notification.Types.error, 'Failed to fetch Spaces.');
        }

        setSpaceFetching(false);
    };

    useEffect(() => {
        if (!spaceId || !bldgId) return;

        fetchSpaceTypes();
        fetchAllFloorData();
        fetchAllTags();
    }, [spaceId, bldgId]);

    useEffect(() => {
        if (!selectedFloorId) return;

        fetchAllSpaceData();
    }, [selectedFloorId]);

    const extractTags = (spaceObj) => spaceObj.tags.map((tag) => ({ label: tag.name, value: tag._id }));

    const handleChange = (key, value) => {
        let obj = Object.assign({}, spaceObj);
        obj[key] = value;
        setSpaceObj(obj);
    };

    const getCurrentParent = () => {
        if (spaceObjParent) return;

        if (spaceObj?.parent_space) {
            const parent = spacesList.find((space) => space._id === spaceObj.parent_space);
            setSpaceObjParent(parent);
        } else if (spaceObj?.parents) {
            const parent = floorsList.find((space) => space.floor_id === spaceObj.parents);
            setSpaceObjParent(parent);
        }
    };

    const createNewOldStack = (spaces, floors, currSpace) => {
        const newStack = [currSpace];

        const stackToSelectedSpaceObj = (currSpace) => {
            if (currSpace?.parent_space) {
                const nextParentSpace = spaces.find((space) => space?._id === currSpace?.parent_space);
                newStack.push(nextParentSpace);
                return stackToSelectedSpaceObj(nextParentSpace);
            } else if (currSpace?.parents) {
                const nextParentSpace = floors.find((floor) => floor?.floor_id === currSpace?.parents);
                newStack.push(nextParentSpace);
                return stackToSelectedSpaceObj(nextParentSpace);
            }
        };

        if (spaces && Object.values(spaces).length > 0 && currSpace) {
            stackToSelectedSpaceObj(currSpace);
            newStack.reverse();
            setOldStack(newStack);
        }
    };

    useEffect(() => {
        if (
            !spaceId ||
            !spacesList.length > 0 ||
            !floorsList > 0 ||
            (spaceObj && !Object.keys(spaceObj).length > 0) ||
            !selectedFloorId
        )
            return;

        getCurrentParent();
        createNewOldStack(spacesList, floorsList, spaceObj);
    }, [spaceId, spacesList, floorsList, spaceObj, selectedFloorId]);

    return (
        <>
            <Brick sizeInRem={1.25} />

            {spaceFetching ? (
                <Skeleton count={1} style={{ minHeight: '20px' }} />
            ) : (
                <Typography.Header size={Typography.Sizes.md} Type={Typography.Types.Regular}>
                    Space Details
                </Typography.Header>
            )}

            <Brick sizeInRem={1.25} />

            <Row>
                <Col xl={8}>
                    <div className="d-flex justify-content-between">
                        <div className="w-100">
                            <Typography.Body size={Typography.Sizes.md}>Space Name</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            {spaceFetching ? (
                                <Skeleton count={1} style={{ minHeight: '30px' }} />
                            ) : (
                                <InputTooltip
                                    placeholder="Enter Name"
                                    labelSize={Typography.Sizes.md}
                                    error={errorObj.name}
                                    value={spaceObj?.name ?? ''}
                                    onChange={(e) => {
                                        handleChange('name', e.target.value);
                                    }}
                                />
                            )}
                        </div>

                        <div className="w-100 ml-3">
                            <Typography.Body size={Typography.Sizes.md}>Space Type</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            {spaceFetching ? (
                                <Skeleton count={1} style={{ minHeight: '30px' }} />
                            ) : (
                                <Select
                                    name="select"
                                    placeholder="Select Type"
                                    options={spaceTypes}
                                    error={errorObj.type_id}
                                    currentValue={spaceTypes.filter((option) => option.value === spaceObj?.type_id)}
                                    isSearchable={true}
                                    onChange={(e) => {
                                        handleChange('type_id', e.value);
                                    }}
                                    customSearchCallback={({ data, query }) =>
                                        defaultDropdownSearch(data, query?.value)
                                    }
                                    menuPlacement="bottom"
                                />
                            )}
                        </div>
                    </div>

                    <Brick sizeInRem={1.25} />

                    <div className="d-flex justify-content-between">
                        <div className="w-100">
                            <Typography.Body size={Typography.Sizes.md}>{`Square ${
                                userPrefUnits === 'si' ? 'Meter' : 'Footage'
                            }`}</Typography.Body>
                            <Brick sizeInRem={0.25} />
                            {spaceFetching ? (
                                <Skeleton count={1} style={{ minHeight: '30px' }} />
                            ) : (
                                <InputTooltip
                                    placeholder={`Enter Square ${userPrefUnits === 'si' ? 'Meter' : 'Footage'}`}
                                    labelSize={Typography.Sizes.md}
                                    error={errorObj?.square_footage}
                                    value={spaceObj?.square_footage}
                                    onChange={(e) => {
                                        handleChange('square_footage', e.target.value);
                                    }}
                                    type="number"
                                />
                            )}
                        </div>

                        <div className="w-100 ml-3">
                            <div>
                                <Typography.Body size={Typography.Sizes.md}>{`Tags`}</Typography.Body>
                                <Brick sizeInRem={0.25} />
                                {spaceFetching ? (
                                    <Skeleton count={1} style={{ minHeight: '30px' }} />
                                ) : (
                                    <MultiSelect
                                        className="multi-select-tags"
                                        options={tagOptions}
                                        value={spaceObj?.tags ?? []}
                                        onChange={(tag) => {
                                            handleChange('tags', tag);
                                        }}
                                        isCreatable
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </Col>

                <Col xl={4}>
                    <Brick sizeInRem={1.25} />
                    <div className="w-100 box-parent">
                        <div className="box-parent-header">
                            <Typography.Header size={Typography.Sizes.sm}>Parent</Typography.Header>
                        </div>

                        {spaceFetching ? (
                            <Skeleton count={1} style={{ minHeight: '50px' }} />
                        ) : (
                            <div className="box-parent-input">
                                <InputTooltip
                                    labelSize={Typography.Sizes.md}
                                    value={(spaceObjParent && spaceObjParent.name) || ''}
                                    disabled={true}
                                    className="w-100"
                                />
                                <Button
                                    label={'Move'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    onClick={() => {
                                        openModal();
                                    }}
                                    className="ml-2"
                                />
                            </div>
                        )}
                    </div>
                    <MoveSpaceLayout
                        allParentSpaces={allParentSpaces}
                        sortedLayoutData={sortedLayoutData}
                        isModalOpen={modal}
                        openModal={openModal}
                        closeModal={closeModal}
                        bldgId={bldgId}
                        notifyUser={notifyUser}
                        spaceObj={spaceObj}
                        setSpaceObj={setSpaceObj}
                        floorsList={floorsList}
                        oldStack={oldStack}
                        newStack={newStack}
                        setNewStack={setNewStack}
                        spaceObjParent={spaceObjParent}
                        setSpaceObjParent={setSpaceObjParent}
                    />
                </Col>
            </Row>
        </>
    );
};

export default ConfigurationTab;
