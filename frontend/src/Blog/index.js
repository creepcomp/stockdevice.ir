import React from "react";
import {Route, Routes} from "react-router-dom";
import BlogPage from "./BlogPage";
import NotFound from "../NotFound";

const Blog = () => {
    return (
        <Routes>
            <Route path=":id/:slug?" element={<BlogPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default Blog;
