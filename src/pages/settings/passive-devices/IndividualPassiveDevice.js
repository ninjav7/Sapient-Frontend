import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faChartMixed } from '@fortawesome/pro-regular-svg-icons';
import DeviceChartModel from '../DeviceChartModel';
import { Link, useParams, useHistory } from 'react-router-dom';
import axios from 'axios';
import {
    BaseUrl,
    generalPassiveDevices,
    getLocation,
    sensorGraphData,
    listSensor,
    updateActivePassiveDevice,
} from '../../../services/Network';
import { dateFormatHandler } from '../../../utils/helper';
import { BuildingStore } from '../../../store/BuildingStore';
import { BreadcrumbStore } from '../../../store/BreadcrumbStore';
import { ComponentStore } from '../../../store/ComponentStore';
import { Input } from 'reactstrap';
import { Cookies } from 'react-cookie';
import Skeleton from 'react-loading-skeleton';
import EditSensorPanelModel from './EditSensorPanelModel';
import AddSensorPanelModel from './AddSensorPanelModel';
import './style.css';

const IndividualPassiveDevice = () => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    let history = useHistory();

    const { deviceId } = useParams();
    const [sensorId, setSensorId] = useState('');
    // Chart states
    const [showChart, setShowChart] = useState(false);
    const handleChartClose = () => setShowChart(false);

    // Select Breaker states
    const [showBreaker, setShowBreaker] = useState(false);
    const handleBreakerClose = () => setShowBreaker(false);
    const handleBreakerShow = () => setShowBreaker(true);

    // Edit Sensor Panel model state
    const [showEditSensorPanel, setShowEditSensorPanel] = useState(false);
    const closeEditSensorPanelModel = () => setShowEditSensorPanel(false);
    const openEditSensorPanelModel = () => setShowEditSensorPanel(true);

    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedTab, setSelectedTab] = useState(0);

    const [sensorCount, setSensorCount] = useState(0);

    const [passiveData, setPassiveData] = useState({});
    const [onlineDeviceData, setOnlineDeviceData] = useState([]);
    const [offlineDeviceData, setOfflineDeviceData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [createDeviceData, setCreateDeviceData] = useState({
        device_type: 'passive',
    });
    const bldgId = BuildingStore.useState((s) => s.BldgId);
    const [currentRecord, setCurrentRecord] = useState({});
    const [currentSensorObj, setCurrentSensorObj] = useState({});
    const [editSenorModelRefresh, setEditSenorModelRefresh] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [equipmentId, setEquipmentId] = useState('');
    const [sensors, setSensors] = useState([
        {
            index: 1,
            id: '62d8a9b067f7952c340f179a',
            name: '1-1',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: 'Panel Test 6 , Breaker 1',
            breaker_id: '62d973925f66ad4bbece79d1',
            panel_id: '62d973925f66ad4bbece79d0',
            equipment: 'NYPL Equipment Passive',
            equipment_id: '62d96cfc81e83ead1e8d20c4',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 2,
            id: '62d8a9b967f7952c340f179b',
            name: '1-2',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: 'Panel Test 7 , Breaker 2',
            breaker_id: '62d98428402b81a562b0aece',
            panel_id: '62d98427e0a5b648944402c8',
            equipment: 'NYPL Equipment Passive 2',
            equipment_id: '62d9811281e83ead1e8d20cc',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 3,
            id: '62d8a9c367f7952c340f179c',
            name: '1-3',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: 'Panel Test 8 , Breaker 1',
            breaker_id: '62d98b9d6c226c7fd9184052',
            panel_id: '62d98b9c248566aef163828a',
            equipment: 'NYPL Equipment Passive 3',
            equipment_id: '62d9813781e83ead1e8d20cf',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 4,
            id: '62d982eab3949f1838a2df10',
            name: '1-4',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 5,
            id: '62d982f6b3949f1838a2df11',
            name: '1-5',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 6,
            id: '62d982feb3949f1838a2df12',
            name: '1-6',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 7,
            id: '62d98381b3949f1838a2df13',
            name: '1-7',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 8,
            id: '62d98389b3949f1838a2df14',
            name: '1-8',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 9,
            id: '62d98392b3949f1838a2df15',
            name: '1-9',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 10,
            id: '62d9839bb3949f1838a2df16',
            name: '1-10',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 11,
            id: '62d9842ab3949f1838a2df17',
            name: '1-11',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 12,
            id: '62d9842ab3949f1838a2df18',
            name: '1-12',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 13,
            id: '62d9842ab3949f1838a2df19',
            name: '2-1',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 14,
            id: '62d9842ab3949f1838a2df1a',
            name: '2-2',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 15,
            id: '62d9842ab3949f1838a2df1b',
            name: '2-3',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 16,
            id: '62d9842ab3949f1838a2df1c',
            name: '2-4',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 17,
            id: '62d9842ab3949f1838a2df1d',
            name: '2-5',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 18,
            id: '62d9842ab3949f1838a2df1e',
            name: '2-6',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 19,
            id: '62d9842ab3949f1838a2df1f',
            name: '2-7',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 20,
            id: '62d9842ab3949f1838a2df20',
            name: '2-8',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 21,
            id: '62d9842ab3949f1838a2df21',
            name: '2-9',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 22,
            id: '62d9842ab3949f1838a2df22',
            name: '2-10',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 23,
            id: '62d9842ab3949f1838a2df23',
            name: '2-11',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 24,
            id: '62d9842ab3949f1838a2df24',
            name: '2-12',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 25,
            id: '62d9842ab3949f1838a2df25',
            name: '3-1',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 26,
            id: '62d9842ab3949f1838a2df26',
            name: '3-2',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 27,
            id: '62d9842ab3949f1838a2df27',
            name: '3-3',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 28,
            id: '62d9842ab3949f1838a2df28',
            name: '3-4',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 29,
            id: '62d9842ab3949f1838a2df29',
            name: '3-5',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 30,
            id: '62d9842ab3949f1838a2df2a',
            name: '3-6',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 31,
            id: '62d9845ab3949f1838a2df2b',
            name: '3-7',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 32,
            id: '62d98533b3949f1838a2df2c',
            name: '3-8',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 33,
            id: '62d98533b3949f1838a2df2d',
            name: '3-9',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 34,
            id: '62d98533b3949f1838a2df2e',
            name: '3-10',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 35,
            id: '62d98533b3949f1838a2df2f',
            name: '3-11',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 36,
            id: '62d98533b3949f1838a2df30',
            name: '3-12',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 37,
            id: '62d98533b3949f1838a2df31',
            name: '4-1',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 38,
            id: '62d98533b3949f1838a2df32',
            name: '4-2',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 39,
            id: '62d98533b3949f1838a2df33',
            name: '4-3',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 40,
            id: '62d98533b3949f1838a2df34',
            name: '4-4',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 41,
            id: '62d98533b3949f1838a2df35',
            name: '4-5',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 42,
            id: '62d98533b3949f1838a2df36',
            name: '4-6',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 43,
            id: '62d98533b3949f1838a2df37',
            name: '4-7',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 44,
            id: '62d98533b3949f1838a2df38',
            name: '4-8',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 45,
            id: '62d98533b3949f1838a2df3a',
            name: '4-9',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 46,
            id: '62d98533b3949f1838a2df3b',
            name: '4-10',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 47,
            id: '62d98533b3949f1838a2df3c',
            name: '4-11',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
        {
            index: 48,
            id: '62d98533b3949f1838a2df3d',
            name: '4-12',
            device_linked: '0013A200419592D8',
            device_linked_id: '62d8a7f967f7952c340f1793',
            sensor_type: '',
            breaker_link: '',
            breaker_id: '',
            panel_id: '',
            equipment: '',
            equipment_id: '',
            sapient_id: '123456789',
            equipment_type_id: '',
            equipment_type_name: '',
            status: false,
        },
    ]);
    const [sensorData, setSensorData] = useState([]);

    const [isLocationFetched, setIsLocationFetched] = useState(true);
    const [activeLocationId, setActiveLocationId] = useState('');
    const [sensorAPIRefresh, setSensorAPIRefresh] = useState(false);
    const [isFetchingSensorData, setIsFetchingSensorData] = useState(true);

    // *********************************************************************************** //

    const [seriesData, setSeriesData] = useState([]);
    const [deviceData, setDeviceData] = useState([]);
    const [getSearchValue, setGetSearchValue] = useState('');

    const [isSensorChartLoading, setIsSensorChartLoading] = useState(true);

    const CONVERSION_ALLOWED_UNITS = ['mV', 'mAh', 'power'];

    const UNIT_DIVIDER = 1000;

    const [metric, setMetric] = useState([
        // { value: 'energy', label: 'Consumed Energy (Wh)' },
        // { value: 'totalconsumedenergy', label: 'Total Consumed Energy (Wh)' },
        // { value: 'mV', label: 'Voltage (V)' },
        // { value: 'power', label: 'Real Power (W)' },
        { value: 'minCurrentMilliAmps', label: 'minCurrentMilliAmps' },
        { value: 'maxCurrentMilliAmps', label: 'maxCurrentMilliAmps' },
        { value: 'rmsCurrentMilliAmps', label: 'rmsCurrentMilliAmps' },
        // { value: 'mAh', label: 'Amps' },
    ]);

    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    const [searchSensor, setSearchSensor] = useState('');

    const handleSearchChange = (e) => {
        setSearchSensor(e.target.value);
    };

    const filtered = !searchSensor
        ? sensors
        : sensors.filter((sensor) => {
              return (
                  sensor.name.toLowerCase().includes(searchSensor.toLowerCase()) ||
                  sensor.breaker_link.toLowerCase().includes(searchSensor.toLowerCase()) ||
                  sensor.equipment.toLowerCase().includes(searchSensor.toLowerCase())
              );
          });

    const handleChartShow = (id) => {
        setSensorId(id);
        let obj = sensors.find((o) => o.id === id);
        setSensorData(obj);
        fetchSensorGraphData(id);
        setShowChart(true);
    };

    const [selectedConsumption, setConsumption] = useState(metric[0].value);

    const getRequiredConsumptionLabel = (value) => {
        let label = '';

        metric.map((m) => {
            if (m.value === value) {
                label = m.label;
            }

            return m;
        });

        return label;
    };

    useEffect(() => {
        const fetchSinglePassiveDevice = async () => {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${deviceId}&page_size=100&page_no=1&building_id=${bldgId}`;
                await axios.get(`${BaseUrl}${generalPassiveDevices}${params}`, { headers }).then((res) => {
                    let response = res.data.data[0];
                    setPassiveData(response);
                    setActiveLocationId(response.location_id);
                    localStorage.setItem('identifier', response.identifier);
                });
            } catch (error) {
                console.log(error);
                console.log('Failed to fetch Passive device data');
            }
        };

        const fetchActiveDeviceSensorData = async () => {
            try {
                setIsFetchingSensorData(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${deviceId}`;
                await axios.get(`${BaseUrl}${listSensor}${params}`, { headers }).then((res) => {
                    let response = res.data;
                    // setSensors(response);
                });
                setIsFetchingSensorData(false);
            } catch (error) {
                console.log(error);
                setIsFetchingSensorData(false);
                console.log('Failed to fetch Active device sensor data');
            }
        };

        const fetchLocationData = async () => {
            try {
                setIsLocationFetched(true);
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                await axios.get(`${BaseUrl}${getLocation}/${bldgId}`, { headers }).then((res) => {
                    let response = res.data;
                    response.sort((a, b) => {
                        return a.location_name.localeCompare(b.location_name);
                    });
                    setLocationData(response);
                });
                setIsLocationFetched(false);
            } catch (error) {
                console.log(error);
                setIsLocationFetched(false);
                console.log('Failed to fetch Location Data');
            }
        };

        fetchSinglePassiveDevice();
        fetchActiveDeviceSensorData();
        fetchLocationData();
    }, [deviceId]);

    useEffect(() => {
        const updateBreadcrumbStore = () => {
            BreadcrumbStore.update((bs) => {
                let newList = [
                    {
                        label: 'Passive Devices',
                        path: '/settings/passive-devices',
                        active: true,
                    },
                ];
                bs.items = newList;
            });
            ComponentStore.update((s) => {
                s.parent = 'building-settings';
            });
        };
        updateBreadcrumbStore();
    }, []);

    const fetchSensorGraphData = async (id) => {
        try {
            let endDate = new Date(); // today
            let startDate = new Date();
            startDate.setDate(startDate.getDate() - 7);

            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };
            setIsSensorChartLoading(true);
            let params = `?sensor_id=${
                id === sensorId ? sensorId : id
            }&consumption=minCurrentMilliAmps&tz_info=${timeZone}`;
            await axios
                .post(
                    `${BaseUrl}${sensorGraphData}${params}`,
                    {
                        date_from: dateFormatHandler(startDate),
                        date_to: dateFormatHandler(endDate),
                    },
                    { headers }
                )
                .then((res) => {
                    let response = res.data;

                    let data = response;

                    let exploreData = [];

                    let recordToInsert = {
                        data: data,

                        name: getRequiredConsumptionLabel(selectedConsumption),
                    };

                    try {
                        recordToInsert.data = recordToInsert.data.map((_data) => {
                            _data[0] = new Date(_data[0]);
                            if (CONVERSION_ALLOWED_UNITS.indexOf(selectedConsumption) > -1) {
                                _data[1] = _data[1] / UNIT_DIVIDER;
                            }

                            return _data;
                        });
                    } catch (error) {}

                    exploreData.push(recordToInsert);

                    console.log('SSR exploreData => ', exploreData);
                    setDeviceData(exploreData);

                    console.log('UPDATED_CODE', seriesData);

                    setSeriesData([
                        {
                            data: exploreData[0].data,
                        },
                    ]);
                    setIsSensorChartLoading(false);
                });
        } catch (error) {
            console.log(error);
            console.log('Failed to fetch Sensor Graph data');
        }
    };

    const updateActiveDeviceData = async () => {
        if (passiveData.equipments_id) {
            try {
                let headers = {
                    'Content-Type': 'application/json',
                    accept: 'application/json',
                    Authorization: `Bearer ${userdata.token}`,
                };
                let params = `?device_id=${passiveData.equipments_id}`;
                await axios
                    .post(
                        `${BaseUrl}${updateActivePassiveDevice}${params}`,
                        {
                            location_id: activeLocationId,
                        },
                        { headers }
                    )
                    .then((res) => {
                        setSensorAPIRefresh(!sensorAPIRefresh);
                        console.log(res.data);
                    });
            } catch (error) {
                console.log(error);
                console.log('Failed to link Sensor with Equipment');
            }
        }
    };

    return (
        <>
            <div>
                <div>
                    <div className="single-passive-container">
                        <div className="passive-page-header">
                            <div>
                                <div className="mb-1">
                                    <span className="passive-device-style">Passive Device</span>
                                </div>
                                <div>
                                    <span className="passive-device-name mr-3">{passiveData.identifier}</span>
                                    <span className="passive-sensor-count">{sensors.length} Sensors</span>
                                </div>
                            </div>
                            <div>
                                <Link to="/settings/passive-devices">
                                    <button type="button" className="btn btn-default passive-cancel-style">
                                        Cancel
                                    </button>
                                </Link>
                                <button
                                    type="button"
                                    className="btn btn-primary passive-save-style ml-2"
                                    onClick={() => {
                                        updateActiveDeviceData();
                                        history.push('/settings/passive-devices');
                                    }}
                                    disabled={
                                        activeLocationId === 'Select location' ||
                                        activeLocationId === passiveData.location_id
                                            ? true
                                            : false
                                    }>
                                    Save
                                </button>
                            </div>
                        </div>
                        <div className="mt-2 single-passive-tabs-style">
                            <span className="mr-3 single-passive-tab-active">Configure</span>
                            <span className="mr-3 single-passive-tab">History</span>
                        </div>
                    </div>
                </div>

                <div className="container">
                    <div className="row">
                        <div className="col-4">
                            <h5 className="device-title">Device Details</h5>
                            <div className="mt-2">
                                <div>
                                    <Form.Group className="mb-1" controlId="exampleForm.ControlInput1">
                                        <Form.Label className="device-label-style">Installed Location</Form.Label>

                                        {isLocationFetched ? (
                                            <Skeleton count={1} height={35} />
                                        ) : (
                                            <Input
                                                type="select"
                                                name="select"
                                                id="exampleSelect"
                                                className="font-weight-bold"
                                                onChange={(e) => {
                                                    setActiveLocationId(e.target.value);
                                                }}
                                                value={activeLocationId}>
                                                <option>Select Location</option>
                                                {locationData.map((record, index) => {
                                                    return (
                                                        <option value={record.location_id}>
                                                            {record.location_name}
                                                        </option>
                                                    );
                                                })}
                                            </Input>
                                        )}

                                        <Form.Label className="device-sub-label-style mt-1">
                                            Location this device is installed in.
                                        </Form.Label>
                                    </Form.Group>
                                </div>
                                <div className="single-passive-grid">
                                    <div>
                                        <h6 className="device-label-style" htmlFor="customSwitches">
                                            Identifier
                                        </h6>
                                        <h6 className="passive-device-value">{passiveData.identifier}</h6>
                                    </div>
                                    <div>
                                        <h6 className="device-label-style" htmlFor="customSwitches">
                                            Device Model
                                        </h6>
                                        <h6 className="passive-device-value">{passiveData.model}</h6>
                                    </div>
                                </div>
                                <div className="single-passive-grid">
                                    <div>
                                        <h6 className="device-label-style" htmlFor="customSwitches">
                                            Firmware Version
                                        </h6>
                                        <h6 className="passive-device-value">v1.2</h6>
                                    </div>
                                    <div>
                                        <h6 className="device-label-style" htmlFor="customSwitches">
                                            Device Version
                                        </h6>
                                        <h6 className="passive-device-value">v2</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-8">
                            {/* TODO: */}
                            <h5 className="device-title">Sensors ({sensors.length})</h5>
                            <div className="mt-2">
                                <div className="active-sensor-header">
                                    <div className="search-container mr-2">
                                        <FontAwesomeIcon icon={faMagnifyingGlass} size="md" />
                                        <input
                                            className="search-box ml-2"
                                            type="search"
                                            name="search"
                                            onChange={(e) => {
                                                console.log('e.target.value', e.target.value);
                                                setGetSearchValue(e.target.value);
                                                handleSearchChange();
                                            }}
                                            placeholder="Search..."
                                            value={searchSensor}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* <div className="mt-2 socket-image-container"></div> */}

                            {isFetchingSensorData ? (
                                <div className="mt-4">
                                    <Skeleton count={8} height={40} />
                                </div>
                            ) : (
                                <>
                                    {getSearchValue?.length === 0 && (
                                        <>
                                            {sensors.map((record, index) => {
                                                return (
                                                    <>
                                                        {record.equipment_id === '' ? (
                                                            <div className="sensor-container-style-notAttached mt-3">
                                                                <div className="sensor-data-style">
                                                                    <span className="sensor-data-no">{index + 1}</span>
                                                                    <span className="sensor-data-title">
                                                                        Not Attached
                                                                    </span>
                                                                </div>
                                                                <div className="sensor-data-style-right">
                                                                    <FontAwesomeIcon
                                                                        icon={faChartMixed}
                                                                        size="md"
                                                                        onClick={() => {
                                                                            handleChartShow(record.id);
                                                                        }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-default passive-edit-style"
                                                                        onClick={() => {
                                                                            handleBreakerShow();
                                                                            setCurrentRecord(record);
                                                                            setCurrentIndex(index);
                                                                            setEquipmentId(record.equipment_id);
                                                                        }}>
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="sensor-container-style mt-3">
                                                                <div className="sensor-data-style">
                                                                    <span className="sensor-data-no">{index + 1}</span>
                                                                    <span className="sensor-data-title">
                                                                        {record.breaker_link}
                                                                    </span>
                                                                    <span className="sensor-data-device">
                                                                        {record.equipment}
                                                                    </span>
                                                                </div>
                                                                <div className="sensor-data-style-right">
                                                                    <FontAwesomeIcon
                                                                        icon={faChartMixed}
                                                                        size="md"
                                                                        onClick={() => {
                                                                            handleChartShow(record.id);
                                                                        }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-default passive-edit-style"
                                                                        onClick={() => {
                                                                            setEditSenorModelRefresh(true);
                                                                            setCurrentSensorObj(record);
                                                                            openEditSensorPanelModel();
                                                                        }}>
                                                                        Edit
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </>
                                                );
                                            })}
                                        </>
                                    )}
                                    {getSearchValue?.length > 0 && (
                                        <>
                                            {sensors
                                                ?.filter((item) => {
                                                    return (
                                                        item?.breaker_link?.includes(getSearchValue) ||
                                                        item?.breaker_id?.includes(getSearchValue) ||
                                                        item?.equipment?.includes(getSearchValue) ||
                                                        item?.name?.includes(getSearchValue)
                                                    );
                                                })
                                                ?.map((record, index) => {
                                                    return (
                                                        <>
                                                            {record.equipment_id === '' ? (
                                                                <div className="sensor-container-style-notAttached mt-3">
                                                                    <div className="sensor-data-style">
                                                                        <span className="sensor-data-no">
                                                                            {index + 1}
                                                                        </span>
                                                                        <span className="sensor-data-title">
                                                                            Not Attached
                                                                        </span>
                                                                    </div>
                                                                    <div className="sensor-data-style-right">
                                                                        <FontAwesomeIcon
                                                                            icon={faChartMixed}
                                                                            size="md"
                                                                            onClick={() => {
                                                                                handleChartShow(record.id);
                                                                            }}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-default passive-edit-style"
                                                                            onClick={() => {
                                                                                handleBreakerShow();
                                                                                setCurrentRecord(record);
                                                                                setCurrentIndex(index);
                                                                                setEquipmentId(record.equipment_id);
                                                                            }}>
                                                                            Edit
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <div className="sensor-container-style mt-3">
                                                                    <div className="sensor-data-style">
                                                                        <span className="sensor-data-no">
                                                                            {index + 1}
                                                                        </span>
                                                                        <span className="sensor-data-title">
                                                                            {record.breaker_link}
                                                                        </span>
                                                                        <span className="sensor-data-device">
                                                                            {record.equipment}
                                                                        </span>
                                                                    </div>
                                                                    <div className="sensor-data-style-right">
                                                                        <FontAwesomeIcon
                                                                            icon={faChartMixed}
                                                                            size="md"
                                                                            onClick={() => {
                                                                                handleChartShow(record.id);
                                                                            }}
                                                                        />
                                                                        <button
                                                                            type="button"
                                                                            className="btn btn-default passive-edit-style"
                                                                            onClick={() => {
                                                                                setEditSenorModelRefresh(true);
                                                                                setCurrentSensorObj(record);
                                                                                openEditSensorPanelModel();
                                                                            }}>
                                                                            Edit
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    );
                                                })}
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* <DeviceChartModel showChart={showChart} handleChartClose={handleChartClose} sensorData={sensorData} /> */}

            <DeviceChartModel
                showChart={showChart}
                handleChartClose={handleChartClose}
                sensorData={sensorData}
                seriesData={seriesData}
                setSeriesData={setSeriesData}
                deviceData={deviceData}
                setDeviceData={setDeviceData}
                CONVERSION_ALLOWED_UNITS={CONVERSION_ALLOWED_UNITS}
                UNIT_DIVIDER={UNIT_DIVIDER}
                metric={metric}
                setMetric={setMetric}
                selectedConsumption={selectedConsumption}
                setConsumption={setConsumption}
                getRequiredConsumptionLabel={getRequiredConsumptionLabel}
                isSensorChartLoading={isSensorChartLoading}
                setIsSensorChartLoading={setIsSensorChartLoading}
                timeZone={timeZone}
            />

            <AddSensorPanelModel
                showBreaker={showBreaker}
                handleBreakerClose={handleBreakerClose}
                sensors={sensors}
                setSensors={setSensors}
                currentRecord={currentRecord}
                setCurrentRecord={setCurrentRecord}
                currentIndex={currentIndex}
                bldgId={bldgId}
                equipmentId={equipmentId}
            />

            <EditSensorPanelModel
                showEditSensorPanel={showEditSensorPanel}
                closeEditSensorPanelModel={closeEditSensorPanelModel}
                currentSensorObj={currentSensorObj}
                setCurrentSensorObj={setCurrentSensorObj}
                editSenorModelRefresh={editSenorModelRefresh}
                setEditSenorModelRefresh={setEditSenorModelRefresh}
                bldgId={bldgId}
            />
        </>
    );
};

export default IndividualPassiveDevice;
