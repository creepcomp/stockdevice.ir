import React from "react"
import {Modal, Form, Button, Table, Alert, Row, Col, Image} from "react-bootstrap"
import {useCookies} from "react-cookie"

const Banners = () => {
    const [cookies] = useCookies()
    const [show, setShow] = React.useState(false)
    const [banners, setBanners] = React.useState([])
    const [banner, setBanner] = React.useState({})
    const [error, setError] = React.useState({})

    const update = () => {
        fetch("/api/home/admin/banners/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setBanners(data)
            else setError(data)
        })
    }

    React.useEffect(update, [])

    const edit = (id) => {
        fetch(`/api/home/admin/banners/${id}/`).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                setBanner(data)
                setShow(true)
            } else console.error(data)
        })
    }

    const _delete = (id) => {
        const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)")
        if (confirm) {
            fetch(`/api/home/admin/banners/${id}/`, {
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
        if (banner.id) {
            fetch(`/api/home/admin/banners/${banner.id}/`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(banner),
            }).then(async (r) => {
                const data = await r.json()
                if (r.ok) {
                    update()
                    setShow(false)
                } else setError(data)
            })
        } else {
            fetch("/api/home/admin/banners/", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(banner),
            }).then(async (r) => {
                const data = await r.json()
                if (r.ok) {
                    update()
                    setShow(false)
                } else setError(data)
            })
        }
    }

    const upload = (e) => {
        const formData = new FormData()
        formData.append("image", e.target.files[0])
        fetch("/api/home/admin/banners/upload/", {
            method: "POST",
            headers: {"X-CSRFToken": cookies.csrftoken},
            body: formData,
        }).then(async (r) => {
            const data = await r.json()
            if (r.ok) setBanner({...banner, image: data.image})
            else setError(data)
        })
    }

    const handleChange = (e) => {
        setBanner({...banner, [e.target.name]: e.target.value})
    }

    return (
        <div className="bg-white rounded shadow m-1 p-2">
            <h4 className="text-center pb-2 border-bottom">بنر ها</h4>
            <Table className="align-middle m-1">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>نام</td>
                        <td className="d-print-none">عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {banners.length > 0 ? banners.map((x, i) => (
                        <tr key={i}>
                            <td>{x.id}</td>
                            <td>
                                <Image src={"/media/" + x.image} width={250} fluid rounded />
                            </td>
                            <td className="d-print-none">
                                <Button className="m-1" variant="secondary" onClick={() => edit(x.id)}>
                                    <i className="fa-solid fa-pen-to-square" />
                                </Button>
                                <Button className="m-1" variant="danger" onClick={() => _delete(x.id)}>
                                    <i className="fa-solid fa-trash" />
                                </Button>
                            </td>
                        </tr>
                    )) : <td colSpan="3" className="text-center p-2">جدول خالی است.</td>}
                </tbody>
            </Table>
            <Button className="w-100" onClick={() => {setBanner({}); setShow(true)}}>اضافه کردن</Button>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>اضافه/ویرایش کردن</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error.detail ? <Alert classID="m-1 p-2" variant="danger">{error.detail}</Alert>: null}
                    <Form.Label>عکس:</Form.Label>
                    <Form.Control name="image" type="file" onChange={upload} isInvalid={error.image} />
                    <Form.Control.Feedback type="invalid">{error.image}</Form.Control.Feedback>
                    {banner.image ? (
                        <Image src={"/media/" + banner.image} fluid rounded onClick={() => {
                            const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)")
                            if (confirm) {
                                setBanner({...banner, image: null})
                            }
                        }} />
                    ): null}
                    <Form.Label>لینک (url):</Form.Label>
                    <Form.Control name="link" value={banner.link} onChange={handleChange} isInvalid={error.link} />
                    <Form.Control.Feedback type="invalid">{error.link}</Form.Control.Feedback>
                    <Form.Label>مکان:</Form.Label>
                    <Form.Select name="location" value={banner.location} onChange={handleChange} isInvalid={error.location}>
                        <option />
                        <option value={0}>صفحه اصلی | 1x1</option>
                        <option value={1}>صفحه اصلی | 1x2</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{error.location}</Form.Control.Feedback>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={save}>ذخیره</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Banners