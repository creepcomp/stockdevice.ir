import React from "react"
import {Col, Image, Ratio} from "react-bootstrap"
import {Helmet} from "react-helmet"
import Markdown from "react-markdown"
import {useParams} from "react-router-dom"
import Comments from "./Comments"

const BlogPage = () => {
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
            <Col md={8} className="bg-light rounded shadow mx-md-auto m-2 p-0">
                <Helmet>
                    <title>{`${blog.title} | استوک دیوایس`}</title>
                    <meta name="keywords" content={blog.keywords} />
                    <meta name="description" content={blog.description} />
                    <meta name="author" content={blog.author.first_name + " " + blog.author.last_name} />
                </Helmet>
                <div className="position-relative">
                    <Ratio aspectRatio="16x9">
                        <Image className="rounded-top" src={"/media/" + blog.image} rel={blog.title} alt="" fluid />
                    </Ratio>
                    <div className="position-absolute start-50 top-50 translate-middle bg-dark bg-opacity-50 rounded text-light text-center p-2">
                        <h1>{blog.title}</h1>
                        <small className="d-block">نویسنده: {blog.author.first_name} {blog.author.last_name}</small>
                        <small className="d-block">تاریخ: {new Date(blog.created_at).toLocaleDateString("fa")}</small>
                    </div>
                </div>
                <Markdown className="m-2 text-truncate">{blog.body}</Markdown>
                {blog.keywords ? (
                    <div className="d-flex flex-wrap justify-content-evenly align-items-center border-top">
                        {blog.keywords.split(", ").map((x, i) => <strong key={i} className="m-1">#{x}</strong>)}
                    </div>
                ): null}
            </Col>
            {blog.id ? <Comments blog={blog} /> : null}
        </>
    )
}

export default BlogPage