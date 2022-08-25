import React,{useEffect} from 'react';
import BuildingSwitcher from './BuildingSwitcher';
import { ComponentStore } from '../../store/ComponentStore';
import '../style.css';
import './PageTracker.scss'
import Breadcrumbs from './Breadcrumbs';
import { Redirect, Link, useLocation, useHistory } from 'react-router-dom';


const PageTracker = () => {
    const currentParentRoute = ComponentStore.useState((s) => s.parent);
    const location = useLocation();
    let history = useHistory();
    useEffect(()=>{
        // console.log(currentParentRoute);
        // console.log(location);
        // console.log(history);
        // if(location.pathname==='/explore/page'){
        //     window.location.reload();
        // }
    },[])
    return (
        <React.Fragment>
            <div className="page-tracker-container energy-second-nav-custom">
                <>
                    <BuildingSwitcher />
                    <div className="vl"></div>
                </>
                <div className="route-tracker">
                    <Breadcrumbs />
                </div>
            </div>
        </React.Fragment>
    );
};

export default PageTracker;
