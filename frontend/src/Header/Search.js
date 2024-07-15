import React from "react";
import { Button, Form } from "react-bootstrap";

const Search = () => {
    const [input, setInput] = React.useState("")

    const search = (e) => {
        e.preventDefault()
        document.location = "/store?search=" + input
    }
    
    return (
        <form className="d-flex mx-auto col-md-3" onSubmit={search}>
            <Form.Control
                type="search"
                placeholder="جست و جو کالا"
                className="me-1"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <Button variant="light" type="submit"><i className="fa-solid fa-magnifying-glass"></i></Button>
        </form>
    )
}

export default Search