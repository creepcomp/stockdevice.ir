import React from "react"
import {Modal, Form, Button, Table, Alert, Row, Col} from "react-bootstrap"
import {useCookies} from "react-cookie"
import {slugify} from "../Utils.js"

const Categories = () => {
    const [cookies] = useCookies()
    const [show, setShow] = React.useState(false)
    const [categories, setCategories] = React.useState([])
    const [category, setCategory] = React.useState({})
    const [error, setError] = React.useState({})

    const update = () => {
        fetch("/api/store/admin/categories/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setCategories(data)
            else setError(data)
        })
    }

    React.useEffect(update, [])

    const edit = (id) => {
        fetch(`/api/store/admin/categories/${id}/`).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                if (data.parent)
                    setCategory({...data, parent: data.parent.id})
                else setCategory(data)
                setShow(true)
            } else console.error(data)
        })
    }

    const _delete = (id) => {
        const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)")
        if (confirm) {
            fetch(`/api/store/admin/categories/${id}/`, {
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
        if (category.id) {
            fetch(`/api/store/admin/categories/${category.id}/`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(category),
            }).then(async (r) => {
                const data = await r.json()
                if (r.ok) {
                    update()
                    setShow(false)
                } else setError(data)
            })
        } else {
            fetch("/api/store/admin/categories/", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(category),
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
        setCategory({...category, [e.target.name]: e.target.value})
    }

    return (
        <div className="bg-white rounded shadow p-2">
            <h4 className="text-center pb-2 border-bottom">دسته بندی ها</h4>
            <Table className="align-middle m-1">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>نام</td>
                        <td>والد</td>
                        <td className="d-print-none">عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {categories.length > 0 ? categories.map((x, i) => (
                        <tr key={i}>
                            <td>{x.id}</td>
                            <td>{x.name}</td>
                            <td>{x.parent ? categories[x.parent].name : "اصلی"}</td>
                            <td className="d-print-none">
                                <Button variant="secondary" className="m-1" href={"/store/category/" + x.id}>
                                    <i className="fa-solid fa-eye" />
                                </Button>
                                <Button className="m-1" variant="secondary" onClick={() => edit(x.id)}>
                                    <i className="fa-solid fa-pen-to-square" />
                                </Button>
                                <Button className="m-1" variant="danger" onClick={() => _delete(x.id)}>
                                    <i className="fa-solid fa-trash" />
                                </Button>
                            </td>
                        </tr>
                    )) : <td colSpan="4" className="text-center p-2">جدول خالی است.</td>}
                </tbody>
            </Table>
            <Button className="w-100" onClick={() => {setCategory({}); setShow(true)}}>اضافه کردن</Button>
            <Modal size="lg" show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>اضافه/ویرایش کردن</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error.detail ? <Alert classID="m-1 p-2" variant="danger">{error.detail}</Alert>: null}
                    <Row>
                        <Col md>
                            <Form.Label>نام:</Form.Label>
                            <Form.Control name="name" value={category.name} onChange={(e) => setCategory({...category, name: e.target.value, slug: slugify(e.target.value)})} isInvalid={error.name} dir="auto" />
                            <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Label>اسلاگ:</Form.Label>
                            <Form.Control name="slug" value={category.slug} onChange={handleChange} isInvalid={error.slug} dir="auto" />
                            <Form.Control.Feedback type="invalid">{error.slug}</Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
                    <Form.Label>دسته بندی اصلی:</Form.Label>
                    <Form.Select name="parent" value={category.parent} onChange={handleChange} isInvalid={error.parent}>
                        <option>اصلی</option>
                        {categories.map((x, i) => <option key={i} value={x.id}>{x.name}</option>)}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{error.parent}</Form.Control.Feedback>
                    <Form.Label>توضیحات:</Form.Label>
                    <Form.Control name="description" value={category.description} as="textarea" rows="5" onChange={handleChange} isInvalid={error.description} />
                    <Form.Control.Feedback type="invalid">{error.description}</Form.Control.Feedback>
                    <Form.Label>کلید واژه ها:</Form.Label>
                    <Form.Control name="keywords" value={category.keywords} onChange={handleChange} isInvalid={error.keywords} />
                    <Form.Control.Feedback type="invalid">{error.keywords}</Form.Control.Feedback>
                    <div className="d-flex flex-wrap justify-content-evenly align-items-center m-1">{category.keywords ? category.keywords.split(", ").map((x) => <span className="bg-primary rounded m-1 p-1 text-light" key={x.id}>{x}</span>) : null}</div>
                    <Alert variant="danger" className="m-1 p-2">
                        <Form.Check type="checkbox" name="show" checked={category.show} label="نمایش داده شود." onChange={(e) => setCategory({...category, show: e.target.checked})} isInvalid={error.show} />
                        <Form.Control.Feedback type="invalid">{error.show}</Form.Control.Feedback>
                    </Alert>
                    <Alert className="m-1 p-2">
                        <Form.Check type="checkbox" name="home" checked={category.home} label="نمایش در صفحه اصلی." onChange={(e) => setCategory({...category, home: e.target.checked})} isInvalid={error.home} />
                        <Form.Control.Feedback type="invalid">{error.home}</Form.Control.Feedback>
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={save}>ذخیره</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Categories