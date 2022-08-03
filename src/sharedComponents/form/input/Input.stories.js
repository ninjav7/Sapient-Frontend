import React from 'react';
import Input from "./Input";

export default  {
    title: "Components/Input",
    component: Input,
    argTypes: {
        inputClassName: {
            control: false,
        },
        className: {
            control: false,
        },
    },
}

export const Default = (arg) => <Input {...arg} />

Default.args = {
    iconUrl: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAA20lEQVRIie3UwWkCQRjF8R96E0wBgthCQLCGSAh4sYW0kBbSQlrwkkOqEIS0EFZTQALeDOaQGRJ1XCfuHkT8w8cM+z3eY3Z3Pi6cErdYYF2x5himAuY1mMcqUgGxWZUNn0ZC8ILeEcYdTHKS11jiAc0M4wbu8bnlsTfgDm9h/4pBifk1pkH7jnFOALTwiBW+8ISrP9pUv53w2RsQ6WPm988YhSrCs1nQHPIpbcR3/CHvG/07INLFc6huie7ogFwO3oNaOa+ARVirDjp+BucOQ/VM1AI3FQ59oWa+AW9OicfASLwRAAAAAElFTkSuQmCC'
};