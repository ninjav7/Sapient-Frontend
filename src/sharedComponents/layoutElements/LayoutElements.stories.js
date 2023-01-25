import React, { useState } from 'react';

import Brick from '../brick';
import LayoutElements from './LayoutElements';

import { allFloors, allSpaces } from './mock';

import '../assets/scss/stories.scss';

export default {
    title: 'Components/LayoutElements',
    component: LayoutElements,
};

export const Default = (props) => {
    const [isLoadingLastColumn, setIsLoadingLastColumn] = useState(false);
    const [spaces, setSpaces] = useState([]);

    // Example of using
    const onClickForAllItems = async ({ nativeHandler, data }) => {
        nativeHandler();
        if (!data.floor_id) {
            return;
        }

        setIsLoadingLastColumn(true);
        //Emulation of backend request's time
        await new Promise((resolve) => setTimeout(resolve, 3000));
        setSpaces(allSpaces[data.floor_id]);
        setIsLoadingLastColumn(false);
    };

    return (
        <>
            <h6>Turn on/off loading for last column</h6>
            <select
                onChange={() => {
                    setIsLoadingLastColumn(!isLoadingLastColumn);
                }}>
                <option selected>Off</option>
                <option>On</option>
            </select>
            <Brick />
            <LayoutElements
                {...props}
                isLoadingLastColumn={isLoadingLastColumn}
                spaces={spaces}
                //Just example that shows we can apply the same for all items
                // onClickForAllItems={onClickForAllItems}
                onClickEachChild={[onClickForAllItems]}
            />
        </>
    );
};

Default.args = {
    // Rendering

    //callBackEachElemStack: [(props) => ({...props, title: 'Building Root2'})],
    //callBackForAllStack: (props) => ({...props, title: 'Building Root'}),

    //Click on items

    // we can define individual handler for each item, has the highest priority
    // onClickEachChild: [(props) => props[0].nativeHandler() && console.log(props)],

    // handler for all items
    // onClickForAllItems: (props) => {
    //     console.log(props);
    //     props.nativeHandler();
    // },

    onColumnAdd: (args) => {
        alert('Column add');
        console.log(args);
    },
    onColumnEdit: (args) => {
        alert('Column edit');
        console.log(args);
    },
    onColumnNameEdit: (args) => {
        alert('Column Name edit');
        console.log(args);
    },
    onColumnFilter: (args) => {
        alert('Column Filter');
        console.log(args);
    },
    onItemEdit: (args) => {
        console.log(args);
        alert('Item Edit ');
    },

    floors: allFloors,

    // Put all props that related to building you need
    buildingData: { bdId: 'buildingID' },
};
