import React from "react"
import {Col, Container, Image, Ratio} from "react-bootstrap"
import {Helmet} from "react-helmet"
import Markdown from "react-markdown"
import {useParams} from "react-router-dom"
import Comments from "./Comments"

const Blog = () => {
    const {id} = useParams()
    const [blog, setBlog] = React.useState({author: {}})
    React.useEffect(() => {
        fetch(`/api/blog/blogs/${id}/`).then(async (r) => {
            const data = await r.json()
            if (r.ok) setBlog(data)
            else console.error(data)
        })
    }, [])

    return (
        <>
            <Container className="bg-light rounded mx-md-auto m-2 p-0">
                <Helmet>
                    <title>{`${blog.title} | استوک دیوایس`}</title>
                    <meta name="keywords" content={blog.keywords} />
                    <meta name="description" content={blog.description} />
                    <meta name="author" content={blog.author.first_name + " " + blog.author.last_name} />
                </Helmet>
                <div className="position-relative">
                    <Ratio aspectRatio="16x9">
                        <Image className="rounded-top" src={"/media/" + blog.image} alt={blog.title} fluid />
                    </Ratio>
                    <div className="position-absolute start-50 top-50 translate-middle bg-dark bg-opacity-50 rounded text-light text-center p-2">
                        <h1>{blog.title}</h1>
                        <small className="d-block">نویسنده: {blog.author.first_name} {blog.author.last_name}</small>
                        <small className="d-block">تاریخ: {new Date(blog.created_at).toLocaleDateString("fa")}</small>
                    </div>
                </div>
                <Markdown className="text-justify m-2">{blog.body}</Markdown>
                {blog.keywords ? (
                    <div className="d-flex flex-wrap justify-content-evenly align-items-center border-top">
                        {blog.keywords.split(", ").map((x, i) => <strong key={i} className="m-1">#{x}</strong>)}
                    </div>
                ): null}
            </Container>
            {blog.id ? <Comments blog={blog} /> : null}
        </>
    )
}

export default Blog