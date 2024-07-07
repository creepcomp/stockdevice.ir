import React from "react";
import { Alert, Button, Table } from "react-bootstrap";

const Orders = () => {
    const [orders, setOrders] = React.useState([])
    const [error, setError] = React.useState({})

    React.useEffect(() => {
        fetch("/api/store/orders/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setOrders(data)
            else setError(data)
        })
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

    const payOrder = (id) => {
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
        <div>
            <h1>سفارش ها</h1>
            {error.detail ? <Alert className="m-1 p-2" variant="danger">{error.detail}</Alert>: null}
            <Table>
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
                                <ul>
                                    {x.items.map(y => (
                                        <li>
                                            <a href={"/store/product/" + y.id}>{y.name}</a>
                                        </li>
                                    ))}
                                </ul>
                            </td>
                            <td>{getStatus(x.status)}</td>
                            <td>
                                <Button variant="success" onClick={() => payOrder(x.id)}>پرداخت</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </div>
    )
}

export default Orders