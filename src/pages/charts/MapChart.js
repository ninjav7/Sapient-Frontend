import React from 'react';
import { Map, TileLayer, Polygon } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { statesData } from '../portfolio/data';

const center = [40.63463151377654, -97.89969605983609];

export default function App() {
    return (
        <Map center={center} zoom={4} style={{ width: '100%', height: '100%' }}>
            <TileLayer
                url="https://api.maptiler.com/maps/basic/256/tiles.json?key=hlZUO7nfmXLpMUVI1wXx"
                attribution='<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>'
            />
            {statesData.features.map((state) => {
                const coordinates = state.geometry.coordinates[0].map((item) => [item[1], item[0]]);

                return (
                    <Polygon
                        pathOptions={{
                            fillColor: '#FD8D3C',
                            fillOpacity: 0.7,
                            weight: 2,
                            opacity: 1,
                            dashArray: 3,
                            color: 'white',
                        }}
                        positions={coordinates}
                        eventHandlers={{
                            mouseover: (e) => {
                                const layer = e.target;
                                layer.setStyle({
                                    dashArray: '',
                                    fillColor: '#BD0026',
                                    fillOpacity: 0.7,
                                    weight: 2,
                                    opacity: 1,
                                    color: 'white',
                                });
                            },
                            mouseout: (e) => {
                                const layer = e.target;
                                layer.setStyle({
                                    fillOpacity: 0.7,
                                    weight: 2,
                                    dashArray: '3',
                                    color: 'white',
                                    fillColor: '#FD8D3C',
                                });
                            },
                            click: (e) => {},
                        }}
                    />
                );
            })}
        </Map>
    );
}
