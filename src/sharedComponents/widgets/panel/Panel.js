import React, { useCallback, useEffect, useState } from 'react';
import pluralize from 'pluralize';
import cx from 'classnames';

import Select from '../../form/select';
import Input from '../../form/input/Input';
import { Button } from '../../button';
import { Breaker } from '../../breaker';
import Brick from '../../brick';
import { Toggles } from '../../toggles';
import { DangerZone } from '../../dangerZone';
import Typography from '../../typography';

import { BreakersWrapper } from './components/BreakersWrapper';

import { ReactComponent as UnlinkSVG } from '../../assets/icons/link-slash.svg';
import { PROP_TYPES } from './constants';

import './Panel.scss';
import { mergePropsByAccessors } from './helper';

export const PanelWidgetContext = React.createContext({});

const Panel = (props) => {
    const {
        typeProps,
        typeOptions,
        numberOfBreakers,
        startingBreaker,
        mainBreaker,
        nodes = [],
        isEditable,
        onPanelEditClick,
        onPanelToggleDeviceView,
        states,
        dangerZoneProps,
        hideViewDeviceIdControl,
        className,
        style,
    } = props;

    const [isEditingMode, setIsEditionMode] = useState(false);
    const [viewDeviceIds, setViewDeviceIds] = useState(false);

    useEffect(() => {
        setIsEditionMode(states?.isEditingModeState);
        setViewDeviceIds(states?.isViewDeviceIdsState);
    }, [states]);

    const onEditClickHandler = useCallback((event) => {
        setIsEditionMode((oldState) => {
            onPanelEditClick && onPanelEditClick({ event, isEditingMode: !oldState });
            return !oldState;
        });
    }, []);

    const onToggleChangeHandler = useCallback((event) => {
        setViewDeviceIds((oldState) => {
            onPanelToggleDeviceView && onPanelToggleDeviceView({ event, viewDeviceIds: !oldState });
            return !oldState;
        });
    }, []);

    const nodesMap = nodes.reduce((acc, node) => {
        acc[node.id] = node;
        return acc;
    }, {});

    const breakersWrapperProps = {
        nodesMap,
        ...props,
        onEdit: isEditingMode && props.onEdit,
        isEditingMode,
    };

    const panelHeaderControl = () => {
        if (isEditingMode) {
            return (
                <>
                    {typeProps && <Select options={typeOptions} label="Type" {...typeProps} />}
                    {numberOfBreakers && <Input label="Number of Breakers" {...numberOfBreakers} />}
                    {startingBreaker && <Input label="Starting Breaker" {...startingBreaker} />}
                </>
            );
        }

        return (
            <Typography.Header size={Typography.Sizes.sm}>{pluralize('Breaker', nodes.length, true)}</Typography.Header>
        );
    };

    return (
        <PanelWidgetContext.Provider
            value={{
                widgetProps: props,
                isEditingMode,
                viewDeviceIds,
            }}>
            <div className={cx('panel-wrapper', className)} style={style}>
                <div className="panel-header">
                    {panelHeaderControl()}

                    {isEditable && (
                        <div className="ml-auto">
                            <Button
                                onClick={onEditClickHandler}
                                size={Button.Sizes.md}
                                type={isEditingMode ? Button.Type.secondary : Button.Type.secondaryGrey}
                                label={isEditingMode ? 'Done Editing' : 'Edit Layout'}
                            />
                        </div>
                    )}
                </div>
                <Brick sizeInRem={1.5} />

                <div className="panel-main-breaker">
                    {mainBreaker && (
                        <Breaker
                            {...mainBreaker}
                            items={mainBreaker.items.map(({ id, status }) => ({ id, status }))}
                            isMain
                        />
                    )}

                    {!hideViewDeviceIdControl && (
                        <Toggles
                            isChecked={viewDeviceIds}
                            size={Toggles.Sizes.sm}
                            textAlignment={Toggles.TextAlignment.left}
                            onChange={onToggleChangeHandler}
                            label='Device IDs'
                        />
                    )}
                </div>
                <Brick sizeInRem={1.5} />

                <BreakersWrapper {...breakersWrapperProps} />
                <Brick sizeInRem={1.5} />

                <DangerZone
                    title="Danger Zone"
                    iconButton={<UnlinkSVG />}
                    labelButton="Unlink All Breakers"
                    {...dangerZoneProps}
                />
            </div>
        </PanelWidgetContext.Provider>
    );
};

Panel.propTypes = PROP_TYPES.panel;

export default Panel;
