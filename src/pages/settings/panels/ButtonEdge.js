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
                    <button className="link_button_style" onClick={(event) => onEdgeClick(event, id, breakerLinkData)}>
                        <FontAwesomeIcon icon={faLinkHorizontalSlash} color="#7C879C" size="md" />
                    </button>
                </body>
            </foreignObject>
        </>
    );
}
