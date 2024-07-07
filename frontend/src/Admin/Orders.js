import React from "react";
import { Button, Modal, Table } from "react-bootstrap";
import { useCookies } from "react-cookie";

const Orders = () => {
    const [cookies] = useCookies();
    const [show, setShow] = React.useState(false)
    const [orders, setOrders] = React.useState([])
    const [order, setOrder] = React.useState({user: {}, items: []})
    const [error, setError] = React.useState({})

    const update = () => {
        fetch("/api/store/orders/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setOrders(data);
            else console.error(data);
        });
    };

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
        const confirm = window.confirm("آیا میخواهید ادامه دهید؟ (پاک کردن)");
        if (confirm) {
            fetch(`/api/store/orders/${id}/`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "X-CSRFToken": cookies.csrftoken
                },
            }).then(async (r) => {
                const data = await r.json();
                if (r.ok) update();
                else console.error(data);
            });
        }
    };

    const save = () => {
        fetch(`/api/store/orders/${order.id}/`, {
            method: "PUT",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            },
            body: JSON.stringify(order),
        }).then(async (r) => {
            const data = await r.json();
            if (r.ok) {
                update();
                setShow(false);
            } else setError(data);
        });
    };

    return (
        <>
            <Table className="align-middle">
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
                    {orders.map((x, i) => (
                        <tr key={i}>
                            <td>{x.id}</td>
                            <td>{x.user.first_name} {x.user.last_name} ({x.user.username})</td>
                            <td>
                                <Table>
                                    <tbody>
                                        {x.items.map(y => {
                                            <tr>
                                                <td>{y.name}</td>
                                                <td>{Number(y.price).toLocaleString("fa")} تومان</td>
                                            </tr>
                                        })}
                                    </tbody>
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
                    ))}
                </tbody>
            </Table>
            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>اضافه/ویرایش کردن</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error.detail ? <Alert classID="m-1 p-2" variant="danger">{error.detail}</Alert>: null}
                    <div>کاربر: {order.user.first_name} {order.user.last_name} ({order.user.username})</div>
                    <Table>
                        <thead>
                            <tr>
                                <td>کالا</td>
                                <td>تعداد</td>
                                <td>مبلغ (تومان)</td>
                            </tr>
                        </thead>
                        <tbody>
                            {order.items.map(x => (
                                <tr>
                                    <td><a href={"/store/product/" + x.id}>{x.name}</a></td>
                                    <td>{x.quantity}</td>
                                    <td>{x.price}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={save}>ذخیره</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Orders