import React from "react"
import {Modal, Form, Button, Table, Alert, Row, Col} from "react-bootstrap"
import {useCookies} from "react-cookie"

const Comments = () => {
    const [cookies] = useCookies()
    const [show, setShow] = React.useState(false)
    const [comments, setComments] = React.useState([])
    const [comment, setComment] = React.useState({})
    const [error, setError] = React.useState({})

    const update = () => {
        fetch("/api/blog/admin/comments/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setComments(data)
            else console.error(data)
        })
    }

    React.useEffect(update, [])

    const edit = (id) => {
        fetch(`/api/blog/admin/comments/${id}/`).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                setComment(data)
                setShow(true)
            } else console.error(data)
        })
    }

    const _delete = (id) => {
        const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)")
        if (confirm) {
            fetch(`/api/blog/admin/comments/${id}/`, {
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
        fetch(`/api/blog/admin/comments/${comment.id}/`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            },
            body: JSON.stringify(comment),
        }).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                update()
                setShow(false)
            } else setError(data)
        })
    }

    const handleChange = (e) => {
        setComment({...comment, [e.target.name]: e.target.value})
    }

    return (
        <div className="bg-white rounded shadow p-2">
            <h4 className="text-center pb-2 border-bottom">دیدگاه ها</h4>
            <Table className="align-middle m-1">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>کاربر</td>
                        <td>مطلب</td>
                        <td>نمایش داده شود.</td>
                        <td className="d-print-none">عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {comments.length > 0 ? comments.map((x, i) => (
                        <tr key={i}>
                            <td>{x.id}</td>
                            <td>{x.user.first_name} {x.user.last_name} ({x.user.username})</td>
                            <td><a href={"/blog/" + x.blog.id}>{x.blog.title}</a></td>
                            <td>{x.show ? "بله" : "خیر"}</td>
                            <td className="d-print-none">
                                <Button className="m-1" variant="secondary" onClick={() => edit(x.id)}>
                                    <i className="fa-solid fa-pen-to-square" />
                                </Button>
                                <Button className="m-1" variant="danger" onClick={() => _delete(x.id)}>
                                    <i className="fa-solid fa-trash" />
                                </Button>
                            </td>
                        </tr>
                    )) : <td colSpan="5" className="text-center p-2">جدول خالی است.</td>}
                </tbody>
            </Table>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>اضافه/ویرایش کردن</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error.detail ? <Alert classID="m-1 p-2" variant="danger">{error.detail}</Alert>: null}
                    <Row>
                        <Col md>
                            <Form.Label>کاربر: </Form.Label>
                            {comment.user ? <span>{comment.user.first_name} {comment.user.last_name} ({comment.user.username})</span> : "-"}
                        </Col>
                        <Col>
                            <Form.Label>مطلب: </Form.Label>
                            {comment.blog ? <a href={"/blog/" + comment.blog.id}>{comment.blog.title}</a> : "-"}
                        </Col>
                    </Row>
                    <Form.Label>محتوا:</Form.Label>
                    <Form.Control as="textarea" name="content" value={comment.content} onChange={handleChange} isInvalid={error.content} />
                    <Form.Control.Feedback type="invalid">{error.content}</Form.Control.Feedback>
                    <Form.Label>پاسخ:</Form.Label>
                    <Form.Control as="textarea" name="reply" value={comment.reply} onChange={handleChange} isInvalid={error.reply} />
                    <Form.Control.Feedback type="invalid">{error.reply}</Form.Control.Feedback>
                    <Alert variant="danger" className="m-1 p-2">
                        <Form.Check type="checkbox" name="show" checked={comment.show} label="نمایش داده شود." onChange={(e) => setComment({...comment, show: e.target.checked})} isInvalid={error.show} />
                        <Form.Control.Feedback type="invalid">{error.show}</Form.Control.Feedback>
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={save}>ذخیره</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Comments