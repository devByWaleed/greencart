import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";

export const AppContext = createContext()

export const AppContextProvider = ({ children }) => {

    const currency = import.meta.VITE_CURRENCY

    const navigate = useNavigate()
    const [user, setUser] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [showUserLogin, setShowUserLogin] = useState(false)
    const [products, setProducts] = useState([])
    const [cartItems, setCartItems] = useState({})


    // Fetch All Products
    const fetchProducts = async () => {
        setProducts(dummyProducts)
    }

    // Add Product to cart
    const addToCart = async (itemId) => {
        let cardData = structuredClone(cartItems)

        if (cardData[itemId]) {
            cardData[itemId] += 1
        } else {
            cardData[itemId] = 1
        }

        setCartItems(cardData)
        toast.success("Added to cart")
    }


    // Update Cart Item Quantity
    const updateCartItem = (itemId, quantity) => {
        let cardData = structuredClone(cartItems)

        cardData[itemId] = quantity
        setCartItems(cardData)
        toast.success("Cart Updated")
    }


    // Remove Product from Cart
    const removeFromCart = (itemId) => {
        let cardData = structuredClone(cartItems)

        if (cardData[itemId]) {
            cardData[itemId] -= 1
            if (cardData[itemId] === 0) {
                delete cardData[itemId];
            }
        }

        toast.success("Removed from Cart")
        setCartItems(cardData)
    }


    useEffect(() => {
        fetchProducts()
    }, [])


    const value = { navigate, user, setUser, isSeller, setIsSeller, showUserLogin, setShowUserLogin, products, currency, addToCart, updateCartItem, removeFromCart, cartItems }
    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}


export const useAppContext = () => {
    return useContext(AppContext)
}