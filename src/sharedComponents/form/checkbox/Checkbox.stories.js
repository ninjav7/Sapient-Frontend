import React from 'react';

import Checkbox from './Checkbox';

import '../../assets/scss/stories.scss';

export default {
    title: 'Components/Checkbox',
    component: Checkbox,
};

export const Default = (props) => {
    return (
        <>
            <h4 className="mb-4">SM</h4>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                <Checkbox label="Remember me" size={Checkbox.Sizes.sm} {...props} />
                <Checkbox
                    label="Remember me"
                    size={Checkbox.Sizes.sm}
                    description="Save my login details for next time."
                    {...props}
                    checked={true}
                />
                <Checkbox
                    label="Remember me"
                    size={Checkbox.Sizes.sm}
                    description="Save my login details for next time."
                    {...props}
                    autoFocused={true}
                />
                <Checkbox
                    label="Remember me"
                    size={Checkbox.Sizes.sm}
                    description="Save my login details for next time."
                />
                <Checkbox
                    label="Remember me {Disabled} {Checked}"
                    size={Checkbox.Sizes.sm}
                    disabled={true}
                    checked={true}
                    {...props}
                />
                <Checkbox
                    label="Remember me {Disabled} {Unchecked}"
                    size={Checkbox.Sizes.sm}
                    description="Save my login details for next time."
                    disabled={true}
                    {...props}
                />
            </div>

            <h4 className="mb-4">MD</h4>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                <Checkbox label="Remember me" size={Checkbox.Sizes.md} {...props} />
                <Checkbox
                    label="Remember me"
                    size={Checkbox.Sizes.md}
                    description="Save my login details for next time."
                    {...props}
                    checked={true}
                />
                <Checkbox
                    label="Remember me"
                    size={Checkbox.Sizes.md}
                    description="Save my login details for next time."
                    {...props}
                    autoFocused={true}
                />
                <Checkbox
                    label="Remember me"
                    size={Checkbox.Sizes.md}
                    description="Save my login details for next time."
                />
                <Checkbox
                    label="Remember me {Disabled} {Checked}"
                    size={Checkbox.Sizes.md}
                    disabled={true}
                    checked={true}
                    {...props}
                />
                <Checkbox
                    label="Remember me {Disabled} {Unchecked}"
                    size={Checkbox.Sizes.md}
                    description="Save my login details for next time."
                    disabled={true}
                    {...props}
                />
            </div>

            <h4 className="mb-4">Intermediate</h4>
            <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1fr 1fr' }}>
                <Checkbox
                    indeterminate={true}
                    label="Remember me {SM}"
                    size={Checkbox.Sizes.sm}
                    description="Save my login details for next time."
                    {...props}
                />

                <Checkbox
                    indeterminate={true}
                    label="Remember me {MD}"
                    size={Checkbox.Sizes.md}
                    description="Save my login details for next time."
                    {...props}
                />
            </div>
            <h4 className="mb-4">Dropdown List Checkbox</h4>
            <Checkbox.DropDownCheckbox label="Remember me" />
        </>
    );
};

Default.args = {
    readOnly: true,
};
