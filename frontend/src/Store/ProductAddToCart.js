import React from "react";
import { useCookies } from "react-cookie";
import { UserContext } from "../Account/UserContext";
import { Button, Col, Form, Row } from "react-bootstrap";
import { CartContext } from "./CartContext";

const ProductAddToCart = ({product}) => {
    const [cookies] = useCookies();
    const [item, setItem] = React.useState({product: product.id, quantity: 1})
    const [error, setError] = React.useState({})
    const {user, setUser} = React.useContext(UserContext)
    const {items, setItems, update} = React.useContext(CartContext)

    const add = () => {
        fetch("/api/store/items/", {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            },
            body: JSON.stringify(item),
        }).then(async (r) => {
            if (r.ok) update()
        });
    };

    return (
        <div className="text-center m-2">
            {user ? (
                <Row>
                    <Col>
                        <div className="d-flex justify-content-center align-items-center">
                            <Button className={item.quantity <= 1 ? "disabled" : null} onClick={() => setItem({...item, quantity: item.quantity - 1})}>
                                <i className="fa-solid fa-minus" />
                            </Button>
                            <Form.Control style={{width: "5ch"}} value={item.quantity} />
                            <Button onClick={() => setItem({...item, quantity: item.quantity + 1})}>
                                <i className="fa-solid fa-plus" />
                            </Button>
                        </div>
                    </Col>
                    <Col>
                        <Button variant="success" onClick={add}>افزودن به سبد خرید</Button>
                    </Col>
                </Row>
            ) : (
                <u>برای ثبت سفارش ابتدا وارد شوید.</u>
            )}
        </div>
    );
};

export default ProductAddToCart