import React from "react"
import {Container, Form, Row, Col, Button} from "react-bootstrap"
import ProductCard from "./ProductCard"
import { Helmet } from "react-helmet"

const StorePage = ({category = false}) => {
    const [products, setProducts] = React.useState([])
    const [filter, setFilter] = React.useState({})
    const [categories, setCategories] = React.useState([])

    React.useEffect(() => {
        fetch("/api/store/categories/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setCategories(data)
            else console.error(data)
        })
        if (category.id) setFilter({category: category.id})
        update()
    }, [])

    const update = () => {
        let url = "/api/store/products/"
        const params = Object.keys(filter)
        if (params.length > 0) {
            url += "?"
            params.forEach((x) => {
                if (filter[x]) {
                    url += `${x}=${filter[x]}&`
                }
            })
            url = url.slice(0, -1)
        }
        fetch(url).then(async (r) => {
            const data = await r.json()
            if (r.ok) setProducts(data)
            else console.error(data)
        })
    }

    const handleChange = (e) => {
        setFilter({...filter, [e.target.name]: e.target.value})
    }

    return (
        <Container className="p-2" fluid>
            {category ? <Helmet>
                <title>دسته بندی {category.name + ""} | استوک دیوایس</title>
                {category.keywords ? <meta name="keywords" content={category.keywords} /> : null}
                {category.description ? <meta name="description" content={category.description} /> : null}
            </Helmet> : <Helmet>
                <title>فروشگاه | استوک دیوایس</title>
                <meta name="keywords" content="فروشگاه, استوک دیوایس" />
                <meta name="description" content="فروشگاه لپ تاپ و کامپیوتر، انواع قطعات مادربرد، کیبورد، ال سی دی، رم، هارد و .." />
            </Helmet>}
            <Row>
                <Col lg={3}>
                    <div className="bg-light rounded mb-1 p-2">
                        <h1 className="h4 text-center m-0 p-2 border-bottom">فروشگاه</h1>
                        <Form.Group className="mb-1">
                            <Form.Label>دسته بندی:</Form.Label>
                            <Form.Select name="category" value={filter.category} onChange={handleChange}>
                                <option />
                                {categories.map((x, i) => <option key={i} value={x.id}>{x.name}</option>)}
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
                                <ProductCard className="col-10 col-sm-8 col-md-6 col-lg-3" key={i} product={x} />
                            )): "کالایی جهت نمایش وجود ندارد."}
                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default StorePage