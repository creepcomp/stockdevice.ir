import React from "react";
import {Col, Dropdown, ListGroup, Row} from "react-bootstrap";

const StoreNavbar = () => {
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

    return (
        <Dropdown>
            <Dropdown.Toggle>فروشگاه</Dropdown.Toggle>
            <Dropdown.Menu style={{width: "500px"}}>
                <Row>
                    <Col sm>
                        <ListGroup className="m-1">
                            <ListGroup.Item active>دسته بندی ها</ListGroup.Item>
                            {categories.map((x, i) => (
                                <ListGroup.Item key={i} href={`/store/category/${x.id}/${x.slug}`} action>{x.name}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                    <Col>
                        <ListGroup className="m-1">
                            <ListGroup.Item active>برند ها</ListGroup.Item>
                            {brands.map((x, i) => (
                                <ListGroup.Item key={i} href={`/store/brand/${x.id}/${x.slug}`} action>{x.name}</ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Col>
                </Row>
            </Dropdown.Menu>
        </Dropdown>
    );
};

export default StoreNavbar;
