import React from "react"
import { Col, Row } from "react-bootstrap"
import Notes from "./Notes"
import Views from "./Views"

const Dashboard = () => {
    return (
        <Row>
            <Col md>
                <Notes />
            </Col>
            <Col>
                <Views />
            </Col>
        </Row>
    )
}

export default Dashboard