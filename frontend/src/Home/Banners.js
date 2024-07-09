import React from "react"
import { Carousel, Col, Image, Row } from "react-bootstrap"

const Banners = () => {
    const [banners, setBanners] = React.useState([])

    React.useEffect(() => {
        fetch("/api/home/banners/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setBanners(data)
            else console.error(data)
        })
    }, [])

    return (
        <Row>
            <Col md={8} className="p-1">
                {banners && banners.filter(x => x.location == 0).length > 0 ? (
                    <Carousel>
                        {banners.filter(x => x.location == 0).map((x, i) => (
                            <Carousel.Item key={i}>
                                <a href={x.link}>
                                    <Image src={"/media/" + x.image} fluid rounded width={1080} height={1080} />
                                </a>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ): <Image className="bg-primary" width={1080} height={1080} fluid rounded />}
            </Col>
            <Col className="p-1">
                {banners && banners.filter(x => x.location == 1).length > 0 ? (
                    <Carousel>
                        {banners.filter(x => x.location == 1).map((x, i) => (
                            <Carousel.Item key={i}>
                                <a href={x.link}>
                                    <Image src={"/media/" + x.image} fluid rounded width={540} height={1080} />
                                </a>
                            </Carousel.Item>
                        ))}
                    </Carousel>
                ): <Image className="bg-primary" width={540} height={1080} fluid rounded />}
            </Col>
        </Row>
    )
}

export default Banners