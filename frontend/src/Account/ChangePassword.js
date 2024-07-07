import React from "react";
import { Alert, Button, Form, Modal, Row } from "react-bootstrap";

const ChangePassword = () => {
    const [input, setInput] = React.useState({})
    const [error, setError] = React.useState({})
    const [success, setSuccess] = React.useState()

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
            const data = await r.json();
            if (r.ok) {
                setSuccess("کد به صورت پیامک برای شماره ارسال شد.")
                setSended(true);
            }
            else setError(data);
        });
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
            const data = await r.json();
            if (r.ok) setSuccess("رمز عبور با موفقیت تغییر کرد.")
            else setError(data);
        });
    }

    const handleChange = (e) => {
        setInput({...input, [e.target.name]: e.target.value})
    }

    return (
        <>
            <Modal>
                <Modal.Header closeButton>
                    <Modal.Title>فراموشی / تغییر رمز</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {success ? <Alert variant="success">{success}</Alert>: null}
                    {error.detail ? <Alert variant="danger">{error.detail}</Alert>: null}
                    <Row>
                        <Col>
                            <Form.Label>نام کاربری (تلفن همراه)‌:</Form.Label>
                            <Form.Control name="username" value={input.username} onChange={handleChange} isInvalid={error.username} />
                            <Form.Control.Feedback type="invalid">{error.username}</Form.Control.Feedback>
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center" md={4}>
                            {sended ? <Form.Control name="code" value={input.code} onChange={handleChange} isInvalid={error.code} /> : <Button onClick={sendCode}>دریافت کد</Button>}
                            <Form.Control.Feedback type="invalid">{error.code}</Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Form.Label>رمز قدیمی:</Form.Label>
                    <Form.Control name="oldPassword" value={input.oldPassword} onChange={handleChange} isInvalid={error.oldPassword} />
                    <Form.Control.Feedback type="invalid">{error.oldPassword}</Form.Control.Feedback>
                    <Row>
                        <Col md>
                            <Form.Label>رمز جدید</Form.Label>
                            <Form.Control name="newPassword" value={input.newPassword} onChange={handleChange} isInvalid={error.newPassword} />
                            <Form.Control.Feedback type="invalid">{error.newPassword}</Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Label>تکرار رمز جدید:</Form.Label>
                            <Form.Control name="newPasswordConfirm" value={input.newPasswordConfirm} onChange={handleChange} isInvalid={error.newPasswordConfirm} />
                            <Form.Control.Feedback type="invalid">{error.newPasswordConfirm}</Form.Control.Feedback>
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