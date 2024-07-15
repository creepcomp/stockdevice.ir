import React from "react"
import {Container, Form, Row, Col, Button} from "react-bootstrap"
import { Helmet } from "react-helmet"
import Products from "./Products"

const Store = ({category = false}) => {
    const query = new URLSearchParams(window.location.search)
    const [products, setProducts] = React.useState([])
    const [filter, setFilter] = React.useState({name__icontains: query.get("search")})
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
            <Helmet>
                <title>فروشگاه | استوک دیوایس</title>
                <meta name="keywords" content="فروشگاه, استوک دیوایس" />
                <meta name="description" content="فروشگاه لپ تاپ و کامپیوتر، انواع قطعات مادربرد، کیبورد، ال سی دی، رم، هارد و .." />
            </Helmet>
            <Row>
                <Col lg={3}>
                    <div className="bg-light rounded mb-1 p-2">
                        <h1 className="h4 text-center m-0 p-2 border-bottom">فروشگاه</h1>
                        <Form.Group className="mb-1">
                            <Form.Label>جست و جو:</Form.Label>
                            <Form.Control name="name__icontains" value={filter.name__icontains} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group className="mb-1">
                            <Form.Label>دسته بندی:</Form.Label>
                            <Form.Select name="category" value={filter.category} onChange={handleChange}>
                                <option />
                                {categories.map((x, i) => <option key={i} value={x.id}>{x.name}</option>)}
                            </Form.Select>
                        </Form.Group>
                        <Button className="w-100" onClick={update}>اعمال فیلتر</Button>
                    </div>
                </Col>
                <Col>
                    <div className="bg-light rounded mb-1 p-2">
                        <Products products={products} />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default Store