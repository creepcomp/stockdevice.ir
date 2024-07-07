import React from "react";
import {Alert, Col, Modal, Row, Tab, Tabs, Form, Button, Table, Image} from "react-bootstrap";
import {useCookies} from "react-cookie";
import {slugify} from "./Utils.js";
import ProductLabel from "./ProductLabel";

const Products = () => {
    const [cookies] = useCookies();
    const [products, setProducts] = React.useState([]);
    const [product, setProduct] = React.useState({});
    const [show, setShow] = React.useState(false);
    const [error, setError] = React.useState({});
    const [categories, setCategories] = React.useState([]);
    const [brands, setBrands] = React.useState([]);

    React.useEffect(async () => {
        await fetch("/api/store/categories/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setCategories(data);
            else console.error(data);
        });
        await fetch("/api/store/brands/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setBrands(data);
            else console.error(data);
        });
        update();
    }, []);

    const init = () => {
        setProduct({
            specification: {
                "پردازنده": "",
                "حافظه رم": "",
                "حافظه اصلی": "",
                "کارت گرافیک": "",
                "صفحه نمایش": "",
            },
            keywords: "لپ تاپ, استوک, ارزان",
        });
    };

    const update = () => {
        fetch("/api/store/products/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setProducts(data);
            else console.error(data);
        });
    };

    const edit = (id) => {
        fetch(`/api/store/products/${id}/`).then(async (r) => {
            const data = await r.json();
            if (r.ok) {
                setProduct({...data, category: data.category.id, brand: data.brand.id});
                setShow(true);
            } else console.error(data);
        });
    };

    const _delete = (id) => {
        const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)");
        if (confirm) {
            fetch(`/api/store/products/${id}/`, {
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
        if (product.id) {
            fetch(`/api/store/products/${product.id}/`, {
                method: "PUT",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(product),
            }).then(async (r) => {
                const data = await r.json();
                if (r.ok) {
                    update();
                    setShow(false);
                } else setError(data);
            });
        } else {
            fetch("/api/store/products/", {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "X-CSRFToken": cookies.csrftoken,
                },
                body: JSON.stringify(product),
            }).then(async (r) => {
                const data = await r.json();
                if (r.ok) {
                    update();
                    setShow(false);
                } else setError(data);
            });
        }
    };

    const upload = (e) => {
        const formData = new FormData();
        Array.from(e.target.files).forEach((file, index) => {
            formData.append(index, file);
        });
        fetch("/api/store/products/upload/", {
            method: "POST",
            headers: {"X-CSRFToken": cookies.csrftoken},
            body: formData,
        }).then(async (r) => {
            const data = await r.json();
            if (r.ok) {
                if (product.images) product.images.push(...data.images);
                else product.images = data.images;
                setProduct({...product, images: product.images});
            } else setError(data);
        });
    };

    const handleChange = (e) => {
        setProduct({...product, [e.target.name]: e.target.value});
    };

    return (
        <>
            <Table className="align-middle">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>نام</td>
                        <td>قیمت (تومان)</td>
                        <td className="d-print-none">عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {products.map((x, i) => (
                        <tr key={i}>
                            <td>{x.id}</td>
                            <td>{x.name}</td>
                            <td>{Number(x.price).toLocaleString("fa")} تومان {x.discount ? <>({Number(x.discount).toLocaleString("fa")} تخفیف)</>: null}</td>
                            <td className="d-print-none">
                                <Button className="m-1" href={`/store/product/${x.id}/${x.slug}`}>
                                    <i className="fa-solid fa-eye" />
                                </Button>
                                <ProductLabel product={x} />
                                <Button className="m-1" onClick={() => edit(x.id)}>
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
                    <Tabs>
                        <Tab title="اصلی" eventKey="main">
                            <Row>
                                <Col md>
                                    <Form.Label>نام:</Form.Label>
                                    <Form.Control name="name" value={product.name} onChange={(e) => setProduct({...product, name: e.target.value, slug: slugify(e.target.value)})} isInvalid={error.name} dir="auto" />
                                    <Form.Control.Feedback type="invalid">{error.name}</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Label>اسلاگ:</Form.Label>
                                    <Form.Control name="slug" value={product.slug} onChange={handleChange} isInvalid={error.slug} dir="auto" />
                                    <Form.Control.Feedback type="invalid">{error.slug}</Form.Control.Feedback>
                                </Col>
                            </Row>
                            <Row>
                                <Col md>
                                    <Form.Label>دسته بندی:</Form.Label>
                                    <Form.Select name="category" value={product.category} onChange={handleChange} isInvalid={error.category}>
                                        <option />
                                        {categories.map((x, i) => <option key={i} value={x.id}>{x.name}</option>)}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{error.category}</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Label>برند:</Form.Label>
                                    <Form.Select name="brand" value={product.brand} onChange={handleChange} isInvalid={error.brand}>
                                        <option />
                                        {brands.map((x, i) => <option key={i} value={x.id}>{x.name}</option>)}
                                    </Form.Select>
                                    <Form.Control.Feedback type="invalid">{error.brand}</Form.Control.Feedback>
                                </Col>
                            </Row>
                            <Row>
                                <Col md>
                                    <Form.Label>قیمت (تومان):</Form.Label>
                                    <Form.Control type="number" name="price" value={product.price} onChange={handleChange} isInvalid={error.price} />
                                    <Form.Control.Feedback type="invalid">{error.price}</Form.Control.Feedback>
                                </Col>
                                <Col md>
                                    <Form.Label>تخفیف (تومان):</Form.Label>
                                    <Form.Control type="number" name="discount" value={product.discount} onChange={handleChange} isInvalid={error.discount} />
                                    <Form.Control.Feedback type="invalid">{error.discount}</Form.Control.Feedback>
                                </Col>
                                <Col>
                                    <Form.Label>موجودی:</Form.Label>
                                    <Form.Control type="number" name="available" value={product.available} onChange={handleChange} isInvalid={error.available} />
                                    <Form.Control.Feedback type="invalid">{error.available}</Form.Control.Feedback>
                                </Col>
                            </Row>
                            <Alert variant="danger" className="m-1 p-2">
                                <Form.Check type="checkbox" name="show" checked={product.show} label="نمایش داده شود." onChange={(e) => setProduct({...product, show: e.target.checked})} isInvalid={error.show} />
                                <Form.Control.Feedback type="invalid">{error.show}</Form.Control.Feedback>
                            </Alert>
                        </Tab>
                        <Tab title="عکس ها" eventKey="images">
                            {product.images ? product.images.map((x, i) => (
                                <Image className='col-md-4 m-1' key={i} src={"/media/" + x} rounded fluid onClick={() => {
                                    const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)");
                                    if (confirm) {
                                        const images = product.images.filter((_, index) => index !== i);
                                        setProduct({...product, images: images});
                                    }
                                }} />
                            )): null}
                            <Form.Control.Feedback type="invalid">{error.images}</Form.Control.Feedback>
                            <Form.Control type="file" onChange={upload} multiple isInvalid />
                        </Tab>
                        <Tab title="مشخصات" eventKey="specification">
                            <Form.Label>مشخصات:</Form.Label>
                            {product.specification ?
                                Object.keys(product.specification).map((x, i) => (
                                    <Row key={i} className="m-1">
                                        <Col>
                                            <Form.Control
                                                value={x}
                                                onChange={(e) => {
                                                    const specification = {...product.specification};
                                                    specification[e.target.value] = specification[x];
                                                    delete specification[x];
                                                    setProduct({...product, specification: specification});
                                                }}
                                                isInvalid={error.specification}
                                            />
                                        </Col>
                                        <Col>
                                            <Form.Control
                                                value={product.specification[x]}
                                                onChange={(e) => setProduct({...product, specification: {...product.specification, [x]: e.target.value}})}
                                                isInvalid={error.specification}
                                                dir="auto"
                                            />
                                        </Col>
                                        <Col sm={1}>
                                            <Button className="w-100" variant="danger" onClick={() => {
                                                const specification = {...product.specification};
                                                delete specification[x];
                                                setProduct({...product, specification: specification});
                                            }}><i className="fa-solid fa-xmark" /></Button>
                                        </Col>
                                    </Row>
                                )) : null}
                            <Button variant="success" className="w-100" onClick={() => setProduct({...product, specification: {...product.specification, "": ""}})}>
                                <i className="fa-solid fa-plus" />
                            </Button>
                            <Form.Control.Feedback type="invalid">{error.specification}</Form.Control.Feedback>
                        </Tab>
                        <Tab title="سئو" eventKey="seo">
                            <Form.Label>توضیحات:</Form.Label>
                            <textarea className={error.body ? "form-control is-invalid" : "form-control"} name="body" id="body" value={product.body} onChange={handleChange} />
                            <Form.Control.Feedback type="invalid">{error.body}</Form.Control.Feedback>
                            <div className="row">
                                <div className="col-sm">
                                    <Form.Label>کلید واژه ها:</Form.Label>
                                    <Form.Control name="keywords" value={product.keywords} onChange={handleChange} isInvalid={error.keywords} />
                                    <Form.Control.Feedback type="invalid">{error.keywords}</Form.Control.Feedback>
                                </div>
                                {product.keywords ? (
                                    <div className="col d-flex flex-wrap justify-content-center align-items-center">
                                        {product.keywords.split(", ").map((x, i) => (
                                            <span className="bg-primary rounded m-1 p-1 text-light" key={i}>{x}</span>
                                        ))}
                                    </div>
                                ): null}
                            </div>
                        </Tab>
                    </Tabs>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={save}>ذخیره</Button>
                </Modal.Footer>
            </Modal>
            <div className="fixed-bottom text-end">
                <Button
                    className="d-print-none m-1"
                    onClick={() => {
                        init();
                        setShow(true);
                    }}>
                    <i className="fa-solid fa-plus" />
                </Button>
            </div>
        </>
    );
};

export default Products;
