import React, { useState, useEffect } from 'react';
import { Row, Col, CardHeader } from 'reactstrap';
import { Cookies } from 'react-cookie';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import colorPalette from '../../../assets/scss/_colors.scss';
import Select from '../../../sharedComponents/form/select';
import { dateFormatsList, timeFormatsList, untitsList } from './utils.js';
import { UserStore } from '../../../store/UserStore';

const UserPreference = () => {
    const cookies = new Cookies();
    const user = cookies.get('user');

    const dateFormat = UserStore.useState((s) => s.dateFormat);
    const timeFormat = UserStore.useState((s) => s.timeFormat);
    const unit = UserStore.useState((s) => s.unit);

    console.log('SSR Sudhanshu dateFormat => ', dateFormat);
    console.log('SSR Sudhanshu timeFormat => ', timeFormat);
    console.log('SSR Sudhanshu unit => ', unit);
    console.log('SSR Sudhanshu userPrefObj => ', userPrefObj);
    console.log('SSR Sudhanshu userPrefObj => ', user);

    const [userPrefObj, setUserPrefObj] = useState(null);
    const [isProcessing, setProcessing] = useState(false);

    const handleChange = (key, value) => {
        let obj = Object.assign({}, userPrefObj);
        obj[key] = value;
        setUserPrefObj(obj);
    };

    const updateBreadcrumbStore = () => {
        BreadcrumbStore.update((bs) => {
            let newList = [
                {
                    label: 'User Preference',
                    path: '/settings/user-preference',
                    active: true,
                },
            ];
            bs.items = newList;
        });
        ComponentStore.update((s) => {
            s.parent = 'account';
        });
    };

    useEffect(() => {
        let obj = {
            date_format: dateFormat ? dateFormat : null,
            time_format: timeFormat ? timeFormat : null,
            unit: unit ? unit : null,
        };
        setUserPrefObj(obj);
    }, [dateFormat, timeFormat, unit]);

    useEffect(() => {
        updateBreadcrumbStore();
    }, []);

    return (
        <React.Fragment>
            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <Typography.Header size={Typography.Sizes.lg}>{`User Preference`}</Typography.Header>
                        </div>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={1.5} />

            <Row>
                <Col lg={12}>
                    <div className="d-flex justify-content-between">
                        <div>
                            <Typography.Header size={Typography.Sizes.md}>{`${user?.name}`}</Typography.Header>
                            <Typography.Subheader size={Typography.Sizes.lg}>{`${user?.email}`}</Typography.Subheader>
                        </div>
                        <div>
                            <div className="d-flex">
                                <Button label="Cancel" size={Button.Sizes.md} type={Button.Type.secondaryGrey} />
                                <Button
                                    label={'Save'}
                                    size={Button.Sizes.md}
                                    type={Button.Type.primary}
                                    className="ml-2"
                                    disabled={isProcessing}
                                />
                            </div>
                        </div>
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
                                {`User Profile`}
                            </Typography.Subheader>
                        </CardHeader>

                        <div className="p-4">
                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <div className="w-50">
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}>{`Date Format`}</Typography.Subheader>
                                </div>
                                <div className="w-50">
                                    <Select
                                        options={dateFormatsList}
                                        placeholder="Select Date Format"
                                        currentValue={dateFormatsList.filter(
                                            (option) => option.value === userPrefObj?.date_format
                                        )}
                                        onChange={(e) => {
                                            handleChange('date_format', e.value);
                                        }}
                                    />
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <div className="w-50">
                                    <Typography.Subheader
                                        size={Typography.Sizes.md}>{`Time Format`}</Typography.Subheader>
                                </div>
                                <div className="w-50">
                                    <Select
                                        options={timeFormatsList}
                                        placeholder="Select Time Format"
                                        currentValue={timeFormatsList.filter(
                                            (option) => option.value === userPrefObj?.time_format
                                        )}
                                        onChange={(e) => {
                                            handleChange('time_format', e.value);
                                        }}
                                    />
                                </div>
                            </div>

                            <Brick sizeInRem={1} />

                            <div className="d-flex w-100 justify-content-between align-items-center">
                                <div className="w-50">
                                    <Typography.Subheader size={Typography.Sizes.md}>{`Units`}</Typography.Subheader>
                                </div>
                                <div className="w-50">
                                    <Select
                                        options={untitsList}
                                        placeholder="Select Units"
                                        currentValue={untitsList.filter((option) => option.value === userPrefObj?.unit)}
                                        onChange={(e) => {
                                            handleChange('unit', e.value);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>

            <Brick sizeInRem={2} />
        </React.Fragment>
    );
};

export default UserPreference;
