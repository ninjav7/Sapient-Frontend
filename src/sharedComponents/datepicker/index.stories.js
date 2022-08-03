import React from "react";
import Datepicker from "./index";

import "react-datepicker/dist/react-datepicker.css";

export default {
    title: 'Components/Datepicker',
    component: Datepicker
}

export const Default = () => {
    return (
        <Datepicker />
    );
}