import React from "react"
import {Col, Container, Row} from "react-bootstrap"
import Products from "./Products"
import Blogs from "./Blogs"
import { Helmet } from "react-helmet"
import ProductsCarousel from "./ProductsCarousel"
import BlogsCarousel from "./BlogsCarousel"
import Banners from "./Banners"

const Home = () => {
    return (
        <Container className="p-2">
            <Helmet>
                <title>فروشگاه لپ تاپ و کامپیوتر استوک دیوایس</title>
                <meta name="keywords" content="لپ تاپ, کامپیوتر, خرید, فروش, استوک دیوایس" />
                <meta name="desciption" content="فروشگاه لپ تاپ و کامپیوتر استوک دیوایس، با بیش از ۳۰ سال سابقه تخصصی در زمینه واردات انواع لپ تاپ نو و استوک در ایران، وارد کننده رسمی لپ تاپ های اسنوک با قیمت مناسب در خدمت شما مشتریان گرامی هستیم." />
                <meta name="geo.region" content="IR" />
                <meta name="geo.placename" content="Tehran" />
                <meta name="geo.position" content="35.70362751.405120" />
                <meta name="ICBM" content="35.703627, 51.405120" />
            </Helmet>
            <Row className="mb-1">
                <Col md={8}>
                    <Banners />
                </Col>
                <Col className="p-1">
                    <ProductsCarousel />
                    <BlogsCarousel />
                </Col>
            </Row>
            <Products />
            <Blogs />
        </Container>
    )
}

export default Home