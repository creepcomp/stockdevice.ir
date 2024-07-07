import React from "react";
import { Col, Container, ListGroup, Row } from "react-bootstrap";
import { Route, Routes } from "react-router-dom";
import Orders from "./Orders";
import Profile from "./Profile";

const Account = () => {
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        fetch("/api/account/me/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setUser(data);
            else console.error(data);
        });
    }, []);
    
    return (
        <Container>
            <Row>
                <Col md={3}>
                    <ListGroup className="m-2">
                        <ListGroup.Item href="/account" action active={document.location.pathname == "/account"}>حساب کاربری</ListGroup.Item>
                        <ListGroup.Item href="/account/orders" action active={document.location.pathname == "/admin/orders"}>سفارش ها</ListGroup.Item>
                        <ListGroup.Item variant="danger" action href="/logout">خروج</ListGroup.Item>
                    </ListGroup>
                </Col>
                <Col>
                    <Routes>
                        <Route index element={<Profile />} />
                        <Route path="orders" element={<Orders />} />
                    </Routes>
                </Col>
            </Row>
        </Container>
    )
}

export default Account