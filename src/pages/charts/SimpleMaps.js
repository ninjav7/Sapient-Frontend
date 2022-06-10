import React, { useState } from 'react';
import { ComposableMap, Geographies, Graticule, Geography, Marker, ZoomableGroup } from 'react-simple-maps';

const SimpleMaps = ({ markers }) => {
    const geoUrl =
        'https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json';

    // const markers = [
    //     { markerOffset: -15, name: 'La Paz', coordinates: [-68.1193, -16.4897] },
    //     { markerOffset: 25, name: 'Bogota', coordinates: [-74.0721, 4.711] },
    //     { markerOffset: 25, name: 'Quito', coordinates: [-78.4678, -0.1807] },
    //     { markerOffset: -15, name: 'Georgetown', coordinates: [-58.1551, 6.8013] },
    //     { markerOffset: 25, name: 'Paramaribo', coordinates: [-55.2038, 5.852] },
    //     { markerOffset: -15, name: 'Caracas', coordinates: [-66.9036, 10.4806] },
    //     { markerOffset: -15, name: 'Lima', coordinates: [-77.0428, -12.0464] },
    // ];

    const [position, setPosition] = useState({ coordinates: [0, 0], zoom: 1 });

    function handleZoomIn() {
        if (position.zoom >= 4) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom * 2 }));
    }

    function handleZoomOut() {
        if (position.zoom <= 1) return;
        setPosition((pos) => ({ ...pos, zoom: pos.zoom / 2 }));
    }

    function handleMoveEnd(position) {
        setPosition(position);
    }

    return (
        <>
            <ComposableMap
                projection="geoAzimuthalEqualArea"
                projectionConfig={{
                    rotate: [58, 5, 0],
                    scale: 1200,
                }}
                height="850"
                width="900">
                <ZoomableGroup zoom={position.zoom} center={position.coordinates} onMoveEnd={handleMoveEnd}>
                    <Graticule stroke="#EAEAEC" />
                    <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                            geographies
                                .filter((d) => d.properties.REGION_UN === 'Americas')
                                .map((geo) => (
                                    <Geography key={geo.rsmKey} geography={geo} fill="#EAEAEC" stroke="#D6D6DA" />
                                ))
                        }
                    </Geographies>
                    {markers.map(({ name, coordinates, markerOffset }) => (
                        <Marker key={name} coordinates={coordinates}>
                            <circle r={40} fill="#FB9191" stroke="#fff" strokeWidth={2} />
                            {/* <text
                                textAnchor="middle"
                                y={markerOffset}
                                style={{ fontFamily: 'system-ui', fill: '#5D5A6D' }}>
                                {name}
                            </text> */}
                        </Marker>
                    ))}
                </ZoomableGroup>
            </ComposableMap>
        </>
    );
};

export default SimpleMaps;
