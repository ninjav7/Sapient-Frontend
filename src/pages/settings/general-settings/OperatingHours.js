import React from 'react';
import Switch from 'react-switch';
import { useAtom } from 'jotai';
import { userPermissionData } from '../../../store/globalState';
import colorPalette from '../../../assets/scss/_colors.scss';
import Typography from '../../../sharedComponents/typography';
import Brick from '../../../sharedComponents/brick';
import Inputs from '../../../sharedComponents/form/input/Input';
import Select from '../../../sharedComponents/form/select';
import { startIntervalOption12, endIntervalOption12, startIntervalOption24, endIntervalOption24 } from './timeInterval';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-time-picker/dist/TimePicker.css';
import './styles.scss';

const OperatingHours = (props) => {
    const [userPermission] = useAtom(userPermissionData);

    const isUserAdmin = userPermission?.is_admin ?? false;
    const isSuperUser = userPermission?.is_superuser ?? false;
    const isSuperAdmin = isUserAdmin || isSuperUser;
    const canUserEdit = userPermission?.permissions?.permissions?.account_buildings_permission?.edit ?? false;

    return (
        <>
            {props.weekDay !== 'Mon' && <Brick sizeInRem={1} />}
            <div
                className="d-flex justify-content-start align-items-center"
                style={{ opacity: props.isOperating ? '0.3' : '1' }}>
                <div className="d-flex align-items-center mr-4">
                    <Switch
                        onChange={props.onSwitchToggle}
                        checked={!props.isOperating}
                        onColor={colorPalette.datavizBlue600}
                        uncheckedIcon={false}
                        checkedIcon={false}
                        className="react-switch"
                        disabled={!(isSuperAdmin || canUserEdit)}
                    />
                </div>

                <div className="d-flex weekday-container justify-content-center mr-4">
                    <Typography.Subheader size={Typography.Sizes.sm} style={{ color: colorPalette.primaryIndigo600 }}>
                        {props.weekDay}
                    </Typography.Subheader>
                </div>

                <div className="d-flex align-items-center">
                    <div>
                        {isSuperAdmin || canUserEdit ? (
                            <Select
                                defaultValue={props.startTime}
                                options={props.timeZone === '12' ? startIntervalOption12 : startIntervalOption24}
                                onChange={props.onStartTimeChange}
                                placeholder="Time"
                            />
                        ) : (
                            <Inputs type="text" placeholder="Time" className="w-100" value={props.startTime} disabled />
                        )}
                    </div>

                    <div className="ml-2 mr-2">
                        <Typography.Body size={Typography.Sizes.md}>to</Typography.Body>
                    </div>

                    <div>
                        {isSuperAdmin || canUserEdit ? (
                            <Select
                                defaultValue={props.endTime}
                                options={props.timeZone === '12' ? endIntervalOption12 : endIntervalOption24}
                                onChange={props.onEndTimeChange}
                                placeholder="Time"
                            />
                        ) : (
                            <Inputs type="text" placeholder="Time" className="w-100" value={props.endTime} disabled />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default OperatingHours;
