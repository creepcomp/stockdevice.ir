import React from "react"
import {Route, Routes} from "react-router-dom"
import {Row, Col, ListGroup, Button, Container} from "react-bootstrap"
import Blogs from "./Blogs"
import Users from "./Users"
import Dashboard from "./Dashboard"
import Banners from "./Banners"
import Products from "./Store/Products"
import Categories from "./Store/Categories"
import Comments from "./Store/Comments"
import Orders from "./Store/Orders"
import NotFound from "../NotFound"

const Admin = () => {
    return (
        <Container className="p-2" fluid>
            <Row>
                <Col className="d-print-none" lg={2}>
                    <Button className="w-100 mb-1" href="/admin/">داشبورد</Button>
                    <ListGroup className="mb-1">
                        <ListGroup.Item className="bg-primary bg-opacity-25 text-center">صفحه اصلی</ListGroup.Item>
                        <ListGroup.Item action href="/admin/banners" active={document.location.pathname == "/admin/banners"}>بنر ها</ListGroup.Item>
                    </ListGroup>
                    <ListGroup className="mb-1">
                        <ListGroup.Item className="bg-primary bg-opacity-25 text-center">حساب کاربری</ListGroup.Item>
                        <ListGroup.Item action href="/admin/users" active={document.location.pathname == "/admin/users"}>کاربران</ListGroup.Item>
                    </ListGroup>
                    <ListGroup className="mb-1">
                        <ListGroup.Item className="bg-primary bg-opacity-25 text-center">فروشگاه</ListGroup.Item>
                        <ListGroup.Item action href="/admin/products" active={document.location.pathname == "/admin/products"}>کالا ها</ListGroup.Item>
                        <ListGroup.Item action href="/admin/categories" active={document.location.pathname == "/admin/categories"}>دسته بندی ها</ListGroup.Item>
                        <ListGroup.Item action href="/admin/comments" active={document.location.pathname == "/admin/comments"}>دیدگاه ها</ListGroup.Item>
                        <ListGroup.Item action href="/admin/orders" active={document.location.pathname == "/admin/orders"}>سفارش ها</ListGroup.Item>
                    </ListGroup>
                    <ListGroup className="mb-1">
                        <ListGroup.Item className="bg-primary bg-opacity-25 text-center">وبلاگ</ListGroup.Item>
                        <ListGroup.Item action href="/admin/blogs" active={document.location.pathname == "/admin/blogs"}>مطالب</ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col lg={10} className="overflow-auto">
                    <div className="bg-light rounded p-1">
                        <Routes>
                            <Route index element={<Dashboard />} />
                            <Route path="banners" element={<Banners />} />
                            <Route path="blogs" element={<Blogs />} />
                            <Route path="categories" element={<Categories />} />
                            <Route path="products" element={<Products />} />
                            <Route path="users" element={<Users />} />
                            <Route path="comments" element={<Comments />} />
                            <Route path="orders" element={<Orders />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Admin