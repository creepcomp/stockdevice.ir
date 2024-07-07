import React from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";
import { useCookies } from "react-cookie";
import { Rating } from "react-simple-star-rating";

const Comments = ({product}) => {
    const [cookies] = useCookies();
    const [comment, setComment] = React.useState({});
    const [comments, setComments] = React.useState([]);
    const [error, setError] = React.useState({});

    React.useEffect(async () => {
        fetch("/api/store/comments/?product=" + product.id).then(async (r) => {
            const data = await r.json();
            if (r.ok) setComments(data);
            else setError(data);
        })
    }, []);

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
            const data = await r.json();
            if (r.ok) setComments(data);
            else setError(data)
        })
    };

    const handleChange = (e) => {
        setComment({...comment, [e.target.name]: e.target.value});
    };

    return (
        <div className="bg-light rounded my-2 p-2">
            <h4 className="border-bottom p-2 text-center">دیدگاه ها</h4>
            {error.detail ? <Alert variant="danger" className="m-1 p-2">{error.detail}</Alert>: null}
            {comments.length > 0 ? comments.map(x => (
                <div className="bg-primary bg-opacity-25 rounded m-1 p-2">
                    <h6>{x.user.first_name}</h6>
                    {x.score ? <Rating initialRating={x.score} readonly />: null}
                    <p>{x.content}</p>
                </div>
            )): <div className="text-center">دیدگاهی تاکنون ارسال نشده است.</div>}
            <div className="bg-primary bg-opacity-25 rounded m-1 p-2">
                <Form.Label>دیدگاه:</Form.Label>
                <Form.Control name="content" value={comment.content} onChange={handleChange} as="textarea" />
                <Form.Control.Feedback type="invalid">{error.content}</Form.Control.Feedback>
                <div className="d-flex align-items-center">
                    <Form.Label>امتیاز:</Form.Label>
                    <Rating className="m-2" onChange={(x) => setComment({...comment, score: x})} />
                </div>
                <Button className="w-100" onClick={send}>ارسال</Button>
            </div>
        </div>
    )
}

export default Comments;