import React from 'react';
import DropDown from './DropDown';
import '../../assets/scss/stories.scss';

export default {
    title: 'Components/DropDown',
    component: DropDown,
};

const DropDownMenu = (props) => {
    return (
        <DropDown triggerButton={<button>Click me and scroll</button>} {...props}>
            <div
                style={{
                    width: 220,
                    height: 220,
                    border: '1px solid #EAECF0',
                    boxShadow: '0px 10px 24px -4px rgba(16, 24, 40, 0.08), 0 6px 8px -4px rgba(16, 24, 40, 0.03)',
                }}>
                I am a content
            </div>
        </DropDown>
    );
};

export const Default = () => {
    return (
        <div
            style={{
                width: 500,
                height: 500,
                overflow: 'scroll',
                borderStyle: 'solid',
            }}>
            <div
                style={{
                    width: 1000,
                    height: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                <DropDownMenu style={{ margin: 'auto', width: 500, height: 200 }} />
            </div>
        </div>
    );
};
