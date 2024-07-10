import React from "react"
import {Card, Ratio} from "react-bootstrap"
import "./BlogCard.css"

const BlogCard = ({blog, className}) => {
    return (
        <Card className={"text-center " + className}>
            <Ratio aspectRatio="16x9">
                <a href={`/blog/${blog.id}/${blog.slug}`}>
                    <Card.Img src={"/media/" + blog.image} alt="" />
                </a>
            </Ratio>
            <Card.Body className="bg-light bg-opacity-75 rounded-bottom w-100 position-absolute bottom-0 p-1">
                <h6 className="m-0 p-2" dir="auto">{blog.title}</h6>
            </Card.Body>
        </Card>
    )
}

export default BlogCard