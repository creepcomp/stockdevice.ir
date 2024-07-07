import React from "react";
import {Row, Col, Container, Image, Carousel, Ratio, Table} from "react-bootstrap";
import {useParams} from "react-router-dom";
import {Helmet} from "react-helmet";
import Markdown from "react-markdown";
import Comments from "./Comments";
import ProductAddToCart from "./ProductAddToCart";

const ProductPage = () => {
    const {id} = useParams();
    const [product, setProduct] = React.useState({});
    const [error, setError] = React.useState({});

    React.useEffect(() => {
        fetch(`/api/store/products/${id}/`).then(async (r) => {
            const data = await r.json();
            if (r.ok) setProduct(data);
            else setError(data)
        });
    }, []);

    return (
        <Container className="my-2">
            <Helmet>
                <title>{`${product.name} | استوک دیوایس`}</title>
                <meta name="keywords" content={product.keywords} />
                <meta name="description" content={product.description} />
            </Helmet>
            <Row>
                <Col lg>
                    <Ratio aspectRatio="1x1" className="bg-light rounded mb-2">
                        {product.images ? (
                            <Carousel>
                                {product.images.map((x, i) => (
                                    <Carousel.Item key={i}>
                                        <Image src={"/media/" + x} rel={product.name} rounded fluid />
                                    </Carousel.Item>
                                ))}
                            </Carousel>
                        ) : (
                            <div className="w-100 h-100 d-flex justify-content-center align-items-center">بدون عکس</div>
                        )}
                    </Ratio>
                </Col>
                <Col>
                    <div className="bg-light rounded p-2">
                        <h1 className="h2 border-bottom text-center p-2">{product.name}</h1>
                        <Table className="align-middle">
                            <thead>
                                <tr>
                                    <td colSpan={2}>
                                        <span className="h5 d-block text-center m-1">اطلاعات</span>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>دسته بندی:</td>
                                    <td>
                                        {product.category ? <a href={`/store/category/${product.category.slug}`}>{product.category.name}</a> : "-"}
                                    </td>
                                </tr>
                                <tr>
                                    <td>برند:</td>
                                    <td>
                                        {product.brand ? <a href={`/store/brand/${product.brand.slug}`}>{product.brand.name}</a> : "-"}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                        {product.specification ? (
                            <>
                                <Table className="align-middle">
                                    <thead>
                                        <tr>
                                            <td colSpan={2}>
                                                <span className="h5 d-block text-center m-1">مشخصات</span>
                                            </td>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(product.specification).map((x, i) => (
                                            <tr key={i}>
                                                <td>{x}</td>
                                                <td dir="auto">{product.specification[x]}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </>
                        ) : null}
                        <div className="text-center">
                            {product.price ? (
                                product.discount ? (
                                    <div>
                                        <small className="d-block">
                                            <s>{Number(product.price).toLocaleString("fa")} تومان</s>
                                        </small>
                                        <strong className="d-block">{Number(product.price - product.discount).toLocaleString("fa")} تومان</strong>
                                    </div>
                                ) : (
                                    <strong className="d-block m-1">{Number(product.price).toLocaleString("fa")} تومان</strong>
                                )
                            ): "تماس بگیرید"}
                        </div>
                        {product.id ? <ProductAddToCart product={product} />: null}
                        {product.keywords ? (
                            <div className="d-flex flex-wrap justify-content-evenly align-items-center border-top">
                                {product.keywords.split(", ").map((x, i) => <strong key={i} className="m-1">#{x}</strong>)}
                            </div>
                        ) : null}
                    </div>
                </Col>
            </Row>
            {product.body ? (
                <div className="bg-light rounded-5 m-1 p-1">
                    <h4 className="border-bottom p-2 text-center">توضیحات</h4>
                    <Markdown className="m-1">{product.body}</Markdown>
                </div>
            ) : null}
            {product.id ? <Comments product={product} /> : null}
        </Container>
    );
};

export default ProductPage;