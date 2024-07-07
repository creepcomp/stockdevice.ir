import React from "react";
import {Container, Image, Ratio} from "react-bootstrap";
import {Helmet} from "react-helmet";
import Markdown from "react-markdown";
import {useParams} from "react-router-dom";

const BlogPage = () => {
    const {id} = useParams();
    const [blog, setBlog] = React.useState({});
    React.useEffect(() => {
        fetch(`/api/blog/blogs/${id}/`).then(async (r) => {
            const data = await r.json();
            if (r.ok) setBlog(data);
            else console.error(data);
        });
    }, []);

    return (
        <Container className="bg-light rounded shadow my-2 p-0">
            <Helmet>
                <title>{`${blog.title} | فروشگاه استوک دیوایس`}</title>
                <meta name="keywords" content={blog.keywords} />
                <meta name="description" content={blog.description} />
            </Helmet>
            <div className="position-relative">
                <Ratio aspectRatio="16x9">
                    <Image src={"/media/" + blog.image} rel={blog.title} fluid />
                </Ratio>
                <div className="position-absolute start-50 top-50 translate-middle bg-dark bg-opacity-50 text-light text-center p-2">
                    <h1>{blog.title}</h1>
                    <small className="d-block">تاریخ: {new Date(blog.created_at).toLocaleDateString("fa")}</small>
                </div>
            </div>
            <Markdown className="m-2">{blog.body}</Markdown>
            {blog.keywords ? (
                <div className="d-flex flex-wrap justify-content-evenly align-items-center border-top">
                    {blog.keywords.split(", ").map((x, i) => <strong key={i} className="m-1">#{x}</strong>)}
                </div>
            ): null}
        </Container>
    );
};

export default BlogPage;
