import React from "react"
import { Button, Col, Container, ListGroup, Row } from "react-bootstrap"
import { Route, Routes } from "react-router-dom"
import Orders from "./Orders"
import Profile from "./Profile"
import NotFound from "../NotFound"

const Account = () => {
    const [user, setUser] = React.useState()

    React.useEffect(() => {
        fetch("/api/account/me/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setUser(data)
            else console.error(data)
        })
    }, [])

    const logout = () => {
        fetch("/api/account/logout/").then(async (r) => {
            if (r.ok) document.location = "/"
        })
    }
    
    return (
        <Container className="p-2">
            <Row>
                <Col md={3} className="mb-1">
                    <ListGroup className="mb-1">
                        <ListGroup.Item href="/account" action active={document.location.pathname == "/account"}>حساب کاربری</ListGroup.Item>
                        <ListGroup.Item href="/account/orders" action active={document.location.pathname == "/account/orders"}>سفارش ها</ListGroup.Item>
                    </ListGroup>
                    <Button className="w-100" variant="danger" onClick={logout}>خروج</Button>
                </Col>
                <Col>
                    <Routes>
                        <Route index element={<Profile />} />
                        <Route path="orders" element={<Orders />} />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    )
}

export default Account