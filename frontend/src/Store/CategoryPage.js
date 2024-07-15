import React from "react";
import StorePage from "./StorePage";
import {useParams} from "react-router-dom";
import { Helmet } from "react-helmet";
import { Container } from "react-bootstrap";
import Products from "./Products";

const CategoryPage = () => {
    const {id} = useParams();
    const [category, setCategory] = React.useState({});
    React.useEffect(() => {
        fetch(`/api/store/categories/${id}/`).then(async (r) => {
            const data = await r.json();
            if (r.ok) setCategory(data);
            else console.error(data);
        });
    }, []);
    return (
        <Container className="my-1">
            <Helmet>
                <title>دسته بندی {category.name + ""} | استوک دیوایس</title>
                <meta name="keywords" content={category.keywords} />
                <meta name="description" content={category.description} />
            </Helmet>
            <div className="bg-light rounded mb-1">
                <h1 className="h4 text-center m-0 p-2 border-bottom">{category.name}</h1>
                <Products products={category.products} />
            </div>
        </Container>
    );
};

export default CategoryPage;