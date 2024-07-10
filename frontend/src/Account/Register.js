import React from "react"
import {Alert, Button, Form, Modal, Row, Col} from "react-bootstrap"
import {useCookies} from "react-cookie"

const Register = () => {
    const [cookies] = useCookies()
    const [show, setShow] = React.useState(false)
    const [input, setInput] = React.useState({})
    const [error, setError] = React.useState({})
    const [success, setSuccess] = React.useState()
    const [sended, setSended] = React.useState(false)

    const register = () => {
        fetch("/api/account/register/", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            },
            body: JSON.stringify(input),
        }).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                setSuccess("حساب کاربری با موفقیت ایجاد شد.")
                document.location.reload()
            }
            else setError(data)
        })
    }

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
                setSuccess("کد به صورت پیامک برای شماره ارسال شد.")
                setSended(true)
            }
            else setError(data)
        })
    }

    const handleChange = (e) => setInput({...input, [e.target.name]: e.target.value})

    return (
        <>
            <Button variant="light" className="m-1" onClick={() => setShow(true)}>ثبت نام</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>ثبت نام حساب کاربری</Modal.Header>
                <Modal.Body>
                    {success ? <Alert variant="success">{success}</Alert>: null}
                    {error.detail ? <Alert variant="danger">{error.detail}</Alert> : null}
                    <Row>
                        <Col>
                            <Form.Label>شماره همراه:</Form.Label>
                            <Form.Control className="text-center" name="username" placeholder="۰۹۱۲۳۴۵۶۷۸۹" value={input.username} onChange={handleChange} isInvalid={error.username} />
                            <Form.Control.Feedback type="invalid">{error.username}</Form.Control.Feedback>
                        </Col>
                        <Col className="d-flex justify-content-center align-items-center" sm={4}>
                            {sended ? <Form.Control className="text-center" name="code" placeholder="کد دریافتی" value={input.code} onChange={handleChange} isInvalid={error.code} /> : <Button onClick={sendCode}>دریافت کد</Button>}
                            <Form.Control.Feedback type="invalid">{error.code}</Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Row>
                        <Col md>
                            <Form.Label>رمز عبور:</Form.Label>
                            <Form.Control className="text-center" dir="ltr" name="password" placeholder="●●●●●●●●" type="password" value={input.password} onChange={handleChange} isInvalid={error.password} />
                            <Form.Control.Feedback type="invalid">{error.password}</Form.Control.Feedback>
                        </Col>
                        <Col md>
                            <Form.Label>تکرار رمز عبور:</Form.Label>
                            <Form.Control className="text-center" dir="ltr" name="confirm_password" placeholder="●●●●●●●●" type="password" value={input.confirm_password} onChange={handleChange} isInvalid={error.confirm_password} />
                            <Form.Control.Feedback type="invalid">{error.confirm_password}</Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Button onClick={register} className="d-block w-100 mt-2">ثبت نام</Button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Register