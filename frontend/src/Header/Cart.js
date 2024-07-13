import React from "react"
import { Alert, Badge, Button, Table } from "react-bootstrap"
import Offcanvas from "react-bootstrap/Offcanvas"
import { useCookies } from "react-cookie"
import { CartContext } from "../Store/CartContext"

const Cart = () => {
    const [cookies] = useCookies()
    const {items, setItems} = React.useContext(CartContext)
    const [show, setShow] = React.useState(false)
    const [error, setError] = React.useState({})

    const update = () => {
        fetch("/api/store/items/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setItems(data)
            else setError(data)
        })
    }

    const _delete = (id) => {
        fetch(`/api/store/items/${id}/`, {
            method: "DELETE",
            headers: {
                "Accept": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            }
        }).then(async (r) => {
            if (r.ok) update()
        })
    }

    const create = () => {
        fetch(`/api/store/orders/`, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            }
        }).then(async (r) => {
            const data = await r.json()
            if (r.ok) document.location = "/account/orders?id=" + data.id
            else setError(data)
        })
    }

    return (
        <>
            <Button className="m-1" variant="light" dir="ltr" onClick={() => setShow(true)}>
                <i className="fa-solid fa-cart-shopping ms-1"></i>
                {items.length > 0 ? <Badge bg="danger">{items.length}</Badge> : null}
            </Button>
            <Offcanvas show={show} onHide={() => setShow(false)} placement="end">
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>سبد خرید</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="d-flex flex-column">
                    {error.detail ? <Alert className="m-1 p-2" variant="danger">{error.detail}</Alert> : null}
                    <div className="flex-grow-1 overflow-auto">
                        <Table className="text-center align-middle">
                            <thead>
                                <tr>
                                    <td>کالا</td>
                                    <td>تعداد</td>
                                    <td>مبلغ</td>
                                    <td>عملیات</td>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((x, i) => (
                                    <tr key={i}>
                                        <td>
                                            <a href={"/store/product/" + x.product.id}>{x.product.name}</a>
                                        </td>
                                        <td>{x.quantity}</td>
                                        <td>{Number(x.price).toLocaleString("fa")} تومان</td>
                                        <td>
                                            <Button variant="danger" onClick={() => _delete(x.id)}>
                                                <i className="fa-solid fa-xmark"></i>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                    <Button variant="success" onClick={create}>ثبت سفارش و پرداخت</Button>
                </Offcanvas.Body>
            </Offcanvas>
        </>
    )
}

export default Cart