import React from "react";
import ProductCard from "../Store/ProductCard";

const Products = () => {
    const [products, setProducts] = React.useState([]);
    const [categories, setCategories] = React.useState([]);

    React.useState(() => {
        fetch("/api/store/products/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setProducts(data);
            else console.error(data);
        });
        fetch("/api/store/categories/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setCategories(data);
            else console.error(data);
        });
    }, []);

    return (
        <div>
            {categories.map((c, i) => (
                products.filter(p => p.category == c.id) ? (
                    <div key={i} className="bg-light rounded m-2">
                        <h5 className="text-center border-bottom m-0 p-2">{c.name}</h5>
                        <div className="d-flex overflow-auto">
                            {products.filter(p => p.category == c.id).map((p, i) => (
                                <ProductCard className="col-10 col-sm-8 col-md-6 col-lg-3 col-xl-2" key={i} product={p} />
                            ))}
                        </div>
                    </div>
                ) : null
            ))}
        </div>
    );
};

export default Products;
