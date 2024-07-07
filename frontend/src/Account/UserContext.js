import React from "react";

export const UserContext = React.createContext()

export const UserProvider = ({children}) => {
    const [user, setUser] = React.useState();

    React.useEffect(() => {
        fetch("/api/account/me/").then(async (r) => {
            const data = await r.json();
            if (r.ok) setUser(data);
            else console.error(data);
        });
    }, []);

    return (
        <UserContext.Provider value={{user, setUser}}>
            {children}
        </UserContext.Provider>
    )
}