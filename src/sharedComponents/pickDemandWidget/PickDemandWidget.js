import React from 'react';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './PickDemandWidget.scss';
import { PickDemandBox } from './components/pickDemandBox';
import Typography from '../typography';
import { stringOrNumberPropTypes } from '../helpers/helper';
import Brick from '../brick';
import { Button, ButtonTertiary } from '../button';

const PickDemandWidget = (props) => {
    return (
        <div className='pick-demand-widget-wrapper' {...props}>
            <div className='pick-demand-widget-header'>
                <div>
                    <Typography.Subheader size={Typography.Sizes.md}>{props.title}</Typography.Subheader>
                    <Typography.Body size={Typography.Sizes.xs}>{props.subtitle}</Typography.Body>
                </div>

                {props.buttonLabel && <ButtonTertiary onClick={props.handleClick} size={Button.Sizes.lg} label={props.buttonLabel} />}
            </div>

            <Brick />
            
           <div className='d-flex pick-demand-list'>
               {props.pickDemandItems && props.pickDemandItems.map((propsPickDemandBox, index) => {
                   return <PickDemandBox items={propsPickDemandBox.links} {...propsPickDemandBox} key={index} />
               })}
           </div>
            
        </div>
    );
};

PickDemandWidget.propTypes = { 
    pickDemandItems: PropTypes.arrayOf(PropTypes.shape({
        links: PropTypes.arrayOf(PropTypes.shape({
            label: PropTypes.string.isRequired,
            value: stringOrNumberPropTypes.isRequired,
            unit: PropTypes.string.isRequired,
            to: PropTypes.string.isRequired,
        }))
    })),
    title: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    handleClick: PropTypes.func,
    buttonLabel: PropTypes.string,
};

export default PickDemandWidget;