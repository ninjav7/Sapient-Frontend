import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkHorizontalSlash, faLinkHorizontal } from '@fortawesome/pro-regular-svg-icons';
import { getBezierPath, getEdgeCenter, getMarkerEnd } from 'react-flow-renderer';
import { BreakersStore } from '../../../store/BreakersStore';
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

    const breakerLinkData = BreakersStore.useState((s) => s.breakerLinkData);
    const distributedBreakersData = BreakersStore.useState((s) => s.distributedBreakersData);

    let breakerLinkObj = breakerLinkData.find((record) => record?.id === id);
    let sourceBreakerObj = distributedBreakersData.find((record) => record?.id === breakerLinkObj?.source);
    let targetBreakerObj = distributedBreakersData.find((record) => record?.id === breakerLinkObj?.target);

    const breakerLinkObjs = () => {
        console.log('SSR sourceBreakerObj', sourceBreakerObj);
        console.log('SSR targetBreakerObj', targetBreakerObj);
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
                                onEdgeClick(e, id, breakerLinkData);
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
                                onEdgeClick(e, id, breakerLinkData);
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
                                onEdgeClick(e, id, breakerLinkData);
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
