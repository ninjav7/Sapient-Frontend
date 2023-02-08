import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import axios from 'axios';
import { BaseUrl, listSensor, updateBreakers, generalPassiveDevices, searchDevices } from '../../../services/Network';
import { Cookies } from 'react-cookie';
import { Handle } from 'react-flow-renderer';
import { LoadingStore } from '../../../store/LoadingStore';
import { BreakersStore } from '../../../store/BreakersStore';
import { BuildingStore } from '../../../store/BuildingStore';
import Brick from '../../../sharedComponents/brick';
import { Button } from '../../../sharedComponents/button';
import { ReactComponent as PenSVG } from '../../../assets/icon/panels/pen.svg';
import Typography from '../../../sharedComponents/typography';
import UnlinkBreaker from './UnlinkBreaker';
import { getBreakerDeleted, getSensorsList, resetAllBreakers } from './services';
import DeleteBreaker from './DeleteBreaker';
import InputTooltip from '../../../sharedComponents/form/input/InputTooltip';
import Tabs from '../../../sharedComponents/tabs/Tabs';
import { ReactComponent as PlusSVG } from '../../../assets/icon/plusBlue.svg';
import Radio from '../../../sharedComponents/form/radio/Radio';
import Textarea from '../../../sharedComponents/form/textarea/Textarea';
import { voltsOption } from './utils';
import './breaker-config-styles.scss';

import Form from 'react-bootstrap/Form';
import Skeleton from 'react-loading-skeleton';
import AsyncSelect from 'react-select/async';
import Select from '../../../sharedComponents/form/select';

const BreakerConfiguration = ({
    showBreakerConfigModal,
    openBreakerConfigModal,
    closeBreakerConfigModal,
    selectedBreakerObj,
    breakersList,
    panelObj,
}) => {
    const [activeTab, setActiveTab] = useState('edit-breaker');

    const [firstBreakerObj, setFirstBreakerObj] = useState({});
    const [secondBreakerObj, setSecondBreakerObj] = useState({});
    const [thirdBreakerObj, setThirdBreakerObj] = useState({});

    useEffect(() => {
        if (!selectedBreakerObj) return;
        setFirstBreakerObj(selectedBreakerObj);

        if (selectedBreakerObj.breaker_type === 2) {
            let obj = breakersList.find((el) => el?.parent_breaker === selectedBreakerObj?.id);
            setSecondBreakerObj(obj);
        }

        if (selectedBreakerObj.breaker_type === 3) {
            let childbreakers = breakersList.filter((el) => el?.parent_breaker === selectedBreakerObj?.id);
            setSecondBreakerObj(childbreakers[0]);
            setThirdBreakerObj(childbreakers[1]);
        }
    }, [selectedBreakerObj]);

    return (
        <React.Fragment>
            <Modal show={showBreakerConfigModal} onHide={closeBreakerConfigModal} size="xl" centered>
                <h2>{firstBreakerObj?.breaker_number}</h2>
            </Modal>

            {/* <UnlinkBreaker
                showUnlinkAlert={showUnlinkAlert}
                handleUnlinkAlertClose={handleUnlinkAlertClose}
                handleEditBreakerShow={openBreakerConfigModal}
                isResetting={isResetting}
                unLinkCurrentBreaker={unLinkCurrentBreaker}
            />

            <DeleteBreaker
                showDeleteAlert={showDeleteAlert}
                handleDeleteAlertClose={handleDeleteAlertClose}
                handleEditBreakerShow={openBreakerConfigModal}
                isDeleting={isDeleting}
                deleteCurrentBreaker={deleteCurrentBreaker}
            /> */}
        </React.Fragment>
    );
};

export default BreakerConfiguration;
