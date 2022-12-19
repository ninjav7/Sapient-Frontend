import React from 'react';
import { Row, Col } from 'reactstrap';
import './auth.scss';
import Slide1 from '../../assets/images/login/building-1.jpg';
import Slide2 from '../../assets/images/login/building-2.jpg';
import Slide3 from '../../assets/images/login/building-3.jpg';
import Carousel from 'react-bootstrap/Carousel';

function Holder({ rightContent }) {
    return (
        <Row>
            <Col lg={6} className="pr-0 pl-0">
                <Carousel controls={false} indicators={false}>
                    <Carousel.Item>
                        <img className="backgroundStyle" src={Slide3} />
                        <Carousel.Caption>
                            <h3>A radically better way of achieving efficient buildings.</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="backgroundStyle" src={Slide2} />
                        <Carousel.Caption>
                            <h3>A radically better way of achieving efficient buildings.</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                    <Carousel.Item>
                        <img className="backgroundStyle" src={Slide1} />
                        <Carousel.Caption>
                            <h3>A radically better way of achieving efficient buildings.</h3>
                        </Carousel.Caption>
                    </Carousel.Item>
                </Carousel>
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
