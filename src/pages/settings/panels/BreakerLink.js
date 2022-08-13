import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkHorizontalSlash, faLinkHorizontal } from '@fortawesome/pro-regular-svg-icons';
import { getBezierPath, getEdgeCenter, getMarkerEnd } from 'react-flow-renderer';
import { BreakersStore } from '../../../store/BreakersStore';
import axios from 'axios';
import { Cookies } from 'react-cookie';
import { BaseUrl, updateLinkBreakers, updateBreaker } from '../../../services/Network';
import { LoadingStore } from '../../../store/LoadingStore';
import './panel-style.css';

const foreignObjectSize = 30;

const onEdgeClick = (evt, id, breakerLinkData) => {
    let breakerLinkObj = breakerLinkData.find(record => record?.id === id);
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

    const breakerLinkData = BreakersStore.useState(s => s.breakerLinkData);
    const distributedBreakersData = BreakersStore.useState(s => s.distributedBreakersData);

    const [breakerLinkObj, setBreakerLinkObj] = useState({});

    const [sourceBreakerObj, setSourceBreakerObj] = useState({});
    const [targetBreakerObj, setTargetBreakerObj] = useState({});

    const triggerBreakerAPI = () => {
        LoadingStore.update(s => {
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

    const linkMultipleBreakersAPI = async (breakerObjOne, breakerObjTwo) => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            await axios
                .post(`${BaseUrl}${updateLinkBreakers}`, [breakerObjOne, breakerObjTwo], { headers })
                .then(res => {
                    let response = res?.data;
                    setTimeout(() => {
                        triggerBreakerAPI();
                    }, 1000);
                });
        } catch (error) {
            console.log('Failed to update Breaker Linking!');
        }
    };

    const linkTripleBreakersAPI = async (breakerObjOne, breakerObjTwo, breakerObjThree) => {
        try {
            let headers = {
                'Content-Type': 'application/json',
                accept: 'application/json',
                Authorization: `Bearer ${userdata.token}`,
            };

            await axios
                .post(`${BaseUrl}${updateLinkBreakers}`, [breakerObjOne, breakerObjTwo, breakerObjThree], { headers })
                .then(res => {
                    let response = res?.data;
                    setTimeout(() => {
                        triggerBreakerAPI();
                    }, 1000);
                });
        } catch (error) {
            console.log('Failed to update Breaker Linking!');
        }
    };

    useEffect(() => {
        let fetchedObj = breakerLinkData.find(record => record?.id === id);
        setBreakerLinkObj(fetchedObj);
    }, [breakerLinkData]);

    useEffect(() => {
        let sourceObj = distributedBreakersData.find(record => record?.id === breakerLinkObj?.source);
        let targetObj = distributedBreakersData.find(record => record?.id === breakerLinkObj?.target);
        setSourceBreakerObj(sourceObj);
        setTargetBreakerObj(targetObj);
    }, [breakerLinkObj]);

    const linkBreakers = () => {
        // breakerLink= 1:3
        // breakerLink= 3:1
        // breakerLink= 3:3
        if (sourceBreakerObj?.data?.breakerType === 3 || targetBreakerObj?.data?.breakerType === 3) {
            alert(
                `Breaker ${sourceBreakerObj?.data?.breaker_number} & Breaker ${targetBreakerObj?.data?.breaker_number} cannot be linked!`
            );
        }

        // breakerLink= 1:1
        if (sourceBreakerObj?.data?.breakerType === 1 && targetBreakerObj?.data?.breakerType === 1) {
            let breakerObjOne = {
                breaker_id: sourceBreakerObj.id,
                voltage: 240,
                phase_configuration: 1,
                breaker_type: 2,
                parent_breaker: '',
                is_linked: true,
            };

            let breakerObjTwo = {
                breaker_id: targetBreakerObj.id,
                voltage: 240,
                phase_configuration: 1,
                breaker_type: 2,
                parent_breaker: sourceBreakerObj.id,
                is_linked: true,
            };
            linkMultipleBreakersAPI(breakerObjOne, breakerObjTwo);
        }

        // breakerLink= 2:2
        if (sourceBreakerObj?.data?.breakerType === 2 && targetBreakerObj?.data?.breakerType === 2) {
            alert(
                `Breaker ${sourceBreakerObj?.data?.breaker_number} & Breaker ${targetBreakerObj?.data?.breaker_number} cannot be linked!`
            );
        }

        // breakerLink= 1:2
        // breakerLink= 2:1
        if (sourceBreakerObj?.data?.breakerType === 2 || targetBreakerObj?.data?.breakerType === 2) {
            if (sourceBreakerObj?.data?.breakerType === 2) {
                let parentBreakerObj = distributedBreakersData.find(
                    record => record?.id === sourceBreakerObj?.data?.parentBreaker
                );

                let breakerObjOne = {
                    breaker_id: parentBreakerObj.id,
                    voltage: 208,
                    phase_configuration: 3,
                    breaker_type: 3,
                    parent_breaker: '',
                    is_linked: true,
                };

                let breakerObjTwo = {
                    breaker_id: sourceBreakerObj.id,
                    voltage: 208,
                    phase_configuration: 3,
                    breaker_type: 3,
                    parent_breaker: parentBreakerObj.id,
                    is_linked: true,
                };

                let breakerObjThree = {
                    breaker_id: targetBreakerObj.id,
                    voltage: 208,
                    phase_configuration: 3,
                    breaker_type: 3,
                    parent_breaker: parentBreakerObj.id,
                    is_linked: true,
                };
                linkTripleBreakersAPI(breakerObjOne, breakerObjTwo, breakerObjThree);
            }
            if (targetBreakerObj?.data?.breakerType === 2) {
                let thirdBreakerObj = distributedBreakersData.find(
                    record => record?.data.parentBreaker === targetBreakerObj?.id
                );

                let breakerObjOne = {
                    breaker_id: sourceBreakerObj.id,
                    voltage: 208,
                    phase_configuration: 3,
                    breaker_type: 3,
                    parent_breaker: '',
                    is_linked: true,
                };

                let breakerObjTwo = {
                    breaker_id: targetBreakerObj.id,
                    voltage: 208,
                    phase_configuration: 3,
                    breaker_type: 3,
                    parent_breaker: sourceBreakerObj.id,
                    is_linked: true,
                };

                let breakerObjThree = {
                    breaker_id: thirdBreakerObj.id,
                    voltage: 208,
                    phase_configuration: 3,
                    breaker_type: 3,
                    parent_breaker: sourceBreakerObj.id,
                    is_linked: true,
                };
                linkTripleBreakersAPI(breakerObjOne, breakerObjTwo, breakerObjThree);
            }
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
                    {!sourceBreakerObj?.data?.isLinked && !targetBreakerObj?.data?.isLinked && (
                        <button className="unlink_button_style" onClick={linkBreakers}>
                            <FontAwesomeIcon icon={faLinkHorizontalSlash} color="#7C879C" size="md" />
                        </button>
                    )}

                    {/* When Source Breaker is not linked & Target Breaker linked */}
                    {!sourceBreakerObj?.data?.isLinked && targetBreakerObj?.data?.isLinked && (
                        <button className="unlink_button_style" onClick={linkBreakers}>
                            <FontAwesomeIcon icon={faLinkHorizontalSlash} color="#7C879C" size="md" />
                        </button>
                    )}

                    {/* When Source Breaker is linked & Target Breaker not linked */}
                    {sourceBreakerObj?.data?.isLinked && !targetBreakerObj?.data?.isLinked && (
                        <button className="unlink_button_style" onClick={linkBreakers}>
                            <FontAwesomeIcon icon={faLinkHorizontalSlash} color="#7C879C" size="md" />
                        </button>
                    )}

                    {/* When Source & Target Breaker both linked */}
                    {sourceBreakerObj?.data?.isLinked && targetBreakerObj?.data?.isLinked && (
                        <>
                            {isBothBreakerLinked() && (
                                <button className="link_button_style" onClick={linkBreakers}>
                                    <FontAwesomeIcon icon={faLinkHorizontal} color="#444CE7" size="md" />
                                </button>
                            )}
                            {!isBothBreakerLinked() && (
                                <button className="unlink_button_style" onClick={linkBreakers}>
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
