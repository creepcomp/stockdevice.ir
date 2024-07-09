import React from "react"
import { Alert, Button, Col, Form, Row } from "react-bootstrap"
import { UserContext } from "./UserContext"
import { useCookies } from "react-cookie"
import { Helmet } from "react-helmet"

const Profile = () => {
    const [cookies] = useCookies()
    const [user, setUser] = React.useState({})
    const [error, setError] = React.useState({})
    const [success, setSuccess] = React.useState({})

    React.useEffect(() => {
        fetch("/api/account/me/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setUser(data)
            else setError(data)
        })
    }, [])
    
    const save = () => {
        fetch(`/api/account/updateProfile/`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            },
            body: JSON.stringify(user)
        }).then(async (r) => {
            const data = await r.json()
            if (r.ok) setSuccess(data)
            else setError(data)
        })
    }

    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    return (
        <div className="bg-light rounded p-2">
            <Helmet>
                <title>اطلاعات کاربری</title>
            </Helmet>
            <h1 className="h2 text-center border-bottom p-2">حساب کاربری</h1>
            {success.detail ? <Alert className="m-1 p-2" variant="success">{success.detail}</Alert> : null}
            {error.detail ? <Alert className="m-1 p-2" variant="danger">{error.detail}</Alert> : null}
            <Row>
                <Col md>
                    <Form.Label>نام کاربری (تلفن همراه):</Form.Label>
                    <Form.Control name="username" value={user.username} onChange={handleChange} isInvalid={error.username} placeholder="بدون مقدار" disabled />
                    <Form.Control.Feedback type="invalid">{error.username}</Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Label>ایمیل:</Form.Label>
                    <Form.Control name="email" value={user.email} onChange={handleChange} isInvalid={error.email} placeholder="بدون مقدار" />
                    <Form.Control.Feedback type="invalid">{error.email}</Form.Control.Feedback>
                </Col>
            </Row>
            <Row>
                <Col md>
                    <Form.Label>نام:</Form.Label>
                    <Form.Control name="first_name" value={user.first_name} onChange={handleChange} isInvalid={error.first_name} placeholder="بدون مقدار" />
                    <Form.Control.Feedback type="invalid">{error.first_name}</Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Label>نام خانوادگی:</Form.Label>
                    <Form.Control name="last_name" value={user.last_name} onChange={handleChange} isInvalid={error.last_name} placeholder="بدون مقدار" />
                    <Form.Control.Feedback type="invalid">{error.last_name}</Form.Control.Feedback>
                </Col>
            </Row>
            <Row>
                <Col md>
                    <Form.Label>تلفن ثابت:</Form.Label>
                    <Form.Control name="phone" value={user.phone} onChange={handleChange} isInvalid={error.phone} placeholder="بدون مقدار" />
                    <Form.Control.Feedback type="invalid">{error.phone}</Form.Control.Feedback>
                </Col>
                <Col>
                    <Form.Label>کد پستی:</Form.Label>
                    <Form.Control name="postalCode" value={user.postalCode} onChange={handleChange} isInvalid={error.postalCode} placeholder="بدون مقدار" />
                    <Form.Control.Feedback type="invalid">{error.postalCode}</Form.Control.Feedback>
                </Col>
            </Row>
            <Form.Label>آدرس:</Form.Label>
            <Form.Control as="textarea" name="address" value={user.address} onChange={handleChange} isInvalid={error.address} placeholder="بدون مقدار" />
            <Form.Control.Feedback type="invalid">{error.address}</Form.Control.Feedback>
            <Button className="d-block mx-auto m-1" onClick={save}>ذخیره</Button>
        </div>
    )
}

export default Profile