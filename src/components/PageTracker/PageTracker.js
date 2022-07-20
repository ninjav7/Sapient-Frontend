import React, { useState, useEffect } from 'react';
import { BaseUrl, getBuilding } from '../../services/Network';
import { Link, useLocation } from 'react-router-dom';
import { Breadcrumb, BreadcrumbItem } from 'reactstrap';
import axios from 'axios';
import { BreadcrumbStore } from '../../store/BreadcrumbStore';
import { BuildingStore } from '../../store/BuildingStore';
import { DateRangeStore } from '../../store/DateRangeStore';
import { ComponentStore } from '../../store/ComponentStore';
import { Cookies } from 'react-cookie';
import '../style.css';
import SelectBuilding from './SelectBuilding';

const PageTracker = () => {
    const breadcrumList = BreadcrumbStore.useState((bs) => bs.items);
    const items = breadcrumList || [];

    return (
        <React.Fragment>
            <div className="page-tracker-container energy-second-nav-custom">
                <>
                    <SelectBuilding />
                    <div className="vl"></div>
                </>
                <div className="route-tracker">
                    <Breadcrumb className="custom-breadcrumb-style">
                        {items.map((item, index) => {
                            return item.active ? (
                                <BreadcrumbItem active key={index}>
                                    {item.label}
                                </BreadcrumbItem>
                            ) : (
                                <BreadcrumbItem key={index}>
                                    <Link to={item.path}>{item.label}</Link>
                                </BreadcrumbItem>
                            );
                        })}
                    </Breadcrumb>
                </div>
            </div>
        </React.Fragment>
    );
};

export default PageTracker;
