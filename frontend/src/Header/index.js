import React from "react"
import {Button, Container, Image, Nav, Navbar, Offcanvas} from "react-bootstrap"
import Cart from "./Cart"
import { UserContext } from "../Account/UserContext"
import Login from "../Account/Login"
import Register from "../Account/Register"
import Search from "./Search"

const Header = () => {
    const {user} = React.useContext(UserContext)
    const [show, setShow] = React.useState(false)

    return (
        <Container className="bg-primary d-print-none" fluid>
            <Navbar variant="dark" expand="lg">
                <Navbar.Brand href="/">
                    <Image className="me-2" src="/logo.png" alt="استوک دیوایس" width={25} fluid />
                </Navbar.Brand>
                <Navbar.Offcanvas show={show} onHide={() => setShow(false)}>
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
                        <Search />
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
                            <Login className="me-1" />
                            <Register />
                        </>}
                    </div>
                </Nav>
                <Navbar.Toggle onClick={() => setShow(true)} className="m-1" />
            </Navbar>
        </Container>
    )
}

export default Header