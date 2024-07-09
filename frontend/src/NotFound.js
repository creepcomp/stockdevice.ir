import React from "react"
import { Col } from "react-bootstrap"

const NotFound = () => {
    return (
        <Col md={6} className="bg-light rounded shadow m-auto text-center p-2">
            <h1>صفحه مورد نظر یافت نشد.</h1>
            <a href="/">برگشت به خانه</a>
        </Col>
    )
}

export default NotFound
