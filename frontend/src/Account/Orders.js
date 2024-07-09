import React from "react"
import { Alert, Button, Col, Modal, Row, Table } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { Helmet } from "react-helmet"
import { useParams } from "react-router-dom"
import ReactToPrint from "react-to-print"

const Orders = () => {
    const query = new URLSearchParams(window.location.search)
    const [cookies] = useCookies()
    const [orders, setOrders] = React.useState([])
    const [error, setError] = React.useState({})
    const [show, setShow] = React.useState(false)
    const [order, setOrder] = React.useState({user: {}, items: []})
    const orderRef = React.useRef()

    React.useEffect(() => {
        fetch("/api/store/orders/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setOrders(data)
            else setError(data)
        })
        if (query.has("id")) edit(query.get("id"))
    }, [])

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

    const pay = (id) => {
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

    const edit = (id) => {
        fetch(`/api/store/orders/${id}/`).then(async (r) => {
            const data = await r.json()
            if (r.ok) {
                setOrder(data)
                setShow(true)
            } else setError(data)
        })
    }

    return (
        <div className="bg-light rounded m-2 p-2">
            <Helmet>
                <title>سفارش ها</title>
            </Helmet>
            <h1 className="h2 text-center border-bottom p-2">سفارش ها</h1>
            {error.detail ? <Alert className="m-1 p-2" variant="danger">{error.detail}</Alert>: null}
            <Table className="text-center align-middle">
                <thead>
                    <tr>
                        <td>شماره سفارش</td>
                        <td>آیتم ها</td>
                        <td>وضعیت</td>
                        <td>عملیات</td>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(x => (
                        <tr>
                            <td>{x.id}</td>
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
                                </Table>
                            </td>
                            <td>{getStatus(x.status)}</td>
                            <td>
                                <Button className="m-1" onClick={() => edit(x.id)}>نمایش</Button>
                                <Button className="m-1" variant="success" onClick={() => pay(x.id)}>پرداخت</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            <Modal size="lg" show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>سفارش شماره {order.id}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div ref={orderRef}>
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
                                    <td>کالا</td>
                                    <td>تعداد</td>
                                    <td>مبلغ</td>
                                </tr>
                            </thead>
                            <tbody>
                                {order.items.map(x => (
                                    <tr>
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
                                    <td colSpan={2}>جمع کل (تومان)</td>
                                    <td>{Number(order.price).toLocaleString("fa")} تومان</td>
                                </tr>
                            </tfoot>
                        </Table>
                    </div>
                    <div className="text-center">
                        {order.status == 0 ? <Button className="m-1" variant="success" onClick={pay}>پرداخت</Button> : null}
                        <ReactToPrint trigger={() => {
                            return <Button className="m-1">پرینت</Button>
                        }} content={() => orderRef.current} />
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Orders