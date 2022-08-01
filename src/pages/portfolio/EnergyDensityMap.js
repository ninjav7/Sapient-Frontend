import React from 'react';
import { Col, Row } from 'reactstrap';
import SimpleMaps from '../charts/SimpleMaps';
import { Link } from 'react-router-dom';
import { BuildingStore } from '../../store/BuildingStore';
import { ComponentStore } from '../../store/ComponentStore';
import ProgressBar from './ProgressBar';
import Brick from '../../sharedComponents/brick';

import './EnergyDensityMap.scss';
import {UNITS} from "../../constants/units";

const ProgressBars = ({ item, index, topEnergyDensity }) => {
    return (
        <>
            {index === 0 && item.density === 0 && (
                <ProgressBar
                    colors={`#D14065`}
                    progressValue={0}
                    progressTitle={item.buildingName}
                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                />
            )}
            {index === 0 && item.density > 0 && (
                <ProgressBar
                    colors={`#D14065`}
                    progressValue={100}
                    progressTitle={item.buildingName}
                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                />
            )}
            {index === 1 && (
                <ProgressBar
                    colors={`#DF5775`}
                    progressValue={((item.density / topEnergyDensity) * 100).toFixed(2)}
                    progressTitle={item.buildingName}
                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                />
            )}
            {index === 2 && (
                <ProgressBar
                    colors={`#EB6E87`}
                    progressValue={((item.density / topEnergyDensity) * 100).toFixed(2)}
                    progressTitle={item.buildingName}
                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                />
            )}
            {index === 3 && (
                <ProgressBar
                    colors={`#EB6E87`}
                    progressValue={((item.density / topEnergyDensity) * 100).toFixed(2)}
                    progressTitle={item.buildingName}
                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                />
            )}
            {index === 4 && (
                <ProgressBar
                    colors={`#FC9EAC`}
                    progressValue={((item.density / topEnergyDensity) * 100).toFixed(2)}
                    progressTitle={item.buildingName}
                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                />
            )}
            {index === 5 && (
                <ProgressBar
                    colors={`#FFCFD6`}
                    progressValue={((item.density / topEnergyDensity) * 100).toFixed(2)}
                    progressTitle={item.buildingName}
                    progressUnit={(item.density / 1000).toFixed(2) + ' kWh /Sq. Ft.'}
                />
            )}
        </>
    );
};

const EnergyDensityMap = ({ markers, buildingsEnergyConsume, topEnergyDensity }) => {
    //@TODO MOCKDATA
    // buildingsEnergyConsume = [
    //     {
    //         buildingName: 'Justin Tashker Lab',
    //         buildingAddress: 0,
    //         buildingID: '62bc201df607beccf9c86a06',
    //         density: 4,
    //         lat: '0',
    //         long: '0',
    //     },
    //     {
    //         buildingName: 'Streaming Building',
    //         buildingAddress: 0,
    //         buildingID: '62c544de6118a73d53623c7b',
    //         density: 10,
    //         lat: '0',
    //         long: '0',
    //     },
    //     {
    //         buildingName: 'Star Labs',
    //         buildingAddress: 0,
    //         buildingID: '62d05e71732eadc6370ea415',
    //         density: 25,
    //         lat: '0',
    //         long: '0',
    //     },
    //     {
    //         buildingName: 'DHL',
    //         buildingAddress: 0,
    //         buildingID: '62d7d13e81e83ead1e8d2043',
    //         density: 70,
    //         lat: '0',
    //         long: '0',
    //     },
    //     {
    //         buildingName: 'BD 1',
    //         buildingAddress: 0,
    //         buildingID: '62de899d6b4c935d3c54d45f',
    //         density: 90,
    //         lat: '',
    //         long: '',
    //     },
    //     {
    //         buildingName: 'DCPS',
    //         buildingAddress: 0,
    //         buildingID: '62df7f3cb9acc8a9a0415118',
    //         density: 98,
    //         lat: '',
    //         long: '',
    //     },
    // ].reverse();

    return (
        <>
            <Brick sizeInPixels={32} />
            <Row className="energy-density-map-wrapper">
                <Col xl={12}>
                    <h6 className="energy-density-map-title">Energy Density Top Buildings</h6>
                    <h6 className="energy-density-map-subtitle">Energy Consumption / Sq. Ft. Average</h6>
                </Col>

                <Col xl={5}>
                    <div className="portfolio-map-widget"><SimpleMaps markers={markers} /></div>
                </Col>

                <Col xl={7} className="energy-density-map-progress-bars-wrapper">
                    <div className="">
                        <div className="energy-density-map-progress-bars-top">
                            <h5 className="float-left energy-density-map-progress-bars-title">Store Name</h5>
                            <h5 className="float-right energy-density-map-progress-bars-title">Energy Density</h5>
                        </div>

                        <div className="clearfix"></div>
                        <Brick sizeInPixels={4} />

                        {buildingsEnergyConsume.slice(0, 6).map((item, index) => (
                            <div className="energy-density-map-progress-bar" key={index}>
                                <Link
                                    to={{
                                        pathname: `/energy/building/overview/${item.buildingID}`,
                                    }}>
                                    <div
                                        onClick={() => {
                                            localStorage.setItem('buildingId', item.buildingID);
                                            localStorage.setItem('buildingName', item.buildingName);
                                            BuildingStore.update((s) => {
                                                s.BldgId = item.buildingID;
                                                s.BldgName = item.buildingName;
                                                s.timeZone = item.timeZone;
                                            });
                                            ComponentStore.update((s) => {
                                                s.parent = 'buildings';
                                            });
                                        }}>
                                        <ProgressBar
                                            colors="#D14065"
                                            progressValue={item.density}
                                            progressTitle={item.buildingName}
                                            progressUnit={(item.density / 1000).toFixed(2) + ' ' + UNITS.KWH_SQ_FT}
                                        />
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </>
    );
};

export default EnergyDensityMap;
