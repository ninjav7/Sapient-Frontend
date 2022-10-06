import React from 'react';
import Tabs from './Tabs';
import '../assets/scss/stories.scss';
import { Badge } from '../badge';

export default {
    title: 'Components/Tabs',
    component: Tabs,
};

export const Default = () => {
    return (
        <>
            <Tabs>
                <Tabs.Item eventKey="home" title='home'>
                    home
                </Tabs.Item>
                <Tabs.Item eventKey="profile" title="Profile">
                    profile
                </Tabs.Item>
                <Tabs.Item eventKey="contact" title="Contact">
                    contact
                </Tabs.Item>
            </Tabs>
        </>
    )
};