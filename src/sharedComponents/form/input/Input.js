import React from "react";
import FormControl from 'react-bootstrap/FormControl';
import PropTypes from 'prop-types';

import './Input.scss'

const Input = ({
           iconUrl, 
           inputClassName = '', 
           className = '', 
           ...props
    }) => {
    
    return (
        <div className={`input-wrapper ${className}`}>
            {iconUrl && <img className="input-icon" src={iconUrl}/>}
            <FormControl
                {...props}
                className={`input-control ${inputClassName}`}
            />
        </div>

    );
}

Input.propTypes = {
    iconUrl: PropTypes.string
}

export default Input;