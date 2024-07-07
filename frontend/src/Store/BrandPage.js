import React from "react";
import StorePage from "./StorePage";
import {useParams} from "react-router-dom";

const BrandPage = () => {
    const {id} = useParams();
    const [brand, setBrand] = React.useState({});
    React.useEffect(() => {
        fetch(`/api/store/brands/${id}/`).then(async (r) => {
            const data = await r.json();
            if (r.ok) setBrand(data);
            else console.error(data);
        });
    }, []);
    return (
        <StorePage brand={brand.id} />
    );
};

export default BrandPage;
