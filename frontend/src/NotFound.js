import React from "react"
import { Col } from "react-bootstrap"
import { Helmet } from "react-helmet"

const NotFound = () => {
    return (
        <Col md={3} className="bg-light rounded shadow text-center m-2 mx-auto p-2">
            <Helmet>
                <title>صفحه مورد نظر یافت نشد.</title>
                <meta name="robots" content="noindex" />
            </Helmet>
            <h1>صفحه مورد نظر یافت نشد.</h1>
            <a href="/">برگشت به خانه</a>
        </Col>
    )
}

export default NotFound