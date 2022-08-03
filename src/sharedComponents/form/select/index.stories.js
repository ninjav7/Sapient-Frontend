import React from 'react';
import Select from "./index";

export default  {
    title: "Components/Select",
    component: Select,
    argTypes: {
        selectClassName: {
            control: false,
        },
        className: {
            control: false,
        },
        defaultValue: {
            control: false,
        }
    },
}

export const Default = (arg) => <Select {...arg} />

Default.args = {
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
};