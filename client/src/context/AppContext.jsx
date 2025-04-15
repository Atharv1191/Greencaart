import { createContext,useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { dummyProducts } from "../assets/assets";
import toast from "react-hot-toast";
import axios from "axios"

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const currency = import.meta.env.VITE_CURRENCY;
    const navigate = useNavigate();
    const [user,setUser] = useState(null);
    const [isSeller,setIsSeller] = useState(false);
    const [showUserLogin,setShowUserLogin] = useState(false);
    const [products,setProducts] = useState([]);
    const [cartItems,setCartItems] = useState({})
    const [searchQuery,setSearchQuery] = useState("");

    //fetch seller status
    const fetchSeller = async()=>{
        try {
            const {data} = await axios.get('/api/seller/is-auth');
            if(data.success){
                setIsSeller(true);
            }else{
                setIsSeller(false);
            }
        } catch (error) {
            setIsSeller(false)
            
        }
    }

    //fetch User Auth Status, user Data and cart Items
    const fetchUser = async()=>{
        try {
            const {data} = await axios.get('/api/user/is-auth')
            if(data.success){
                setUser(data.user)
                setCartItems(data.user.cartItems)

            }
        } catch (error) {
            setUser(null)
            
        }
    }

    const fetchProducts  = async()=>{
        try {
            const {data} = await axios.get('/api/product/list')
            if(data.success){
                setProducts(data.products)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            
        }

    }
    // add product to cart
    const addToCart =(itemId)=>{
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            cartData[itemId]+=1
        }else{
            cartData[itemId] = 1
        }
        setCartItems(cartData);
        toast.success("Product added to cart")
    }
    //update cart item quantity

    const updateCartItem = (itemId,quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId] = quantity;
        setCartItems(cartData);
        toast.success("Product quantity updated")
    }
    //remove item from cart
    const removeFromCart = (itemId) => {
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
           cartData[itemId]-=1;
           if(cartData[itemId]=== 0){
            delete cartData[itemId];
           }
        }
        toast.success("Product removed from cart")
        setCartItems(cartData);


    }
    //get cart item count

    const getCartCount = ()=>{
        let totalCount = 0;
        for(const item in cartItems){
            totalCount += cartItems[item]
        }
        return totalCount;
    }
    
    //get cart total amount

    // const getCartAmount = ()=>{
    //    let totalAmount = 0;
    //    for(const items in cartItems){
    //     let iteminfo = products.find((product)=> product._id === items);
    //     if(cartItems[items] > 0){
    //         totalAmount += iteminfo.offerPrice * cartItems[items]
    //     }
    //    }
    //      return Math.floor(totalAmount * 100) / 100;
    // }
    const getCartAmount = () => {
        let totalAmount = 0;
        for (const itemId in cartItems) {
            const itemInfo = products.find(product => product._id === itemId);
    
            if (itemInfo && typeof itemInfo.offerPrice === 'number') {
                totalAmount += itemInfo.offerPrice * cartItems[itemId];
            } else {
                console.warn(`Product with ID ${itemId} not found in product list.`);
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    };
    

    useEffect(()=>{
        fetchUser()
        fetchSeller()
        fetchProducts()
    },[])
    useEffect(() => {
        const updateCart = async () => {
            try {
                const { data } = await axios.post('/api/cart/update', {
                    userId: user._id,  // ✅ Include userId here
                    cartItems
                });
                if (!data.success) {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.message);
            }
        };
    
        if (user) {
            updateCart();
        }
    }, [cartItems]);
    
    const value ={
        navigate,user,setUser,
        isSeller,setIsSeller,
        showUserLogin,setShowUserLogin,products,setProducts,currency,addToCart,updateCartItem,removeFromCart,cartItems,searchQuery,setSearchQuery,getCartAmount,getCartCount,fetchProducts,setCartItems
    }
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}

// ✅ Export the custom hook here
export const useAppContext = () => useContext(AppContext);
