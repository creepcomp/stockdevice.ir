import React from "react";
import ProductCard from "./ProductCard";

const Products = ({products}) => {
    return (
        <div className="d-flex flex-wrap justify-content-center">
            {products && products.length > 0 ? products.map((x, i) => (
                <ProductCard className="col-10 col-sm-8 col-md-6 col-lg-3 m-1" key={i} product={x} />
            )): "کالایی جهت نمایش وجود ندارد."}
        </div>
    )
}

export default Products