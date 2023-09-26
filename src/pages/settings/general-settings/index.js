import React, { useState, useEffect } from 'react';
import { Row, Col, CardBody, CardHeader } from 'reactstrap';
import axios from 'axios';
import Switch from 'react-switch';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import { useParams } from 'react-router-dom';
import { BaseUrl, generalBldgDelete } from '../../../services/Network';
import { UserStore } from '../../../store/UserStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { BuildingListStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { Cookies } from 'react-cookie';
import { buildingData } from '../../../store/globalState';
import { updateBuildingStore } from '../../../helpers/updateBuildingStore';
import TimezoneSelect from 'react-timezone-select';
import Typography from '../../../sharedComponents/typography';
import Button from '../../../sharedComponents/button/Button';
import Inputs from '../../../sharedComponents/form/input/Input';
import Select from '../../../sharedComponents/form/select';
import colorPalette from '../../../assets/scss/_colors.scss';
import Brick from '../../../sharedComponents/brick';
import { convertToFootage, convertToMeters, handleUnitConverstion } from './utils';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import { ReactComponent as DeleteSVG } from '../../../assets/icon/delete.svg';
import { updateGeneralBuildingChange, updateBuildingTypes } from './services';
import OperatingHours from './OperatingHours';
import '../../../sharedComponents/form/select/style.scss';
import '../style.css';
import './styles.scss';

const GeneralBuildingSettings = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const [userPermission] = useAtom(userPermissionData);

    const isUserAdmin = userPermission?.is_admin ?? false;
    const canUserEdit = userPermission?.permissions?.permissions?.account_buildings_permission?.edit ?? false;
    const canUserDelete = userPermission?.permissions?.permissions?.account_buildings_permission?.delete ?? false;

    const { bldgId } = useParams();
    const [selectedTimezone, setSelectedTimezone] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const userPrefTimeZone = UserStore.useState((s) => s.timeFormat);
    const userPrefUnits = UserStore.useState((s) => s.unit);

    const [generalDateTimeData, setGeneralDateTimeData] = useState({});
    const [render, setRender] = useState(false);
    const [activeToggle, setActiveToggle] = useState(false);
    const [weekToggle, setWeekToggle] = useState({});
    const [timeToggle, setTimeToggle] = useState(false);
    const [inputField, setInputField] = useState({
        kWh: 0,
        total_paid: 0,
    });

    const [buildingType, setBuildingType] = useState([]);
    const [bldgData, setBldgData] = useState({});
    const [buildingDetails, setBuildingDetails] = useState({});
    const [buildingAddress, setBuildingAddress] = useState({});
    const [buildingOperatingHours, setBuildingOperatingHours] = useState({});
    const [textLocation, settextLocation] = useState('');
    const [timeZone, setTimeZone] = useState('12');
    const [loadButton, setLoadButton] = useState(false);
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

    const fetchBuildingType = async () => {
        await updateBuildingTypes()
            .then((res) => {
                let response = res.data.data;
                let arr = [];
                response.data.map((el) => {
                    arr.push({
                        label: el.building_type,
                        value: el.building_type_id,
                    });
                });
                setBuildingType(arr);
            })
            .catch((error) => {});
    };

    const saveBuildingSettings = async () => {
        setLoadButton(true);
        const params = `/${bldgId}`;

        let bldgData = {};
        bldgData.info = Object.assign({}, buildingDetails);

        // Handle Square Footage / Meter change with converstion check and fix
        if (bldgData.info.square_footage === '') bldgData.info.square_footage = 0;

        if (userPrefUnits === 'si' && bldgData.info.square_footage !== '') {
            bldgData.info.square_footage = Number(convertToFootage(bldgData.info.square_footage));
        } else {
            bldgData.info.square_footage = Number(bldgData.info.square_footage);
        }

        bldgData.address = buildingAddress;
        bldgData.operating_hours = operationTime.operating_hours;

        await updateGeneralBuildingChange(bldgData, params)
            .then((res) => {
                const response = res?.data;
                if (!res) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = '';
                        s.notificationType = 'error';
                    });
                    return;
                }

                if (response?.success) {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = 'Building Details updated successfully!';
                        s.notificationType = 'success';
                    });
                    localStorage.removeItem('generalState');
                    localStorage.removeItem('generalStreetAddress');
                    localStorage.removeItem('generalBuildingName');
                    localStorage.removeItem('generalBuildingType');
                    localStorage.removeItem('generaltimeZone');
                    localStorage.removeItem('generalZipCode');
                    BuildingListStore.update((s) => {
                        s.fetchBuildingList = true;
                    });
                } else {
                    UserStore.update((s) => {
                        s.showNotification = true;
                        s.notificationMessage = response?.message
                            ? response?.message
                            : res
                            ? 'Unable to update Building Details.'
                            : 'Unable to save building details due to Internal Server Error!';
                        s.notificationType = 'error';
                    });
                }
                setLoadButton(false);
            })
            .catch((e) => {
                setLoadButton(false);
            });
    };

    const [buildingListData] = useAtom(buildingData);

    const handleTotalAreaOfBldg = (building_size) => {
        let value;
        if (building_size === 0) {
            value = 0;
        } else {
            value = handleUnitConverstion(building_size, userPrefUnits);
        }
        return value;
    };

    const fetchBuildingData = async () => {
        let fixing = true;

        if (fixing) {
            let data = {};
            if (bldgId) {
                data = buildingListData.find((el) => el.building_id === bldgId);
                if (data === undefined) {
                    return (fixing = false);
                }
                setBldgData(data);

                let buildingDetailsObj = {
                    name: data.building_name,
                    building_type: data.building_type,
                    building_type_id: data.building_type_id,
                    square_footage: handleTotalAreaOfBldg(data.building_size),
                    active: data.active,
                    timezone: data.timezone,
                    time_format: data.time_format,
                    plug_only: data.plug_only,
                };
                setBuildingDetails(buildingDetailsObj);

                let buildingAddressObj = {
                    street_address: data.street_address,
                    address_2: data.address_2,
                    city: data.city,
                    state: data.state,
                    zip_code: data.zip_code,
                };
                setBuildingAddress(buildingAddressObj);

                let buildingOperatingHours = {
                    operating_hours: data.operating_hours,
                };
                setBuildingOperatingHours(buildingOperatingHours);

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

    const handleSwitchChange = () => {
        let obj = buildingDetails;

        obj.active = !buildingDetails.active;
        localStorage.setItem('generalObjectActive', obj.active);
        handleBldgSettingChanges('active', obj.active);
    };

    const handlePlugChange = () => {
        let obj = buildingDetails;
        obj.plug_only = !buildingDetails.plug_only;
        handleBldgSettingChanges('plug_only', obj.plug_only);
    };

    const handleDateTimeSwitch = () => {
        let obj = buildingDetails;

        obj.time_format = !buildingDetails.time_format;

        handleBldgSettingChanges('time_format', obj.time_format);
    };

    const handleBldgSettingChanges = (key, value) => {
        if (key === 'active') {
            let obj = Object.assign({}, buildingDetails);
            obj[key] = value;
            setBuildingDetails(obj);
        }

        if (key === 'name') {
            let obj = Object.assign({}, buildingDetails);
            obj[key] = value;
            setBuildingDetails(obj);
        }

        if (key === 'building_type_id') {
            let obj = Object.assign({}, buildingDetails);
            let arr = buildingType.filter((ele) => ele.value === value);
            obj[key] = value;
            obj['building_type'] = arr[0]?.label;
            setBuildingDetails(obj);
        }

        if (key === 'square_footage') {
            let obj = Object.assign({}, buildingDetails);
            obj[key] = value;
            setBuildingDetails(obj);
        }

        if (key === 'street_address') {
            let obj = Object.assign({}, buildingAddress);
            obj[key] = value;
            setBuildingAddress(obj);
        }

        if (key === 'address_2') {
            let obj = Object.assign({}, buildingAddress);
            obj[key] = value;
            setBuildingAddress(obj);
        }

        if (key === 'city') {
            let obj = Object.assign({}, buildingAddress);
            obj[key] = value;
            setBuildingAddress(obj);
        }

        if (key === 'state') {
            let obj = Object.assign({}, buildingAddress);
            obj[key] = value;
            setBuildingAddress(obj);
        }

        if (key === 'zip_code') {
            let obj = Object.assign({}, buildingAddress);
            obj[key] = value;
            setBuildingAddress(obj);
        }

        if (key === 'time_format') {
            let obj = Object.assign({}, buildingDetails);
            obj[key] = value;
            setBuildingDetails(obj);
        }

        if (key === 'timezone') {
            let obj = Object.assign({}, buildingDetails);
            obj[key] = value;
            setBuildingDetails(obj);
        }

        if (key === 'plug_only') {
            let obj = Object.assign({}, buildingDetails);
            obj[key] = value;
            setBuildingDetails(obj);
        }
    };

    const deleteBuildingHandler = () => {
        var answer = window.confirm("'Are you sure wants o delete!!!'");

        if (answer) {
            //some code

            const headers = {
                'Content-Type': 'application/json',

                accept: 'application/json',

                Authorization: `Bearer ${userdata.token}`,
            };

            axios.delete(`${BaseUrl}${generalBldgDelete}/${bldgId}`, { headers }).then((res) => {
                setRender(!render);
            });
        }
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

    const [getResponseOfPlaces, setGetResponseOfPlaces] = useState();
    const [selectedPlaceLabel, setSelectedPlaceLabel] = useState('');
    const [totalSelectedData, setTotalSelectedData] = useState();
    const [openDropdown, setopenDropdown] = useState(false);

    const getPlacesAutocomplete = async () => {
        const params = `${textLocation.split(' ').join('+')}`;
        await axios
            .get(`https://api.geocode.earth/v1/autocomplete?api_key=ge-2200db37475e4ed3&text=${params}`)
            .then((res) => {
                setGetResponseOfPlaces(res?.data);
            });
    };

    useEffect(() => {
        if (!userPrefTimeZone) return;
        const time_zone = userPrefTimeZone.split('h')[0];
        setTimeZone(time_zone);
    }, [userPrefTimeZone]);

    useEffect(() => {
        if (!buildingDetails?.square_footage || !userPrefUnits) return;

        let obj = Object.assign({}, buildingDetails);

        if (userPrefUnits === 'si') obj.square_footage = convertToMeters(obj?.square_footage);
        if (userPrefUnits === 'imp') obj.square_footage = convertToFootage(obj?.square_footage);

        setBuildingDetails(obj);
    }, [userPrefUnits]);

    useEffect(() => {
        fetchBuildingType();
    }, []);

    useEffect(() => {
        if (selectedTimezone?.value) {
            handleBldgSettingChanges('timezone', selectedTimezone?.value);
        }
    }, [selectedTimezone]);

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
        if (buildingListData) {
            fetchBuildingData();
        }
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
                    setActiveToggle(data.active);
                    setTimeToggle(data.time_format);
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
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
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
                                        onClick={() => {
                                            setIsEditing(false);
                                            fetchBuildingData();
                                        }}
                                    />
                                    <Button
                                        label={loadButton ? 'Saving' : 'Save'}
                                        size={Button.Sizes.md}
                                        type={Button.Type.primary}
                                        onClick={() => {
                                            saveBuildingSettings();
                                            setIsEditing(false);
                                        }}
                                        className="ml-2"
                                        disabled={loadButton}
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
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    Building Details
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>Active</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        Non-admin users can only view active buildings.
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    {isUserAdmin || canUserEdit ? (
                                        <Switch
                                            onChange={() => {
                                                handleSwitchChange();
                                            }}
                                            checked={buildingDetails.active}
                                            onColor={colorPalette.datavizBlue600}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            className="react-switch"
                                        />
                                    ) : (
                                        <Switch
                                            onChange={() => {}}
                                            checked={buildingDetails.active}
                                            onColor={colorPalette.datavizBlue600}
                                            className="react-switch"
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                        />
                                    )}
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>
                                        Building Name
                                    </Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        A human-friendly display name for this building
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    {isUserAdmin || canUserEdit ? (
                                        <Inputs
                                            type="text"
                                            placeholder="Enter Building Name"
                                            onChange={(e) => {
                                                localStorage.setItem('generalBuildingName', e.target.value);
                                                handleBldgSettingChanges('name', e.target.value);
                                            }}
                                            className="w-100"
                                            value={buildingDetails?.name}
                                        />
                                    ) : (
                                        <Inputs
                                            type="text"
                                            placeholder="Building Name Not Added"
                                            className="w-100"
                                            value={buildingDetails?.name}
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>Type</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        The primary use/type of this building
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    {isUserAdmin || canUserEdit ? (
                                        <Select
                                            id="endUseSelect"
                                            placeholder="Select Building Type"
                                            name="select"
                                            isSearchable={true}
                                            defaultValue={buildingDetails?.building_type_id}
                                            options={buildingType}
                                            onChange={(e) => {
                                                handleBldgSettingChanges('building_type_id', e.value);
                                                localStorage.setItem('generalBuildingType', e.value);
                                            }}
                                            className="w-100"
                                        />
                                    ) : (
                                        <Inputs
                                            type="text"
                                            placeholder="Building Type Not Added"
                                            className="w-100"
                                            value={buildingDetails?.building_type}
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
                                                handleBldgSettingChanges('square_footage', e.target.value);
                                            }}
                                            labelSize={Typography.Sizes.md}
                                            className="w-100"
                                            inputClassName="custom-input-field"
                                            value={Math.round(buildingDetails?.square_footage)}
                                        />
                                    ) : (
                                        <Inputs
                                            type="text"
                                            placeholder="Building Size Not Added"
                                            className="w-100"
                                            value={buildingDetails.square_footage}
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>Plug-only</Typography.Subheader>
                                    <Brick sizeInRem={0.25} />
                                    <Typography.Body size={Typography.Sizes.sm}>
                                        To view Plug only data of this building
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Switch
                                        onChange={() => {
                                            if (isUserAdmin || canUserEdit) {
                                                handlePlugChange();
                                            }
                                        }}
                                        checked={buildingDetails.plug_only}
                                        onColor={colorPalette.datavizBlue600}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        className="react-switch"
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
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    Address
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <div className="row">
                                <div className="col d-flex align-items-center">
                                    {isUserAdmin || canUserEdit ? (
                                        <Inputs
                                            type="text"
                                            label="Street Address"
                                            placeholder="Enter Address 1"
                                            onChange={(e) => {
                                                handleBldgSettingChanges('street_address', e.target.value);
                                                settextLocation(e.target.value);
                                                if (getResponseOfPlaces) {
                                                    setopenDropdown(true);
                                                }
                                            }}
                                            className="w-100"
                                            value={selectedPlaceLabel || buildingAddress?.street_address}
                                        />
                                    ) : (
                                        <Inputs
                                            type="text"
                                            placeholder="Address Not Added"
                                            className="w-100"
                                            value={selectedPlaceLabel || buildingAddress?.street_address}
                                            disabled
                                        />
                                    )}
                                </div>
                                <div className="col d-flex align-items-center">
                                    {isUserAdmin || canUserEdit ? (
                                        <Inputs
                                            type="text"
                                            label="Address 2 (optional)"
                                            placeholder="Enter Address 2 (optional)"
                                            onChange={(e) => {
                                                handleBldgSettingChanges('address_2', e.target.value);
                                                localStorage.setItem('generalStreetAddress2', e.target.value);
                                            }}
                                            className="w-100"
                                            value={buildingAddress?.address_2}
                                        />
                                    ) : (
                                        <Inputs
                                            type="text"
                                            placeholder="Address Not Added"
                                            className="w-100"
                                            value={buildingAddress?.address_2}
                                            disabled
                                        />
                                    )}
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="row">
                                <div className="col d-flex align-items-center">
                                    {isUserAdmin || canUserEdit ? (
                                        <Inputs
                                            type="text"
                                            label="City"
                                            placeholder="Enter City"
                                            onChange={(e) => {
                                                handleBldgSettingChanges('city', e.target.value);
                                                localStorage.setItem(
                                                    'generalCity',
                                                    totalSelectedData?.properties?.locality
                                                );
                                            }}
                                            className="w-100"
                                            value={totalSelectedData?.properties?.locality || buildingAddress?.city}
                                        />
                                    ) : (
                                        <Inputs
                                            type="text"
                                            placeholder="City is Not Added"
                                            className="w-100"
                                            value={totalSelectedData?.properties?.locality || buildingAddress?.city}
                                            disabled
                                        />
                                    )}
                                </div>

                                <div className="col d-flex align-items-center">
                                    {isUserAdmin || canUserEdit ? (
                                        <Inputs
                                            type="text"
                                            label="State"
                                            placeholder="Enter State"
                                            onChange={(e) => {
                                                handleBldgSettingChanges('state', e.target.value);
                                                localStorage.setItem(
                                                    'generalState',
                                                    totalSelectedData?.properties?.region
                                                );
                                            }}
                                            className="w-100"
                                            value={totalSelectedData?.properties?.region || buildingAddress?.state}
                                        />
                                    ) : (
                                        <Inputs
                                            type="text"
                                            placeholder="State is Not Added"
                                            className="w-100"
                                            value={totalSelectedData?.properties?.region || buildingAddress?.state}
                                            disabled
                                        />
                                    )}
                                </div>

                                <div className="col d-flex align-items-center">
                                    {isUserAdmin || canUserEdit ? (
                                        <Inputs
                                            type="string"
                                            label="Postal Code"
                                            placeholder="Enter Postal Code"
                                            onChange={(e) => {
                                                handleBldgSettingChanges('zip_code', e.target.value);
                                                localStorage.setItem('generalZipCode', e.target.value);
                                            }}
                                            className="w-100"
                                            value={buildingAddress?.zip_code}
                                        />
                                    ) : (
                                        <Inputs
                                            type="text"
                                            placeholder="Zip is Not Added"
                                            className="w-100"
                                            value={buildingAddress?.zip_code}
                                            disabled
                                        />
                                    )}
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
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    Date & Time
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <div className="row d-flex align-items-center">
                                <div className="col">
                                    <Typography.Subheader size={Typography.Sizes.md}>TimeZone</Typography.Subheader>
                                </div>
                                <div className="col">
                                    {isUserAdmin || canUserEdit ? (
                                        <TimezoneSelect
                                            value={buildingDetails?.timezone ? buildingDetails?.timezone : ''}
                                            onChange={setSelectedTimezone}
                                            className="react-select-wrapper w-100"
                                        />
                                    ) : (
                                        <Inputs
                                            type="text"
                                            placeholder="No timezone Selected"
                                            className="w-100"
                                            value={buildingDetails?.timezone ? buildingDetails?.timezone : ''}
                                            disabled
                                        />
                                    )}
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
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    Operating Hours
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <Row>
                                <div className="ml-3">
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
