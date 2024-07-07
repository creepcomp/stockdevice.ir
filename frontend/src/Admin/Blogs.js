import React from "react";
import {Modal, Form, Button, Row, Col, Table, Alert, Image} from "react-bootstrap";
import {useCookies} from "react-cookie";
import {slugify} from "./Utils";

const Blogs = () => {
    const [cookies] = useCookies();
    const [show, setShow] = React.useState(false);
    const [blogs, setBlogs] = React.useState([]);
    const [blog, setBlog] = React.useState({});
    const [error, setError] = React.useState({});

    const update = () => {
        fetch("/api/blog/blogs/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setBlogs(data);
            else console.error(data);
        });
    };

    React.useEffect(update, []);

    const edit = (id) => {
        fetch(`/api/blog/blogs/${id}/`).then(async (r) => {
            const data = await r.json();
            if (r.ok) {
                setBlog(data);
                setShow(true);
            } else console.error(data);
        });
    };

    const _delete = (id) => {
        const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)");
        if (confirm) {
            fetch(`/api/blog/blogs/${id}/`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "X-CSRFToken": cookies.csrftoken
                },
            }).then(async (r) => {
                const data = await r.json();
                if (r.ok) update();
                else console.error(data);
            });
        }
    };

    const upload = (e) => {
        const formData = new FormData();
        formData.append("image", e.target.files[0]);
        fetch("/api/blog/blogs/upload/", {
            method: "POST",
            headers: {"X-CSRFToken": cookies.csrftoken},
            body: formData,
        }).then(async (r) => {
            const data = await r.json();
            if (r.ok) setBlog({...blog, image: data.image});
            else setError(data);
        });
    };

    const save = () => {
        if (blog.id) {
            fetch(`/api/blog/blogs/${blog.id}/`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(blog),
            }).then(async (r) => {
                const data = await r.json();
                if (r.ok) {
                    update();
                    setShow(false);
                } else setError(data);
            });
        } else {
            fetch("/api/blog/blogs/", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(blog),
            }).then(async (r) => {
                const data = await r.json();
                if (r.ok) {
                    update();
                    setShow(false);
                } else setError(data);
            });
        }
    };

    const handleChange = (e) => {
        setBlog({...blog, [e.target.name]: e.target.value});
    };

    return (
        <>
            <Table className="align-middle">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>عنوان</td>
                        <td className="d-print-none">عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {blogs.map((x, i) => (
                        <tr key={i}>
                            <td>{x.id}</td>
                            <td>{x.title}</td>
                            <td className="d-print-none">
                                <Button variant="secondary" className="m-1" href={`/blog/${x.id}/${x.slug}`}>
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
                    ))}
                </tbody>
            </Table>
            <Modal show={show} size="xl" onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>اضافه/ویرایش کردن</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error.detail ? <Alert classID="m-1 p-2" variant="danger">{error.detail}</Alert>: null}
                    <Row>
                        <Col md>
                            <Form.Label>عنوان:</Form.Label>
                            <Form.Control name="title" value={blog.title} onChange={(e) => setBlog({...blog, title: e.target.value, slug: slugify(e.target.value)})} isInvalid={error.title} dir="auto" />
                            <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Label>اسلاگ:</Form.Label>
                            <Form.Control name="slug" value={blog.slug} onChange={handleChange} isInvalid={error.slug} />
                            <Form.Control.Feedback type="invalid">{error.slug}</Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Form.Label>محتوا:</Form.Label>
                    <Form.Control name="body" as="textarea" value={blog.body} onChange={handleChange} isInvalid={error.body} />
                    <Form.Control.Feedback type="invalid">{error.body}</Form.Control.Feedback>
                    <Row>
                        <Col lg>
                            <Form.Label>عکس:</Form.Label>
                            <Form.Control type="file" id="image" onChange={upload} isInvalid={error.image} />
                            <Form.Control.Feedback type="invalid">{error.image}</Form.Control.Feedback>
                        </Col>
                        {blog.image ? (
                            <Col>
                                <Image className="m-1" src={"/media/" + blog.image} rounded fluid />
                            </Col>
                        ) : null}
                    </Row>
                    <div className="row">
                        <div className="col-sm">
                            <Form.Label>کلید واژه ها:</Form.Label>
                            <Form.Control name="keywords" value={blog.keywords} onChange={handleChange} isInvalid={error.keywords} />
                            <Form.Control.Feedback type="invalid">{error.keywords}</Form.Control.Feedback>
                        </div>
                        {blog.keywords ? (
                            <div className="col d-flex flex-wrap justify-content-center align-items-center">
                                {blog.keywords.split(", ").map((x, i) => (
                                    <span className="bg-primary rounded m-1 p-1 text-light" key={i}>{x}</span>
                                ))}
                            </div>
                        ): null}
                    </div>
                    <Alert variant="danger" className="m-2 p-2">
                        <Form.Check type="checkbox" name="show" checked={blog.show} label="نمایش داده شود." onChange={(e) => setBlog({...blog, show: e.target.checked})} isInvalid={error.show} />
                        <Form.Control.Feedback type="invalid">{error.show}</Form.Control.Feedback>
                    </Alert>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={save}>ذخیره</Button>
                </Modal.Footer>
            </Modal>
            <div className="fixed-bottom text-end">
                <Button
                    className="m-1"
                    onClick={() => {
                        setShow(true);
                        setBlog({});
                    }}>
                    <i className="fa-solid fa-plus" />
                </Button>
            </div>
        </>
    );
};

export default Blogs;
