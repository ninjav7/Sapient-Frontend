import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import Switch from 'react-switch';
import { useParams } from 'react-router-dom';
import TimezoneSelect from 'react-timezone-select';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';

import { userPermissionData, buildingData } from '../../../store/globalState';
import { UserStore } from '../../../store/UserStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { BuildingListStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { updateBuildingStore } from '../../../helpers/updateBuildingStore';

import Brick from '../../../sharedComponents/brick';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import Inputs from '../../../sharedComponents/form/input/Input';
import Select from '../../../sharedComponents/form/select';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import OperatingHours from './OperatingHours';

import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';

import { updateGeneralBuildingChange, getAllBuildingTypes } from './services';
import { convertToFootage, convertToMeters, handleUnitConverstion } from './utils';

import colorPalette from '../../../assets/scss/_colors.scss';
import '../../../sharedComponents/form/select/style.scss';
import '../style.css';
import './styles.scss';

const GeneralBuildingSettings = () => {
    const { bldgId } = useParams();

    const [buildingListData] = useAtom(buildingData);
    const [userPermission] = useAtom(userPermissionData);

    const isUserAdmin = userPermission?.is_admin ?? false;
    const canUserEdit = userPermission?.permissions?.permissions?.account_buildings_permission?.edit ?? false;
    const canUserDelete = userPermission?.permissions?.permissions?.account_buildings_permission?.delete ?? false;

    const userPrefUnits = UserStore.useState((s) => s.unit);
    const userPrefTimeZone = UserStore.useState((s) => s.timeFormat);

    const [bldgData, setBldgData] = useState({});
    const [buildingTypes, setBuildingTypes] = useState([]);

    const [buildingOperatingHours, setBuildingOperatingHours] = useState({});

    const [render, setRender] = useState(false);
    const [weekToggle, setWeekToggle] = useState({});
    const [inputField, setInputField] = useState({
        kWh: 0,
        total_paid: 0,
    });

    const [timeZone, setTimeZone] = useState('12');
    const [isProcessing, setProcessing] = useState(false);
    const [switchPhrase, setSwitchPhrace] = useState({
        mon: false,
        tue: false,
        wed: false,
        thu: false,
        fri: false,
        sat: false,
        sun: false,
    });

    const [timeValue, setTimeValue] = useState({
        monFrom: '',
        monTo: '',
        tueFrom: '',
        tueTo: '',
        wedFrom: '',
        wedTo: '',
        thuFrom: '',
        thuTo: '',
        friFrom: '',
        friTo: '',
        satFrom: '',
        satTo: '',
        sunFrom: '',
        sunTo: '',
    });

    const operationTime = {
        operating_hours: {
            mon: {
                stat: switchPhrase?.mon,
                time_range: {
                    frm: timeValue?.monFrom,
                    to: timeValue?.monTo,
                },
            },
            tue: {
                stat: switchPhrase?.tue,
                time_range: {
                    frm: timeValue?.tueFrom,
                    to: timeValue?.tueTo,
                },
            },
            wed: {
                stat: switchPhrase?.wed,
                time_range: {
                    frm: timeValue?.wedFrom,
                    to: timeValue?.wedTo,
                },
            },
            thu: {
                stat: switchPhrase?.thu,
                time_range: {
                    frm: timeValue?.thuFrom,

                    to: timeValue?.thuTo,
                },
            },

            fri: {
                stat: switchPhrase?.fri,

                time_range: {
                    frm: timeValue?.friFrom,

                    to: timeValue?.friTo,
                },
            },

            sat: {
                stat: switchPhrase?.sat,

                time_range: {
                    frm: timeValue?.satFrom,

                    to: timeValue?.satTo,
                },
            },

            sun: {
                stat: switchPhrase?.sun,

                time_range: {
                    frm: timeValue?.sunFrom,

                    to: timeValue?.sunTo,
                },
            },
        },
    };

    const handleTotalAreaOfBldg = (building_size) => {
        return building_size === 0 ? 0 : handleUnitConverstion(building_size, userPrefUnits);
    };

    const handleChange = (key, value) => {
        let obj = Object.assign({}, bldgData);
        obj[key] = value;
        setBldgData(obj);
    };

    const fetchBuildingType = async () => {
        await getAllBuildingTypes()
            .then((res) => {
                const response = res?.data;
                if (response?.success) {
                    const responseData = response?.data?.data;
                    if (responseData.length !== 0) {
                        const newMappedData = responseData.map((el) => ({
                            label: el?.building_type,
                            value: el?.building_type_id,
                        }));
                        setBuildingTypes(newMappedData);
                    }
                }
            })
            .catch((error) => {});
    };

    const fetchBuildingData = async () => {
        if (!bldgId || !buildingListData || buildingListData.length === 0) return;

        const selectedBldgObj = buildingListData.find((el) => el.building_id === bldgId);

        if (selectedBldgObj?.building_id) {
            // General Building Operations
            const bldgObj = Object.assign({}, selectedBldgObj);

            // Handle Building area convertion based on User Preference
            bldgObj.square_footage = handleTotalAreaOfBldg(bldgObj?.building_size);
            bldgObj.name = bldgObj?.building_name;

            setBldgData(bldgObj);

            // Operating Hour Operations
            const buildingOperatingHours = { operating_hours: selectedBldgObj?.operating_hours };
            setBuildingOperatingHours(buildingOperatingHours);

            const { mon, tue, wed, thu, fri, sat, sun } = selectedBldgObj?.operating_hours;
            setWeekToggle({
                mon: mon['stat'],
                tue: tue['stat'],
                wed: wed['stat'],
                thu: thu['stat'],
                fri: fri['stat'],
                sat: sat['stat'],
                sun: sun['stat'],
            });
        }
    };

    const onBuildingDetailsSave = async (bld_id, bldg_data) => {
        setProcessing(true);

        const params = `/${bld_id}`;

        let payload = {
            info: {
                name: bldg_data?.name,
                building_type_id: bldg_data?.building_type_id,
                plug_only: bldg_data?.plug_only,
                square_footage: bldg_data?.square_footage,
                timezone: bldg_data?.timezone,
                active: bldg_data?.active,
            },
            address: {
                street_address: bldg_data?.street_address,
                address_2: bldg_data?.address_2,
                city: bldg_data?.city,
                state: bldg_data?.state,
                zip_code: bldg_data?.zip_code,
                latitude: bldg_data?.latitude,
                longitude: bldg_data?.longitude,
            },
            operating_hours: operationTime.operating_hours,
        };

        // Handle Square Footage / Meter change with converstion check and fix
        if (payload?.info?.square_footage === '') payload.info.square_footage = 0;

        if (userPrefUnits === 'si' && payload?.info?.square_footage !== '') {
            payload.info.square_footage = Number(convertToFootage(payload?.info?.square_footage));
        } else {
            payload.info.square_footage = Number(payload.info.square_footage);
        }

        await updateGeneralBuildingChange(params, payload)
            .then((res) => {
                const response = res?.data;
                console.log('SSR response => ', response);
                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message;
                        s.notificationType = 'success';
                    });
                    BuildingListStore.update((s) => {
                        s.fetchBuildingList = true;
                    });
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Unable to update Building Details.';
                        s.notificationType = 'error';
                    });
                }
            })
            .catch((error) => {
                const response = error?.response;
                UserStore.update((s) => {
                    s.showNotification = true;
                    s.notificationMessage = 'Unable to update Building Details.';
                    s.notificationType = 'error';
                });
            })
            .finally(() => {
                setProcessing(false);
            });
    };

    const operatingHoursChangeHandler = (date, day, type1, type2) => {
        const data = {
            [day]: {
                time_range: {
                    [type1]: date?.value,
                },
            },
        };
    };

    const handleTimeValueChange = (date, key) => {
        setTimeValue({
            ...timeValue,
            [key]: date?.value,
        });
    };

    const checkDateTimeHandler = (day, value) => {
        setWeekToggle({
            ...weekToggle,

            [day]: value,
        });

        const data = {
            [day]: {
                stat: value,
            },
        };
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            const newList = [
                {
                    label: 'General',
                    path: `/settings/general/${bldgId}`,
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'building-settings';
        });
    };

    useEffect(() => {
        setSwitchPhrace({
            mon: weekToggle?.mon,
            tue: weekToggle?.tue,
            wed: weekToggle?.wed,
            thu: weekToggle?.thu,
            fri: weekToggle?.fri,
            sat: weekToggle?.sat,
            sun: weekToggle?.sun,
        });
    }, [weekToggle]);

    useEffect(() => {
        if (!userPrefTimeZone) return;
        const time_zone = userPrefTimeZone.split('h')[0];
        setTimeZone(time_zone);
    }, [userPrefTimeZone]);

    useEffect(() => {
        if (!bldgData?.square_footage || !userPrefUnits) return;

        let squareFootage;
        if (userPrefUnits === 'si') squareFootage = convertToMeters(bldgData?.square_footage);
        if (userPrefUnits === 'imp') squareFootage = convertToFootage(bldgData?.square_footage);
        handleChange('square_footage', squareFootage);
    }, [userPrefUnits]);

    useEffect(() => {
        fetchBuildingType();
    }, [bldgId]);

    useEffect(() => {
        setTimeValue({
            monFrom: buildingOperatingHours?.operating_hours?.mon?.time_range?.frm,
            monTo: buildingOperatingHours?.operating_hours?.mon?.time_range?.to,
            tueFrom: buildingOperatingHours?.operating_hours?.tue?.time_range?.frm,
            tueTo: buildingOperatingHours?.operating_hours?.tue?.time_range?.to,
            wedFrom: buildingOperatingHours?.operating_hours?.wed?.time_range?.frm,
            wedTo: buildingOperatingHours?.operating_hours?.wed?.time_range?.to,
            thuFrom: buildingOperatingHours?.operating_hours?.thu?.time_range?.frm,
            thuTo: buildingOperatingHours?.operating_hours?.thu?.time_range?.to,
            friFrom: buildingOperatingHours?.operating_hours?.fri?.time_range?.frm,
            friTo: buildingOperatingHours?.operating_hours?.fri?.time_range?.to,
            satFrom: buildingOperatingHours?.operating_hours?.sat?.time_range?.frm,
            satTo: buildingOperatingHours?.operating_hours?.sat?.time_range?.to,
            sunFrom: buildingOperatingHours?.operating_hours?.sun?.time_range?.frm,
            sunTo: buildingOperatingHours?.operating_hours?.sun?.time_range?.to,
        });
    }, [buildingOperatingHours]);

    useEffect(() => {
        fetchBuildingData();
    }, [bldgId, buildingListData]);

    useEffect(() => {
        let fixing = true;

        const fetchBuildingData = async () => {
            if (fixing) {
                let data = {};
                if (bldgId) {
                    data = buildingListData.find((el) => el.building_id === bldgId);
                    if (data === undefined) {
                        return (fixing = false);
                    }
                    setInputField({
                        ...inputField,
                        active: data.active,
                        name: data.building_name,
                        square_footage: data.building_size,
                        building_type: data.building_type,
                        street_address: data.street_address,
                        address_2: data.address_2,
                        city: data.city,
                        state: data.state,
                        zip_code: data.zip_code,
                        timezone: data.timezone,
                        time_format: data.time_format,
                        operating_hours: data.operating_hours,
                    });
                    const { mon, tue, wed, thu, fri, sat, sun } = data?.operating_hours;

                    setWeekToggle({
                        mon: mon['stat'],
                        tue: tue['stat'],
                        wed: wed['stat'],
                        thu: thu['stat'],
                        fri: fri['stat'],
                        sat: sat['stat'],
                        sun: sun['stat'],
                    });
                }
            }
        };

        fetchBuildingData();
    }, [render]);

    useEffect(() => {
        if (bldgId && buildingListData.length !== 0) {
            const bldgObj = buildingListData.find((el) => el?.building_id === bldgId);
            if (bldgObj?.building_id)
                updateBuildingStore(
                    bldgObj?.building_id,
                    bldgObj?.building_name,
                    bldgObj?.timezone,
                    bldgObj?.plug_only
                );
        }
    }, [buildingListData, bldgId]);

    useEffect(() => {
        window.scrollTo(0, 0);
        updateBreadcrumbStore();
    }, []);

    // Planned for Future Use
    // const getGooglePlacesAutocomplete = async () => {
    //     let header = {
    //         'Content-Type': 'application/json',
    //         accept: 'application/json',
    //         Authorization: `Bearer ${userdata.token}`,
    //     };

    //     const params = `${textLocation.split(' ').join('+')}`;
    //     let API_KEY = 'AIzaSyDhNduZQBxLrO4xatcuiTUdgVvlVPrfzM4';
    //     await axios
    //         .get(
    //             `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=amoeba&types=establishment&location=37.76999%2C-122.44696&radius=500&key=AIzaSyDhNduZQBxLrO4xatcuiTUdgVvlVPrfzM4`,
    //             {
    //                 headers: header,
    //             }
    //         )
    //         .then((res) => {
    //             // setGetResponseOfPlaces(res?.data);
    //         });
    // };
    // useEffect(() => {
    // getPlacesAutocomplete();
    // getGooglePlacesAutocomplete();
    // }, [textLocation]);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Typography.Header
                                size={Typography.Sizes.lg}>{`General Building Settings`}</Typography.Header>
                        </div>
                        {isUserAdmin || canUserEdit ? (
                            <div>
                                <div className="d-flex">
                                    <Button
                                        label="Cancel"
                                        size={Button.Sizes.md}
                                        type={Button.Type.secondaryGrey}
                                        onClick={fetchBuildingData}
                                    />
                                    <Button
                                        label={isProcessing ? 'Saving' : 'Save'}
                                        size={Button.Sizes.md}
                                        type={Button.Type.primary}
                                        onClick={() => {
                                            onBuildingDetailsSave(bldgId, bldgData);
                                        }}
                                        className="ml-2"
                                        disabled={isProcessing}
                                    />
                                </div>
                            </div>
                        ) : null}
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
                                {`Building Details`}
                            </Typography.Subheader>
                        </CardHeader>

                        <CardBody>
                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>{`Active`}</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        {`Non-admin users can only view active buildings.`}
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Switch
                                        checked={bldgData?.active}
                                        onColor={colorPalette.datavizBlue600}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        onChange={(e) => {
                                            handleChange('active', e);
                                        }}
                                        className="react-switch"
                                        disabled={!isUserAdmin || !canUserEdit}
                                    />
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>
                                        {`Building Name`}
                                    </Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        {`A human-friendly display name for this building`}
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        placeholder={
                                            isUserAdmin || canUserEdit
                                                ? `Enter Building Name`
                                                : `Building Name Not Added`
                                        }
                                        onChange={(e) => {
                                            handleChange('name', e.target.value);
                                        }}
                                        className="w-100"
                                        value={bldgData?.name}
                                        disabled={!isUserAdmin || !canUserEdit}
                                    />
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>{`Type`}</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        {`The primary use/type of this building`}
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    {isUserAdmin || canUserEdit ? (
                                        <Select
                                            id="endUseSelect"
                                            placeholder="Select Building Type"
                                            name="select"
                                            isSearchable={true}
                                            defaultValue={bldgData?.building_type_id}
                                            options={buildingTypes}
                                            onChange={(e) => {
                                                setBldgData((prevBldgObj) => {
                                                    return {
                                                        ...prevBldgObj,
                                                        building_type_id: e?.value,
                                                        building_type: e?.label,
                                                    };
                                                });
                                            }}
                                            className="w-100"
                                        />
                                    ) : (
                                        <Inputs
                                            type="text"
                                            placeholder="Building Type not selected"
                                            className="w-100"
                                            value={bldgData?.building_type}
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>
                                        {userPrefUnits === `si` ? `Square Meters` : `Square Footage`}
                                    </Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        {userPrefUnits === `si`
                                            ? `The total square meters of this building`
                                            : `The total square footage of this building`}
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    {isUserAdmin || canUserEdit ? (
                                        <InputTooltip
                                            type="number"
                                            onChange={(e) => {
                                                handleChange('square_footage', e.target.value);
                                            }}
                                            labelSize={Typography.Sizes.md}
                                            className="w-100"
                                            inputClassName="custom-input-field"
                                            value={Math.round(bldgData?.square_footage)}
                                        />
                                    ) : (
                                        <Inputs
                                            type="text"
                                            placeholder="Building Size Not Added"
                                            className="w-100"
                                            value={Math.round(bldgData?.square_footage)}
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}>{`Plug-only`}</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        {`To view Plug only data of this building`}
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Switch
                                        checked={bldgData?.plug_only}
                                        onColor={colorPalette.datavizBlue600}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        onChange={(e) => {
                                            handleChange('plug_only', e);
                                        }}
                                        className="react-switch"
                                        disabled={!isUserAdmin || !canUserEdit}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={9}>
                    <div className="custom-card card-custom-margin">
                        <CardHeader>
                            <Typography.Subheader
                                size={Typography.Sizes.md}
                                style={{ color: colorPalette.primaryGray550 }}>
                                {`Address`}
                            </Typography.Subheader>
                        </CardHeader>

                        <CardBody>
                            <div className="row">
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        label="Street Address"
                                        placeholder={
                                            isUserAdmin || canUserEdit ? `Enter Address 1` : `Address not added`
                                        }
                                        onChange={(e) => {
                                            handleChange('street_address', e.target.value);
                                        }}
                                        className="w-100"
                                        value={bldgData?.street_address}
                                        disabled={!isUserAdmin || !canUserEdit}
                                    />
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        label="Address 2 (optional)"
                                        placeholder={
                                            isUserAdmin || !canUserEdit
                                                ? `Enter Address 2 (optional)`
                                                : `Address Not Added`
                                        }
                                        onChange={(e) => {
                                            handleChange('address_2', e.target.value);
                                        }}
                                        className="w-100"
                                        value={bldgData?.address_2}
                                        disabled={!isUserAdmin || !canUserEdit}
                                    />
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        label="City"
                                        placeholder={isUserAdmin || !canUserEdit ? `Enter City` : `City is Not Added`}
                                        onChange={(e) => {
                                            handleChange('city', e.target.value);
                                        }}
                                        className="w-100"
                                        value={bldgData?.city}
                                        disabled={!isUserAdmin || !canUserEdit}
                                    />
                                </div>

                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        label="State"
                                        placeholder={isUserAdmin || !canUserEdit ? `Enter State` : `State is Not Added`}
                                        onChange={(e) => {
                                            handleChange('state', e.target.value);
                                        }}
                                        className="w-100"
                                        value={bldgData?.state}
                                        disabled={!isUserAdmin || !canUserEdit}
                                    />
                                </div>

                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="string"
                                        label="Postal Code"
                                        placeholder={
                                            isUserAdmin || !canUserEdit ? `Enter Postal Code` : `Zip is not added.`
                                        }
                                        onChange={(e) => {
                                            handleChange('zip_code', e.target.value);
                                        }}
                                        className="w-100"
                                        value={bldgData?.zip_code}
                                        disabled={!isUserAdmin || !canUserEdit}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            <Row>
                <Col lg={9}>
                    <div className="custom-card card-custom-margin">
                        <CardHeader>
                            <Typography.Subheader
                                size={Typography.Sizes.md}
                                style={{ color: colorPalette.primaryGray550 }}>
                                {`Geo Location`}
                            </Typography.Subheader>
                        </CardHeader>

                        <CardBody>
                            <div className="row">
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        label="Latitude"
                                        placeholder={
                                            isUserAdmin || !canUserEdit ? `Enter Latitude` : `Latitude not set`
                                        }
                                        onChange={(e) => {
                                            handleChange('latitude', e.target.value);
                                        }}
                                        className="w-100"
                                        value={bldgData?.latitude}
                                        disabled={!isUserAdmin || !canUserEdit}
                                    />
                                </div>

                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        label="Longitude"
                                        placeholder={
                                            isUserAdmin || !canUserEdit ? `Enter Longitude` : `Longitude not set`
                                        }
                                        onChange={(e) => {
                                            handleChange('longitude', e.target.value);
                                        }}
                                        className="w-100"
                                        value={bldgData?.longitude}
                                        disabled={!isUserAdmin || !canUserEdit}
                                    />
                                </div>
                            </div>
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
                                {`Date & Time`}
                            </Typography.Subheader>
                        </CardHeader>

                        <CardBody>
                            <div className="row d-flex align-items-center">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>{`TimeZone`}</Typography.Subheader>
                                </div>
                                <div className="col">
                                    <TimezoneSelect
                                        value={bldgData?.timezone ? bldgData?.timezone : ''}
                                        onChange={(e) => {
                                            handleChange('timezone', e.value);
                                        }}
                                        className="react-select-wrapper w-100"
                                        placeholder="Select TimeZone"
                                        isDisabled={!isUserAdmin || !canUserEdit}
                                    />
                                </div>
                            </div>
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
                                {`Operating Hours`}
                            </Typography.Subheader>
                        </CardHeader>

                        <CardBody>
                            <Row>
                                <div className="pl-3">
                                    <>
                                        {/* Monday */}
                                        {isUserAdmin || canUserEdit ? (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['mon']}
                                                onSwitchToggle={(e) => {
                                                    checkDateTimeHandler('mon', e);
                                                    setSwitchPhrace({ ...switchPhrase, mon: e });
                                                }}
                                                weekDay={'Mon'}
                                                onStartTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'mon', 'frm', 'to');
                                                    handleTimeValueChange(date, 'monFrom');
                                                }}
                                                startTime={timeValue?.monFrom}
                                                onEndTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'mon', 'to', 'frm');
                                                    handleTimeValueChange(date, 'monTo');
                                                }}
                                                endTime={timeValue?.monTo}
                                            />
                                        ) : (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['mon']}
                                                onSwitchToggle={(e) => {}}
                                                weekDay={'Mon'}
                                                startTime={timeValue?.monFrom}
                                                endTime={timeValue?.monTo}
                                            />
                                        )}

                                        {/* Tuesday */}
                                        {isUserAdmin || canUserEdit ? (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['tue']}
                                                onSwitchToggle={(e) => {
                                                    checkDateTimeHandler('tue', e);
                                                    setSwitchPhrace({ ...switchPhrase, tue: e });
                                                }}
                                                weekDay={'Tue'}
                                                onStartTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'tue', 'frm', 'to');
                                                    handleTimeValueChange(date, 'tueFrom');
                                                }}
                                                startTime={timeValue?.tueFrom}
                                                onEndTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'tue', 'to', 'frm');
                                                    handleTimeValueChange(date, 'tueTo');
                                                }}
                                                endTime={timeValue?.tueTo}
                                            />
                                        ) : (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['tue']}
                                                onSwitchToggle={(e) => {}}
                                                weekDay={'Tue'}
                                                startTime={timeValue?.tueFrom}
                                                endTime={timeValue?.tueTo}
                                            />
                                        )}

                                        {/* Wednesday */}
                                        {isUserAdmin || canUserEdit ? (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['wed']}
                                                onSwitchToggle={(e) => {
                                                    checkDateTimeHandler('wed', e);
                                                    setSwitchPhrace({ ...switchPhrase, wed: e });
                                                }}
                                                weekDay={'Wed'}
                                                onStartTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'wed', 'frm', 'to');
                                                    handleTimeValueChange(date, 'wedFrom');
                                                }}
                                                startTime={timeValue?.wedFrom}
                                                onEndTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'wed', 'to', 'frm');
                                                    handleTimeValueChange(date, 'wedTo');
                                                }}
                                                endTime={timeValue?.wedTo}
                                            />
                                        ) : (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['wed']}
                                                onSwitchToggle={(e) => {}}
                                                weekDay={'Wed'}
                                                startTime={timeValue?.wedFrom}
                                                endTime={timeValue?.wedTo}
                                            />
                                        )}

                                        {/* Thursday */}
                                        {isUserAdmin || canUserEdit ? (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['thu']}
                                                onSwitchToggle={(e) => {
                                                    checkDateTimeHandler('thu', e);
                                                    setSwitchPhrace({ ...switchPhrase, thu: e });
                                                }}
                                                weekDay={'Thu'}
                                                onStartTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'thu', 'frm', 'to');
                                                    handleTimeValueChange(date, 'thuFrom');
                                                }}
                                                startTime={timeValue?.thuFrom}
                                                onEndTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'thu', 'to', 'frm');
                                                    handleTimeValueChange(date, 'thuTo');
                                                }}
                                                endTime={timeValue?.thuTo}
                                            />
                                        ) : (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['thu']}
                                                onSwitchToggle={(e) => {}}
                                                weekDay={'Thu'}
                                                startTime={timeValue?.thuFrom}
                                                endTime={timeValue?.thuTo}
                                            />
                                        )}

                                        {/* Friday */}
                                        {isUserAdmin || canUserEdit ? (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['fri']}
                                                onSwitchToggle={(e) => {
                                                    checkDateTimeHandler('fri', e);
                                                    setSwitchPhrace({ ...switchPhrase, fri: e });
                                                }}
                                                weekDay={'Fri'}
                                                onStartTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'fri', 'frm', 'to');
                                                    handleTimeValueChange(date, 'friFrom');
                                                }}
                                                startTime={timeValue?.friFrom}
                                                onEndTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'fri', 'to', 'frm');
                                                    handleTimeValueChange(date, 'friTo');
                                                }}
                                                endTime={timeValue?.friTo}
                                            />
                                        ) : (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['fri']}
                                                onSwitchToggle={(e) => {}}
                                                weekDay={'Fri'}
                                                startTime={timeValue?.friFrom}
                                                endTime={timeValue?.friTo}
                                            />
                                        )}

                                        {/* Saturday */}
                                        {isUserAdmin || canUserEdit ? (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['sat']}
                                                onSwitchToggle={(e) => {
                                                    checkDateTimeHandler('sat', e);
                                                    setSwitchPhrace({ ...switchPhrase, sat: e });
                                                }}
                                                weekDay={'Sat'}
                                                onStartTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'sat', 'frm', 'to');
                                                    handleTimeValueChange(date, 'satFrom');
                                                }}
                                                startTime={timeValue?.satFrom}
                                                onEndTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'sat', 'to', 'frm');
                                                    handleTimeValueChange(date, 'satTo');
                                                }}
                                                endTime={timeValue?.satTo}
                                            />
                                        ) : (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['sat']}
                                                onSwitchToggle={(e) => {}}
                                                weekDay={'Sat'}
                                                startTime={timeValue?.satFrom}
                                                endTime={timeValue?.satTo}
                                            />
                                        )}

                                        {/* Sunday */}
                                        {isUserAdmin || canUserEdit ? (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['sun']}
                                                onSwitchToggle={(e) => {
                                                    checkDateTimeHandler('sun', e);
                                                    setSwitchPhrace({ ...switchPhrase, tue: e });
                                                }}
                                                weekDay={'Sun'}
                                                onStartTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'sun', 'frm', 'to');
                                                    handleTimeValueChange(date, 'sunFrom');
                                                }}
                                                startTime={timeValue?.sunFrom}
                                                onEndTimeChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'sun', 'to', 'frm');
                                                    handleTimeValueChange(date, 'sunTo');
                                                }}
                                                endTime={timeValue?.sunTo}
                                            />
                                        ) : (
                                            <OperatingHours
                                                timeZone={timeZone}
                                                isOperating={!weekToggle['sun']}
                                                onSwitchToggle={(e) => {}}
                                                weekDay={'Sun'}
                                                startTime={timeValue?.sunFrom}
                                                endTime={timeValue?.sunTo}
                                            />
                                        )}
                                    </>
                                </div>
                            </Row>
                        </CardBody>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />

            {isUserAdmin || canUserDelete ? (
                <Row>
                    <Col lg={9}>
                        <div className="custom-card">
                            <CardHeader>
                                <div>
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}
                                        style={{ color: colorPalette.primaryGray550 }}>
                                        {`Danger Zone`}
                                    </Typography.Subheader>
                                </div>
                            </CardHeader>

                            <CardBody>
                                <div>
                                    <Button
                                        label="Delete Building"
                                        size={Button.Sizes.md}
                                        type={Button.Type.secondaryDistructive}
                                        // onClick={deleteBuildingHandler} -- Will be enabled once API is ready
                                        icon={<DeleteSVG />}
                                    />
                                </div>
                            </CardBody>
                        </div>
                    </Col>
                </Row>
            ) : null}
        </React.Fragment>
    );
};

export default GeneralBuildingSettings;
