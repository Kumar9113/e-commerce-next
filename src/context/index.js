
"use client"
import Cookies from "js-cookie";
import { Cookie } from "next/font/google";
import { createContext, useEffect, useState } from "react";






export const GlobalContext = createContext(null);


export const initialCheckoutFormData = {
    shippingAddress: {},
    paymentMethod: "",
    totalPrice: 0,
    isPaid: false,
    paidAt: new Date(),
    isProcessing: true,
};





export default function GlobalState({ children }) {
    const [showNavModal, setShowNavModal] = useState(false);
    const [cartItems, setCartItems] = useState([]);
    const [pageLevelLoader, setPageLevelLoader] = useState(false)
    const [isAuthUser, setIsAuthUser] = useState(null);
    const [user, setUser] = useState(null);
    const [componentLevelLoader, setComponentLevelLoader] = useState({
        loading: false,
        id: "",
    });
    const [currentUpdatedProduct, setCurrentUpdatedProduct] = useState(null)
    const [showCartModal, setShowCartModal] = useState(false);
    const [addresses, setAddresses] = useState([]);
    const [addressFormData, setAddressFormData] = useState({
        fullName: "",
        city: "",
        country: "",
        postalCode: "",
        address: "",
    });
    const [checkoutFormData, setCheckoutFormData] = useState(
        initialCheckoutFormData
    );
    const [allOrdersForUser, setAllOrdersForUser] = useState([]);
    const [orderDetails, setOrderDetails] = useState(null);
    const [allOrdersForAllUsers, setAllOrdersForAllUsers] = useState([]);

    useEffect(() => {
        if (Cookies.get("token") !== undefined) {
            setIsAuthUser(true);
            const userData = JSON.parse(localStorage.getItem("user")) || {};
            const getCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
            setUser(userData);
            setCartItems(getCartItems);
        } else {
            setIsAuthUser(false);
            setUser({}); //unauthenticated user
        }


    }, [Cookies])



    return (
        <GlobalContext.Provider value={{
            showNavModal, setShowNavModal, pageLevelLoader, setPageLevelLoader, isAuthUser, setIsAuthUser, user, setUser, componentLevelLoader, setComponentLevelLoader, currentUpdatedProduct, setCurrentUpdatedProduct, showCartModal, setShowCartModal, cartItems, setCartItems, addresses, setAddresses, addressFormData, setAddressFormData, checkoutFormData, setCheckoutFormData, allOrdersForUser,
            setAllOrdersForUser,
            orderDetails,
            setOrderDetails,
            allOrdersForAllUsers,
            setAllOrdersForAllUsers
        }}>{children}</GlobalContext.Provider>
    )
}