import React from "react"
import { Button, Col, Modal, Row, Table } from "react-bootstrap"
import { useCookies } from "react-cookie"

const Orders = () => {
    const [cookies] = useCookies()
    const [show, setShow] = React.useState(false)
    const [orders, setOrders] = React.useState([])
    const [order, setOrder] = React.useState({user: {}, items: []})
    const [error, setError] = React.useState({})

    const update = () => {
        fetch("/api/store/admin/orders/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setOrders(data)
            else console.error(data)
        })
    }

    React.useEffect(update, [])

    const getStatus = (status) => {
        switch (status) {
            case 0:
                return "پرداخت نشده"
            case 1:
                return "پرداخت شده"
            case 2:
                return "معلق (منتظر تماس باشید)"
        }
    }

    const _delete = (id) => {
        const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)")
        if (confirm) {
            fetch(`/api/store/admin/orders/${id}/`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "X-CSRFToken": cookies.csrftoken
                },
            }).then(async (r) => {
                const data = await r.json()
                if (r.ok) update()
                else console.error(data)
            })
        }
    }

    const edit = (id) => {
        fetch(`/api/store/admin/orders/${id}/`).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                setOrder(data)
                setShow(true)
            } else console.error(data)
        })
    }

    const save = () => {
        fetch(`/api/store/admin/orders/${order.id}/`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            },
            body: JSON.stringify(order),
        }).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                update()
                setShow(false)
            } else setError(data)
        })
    }

    return (
        <div className="bg-white rounded shadow p-2">
            <h4 className="text-center pb-2 border-bottom">سفارش ها</h4>
            <Table className="align-middle m-1">
                <thead>
                    <tr>
                        <td>#</td>
                        <td>کاربر</td>
                        <td>آیتم ها</td>
                        <td>وضعیت</td>
                        <td className="d-print-none">عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {orders.length > 0 ? orders.map((x, i) => (
                        <tr key={i}>
                            <td>{x.id}</td>
                            <td>{x.user.first_name} {x.user.last_name} ({x.user.username})</td>
                            <td>
                                <Table>
                                    <thead>
                                        <tr>
                                            <td>کالا</td>
                                            <td>تعداد</td>
                                            <td>مبلغ</td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {x.items.map((x, i) => (
                                            <tr key={i}>
                                                <td>
                                                    <a href={"/store/product/" + x.product.id}>{x.product.name}</a>
                                                </td>
                                                <td>{x.quantity}</td>
                                                <td>{Number(x.price).toLocaleString("fa")} تومان</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                    <tfoot>
                                        <tr>
                                            <td colSpan={2}>جمع کل</td>
                                            <td>{Number(x.price).toLocaleString("fa")} تومان</td>
                                        </tr>
                                    </tfoot>
                                </Table>
                            </td>
                            <td>{getStatus(x.status)}</td>
                            <td className="d-print-none">
                                <Button variant="secondary" className="m-1" href={`/account/order/${x.id}`}>
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
                    )) : <td colSpan="5" className="text-center p-2">جدول خالی است.</td>}
                </tbody>
            </Table>
            <Modal show={show} onHide={() => setShow(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>اضافه/ویرایش کردن</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error.detail ? <Alert classID="m-1 p-2" variant="danger">{error.detail}</Alert>: null}
                    <Row>
                    <Col>
                        کاربر: <a href={"/admin/users?id=" + order.user.id}>{order.user.first_name} {order.user.last_name} ({order.user.username})</a>
                    </Col>
                    <Col>
                        وضعیت: {getStatus(order.status)}
                    </Col>
                    </Row>
                    <Table>
                        <thead>
                            <tr>
                                <td>کالا</td>
                                <td>تعداد</td>
                                <td>مبلغ</td>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map((x, i) => (
                                <tr key={i}>
                                    <td>
                                        <a href={"/store/product/" + x.product.id}>{x.product.name}</a>
                                    </td>
                                    <td>{x.quantity}</td>
                                    <td>{Number(x.price).toLocaleString("fa")} تومان</td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={2}>جمع کل</td>
                                <td>{Number(order.price).toLocaleString("fa")} تومان</td>
                            </tr>
                        </tfoot>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={save}>ذخیره</Button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default Orders