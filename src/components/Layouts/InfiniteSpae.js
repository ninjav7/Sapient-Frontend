import axios from 'axios';
import { useAtom } from 'jotai';
import React, { useEffect } from 'react';
import { Cookies } from 'react-cookie';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledDropdown } from 'reactstrap';
import { BaseUrl, getSpaces } from '../../services/Network';
import { iterationNumber, spaceId, spaceName } from '../../store/globalState';

const InfiniteSpae = ({ floorId }) => {
    let cookies = new Cookies();
    let userdata = cookies.get('user');

    const [iterations, setIterations] = useAtom(iterationNumber);
    const [getSpaceName, setGetSpaceName] = useAtom(spaceName);
    const [spaceID, setSpaceID] = useAtom(spaceId);

    useEffect(() => {
        const headers = {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${userdata.token}`,
        };
        const params = `?floor_id=${spaceID}`;
        axios.get(`${BaseUrl}${getSpaces}${params}`, { headers }).then((res) => {});
    }, [spaceID]);

    return (
        <div className="container-column">
            <div className="container-heading">
                <span>{getSpaceName}</span>
                <div className="mr-2" style={{ marginLeft: 'auto' }}>
                    <i className="uil uil-filter mr-3"></i>
                    <UncontrolledDropdown className="align-self-center float-right">
                        <DropdownToggle tag="button" className="btn btn-link p-0 dropdown-toggle text-muted">
                            <i className="uil uil-plus mr-2"></i>
                        </DropdownToggle>
                        <DropdownMenu right>
                            <DropdownItem
                                onClick={() => {
                                    // setModalShow(true);
                                }}>
                                Add Floor
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </div>
            </div>
            <div className="container-content-group">
                {/* {floorListAPI.map((floorName, i) => (
                    <div className="container-single-content mr-4" style={{ cursor: 'pointer' }} onClick={() => {}}>
                        <span> {floorName?.name}</span>
                        <span class="badge badge-light font-weight-bold float-right mr-4"></span>
                    </div>
                ))} */}
            </div>
        </div>
    );
};

export default InfiniteSpae;
