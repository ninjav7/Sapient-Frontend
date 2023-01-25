import React, { useState, useEffect, Suspense } from 'react';
import { Card } from 'reactstrap';
import { connect } from 'react-redux';
import './style.css';
import { changeLayout } from '../redux/actions';
import AdminNav from '../components/AdminNav/AdminNav';
import SecondaryTopNavBar from '../components/SecondaryTopNavBar';


const loading = () => <div className="text-center"></div>;

const AdminLayout = (props) => {
    const children = props.children || null;

    return (
        <React.Fragment>
            <div id="wrapper">
                <div>
                    <AdminNav />
                </div>

                {/* <div>
                    <SecondaryTopNavBar />
                </div> */}

                <div>
                        <div className="energy-page-content-full-screen">
                            <Suspense fallback={loading()}>
                                <Card className="energy-page-content-card shadow-none">{children}</Card>
                            </Suspense>
                        </div>
                </div>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => {
    return {
        layout: state.Layout,
        user: state.Auth.user,
    };
};
export default connect(mapStateToProps, { changeLayout })(AdminLayout);
