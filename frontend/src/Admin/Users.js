import React from "react"
import {Modal, Form, Button, Table, Alert} from "react-bootstrap"
import {useCookies} from "react-cookie"

const Users = () => {
    const [cookies] = useCookies()
    const [show, setShow] = React.useState(false)
    const [users, setUsers] = React.useState([])
    const [user, setUser] = React.useState({})
    const [error, setError] = React.useState({})

    const update = () => {
        fetch("/api/account/admin/users/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setUsers(data)
            else console.error(data)
        })
    }

    React.useEffect(update, [])

    const edit = (id) => {
        fetch(`/api/account/admin/users/${id}/`).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                setUser(data)
                setShow(true)
            } else console.error(data)
        })
    }

    const _delete = (id) => {
        const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)")
        if (confirm) {
            fetch(`/api/account/admin/users/${id}/`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "X-CSRFToken": cookies.csrftoken
                },
            }).then(async (r) => {
                const data = await r.json()
                if (r.ok) update()
                else console.error(data)
            })
        }
    }

    const save = () => {
        if (user.id) {
            fetch(`/api/account/admin/users/${user.id}/`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(user),
            }).then(async (r) => {
                const data = await r.json()
                if (r.ok) {
                    update()
                    setShow(false)
                } else setError(data)
            })
        } else {
            fetch("/api/account/admin/users/", {
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
                    update()
                    setShow(false)
                } else setError(data)
            })
        }
    }

    const handleChange = (e) => {
        setUser({...user, [e.target.name]: e.target.value})
    }

    return (
        <>
            <Table className="align-middle">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>نام کاربری</td>
                        <td>آخرین ورود</td>
                        <td>تاریخ عضویت</td>
                        <td className="d-print-none">عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {users.map((x, i) => (
                        <tr key={i}>
                            <td>{x.id}</td>
                            <td>{x.username}</td>
                            <td>
                                <span dir="ltr">{new Date(x.last_login).toLocaleString("fa")}</span>
                            </td>
                            <td>
                                <span dir="ltr">{new Date(x.date_joined).toLocaleString("fa")}</span>
                            </td>
                            <td className="d-print-none">
                                <Button variant="secondary" className="m-1" onClick={() => edit(x.id)}>
                                    <i className="fa-solid fa-pen-to-square" />
                                </Button>
                                <Button variant="danger" className="m-1" onClick={() => _delete(x.id)}>
                                    <i className="fa-solid fa-trash" />
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal show={show} size="lg" onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>اضافه/ویرایش کردن</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error.detail ? <Alert classID="m-1 p-2" variant="danger">{error.detail}</Alert>: null}
                    <Form.Label>نام کاربری:</Form.Label>
                    <Form.Control name="username" value={user.username} onChange={handleChange} isInvalid={error.username} />
                    <Form.Control.Feedback type="invalid">{error.username}</Form.Control.Feedback>

                    <Form.Label>رمز عبور:</Form.Label>
                    <Form.Control type="password" name="password" value={user.password} onChange={handleChange} isInvalid={error.password} />
                    <Form.Control.Feedback type="invalid">{error.password}</Form.Control.Feedback>

                    <div className="row">
                        <div className="col-sm">
                            <Form.Label>نام:</Form.Label>
                            <Form.Control name="first_name" value={user.first_name} onChange={handleChange} isInvalid={error.first_name} />
                            <Form.Control.Feedback type="invalid">{error.first_name}</Form.Control.Feedback>
                        </div>
                        <div className="col">
                            <Form.Label>نام خانوادگی:</Form.Label>
                            <Form.Control name="last_name" value={user.last_name} onChange={handleChange} isInvalid={error.last_name} />
                            <Form.Control.Feedback type="invalid">{error.last_name}</Form.Control.Feedback>
                        </div>
                    </div>

                    <Form.Label>ایمیل:</Form.Label>
                    <Form.Control name="email" value={user.email} onChange={handleChange} isInvalid={error.email} />
                    <Form.Control.Feedback type="invalid">{error.email}</Form.Control.Feedback>

                    <Form.Label>کد پستی:</Form.Label>
                    <Form.Control name="postal_code" value={user.postal_code} onChange={handleChange} isInvalid={error.postal_code} />
                    <Form.Control.Feedback type="invalid">{error.postal_code}</Form.Control.Feedback>

                    <Form.Label>آدرس:</Form.Label>
                    <Form.Control name="address" value={user.address} onChange={handleChange} isInvalid={error.address} />
                    <Form.Control.Feedback type="invalid">{error.address}</Form.Control.Feedback>

                    <Form.Check type="checkbox" name="is_staff" checked={user.is_staff} label="کاربر فوق العاده (ادمین)" onChange={(e) => setUser({...user, is_staff: e.target.checked})} isInvalid={error.is_staff} />
                    <Form.Control.Feedback type="invalid">{error.is_staff}</Form.Control.Feedback>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={save}>ذخیره</Button>
                </Modal.Footer>
            </Modal>
            <div className="fixed-bottom text-end">
                <Button
                    className="m-1"
                    onClick={() => {
                        setShow(true)
                        setUser({})
                    }}>
                    <i className="fa-solid fa-plus" />
                </Button>
            </div>
        </>
    )
}

export default Users