import React from "react";
import StorePage from "./StorePage";
import {useParams} from "react-router-dom";

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
        <StorePage category={category.id} />
    );
};

export default CategoryPage;
