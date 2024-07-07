import React from "react";
import {Button, Col, Container, Modal, Row, Table} from "react-bootstrap";
import {useReactToPrint} from "react-to-print";

const ProductLabel = (props) => {
    const [show, setShow] = React.useState(true);
    const [product, setProduct] = React.useState({});
    const printArea = React.useRef();

    React.useEffect(() => {
        fetch(`/api/store/products/${props.product.id}/`).then(async (r) => {
            const data = await r.json();
            if (r.ok) setProduct(data);
            else console.error(data);
        });
    }, []);

    return (
        <Modal show={show} onHide={() => setShow(false)}>
            <Modal.Header closeButton />
            <Modal.Body>
                <Container ref={printArea} dir="rtl">
                    <Row>
                        <Col className="d-flex justify-content-center align-items-center">
                            <div>
                                <h3>{product.name}</h3>
                                <p>{product.summary}</p>
                            </div>
                        </Col>
                        <Col xs={4}>
                            <img className="border m-1 p-1" src={"https://api.qrserver.com/v1/create-qr-code/?size=125x125&data=" + `https://stockdevice.ir/store/product/${product.slug}/`} />
                        </Col>
                    </Row>
                    {product.specification ? (
                        <div>
                            <h5 className="text-center">مشخصات</h5>
                            <Table className="align-middle">
                                <tbody>
                                    {Object.keys(product.specification).map((x, i) => (
                                        <tr key={i}>
                                            <td>{x}</td>
                                            <td dir="auto">{product.specification[x]}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    ) : null}
                    {product.description ? (
                        <div>
                            <h5 className="text-center">توضیحات</h5>
                            <p className="text-justify m-1">{product.description}</p>
                        </div>
                    ) : null}
                    <footer className="border-top text-center">
                        <a className="d-block" href="https://stockdevice.ir">stockdevice.ir</a>
                        تلفن: <span dir="ltr">+21-66952977</span>
                    </footer>
                </Container>
            </Modal.Body>
            <Modal.Footer>
                <Button className="w-100" onClick={useReactToPrint({content: () => printArea.current})}>چاپ</Button>
            </Modal.Footer>
        </Modal>
    );
};

const PrintProductLabel = (props) => {
    const [show, setShow] = React.useState(false);
    return (
        <>
            <Button className="m-1" onClick={() => setShow(true)}>
                <i className="fa-solid fa-tag" />
            </Button>
            {show ? <ProductLabel product={props.product} />: null}
        </>
    );
};

export default PrintProductLabel;
