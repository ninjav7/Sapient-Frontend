/* eslint-disable no-undef */
import React, { useState } from 'react';
import { withGoogleMap, GoogleMap, Marker } from 'react-google-maps';

const ReactGoogleMap = () => {
    const [mapData, setMapData] = useState([
        {
            name: 'Delhi',
            coordinates: { lng: 77.1025, lat: 28.7041 },
            mag: 3.3,
        },
        {
            name: 'Seoul',
            coordinates: { lng: 126.978, lat: 37.5665 },
            mag: 5.0,
        },
        {
            name: 'Shanghai',
            coordinates: { lng: 121.4737, lat: 31.2304 },
            mag: 3.3,
        },
        {
            name: 'Beijing',
            coordinates: { lng: 116.4074, lat: 39.9042 },
            mag: 5.0,
        },
        {
            name: 'Mumbai',
            coordinates: { lng: 72.8777, lat: 19.076 },
            mag: 3.3,
        },
        {
            name: 'Moscow',
            coordinates: { lng: 37.6173, lat: 55.7558 },
            mag: 5.2,
        },
        {
            name: 'Dhaka',
            coordinates: { lng: 90.4125, lat: 23.8103 },
            mag: 1.5,
        },
        {
            name: 'Kolkata',
            coordinates: { lng: 88.3639, lat: 22.5726 },
            mag: 4.9,
        },
        {
            name: 'Istanbul',
            coordinates: { lng: 28.9784, lat: 41.0082 },
            mag: 2.1,
        },
        {
            name: 'Tampa',
            coordinates: { lng: -82.452606, lat: 27.964157 },
            mag: 3.1,
        },
        {
            name: 'canada',
            coordinates: { lat: 56.1304, lng: -106.3468 },
            mag: 6.1,
        },
        {
            name: 'Karnataka',
            coordinates: { lat: 15.3173, lng: 75.7139 },
            mag: 6.1,
        },
    ]);

    const GoogleMapExample = withGoogleMap((props) => (
        <GoogleMap defaultCenter={{ lat: 40.756795, lng: -73.954298 }} defaultZoom={4}>
            {
                //curly brace here lets you write javscript in JSX
                mapData.map((item) => (
                    <Marker
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: 'red',
                            fillOpacity: 0.2,
                            scale: Math.pow(2, item.mag) / 2,
                            strokeColor: 'white',
                            strokeWeight: 0.5,
                        }}
                        key={item.id}
                        title={item.name}
                        name={item.name}
                        position={{
                            lat: item.coordinates.lat,
                            lng: item.coordinates.lng,
                        }}
                    />
                ))
            }
        </GoogleMap>
    ));

    return (
        <>
            <div>
                <GoogleMapExample
                    containerElement={<div style={{ height: `500px`, width: '100%' }} />}
                    mapElement={<div style={{ height: `100%` }} />}
                />
            </div>
        </>
    );
};

export default ReactGoogleMap;
