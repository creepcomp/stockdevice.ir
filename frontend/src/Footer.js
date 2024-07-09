import React from "react"
import {Button, Col, Container, Row} from "react-bootstrap"

const Footer = () => {
    return (
        <footer className="bg-primary text-light mt-auto d-print-none">
            <Container>
                <Row>
                    <Col md={6} className="p-2">
                        <span className="d-block h1 m-4">استوک دیوایس</span>
                        <table id="ContactUs">
                            <tbody>
                                <tr>
                                    <td>
                                        <i className="fa-solid fa-location-dot" /> آدرس:
                                    </td>
                                    <td>تهران، خیابان ولیعصر، نبش خیابان بزرگمهر، پاساژ رنگین کمان، پلاک ۵</td>
                                </tr>
                                <tr>
                                    <td>
                                        <i className="fa-solid fa-phone" /> تلفن:
                                    </td>
                                    <td>
                                        <ul>
                                            <li>
                                                <span dir="ltr">۰۲۱ - ۶۶۹۵۲۹۷۷</span>
                                            </li>
                                            <li>
                                                <span dir="ltr">۰۲۱ - ۶۶۹۵۲۹۷۸</span>
                                            </li>
                                        </ul>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <i className="fa-solid fa-clock"></i> ساعت کاری:
                                    </td>
                                    <td>
                                        <ul>
                                            <li>شنبه تا چهارشنبه (ساعت ۱۰:۳۰ تا ۱۹:۰۰)</li>
                                            <li>پنج شنبه (ساعت ۱۰:۳۰ تا ۱۴:۰۰)</li>
                                        </ul>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className="text-center">
                            <Button className="m-1" variant="light" href="mail:stockdevice.ir@gmail.com"><i className="fa-solid fa-envelope" /></Button>
                            <Button className="m-1" variant="light" href="https://t.me/stockdevice_ir"><i className="fa-brands fa-telegram" /></Button>
                            <Button className="m-1" variant="light" href="https://instagram.com/stockdevice.ir"><i className="fa-brands fa-instagram"></i></Button>
                        </div>
                    </Col>
                    <Col className="d-flex justify-content-center align-items-center" md>
                        <iframe className="rounded" width="300" height="300" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1179.0505501794241!2d51.404831980703705!3d35.70354940508855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3f8e010de771a095%3A0x59e9b0a12659434a!2zU2FoZXIgQW5kaXNoZWggKNiz2KfYrdix2KfZhtiv24zYtNmHKQ!5e0!3m2!1sen!2s!4v1720484746327!5m2!1sen!2s" />
                    </Col>
                    <Col className="d-flex justify-content-center align-items-center">
                        <a referrerPolicy="origin" target="_blank" href="https://trustseal.enamad.ir/?id=497249&Code=nYN9CDemC1ITRqpFeP1D5YSVKI70Vzyk">
                            <img className="rounded" referrerPolicy="origin" src="https://trustseal.enamad.ir/logo.aspx?id=497249&Code=nYN9CDemC1ITRqpFeP1D5YSVKI70Vzyk" code="nYN9CDemC1ITRqpFeP1D5YSVKI70Vzyk" />
                        </a>
                    </Col>
                </Row>
            </Container>
        </footer>
    )
}

export default Footer
