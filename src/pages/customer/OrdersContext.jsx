import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const OrdersContext = createContext();

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  // Fetch orders from backend instead of localStorage
  const fetchOrders = async () => {
    try {
      // Get user session from backend
      const sessionResponse = await axios.get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
        { withCredentials: true }
      );

      if (!sessionResponse.data.success) {
        setOrders([]);
        return;
      }

      const user_id = sessionResponse.data.user_id;
      const response = await fetch(
        `http://localhost/gearsphere_api/GearSphere-BackEnd/getOrders.php?user_id=${user_id}`,
        { credentials: "include" }
      );
      const data = await response.json();
      if (data.success && Array.isArray(data.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      // Handle authentication errors gracefully for guest users
      if (error.response?.status === 401 || error.status === 401) {
        // User not logged in - this is normal for guest users
        setOrders([]);
        return;
      }
      // Only log non-auth errors to avoid console spam for guest users
      if (error.response?.status !== 401) {
        // Failed to fetch orders for authenticated user
      }
      setOrders([]);
    }
  };

  // Load orders from backend on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  const addOrder = async (orderData) => {
    try {
      // Get user session from backend
      const sessionResponse = await axios.get(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/getSession.php",
        { withCredentials: true }
      );

      if (!sessionResponse.data.success) {
        throw new Error("User not authenticated");
      }

      const user_id = sessionResponse.data.user_id;

      // Create order via backend API
      const response = await axios.post(
        "http://localhost/gearsphere_api/GearSphere-BackEnd/createOrder.php",
        {
          user_id,
          total: orderData.total,
          items: orderData.items,
          shippingAddress: orderData.shippingAddress || "Default Address",
          paymentMethod: orderData.paymentMethod,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        // Refresh orders from backend
        await fetchOrders();
        return (
          response.data.order || {
            id: response.data.order_id,
            date: new Date().toISOString().split("T")[0],
            status: "Processing",
            total: orderData.total,
            items: orderData.items,
            shippingAddress: orderData.shippingAddress || "Default Address",
            paymentMethod: orderData.paymentMethod,
            paymentStatus: "Paid",
          }
        );
      } else {
        throw new Error(response.data.message || "Failed to create order");
      }
    } catch (error) {
      throw error;
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      // Update order status via backend API if needed
      // For now, update local state and refetch
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      // Failed to update order status
    }
  };

  const getOrderById = (orderId) => {
    return orders.find(
      (order) => order.id === orderId || order.order_id === orderId
    );
  };

  const getOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status);
  };

  const value = {
    orders,
    addOrder,
    updateOrderStatus,
    getOrderById,
    getOrdersByStatus,
    fetchOrders,
  };

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};

export { OrdersContext };
