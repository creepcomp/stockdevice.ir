import React from "react"

export const CartContext = React.createContext()

export const CartProvider = ({children}) => {
    const [items, setItems] = React.useState([])

    const update = () => {
        fetch("/api/store/items/").then(async (r) => {
            const data = await r.json()
            if (r.ok) setItems(data)
            else console.error(data)
        })
    }

    React.useEffect(update, [])

    return (
        <CartContext.Provider value={{items, setItems, update}}>
            {children}
        </CartContext.Provider>
    )
}