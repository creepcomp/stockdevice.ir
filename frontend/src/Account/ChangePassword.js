import React from "react"
import { Alert, Button, Col, Form, Modal, Row } from "react-bootstrap"

const ChangePassword = () => {
    const [show, setShow] = React.useState(false)
    const [input, setInput] = React.useState({})
    const [error, setError] = React.useState({})
    const [success, setSuccess] = React.useState({})
    const [sended, setSended] = React.useState(false)

    const sendCode = () => {
        fetch("/api/account/sendCode/", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            },
            body: JSON.stringify({username: input.username}),
        }).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                setSuccess(data)
                setSended(true)
            }
            else setError(data)
        })
    }

    const changePassword = () => {
        fetch("/api/account/changePassword/", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            },
            body: JSON.stringify(input),
        }).then(async (r) => {
            const data = await r.json()
            if (r.ok) setSuccess("رمز عبور با موفقیت تغییر کرد.")
            else setError(data)
        })
    }

    const handleChange = (e) => {
        setInput({...input, [e.target.name]: e.target.value})
    }

    return (
        <>
            <Button className="w-100" variant="secondary" onClick={() => setShow(true)}>تغییر رمز عبور</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>تغییر رمز عبور</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {success.detail ? <Alert variant="success">{success.detail}</Alert>: null}
                    {error.detail ? <Alert variant="danger">{error.detail}</Alert>: null}
                    <Row>
                        <Col>
                            <Form.Label>نام کاربری (تلفن همراه)‌:</Form.Label>
                            <Form.Control name="username" value={input.username} onChange={handleChange} isInvalid={error.username} placeholder="۰۹۱۲۳۴۵۶۷۸۹" dir="ltr" />
                            <Form.Control.Feedback type="invalid">{error.username}</Form.Control.Feedback>
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center" md={4}>
                            {sended ? (
                                <div>
                                    <Form.Label>کد دریافتی:</Form.Label>
                                    <Form.Control name="code" value={input.code} onChange={handleChange} isInvalid={error.code} placeholder="۱۲۳۴۵" dir="ltr" />
                                </div>
                            ) : <Button onClick={sendCode}>دریافت کد</Button>}
                            <Form.Control.Feedback type="invalid">{error.code}</Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Form.Label>رمز قدیمی:</Form.Label>
                    <Form.Control name="password" type="password" value={input.password} onChange={handleChange} isInvalid={error.password} placeholder="●●●●●●●●" dir="ltr" />
                    <Form.Control.Feedback type="invalid">{error.password}</Form.Control.Feedback>
                    <Row>
                        <Col md>
                            <Form.Label>رمز جدید</Form.Label>
                            <Form.Control name="newPassword" type="password" value={input.newPassword} onChange={handleChange} isInvalid={error.newPassword} placeholder="●●●●●●●●" dir="ltr" />
                            <Form.Control.Feedback type="invalid">{error.newPassword}</Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Label>تکرار رمز جدید:</Form.Label>
                            <Form.Control name="newPassword2" type="password" value={input.newPassword2} onChange={handleChange} isInvalid={error.newPassword2}  placeholder="●●●●●●●●" dir="ltr" />
                            <Form.Control.Feedback type="invalid">{error.newPassword2}</Form.Control.Feedback>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={changePassword}>تغییر رمز</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ChangePassword