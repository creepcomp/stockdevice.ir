import React from "react";
import { Alert, Button, Col, Container, Row, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";

const Order = () => {
    const {id} = useParams()
    const [order, setOrder] = React.useState({})
    const [error, setError] = React.useState({})

    React.useState(() => {
        fetch(`/api/store/order/${id}/`).then(async (r) => {
            const data = await r.json()
            if (r.ok) setOrder(data)
            else setError(data)
        })
    }, [])

    const pay = () => {
        fetch(`/api/store/orders/${id}/pay/`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            }
        }).then(async (r) => {
            const data = await r.json()
            if (r.ok) document.location = "https://www.zarinpal.com/pg/StartPay/" + data["data"]["authority"]
            else setError(data)
        })
    }

    return (
        <Container>
            {error.detail ? <Alert variant="danger" className="m-1 p-2">{error.detail}</Alert> : null}
            <Row>
                <Col md>نام: {order.user.first_name}</Col>
                <Col>نام خانوادگی: {order.user.last_name}</Col>
            </Row>
            <Row>
                <Col md>تلفن همراه: {order.user.username}</Col>
                <Col>ایمیل: {order.user.email}</Col>
            </Row>
            <Row>
                <Col md>تلفن ثابت: {order.user.phone}</Col>
                <Col>کد پستی: {order.user.postalCode}</Col>
            </Row>
            آدرس: {order.user.address}
            <Table>
                <thead>
                    <tr>
                        <td>آیتم</td>
                        <td>مبلغ (تومان)</td>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map(x => (
                        <tr>
                            <td>
                                <a href={"/store/product/" + x.id}>{x.name}</a>
                            </td>
                            <td>{x.price} تومان ({x.discount} تخفیف) = {x.price - x.discount} تومان</td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>جمع کل (تومان)</td>
                        <td>{order.price}</td>
                    </tr>
                </tfoot>
            </Table>
            {order.status == 0 ? <Button variant="success" onClick={pay}>پرداخت</Button> : null}
        </Container>
    )
}

export default Order