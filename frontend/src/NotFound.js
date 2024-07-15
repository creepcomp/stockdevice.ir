import React from "react"
import { Col } from "react-bootstrap"
import { Helmet } from "react-helmet"

const NotFound = () => {
    return (
        <div className="m-auto text-center">
            <Helmet>
                <title>صفحه مورد نظر یافت نشد.</title>
                <meta name="robots" content="noindex" />
            </Helmet>
            <h1>صفحه مورد نظر یافت نشد.</h1>
            <a href="/">برگشت به خانه</a>
        </div>
    )
}

export default NotFound