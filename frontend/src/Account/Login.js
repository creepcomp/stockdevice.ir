import React from "react"
import {Alert, Button, Form, Modal} from "react-bootstrap"
import {useCookies} from "react-cookie"
import ChangePassword from "./ChangePassword"

const Login = () => {
    const [cookies] = useCookies()
    const [show, setShow] = React.useState()
    const [user, setUser] = React.useState({})
    const [success, setSuccess] = React.useState({})
    const [error, setError] = React.useState({})

    const login = () => {
        fetch("/api/account/login/", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            },
            body: JSON.stringify(user),
        }).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                setSuccess(data)
                document.location.reload()
            }
            else setError(data)
        })
    }

    const handleChange = (e) => setUser({...user, [e.target.name]: e.target.value})

    return (
        <>
            <Button variant="light" className="m-1" onClick={() => setShow(true)}>ورود</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>ورود به حساب کاربری</Modal.Header>
                <Modal.Body>
                    {success.detail ? <Alert variant="danger" className="m-1 p-2">{success.detail}</Alert> : null}
                    {error.detail ? <Alert variant="danger" className="m-1 p-2">{error.detail}</Alert> : null}
                    <div className="mb-2">
                        <Form.Label>شماره همراه:</Form.Label>
                        <Form.Control dir="ltr" name="username" value={user.username} onChange={handleChange} isInvalid={error.username} placeholder="۰۹۱۲۳۴۵۶۷۸۹" />
                        <Form.Control.Feedback type="invalid">{error.username}</Form.Control.Feedback>
                        <Form.Label>رمز عبور:</Form.Label>
                        <Form.Control dir="ltr" name="password" type="password" value={user.password} onChange={handleChange} isInvalid={error.password} placeholder="●●●●●●●●" />
                        <Form.Control.Feedback type="invalid">{error.password}</Form.Control.Feedback>
                    </div>
                    <Button onClick={login} className="d-block w-100 my-1">ورود</Button>
                    <ChangePassword />
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Login
