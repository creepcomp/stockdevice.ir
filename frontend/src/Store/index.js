import React from "react";
import {Route, Routes} from "react-router-dom";
import ProductPage from "./ProductPage";
import StorePage from "./StorePage";
import NotFound from "../NotFound";
import CategoryPage from "./CategoryPage";
import BrandPage from "./BrandPage";

const Store = () => {
    return (
        <Routes>
            <Route index element={<StorePage />} />
            <Route path="category/:id/:slug?" element={<CategoryPage />} />
            <Route path="brand/:id/:slug?" element={<BrandPage />} />
            <Route path="product/:id/:slug?" element={<ProductPage />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default Store;
