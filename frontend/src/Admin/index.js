import React from "react"
import {Route, Routes} from "react-router-dom"
import {Row, Col, ListGroup, Button, Container} from "react-bootstrap"
import Blogs from "./Blog/Blogs"
import BlogComments from "./Blog/Comments"
import Users from "./Users"
import Dashboard from "./Dashboard"
import Banners from "./Banners"
import Products from "./Store/Products"
import Categories from "./Store/Categories"
import ProductComments from "./Store/Comments"
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
                        <ListGroup.Item action href="/admin/store/products" active={document.location.pathname == "/admin/store/products"}>کالا ها</ListGroup.Item>
                        <ListGroup.Item action href="/admin/store/categories" active={document.location.pathname == "/admin/store/categories"}>دسته بندی ها</ListGroup.Item>
                        <ListGroup.Item action href="/admin/store/comments" active={document.location.pathname == "/admin/store/comments"}>دیدگاه ها</ListGroup.Item>
                        <ListGroup.Item action href="/admin/store/orders" active={document.location.pathname == "/admin/store/orders"}>سفارش ها</ListGroup.Item>
                    </ListGroup>
                    <ListGroup className="mb-1">
                        <ListGroup.Item className="bg-primary bg-opacity-25 text-center">وبلاگ</ListGroup.Item>
                        <ListGroup.Item action href="/admin/blog/blogs" active={document.location.pathname == "/admin/blog/blogs"}>مطالب</ListGroup.Item>
                        <ListGroup.Item action href="/admin/blog/comments" active={document.location.pathname == "/admin/blog/comments"}>دیدگاه ها</ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col lg={10} className="overflow-auto">
                    <div className="bg-light rounded p-1">
                        <Routes>
                            <Route index element={<Dashboard />} />
                            <Route path="banners" element={<Banners />} />
                            <Route path="users" element={<Users />} />
                            <Route path="store/products" element={<Products />} />
                            <Route path="store/categories" element={<Categories />} />
                            <Route path="store/comments" element={<ProductComments />} />
                            <Route path="store/orders" element={<Orders />} />
                            <Route path="blog/blogs" element={<Blogs />} />
                            <Route path="blog/comments" element={<BlogComments />} />
                            <Route path="*" element={<NotFound />} />
                        </Routes>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Admin