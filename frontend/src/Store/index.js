import React from "react"
import {Route, Routes} from "react-router-dom"
import Product from "./Product"
import _Store from "./Store"
import NotFound from "../NotFound"
import Category from "./Category"

const StoreApp = () => {
    return (
        <Routes>
            <Route index element={<_Store />} />
            <Route path="product/:id/:slug?" element={<Product />} />
            <Route path="category/:id/:slug?" element={<Category />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    )
}

export default StoreApp