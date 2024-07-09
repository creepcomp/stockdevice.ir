import React from "react"
import {Button, Container, Image, Nav, Navbar, Offcanvas} from "react-bootstrap"
import "./style.css"
import logo from "./logo.png"
import Cart from "./Cart"
import { UserContext } from "../Account/UserContext"
import Login from "../Account/Login"
import Register from "../Account/Register"

const Header = () => {
    const {user, setUser} = React.useContext(UserContext)

    return (
        <Container className="bg-primary d-print-none" fluid>
            <Navbar variant="dark" expand="lg">
                <Navbar.Brand href="/">
                    <Image className="me-2" src={logo} rel="استوک دیوایس" width={25} fluid />
                </Navbar.Brand>
                <Navbar.Offcanvas>
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title>استوک دیوایس</Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="align-items-center">
                            <Nav.Link href="/">استوک دیوایس</Nav.Link>
                            <Nav.Link href="/store">فروشگاه</Nav.Link>
                            <Nav.Link href="#ContactUs">درباره ما</Nav.Link>
                            <Nav.Link href="#ContactUs">تماس با ما</Nav.Link>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
                <Nav className="ms-auto">
                    <div className="d-flex">
                        {user ? <>
                            <Button variant="light" className="m-1" href="/account">
                                <i className="fa-solid fa-user" />
                            </Button>
                            <Cart />
                        </> : <>
                            <Login />
                            <Register />
                        </>}
                    </div>
                </Nav>
                <Navbar.Toggle className="m-1" />
            </Navbar>
        </Container>
    )
}

export default Header
