import React, { useState, useEffect } from 'react';
import { Row, Col, Card, CardBody, Form, FormGroup, Label, Input, CardHeader, Button, Spinner } from 'reactstrap';
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
    singleBuildingDetail,
} from '../../services/Network';
import axios from 'axios';
import moment from 'moment';
import { BuildingStore, BuildingListStore } from '../../store/BuildingStore';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { buildingData, userPermissionData } from '../../store/globalState';
import DropDownInput from '../../components/DropdownInput/DropDownInput';
import { Prompt } from 'react-router-dom';
import Select from 'react-select';

const General = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const _ = require('lodash');
    const [selectedTimezone, setSelectedTimezone] = useState({});
    const [isEditing, setIsEditing] = useState(false);

    // const [buildingData, setBuildingData] = useState({});

    const [shouldBlockNavigation, setShouldBlockNavigation] = useState(false);
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

    const [bldgData, setBldgData] = useState({});
    console.log(bldgData, 'bldgData');
    const [isbuildingDetailsFetched, setIsbuildingDetailsFetched] = useState(true);
    const [buildingDetails, setBuildingDetails] = useState({});
    const [buildingAddress, setBuildingAddress] = useState({});
    const [buildingDateTime, setBuildingDateTime] = useState({});
    const [buildingOperatingHours, setBuildingOperatingHours] = useState({});
    const [responseBuildingDetails, setResponseBuildingDetails] = useState({});
    const [responseBuildingAddress, setResponseBuildingAddress] = useState({});
    const [responseBuildingDateTime, setResponseBuildingDateTime] = useState({});
    const [responseBuildingOperatingHours, setResponseBuildingOperatingHours] = useState({});

    const [textLocation, settextLocation] = useState('');
    console.log('textLocation', textLocation.split(' ').join('+'));

    // TODO:
    const buildingId = localStorage.getItem('buildingId');

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

    console.log('timeValue', timeValue);

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

    console.log('buildingOperatingHours', buildingOperatingHours);
    console.log(
        'moment(buildingOperatingHours)',
        moment(buildingOperatingHours?.operating_hours?.mon?.time_range?.frm).format('HH:MM')
    );

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
                        console.log('Data1 => ', data1);

                        console.log('Data2 => ', data2);

                        console.log('Data3 => ', data3);
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
        } catch (error) {
            console.log('Failed to save General Building Data');
        }
    };

    const [buildingDataList, setBuildingDataList] = useState();

    // TODO:
    const singleDataBuildingList = async () => {
        let header = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };

        axios
            .get(`${BaseUrl}${singleBuildingDetail}?building_id=${buildingId}`, {
                headers: header,
            })
            .then((res) => {
                console.log('buildingDataListNow', res?.data);
                setBuildingDataList(res?.data?.data);
            })
            .catch((err) => {
                console.log(err, 'buildinDataError');
            });
    };

    useEffect(() => {
        singleDataBuildingList();
    }, []);

    const [buildingListData] = useAtom(buildingData);

    console.log('buildingListData', buildingListData);

    const fetchBuildingData = async () => {
        let fixing = true;

        setIsbuildingDetailsFetched(true);

        if (fixing) {
            let data = {};
            if (bldgId) {
                data = buildingDataList;
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
            setIsbuildingDetailsFetched(false);
            // });
        }
    };

    useEffect(() => {
        if (buildingDataList) {
            fetchBuildingData();
        }
    }, [bldgId, buildingDataList]);

    useEffect(() => {
        let fixing = true;

        const fetchBuildingData = async () => {
            setIsbuildingDetailsFetched(true);
            if (fixing) {
                let data = {};
                if (bldgId) {
                    data = buildingDataList;
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
                    // console.log(buildingData);
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
                setIsbuildingDetailsFetched(false);
                // });
            }
            // setBuildingData(data);
            setIsbuildingDetailsFetched(false);
            // });
        };

        fetchBuildingData();
    }, [render, buildingDataList]);

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
        // console.log(e.target.name);

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
        // console.log('obj.active', obj.active);
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
        setShouldBlockNavigation(true);
    };

    const deleteBuildingHandler = () => {
        var answer = window.confirm("'Are you sure wants o delete!!!'");

        if (answer) {
            //some code

            // console.log("'Are you sure wants o delete!!!'");

            // console.log('helloo');

            const headers = {
                'Content-Type': 'application/json',

                accept: 'application/json',

                Authorization: `Bearer ${userdata.token}`,
            };

            axios.delete(`${BaseUrl}${generalBldgDelete}/${bldgId}`, { headers }).then((res) => {
                console.log(res.data);

                setRender(!render);
            });
        }
    };

    const operatingHoursChangeHandler = (date, day, type1, type2) => {
        const time1 = moment(date).format('HH:MM');

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

    const typeOptions = [
        { value: 'Office Building', label: 'Office Building' },
        { value: 'Residential Building', label: 'Residential Building' },
    ];

    const [getResponseOfPlaces, setGetResponseOfPlaces] = useState();
    console.log(getResponseOfPlaces, 'getResponseOfPlaces');
    const [selectedPlaceLabel, setSelectedPlaceLabel] = useState('');
    const [totalSelectedData, setTotalSelectedData] = useState();
    console.log('totalSelectedData', totalSelectedData);
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
        getPlacesAutocomplete();
        // getGooglePlacesAutocomplete();
    }, [textLocation]);

    const [userPermission] = useAtom(userPermissionData);

    // update section end

    return (
        <React.Fragment>
            <Prompt when={shouldBlockNavigation} message="Are you sure you want to leave the page?" />
            <Row className="page-title">
                <Col lg={8}>
                    <div className="building-heading-container">
                        <div className="heading-style">General Building Settings</div>

                        {userPermission?.user_role === 'admin' ||
                        userPermission?.permissions?.permissions?.building_details_permission?.edit ? (
                            <div>
                                {isbuildingDetailsFetched ? (
                                    <Skeleton count={1} height={40} width={150} />
                                ) : (
                                    <>
                                        <button
                                            type="button"
                                            className="btn btn-default buildings-cancel-style"
                                            onClick={() => {
                                                setIsEditing(false);
                                                setShouldBlockNavigation(false);
                                                fetchBuildingData();
                                            }}>
                                            Cancel
                                        </button>
                                        {loadButton ? (
                                            <Button color="primary" disabled>
                                                <Spinner size="sm">Loading...</Spinner>
                                                <span> Saving</span>
                                            </Button>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-primary buildings-save-style ml-3"
                                                onClick={() => {
                                                    setLoadButton(true);
                                                    saveBuildingSettings();
                                                }}>
                                                Save
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
                        ) : (
                            ''
                        )}
                    </div>
                </Col>
            </Row>
            {userPermission?.user_role === 'admin' ||
            (buildingDetails && userPermission?.permissions?.permissions?.building_details_permission?.view) ? (
                <>
                    <Row>
                        <Col lg={8}>
                            <Card className="custom-card card-alignment">
                                <CardHeader>
                                    <h5 className="building-section-title" style={{ margin: '2px' }}>
                                        Building Details
                                    </h5>
                                </CardHeader>

                                <CardBody>
                                    <Form>
                                        <div className="grid-style-3">
                                            <FormGroup>
                                                <div className="single-line-style">
                                                    <h6 className="building-content-title">Active</h6>

                                                    <h6
                                                        className="building-content-subtitle mb-2"
                                                        htmlFor="customSwitches">
                                                        Non-admin users can only view active buildings.
                                                    </h6>
                                                </div>
                                            </FormGroup>

                                            <FormGroup>
                                                {isbuildingDetailsFetched ? (
                                                    <Skeleton count={1} height={35} width={75} />
                                                ) : (
                                                    <Switch
                                                        onChange={() => {
                                                            handleSwitchChange();
                                                        }}
                                                        checked={buildingDetails.active}
                                                        onColor={'#2955E7'}
                                                        uncheckedIcon={false}
                                                        checkedIcon={false}
                                                        className="react-switch"
                                                        disabled={
                                                            userPermission?.permissions?.permissions
                                                                ?.building_details_permission?.edit === false
                                                        }
                                                    />
                                                )}
                                            </FormGroup>

                                            <FormGroup>
                                                <div className="single-line-style">
                                                    <h6 className="building-content-title">Building Name</h6>

                                                    <h6 className="building-content-subtitle mb-2">
                                                        A human-friendly display name for this building
                                                    </h6>
                                                </div>
                                            </FormGroup>

                                            <FormGroup>
                                                {isbuildingDetailsFetched ? (
                                                    <Skeleton count={1} height={35} width={350} />
                                                ) : (
                                                    <div className="singleline-box-style">
                                                        <Input
                                                            type="text"
                                                            name="name"
                                                            id="buildingName"
                                                            disabled={
                                                                userPermission?.permissions?.permissions
                                                                    ?.building_details_permission?.edit === false
                                                            }
                                                            onChange={(e) => {
                                                                console.log(e.target.value, 'buildingObj');
                                                                localStorage.setItem(
                                                                    'generalBuildingName',
                                                                    e.target.value
                                                                );
                                                                handleBldgSettingChanges('name', e.target.value);
                                                            }}
                                                            // onBlur={EditBuildingHandler}

                                                            placeholder="Enter Building Name"
                                                            className="single-line-style font-weight-bold"
                                                            value={buildingDetails.name}
                                                        />
                                                    </div>
                                                )}
                                            </FormGroup>

                                            <FormGroup>
                                                <div className="single-line-style">
                                                    <h6 className="building-content-title">Type</h6>

                                                    <h6 className="building-content-subtitle mb-2">
                                                        The primary use/type of this building
                                                    </h6>
                                                </div>
                                            </FormGroup>

                                            <FormGroup>
                                                {isbuildingDetailsFetched ? (
                                                    <Skeleton count={1} height={35} width={350} />
                                                ) : (
                                                    <div className="singleline-box-style">
                                                        {/* <Input
                                                            type="select"
                                                            name="typee"
                                                            id="exampleSelect"
                                                            disabled={
                                                                userPermission?.permissions?.permissions
                                                                    ?.building_details_permission?.edit === false
                                                            }
                                                            onChange={(e) => {
                                                                handleBldgSettingChanges('typee', e.target.value);
                                                                localStorage.setItem(
                                                                    'generalBuildingType',
                                                                    e.target.value
                                                                );
                                                            }}
                                                            

                                                            value={buildingDetails.typee}
                                                            className="font-weight-bold">
                                                            <option>Office Building</option>

                                                            <option>Residential Building</option>
                                                        </Input> */}
                                                        <Select
                                                            id="exampleSelect"
                                                            defaultValue={typeOptions[0]}
                                                            options={typeOptions}
                                                            name="typee"
                                                            isSearchable={true}
                                                            isDisabled={
                                                                userPermission?.permissions?.permissions
                                                                    ?.building_details_permission?.edit === false
                                                            }
                                                            onChange={(e) => {
                                                                console.log('e', e.value);
                                                                handleBldgSettingChanges('typee', e.value);
                                                                localStorage.setItem('generalBuildingType', e.value);
                                                            }}
                                                            className="font-weight-bold"
                                                        />
                                                    </div>
                                                )}
                                            </FormGroup>

                                            <FormGroup>
                                                <div className="single-line-style">
                                                    <h6 className="building-content-title">Square Footage</h6>

                                                    <h6 className="building-content-subtitle mb-2">
                                                        The total square footage of this building
                                                    </h6>
                                                </div>
                                            </FormGroup>

                                            <FormGroup>
                                                {isbuildingDetailsFetched ? (
                                                    <Skeleton count={1} height={35} width={350} />
                                                ) : (
                                                    <div className="singleline-box-style">
                                                        <Input
                                                            type="text"
                                                            name="square_footage"
                                                            id="exampleNumber"
                                                            placeholder="Enter value"
                                                            disabled={
                                                                userPermission?.permissions?.permissions
                                                                    ?.building_details_permission?.edit === false
                                                            }
                                                            onChange={(e) => {
                                                                handleBldgSettingChanges(
                                                                    'square_footage',
                                                                    +e.target.value
                                                                );
                                                                localStorage.setItem(
                                                                    'generalSquareFootage',
                                                                    e.target.value
                                                                );
                                                            }}
                                                            // onBlur={EditBuildingHandler}

                                                            value={buildingDetails.square_footage}
                                                            className="font-weight-bold"
                                                        />
                                                    </div>
                                                )}
                                            </FormGroup>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={8}>
                            <Card className="custom-card card-alignment">
                                <CardHeader>
                                    <h5 className="building-section-title" style={{ margin: '2px' }}>
                                        Address
                                    </h5>
                                </CardHeader>

                                <CardBody>
                                    <Form>
                                        <div className="grid-style-1">
                                            <FormGroup>
                                                <Label for="userAddress1" className="building-content-title">
                                                    Street Address
                                                </Label>

                                                {isbuildingDetailsFetched ? (
                                                    <Skeleton count={1} height={35} width={200} />
                                                ) : (
                                                    <div style={{ position: 'absolute' }}>
                                                        <Input
                                                            type="text"
                                                            name="street_address"
                                                            disabled={
                                                                userPermission?.permissions?.permissions
                                                                    ?.building_details_permission?.edit === false
                                                            }
                                                            id="userAddress1"
                                                            placeholder="Address 1"
                                                            onChange={(e) => {
                                                                handleBldgSettingChanges(
                                                                    'street_address',
                                                                    e.target.value
                                                                );
                                                                settextLocation(e.target.value);
                                                                console.log(
                                                                    'e.target.valueBuildingAddress',
                                                                    e.target.value
                                                                );
                                                                if (getResponseOfPlaces) {
                                                                    setopenDropdown(true);
                                                                }
                                                            }}
                                                            className="font-weight-bold"
                                                            value={selectedPlaceLabel || buildingAddress.street_address}
                                                        />
                                                        {openDropdown && (
                                                            <div
                                                                style={{
                                                                    backgroundColor: 'white',
                                                                    border: '1px solid black',
                                                                    zIndex: 1000,
                                                                }}>
                                                                {getResponseOfPlaces?.features?.map((item) => {
                                                                    return (
                                                                        <div
                                                                            className="onchangedrowpdown"
                                                                            onClick={() => {
                                                                                console.log(
                                                                                    item,
                                                                                    'clickedgetResponseOfPlaces'
                                                                                );
                                                                                setSelectedPlaceLabel(
                                                                                    item?.properties?.label
                                                                                );
                                                                                localStorage.setItem(
                                                                                    'generalStreetAddress',
                                                                                    item?.properties?.label
                                                                                );
                                                                                setTotalSelectedData(item);
                                                                                setopenDropdown(false);
                                                                            }}>
                                                                            {item?.properties?.label}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label for="userAddress2" className="building-content-title">
                                                    Address 2 (optional)
                                                </Label>

                                                {isbuildingDetailsFetched ? (
                                                    <Skeleton count={1} height={35} width={200} />
                                                ) : (
                                                    <Input
                                                        type="text"
                                                        name="address_2"
                                                        id="userAddress2"
                                                        placeholder="Address 2"
                                                        className="font-weight-bold"
                                                        disabled={
                                                            userPermission?.permissions?.permissions
                                                                ?.building_details_permission?.edit === false
                                                        }
                                                        onChange={(e) => {
                                                            handleBldgSettingChanges('address_2', e.target.value);
                                                            localStorage.setItem(
                                                                'generalStreetAddress2',
                                                                e.target.value
                                                            );
                                                        }}
                                                        value={buildingAddress.address_2}
                                                    />
                                                )}
                                            </FormGroup>
                                        </div>

                                        <div className="grid-style-2">
                                            <FormGroup>
                                                <Label for="userCity" className="building-content-title">
                                                    City
                                                </Label>

                                                {isbuildingDetailsFetched ? (
                                                    <Skeleton count={1} height={35} width={200} />
                                                ) : (
                                                    <Input
                                                        type="text"
                                                        name="city"
                                                        id="userCity"
                                                        placeholder="Enter your city"
                                                        className="font-weight-bold"
                                                        disabled={
                                                            userPermission?.permissions?.permissions
                                                                ?.building_details_permission?.edit === false
                                                        }
                                                        onChange={(e) => {
                                                            handleBldgSettingChanges('city', e.target.value);
                                                            localStorage.setItem(
                                                                'generalCity',
                                                                totalSelectedData?.properties?.locality
                                                            );
                                                        }}
                                                        value={
                                                            totalSelectedData?.properties?.locality ||
                                                            buildingAddress.city
                                                        }
                                                    />
                                                )}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label for="userState" className="building-content-title">
                                                    State
                                                </Label>

                                                {isbuildingDetailsFetched ? (
                                                    <Skeleton count={1} height={35} width={200} />
                                                ) : (
                                                    <Input
                                                        type="text"
                                                        name="state"
                                                        id="userState"
                                                        disabled={
                                                            userPermission?.permissions?.permissions
                                                                ?.building_details_permission?.edit === false
                                                        }
                                                        value={
                                                            totalSelectedData?.properties?.region ||
                                                            buildingAddress.state
                                                        }
                                                        onChange={(e) => {
                                                            handleBldgSettingChanges('state', e.target.value);
                                                            localStorage.setItem(
                                                                'generalState',
                                                                totalSelectedData?.properties?.region
                                                            );
                                                        }}
                                                        className="font-weight-bold"
                                                    />
                                                )}
                                            </FormGroup>

                                            <FormGroup>
                                                <Label for="useZipCode" className="building-content-title">
                                                    Zip
                                                </Label>

                                                {isbuildingDetailsFetched ? (
                                                    <Skeleton count={1} height={35} width={200} />
                                                ) : (
                                                    <Input
                                                        type="number"
                                                        name="zip_code"
                                                        id="useZipCode"
                                                        placeholder="Enter zip code"
                                                        value={buildingAddress.zip_code}
                                                        disabled={
                                                            userPermission?.permissions?.permissions
                                                                ?.building_details_permission?.edit === false
                                                        }
                                                        onChange={(e) => {
                                                            handleBldgSettingChanges('zip_code', +e.target.value);
                                                            localStorage.setItem('generalZipCode', +e.target.value);
                                                        }}
                                                        className="font-weight-bold"
                                                    />
                                                )}
                                            </FormGroup>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={8}>
                            <Card className="custom-card card-alignment">
                                <CardHeader>
                                    <h5 className="building-section-title" style={{ margin: '2px' }}>
                                        Date & Time
                                    </h5>
                                </CardHeader>

                                <CardBody>
                                    <Form>
                                        <div className="grid-style-4">
                                            <div className="single-line-style">
                                                <h6 className="building-content-title">Timezone</h6>
                                            </div>

                                            <div className="single-line-style">
                                                {isbuildingDetailsFetched ? (
                                                    <Skeleton count={1} height={25} width={150} />
                                                ) : (
                                                    <h6 className="building-content-title">
                                                        {buildingDateTime.timezone}
                                                    </h6>
                                                )}
                                            </div>

                                            <div className="single-line-style">
                                                <h6 className="building-content-title">Use 24-hour Clock</h6>
                                            </div>

                                            <div>
                                                {isbuildingDetailsFetched ? (
                                                    <Skeleton count={1} height={25} width={150} />
                                                ) : (
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
                                                        onColor={'#2955E7'}
                                                        disabled={
                                                            userPermission?.permissions?.permissions
                                                                ?.building_details_permission?.edit === false
                                                        }
                                                        name="time_format"
                                                        uncheckedIcon={false}
                                                        checkedIcon={false}
                                                        className="react-switch"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    <Row>
                        <Col lg={8}>
                            <Card className="custom-card card-alignment">
                                <CardHeader>
                                    <h5 className="building-section-title" style={{ margin: '2px' }}>
                                        Operating Hours
                                    </h5>
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
                                                        style={{ position: 'relative' }}
                                                        onChange={(date) => {
                                                            console.log('moment(date)', moment(date).format('HH:MM'));
                                                            operatingHoursChangeHandler(date, 'mon', 'frm', 'to');
                                                            setTimeValue({
                                                                ...timeValue,
                                                                monFrom: moment(date).format(),
                                                            });
                                                        }}
                                                        disabled={!weekToggle['mon']}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.monFrom)?.format('h:mm a')
                                                                : moment(timeValue?.monFrom)?.format('HH:MM')
                                                        }
                                                        timeIntervals={60}
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '24' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        className="time-picker-style"
                                                    />
                                                    {console.log(timeValue?.monFrom, 'timeValue?.monFrom')}

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

                                                            setTimeValue({
                                                                ...timeValue,
                                                                monTo: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        disabled={!weekToggle['mon']}
                                                        timeIntervals={60}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.monTo)?.format('h:mm a')
                                                                : moment(timeValue?.monTo)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
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

                                                            setTimeValue({
                                                                ...timeValue,
                                                                tueFrom: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        disabled={!weekToggle['tue']}
                                                        timeIntervals={60}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.tueFrom)?.format('h:mm a')
                                                                : moment(timeValue?.tueFrom)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        className="time-picker-style"
                                                    />

                                                    <div className="spacing"> to </div>

                                                    <DatePicker
                                                        // selected={dateHandler(inputField.operating_hours, 'tue').to}

                                                        onChange={(date) => {
                                                            operatingHoursChangeHandler(date, 'tue', 'to', 'frm');

                                                            setTimeValue({
                                                                ...timeValue,
                                                                tueTo: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        timeIntervals={60}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.tueTo)?.format('h:mm a')
                                                                : moment(timeValue?.tueTo)?.format('HH:MM')
                                                        }
                                                        disabled={!weekToggle['tue']}
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
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

                                                            setTimeValue({
                                                                ...timeValue,
                                                                wedFrom: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        timeIntervals={60}
                                                        disabled={!weekToggle['wed']}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.wedFrom)?.format('h:mm a')
                                                                : moment(timeValue?.wedFrom)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        className="time-picker-style"
                                                    />

                                                    <div className="spacing"> to </div>

                                                    <DatePicker
                                                        // selected={dateHandler(inputField.operating_hours, 'wed').to}

                                                        onChange={(date) => {
                                                            operatingHoursChangeHandler(date, 'wed', 'to', 'frm');

                                                            setTimeValue({
                                                                ...timeValue,
                                                                wedTo: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        disabled={!weekToggle['wed']}
                                                        timeIntervals={60}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.wedTo)?.format('h:mm a')
                                                                : moment(timeValue?.wedTo)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
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

                                                            setTimeValue({
                                                                ...timeValue,
                                                                thuFrom: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        timeIntervals={60}
                                                        disabled={!weekToggle['thu']}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.thuFrom)?.format('h:mm a')
                                                                : moment(timeValue?.thuFrom)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        className="time-picker-style"
                                                    />

                                                    <div className="spacing"> to </div>

                                                    <DatePicker
                                                        // selected={dateHandler(inputField.operating_hours, 'thu').to}

                                                        onChange={(date) => {
                                                            operatingHoursChangeHandler(date, 'thu', 'to', 'frm');

                                                            setTimeValue({
                                                                ...timeValue,
                                                                thuTo: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        timeIntervals={60}
                                                        disabled={!weekToggle['thu']}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.thuTo)?.format('h:mm a')
                                                                : moment(timeValue?.thuTo)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
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

                                                            setTimeValue({
                                                                ...timeValue,
                                                                friFrom: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        disabled={!weekToggle['fri']}
                                                        timeIntervals={60}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.friFrom)?.format('h:mm a')
                                                                : moment(timeValue?.friFrom)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        className="time-picker-style"
                                                    />

                                                    <div className="spacing"> to </div>

                                                    <DatePicker
                                                        // selected={dateHandler(inputField.operating_hours, 'fri').to}

                                                        onChange={(date) => {
                                                            operatingHoursChangeHandler(date, 'fri', 'to', 'frm');

                                                            setTimeValue({
                                                                ...timeValue,
                                                                friTo: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        timeIntervals={60}
                                                        disabled={!weekToggle['fri']}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.friTo)?.format('h:mm a')
                                                                : moment(timeValue?.friTo)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
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

                                                            setTimeValue({
                                                                ...timeValue,
                                                                satFrom: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        disabled={!weekToggle['sat']}
                                                        timeIntervals={60}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.satFrom)?.format('h:mm a')
                                                                : moment(timeValue?.satFrom)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        className="time-picker-style"
                                                    />

                                                    <div className="spacing"> to </div>

                                                    <DatePicker
                                                        // selected={dateHandler(inputField.operating_hours, 'sat').to}

                                                        onChange={(date) => {
                                                            operatingHoursChangeHandler(date, 'sat', 'to', 'frm');

                                                            setTimeValue({
                                                                ...timeValue,
                                                                satTo: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        disabled={!weekToggle['sat']}
                                                        timeIntervals={60}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.satTo)?.format('h:mm a')
                                                                : moment(timeValue?.satTo)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
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

                                                            setTimeValue({
                                                                ...timeValue,
                                                                sunFrom: moment(date).format(),
                                                            });
                                                        }}
                                                        disabled={!weekToggle['sun']}
                                                        showTimeSelect
                                                        showTimeSelectOnly
                                                        timeIntervals={60}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.sunFrom)?.format('h:mm a')
                                                                : moment(timeValue?.sunFrom)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        className="time-picker-style"
                                                    />

                                                    <div className="spacing"> to </div>

                                                    <DatePicker
                                                        onChange={(date) => {
                                                            operatingHoursChangeHandler(date, 'sun', 'to', 'frm');

                                                            setTimeValue({
                                                                ...timeValue,
                                                                sunTo: moment(date).format(),
                                                            });
                                                        }}
                                                        showTimeSelect
                                                        disabled={!weekToggle['sun']}
                                                        showTimeSelectOnly
                                                        timeIntervals={60}
                                                        value={
                                                            timeZone === '12'
                                                                ? moment(timeValue?.sunTo)?.format('h:mm a')
                                                                : moment(timeValue?.sunTo)?.format('HH:MM')
                                                        }
                                                        timeCaption="Time"
                                                        dateFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
                                                        timeFormat={timeZone === '12' ? 'h:mm aa' : 'HH:MM'}
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
                        <Col lg={8}>
                            <Card className="custom-card card-alignment">
                                <CardHeader>
                                    <h5 className="header-title" style={{ margin: '2px' }}>
                                        Danger Zone
                                    </h5>
                                </CardHeader>

                                <CardBody>
                                    <Form>
                                        <FormGroup>
                                            {isbuildingDetailsFetched ? (
                                                <Skeleton count={1} height={40} width={150} />
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={deleteBuildingHandler}
                                                    disabled={
                                                        userPermission?.permissions?.permissions
                                                            ?.building_details_permission?.delete === false
                                                    }
                                                    className="btn btn-md btn-danger font-weight-bold trash-button-style">
                                                    <i className="uil uil-trash mr-2"></i>Delete Building
                                                </button>
                                            )}
                                        </FormGroup>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </>
            ) : (
                <>
                    {buildingDetails && userPermission ? (
                        <p>You do not have the permision of this page</p>
                    ) : (
                        <Skeleton count={3} />
                    )}
                </>
            )}
        </React.Fragment>
    );
};

export default General;
