import React from "react";
import {Button, Col, Container, Row} from "react-bootstrap";

const Footer = () => {
    return (
        <footer className="bg-primary text-light mt-auto d-print-none">
            <Container>
                <Row>
                    <Col className="p-2" md={8}>
                        <span className="d-block h1 m-4">استوک دیوایس</span>
                        <table id="ContactUs">
                            <tbody>
                                <tr>
                                    <td>
                                        <i className="fa-solid fa-location-dot" /> آدرس:
                                    </td>
                                    <td>تهران، خیابان ولیعصر، نبش خیابان بزرگمهر، پاساژ رنگین کمان، پلاک ۵ <a href="https://maps.app.goo.gl/raKrnhDPDKLSD7HBA">)نمایش روی نقشه(</a></td>
                                </tr>
                                <tr>
                                    <td>
                                        <i className="fa-solid fa-phone" /> تلفن:
                                    </td>
                                    <td>
                                        <ul>
                                            <li>۰۲۱ - ۶۶۹۵۲۹۷۷</li>
                                            <li>۰۲۱ - ۶۶۹۵۲۹۷۸</li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <i className="fa-solid fa-clock"></i> ساعت کاری:
                                    </td>
                                    <td>
                                        <ul>
                                            <li>شنبه تا چهارشنبه : ساعت ۱۰:۳۰ تا ۱۹:۰۰</li>
                                            <li>پنج شنبه: ساعت ۱۰:۳۰ تا ۱۴:۰۰</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Col>
                    <Col className="d-flex justify-content-center align-items-center">
                        <a referrerPolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=497249&Code=nYN9CDemC1ITRqpFeP1D5YSVKI70Vzyk">
                            <img referrerPolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=497249&Code=nYN9CDemC1ITRqpFeP1D5YSVKI70Vzyk" code="nYN9CDemC1ITRqpFeP1D5YSVKI70Vzyk" />
                        </a>
                    </Col>
                </Row>
                <div className="text-center">
                    <Button className="m-1" variant="light" href="mail:stockdevice.ir@gmail.com"><i className="fa-solid fa-envelope" /></Button>
                    <Button className="m-1" variant="light" href="https://t.me/stockdevice_ir"><i className="fa-brands fa-telegram" /></Button>
                    <Button className="m-1" variant="light" href="https://instagram.com/stockdevice.ir"><i className="fa-brands fa-instagram"></i></Button>
                </div>
            </Container>
        </footer>
    );
};

export default Footer;
