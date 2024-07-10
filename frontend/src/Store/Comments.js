import React from "react"
import { Alert, Button, Col, Form } from "react-bootstrap"
import { useCookies } from "react-cookie"
import { Rating } from "react-simple-star-rating"

const Comments = ({product}) => {
    const [cookies] = useCookies()
    const [comment, setComment] = React.useState({})
    const [comments, setComments] = React.useState([])
    const [error, setError] = React.useState({})

    const update = () => {
        fetch("/api/store/comments/?product=" + product.id).then(async (r) => {
            const data = await r.json()
            if (r.ok) setComments(data)
            else setError(data)
        })
    }

    React.useEffect(update, [])

    const send = () => {
        fetch("/api/store/comments/?product=" + product.id, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-CSRFToken": cookies.csrftoken,
            },
            body: JSON.stringify(comment),
        }).then(async (r) => {
            const data = await r.json()
            if (r.ok) update()
            else setError(data)
        })
    }

    const handleChange = (e) => {
        setComment({...comment, [e.target.name]: e.target.value})
    }

    return (
        <>
            <Col md={6} className="bg-light rounded mx-md-auto mb-1 p-2">
                <h4 className="border-bottom p-2 text-center">دیدگاه ها</h4>
                {error.detail ? <Alert variant="danger" className="m-1 p-2">{error.detail}</Alert>: null}
                {comments.length > 0 ? comments.map((x, i) => (
                    <div key={i} className="bg-primary bg-opacity-25 rounded mb-1 p-2">
                        <div className="border-bottom p-2">
                            <b>{x.user.first_name}</b>
                            <small className="float-end" dir="ltr">{new Date(x.created_at).toLocaleString("fa")}</small>
                        </div>
                        {x.score ? <Rating initialRating={x.score} readonly />: null}
                        <p className="m-0 p-2" dir="auto">{x.content}</p>
                        {x.reply ? <Alert className="p-2" variant="warning">پاسخ: {x.reply}</Alert> : null}
                    </div>
                )): <div className="text-center">دیدگاهی تاکنون ارسال نشده است.</div>}
            </Col>
            <Col md={6} className="bg-light rounded mx-md-auto p-2">
                <Form.Label>دیدگاه:</Form.Label>
                <Form.Control name="content" value={comment.content} onChange={handleChange} isInvalid={error.content} as="textarea" />
                <Form.Control.Feedback type="invalid">{error.content}</Form.Control.Feedback>
                <div className="d-flex align-items-center">
                    <Form.Label>امتیاز:</Form.Label>
                    <Rating className="m-2" onChange={(x) => setComment({...comment, score: x})} />
                </div>
                <Button className="w-100" onClick={send}>ارسال</Button>
            </Col>
        </>
    )
}

export default Comments