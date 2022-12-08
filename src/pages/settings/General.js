import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardHeader, Spinner } from 'reactstrap';
import Switch from 'react-switch';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import { useAtom } from 'jotai';
import './style.css';
import {
    BaseUrl,
    generalBuildingDetail,
    generalBuildingAddress,
    generalDateTime,
    generalOperatingHours,
    generalBldgDelete,
} from '../../services/Network';
import axios from 'axios';
import moment from 'moment';
import { BuildingStore, BuildingListStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { buildingData } from '../../store/globalState';
import TimezoneSelect from 'react-timezone-select';
import DropDownInput from '../../components/DropdownInput/DropDownInput';
import Typography from '../../sharedComponents/typography';
import Button from '../../sharedComponents/button/Button';
import Inputs from '../../sharedComponents/form/input/Input';
import Select from '../../sharedComponents/form/select';
import '../../sharedComponents/form/select/style.scss';
import { ReactComponent as DeleteSVG } from '../../assets/icon/delete.svg';
import colorPalette from '../../assets/scss/_colors.scss';

const General = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const _ = require('lodash');
    const [selectedTimezone, setSelectedTimezone] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    // const [buildingData, setBuildingData] = useState({});

    const [operatingHours, setOperatingHours] = useState([]);
    const [allbuildingData, setAllBuildingData] = useState({});
    const [generalDateTimeData, setGeneralDateTimeData] = useState({});
    const [checked, setChecked] = useState(generalDateTimeData.time_format);
    const [generalOperatingData, setGeneralOperatingData] = useState({});
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date(`January 31 1980 12:50`));
    const [value, onChange] = useState('10:00');
    const [render, setRender] = useState(false);
    const [activeToggle, setActiveToggle] = useState(false);
    const [weekToggle, setWeekToggle] = useState({});
    const [timeToggle, setTimeToggle] = useState(false);
    const [inputField, setInputField] = useState({
        kWh: 0,
        total_paid: 0,
    });

    const buildingType = [
        {
            label: 'Office Building',
            value: 'Office Building',
        },
        {
            label: 'Residential Building',
            value: 'Residential Building',
        },
    ];

    const [bldgData, setBldgData] = useState({});
    const [buildingDetails, setBuildingDetails] = useState({});
    const [buildingAddress, setBuildingAddress] = useState({});
    const [buildingDateTime, setBuildingDateTime] = useState({});
    const [buildingOperatingHours, setBuildingOperatingHours] = useState({});
    const [responseBuildingDetails, setResponseBuildingDetails] = useState({});
    const [responseBuildingAddress, setResponseBuildingAddress] = useState({});
    const [responseBuildingDateTime, setResponseBuildingDateTime] = useState({});
    const [responseBuildingOperatingHours, setResponseBuildingOperatingHours] = useState({});

    const [textLocation, settextLocation] = useState('');

    const [timeZone, setTimeZone] = useState('');

    useEffect(() => {
        if (bldgData?.time_format) {
            setTimeZone('24');
        }
        if (!bldgData?.time_format) {
            setTimeZone('12');
        }
    }, [bldgData]);

    useEffect(() => {
        if (selectedTimezone?.value) {
            handleBldgSettingChanges('timezone', selectedTimezone?.value);
        }
    }, [selectedTimezone]);

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

    const saveBuildingSettings = async () => {
        try {
            let header = {
                'Content-Type': 'application/json',

                accept: 'application/json',

                Authorization: `Bearer ${userdata.token}`,
            };

            // let params = `?building_id=${bldgId}`;

            let params = `/${bldgId}`;

            await axios

                .all([
                    axios.patch(`${BaseUrl}${generalBuildingDetail}${params}`, buildingDetails, {
                        headers: header,
                    }),

                    axios.patch(`${BaseUrl}${generalBuildingAddress}${params}`, buildingAddress, {
                        headers: header,
                    }),

                    axios.patch(`${BaseUrl}${generalDateTime}${params}`, buildingDateTime, {
                        headers: header,
                    }),

                    axios.patch(`${BaseUrl}${generalOperatingHours}/${bldgId}`, operationTime, { headers: header }),
                ])

                .then(
                    axios.spread((data1, data2, data3) => {
                        setLoadButton(false);
                        localStorage.removeItem('generalState');
                        localStorage.removeItem('generalStreetAddress');
                        localStorage.removeItem('generalBuildingName');
                        localStorage.removeItem('generaltimeZone');
                        localStorage.removeItem('generalZipCode');
                        BuildingListStore.update((s) => {
                            s.fetchBuildingList = true;
                        });
                    })
                );
        } catch (error) {}
    };

    const [buildingListData] = useAtom(buildingData);

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
                    typee: data.building_type,
                    square_footage: data.building_size,
                    active: data.active,
                };
                setBuildingDetails(buildingDetailsObj);
                setResponseBuildingDetails(buildingDetailsObj);

                let buildingAddressObj = {
                    street_address: data.street_address,
                    address_2: data.address_2,
                    city: data.city,
                    state: data.state,
                    zip_code: data.zip_code,
                };
                setBuildingAddress(buildingAddressObj);
                setResponseBuildingAddress(buildingAddressObj);

                let buildingDateTimeObj = {
                    timezone: data.timezone,
                    time_format: data.time_format,
                };
                setBuildingDateTime(buildingDateTimeObj);
                setResponseBuildingDateTime(buildingDateTimeObj);

                let buildingOperatingHours = {
                    operating_hours: data.operating_hours,
                };
                setBuildingOperatingHours(buildingOperatingHours);
                setResponseBuildingOperatingHours(buildingOperatingHours);

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
            // setBuildingData(data);
            // });
        }
    };

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
                        typee: data.building_type,
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
                // setBuildingData(data);
                // });
            }
            // setBuildingData(data);
            // });
        };

        fetchBuildingData();
    }, [render]);

    const timing12hour = [
        '12:00 AM',
        '01:00 AM',
        '02:00 AM',
        '03:00 AM',
        '04:00 AM',
        '05:00 AM',
        '06:00 AM',
        '07:00 AM',
        '08:00 AM',
        '09:00 AM',
        '10:00 AM',
        '11:00 AM',
        '12:00 PM',
        '01:00 PM',
        '02:00 PM',
        '03:00 PM',
        '04:00 PM',
        '05:00 PM',
        '06:00 PM',
        '07:00 PM',
        '08:00 PM',
        '09:00 PM',
        '10:00 PM',
        '11:00 PM',
    ];

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'General',

                        path: '/settings/general',

                        active: true,
                    },
                ];

                bs.items = newList;
            });

            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };

        updateBreadcrumbStore();
    }, []);

    const inputsBuildingHandler = (e) => {
        setInputField({ [e.target.name]: e.target.value });
    };

    const inputsAddressHandler = (e) => {
        setInputField({ [e.target.name]: e.target.value });
    };

    const dateHandler = (operating_hours, day) => {
        let days = '';

        let timeFrom = '';

        let timeTo = '';

        let stat = '';

        if (operating_hours) {
            days = operating_hours[day];

            timeFrom = days['time_range'].frm;

            timeTo = days['time_range'].to;

            stat = days['stat'];
        }

        return {
            frm: new Date(`January 31 1980 ${timeFrom}`),

            to: new Date(`January 31 1980 ${timeTo}`),

            stat,
        };
    };

    const inputsActiveToggleHandler = (e) => {
        setActiveToggle(!activeToggle);

        const headers = {
            'Content-Type': 'application/json',

            accept: 'application/json',

            Authorization: `Bearer ${userdata.token}`,
        };

        axios.patch(`${BaseUrl}${generalBuildingDetail}/${bldgId}`, { active: e }, { headers }).then((res) => {
            setRender(!render);
        });
    };

    const handleSwitchChange = () => {
        let obj = buildingDetails;

        obj.active = !buildingDetails.active;
        localStorage.setItem('generalObjectActive', obj.active);
        handleBldgSettingChanges('active', obj.active);
    };

    const handleDateTimeSwitch = () => {
        let obj = buildingDateTime;

        obj.active = !buildingDateTime.active;

        handleBldgSettingChanges('time_format', obj.active);
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

        if (key === 'typee') {
            let obj = Object.assign({}, buildingDetails);

            obj[key] = value;

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
            let obj = Object.assign({}, buildingDateTime);

            obj[key] = value;

            setBuildingDateTime(obj);
        }

        if (key === 'timezone') {
            let obj = Object.assign({}, buildingDateTime);

            obj[key] = value;

            setBuildingDateTime(obj);
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
        const time1 = moment(date).format('HH:00');

        const data = {
            [day]: {
                time_range: {
                    [type1]: time1,
                },
            },
        };
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

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // useEffect(() => {
    //     const el = document.querySelector('ge-autocomplete');
    //     // 'select' event handler - when a user selects an item from the suggestions
    //     if (el) {
    //         el.addEventListener('select', (event) => {
    //         });
    //     }
    // }, []);

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

    useEffect(() => {
        // getPlacesAutocomplete();
        // getGooglePlacesAutocomplete();
    }, [textLocation]);

    // update section end

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>General Building Settings</Typography.Header>
                        </div>
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
                                        setLoadButton(true);
                                        saveBuildingSettings();
                                    }}
                                    className="ml-2"
                                    disabled={loadButton}
                                />
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Row>
                <Col lg={9}>
                    <Card className="custom-card mt-4">
                        <CardHeader>
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    Building Details
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody className="mb-1">
                            <div className="row">
                                <div className="col">
                                    <Typography.Header size={Typography.Sizes.xs}>Active</Typography.Header>
                                    <Typography.Body size={Typography.Sizes.md}>
                                        Non-admin users can only view active buildings.
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
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
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <Typography.Header size={Typography.Sizes.xs}>Building Name</Typography.Header>
                                    <Typography.Body size={Typography.Sizes.md}>
                                        A human-friendly display name for this building
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
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
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <Typography.Header size={Typography.Sizes.xs}>Type</Typography.Header>
                                    <Typography.Body size={Typography.Sizes.md}>
                                        The primary use/type of this building
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Select
                                        id="endUseSelect"
                                        placeholder="Select Building Type"
                                        name="select"
                                        isSearchable={true}
                                        defaultValue={buildingDetails.typee}
                                        options={buildingType}
                                        onChange={(e) => {
                                            handleBldgSettingChanges('typee', e.value);
                                            localStorage.setItem('generalBuildingType', e.value);
                                        }}
                                        className="w-100"
                                    />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col">
                                    <Typography.Header size={Typography.Sizes.xs}>Square Footage</Typography.Header>
                                    <Typography.Body size={Typography.Sizes.md}>
                                        The total square footage of this building
                                    </Typography.Body>
                                </div>
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        placeholder="Enter Square Footage"
                                        onChange={(e) => {
                                            handleBldgSettingChanges('square_footage', +e.target.value);
                                            localStorage.setItem('generalSquareFootage', e.target.value);
                                        }}
                                        className="w-100"
                                        value={buildingDetails?.square_footage}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={9}>
                    <Card className="custom-card mt-2">
                        <CardHeader>
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    Address
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody className="mb-2">
                            <div className="row">
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        label="Street Address"
                                        placeholder="Enter Address 1"
                                        onChange={(e) => {
                                            handleBldgSettingChanges('street_address', e.value);
                                            settextLocation(e.value);
                                            if (getResponseOfPlaces) {
                                                setopenDropdown(true);
                                            }
                                        }}
                                        className="w-100"
                                        value={selectedPlaceLabel || buildingAddress?.street_address}
                                    />
                                </div>

                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        label="Address 2 (optional)"
                                        placeholder="Enter Address 2 (optional)"
                                        onChange={(e) => {
                                            handleBldgSettingChanges('address_2', e.value);
                                            localStorage.setItem('generalStreetAddress2', e.value);
                                        }}
                                        className="w-100"
                                        value={buildingAddress?.address_2}
                                    />
                                </div>
                            </div>

                            <div className="row mt-4">
                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        label="City"
                                        placeholder="Enter City"
                                        onChange={(e) => {
                                            handleBldgSettingChanges('city', e.value);
                                            localStorage.setItem(
                                                'generalCity',
                                                totalSelectedData?.properties?.locality
                                            );
                                        }}
                                        className="w-100"
                                        value={totalSelectedData?.properties?.locality || buildingAddress?.city}
                                    />
                                </div>

                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="text"
                                        label="State"
                                        placeholder="Select State"
                                        onChange={(e) => {
                                            handleBldgSettingChanges('state', e.value);
                                            localStorage.setItem('generalState', totalSelectedData?.properties?.region);
                                        }}
                                        className="w-100"
                                        value={totalSelectedData?.properties?.region || buildingAddress?.state}
                                    />
                                </div>

                                <div className="col d-flex align-items-center">
                                    <Inputs
                                        type="number"
                                        label="Zip"
                                        placeholder="Enter Zip Code"
                                        onChange={(e) => {
                                            handleBldgSettingChanges('zip_code', +e.target.value);
                                            localStorage.setItem('generalZipCode', +e.target.value);
                                        }}
                                        className="w-100"
                                        value={buildingAddress?.zip_code}
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={9}>
                    <Card className="custom-card mt-2">
                        <CardHeader>
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    Date & Time
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody className="mb-1">
                            <div className="row d-flex align-items-center">
                                <div className="col">
                                    <Typography.Header size={Typography.Sizes.xs}>TimeZone</Typography.Header>
                                </div>
                                <div className="col">
                                    <TimezoneSelect
                                        value={buildingDateTime?.timezone ? buildingDateTime?.timezone : ''}
                                        onChange={setSelectedTimezone}
                                        className="react-select-wrapper w-100"
                                    />
                                </div>
                            </div>

                            <div className="row d-flex align-items-center mt-4">
                                <div className="col">
                                    <Typography.Header size={Typography.Sizes.xs}>Use 24-hour Clock</Typography.Header>
                                </div>
                                <div className="col">
                                    <Switch
                                        onChange={(e) => {
                                            handleDateTimeSwitch();

                                            if (e) {
                                                setTimeZone('24');
                                                localStorage.setItem('generaltimeZone', '24');
                                            }

                                            if (!e) {
                                                setTimeZone('12');
                                                localStorage.setItem('generaltimeZone', '12');
                                            }
                                        }}
                                        checked={buildingDateTime.time_format}
                                        onColor={colorPalette.datavizBlue600}
                                        uncheckedIcon={false}
                                        checkedIcon={false}
                                        className="react-switch"
                                    />
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={9}>
                    <Card className="custom-card mt-2">
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
                                <div>
                                    <>
                                        {/* Monday */}

                                        <div className="operate-hour-style">
                                            <Switch
                                                onChange={(e) => {
                                                    checkDateTimeHandler('mon', e);
                                                    setSwitchPhrace({ ...switchPhrase, mon: e });
                                                }}
                                                checked={weekToggle['mon']}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                            />

                                            <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                                Mon
                                            </div>

                                            <DatePicker
                                                onInputClick={() => {}}
                                                style={{ position: 'relative' }}
                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'mon', 'frm', 'to');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            monFrom: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            monFrom: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                disabled={!weekToggle['mon']}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                value={timeValue?.monFrom}
                                                timeIntervals={60}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '24' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />

                                            {/* <input
                                                type="text"
                                                readOnly
                                                style={{
                                                    width: '77px',
                                                    borderRadius: '0.2rem',
                                                    border: '1px solid #d9dde2',
                                                    height: '32px',
                                                    boxShadow: '0px 1px 0px rgb(16 24 40 / 5%)',
                                                    position: 'absolute',
                                                    left: '132px',
                                                }}
                                            /> */}

                                            {/* TODO: */}
                                            {/* <DropDownInput setWeekToggle={setWeekToggle} /> */}

                                            <div className="spacing"> to </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'mon').to}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'mon', 'to', 'frm');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            monTo: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            monTo: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                disabled={!weekToggle['mon']}
                                                timeIntervals={60}
                                                value={timeValue?.monTo}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />
                                        </div>

                                        {/* Tuesday */}

                                        <div className="operate-hour-style">
                                            <Switch
                                                onChange={(e) => {
                                                    checkDateTimeHandler('tue', e);

                                                    setSwitchPhrace({ ...switchPhrase, tue: e });
                                                }}
                                                checked={weekToggle['tue']}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                            />

                                            <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                                Tue
                                            </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'tue').frm}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'tue', 'frm', 'to');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            tueFrom: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            tueFrom: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                disabled={!weekToggle['tue']}
                                                timeIntervals={60}
                                                value={timeValue?.tueFrom}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />

                                            <div className="spacing"> to </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'tue').to}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'tue', 'to', 'frm');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            tueTo: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            tueTo: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={60}
                                                value={timeValue?.tueTo}
                                                disabled={!weekToggle['tue']}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />
                                        </div>

                                        {/* Wednesday */}

                                        <div className="operate-hour-style">
                                            <Switch
                                                onChange={(e) => {
                                                    checkDateTimeHandler('wed', e);

                                                    setSwitchPhrace({ ...switchPhrase, wed: e });
                                                }}
                                                checked={weekToggle['wed']}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                            />

                                            <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                                Wed
                                            </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'wed').frm}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'wed', 'frm', 'to');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            wedFrom: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            wedFrom: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={60}
                                                disabled={!weekToggle['wed']}
                                                value={timeValue?.wedFrom}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />

                                            <div className="spacing"> to </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'wed').to}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'wed', 'to', 'frm');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            wedTo: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            wedTo: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                disabled={!weekToggle['wed']}
                                                timeIntervals={60}
                                                value={timeValue?.wedTo}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />
                                        </div>

                                        {/* Thursday */}

                                        <div className="operate-hour-style">
                                            <Switch
                                                onChange={(e) => {
                                                    checkDateTimeHandler('thu', e);

                                                    setSwitchPhrace({ ...switchPhrase, thu: e });
                                                }}
                                                checked={weekToggle['thu']}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                            />

                                            <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                                Thu
                                            </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'thu').frm}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'thu', 'frm', 'to');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            thuFrom: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            thuFrom: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={60}
                                                disabled={!weekToggle['thu']}
                                                value={timeValue?.thuFrom}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />

                                            <div className="spacing"> to </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'thu').to}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'thu', 'to', 'frm');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            thuTo: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            thuTo: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={60}
                                                disabled={!weekToggle['thu']}
                                                value={timeValue?.thuTo}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />
                                        </div>

                                        {/* Friday */}

                                        <div className="operate-hour-style">
                                            <Switch
                                                onChange={(e) => {
                                                    checkDateTimeHandler('fri', e);

                                                    setSwitchPhrace({ ...switchPhrase, fri: e });
                                                }}
                                                checked={weekToggle['fri']}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                            />

                                            <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                                Fri
                                            </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'fri').frm}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'fri', 'frm', 'to');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            friFrom: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            friFrom: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                disabled={!weekToggle['fri']}
                                                timeIntervals={60}
                                                value={timeValue?.friFrom}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />

                                            <div className="spacing"> to </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'fri').to}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'fri', 'to', 'frm');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            friTo: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            friTo: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={60}
                                                disabled={!weekToggle['fri']}
                                                value={timeValue?.friTo}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />
                                        </div>

                                        {/* Saturday */}

                                        <div className="operate-hour-style">
                                            <Switch
                                                onChange={(e) => {
                                                    checkDateTimeHandler('sat', e);

                                                    setSwitchPhrace({ ...switchPhrase, sat: e });
                                                }}
                                                checked={weekToggle['sat']}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                            />

                                            <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                                Sat
                                            </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'sat').frm}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'sat', 'frm', 'to');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            satFrom: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            satFrom: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                disabled={!weekToggle['sat']}
                                                timeIntervals={60}
                                                value={timeValue?.satFrom}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />

                                            <div className="spacing"> to </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'sat').to}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'sat', 'to', 'frm');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            satTo: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            satTo: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                disabled={!weekToggle['sat']}
                                                timeIntervals={60}
                                                value={timeValue?.satTo}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />
                                        </div>

                                        {/* Sunday */}

                                        <div className="operate-hour-style">
                                            <Switch
                                                onChange={(e) => {
                                                    checkDateTimeHandler('sun', e);

                                                    setSwitchPhrace({ ...switchPhrase, tue: e });
                                                }}
                                                checked={weekToggle['sun']}
                                                onColor={'#2955E7'}
                                                uncheckedIcon={false}
                                                checkedIcon={false}
                                                className="react-switch"
                                            />

                                            <div className="badge badge-light ml-2 mr-2 font-weight-bold week-day-style">
                                                Sun
                                            </div>

                                            <DatePicker
                                                // selected={dateHandler(inputField.operating_hours, 'sun').frm}

                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'sun', 'frm', 'to');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            sunFrom: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            sunFrom: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                disabled={!weekToggle['sun']}
                                                showTimeSelect
                                                showTimeSelectOnly
                                                timeIntervals={60}
                                                value={timeValue?.sunFrom}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />

                                            <div className="spacing"> to </div>

                                            <DatePicker
                                                onChange={(date) => {
                                                    operatingHoursChangeHandler(date, 'sun', 'to', 'frm');

                                                    if (timeZone === '24') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            sunTo: moment(date)?.format('HH:00'),
                                                        });
                                                    }
                                                    if (timeZone === '12') {
                                                        setTimeValue({
                                                            ...timeValue,
                                                            sunTo: moment(date)?.format('h:00 a'),
                                                        });
                                                    }
                                                }}
                                                showTimeSelect
                                                disabled={!weekToggle['sun']}
                                                showTimeSelectOnly
                                                timeIntervals={60}
                                                value={timeValue?.sunTo}
                                                timeCaption="Time"
                                                dateFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                timeFormat={timeZone === '12' ? 'h:00 aa' : 'HH:00'}
                                                className="time-picker-style"
                                            />
                                        </div>
                                    </>
                                </div>
                            </Row>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row>
                <Col lg={9}>
                    <Card className="custom-card mt-2">
                        <CardHeader>
                            <div>
                                <Typography.Subheader
                                    size={Typography.Sizes.md}
                                    style={{ color: colorPalette.primaryGray550 }}>
                                    Danger Zone
                                </Typography.Subheader>
                            </div>
                        </CardHeader>

                        <CardBody>
                            <div>
                                <Button
                                    label="Delete Building"
                                    size={Button.Sizes.md}
                                    type={Button.Type.secondaryDistructive}
                                    // onClick={deleteBuildingHandler}
                                    icon={<DeleteSVG />}
                                />
                            </div>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </React.Fragment>
    );
};

export default General;
