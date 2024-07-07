import React from "react";
import { Carousel, Image } from "react-bootstrap";
import ProductCard from "../Store/ProductCard";

const ProductsCarousel = () => {
    const [products, setProducts] = React.useState([]);

    React.useEffect(() => {
        fetch("/api/store/products/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setProducts(data);
            else console.error(data);
        });
    }, []);

    return (
        products && products.length > 0 ? (
            <Carousel>
                {products.map((x, i) => (
                    <Carousel.Item key={i}>
                        <ProductCard product={x} />
                    </Carousel.Item>
                ))}
            </Carousel>
        ): <Image className="bg-primary m-1" width={540} height={540} fluid rounded />
    )
}

export default ProductsCarousel;