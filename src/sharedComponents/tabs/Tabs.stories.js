import React from 'react';
import Tabs from './Tabs';
import '../assets/scss/stories.scss';
import Brick from '../brick';

export default {
    title: 'Components/Tabs',
    component: Tabs,
};

export const Default = () => {
    return (
        <>
            <h6>Large Tabs</h6>
            <Tabs type={Tabs.Types.large}>
                <Tabs.Item eventKey="home" title="home">
                    home
                </Tabs.Item>
                <Tabs.Item eventKey="profile" title="Profile">
                    profile
                </Tabs.Item>
                <Tabs.Item eventKey="contact" title="Contact">
                    contact
                </Tabs.Item>
            </Tabs>

            <Brick sizeInRem={2} />

            <h6>Subsection Tabs</h6>
            <Tabs type={Tabs.Types.subsection}>
                <Tabs.Item eventKey="home" title="home">
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
    );
};
