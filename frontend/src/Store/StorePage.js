import React from "react";
import {Container, Form, Row, Col, Button} from "react-bootstrap";
import ProductCard from "./ProductCard";

const StorePage = (props) => {
    const [products, setProducts] = React.useState([]);
    const [filter, setFilter] = React.useState({category: props.category, brand: props.brand});
    const [categories, setCategories] = React.useState([]);
    const [brands, setBrands] = React.useState([]);

    React.useEffect(() => {
        fetch("/api/store/categories/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setCategories(data);
            else console.error(data);
        });
        fetch("/api/store/brands/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setBrands(data);
            else console.error(data);
        });
    }, []);

    const update = () => {
        let url = "/api/store/products/";
        const params = Object.keys(filter);
        if (params.length > 0) {
            url += "?";
            params.forEach((x) => {
                if (filter[x]) {
                    url += `${x}=${filter[x]}&`;
                }
            });
            url = url.slice(0, -1);
        }
        fetch(url).then(async (r) => {
            const data = await r.json();
            if (r.ok) setProducts(data);
            else console.error(data);
        });
    };

    React.useEffect(update, []);

    const handleChange = (e) => {
        setFilter({...filter, [e.target.name]: e.target.value});
    };

    return (
        <Container className="my-2" fluid>
            <Row>
                <Col lg={3}>
                    <div className="bg-light rounded mb-1 p-2">
                        <Form.Group className="mb-1">
                            <Form.Label>دسته بندی:</Form.Label>
                            <Form.Select name="category" value={filter.category} onChange={handleChange}>
                                <option />
                                {categories.map((x, i) => <option key={i} value={x.id}>{x.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <Form.Label>برند:</Form.Label>
                            <Form.Select name="brand" value={filter.brand} onChange={handleChange}>
                                <option />
                                {brands.map((x, i) => <option key={i} value={x.id}>{x.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <Form.Label>بازه قیمتی:</Form.Label>
                            <Row>
                                <Col>
                                    <Form.Control name="price__gte" placeholder="حداقل (تومان)" value={filter.price__gte} onChange={handleChange} />
                                </Col>
                                <Col>
                                    <Form.Control name="price__lte" placeholder="حداکثر (تومان)" value={filter.price__lte} onChange={handleChange} />
                                </Col>
                            </Row>
                        </Form.Group>
                        <Button className="w-100" onClick={update}>اعمال فیلتر</Button>
                    </div>
                </Col>
                <Col>
                    <div className="bg-light rounded mb-1 p-2">
                        <div className="d-flex flex-wrap justify-content-center">
                            {products && products.length > 0 ? products.map((x, i) => (
                                <ProductCard className="col-10 col-sm-8 col-md-6 col-lg-3 col-xl-2" key={i} product={x} />
                            )): "کالایی جهت نمایش وجود ندارد."}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default StorePage;
