import React from 'react';
import Brick from '../../brick';
import Input from './Input';
import InputTooltip from './InputTooltip';

import { ReactComponent as EyeSVG } from '../../assets/icons/eye.svg';

export default {
    title: 'Components/Input',
    component: Input,
    argTypes: {
        inputClassName: {
            control: false,
        },
        className: {
            control: false,
        },
    },
};

export const Default = (props) => {
    return (
        <>
            <InputTooltip {...props} tooltipText="Help text" />
            <Brick />
            <Input {...props} />
            <Brick />
            <Input {...props} elementEnd={<EyeSVG />} />
            <Brick />
            <Input {...props} elementEnd={<EyeSVG />} error={'This is a error message.'} iconUrl={undefined} />
            <Brick />
            <Input label="Label text" />
            <Brick />
            <Input label="is required text" required={true} />
            <Brick />
            <InputTooltip disabled tooltipText="Help text" label="Input with Label text and Tooltip" />
            <Brick />
            <InputTooltip disabled tooltipText="Help text" label="Input with Tooltip and with Error" error="Error message" />
            <Brick />
            <h5>Placeholder</h5>
            <Input placeholder='olivia@untitledui.com' disabled />
            <Brick />
            <h5>Disabled</h5>
            <Input value='olivia@untitledui.com' disabled />
            <Brick />
            <h5>Focused</h5>
            <Input value='olivia@untitledui.com' autoFocus />
        </>
    );
};

Default.args = {
    iconUrl:
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA20lEQVRIie3UwWkCQRjF8R96E0wBgthCQLCGSAh4sYW0kBbSQlrwkkOqEIS0EFZTQALeDOaQGRJ1XCfuHkT8w8cM+z3eY3Z3Pi6cErdYYF2x5himAuY1mMcqUgGxWZUNn0ZC8ILeEcYdTHKS11jiAc0M4wbu8bnlsTfgDm9h/4pBifk1pkH7jnFOALTwiBW+8ISrP9pUv53w2RsQ6WPm988YhSrCs1nQHPIpbcR3/CHvG/07INLFc6huie7ogFwO3oNaOa+ARVirDjp+BucOQ/VM1AI3FQ59oWa+AW9OicfASLwRAAAAAElFTkSuQmCC',
};
