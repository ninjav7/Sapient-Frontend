import React from 'react';

import { Row, Col, Label, FormGroup, Button, Alert, InputGroup } from 'reactstrap';
import './auth.css';
import Slide1 from '../../assets/images/login/building-1.jpg';
import Slide2 from '../../assets/images/login/building-2.jpg';
import Slide3 from '../../assets/images/login/building-3.jpg';

function Holder({ title, rightContent }) {
    return (
        <Row>
            <Col lg={6} className="pr-0 pl-0">
                <div id="carouselExampleSlidesOnly" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <img className="backgroundStyle" src={Slide1} alt="First slide" />
                            <div class="carousel-caption">
                                <h3>A radically better way of achieving efficient buildings.</h3>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="backgroundStyle" src={Slide2} alt="Second slide" />
                            <div class="carousel-caption">
                                <h3>A radically better way of achieving efficient buildings.</h3>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <img className="backgroundStyle" src={Slide3} alt="Third slide" />
                            <div class="carousel-caption">
                                <h3>A radically better way of achieving efficient buildings.</h3>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <div className="backgroundStyle"></div> */}
            </Col>
            <Col lg={6} className="pr-0 pl-0">
                <div className="rightSide">
                    <div className="rightContentStyle">{rightContent}</div>
                </div>
            </Col>
        </Row>
    );
}
export default Holder;
