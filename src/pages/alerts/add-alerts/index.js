import React, { useState, useEffect } from 'react';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';
import { useHistory } from 'react-router-dom';

import Typography from '../../../sharedComponents/typography';
import { Button } from '../../../sharedComponents/button';
import Brick from '../../../sharedComponents/brick';
import Select from '../../../sharedComponents/form/select';
import Inputs from '../../../sharedComponents/form/input/Input';

import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';

import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import { ReactComponent as BanSVG } from '../../../assets/icon/ban.svg';
import { ReactComponent as UserProfileSVG } from '../../../assets/icon/user-profile.svg';
import { ReactComponent as BuildingTypeSVG } from '../../../sharedComponents/assets/icons/building-type.svg';
import { ReactComponent as EquipmentTypeSVG } from '../../../sharedComponents/assets/icons/equipment-icon.svg';
import { ReactComponent as EmailAddressSVG } from '../../../sharedComponents/assets/icons/email-address-icon.svg';

import { fetchBuildingsList } from '../../../services/buildings';
import { getAllBuildingTypes } from '../../settings/general-settings/services';

import { alertConditions, conditionLevelsList, defaultAlertObj } from './constants';

import colorPalette from '../../../assets/scss/_colors.scss';
import './styles.scss';

const CreateAlertHeader = (props) => {
    const { activeTab, setActiveTab } = props;

    const history = useHistory();

    return (
        <div className="add-alerts-container d-flex flex-column justify-content-between">
            <div className="d-flex justify-content-between">
                <Typography.Header
                    size={Typography.Sizes.lg}
                    style={{ color: colorPalette.primaryGray700 }}
                    className="font-weight-bold">{`Create New Alert`}</Typography.Header>
                <div className="d-flex" style={{ gap: '0.75rem' }}>
                    <Button
                        label={'Cancel'}
                        size={Button.Sizes.md}
                        type={Button.Type.secondaryGrey}
                        onClick={() => {
                            history.push({ pathname: '/alerts/overall' });
                        }}
                    />
                    <Button label={'Next'} size={Button.Sizes.md} type={Button.Type.primary} disabled />
                </div>
            </div>
            <div className="arrow-tabs-container d-flex align-items-center">
                <Typography.Body
                    className={`mouse-pointer ${activeTab === 0 ? `` : `text-muted`}`}
                    size={Typography.Sizes.lg}
                    style={{ color: activeTab === 0 ? colorPalette.baseBlack : colorPalette.primaryGray500 }}
                    onClick={() => setActiveTab(0)}>{`Select Target and Condition`}</Typography.Body>

                <div className="arrow-line-style"></div>

                <Typography.Body
                    className={`mouse-pointer ${activeTab === 1 ? `` : `text-muted`}`}
                    size={Typography.Sizes.lg}
                    style={{ color: activeTab === 1 ? colorPalette.primaryGray900 : colorPalette.primaryGray500 }}
                    onClick={() => setActiveTab(1)}>
                    {`Add Notification Methods`}
                </Typography.Body>
            </div>
        </div>
    );
};

const RemoveAlert = () => {
    return (
        <Row>
            <Col lg={9}>
                <div className="custom-card">
                    <CardHeader>
                        <Typography.Subheader size={Typography.Sizes.md} style={{ color: colorPalette.primaryGray550 }}>
                            {`Danger Zone`}
                        </Typography.Subheader>
                    </CardHeader>

                    <CardBody>
                        <Button
                            label="Remove Alert"
                            size={Button.Sizes.md}
                            type={Button.Type.primaryDistructive}
                            icon={<DeleteSVG />}
                            onClick={() => {
                                alert('Alert removed.');
                            }}
                        />
                    </CardBody>
                </div>
            </Col>
        </Row>
    );
};

const ConfigureAlerts = (props) => {
    const { alertObj = {}, handleChange, handleConditionChange, updateAlertWithBuildingData } = props;

    console.log('SSR alertObj => ', alertObj);

    const [targetType, setTargetType] = useState('');

    const [buildingsList, setBuildingsList] = useState([]);
    const [buildingTypeList, setBuildingTypeList] = useState([]);

    const [equipmentsList, setEquipmentsList] = useState([]);
    const [equipmentTypeList, setEquipmentTypeList] = useState([]);

    useEffect(() => {
        if (targetType === 'building') {
            const promiseOne = getAllBuildingTypes();
            const promiseTwo = fetchBuildingsList(false);

            Promise.all([promiseOne, promiseTwo])
                .then((res) => {
                    const response = res;

                    if (response && response[0]?.status === 200 && response[1]?.status === 200) {
                        const buildingTypesResponse = response[0]?.data?.data?.data;
                        const buildingsListResponse = response[1]?.data;

                        if (buildingTypesResponse && buildingsListResponse) {
                            const newMappedBuildingTypesData = buildingTypesResponse.map((el) => ({
                                label: el?.building_type,
                                value: el?.building_type_id,
                            }));
                            setBuildingTypeList(newMappedBuildingTypesData);

                            const newMappedBldgsData = buildingsListResponse.map((el) => ({
                                label: el?.building_name,
                                value: el?.building_id,
                                building_type_id: el?.building_type_id,
                            }));
                            setBuildingsList(newMappedBldgsData);

                            updateAlertWithBuildingData(newMappedBuildingTypesData, newMappedBldgsData);
                        }
                    }
                })
                .catch(() => {});
        }
    }, [targetType]);

    return (
        <>
            <Row>
                <Col lg={9}>
                    <div className="custom-card">
                        <CardHeader>
                            <Typography.Subheader
                                size={Typography.Sizes.md}
                                style={{ color: colorPalette.primaryGray550 }}>
                                {`Target`}
                            </Typography.Subheader>
                        </CardHeader>
                        <CardBody>
                            <div>
                                <Typography.Subheader size={Typography.Sizes.md}>
                                    {`Select a Target Type`}
                                </Typography.Subheader>

                                <Brick sizeInRem={1.25} />

                                <div className="d-flex" style={{ gap: '0.75rem' }}>
                                    <div
                                        className={`d-flex align-items-center mouse-pointer ${
                                            alertObj?.alertType === 'building'
                                                ? `target-type-container-active`
                                                : `target-type-container`
                                        }`}
                                        onClick={() => {
                                            setTargetType('building');
                                            handleChange('alertType', 'building');
                                        }}>
                                        <BuildingTypeSVG className="p-0 square" width={20} height={20} />
                                        <Typography.Subheader
                                            size={Typography.Sizes.md}
                                            style={{ color: colorPalette.primaryGray700 }}>
                                            {`Building`}
                                        </Typography.Subheader>
                                    </div>

                                    <div
                                        className={`d-flex align-items-center mouse-pointer ${
                                            alertObj?.alertType === 'equipment'
                                                ? `target-type-container-active`
                                                : `target-type-container`
                                        }`}
                                        onClick={() => {
                                            setTargetType('equipment');
                                            handleChange('alertType', 'equipment');
                                        }}>
                                        <EquipmentTypeSVG className="p-0 square" width={20} height={20} />
                                        <Typography.Subheader
                                            size={Typography.Sizes.md}
                                            style={{ color: colorPalette.primaryGray700 }}>
                                            {`Equipment`}
                                        </Typography.Subheader>
                                    </div>
                                </div>
                            </div>

                            {alertObj?.alertType && <hr />}

                            {alertObj?.alertType === 'building' && (
                                <div>
                                    <Typography.Subheader size={Typography.Sizes.md}>
                                        {`Select a Target`}
                                    </Typography.Subheader>

                                    <Brick sizeInRem={1.25} />

                                    <div className="d-flex justify-content-between w-100" style={{ gap: '1.25rem' }}>
                                        <div className="d-flex w-75" style={{ gap: '0.75rem' }}>
                                            <Select.Multi
                                                id="endUseSelect"
                                                placeholder="Select Building Type"
                                                name="select"
                                                className="w-100"
                                                isSearchable={true}
                                                options={buildingTypeList}
                                                onChange={(selectedBldgTypeList) => {
                                                    handleChange('typesList', selectedBldgTypeList);
                                                }}
                                                value={alertObj?.typesList ?? []}
                                            />

                                            <Select.Multi
                                                id="endUseSelect"
                                                placeholder="Select Building"
                                                name="select"
                                                className="w-100"
                                                isSearchable={true}
                                                options={buildingsList}
                                                onChange={(selectedBldgTypeList) => {
                                                    handleChange('lists', selectedBldgTypeList);
                                                }}
                                                value={alertObj?.lists ?? []}
                                            />
                                        </div>

                                        <div className="d-flex" style={{ gap: '0.75rem' }}>
                                            <Button
                                                label={'Cancel'}
                                                size={Button.Sizes.md}
                                                type={Button.Type.secondaryGrey}
                                                className="w-100"
                                            />
                                            <Button
                                                label={'Add target'}
                                                size={Button.Sizes.md}
                                                type={Button.Type.primary}
                                                className="w-100"
                                                disabled={alertObj?.lists && alertObj?.lists.length === 0}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {alertObj?.alertType === 'equipment' && (
                                <div>
                                    <Typography.Subheader size={Typography.Sizes.md}>
                                        {`Select a Target`}
                                    </Typography.Subheader>

                                    <Brick sizeInRem={1.25} />

                                    <Select
                                        id="endUseSelect"
                                        placeholder="Select Building"
                                        name="select"
                                        isSearchable={true}
                                        options={[]}
                                        className="w-25"
                                    />

                                    <Brick sizeInRem={1.25} />

                                    <div className="d-flex justify-content-between w-100" style={{ gap: '1.25rem' }}>
                                        <div className="d-flex w-75" style={{ gap: '0.75rem' }}>
                                            <Select
                                                id="endUseSelect"
                                                placeholder="Select Equipment Type"
                                                name="select"
                                                isSearchable={true}
                                                options={[]}
                                                className="w-100"
                                            />

                                            <Select
                                                id="endUseSelect"
                                                placeholder="Select Equipment"
                                                name="select"
                                                isSearchable={true}
                                                options={[]}
                                                className="w-100"
                                            />
                                        </div>

                                        <div className="d-flex" style={{ gap: '0.75rem' }}>
                                            <Button
                                                label={'Cancel'}
                                                size={Button.Sizes.md}
                                                type={Button.Type.secondaryGrey}
                                                className="w-100"
                                            />
                                            <Button
                                                label={'Add target'}
                                                size={Button.Sizes.md}
                                                type={Button.Type.primary}
                                                className="w-100"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardBody>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={9}>
                    <div className="custom-card">
                        <CardHeader>
                            <Typography.Subheader
                                size={Typography.Sizes.md}
                                style={{ color: colorPalette.primaryGray550 }}>
                                {`Condition`}
                            </Typography.Subheader>
                        </CardHeader>
                        <CardBody>
                            <div>
                                <Typography.Subheader size={Typography.Sizes.md}>
                                    {`Select a Condition`}
                                </Typography.Subheader>

                                <Brick sizeInRem={1.25} />

                                <div className="d-flex w-100 align-items-center" style={{ gap: '0.75rem' }}>
                                    <div style={{ width: '35%' }}>
                                        <Select
                                            id="endUseSelect"
                                            placeholder="Select a Condition"
                                            name="select"
                                            options={alertObj?.alertType === '' ? [] : alertConditions}
                                            className="w-100"
                                            onChange={(e) => {
                                                handleConditionChange('type', e.value);
                                            }}
                                            currentValue={alertConditions.filter(
                                                (option) => option.value === alertObj?.conditions?.type
                                            )}
                                        />
                                    </div>
                                    {alertObj?.alertType !== '' && (
                                        <>
                                            <div style={{ width: '15%' }}>
                                                <Select
                                                    id="condition_lvl"
                                                    name="select"
                                                    options={conditionLevelsList}
                                                    className="w-100"
                                                    onChange={(e) => {
                                                        handleConditionChange('level', e.value);
                                                    }}
                                                    currentValue={conditionLevelsList.filter(
                                                        (option) => option.value === alertObj?.conditions?.level
                                                    )}
                                                />
                                            </div>
                                            <Inputs
                                                type="number"
                                                className="custom-input-width"
                                                inputClassName="custom-input-field"
                                                value={alertObj?.conditions?.target_value}
                                                onChange={(e) => {
                                                    handleConditionChange('target_value', e.target.value);
                                                }}
                                            />
                                            <span>{`kWh`}</span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <RemoveAlert />
        </>
    );
};

const NotificationSettings = (props) => {
    const { notifyType, setNotifyType } = props;

    return (
        <>
            <Row>
                <Col lg={9}>
                    <div className="custom-card">
                        <CardHeader>
                            <Typography.Subheader
                                size={Typography.Sizes.md}
                                style={{ color: colorPalette.primaryGray550 }}>
                                {`Alert Preview`}
                            </Typography.Subheader>
                        </CardHeader>
                        <CardBody>
                            <div>
                                <Typography.Subheader size={Typography.Sizes.md}>{`Target Type`}</Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <Typography.Body
                                    size={Typography.Sizes.md}
                                    className="text-muted">{`Building`}</Typography.Body>
                            </div>

                            <Brick sizeInRem={1} />

                            <div>
                                <Typography.Subheader size={Typography.Sizes.md}>{`Target`}</Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <Typography.Body
                                    size={Typography.Sizes.md}
                                    className="text-muted">{`123 Main St. Portland, OR`}</Typography.Body>
                            </div>

                            <Brick sizeInRem={1} />

                            <div>
                                <Typography.Subheader size={Typography.Sizes.md}>{`Condition`}</Typography.Subheader>
                                <Brick sizeInRem={0.25} />
                                <Typography.Body
                                    size={Typography.Sizes.md}
                                    className="text-muted">{`Energy consumption for the month is above 75% of 10,000 kWh `}</Typography.Body>
                            </div>
                        </CardBody>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={9}>
                    <Typography.Header
                        size={Typography.Sizes.xs}>{`Add Notification Method (optional)`}</Typography.Header>
                    <Brick sizeInRem={0.25} />
                    <Typography.Body
                        size={
                            Typography.Sizes.md
                        }>{`These are all notification methods available given your selected target and condition.`}</Typography.Body>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={9}>
                    <div className="custom-card">
                        <CardHeader>
                            <Typography.Subheader
                                size={Typography.Sizes.md}
                                style={{ color: colorPalette.primaryGray550 }}>
                                {`Notification Method (optional)`}
                            </Typography.Subheader>
                        </CardHeader>
                        <CardBody>
                            <div className="d-flex align-items-center" style={{ gap: '0.75rem' }}>
                                <div
                                    className={`d-flex align-items-center mouse-pointer ${
                                        notifyType === 'none' ? `notify-container-active` : `notify-container`
                                    }`}
                                    onClick={() => setNotifyType('none')}>
                                    <BanSVG className="p-0 square" width={20} height={20} />
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        style={{ color: colorPalette.primaryGray700 }}>
                                        {`None`}
                                    </Typography.Subheader>
                                </div>

                                <div
                                    className={`d-flex align-items-center mouse-pointer ${
                                        notifyType === 'user' ? `notify-container-active` : `notify-container`
                                    }`}
                                    onClick={() => setNotifyType('user')}>
                                    <UserProfileSVG className="p-0 square" width={18} height={18} />
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        style={{ color: colorPalette.primaryGray700 }}>
                                        {`User`}
                                    </Typography.Subheader>
                                </div>

                                <div
                                    className={`d-flex align-items-center mouse-pointer ${
                                        notifyType === 'email' ? `notify-container-active` : `notify-container`
                                    }`}
                                    onClick={() => setNotifyType('email')}>
                                    <EmailAddressSVG className="p-0 square" width={20} height={20} />
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        style={{ color: colorPalette.primaryGray700 }}>
                                        {`Email Address`}
                                    </Typography.Subheader>
                                </div>
                            </div>
                        </CardBody>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <RemoveAlert />
        </>
    );
};

const AddAlerts = () => {
    const [activeTab, setActiveTab] = useState(0);
    const [notifyType, setNotifyType] = useState('none');
    const [alertObj, setAlertObj] = useState(defaultAlertObj);

    console.log('SSR alertObj => ', alertObj);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, alertObj);
        obj[key] = value;
        setAlertObj(obj);
    };

    const handleConditionChange = (key, value) => {
        let obj = Object.assign({}, alertObj);
        obj.conditions[key] = value;
        setAlertObj(obj);
    };

    const updateAlertWithBuildingData = (bldg_type_list, bldgs_list) => {
        let obj = Object.assign({}, alertObj);
        obj.typesList = bldg_type_list ?? [];
        obj.lists = bldgs_list ?? [];
        setAlertObj(obj);
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'Alerts',
                    path: '/alerts/overall',
                    active: false,
                },
                {
                    label: 'Create Alert',
                    path: '/alerts/overall/add-alert',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'alerts';
        });
    };

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <CreateAlertHeader activeTab={activeTab} setActiveTab={setActiveTab} />
                </Col>
            </Row>

            <div className="custom-padding">
                {activeTab === 0 && (
                    <ConfigureAlerts
                        alertObj={alertObj}
                        handleChange={handleChange}
                        handleConditionChange={handleConditionChange}
                        updateAlertWithBuildingData={updateAlertWithBuildingData}
                    />
                )}
                {activeTab === 1 && <NotificationSettings notifyType={notifyType} setNotifyType={setNotifyType} />}
            </div>
        </React.Fragment>
    );
};

export default AddAlerts;
