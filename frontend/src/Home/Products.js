import React from "react"
import _Products from "../Store/Products"

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
                    <_Products products={x.products} />
                </div>
            ))}
        </div>
    )
}

export default Products