import React from "react";
import BlogCard from "../Blog/BlogCard";

const Blogs = () => {
    const [blogs, setBlogs] = React.useState([]);
    
    React.useEffect(() => {
        fetch("/api/blog/blogs/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setBlogs(data);
            else console.error(data);
        });
    }, []);

    return (
        blogs && blogs.length > 0 ? (
            <div className="bg-light rounded m-2">
                <h5 className="text-center border-bottom m-0 p-2">مطالب</h5>
                <div className="d-flex overflow-auto">
                    {blogs.map((x, i) => (
                        <BlogCard className="col-10 col-sm-8 col-md-6 col-lg-3 col-xl-2" key={i} blog={x} />
                    ))}
                </div>
            </div>
        ): null
    );
};

export default Blogs;
