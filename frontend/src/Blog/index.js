import React from "react"
import {Route, Routes} from "react-router-dom"
import _Blog from "./Blog"
import NotFound from "../NotFound"

const Blog = () => {
    return (
        <Routes>
            <Route path=":id/:slug?" element={<_Blog />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default Blog