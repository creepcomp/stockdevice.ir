import React from "react"
import ProductCard from "../Store/ProductCard"

const Products = () => {
    const [categories, setCategories] = React.useState([])

    React.useState(() => {
        fetch("/api/store/categories/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setCategories(data)
            else console.error(data)
        })
    }, [])

    return (
        <div className="mb-2">
            {categories.filter(x => x.home == true).map((x, i) => (
                <div key={i} className="bg-light rounded mb-1">
                    <h5 className="text-center border-bottom m-0 p-2">{x.name}</h5>
                    {x.products.length > 0 ? (
                        <div className="d-flex overflow-auto">
                            {x.products.map((x, i) => (
                                <ProductCard className="col-10 col-sm-8 col-md-6 col-lg-3 m-1" key={i} product={x} />
                            ))}
                        </div>
                    ): <div className="text-center p-2">کالایی یافت نشد.</div>}
                </div>
            ))}
        </div>
    )
}

export default Products