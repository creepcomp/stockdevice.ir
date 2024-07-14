import React from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useCookies } from "react-cookie";

const Notes = () => {
    const [cookies] = useCookies()
    const [notes, setNotes] = React.useState([])
    const [note, setNote] = React.useState({})
    const [error, setError] = React.useState({})
    const [show, setShow] = React.useState(false)

    const update = () => {
        fetch("/api/admin/notes/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setNotes(data)
            else setError(data)
        })
    }

    React.useEffect(update, [])

    const edit = (id) => {
        fetch(`/api/admin/notes/${id}/`).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                setNote(data)
                setShow(true)
            } else console.error(data)
        })
    }

    const _delete = (id) => {
        const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)")
        if (confirm) {
            fetch(`/api/admin/notes/${id}/`, {
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
        if (note.id) {
            fetch(`/api/admin/notes/${note.id}/`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(note),
            }).then(async (r) => {
                const data = await r.json()
                if (r.ok) {
                    update()
                    setShow(false)
                } else setError(data)
            })
        } else {
            fetch("/api/admin/notes/", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(note),
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
        setNote({...note, [e.target.name]: e.target.value})
    }

    return (
        <div className="bg-white rounded shadow m-1 p-2">
            <h4 className="text-center pb-2 border-bottom">نوشته ها</h4>
            <Table className="align-middle m-1">
                <thead>
                    <tr>
                        <td>عنوان</td>
                        <td>آخرین ویرایش</td>
                        <td>عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {notes.length > 0 ? notes.map(x => (
                        <tr>
                            <td>{x.name}</td>
                            <td>{new Date(x.modified_at).toLocaleString("fa")}</td>
                            <td>
                                <Button variant="secondary" className="m-1" onClick={() => edit(x.id)}>
                                    <i className="fa-solid fa-pen-to-square" />
                                </Button>
                                <Button variant="danger" className="m-1" onClick={() => _delete(x.id)}>
                                    <i className="fa-solid fa-trash" />
                                </Button>
                            </td>
                        </tr>
                    )) : <td colSpan="3" className="text-center p-2">جدول خالی است.</td>}
                </tbody>
            </Table>
            <Button className="w-100" onClick={() => {setNote({}); setShow(true)}}>اضافه کردن</Button>
            <Modal size="lg" show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>اضافه/ویرایش کردن</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error.detail ? <Alert classID="m-1 p-2" variant="danger">{error.detail}</Alert>: null}
                    <Form.Label>عنوان:</Form.Label>
                    <Form.Control name="name" value={note.name} onChange={handleChange} isInvalid={error.name} />
                    <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
                    <Form.Label>محتوا:</Form.Label>
                    <Form.Control as="textarea" rows="25" name="content" value={note.content} onChange={handleChange} isInvalid={error.content} />
                    <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={save}>ذخیره</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Notes