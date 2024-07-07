import React from "react";
import {Card} from "react-bootstrap";
import "./BlogCard.css";

const BlogCard = ({blog, className}) => {
    return (
        <Card className={"text-center shadow m-2 " + className}>
            <a href={`/blog/${blog.id}/${blog.slug}`}>
                <Card.Img src={"/media/" + blog.image} alt={blog.title} />
            </a>
            <Card.Body className="bg-light bg-opacity-75 w-100 position-absolute bottom-0 p-1">
                <h6 className="p-2" dir="auto">{blog.title}</h6>
            </Card.Body>
        </Card>
    );
};

export default BlogCard;
