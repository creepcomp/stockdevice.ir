import React from "react"
import { Carousel, Image } from "react-bootstrap"
import BlogCard from "../Blog/BlogCard"

const BlogsCarousel = () => {
    const [blogs, setBlogs] = React.useState([])

    React.useEffect(() => {
        fetch("/api/blog/blogs/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setBlogs(data)
            else console.error(data)
        })
    }, [])

    return (
        <div className="mb-1">
            {blogs && blogs.length > 0 ? (
                <Carousel>
                    {blogs.map((x, i) => (
                        <Carousel.Item key={i}>
                            <BlogCard blog={x} />
                        </Carousel.Item>
                    ))}
                </Carousel>
            ): <Image className="bg-primary m-1" width={540} height={540} fluid rounded />}
        </div>
    )
}

export default BlogsCarousel