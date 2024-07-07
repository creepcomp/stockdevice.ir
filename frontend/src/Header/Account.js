import React from "react";
import { Button, Dropdown } from "react-bootstrap";
import Login from "../Account/Login";
import Register from "../Account/Register";
import { UserContext } from "../Account/UserContext";


const Account = () => {
    const {user, setUser} = React.useContext(UserContext)

    return <>
        {user ? (
            <>
                {user.is_staff ? (
                    <Button variant="danger" className="m-1" href="/admin">
                        <i className="fa-solid fa-user-tie" />
                    </Button>
                ) : null}
                <Dropdown>
                    <Dropdown.Toggle variant="light" className="m-1">
                        <i className="fa-solid fa-user" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="text-center" style={{right: "-250%"}}>
                        <Button className="m-1">حساب کاربری</Button>
                        <Button variant="danger" className="m-1" onClick={() => {
                            fetch("/api/account/logout/").then(() => window.location.reload());
                        }}>
                            <i className="fa-solid fa-door-open" /> خروج
                        </Button>
                    </Dropdown.Menu>
                </Dropdown>
            </>
        ): (
            <>
                <Login />
                <Register />
            </>
        )}
    </>;
};

export default Account;
