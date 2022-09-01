import React from 'react';

import Brick from '../../../brick';
import Select from '../index';

import { ReactComponent as ProfileSVG } from '../../../assets/icons/profile.svg';
import AvatarUrl from '../../../assets/images/avatar.png';
import Avatar2Url from '../../../assets/images/avatar2.png';
import Avatar3Url from '../../../assets/images/avatar3.png';

const Multi = (arg) => {
    return (
        <>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 30 }}>
                <div>
                    <h5>Multi Select</h5>

                    <Select.Multi {...arg} label="Columns" />
                    <Brick />
                </div>

                <div>
                    <h5>Multi Select With Icon</h5>

                    <Select.Multi
                        {...arg}
                        label="Columns"
                        type={Select.Multi.Types.Icon}
                        icon={<ProfileSVG style={{ marginRight: 10 }} />}
                    />
                    <Brick />
                </div>

                <div>
                    <h5>Multi Select With Dots</h5>

                    <Select.Multi
                        {...arg}
                        label="Columns"
                        type={Select.Multi.Types.Icon}
                        icon={
                            <div
                                style={{ width: '0.5rem', height: '0.5rem', background: '#12B76A', borderRadius: 100 }}
                            />
                        }
                    />
                    <Brick />
                </div>

                <div>
                    <h5>Multi Select individual img for each option</h5>

                    <Select.Multi
                        {...arg}
                        label="Columns"
                        type={Select.Multi.Types.Icon}
                        options={[
                            {
                                label: 'Phoenix Baker',
                                value: 0,
                                img: <img src={AvatarUrl} alt={''} />,
                            },
                            {
                                label: 'Olivia Rhye',
                                value: 1,
                                img: <img src={Avatar2Url} alt={''} />,
                            },
                            {
                                label: 'Candice Wu',
                                value: 3,
                                img: <img src={Avatar3Url} alt={''} />,
                            },
                        ]}
                    />
                    <Brick />
                </div>

                <div>
                    <h5>Multi Select with Supporting Text</h5>

                    <Select.Multi
                        {...arg}
                        label="Columns"
                        type={Select.Multi.Types.Icon}
                        options={[
                            {
                                label: 'Phoenix Baker',
                                value: 0,
                                supportText: '@phoenix',
                            },
                            {
                                label: 'Olivia Rhye',
                                value: 1,
                                supportText: '@olivia',
                            },
                            {
                                label: 'Candice Wu',
                                value: 3,
                                supportText: '@candice',
                            },
                        ]}
                    />
                    <Brick />
                </div>

                <div>
                    <h5>Multi Select with Charts</h5>

                    <Select.Multi
                        {...arg}
                        label="Columns"
                        type={Select.Multi.Types.Chart}
                        options={[
                            {
                                label: 'Phoenix Baker',
                                value: 0,
                                supportText: '@phoenix',
                                labelChart: '1,524 kWh',
                                percentChart: '44',
                            },
                            {
                                label: 'Olivia Rhye',
                                value: 1,
                                supportText: '@olivia',
                                labelChart: '1,203 kWh',
                                percentChart: '40',
                            },
                            {
                                label: 'Candice Wu',
                                value: 3,
                                supportText: '@candice',
                                labelChart: '14 kWh',
                                percentChart: '88',
                            },
                        ]}
                    />
                    <Brick />
                </div>

                <div>
                    <h5>Default with disabled</h5>

                    <Select.Multi
                        {...arg}
                        label="Columns"
                        options={[...arg.options, { label: 'Disabled', value: 10, isDisabled: true }]}
                    />
                    <Brick />
                </div>

                <div>
                    <h5>Default with selected disabled</h5>

                    <Select.Multi
                        {...arg}
                        label="Columns"
                        value={[{ label: 'Disabled', value: 10, isDisabled: true }]}
                        options={[...arg.options, { label: 'Disabled', value: 10, isDisabled: true }]}
                    />
                    <Brick />
                </div>

                <div>
                    <h5>Multi Select With Search</h5>

                    <Select.Multi {...arg} label="Columns" isSearchable={true} />
                    <Brick />
                </div>
            </div>
        </>
    );
};

Multi.args = {
    options: [
        {
            label: 'Today',
            value: 0,
        },
        {
            label: 'Last 7 Days',
            value: 7,
        },
        {
            label: 'Year',
            value: 12,
        },
    ],
    isSelectAll: true,
};

export { Multi };
