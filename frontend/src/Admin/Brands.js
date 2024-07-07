import React from "react";
import {Modal, Form, Button, Table, Alert, Row, Col} from "react-bootstrap";
import {useCookies} from "react-cookie";
import {slugify} from "./Utils.js";

const Brands = () => {
    const [cookies] = useCookies();
    const [show, setShow] = React.useState(false);
    const [brands, setBrands] = React.useState([]);
    const [brand, setBrand] = React.useState({});
    const [error, setError] = React.useState({});

    const update = () => {
        fetch("/api/store/brands/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setBrands(data);
            else console.error(data);
        });
    };

    React.useEffect(update, []);

    const edit = (id) => {
        fetch(`/api/store/brands/${id}/`).then(async (r) => {
            const data = await r.json();
            if (r.ok) {
                setBrand(data);
                setShow(true);
            } else console.error(data);
        });
    };

    const _delete = (id) => {
        const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)");
        if (confirm) {
            fetch(`/api/store/brands/${id}/`, {
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

    const save = () => {
        if (brand.id) {
            fetch(`/api/store/brands/${brand.id}/`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(brand),
            }).then(async (r) => {
                const data = await r.json();
                if (r.ok) {
                    update();
                    setShow(false);
                } else setError(data);
            });
        } else {
            fetch("/api/store/brands/", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(brand),
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
        setBrand({...brand, [e.target.name]: e.target.value});
    };

    return (
        <>
            <Table className="align-middle">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>نام</td>
                        <td className="d-print-none">عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {brands.map((x, i) => (
                        <tr key={i}>
                            <td>{x.id}</td>
                            <td>{x.name}</td>
                            <td className="d-print-none">
                                <Button variant="secondary" className="m-1" href={`/store/brand/${x.id}/${x.slug}`}>
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
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>اضافه/ویرایش کردن</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error.detail ? <Alert classID="m-1 p-2" variant="danger">{error.detail}</Alert>: null}
                    <Row>
                        <Col md>
                            <Form.Label>نام:</Form.Label>
                            <Form.Control name="name" value={brand.name} onChange={(e) => setBrand({...brand, name: e.target.value, slug: slugify(e.target.value)})} isInvalid={error.name} dir="auto" />
                            <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
                        </Col>
                        <Col>
                            <Form.Label>اسلاگ:</Form.Label>
                            <Form.Control name="slug" value={brand.slug} onChange={handleChange} isInvalid={error.slug} dir="auto" />
                            <Form.Control.Feedback type="invalid">{error.slug}</Form.Control.Feedback>
                        </Col>
                    </Row>
                    <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
                    <Form.Label>کلید واژه ها:</Form.Label>
                    <Form.Control name="keywords" value={brand.keywords} onChange={handleChange} isInvalid={error.keywords} />
                    <Form.Control.Feedback type="invalid">{error.keywords}</Form.Control.Feedback>
                    <div className="d-flex flex-wrap justify-content-evenly align-items-center m-1">{brand.keywords ? brand.keywords.split(", ").map((x) => <span className="bg-primary rounded m-1 p-1 text-light" key={x.id}>{x}</span>) : null}</div>
                    <Alert variant="danger" className="m-1 p-2">
                        <Form.Check type="checkbox" name="show" checked={brand.show} label="نمایش داده شود." onChange={(e) => setBrand({...brand, show: e.target.checked})} isInvalid={error.show} />
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
                        setBrand({});
                    }}>
                    <i className="fa-solid fa-plus" />
                </Button>
            </div>
        </>
    );
};

export default Brands;
