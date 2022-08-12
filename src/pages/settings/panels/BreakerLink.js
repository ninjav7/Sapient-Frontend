import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkHorizontalSlash, faLinkHorizontal } from '@fortawesome/pro-regular-svg-icons';
import { getBezierPath, getEdgeCenter, getMarkerEnd } from 'react-flow-renderer';
import { BreakersStore } from '../../../store/BreakersStore';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { BaseUrl, listSensor, updateBreaker } from '../../../services/Network';
import { LoadingStore } from '../../../store/LoadingStore';
import './panel-style.css';

const foreignObjectSize = 30;

const onEdgeClick = (evt, id, breakerLinkData) => {
    let breakerLinkObj = breakerLinkData.find((record) => record?.id === id);
    evt.stopPropagation();
    alert(
        `For Selected BreakerLink: \nSource Breaker ID: ${breakerLinkObj.source} \nTarget Breaker ID: ${breakerLinkObj.target}`
    );
};

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
}) {
    const edgePath = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    const [edgeCenterX, edgeCenterY] = getEdgeCenter({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const breakerLinkData = BreakersStore.useState((s) => s.breakerLinkData);
    const distributedBreakersData = BreakersStore.useState((s) => s.distributedBreakersData);

    let breakerLinkObj = breakerLinkData.find((record) => record?.id === id);
    let sourceBreakerObj = distributedBreakersData.find((record) => record?.id === breakerLinkObj?.source);
    let targetBreakerObj = distributedBreakersData.find((record) => record?.id === breakerLinkObj?.target);

    const breakerLinkObjs = () => {
        console.log('SSR sourceBreakerObj', sourceBreakerObj);
        console.log('SSR targetBreakerObj', targetBreakerObj);
    };

    const triggerBreakerAPI = () => {
        LoadingStore.update((s) => {
            s.isBreakerDataFetched = true;
        });
    };

    const isBothBreakerLinked = () => {
        let isLinked;
        // If Parent ID exist for Source Breaker
        if (sourceBreakerObj?.data?.parentBreaker !== '') {
            if (sourceBreakerObj?.data?.parentBreaker === targetBreakerObj?.data?.parentBreaker) {
                isLinked = true;
            } else {
                isLinked = false;
            }
        }
        // If Parent ID not exist for Source Breaker
        if (sourceBreakerObj?.data?.parentBreaker === '') {
            if (sourceBreakerObj?.id === targetBreakerObj?.data?.parentBreaker) {
                isLinked = true;
            } else {
                isLinked = false;
            }
        }
        return isLinked;
    };

    const linkMultipleBreakers = async () => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let breakerObjOne = {
                name: sourceBreakerObj.data.name,
                breaker_number: sourceBreakerObj.data.breaker_number,
                phase_configuration: 1,
                rated_amps: sourceBreakerObj.data.rated_amps,
                voltage: 240,
                equipment_link: sourceBreakerObj.data.equipment_link,
                breaker_type: 2,
                parent_breaker: '',
                is_linked: true,
            };

            let breakerObjTwo = {
                name: targetBreakerObj.data.name,
                breaker_number: targetBreakerObj.data.breaker_number,
                phase_configuration: 1,
                rated_amps: targetBreakerObj.data.rated_amps,
                voltage: 240,
                equipment_link: targetBreakerObj.data.equipment_link,
                breaker_type: 2,
                parent_breaker: sourceBreakerObj.id,
                is_linked: true,
            };

            let paramsOne = `?breaker_id=${sourceBreakerObj.id}`;
            let paramsTwo = `?breaker_id=${targetBreakerObj.id}`;

            const requestOne = axios.post(`${BaseUrl}${updateBreaker}${paramsOne}`, breakerObjOne, headers);
            const requestTwo = axios.post(`${BaseUrl}${updateBreaker}${paramsTwo}`, breakerObjTwo, headers);

            await axios.all([requestOne, requestTwo]).then(
                axios.spread((...responses) => {
                    const responseOne = responses[0];
                    const responseTwo = responses[1];
                    setTimeout(() => {
                        triggerBreakerAPI();
                    }, 1000);
                })
            );
        } catch (error) {
            console.log('Failed to update Breaker Linking!');
        }
    };

    const linkTripleBreakers = async () => {
        // Fetch Parent ID
        let parentBreakerObj = distributedBreakersData.find(
            (record) => record?.id === sourceBreakerObj?.data.parentBreaker
        );
        console.log('SSR parentBreakerObj :>> ', parentBreakerObj);

        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            let parentObjOne = {
                name: parentBreakerObj.data.name,
                breaker_number: parentBreakerObj.data.breaker_number,
                phase_configuration: 3,
                rated_amps: parentBreakerObj.data.rated_amps,
                voltage: 208,
                equipment_link: parentBreakerObj.data.equipment_link,
                breaker_type: 3,
                parent_breaker: '',
                is_linked: true,
            };

            let breakerObjOne = {
                name: sourceBreakerObj.data.name,
                breaker_number: sourceBreakerObj.data.breaker_number,
                phase_configuration: 3,
                rated_amps: sourceBreakerObj.data.rated_amps,
                voltage: 208,
                equipment_link: sourceBreakerObj.data.equipment_link,
                breaker_type: 3,
                parent_breaker: parentBreakerObj?.id,
                is_linked: true,
            };

            let breakerObjTwo = {
                name: targetBreakerObj.data.name,
                breaker_number: targetBreakerObj.data.breaker_number,
                phase_configuration: 3,
                rated_amps: targetBreakerObj.data.rated_amps,
                voltage: 208,
                equipment_link: targetBreakerObj.data.equipment_link,
                breaker_type: 3,
                parent_breaker: parentBreakerObj?.id,
                is_linked: true,
            };

            let paramsOne = `?breaker_id=${parentBreakerObj.id}`;
            let paramsTwo = `?breaker_id=${sourceBreakerObj.id}`;
            let paramsThree = `?breaker_id=${targetBreakerObj.id}`;

            const requestOne = axios.post(`${BaseUrl}${updateBreaker}${paramsOne}`, parentObjOne, headers);
            const requestTwo = axios.post(`${BaseUrl}${updateBreaker}${paramsTwo}`, breakerObjOne, headers);
            const requestThree = axios.post(`${BaseUrl}${updateBreaker}${paramsThree}`, breakerObjTwo, headers);

            await axios.all([requestOne, requestTwo, requestThree]).then(
                axios.spread((...responses) => {
                    const responseOne = responses[0];
                    const responseTwo = responses[1];
                    const responseThree = responses[2];
                    setTimeout(() => {
                        triggerBreakerAPI();
                    }, 1000);
                })
            );
        } catch (error) {
            console.log('Failed to update Breaker Linking!');
        }
    };

    return (
        <>
            <path id={id} style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
            <foreignObject
                width={foreignObjectSize}
                height={foreignObjectSize}
                x={edgeCenterX - foreignObjectSize / 2}
                y={edgeCenterY - foreignObjectSize / 2}
                className=""
                requiredExtensions="http://www.w3.org/1999/xhtml">
                <body>
                    {/* When Source & Target Breaker not linked */}
                    {!sourceBreakerObj.data.isLinked && !targetBreakerObj.data.isLinked && (
                        <button
                            className="unlink_button_style"
                            onClick={(e) => {
                                if (
                                    sourceBreakerObj?.data?.breakerType === 1 &&
                                    targetBreakerObj?.data?.breakerType === 1
                                ) {
                                    linkMultipleBreakers();
                                }
                                if (
                                    sourceBreakerObj?.data?.breakerType === 2 ||
                                    targetBreakerObj?.data?.breakerType === 2
                                ) {
                                    linkTripleBreakers();
                                }
                                breakerLinkObjs();
                            }}>
                            <FontAwesomeIcon icon={faLinkHorizontalSlash} color="#7C879C" size="md" />
                        </button>
                    )}

                    {/* When Source Breaker is not linked & Target Breaker linked */}
                    {!sourceBreakerObj.data.isLinked && targetBreakerObj.data.isLinked && (
                        <button
                            className="unlink_button_style"
                            onClick={(e) => {
                                if (
                                    sourceBreakerObj?.data?.breakerType === 1 &&
                                    targetBreakerObj?.data?.breakerType === 1
                                ) {
                                    linkMultipleBreakers();
                                }
                                if (
                                    sourceBreakerObj?.data?.breakerType === 2 ||
                                    targetBreakerObj?.data?.breakerType === 2
                                ) {
                                    linkTripleBreakers();
                                }
                                breakerLinkObjs();
                            }}>
                            <FontAwesomeIcon icon={faLinkHorizontalSlash} color="#7C879C" size="md" />
                        </button>
                    )}

                    {/* When Source Breaker is linked & Target Breaker not linked */}
                    {sourceBreakerObj.data.isLinked && !targetBreakerObj.data.isLinked && (
                        <button
                            className="unlink_button_style"
                            onClick={(e) => {
                                if (
                                    sourceBreakerObj?.data?.breakerType === 1 &&
                                    targetBreakerObj?.data?.breakerType === 1
                                ) {
                                    linkMultipleBreakers();
                                }
                                if (
                                    sourceBreakerObj?.data?.breakerType === 2 ||
                                    targetBreakerObj?.data?.breakerType === 2
                                ) {
                                    linkTripleBreakers();
                                }
                                breakerLinkObjs();
                            }}>
                            <FontAwesomeIcon icon={faLinkHorizontalSlash} color="#7C879C" size="md" />
                        </button>
                    )}

                    {/* When Source & Target Breaker both linked */}
                    {sourceBreakerObj.data.isLinked && targetBreakerObj.data.isLinked && (
                        <>
                            {isBothBreakerLinked() && (
                                <button
                                    className="link_button_style"
                                    onClick={(e) => {
                                        onEdgeClick(e, id, breakerLinkData);
                                        breakerLinkObjs();
                                    }}>
                                    <FontAwesomeIcon icon={faLinkHorizontal} color="#444CE7" size="md" />
                                </button>
                            )}
                            {!isBothBreakerLinked() && (
                                <button
                                    className="unlink_button_style"
                                    onClick={(e) => {
                                        onEdgeClick(e, id, breakerLinkData);
                                        breakerLinkObjs();
                                    }}>
                                    <FontAwesomeIcon icon={faLinkHorizontalSlash} color="#7C879C" size="md" />
                                </button>
                            )}
                        </>
                    )}
                </body>
            </foreignObject>
        </>
    );
}
