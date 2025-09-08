import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const CartContext = createContext();
const BACKEND_URL = "http://localhost/gearsphere_api/GearSphere-BackEnd/";

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const fetchCart = async () => {
    setLoading(true);
    try {
      // Get user session from backend
      const sessionResponse = await axios.get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
        { withCredentials: true }
      );

      if (!sessionResponse.data.success) {
        setCartItems([]); // Clear cart if no user is logged in
        setLoading(false);
        return;
      }

      const user_id = sessionResponse.data.user_id;
      const response = await axios.get(
        `${BACKEND_URL}getCart.php?user_id=${user_id}`,
        { withCredentials: true }
      );
      if (response.data.success && Array.isArray(response.data.cart)) {
        // Add full image URL to each cart item
        const itemsWithFullImageUrl = response.data.cart.map((item) => ({
          ...item,
          image_url: item.image_url ? `${BACKEND_URL}${item.image_url}` : null,
        }));
        setCartItems(itemsWithFullImageUrl);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      // Handle authentication errors gracefully for guest users
      if (error.response?.status === 401 || error.status === 401) {
        // User not logged in - this is normal for guest users
        setCartItems([]);
        setLoading(false);
        return;
      }
      // Only log non-auth errors to avoid console spam for guest users
      if (error.response?.status !== 401) {
        // Failed to fetch cart for authenticated user
      }
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch cart on initial load or when user_id changes
  useEffect(() => {
    fetchCart();
  }, [location.pathname]);

  const addToCart = async (product) => {
    try {
      // Get user session from backend
      const sessionResponse = await axios.get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
        { withCredentials: true }
      );

      if (!sessionResponse.data.success) {
        alert("Please log in to add items to your cart.");
        return;
      }

      const user_id = sessionResponse.data.user_id;
      await axios.post(
        `${BACKEND_URL}addToCart.php`,
        {
          user_id,
          product_id: product.id,
          quantity: 1,
        },
        { withCredentials: true }
      );
      await fetchCart(); // Refetch cart to update state with the latest data
    } catch (error) {
      // Failed to add to cart
    }
  };

  const removeFromCart = async (productId) => {
    try {
      // Get user session from backend
      const sessionResponse = await axios.get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
        { withCredentials: true }
      );

      if (!sessionResponse.data.success) return;

      const user_id = sessionResponse.data.user_id;
      await axios.post(
        `${BACKEND_URL}removeFromCart.php`,
        {
          user_id,
          product_id: productId,
        },
        { withCredentials: true }
      );
      await fetchCart();
    } catch (error) {
      // Failed to remove from cart
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      // Get user session from backend
      const sessionResponse = await axios.get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
        { withCredentials: true }
      );

      if (!sessionResponse.data.success) return;

      const user_id = sessionResponse.data.user_id;
      await axios.post(
        `${BACKEND_URL}updateCartQuantity.php`,
        {
          user_id,
          product_id: productId,
          quantity: newQuantity,
        },
        { withCredentials: true }
      );
      await fetchCart();
    } catch (error) {
      // Failed to update quantity
    }
  };

  const clearCart = async () => {
    try {
      // Get user session from backend
      const sessionResponse = await axios.get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
        { withCredentials: true }
      );

      if (!sessionResponse.data.success) return;

      const user_id = sessionResponse.data.user_id;
      await axios.post(
        `${BACKEND_URL}clearCart.php`,
        { user_id },
        { withCredentials: true }
      );
      setCartItems([]); // Optimistic update for immediate UI feedback
    } catch (error) {
      // Failed to clear cart
    }
  };

  const getCartTotal = () => {
    return cartItems.reduce(
      (total, item) => total + Number(item.price) * item.quantity,
      0
    );
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  const isInCart = (productId) => {
    return cartItems.some((item) => item.id === productId);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartCount,
    isInCart,
    loading,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export { CartContext };
